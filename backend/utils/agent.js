export const analyzeWithAgent = async (text) => {
    if (!text || text.trim().length === 0) {
        return "No text provided for analysis.";
    }

    const prompt = `You are an expert medical AI assistant. Analyze the following medical report text and provide: 1) Report type, 2) Key findings, 3) Any abnormal values with explanation, 4) Risk level (Low/Moderate/High), 5) Recommendations. Be concise and structured.\n\nMedical Report Text:\n${text}`;

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "alibayram/medgemma:4b",
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API responded with status ${response.status}`);
        }
        console.log("Response from local Ollama API:", response);

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error communicating with local Ollama API:", error);
        throw new Error("Failed to get analysis from local AI model.");
    }
};
