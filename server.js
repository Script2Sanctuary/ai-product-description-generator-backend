import express from "express";
import cors from "cors";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

app.get("/", (req, res) => {
  res.send("Welcome to Gemini API");
});

app.post("/api/generate-description", async (req, res) => {
  const { productName } = req.body;

  try {
    const prompt = `Kamu asisten yang sangat membantu bagi saya untuk membuat deskripsi produk. Tuliskan deskripsi produk secara detail untuk produk yang bernama "${productName}". Berikan deskripsi produk tanpa menggunakan sytle yang berlebihan, cukup gunakan teks polosan saja tanpa ada *** jika ada point point gunakan angka.`;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    res.json({ description: response.text() });
  } catch (error) {
    console.error("Error generating description:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
