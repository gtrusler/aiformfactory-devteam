import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AGENT_PROMPTS = {
  AI: "You are a helpful AI assistant focused on providing clear and accurate information.",
  PM: "You are a Project Manager focused on project planning, coordination, and delivery.",
  DEV: "You are a Senior Developer focused on technical implementation, code quality, and best practices.",
};

export async function POST(req: NextRequest) {
  try {
    const { message, agentId, threadId } = await req.json();

    // Get the appropriate prompt for the selected agent
    const systemPrompt =
      AGENT_PROMPTS[agentId as keyof typeof AGENT_PROMPTS] ||
      AGENT_PROMPTS["AI"];

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the response
    const response =
      completion.choices[0]?.message?.content ||
      "I apologize, but I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
