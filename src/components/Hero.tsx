'use client';

import React from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function Hero({ onStartClick }: { onStartClick?: () => void }) {
  return (
    <div className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center px-4 max-w-4xl mx-auto overflow-hidden">
      {/* Gemstone Ambient Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-orange-600/20 via-amber-500/15 to-red-600/20 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-medium tracking-wide uppercase mb-6 shadow-gem">
        <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
        <span>Free Evaluation & Blueprint Generator</span>
      </div>

      {/* Main Editorial Headline */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.15] sm:leading-[1.12] tracking-tight text-zinc-100 max-w-3xl mx-auto mb-6">
        The Uncomfortable Truth Behind Launching Your Software In 2 Weeks, And It Has{' '}
        <span className="tracking-tight text-white underline decoration-orange-500/60 decoration-wavy decoration-1 underline-offset-8">
          Nothing
        </span>{' '}
        To Do With More Features
      </h1>

      {/* Subtitle with Italic Emphasis */}
      <p className="font-serif italic text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
        (Without burning months in development limbo, wasting thousands on unvalidated code, or building what nobody actually pays for)
      </p>

      {/* Step Callout Badge */}
      <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
        <span>Step 1: Answer 10 Scoping Questions Below</span>
        <ArrowDown className="w-4 h-4 text-orange-400 animate-bounce" />
      </div>
    </div>
  );
}

