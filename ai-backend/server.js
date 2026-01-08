import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("KEY:", process.env.OPENAI_API_KEY);

app.post("/ask", async (req, res) => {
  const { question, pageText, url } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful website navigation assistant."
        },
        {
          role: "user",
          content: `
Website URL: ${url}

Website Content:
${pageText}

User Question:
${question}
          `
        }
      ],
      max_tokens: 200
    });

    res.json({
      answer: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3000, () => {
  console.log("AI backend running on http://localhost:3000");
});
