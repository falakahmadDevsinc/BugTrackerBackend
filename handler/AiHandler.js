import { generateContent } from "../services/AiService.js";

export const getGeminiResponse = async (req, res) => {
  const {
    userMessage,
    projectId,
    bugDetails,
    type,
    bugId,
    bugTitle,
    bugStatus,
    isGlobal,
    projectContext,
  } = req.body;

  if (!userMessage)
    return res.status(400).json({ message: "User message is required" });

  // Build a more context-aware prompt
  let prompt = "";

  if (isGlobal) {
    // Global assistant mode
    prompt += `You are an AI assistant for a bug tracking application called BugTracker.\n\n`;

    if (projectContext) {
      prompt += `CURRENT PROJECT CONTEXT:\n`;
      prompt += `Project Name: ${projectContext.name}\n`;
      if (projectContext.description) {
        prompt += `Project Description: ${projectContext.description}\n`;
      }
      prompt += `\n`;
    }

    if (bugDetails) {
      prompt += `BUG/FEATURE CONTEXT:\n${bugDetails}\n\n`;
    }

    prompt += `USER QUESTION: ${userMessage}\n\n`;
    prompt += `Please provide a helpful response about this ${
      projectContext ? "project" : "bug tracking system"
    }. 
    Focus your answer on software development, bug tracking, and project management concepts.`;
  } else {
    // Original bug-specific logic
    if (bugDetails) {
      prompt += `You are an AI assistant helping with a ${type} in a bug tracking system.\n\n`;
      prompt += `CONTEXT INFORMATION:\n${bugDetails}\n\n`;

      if (bugId) {
        prompt += `This is for ${type} ID: ${bugId}\n`;
      }

      if (bugTitle) {
        prompt += `Title: "${bugTitle}"\n`;
      }

      if (bugStatus) {
        prompt += `Current status: ${bugStatus}\n`;
      }

      prompt += `Project ID: ${projectId}\n\n`;
      prompt += `USER QUESTION: ${userMessage}\n\n`;

      // Add specific guidelines based on type
      if (type === "bug") {
        prompt += `Please provide a helpful, technical response about this bug. Consider potential causes, debugging approaches, or solutions. Be specific and practical.\n`;
      } else if (type === "feature") {
        prompt += `Please provide implementation suggestions, design considerations, or best practices for this feature. Be specific and practical.\n`;
      }
    } else {
      // Fallback for when no bug details are provided
      prompt = `You're a helpful assistant for a bug tracking system. User is asking about a ${type} in project ${projectId}.\n\nUser question: ${userMessage}`;
    }
  }

  try {
    const data = await generateContent(prompt);
    res.json(data);
  } catch (error) {
    console.error("AI API error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
