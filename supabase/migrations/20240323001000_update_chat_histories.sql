-- First, drop the existing table
DROP TABLE IF EXISTS "public"."n8n_chat_histories";
DROP TABLE IF EXISTS "public"."chat_histories";

-- Create the new table with the correct schema
CREATE TABLE "public"."chat_histories" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "thread_id" text NOT NULL,
    "speaker_id" text NOT NULL,
    "message" text NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_histories_thread_id ON public.chat_histories(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_created_at ON public.chat_histories(created_at);

-- Set up RLS (Row Level Security)
ALTER TABLE "public"."chat_histories" ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users and anonymous users
GRANT ALL ON TABLE "public"."chat_histories" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_histories" TO "service_role";
GRANT ALL ON TABLE "public"."chat_histories" TO "anon";

-- Create policies that allow all operations for testing
CREATE POLICY "Allow full access to chat histories"
ON "public"."chat_histories"
FOR ALL
USING (true)
WITH CHECK (true); 