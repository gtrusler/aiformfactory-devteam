-- Create chat speaker type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_speaker_type') THEN
        CREATE TYPE chat_speaker_type AS ENUM ('human', 'assistant', 'system');
    END IF;
END
$$;

-- Create chat_speakers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_speakers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type chat_speaker_type NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to chat_histories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'chat_histories_speaker_id_fkey'
    ) THEN
        ALTER TABLE public.chat_histories
        ADD CONSTRAINT chat_histories_speaker_id_fkey
        FOREIGN KEY (speaker_id)
        REFERENCES public.chat_speakers(id)
        ON DELETE CASCADE;
    END IF;
END
$$;
