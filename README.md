# AlphaResearch

An autonomous AI investment research agent that continuously aggregates market data, historical stock prices, and real-time news to generate institutional-grade equity research reports and binary investment decisions.

## Live Demo

[View Live Demo on Vercel](https://alpharesearch.vercel.app/)

## Features

- **Autonomous Agentic Workflow**: Uses LangGraph to orchestrate complex data aggregation and analysis.
- **Real-Time Data Streaming**: Streams the AI's institutional memo directly to the frontend using Server-Sent Events (SSE).
- **Institutional-Grade Formatting**: Enforces strict markdown guidelines for research reports without hallucinating financial metrics.
- **Multi-Modal Data Ingestion**: Synthesizes structured data (Yahoo Finance metrics) and unstructured data (Google News RSS).
- **Deterministic Sentiment Analysis**: Pre-computes news sentiment natively using AFINN lexicons to eliminate LLM sentiment hallucinations.
- **Fallback AI Redundancy**: Seamlessly falls back across Google Gemini, OpenAI, and Hugging Face (Qwen 2.5) if rate limits or API errors occur.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Recharts
- **Backend**: Next.js App Router (API Routes)
- **AI Framework**: LangGraph, LangChain
- **LLM Providers**: Google Gemini (gemini-2.5-flash), OpenAI, Hugging Face
- **External APIs**: Yahoo Finance API (yahoo-finance2), Google News RSS

## Overview

AlphaResearch is a specialized agentic workflow designed to replicate the analytical rigor of a CFA-level Senior Equity Research Analyst. By strictly controlling the context window and leveraging deterministic data pipelines, the agent prevents hallucinations and enforces institutional neutrality while producing actionable insights.

## Architecture

User
↓
Ticker Resolution
↓
Yahoo Finance
↓
Google News
↓
LangGraph
↓
LLM Analysis
↓
Investment Decision
↓
Interactive Report

## How to Run

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AlphaResearch.git
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

The system works universally for global equities. Examples:
- **Apple (AAPL)**
- **NVIDIA (NVDA)**
- **Tesla (TSLA)**
- **Reliance Industries (RELIANCE.NS)**

## Future Improvements

* **SEC Filings**: Ingest 10-K and 10-Q reports to provide fundamental analysis context.
* **Earnings Transcript Analysis**: Run semantic search over quarterly earnings call transcripts.
* **Analyst Consensus**: Display aggregate Wall Street price targets.
* **DCF Valuation**: Automate a baseline Discounted Cash Flow calculation model.
* **Portfolio Comparison**: Allow users to run comparative analyses across multiple tickers simultaneously.
* **Watchlists**: Add user accounts and database integration to save generated reports.
* **Sentiment Visualization**: Build dynamic UI scatter plots correlating price history with news sentiment spikes.

## AI Usage

AI was heavily utilized throughout the development of AlphaResearch. 
- DeepMind's Antigravity AI assistant paired with me to structure the codebase, debug Next.js routing, and implement the real-time SSE streaming architecture.
- LangGraph orchestrates the underlying workflow, controlling state transitions securely.
- LLMs (Gemini, OpenAI) act purely as analytical engines, generating the investment analysis safely within strict prompting bounds.

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

## License

MIT License
