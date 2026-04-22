# Haqq

Haqq ("right" and "truth" in Hindi/Urdu) is a warm, honest legal rights chatbot for women in India. It helps women understand their legal rights in plain language and tells them exactly what they can do next.

## Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd haqq
   npm install
   ```

2. **Add your API key**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Anthropic API key
   ```
   Get a key at: https://console.anthropic.com

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Extending the system prompt

All legal knowledge lives in `lib/systemPrompt.ts`. To add coverage for a new area of law:

1. Open `lib/systemPrompt.ts`
2. Add a new section following the existing pattern:
   ```
   NEW AREA — Act Name (Year):
   - Key right or protection
   - Who it applies to
   - What relief is available
   - How to file / where to go
   - Relevant helpline
   ```
3. If it's a new topic card on the landing page, add it to the `topics` array in `app/page.tsx`

## Adding a new topic card

In `app/page.tsx`, add an entry to the `topics` array:
```ts
{
  icon: "⚖️",
  title: "Your Topic",
  description: "Short description of what this covers.",
  topic: "keyword for topic context",
}
```

---

> **Note:** This is v1 — legal content should be reviewed by a qualified lawyer before public deployment. Laws and procedures vary by state. Haqq is a guide, not a substitute for legal representation. For free legal aid, refer users to [NALSA](https://nalsa.gov.in).
