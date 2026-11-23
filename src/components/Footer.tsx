import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.06] bg-black/40 py-10 text-center text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-base font-bold text-white">Webly</span>
          <span>•</span>
          <span>MVP Scoping Blueprint</span>
        </div>

        <p>© {currentYear} Webly. Built for Non-Technical B2B SaaS Founders.</p>

        <div className="flex items-center space-x-4">
          <a
            href="mailto:thedevvteam@gmail.com"
            className="hover:text-orange-400 transition-colors"
          >
            Contact Team
          </a>
        </div>
      </div>
    </footer>
  );
}

