@AGENTS.md

# Haqq — Project Context

## What this is
A Next.js 16 streaming chat app — an AI-powered legal guide for women in India. The chatbot is named "Haqq" (meaning "right/truth" in Urdu/Hindi). It helps users understand their legal rights in plain language across multiple Indian languages.

## Stack
- **Framework**: Next.js 16.2.4 (App Router, Turbopack) — see AGENTS.md before touching Next.js APIs
- **AI**: Google Gemini 2.5 Flash via `@google/genai` SDK (switched from Anthropic)
- **Styling**: Tailwind CSS v4
- **Markdown**: react-markdown with @tailwindcss/typography
- **Dev port**: 3001 (`npm run dev -- -p 3001`)

## Key files
- `app/api/chat/route.ts` — Gemini streaming API route with retry logic (3 attempts, 1.5s/3s delays for 503s)
- `lib/systemPrompt.ts` — Full system prompt; defines tone, laws covered, languages, and response format
- `app/chat/page.tsx` — Main chat UI with streaming, abort, clear confirm, and typing indicator
- `components/ChatBubble.tsx` — Renders user/assistant bubbles with markdown support
- `components/TypingIndicator.tsx` — Bouncing dots shown while waiting for response
- `components/PanicButton.tsx` — Emergency exit button
- `app/page.tsx` — Landing/topic selection page

## Environment
- `.env.local` requires `GEMINI_API_KEY`
- Model: `gemini-2.5-flash` (free tier ~1500 req/day)
- `gemini-2.0-flash-lite` and `gemini-2.0-flash` are quota-exhausted on this key — do not switch back

## Languages supported
Hindi, English, Hinglish, Urdu, Bengali, Marathi, Tamil, Telugu, Gujarati, Punjabi, Kannada. Model responds in whatever language the user writes in.

## Laws covered in system prompt
DV Act 2005, POSH Act 2013, Hindu Marriage Act, Muslim Women Protection Act 2019, Hindu Succession Act, IPC/BNS cyber harassment sections, Section 125 CrPC maintenance, NALSA free legal aid.

## Known issues / history
- `gemini-2.0-flash-lite` was original model but hit free tier quota (limit:0 errors)
- Switched to `gemini-2.5-flash` which works but occasionally 503s under load — retry logic handles this
- System prompt explicitly forbids "beti"/"beta" terms of address (model was generating them)
- Typing indicator now shows immediately on send (not just after first chunk)

## GitHub
Repo: https://github.com/saadhvicancode/haqq
Push every 3-4 conversation turns to keep remote in sync.

## Workflow notes
- User wants code pushed to GitHub every 3-4 prompts
- Always run dev server on port 3001
