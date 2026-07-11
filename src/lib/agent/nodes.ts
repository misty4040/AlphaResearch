import { AgentState } from "./state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { InferenceClient } from "@huggingface/inference";
import YahooFinance from "yahoo-finance2";
import Sentiment from "sentiment";

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const sentimentAnalyzer = new Sentiment();

class HuggingFaceChatModel {
  client: InferenceClient;
  model: string;

  constructor(apiKey: string) {
    this.client = new InferenceClient(apiKey);
    this.model = "Qwen/Qwen2.5-72B-Instruct";
  }

  async invoke(prompt: string) {
    const response = await this.client.chatCompletion({
      model: this.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2048,
    });

    return {
      content: response.choices[0].message.content,
    };
  }
}

class FallbackChatModel {
  geminiModel: ChatGoogleGenerativeAI | null;
  openaiModel: ChatOpenAI | null;
  hfModel: HuggingFaceChatModel | null;

  constructor(
    geminiModel: ChatGoogleGenerativeAI | null,
    openaiModel: ChatOpenAI | null,
    hfModel: HuggingFaceChatModel | null
  ) {
    this.geminiModel = geminiModel;
    this.openaiModel = openaiModel;
    this.hfModel = hfModel;
  }

  async invoke(prompt: string): Promise<{ content: any }> {
    if (this.geminiModel) {
      try {
        console.log("Using Gemini");
        const res = await this.geminiModel.invoke(prompt);
        return res;
      } catch (err: any) {
        console.warn("Gemini call failed or rate-limited. Error:", err.message);
        if (!this.openaiModel && !this.hfModel) {
          return { content: `\`\`\`json\n{"decision":"HOLD","reasoning":"Gemini API quota exceeded. Please wait 1 minute, or add OPENAI_API_KEY to your .env.local for fallback support.","confidenceScore":0}\n\`\`\`` };
        }
      }
    }
    
    if (this.openaiModel) {
      try {
        console.log("Using OpenAI Fallback");
        const res = await this.openaiModel.invoke(prompt);
        return res;
      } catch (err: any) {
        console.warn("OpenAI call failed. Error:", err.message);
        if (!this.hfModel) {
          return { content: `\`\`\`json\n{"decision":"HOLD","reasoning":"OpenAI API quota exceeded or failed. Please add HUGGING_FACE_API_KEY to your .env.local for fallback support.","confidenceScore":0}\n\`\`\`` };
        }
      }
    }

    if (this.hfModel) {
      console.log("Using Hugging Face Fallback (Qwen 2.5)");
      const res = await this.hfModel.invoke(prompt);
      return res;
    }

    throw new Error("No model was able to resolve this request.");
  }

  async stream(prompt: string, onToken?: (token: string) => void): Promise<{ content: any }> {
    if (this.geminiModel) {
      try {
        console.log("Using Gemini (streaming)");
        const stream = await this.geminiModel.stream(prompt);
        let fullText = "";
        for await (const chunk of stream) {
          const text = chunk.content.toString();
          fullText += text;
          if (onToken) onToken(text);
        }
        return { content: fullText };
      } catch (err: any) {
        console.warn("Gemini stream failed or rate-limited. Error:", err.message);
        if (!this.openaiModel && !this.hfModel) {
          return { content: `\`\`\`json\n{"decision":"HOLD","reasoning":"Gemini API quota exceeded. Please wait 1 minute, or add OPENAI_API_KEY to your .env.local for fallback support.","confidenceScore":0}\n\`\`\`` };
        }
      }
    }
    
    if (this.openaiModel) {
      try {
        console.log("Using OpenAI Fallback (streaming)");
        const stream = await this.openaiModel.stream(prompt);
        let fullText = "";
        for await (const chunk of stream) {
          const text = chunk.content.toString();
          fullText += text;
          if (onToken) onToken(text);
        }
        return { content: fullText };
      } catch (err: any) {
        console.warn("OpenAI stream failed. Error:", err.message);
        if (!this.hfModel) {
          return { content: `\`\`\`json\n{"decision":"HOLD","reasoning":"OpenAI API quota exceeded or failed. Please add HUGGING_FACE_API_KEY to your .env.local for fallback support.","confidenceScore":0}\n\`\`\`` };
        }
      }
    }

    if (this.hfModel) {
      console.log("Using Hugging Face Fallback (streaming)");
      const stream = this.hfModel.client.chatCompletionStream({
        model: this.hfModel.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
      });
      let fullText = "";
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        fullText += text;
        if (onToken) onToken(text);
      }
      return { content: fullText };
    }

    throw new Error("No model was able to resolve this request.");
  }
}

function getModel() {
  let geminiModel = null;
  let openaiModel = null;
  let hfModel = null;

  if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    geminiModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
      apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    });
  }

  if (process.env.OPENAI_API_KEY) {
    openaiModel = new ChatOpenAI({
      model: "gpt-4o-mini",
      maxTokens: 2048,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  if (process.env.HUGGING_FACE_API_KEY) {
    hfModel = new HuggingFaceChatModel(process.env.HUGGING_FACE_API_KEY);
  }

  if (!geminiModel && !openaiModel && !hfModel) {
    throw new Error("No LLM API key found.");
  }

  return new FallbackChatModel(geminiModel, openaiModel, hfModel);
}

export async function findTickerNode(state: typeof AgentState.State) {
  const { companyName } = state;
  
  const cleanName = companyName.trim().toUpperCase();
  if (cleanName === "LTM" || cleanName === "LTM.NSE") {
    return { ticker: "LT.NS", logs: [`Manual override: Resolved LTM query to LT.NS`] };
  }

  try {
    const model = getModel();
    const prompt = `You are an experienced equity research analyst.
Task: Given the company name or search query "${companyName}", resolve it to its primary publicly traded stock ticker symbol.
Rules:
- Return ONLY the ticker symbol in uppercase.
- If the company is primarily listed in India (e.g. Reliance, Tata, TARC, Adani, Zomato, etc.), you MUST append the ".NS" suffix to the ticker symbol (e.g. RELIANCE.NS, TCS.NS, TARC.NS, ZOMATO.NS).
- If it is a US stock (e.g. Apple, Google, Microsoft), return the standard US ticker without any suffix (e.g. AAPL, GOOG, MSFT).
- Return ONLY the ticker symbol, with no other text, markdown, or punctuation. If you cannot identify the ticker, reply with "UNKNOWN".`;
    
    const response = await model.invoke(prompt);
    const ticker = response.content.toString().trim().toUpperCase().replace(/[^A-Z0-9.&-]/g, '');
    return { ticker, logs: [`Resolved ticker for "${companyName}": ${ticker}`] };
  } catch (err: any) {
    console.error("Error resolving ticker:", err);
    return { ticker: "UNKNOWN", error: `Ticker resolution failed: ${err.message}`, logs: [`Ticker resolution failed.`] };
  }
}

export async function fetchFinancialsNode(state: typeof AgentState.State) {
  const { ticker } = state;
  if (!ticker || ticker === "UNKNOWN") {
    return { financials: { error: "No valid ticker for financial data lookup." }, logs: ["No valid ticker found."] };
  }

  try {
    const quote = await yahooFinance.quote(ticker);
    
    // fetch 1 month data for the 1 month return calculation
    const queryOptions = { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    const chartData = await yahooFinance.chart(ticker, queryOptions);
    const quotes = chartData.quotes || [];
    
    let oneMonthReturn = 0;
    if (quotes.length > 0) {
      const first = quotes[0].close;
      const last = quotes[quotes.length - 1].close;
      oneMonthReturn = ((last - first) / first) * 100;
    }

    const financials = {
      longName: quote.longName || quote.shortName || ticker,
      symbol: ticker,
      currentPrice: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      volume: quote.regularMarketVolume,
      currency: quote.currency,
      exchange: quote.exchange || "NSE",
      oneMonthReturn: Number(oneMonthReturn.toFixed(2)),
    };

    return { financials, logs: [`Financials fetched successfully for: ${ticker}`] };
  } catch (err: any) {
    console.error("Error in fetchFinancialsNode:", err);
    return { financials: { error: `Error fetching financials: ${err.message}` }, logs: ["Error fetching financials."] };
  }
}

async function safeHistorical(ticker: string, period1: Date, interval: '1d' | '1wk' | '1mo' = '1d') {
  try {
    const data = await yahooFinance.chart(ticker, { period1, interval });
    const quotes = data.quotes || [];
    return quotes.map((r: any) => ({
      date: r.date.toISOString().split('T')[0],
      price: Number(r.close.toFixed(2))
    })).filter((pt: any) => pt.price !== null && pt.price !== undefined && !isNaN(pt.price));
  } catch (err) {
    console.error(`Error fetching historical for ${ticker}:`, err);
    return [];
  }
}

export async function fetchPriceHistoryNode(state: typeof AgentState.State) {
  const { ticker } = state;
  if (!ticker || ticker === "UNKNOWN") {
    return { priceHistory: {}, logs: ["Skipping price history for unknown ticker."] };
  }

  try {
    const now = Date.now();
    const [h1w, h1m, h3m, h6m, h1y, h5y] = await Promise.all([
      safeHistorical(ticker, new Date(now - 7 * 24 * 60 * 60 * 1000)),
      safeHistorical(ticker, new Date(now - 30 * 24 * 60 * 60 * 1000)),
      safeHistorical(ticker, new Date(now - 90 * 24 * 60 * 60 * 1000)),
      safeHistorical(ticker, new Date(now - 180 * 24 * 60 * 60 * 1000)),
      safeHistorical(ticker, new Date(now - 365 * 24 * 60 * 60 * 1000)),
      safeHistorical(ticker, new Date(now - 5 * 365 * 24 * 60 * 60 * 1000), '1wk'),
    ]);

    const priceHistory = {
      '1D': h1w.slice(-2), // Fallback for 1D since 5m isn't available easily via historical
      '1W': h1w,
      '1M': h1m,
      '3M': h3m,
      '6M': h6m,
      '1Y': h1y,
      '3Y': h5y.slice(-156),
      '5Y': h5y
    };

    return { priceHistory, logs: [`Fetched parallel price history for: ${ticker}`] };
  } catch (err) {
    console.error("Error in fetchPriceHistoryNode:", err);
    return { priceHistory: {}, logs: ["Error fetching price history."] };
  }
}

export async function fetchNewsNode(state: typeof AgentState.State) {
  const { companyName, ticker } = state;
  try {
    const searchQuery = `${companyName} ${ticker && ticker !== "UNKNOWN" ? ticker : ""} stock news investment`;
    const encoded = encodeURIComponent(searchQuery);
    
    const res = await fetch(`https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`);
    if (!res.ok) {
      return { news: [], logs: ["Failed to fetch Google News RSS."] };
    }
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const sourceMatch = itemContent.match(/<source[\s\S]*?>([\s\S]*?)<\/source>/);

      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1') : '';
      const score = sentimentAnalyzer.analyze(title).score;
      const sentimentScore = score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral";

      items.push({
        title: title,
        url: linkMatch ? linkMatch[1] : '',
        pubDate: pubDateMatch ? pubDateMatch[1] : '',
        source: sourceMatch ? sourceMatch[1] : '',
        sentiment: sentimentScore
      });
    }

    return { news: items, logs: [`Fetched ${items.length} news items from Google RSS.`] };
  } catch (err: any) {
    console.error("Error fetching news:", err);
    return { news: [], error: `Failed to fetch news: ${err.message}`, logs: ["Error fetching news."] };
  }
}

export async function analyzeNode(state: typeof AgentState.State, config?: any) {
  const { companyName, ticker, financials, news } = state;
  const onToken = config?.configurable?.onToken;
  
  const isTickerUnknown = !ticker || ticker === "UNKNOWN";
  const hasNoNews = !news || news.length === 0;

  if (isTickerUnknown && hasNoNews) {
    return {
      analysis: `### Aborted: Entity Not Found\n\nWe could not find any publicly traded stock ticker symbol, historical price chart, or recent news reports for the company name **"${companyName}"**.\n\nPlease verify that the company name is spelled correctly and that the business is a publicly listed or widely recognized entity.`,
      logs: [`Aborted analysis: no ticker or news found.`]
    };
  }

  try {
    const model = getModel();
    const isFinValid = financials && !financials.error;
    const isNewsValid = news && news.length > 0;

    const financialsStr = isFinValid ? JSON.stringify(financials, null, 2) : "No financial metrics available.";
    const newsStr = isNewsValid ? JSON.stringify(news.map(n => ({
      title: n.title,
      source: n.source || "Unknown",
      sentiment: n.sentiment
    })), null, 2) : "No recent news available.";

    const prompt = `You are a CFA-level Senior Equity Research Analyst working for an institutional investment research firm.

Your task is to generate a professional investment research report using ONLY the information provided below.

=========================
COMPANY
=========================
Company: ${companyName}
Ticker: ${ticker || "UNKNOWN"}

=========================
FINANCIAL DATA
=========================
${financialsStr}

=========================
RECENT NEWS
=========================
${newsStr}

=========================
STRICT RULES
=========================

1. NEVER invent facts.

2. NEVER mention products, services, acquisitions, technologies, partnerships, financial metrics, analyst opinions, future events, or company initiatives unless they are explicitly present in the supplied Financial Data or Recent News.

3. NEVER mention:
- target price
- buy target
- price prediction
- analyst rating
- earnings estimates
- revenue estimates
- future launches
- upcoming products
- future partnerships
- AI initiatives
- acquisitions
unless they appear in the supplied data.

4. If information is unavailable, explicitly write:
"Information not available from the supplied data."

5. Base every conclusion only on:
- financial metrics
- historical price performance
- supplied news articles

6. If the news sentiment is mixed, state that it is mixed.

7. If there is insufficient evidence for a conclusion, clearly state that additional information would be required.

8. Do NOT exaggerate.

9. Maintain a neutral institutional tone.

10. Do NOT use marketing language.

11. Never use phrases like:
- guaranteed
- surely
- definitely
- massive upside
- strong buy
- must buy

12. Keep the report factual, concise and data-driven.

=========================
REPORT FORMAT
=========================

# Executive Summary

Provide a concise overview of the company using ONLY the supplied information.

Include:
- current price
- one month return
- overall news sentiment
- high level investment outlook

Maximum 150 words.

---

# Company Overview

If available include:

- Company Name
- Exchange
- Currency
- Current Price
- Previous Close
- 52 Week High
- 52 Week Low
- Volume

If any field is unavailable write:

Information not available.

---

# Financial Health & Valuation

Interpret ONLY:

- Current Price
- Previous Close
- One Month Return
- 52 Week Range
- Volume

Do NOT calculate valuation ratios that were not supplied.

Do NOT invent P/E, EPS, Market Cap, ROE, etc.

If unavailable simply say so.

---

# Market Position & Recent Catalysts

Summarize the supplied news.

For each article include:

• Source
• Short summary
• Sentiment (Positive / Neutral / Negative)

Then explain the overall market sentiment.

Do NOT invent news.

---

# Investment Risks

Only mention risks supported by:

- supplied financial data
- supplied news
- generally applicable business risks

Do NOT fabricate risks.

---

# Strengths

List the company's observable strengths supported by the supplied data.

---

# Weaknesses

List observable weaknesses supported by the supplied data.

---

# Analyst Conclusion

Provide an objective conclusion.

State whether the current evidence appears:

- Positive
- Neutral
- Negative

Explain WHY.

DO NOT give:

- target price
- buy rating
- sell rating
- expected return
- price forecast

Simply summarize what the available evidence suggests.

End with:

"This report is based solely on the supplied financial data and news available at the time of analysis."

IMPORTANT: You MUST write the entire report exclusively in English. Do not use any other language.`;

    const response = await model.stream(prompt, onToken);
    return { analysis: response.content.toString(), logs: [`Generated investment analysis report for: ${companyName}`] };
  } catch (err: any) {
    console.error("Error in analyzeNode:", err);
    return { analysis: "Analysis generation failed due to model error.", error: `Analysis node error: ${err.message}`, logs: ["Analysis error."] };
  }
}

export async function decideNode(state: typeof AgentState.State) {
  const { companyName, ticker, financials, analysis } = state;

  if (analysis && analysis.includes("Aborted: Entity Not Found")) {
    return {
      decision: "PASS",
      reasoning: `We were unable to identify "${companyName}" as a valid publicly traded company or find any public news history.`,
      confidenceScore: 10,
      logs: ["Decision: PASS (Entity not found)."]
    };
  }

  try {
    const model = getModel();
    const prompt = `You are the Investment Committee of an institutional asset management firm.

Review ONLY the supplied investment report and financial data.

Never use outside knowledge.

Never invent facts.

Your job is to classify the opportunity into ONLY one of two categories:

INVEST
PASS

Rules:

- INVEST only when the supplied evidence is predominantly positive.

- PASS if evidence is mixed, insufficient, uncertain, or predominantly negative.

Never guess.

Return ONLY valid JSON.

{
  "decision": "INVEST or PASS",
  "reasoning": "Maximum 60 words explaining the decision using only supplied evidence.",
  "confidenceScore": "integer from 1-10"
}

Confidence Guide

10 = overwhelming supporting evidence

8-9 = strong evidence

6-7 = moderate evidence

4-5 = mixed evidence

1-3 = insufficient or conflicting evidence

Company: ${companyName} (${ticker})
Price: ${financials?.currentPrice || 'N/A'}

Analysis Report:
${analysis}`;

    const response = await model.invoke(prompt);
    
    let cleanContent = response.content.toString().trim();
    if (cleanContent.startsWith("\`\`\`json")) {
      cleanContent = cleanContent.substring(7);
    }
    if (cleanContent.startsWith("\`\`\`")) {
      cleanContent = cleanContent.substring(3);
    }
    if (cleanContent.endsWith("\`\`\`")) {
      cleanContent = cleanContent.substring(0, cleanContent.length - 3);
    }
    cleanContent = cleanContent.trim();

    const decisionObj = JSON.parse(cleanContent);
    return {
      decision: decisionObj.decision === "INVEST" ? "INVEST" : "PASS",
      reasoning: decisionObj.reasoning || "No reasoning provided.",
      confidenceScore: decisionObj.confidenceScore || 5,
      logs: [`Investment Committee concluded with verdict: ${decisionObj.decision} (Confidence: ${decisionObj.confidenceScore}/10).`]
    };
  } catch (err: any) {
    console.error("Error in decideNode:", err);
    return {
      decision: "HOLD",
      reasoning: `Failed to make a decision through LLM: ${err.message}`,
      confidenceScore: 0,
      logs: ["Error parsing committee decision. Defaulting to HOLD."]
    };
  }
}
