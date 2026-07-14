import { fetchTestQuestions } from "./fetchTestQuestions.service.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/Zod.cheker.js"

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const evaluateAnswers = async (testId, userAnswers) => {
  try {
    const { name, questions } = await fetchTestQuestions(testId); 

    const combined = userAnswers.map((userQ) => {
      const originalQ = questions.find(
        (q) => q._id.toString() === userQ.questionId
      );

      return {
        questionId: userQ.questionId,
        questionText: originalQ?.questionText,
        correctAnswer: originalQ?.correctAnswer,
        userAnswer: userQ.answer,
        type: originalQ?.type,
      };
    });

    const evaluations = await Promise.all(
      combined.map(async (q) => {
        if (q.type === "mcq") {
          const isCorrect = q.userAnswer === q.correctAnswer;
          return {
            ...q,
            score: isCorrect ? 10 : 0,
            feedback: isCorrect ? "Correct answer." : "Incorrect answer.",
          };
        }

        const prompt = `Evaluate the following answer for correctness on a scale of 0 to 10.\n\nQuestion: ${q.questionText}\nCorrect Answer: ${q.correctAnswer}\nUser Answer: ${q.userAnswer}\n\nRespond in this JSON format:\n{\n  "score": <number>,\n  "feedback": "your feedback here"\n}`;

        try {
          const result = await model.generateContent(prompt);
          const responseText = await result.response.text();
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          const parsed = jsonMatch
            ? JSON.parse(jsonMatch[0])
            : { score: 0, feedback: "Could not parse evaluation." };

          return {
            ...q,
            score: parsed.score || 0,
            feedback: parsed.feedback || "No feedback given.",
          };
        } catch (err) {
          console.error("Gemini Evaluation Failed:", err);
          return {
            ...q,
            score: 0,
            feedback: "Evaluation error occurred.",
          };
        }
      })
    );

    return {evaluations, name};
  } catch (error) {
    console.error("Error in evaluating answers:", error);
    throw error;
  }
};
