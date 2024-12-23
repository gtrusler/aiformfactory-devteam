# AI Form Factory

## Goals

- Create an AI-powered chat interface with multiple agent personas
- Enable real-time communication with AI agents
- Support file uploads and document processing
- Provide context-aware responses
- Maintain high performance and reliability

## Tech Stack

### Frontend

- Next.js 14.2.21
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui components

### Backend

- Supabase (Database & Real-time)
- OpenAI API
- Next.js API Routes

### Infrastructure

- Vercel (planned)
- Supabase Cloud

## Resources and URLs

- OpenAI API Documentation: https://platform.openai.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs

## Environment Setup

```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# Development
npm run dev

# Build
npm run build
```

## Current Status

- Basic chat functionality implemented
- AI agent integration working
- Real-time updates need fixing
- File upload UI ready, functionality pending

## Next Milestone

- Fix real-time message updates
- Implement file upload functionality
- Add proper error handling
- Enhance agent responses
