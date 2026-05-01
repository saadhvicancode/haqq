# Localhost Troubleshooting — Haqq Dev Server

## The fix that worked
Open a **real Terminal window**, `cd` into the project, and run:
```bash
cd ~/Desktop/Projects/haqq
npm run dev
```
Keep that terminal open. Go to `http://localhost:3001`.

---

## Why it breaks and how to fix each case

### 1. "Safari Can't Connect to the Server"
**Cause:** The dev server isn't running at all, or it died.  
**Fix:** Open Terminal, run `npm run dev`, keep the window open. Don't close it.

### 2. `EADDRINUSE: address already in use :::3001`
**Cause:** A previous dev server process (or a zombie background process) is still holding port 3001.  
**Fix:** Kill whatever is on the port, then restart:
```bash
lsof -ti :3001 | xargs kill -9
npm run dev
```

### 3. Server starts but page won't load / blank page
**Cause:** Usually a compilation error. Check the terminal where `npm run dev` is running for red error output.  
**Fix:** Read the error in the terminal and fix the code issue.

---

## Key things to know

- **Always run `npm run dev` in your own Terminal window** — not through Claude Code's background commands. Background processes die when the session ends.
- Port `3001` is baked into `package.json` (`"dev": "next dev -p 3001"`), so plain `npm run dev` is enough.
- If in doubt: kill the port first, then start fresh.
