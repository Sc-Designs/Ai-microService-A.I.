import sendResult from "../services/resultSend.service.js";
import { evaluateAnswers } from "../services/evaluateAnswer.service.js";
import sendResultIdToUser from "../services/sendingResultToUser.service.js";
import Groq from "groq-sdk";
import {env } from "../config/Zod.cheker.js"

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// ── System prompt — platform persona, hard-locked ─────────────────────────
import SUPPORT_SYSTEM_PROMPT from "../systemPrompts/systemPromptForGroqToSupportPlatform.js";

// ── Existing ───────────────────────────────────────────────────────────────
const getAnswerFromAI = async (req, res) => {
  const { id, answers } = req.body;
  if (!id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid input data." });
  }
  const { evaluations, name } = await evaluateAnswers(id, answers);
  const { resultId } = await sendResult(evaluations, name, id, req.token);
  await sendResultIdToUser(resultId, req.token);
  return res.status(200).json({ message: "Result is Published Now" });
};

// ── Groq Whisper transcription ─────────────────────────────────────────────
const transcribeAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file received" });
  }

  const fileSize = req.file.size ?? req.file.buffer?.length ?? 0;
  if (fileSize > env.MAX_TRANSCRIPTION_LENGTH) {
    return res.status(413).json({
      message: `Audio file is too large. Maximum allowed size is ${env.MAX_TRANSCRIPTION_LENGTH} bytes.`,
    });
  }

  const ext = req.file.mimetype.includes("ogg") ? "ogg" : "webm";
  const audioFile = new File([req.file.buffer], `recording.${ext}`, {
    type: req.file.mimetype,
  });

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: env.TRANSCRIPTION_MODEL,
    language: "en",
    response_format: "json",
  });

  return res.status(200).json({ transcript: transcription.text?.trim() ?? "" });
};

// ── Support Chat ───────────────────────────────────────────────────────────
// Accepts: { message: string, history: [{ role: "user"|"assistant", content: string }] }
// history = last N turns so Neo has context (send max 6-8 from frontend)
const chatWithSupport = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ message: "Message is required." });
  }

  // Sanitize history — only allow valid roles, cap at 10 turns to save tokens
  const safeHistory = history
    .filter(
      (m) =>
        ["user", "assistant"].includes(m.role) && typeof m.content === "string",
    )
    .slice(-env.MAX_CHAT_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, env.MAX_CHAT_MESSAGE_LENGTH),
    }));

  const userMessage = message.trim().slice(0, env.MAX_CHAT_MESSAGE_LENGTH);

  const completion = await groq.chat.completions.create({
    model: env.CHAT_MODEL, // fast & cheap for support chat
    max_tokens: 200, // keep responses short
    temperature: 0.5,
    messages: [
      { role: "system", content: SUPPORT_SYSTEM_PROMPT },
      ...safeHistory,
      { role: "user", content: message.trim().slice(0, 500) },
    ],
  });

  const reply =
    completion.choices[0]?.message?.content?.trim() ??
    "Sorry, I couldn't process that. Try again!";

  return res.status(200).json({ reply });
};

export { getAnswerFromAI, transcribeAudio, chatWithSupport };
