"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Bot,
  CheckCircle,
  Chrome,
  Command,
  Github,
  Lock,
  Mail,
  Mic,
} from "lucide-react";

function AuthVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-neutral-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute w-[500px] h-[500px] border border-neutral-200 rounded-full border-dashed opacity-50"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute w-[350px] h-[350px] border border-neutral-200 rounded-full border-dotted opacity-50"
      />
      <div className="absolute w-[250px] h-[250px] bg-neutral-900/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full h-full max-w-lg mx-auto">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-[25%] left-[5%] bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white w-52"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-4 h-4 text-neutral-700" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Voice Analysis
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-10">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ["30%", "100%", "30%"] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                className="w-1.5 bg-neutral-900 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] right-[5%] bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white w-64"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Live Score
              </span>
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tighter">
              92
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                <span>Technical</span> <span>95%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-neutral-900 rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                <span>Communication</span> <span>88%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "88%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-neutral-900 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[25%] left-[15%] bg-neutral-900 p-4 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-4 text-white w-64"
        >
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
              Active Persona
            </div>
            <div className="text-sm font-medium">Senior Engineering Manager</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <div className="w-full lg:w-[45%] p-8 flex flex-col relative z-20 bg-white">
        <div className="flex items-center justify-end">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900">
                Welcome back
              </h1>
              <p className="text-neutral-500 text-sm">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm font-medium text-neutral-700 bg-white">
                <Chrome size={18} />
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm font-medium text-neutral-700 bg-white">
                <Github size={18} />
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-400">Or continue with</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <button className="w-full bg-neutral-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 flex items-center justify-center gap-2 group mt-2">
                Sign In
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-neutral-900 hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="text-xs text-neutral-400 flex justify-between">
          <span>© 2024 Interview Genie</span>
          <div className="space-x-4">
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[55%] relative bg-neutral-50 border-l border-neutral-200">
        <AuthVisual />
      </div>
    </div>
  );
}