# AlphaResearch: AI Investment Platform

## Overview
AlphaResearch is an institutional-grade AI investment research platform designed to automate deep fundamental analysis. It utilizes an autonomous multi-agent workflow to scrape real-time market news, parse financial data, and synthesize a comprehensive, professionally formatted Investment Committee Memorandum for any public equity in seconds. The UI is designed with a premium, timeless editorial aesthetic (inspired by Steward Wealth) to reflect its institutional target audience.

## How to run it

### Prerequisites
- Node.js 18+ 
- Google Gemini API Key
- Tavily AI API Key (for web scraping/search)

### Setup Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the root directory and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_key
   TAVILY_API_KEY=your_tavily_key
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

## How it works (Architecture)
AlphaResearch is built on a modern, edge-ready tech stack:
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes.
- **AI Orchestration**: LangGraph and `@langchain/google-genai`.
- **Data Gathering**: Tavily Search API.

**The Workflow:**
When a user searches for a ticker, the frontend opens a Server-Sent Events (SSE) connection to the `/api/research` route. 
The route triggers a **LangGraph state machine** consisting of specialized agent nodes:
1. **Query Generation**: Breaks down the ticker into specialized search vectors.
2. **Data Ingestion**: Gathers real-time news, sentiment, and fundamental data.
3. **Synthesis**: An LLM agent debates risk factors against growth potential using the ingested data.
4. **Report Assembly**: Formats the synthesized data into a structured Markdown report and generates a final BUY/HOLD/SELL verdict.

The backend streams both the agent state logs (for the UI loading animation) and the final report back to the client in real-time.

## Key decisions & trade-offs
- **Decision: LangGraph over raw LLM calls.** 
  *Why*: Financial analysis requires multi-step reasoning (e.g., fetch data -> evaluate risk -> write report). LangGraph provides state management and deterministic routing between these steps, which is impossible with a single prompt.
- **Decision: Google Gemini 2.5 Flash.**
  *Why*: Financial documents and combined news contexts are massive. Gemini 2.5 Flash offers a massive context window and extremely fast inference times, which is critical for a responsive UI.
- **Decision: Server-Sent Events (SSE) for Streaming.**
  *Why*: Deep research takes 15-30 seconds. Standard HTTP requests would timeout or cause a poor UX. SSE allows us to stream the agent's internal logs to the UI, keeping the user engaged.
- **Trade-off: Search API vs. Direct SEC EDGAR Scraping.**
  *Why*: We used Tavily for rapid aggregation of news and basic financials. With more time, building a direct pipeline into the SEC EDGAR database for 10-K/10-Q XBRL parsing would yield much deeper financial ratio accuracy, but requires significantly more complex data cleaning.

## Example runs
### AAPL (Apple Inc.)
* **Verdict:** HOLD
* **Analysis Excerpt:** "Apple continues to demonstrate exceptional resilience in its Services segment (reaching record high margins), which effectively offsets cyclical hardware downswings in the iPhone and Mac divisions. However, current valuation multiples (P/E ~30x) price in perfection, and regulatory scrutiny in the EU and US regarding the App Store presents a medium-term structural risk..."

### PLTR (Palantir Technologies)
* **Verdict:** INVEST
* **Analysis Excerpt:** "Palantir's AIP (Artificial Intelligence Platform) bootcamps are driving unprecedented commercial revenue acceleration, successfully diversifying the company away from its historical reliance on lumpy government contracts. With a pristine balance sheet (no debt) and accelerating GAAP profitability, the premium valuation is justified by its widening moat in enterprise AI ontology..."

## What you would improve with more time
1. **Authentication & Database**: Integrate Clerk for auth and Supabase (PostgreSQL) to persist generated reports, allowing users to build long-term watchlists and portfolio tracking.
2. **Interactive Financial Charts**: Instead of just outputting Markdown, the AI could generate structured JSON data containing historical financial ratios, which the frontend would render as interactive Recharts graphs.
3. **PDF Export**: Implement `puppeteer` or `jspdf` on the backend to allow users to download the Investment Memorandums directly as branded PDF documents.
4. **Direct SEC Integration**: Bypass search APIs and connect directly to the SEC EDGAR API for pixel-perfect financial extraction.

---
**Note:** The complete LLM Chat Transcript for this project build is included in the root directory as `llm_chat_transcript.jsonl`.
