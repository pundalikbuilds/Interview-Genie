"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

function AuthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-neutral-50">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-200 opacity-60"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dotted border-neutral-200 opacity-60"
      />

      <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900/5" />
    </div>
  );
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <AuthBackdrop />

      <div className="relative z-20 flex min-h-screen w-full flex-col">
        <div className="flex items-center justify-end p-8">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm rounded-3xl border border-neutral-100 bg-white/90 p-8 shadow-2xl shadow-neutral-200/60 backdrop-blur-xl"
          >
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900">
                Welcome back
              </h1>
              <p className="text-sm text-neutral-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-semibold text-neutral-700">
                  Email Address
                </label>
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-neutral-900">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="prateek@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-10 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-semibold text-neutral-700">
                  Password
                </label>
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-neutral-900">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-10 py-2.5 pr-11 text-sm outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white shadow-lg shadow-neutral-200 transition-all hover:bg-neutral-800">
                Sign In
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-neutral-500">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-neutral-900 underline-offset-2 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}