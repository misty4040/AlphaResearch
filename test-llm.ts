import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function test() {
  try {
    console.log("Instantiating LLM...");
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: "<SECRET>",
      temperature: 0.2,
    });
    console.log("Invoking LLM...");
    const response = await llm.invoke("Hello!");
    console.log("Success:", response);
  } catch (e: any) {
    console.error("Caught error:", e);
    console.error(e.stack);
  }
}

test();
