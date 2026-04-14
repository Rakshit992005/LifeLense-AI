import Tesseract from "tesseract.js";

export const extractTextFromImage = async (filePath) => {
  try {
    const { data } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m.status), // optional logs
    });

    return data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("OCR failed");
  }
};