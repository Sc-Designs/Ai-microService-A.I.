import express from "express";
import multer from "multer";
import tryCatch from "../utils/tryCatch.js";
import {
  getAnswerFromAI,
  transcribeAudio,
  chatWithSupport,
} from "../controllers/ai.controller.js";
import isUserLoggedIn from "../middleware/ai.middleware.js";

const router = express.Router();

// Memory storage — audio never touches disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB Groq hard limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) cb(null, true);
    else cb(new Error("Only audio files are allowed"));
  },
});

router.post("/test-feddback", isUserLoggedIn, tryCatch(getAnswerFromAI));
router.post(
  "/transcribe",
  isUserLoggedIn,
  upload.single("audio"),
  tryCatch(transcribeAudio),
);

router.post("/support-chat", tryCatch(chatWithSupport));
export default router;
