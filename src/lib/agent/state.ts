import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  companyName: Annotation<string>(),
  ticker: Annotation<string>(),
  financials: Annotation<any>(),
  priceHistory: Annotation<any>(),
  news: Annotation<any[]>(),
  analysis: Annotation<string>(),
  decision: Annotation<string>(),
  reasoning: Annotation<string>(),
  confidenceScore: Annotation<number>(),
  error: Annotation<string>(),
  logs: Annotation<string[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),
});
