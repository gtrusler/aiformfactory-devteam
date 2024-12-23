-- Create the n8n_chat_histories table
CREATE TABLE IF NOT EXISTS "public"."n8n_chat_histories" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "thread_id" text NOT NULL,
    "speaker_id" text NOT NULL,
    "message" text NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_histories_thread_id ON public.n8n_chat_histories(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_created_at ON public.n8n_chat_histories(created_at);

-- Set up RLS (Row Level Security)
ALTER TABLE "public"."n8n_chat_histories" ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON TABLE "public"."n8n_chat_histories" TO "authenticated";
GRANT ALL ON TABLE "public"."n8n_chat_histories" TO "service_role";

-- Create policies
CREATE POLICY "Allow authenticated users to read chat histories"
ON "public"."n8n_chat_histories"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert chat messages"
ON "public"."n8n_chat_histories"
FOR INSERT
TO authenticated
WITH CHECK (true); 