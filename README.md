# AlphaResearch

An autonomous AI investment research agent that continuously aggregates market data, historical stock prices, and real-time news to generate institutional-grade equity research reports and binary investment decisions.

## Live Demo

[View Live Demo on Vercel](https://alpha-research-opal.vercel.app)

## Features

- **Autonomous Agentic Workflow**: Uses LangGraph to orchestrate a multi-step investment research pipeline, including ticker resolution, financial data retrieval, news aggregation, analysis, and investment decision-making.
- **Real-Time Data Streaming**: Streams AI-generated investment research reports to the frontend using Server-Sent Events (SSE) for a smooth, responsive user experience.
- **Institutional-Grade Research Reports**: Generates structured investment research reports grounded in retrieved financial data and recent news while maintaining a consistent institutional-style format.
- **Multi-Source Data Aggregation**: Combines structured financial data from Yahoo Finance with the latest Google News RSS articles to deliver comprehensive market insights.
- **Deterministic Sentiment Analysis**: Performs native sentiment analysis using AFINN lexicons before LLM inference, reducing sentiment inconsistencies and improving report quality.
- **Resilient Multi-LLM Fallback**: Automatically switches between Google Gemini, OpenAI, and Hugging Face models to ensure uninterrupted report generation during rate limits or API failures.
- **Interactive Stock Visualization**: Displays recent stock price trends using interactive charts for quick visual analysis of market performance.
- **Investment Decision Engine**: Produces a binary **INVEST** or **PASS** recommendation with a confidence score, supporting rationale, and key investment highlights.
- **PDF Report Export**: Generates and downloads a professionally formatted PDF version of the investment research report for offline viewing and sharing.
- **Production-Ready Deployment**: Fully deployed on Vercel, providing fast, scalable, and reliable access to institutional-grade research.

## Tech Stack

- **Language**: TypeScript
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Recharts
- **Backend**: Next.js App Router (API Routes)
- **AI Framework**: LangGraph.js, LangChain.js
- **LLM Providers**: Google Gemini (gemini-2.5-flash), OpenAI, Hugging Face
- **External APIs**: Yahoo Finance API (yahoo-finance2), Google News RSS

## Overview

AlphaResearch is an autonomous AI-powered investment research agent designed to replicate the analytical rigor of an institutional equity research analyst. It combines structured financial data, real-time market news, deterministic sentiment analysis, and LLM-powered reasoning to generate comprehensive investment research reports and binary **INVEST** or **PASS** recommendations.

By grounding the analysis in retrieved financial data, recent news, and deterministic data pipelines, the agent reduces hallucinations, improves factual consistency, and delivers transparent, evidence-based investment insights while maintaining an institutional-style reporting format.

## Architecture

User
   │
   ▼
Ticker Resolver
   │
   ▼
Yahoo Finance ─────────► Financial Data
   │
Google News RSS ───────► News Articles
   │
   ▼
Sentiment Analysis
   │
   ▼
LangGraph Workflow
   │
   ▼
Gemini
   │
(OpenAI Fallback)
   │
(Hugging Face Fallback)
   │
   ▼
Investment Decision
   │
   ▼
Interactive Dashboard

## How to Run

### Installation

1. Clone the repository:
```bash
git clone https://github.com/misty4040/AlphaResearch.git
cd AlphaResearch
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the required API keys. See the section below for details.

### Running locally

Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Environment Variables

The application requires at least one LLM API key to function.

```env
GEMINI_API_KEY=your_gemini_api_key
HUGGING_FACE_API_KEY=your_hugging_face_api_key
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## How It Works

* **Ticker Resolution**: A lightweight agent node verifies user input and converts company names (e.g., "Apple") into valid Yahoo Finance ticker symbols (e.g., "AAPL").
* **Financial Data Retrieval**: Connects to the Yahoo Finance API to fetch the current price, 52-week ranges, trading volume, and short-term historical price arrays.
* **News Retrieval**: Scrapes Google News RSS for the latest headlines related to the ticker.
* **LangGraph Workflow**: Orchestrates the sequential execution of data fetching nodes, aggregating all state into a central `AgentState`.
* **Report Generation**: Feeds the aggregated state into a strictly-prompted LLM to stream an institutional memo.
* **Investment Decision Engine**: A final "Investment Committee" node reviews the generated report and financial data to output a deterministic, JSON-formatted `INVEST` or `PASS` binary decision along with a confidence score.

## Key Decisions & Trade-offs

- **Pre-computed Sentiment vs. LLM Sentiment**: Instead of asking the LLM to gauge the sentiment of news articles (which burns tokens and risks hallucination), we compute sentiment natively using the `sentiment` NLP library before the prompt is assembled.
- **Server-Sent Events (SSE)**: We opted for standard web streams over WebSockets for real-time text generation to maintain stateless compatibility with Serverless edge deployment on Vercel.
- **Fallback Models**: We implemented an elegant cascading try-catch block for LLM invocation. If the free-tier Gemini API hits a `429 Too Many Requests` error, the graph instantly routes the state to an alternative provider like OpenAI or Hugging Face.

## Example Runs

### Apple (AAPL)

- **Recommendation:** INVEST
- **Confidence:** 8/10
- **Highlights:**
  - Strong financial performance
  - Continued Services growth
  - Positive AI strategy

---

### NVIDIA (NVDA)

- **Recommendation:** INVEST
- **Confidence:** 9/10
- **Highlights:**
  - AI infrastructure leader
  - Exceptional revenue growth
  - Strong enterprise demand

---

### Tesla (TSLA)

- **Recommendation:** PASS
- **Confidence:** 6/10
- **Highlights:**
  - High valuation
  - Margin pressure
  - Long-term AI potential

---

### Reliance Industries (RELIANCE.NS)

- **Recommendation:** INVEST
- **Confidence:** 8/10
- **Highlights:**
  - Diversified business model
  - Telecom and retail growth
  - Strong long-term outlook

## Future Improvements

* **SEC Filings**: Ingest 10-K and 10-Q reports to provide fundamental analysis context.
* **Earnings Transcript Analysis**: Run semantic search over quarterly earnings call transcripts.
* **Analyst Consensus**: Display aggregate Wall Street price targets.
* **DCF Valuation**: Automate a baseline Discounted Cash Flow calculation model.
* **Portfolio Comparison**: Allow users to run comparative analyses across multiple tickers simultaneously.
* **Watchlists**: Add user accounts and database integration to save generated reports.
* **Sentiment Visualization**: Build dynamic UI scatter plots correlating price history with news sentiment spikes.

## AI Usage

- AI assistants (primarily ChatGPT and Claude) were used throughout development to accelerate implementation, debug Next.js issues, refine LangGraph workflows, improve prompt engineering, and assist with documentation.
- LangGraph orchestrates the end-to-end agent workflow, including ticker resolution, financial data retrieval, news aggregation, report generation, and investment decision-making.
- The application uses multiple LLM providers with automatic fallback. Google Gemini serves as the primary model, while OpenAI and Hugging Face are used as fallback providers to ensure reliability during rate limits or API failures.
- Investment analysis is grounded in retrieved financial data and recent news, reducing hallucinations and improving the factual accuracy of generated reports.
- All architectural decisions, system integration, testing, debugging, and final validation were performed by the developer.

## AI Development Logs

As required by the assignment, this repository includes a sanitized transcript of the AI-assisted development process used while building AlphaResearch.

**Included File:**
- `docs/AI_CHAT_TRANSCRIPT.jsonl`

The transcript documents AI-assisted development, including brainstorming, implementation, debugging, prompt refinement, and architectural discussions. All API keys, credentials, and other sensitive information have been removed or replaced with placeholders before inclusion.

## Project Structure

```
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── api/research/  # LangGraph API streaming endpoint
│   │   └── research/      # Application UI and dashboard
│   ├── components/        # Reusable React components
│   └── lib/
│       └── agent/         # Core AI logic
│           ├── graph.ts   # LangGraph compilation
│           ├── nodes.ts   # Node functions (fetch, analyze, decide)
│           └── state.ts   # AgentState definition
├── docs/                  # Project documentation and transcripts
├── package.json
└── README.md
```

