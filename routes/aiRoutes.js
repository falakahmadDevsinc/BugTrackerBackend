import express from "express";
import { getGeminiResponse } from "../handler/AiHandler.js";

const AIResponsesRouter = express.Router();

AIResponsesRouter.post("/generate", getGeminiResponse);

export default AIResponsesRouter;
