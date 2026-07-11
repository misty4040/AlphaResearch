import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />
      
      <main className="pt-[200px] pb-[160px] px-6">
        <section className="max-w-[800px] mx-auto">
          <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-8 block text-center">About The Firm</span>
          <h1 className="font-serif text-[56px] md:text-[72px] font-normal leading-[1.05] mb-16 text-center">
            Democratizing institutional analysis.
          </h1>
          
          <div className="prose prose-invert max-w-none 
            prose-p:text-[20px] prose-p:font-light prose-p:leading-[1.8] prose-p:text-brand-text-secondary prose-p:mb-8
            prose-h2:font-serif prose-h2:text-[34px] prose-h2:font-normal prose-h2:text-brand-text prose-h2:mt-16 prose-h2:mb-8
          ">
            <p>
              AlphaResearch was founded on a simple premise: institutional-grade financial intelligence should not be gatekept behind exclusionary terminal subscriptions.
            </p>
            <p>
              By combining cutting-edge Large Language Models with autonomous web scraping and financial data synthesis, we've built an AI agent capable of performing deep-dive equity research in seconds instead of hours.
            </p>
            
            <h2>The Technology Stack</h2>
            <p>
              AlphaResearch is built using a state-of-the-art AI orchestration architecture:
            </p>
            <ul>
              <li><strong>LangGraph</strong>: For complex, multi-step agent reasoning and state management.</li>
              <li><strong>Google Gemini</strong>: Powering our core analytical capabilities and financial reasoning.</li>
              <li><strong>Tavily Search</strong>: Providing real-time, highly accurate web data designed specifically for LLMs.</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
