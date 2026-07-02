"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.03),_transparent_45%)]" />
      <div className="relative mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.35fr_0.85fr] md:items-start">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              Interview-Genie
            </Link>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Build interview confidence with focused practice, live feedback, and clear results.
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:items-end md:text-right">
            <div>
              <p className="text-sm font-medium text-slate-900">Ready to practice now?</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Jump into the interview setup, choose your role, and start the session.
              </p>
            </div>

            <Link
              href="/interview-setup"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800"
            >
              Start a practice interview
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            &copy; 2026 Interview-Genie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}