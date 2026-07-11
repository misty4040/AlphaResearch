"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSearchParams } from "next/navigation";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";

const formatCurrency = (value: number | undefined, currency: string | undefined = "USD") => {
  if (value === undefined || value === null) return "---";
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch (e) {
    const symbol = currency === 'INR' ? '₹' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : '$'));
    return `${symbol}${value.toFixed(2)}`;
  }
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
      <ResearchPage />
    </Suspense>
  );
}

function ResearchPage() {
  const searchParams = useSearchParams();
  const tickerParam = searchParams?.get("ticker");
  const initialLoadRef = useRef(false);

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<{ node: string; message: string }[]>([]);
  
  const [report, setReport] = useState<string | null>(null);
  const [decision, setDecision] = useState<{ verdict: string; confidence?: number; rationale?: string } | null>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  const startResearch = async (ticker: string = companyName) => {
    if (!ticker) return;
    setCompanyName(ticker);
    setLoading(true);
    setLogs([]);
    setReport(null);
    setDecision(null);
    setFinancials(null);
    setPriceHistory(null);
    setNews([]);
    setError(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: ticker }),
      });

      if (!res.ok) throw new Error("Failed to start research");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

      while (reader && !done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const lines = part.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.replace("data: ", "").trim();
                if (dataStr) {
                  try {
                    const data = JSON.parse(dataStr);
                    if (data.type === "log") {
                      setLogs((prev) => [...prev, { node: data.node, message: data.message }]);
                    } else if (data.type === "financials") {
                      setFinancials(data.financials);
                    } else if (data.type === "price_history") {
                      setPriceHistory(data.priceHistory || null);
                    } else if (data.type === "news") {
                      setNews(data.news || []);
                    } else if (data.type === "stream") {
                      setReport((prev) => (prev || "") + data.content);
                    } else if (data.type === "analysis") {
                      setReport(data.report);
                    } else if (data.type === "decision") {
                      setDecision({ verdict: data.verdict, confidence: data.confidence, rationale: data.rationale });
                    } else if (data.type === "error") {
                      setError(data.message);
                    }
                  } catch (err) { }
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin:       0.5,
      filename:     `${companyName || 'AlphaResearch'}_Investment_Report.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (tickerParam && !initialLoadRef.current) {
      initialLoadRef.current = true;
      startResearch(tickerParam);
    }
  }, [tickerParam]);

  const chartData = priceHistory?.['3M'] || [];
  const isComplete = financials || chartData.length > 0 || news.length > 0;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 pt-[160px] pb-[160px]">
        {/* Search Header */}
        <div className="mb-[96px]">
          <form onSubmit={(e) => { e.preventDefault(); startResearch(); }} className="max-w-3xl">
            <div className="flex items-center bg-brand-input-bg border border-brand-input-border rounded-[14px] overflow-hidden p-3 transition-colors focus-within:border-brand-gold/50">
              <Search className="w-5 h-5 text-brand-gold ml-4 shrink-0" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter ticker (e.g. AAPL) to generate an institutional report"
                className="w-full bg-transparent border-none outline-none text-brand-text px-6 py-4 text-[18px] font-sans placeholder-brand-muted"
                disabled={loading}
              />
              <button
                type="submit"
                className="px-8 py-[18px] bg-brand-button-bg text-brand-button-text font-medium rounded-[12px] hover:bg-brand-gold-hover transition-colors hidden sm:block whitespace-nowrap text-[18px]"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
              </button>
            </div>
          </form>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {!loading && !isComplete && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-brand-divider pt-[96px]"
            >
              <h1 className="font-serif text-[56px] font-normal leading-[1.1] mb-12 max-w-2xl">
                Deep fundamental research.<br />Executed autonomously.
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px]">
                <div>
                  <h3 className="font-serif text-[34px] font-normal mb-4">Trending Equities</h3>
                  <div className="space-y-4">
                    {["NVIDIA Corporation (NVDA)", "LTM", "Tesla, Inc. (TSLA)"].map((ticker) => (
                      <button
                        key={ticker}
                        onClick={() => {
                          const symbol = ticker.match(/\(([^)]+)\)/)?.[1] || ticker;
                          startResearch(symbol);
                        }}
                        className="flex items-center justify-between w-full py-4 border-b border-brand-divider text-left hover:text-brand-gold transition-colors text-[18px] font-light"
                      >
                        {ticker} <ArrowRight className="w-5 h-5 text-brand-muted" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-[34px] font-normal mb-4">Recent Analyses</h3>
                  <div className="space-y-4">
                    {["Apple Inc. (AAPL)", "Microsoft Corp (MSFT)"].map((ticker) => (
                      <div key={ticker} className="flex items-center justify-between w-full py-4 border-b border-brand-divider text-left text-brand-muted text-[18px] font-light">
                        {ticker}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && !isComplete && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-t border-brand-divider pt-[96px]"
            >
              <div className="flex items-center gap-6 mb-[64px]">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                <h2 className="font-serif text-[56px] font-normal leading-[1.1]">
                  Gathering Market Data
                </h2>
              </div>

              <div className="max-w-3xl">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-8 py-6 border-b border-brand-divider"
                  >
                    <div className="w-[200px] shrink-0 text-[14px] font-medium tracking-[2px] uppercase text-brand-gold">
                      {log.node.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[18px] font-light text-brand-text-secondary">
                      {log.message}
                    </div>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </motion.div>
          )}

          {/* Result State - Complete Dashboard & Report */}
          {isComplete && (
            <motion.div 
              key="result"
              id="report-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* AI Decision Engine Box */}
              <div className="bg-brand-card border border-brand-border-secondary rounded-[10px] p-8 md:p-12 mb-8 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-brand-divider pb-8 gap-8">
                  <div>
                    <div className="text-brand-gold text-[12px] uppercase tracking-[2px] font-medium mb-4">AI Decision Engine</div>
                    <h2 className="font-serif text-[42px] font-normal leading-[1.1]">{financials?.longName || companyName.toUpperCase()}</h2>
                    <div className="text-[14px] text-brand-muted mt-2">Report generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                  </div>
                  <div className="flex gap-4 md:gap-8">
                    {decision ? (
                      <>
                        <div className="text-left md:text-right">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-4">Recommendation</div>
                          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#122A17] border border-brand-border rounded-full">
                             <div className={`w-2.5 h-2.5 rounded-full ${decision.verdict === "INVEST" ? "bg-brand-success" : decision.verdict === "HOLD" ? "bg-brand-warning" : "bg-brand-danger"}`} />
                             <span className="text-[18px] text-brand-gold font-medium tracking-wide">{decision.verdict}</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-4">Confidence</div>
                          <div className="px-6 py-3 bg-brand-bg-alt border border-brand-border-secondary rounded-full text-[18px] text-brand-text font-medium tracking-wide">
                            {decision.confidence}/10
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 text-brand-gold">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[14px] uppercase tracking-[2px] font-medium">Awaiting Verdict...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-4">Key Recommendation Rationale</div>
                  <p className="text-[20px] font-light text-brand-text-secondary leading-[1.6]">
                    {decision ? decision.rationale : "Analyzing financial history and synthesizing market sentiment..."}
                  </p>
                </div>
              </div>

              {/* Chart and Market Data Box */}
              {(financials || chartData.length > 0 || news.length > 0) && (
                <div className="bg-brand-card border border-brand-border-secondary rounded-[10px] p-8 md:p-12 mb-8 shadow-2xl">
                  {financials && (
                    <div className="flex justify-between items-end mb-8">
                       <h3 className="font-serif text-[34px] font-normal text-brand-text">{financials.symbol}</h3>
                       <div className="text-[34px] font-sans font-medium">{formatCurrency(financials?.currentPrice, financials?.currency)}</div>
                    </div>
                  )}

                  {chartData.length > 0 && (
                    <div className="h-[300px] w-full mb-12" data-html2canvas-ignore="true">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <YAxis domain={['auto', 'auto']} hide />
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#17351D', border: '1px solid #234E2A', borderRadius: '8px', color: '#F7F3EC' }}
                             itemStyle={{ color: '#D4AF37' }}
                             labelStyle={{ color: '#889180' }}
                          />
                          <Line type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-divider">
                    {financials && (
                      <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-brand-gold text-[12px] uppercase tracking-[2px] font-medium mb-2 col-span-1 sm:col-span-2">Market Financial Snapshot</div>
                        <div className="bg-brand-bg-alt p-6 rounded-[8px] border border-brand-border-secondary">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-2">Current Price</div>
                          <div className="text-[24px] font-medium">{formatCurrency(financials?.currentPrice, financials?.currency)}</div>
                        </div>
                        <div className="bg-brand-bg-alt p-6 rounded-[8px] border border-brand-border-secondary">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-2">Previous Close</div>
                          <div className="text-[24px] font-medium">{formatCurrency(financials?.previousClose, financials?.currency)}</div>
                        </div>
                        <div className="bg-brand-bg-alt p-6 rounded-[8px] border border-brand-border-secondary">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-2">1-Month Return</div>
                          <div className={`text-[24px] font-medium ${financials?.oneMonthReturn < 0 ? 'text-brand-danger' : 'text-brand-success'}`}>
                            {financials?.oneMonthReturn !== undefined ? `${financials.oneMonthReturn}%` : "---"}
                          </div>
                        </div>
                        <div className="bg-brand-bg-alt p-6 rounded-[8px] border border-brand-border-secondary">
                          <div className="text-[12px] uppercase tracking-[2px] font-medium text-brand-muted mb-2">52-Week Range</div>
                          <div className="text-[24px] font-medium text-brand-text-secondary">
                            {formatCurrency(financials?.fiftyTwoWeekLow, financials?.currency)} - {formatCurrency(financials?.fiftyTwoWeekHigh, financials?.currency)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {news.length > 0 && (
                      <div className="col-span-1" data-html2canvas-ignore="true">
                        <div className="text-brand-gold text-[12px] uppercase tracking-[2px] font-medium mb-6">Market News Sources</div>
                        <div className="space-y-4">
                          {news.map((item, i) => (
                            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-brand-bg-alt p-4 rounded-[8px] border border-brand-border-secondary hover:border-brand-gold transition-colors">
                              <h4 className="text-[14px] font-medium mb-1 line-clamp-2 text-brand-text leading-snug">{item.title}</h4>
                              <div className="text-[12px] text-brand-muted truncate mt-2">{item.source || new URL(item.url).hostname}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Editorial Markdown Report */}
              <div className="bg-brand-card border border-brand-border-secondary rounded-[10px] p-[64px] md:p-[96px] shadow-2xl">
                <div className="text-brand-gold text-[12px] font-medium tracking-[2px] uppercase mb-12 border-b border-brand-divider pb-4">
                  In-Depth Investment Memo
                </div>

                <div className="prose prose-invert max-w-none 
                  prose-p:text-[20px] prose-p:font-light prose-p:leading-[1.8] prose-p:text-brand-text-secondary prose-p:mb-8
                  prose-h1:font-serif prose-h1:text-[56px] prose-h1:font-normal prose-h1:text-brand-text prose-h1:mt-16 prose-h1:mb-8
                  prose-h2:font-serif prose-h2:text-[34px] prose-h2:font-normal prose-h2:text-brand-gold prose-h2:border-b prose-h2:border-brand-divider prose-h2:pb-4 prose-h2:mt-16 prose-h2:mb-8
                  prose-h3:font-serif prose-h3:text-[28px] prose-h3:font-normal prose-h3:text-brand-gold prose-h3:mt-12 prose-h3:mb-4
                  prose-ul:text-[20px] prose-ul:font-light prose-ul:text-brand-text-secondary prose-ul:leading-[1.8]
                  prose-li:my-3
                  prose-strong:text-brand-text prose-strong:font-medium prose-strong:text-[22px]
                ">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(report) }} />
                  {!report && (
                    <div className="flex items-center gap-4 text-brand-gold mt-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[20px] font-light">Drafting institutional memo...</span>
                    </div>
                  )}
                  {report && !decision && (
                    <span className="inline-block w-3 h-5 bg-brand-gold animate-pulse ml-1" style={{ verticalAlign: 'middle' }}></span>
                  )}
                </div>

                <div className="mt-32 pt-12 border-t border-brand-divider flex justify-between items-center">
                  <div className="text-[14px] text-brand-muted">
                    Generated by AlphaResearch AI System.<br />
                    Confidential and proprietary.
                  </div>
                  <button 
                    onClick={downloadPDF}
                    data-html2canvas-ignore="true"
                    className="px-8 py-[18px] bg-brand-button-bg text-brand-button-text font-medium rounded-[12px] hover:bg-brand-gold-hover transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 border border-brand-danger bg-brand-danger/10 text-brand-danger text-[18px] rounded-[10px] mt-12"
            >
              System Error: {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function formatMarkdown(text: string | undefined | null) {
  if (!text) return "";
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^(\s*)\*\*(.+?)\*\*(\s*)$/gm, '$1<h3>$2</h3>$3')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  html = html.replace(/- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>').replace(/<\/ul><ul>/gim, '');

  return `<p>${html}</p>`;
}
