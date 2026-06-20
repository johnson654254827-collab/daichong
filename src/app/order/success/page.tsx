import { Suspense } from "react";
import Link from "next/link";
import { SuccessContent } from "./content";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Suspense fallback={<div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-6"><div className="mx-auto h-4 w-48 rounded bg-slate-800" /></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}