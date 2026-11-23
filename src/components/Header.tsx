'use client';

import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export default function Header() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/safiyahamedu/book-a-1-1-call-with-safiyah-amedu';

  return (
    <header className="w-full border-b border-white/[0.06] bg-[#08080A]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-gem">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
              Webly<span className="text-orange-500 font-sans text-xs ml-1 font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">MVP</span>
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center space-x-4">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500/10 transition-all duration-200"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Book Scoping Call</span>
            <span className="sm:hidden">Book Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}

