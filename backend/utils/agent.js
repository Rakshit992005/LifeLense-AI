export const preprocessReport = (text) => {
    const lowerText = text.toLowerCase();
    let reportType = "general";
    
    if (/(hemoglobin|rbc|wbc|platelets|hematocrit)/.test(lowerText)) {
        reportType = "blood";
    } else if (/(cholesterol|triglycerides|hdl|ldl|vldl|lipid)/.test(lowerText)) {
        reportType = "lipid";
    } else if (/(glucose|hba1c|insulin|fasting)/.test(lowerText)) {
        reportType = "diabetes";
    } else if (/(mg|tablet|capsule|dosage|rx|prescribed)/.test(lowerText)) {
        reportType = "prescription";
    }

    const extractedValues = [];
    const regex = /([^,\n:]+?)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL|g\/dL|%|mmol\/L)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
        let name = match[1].trim();
        const words = name.split(/\s+/);
        if (words.length > 4) {
            name = words.slice(-4).join(' ');
        }
        extractedValues.push({
            name: name,
            value: match[2],
            unit: match[3]
        });
    }

    let displayType = reportType.charAt(0).toUpperCase() + reportType.slice(1);
    if (reportType === 'lipid') displayType = 'Lipid Profile';
    if (reportType === 'blood') displayType = 'Blood Report';
    if (reportType === 'diabetes') displayType = 'Diabetes Report';
    if (reportType === 'prescription') displayType = 'Prescription';

    const promptValues = extractedValues.map(v => `- ${v.name}: ${v.value} ${v.unit}`).join('\n');

    const structuredPrompt = `You are an expert medical AI assistant. Analyze the medical report and respond ONLY with a valid JSON object, no extra text, no markdown backticks. Use this exact structure:
{
  "reportType": "${displayType}",
  "summary": "2-3 sentence plain English summary of the overall report",
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "riskReason": "One sentence explaining why this risk level was assigned",
  "keyValues": [
    { "name": "Total Cholesterol", "value": "100", "unit": "mg/dL", "status": "Normal" | "Borderline" | "High" | "Low" | "Critical" }
  ],
  "criticalFindings": ["finding 1", "finding 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Report Type: ${displayType}
Extracted Values:
${promptValues}

Full Report Text: ${text}`;

    return {
        preprocessResult: { reportType, extractedValues },
        structuredPrompt
    };
};

export const checkCriticalValues = (extractedValues) => {
    const criticalAlerts = [];
    
    for (const item of extractedValues) {
        const name = item.name.toLowerCase();
        const value = parseFloat(item.value);
        if (isNaN(value)) continue;

        if (name.includes("hemoglobin") && value < 7) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Severe Anemia - Immediate medical attention required", severity: "CRITICAL" });
        } else if (name.includes("glucose") && value > 400) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically High Blood Sugar - Emergency risk", severity: "CRITICAL" });
        } else if (name.includes("glucose") && value < 50) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically Low Blood Sugar - Emergency risk", severity: "CRITICAL" });
        } else if ((name.includes("total cholesterol") || name === "cholesterol") && value > 280) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Very High Cholesterol - High cardiovascular risk", severity: "CRITICAL" });
        } else if (name.includes("triglycerides") && value > 500) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically High Triglycerides - Pancreatitis risk", severity: "CRITICAL" });
        } else if (name.includes("hdl") && value < 25) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically Low HDL - High cardiovascular risk", severity: "CRITICAL" });
        } else if (name.includes("platelets") && value < 50000) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically Low Platelets - Bleeding risk", severity: "CRITICAL" });
        } else if (name.includes("wbc") && value > 30000) {
            criticalAlerts.push({ parameter: item.name, value: item.value + " " + item.unit, message: "Critically High WBC - Possible infection or malignancy", severity: "CRITICAL" });
        }
    }
    
    return criticalAlerts;
};

export const analyzeWithAgent = async (text) => {
    if (!text || text.trim().length === 0) {
        return { analysis: "No text provided for analysis.", preprocessResult: null, criticalAlerts: [] };
    }

    const { preprocessResult, structuredPrompt } = preprocessReport(text);
    const criticalAlerts = checkCriticalValues(preprocessResult.extractedValues);

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "alibayram/medgemma:4b",
                prompt: structuredPrompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API responded with status ${response.status}`);
        }
        console.log("Response from local Ollama API:", response);

        const data = await response.json();
        
        let analysisResult;
        try {
            let rawText = data.response.trim();
            if (rawText.startsWith('```json')) {
                rawText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            } else if (rawText.startsWith('```')) {
                rawText = rawText.replace(/^```\n?/, '').replace(/\n?```$/, '');
            }
            analysisResult = JSON.parse(rawText);
        } catch (e) {
            console.error("Failed to parse JSON from AI response:", e);
            analysisResult = { rawAnalysis: data.response };
        }

        return {
            analysis: analysisResult,
            preprocessResult,
            criticalAlerts
        };
    } catch (error) {
        console.error("Error communicating with local Ollama API:", error);
        throw new Error("Failed to get analysis from local AI model.");
    }
};

export const generateEnvironmentAdvisory = (analysisResult, environmentData) => {
    const advisories = [];
    if (!analysisResult || !environmentData) return advisories;

    const { reportType, criticalFindings, summary } = analysisResult;
    const { aqi, temperature, humidity, cityName } = environmentData;

    const summaryText = (summary || "").toLowerCase();
    const findingsText = (criticalFindings || []).join(" ").toLowerCase();
    const combinedText = summaryText + " " + findingsText;

    // RESPIRATORY CONDITIONS
    if (/(asthma|bronchitis|lung|respiratory|copd|infection|pneumonia|chest|breathing)/.test(combinedText)) {
        if (aqi >= 4) {
            advisories.push({ level: "critical", message: `🚨 Your respiratory condition is at HIGH RISK today. Air quality is Poor/Hazardous in ${cityName}. Stay indoors, keep windows closed, and wear an N95 mask if you must go outside.` });
        } else if (aqi === 3) {
            advisories.push({ level: "warning", message: `⚠️ Moderate air quality may aggravate your respiratory condition. Limit outdoor activity and keep your medication/inhaler handy.` });
        }
    }

    // DIABETES CONDITIONS
    if (/(diabetes|glucose|hba1c|insulin|blood sugar)/.test(combinedText)) {
        if (temperature > 38) {
            advisories.push({ level: "warning", message: `🌡️ High temperature today in ${cityName} can affect blood sugar levels. Stay hydrated, avoid outdoor activity between 12–4 PM, and monitor glucose more frequently.` });
        }
        if (humidity > 80) {
            advisories.push({ level: "info", message: `💧 High humidity increases infection risk for diabetic patients. Keep wounds dry and watch for skin issues.` });
        }
    }

    // CARDIOVASCULAR CONDITIONS
    if (/(cholesterol|ldl|cardiac|cardiovascular|heart)/.test(combinedText)) {
        if (aqi >= 4) {
            advisories.push({ level: "critical", message: `🚨 Hazardous air quality significantly increases cardiovascular risk for you today. Do NOT exercise outdoors. Stay indoors with air purification if possible.` });
        }
        if (temperature < 10) {
            advisories.push({ level: "warning", message: `🥶 Cold weather increases blood pressure and heart attack risk. Layer up well and avoid sudden physical exertion outdoors.` });
        }
    }

    // ANEMIA CONDITIONS
    if (/(anemia|hemoglobin|iron deficiency)/.test(combinedText)) {
        if (temperature > 35) {
            advisories.push({ level: "warning", message: `☀️ Your anemia reduces your body's ability to handle heat. Avoid direct sun, stay hydrated, and rest frequently if outdoors in ${cityName}.` });
        }
    }

    // GENERAL ADVISORIES
    if (aqi === 4) {
        advisories.push({ level: "warning", message: `😷 Air quality is Poor in ${cityName} today. Everyone should wear a mask outdoors.` });
    } else if (aqi === 5) {
        advisories.push({ level: "critical", message: `🏠 STAY HOME: Air quality is Hazardous in ${cityName}. Avoid all outdoor activity today.` });
    }

    return advisories;
};
