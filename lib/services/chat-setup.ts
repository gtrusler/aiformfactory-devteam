import { supabase } from "@/lib/supabase/client";

export async function setupDefaultSpeakers() {
  const defaultSpeakers = [
    {
      id: "user",
      name: "User",
      type: "human",
      metadata: {
        role: "user",
        avatar: null
      }
    },
    {
      id: "AI",
      name: "AI Assistant",
      type: "assistant",
      metadata: {
        role: "assistant",
        avatar: null
      }
    },
    {
      id: "PM",
      name: "Project Manager",
      type: "assistant",
      metadata: {
        role: "assistant",
        avatar: null
      }
    },
    {
      id: "DEV",
      name: "Senior Developer",
      type: "assistant",
      metadata: {
        role: "assistant",
        avatar: null
      }
    }
  ];

  try {
    // Insert default speakers if they don't exist
    const { error } = await supabase
      .from("chat_speakers")
      .upsert(defaultSpeakers, { 
        onConflict: "id",
      });

    if (error) {
      console.error("Error setting up default speakers:", error);
      throw error;
    }

    console.log("Default speakers set up successfully");
  } catch (error) {
    console.error("Failed to set up default speakers:", error);
    throw error;
  }
}
