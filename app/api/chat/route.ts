import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

// Initialize Supabase client with service role key
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
    const { message, threadId, agentId = "AI" } = await req.json();
    console.log("Received request:", { threadId, agentId, messageLength: message?.length });

    if (!message || !threadId) {
      return NextResponse.json(
        { error: "Message and threadId are required" },
        { status: 400 }
      );
    }

    // Get the appropriate prompt for the selected agent
    const systemPrompt = AGENT_PROMPTS[agentId as keyof typeof AGENT_PROMPTS] || AGENT_PROMPTS["AI"];

    try {
      console.log("Calling OpenAI API...");
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
      console.log("OpenAI API call successful");

      // Extract the response
      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

      // First, ensure the agent speaker exists
      const { error: speakerError } = await supabaseServer
        .from("chat_speakers")
        .upsert({
          id: agentId,
          name: agentId,
          type: "assistant",
          metadata: {
            role: "assistant",
            avatar: null,
          },
        });

      if (speakerError) {
        console.error("Error ensuring agent speaker:", speakerError);
        throw speakerError;
      }

      // Save AI response
      const { error: messageError } = await supabaseServer
        .from("chat_histories")
        .insert({
          id: uuidv4(),
          message: response,
          speaker_id: agentId,
          thread_id: threadId,
          metadata: {},
        });

      if (messageError) {
        console.error("Error saving AI response:", messageError);
        throw messageError;
      }

      return NextResponse.json({ response });
    } catch (error) {
      console.error("OpenAI API or database error:", error);
      return NextResponse.json(
        { error: "Failed to generate or save AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
