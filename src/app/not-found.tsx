import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-8 block">Error 404</span>
        <h1 className="font-serif text-[72px] font-normal leading-[1.05] mb-8">
          Record not found.
        </h1>
        <p className="text-[20px] text-brand-text-secondary font-light max-w-md mb-12">
          The requested document or terminal directory has been moved, reclassified, or does not exist.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-10 py-[18px] rounded-[12px] bg-brand-button-bg text-brand-button-text text-[18px] font-medium transition-colors hover:bg-brand-gold-hover"
        >
          Return to Hub
        </Link>
      </main>
      
      <Footer />
    </div>
  );
}
