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

    const structuredPrompt = `Report Type: ${displayType}
Extracted Values:
${promptValues}

Full Report Text: ${text}
Please analyze this medical report and provide: 1) Key findings, 2) Abnormal values with explanation, 3) Risk level (Low/Moderate/High), 4) Recommendations.`;

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
        return {
            analysis: data.response,
            preprocessResult,
            criticalAlerts
        };
    } catch (error) {
        console.error("Error communicating with local Ollama API:", error);
        throw new Error("Failed to get analysis from local AI model.");
    }
};
