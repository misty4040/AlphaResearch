import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state";
import { findTickerNode, fetchFinancialsNode, fetchPriceHistoryNode, fetchNewsNode, analyzeNode, decideNode } from "./nodes";

const workflow = new StateGraph(AgentState)
  .addNode("find_ticker", findTickerNode)
  .addNode("fetch_financials", fetchFinancialsNode)
  .addNode("fetch_price_history", fetchPriceHistoryNode)
  .addNode("fetch_news", fetchNewsNode)
  .addNode("analyze", analyzeNode)
  .addNode("decide", decideNode)
  .addEdge(START, "find_ticker")
  .addEdge("find_ticker", "fetch_financials")
  .addEdge("fetch_financials", "fetch_price_history")
  .addEdge("fetch_price_history", "fetch_news")
  .addEdge("fetch_news", "analyze")
  .addEdge("analyze", "decide")
  .addEdge("decide", END);

export const appGraph = workflow.compile();
