"use client";

import Link from "next/link";
import { ArrowRight, Lock, Server, Terminal } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-5xl w-full z-10 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
          The Open Source Secret Manager
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-white">Secure your </span>
          <span className="bg-gradient-to-r from-primary to-blue-300 bg-clip-text text-transparent">Secrets</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          HideMyKeys helps you manage, inject, and sync your environment variables securely across your infrastructure.
        </p>

        <div className="flex items-center gap-4 mb-24">
          <Link 
            href="/signup"
            className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <Link 
            href="/login"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="glass p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure Storage</h3>
            <p className="text-gray-400">Keep your API keys, passwords, and environment variables safe from prying eyes.</p>
          </div>

          <div className="glass p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Server size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Environment Sync</h3>
            <p className="text-gray-400">Easily manage variables across Development, Staging, and Production.</p>
          </div>

          <div className="glass p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Terminal size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">CLI Integration</h3>
            <p className="text-gray-400">Inject secrets into your application seamlessly during runtime with our CLI tool.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
