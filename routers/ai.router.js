import express from 'express';
import tryCatch from '../utils/tryCatch.js';
import { getAnswerFromAI } from '../controllers/ai.controller.js';
import isUserLoggedIn from "../middleware/ai.middleware.js";
const router = express.Router();

router.post("/test-feddback",isUserLoggedIn, tryCatch(getAnswerFromAI));

export default router;