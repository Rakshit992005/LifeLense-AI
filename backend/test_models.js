import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  try {
    console.log("Fetching models...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      for (const m of data.models) {
        console.log(m.name, "-", m.displayName);
      }
    } else {
      console.log("Unexpected response:", data);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
