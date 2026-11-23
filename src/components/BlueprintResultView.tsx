'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BlueprintResult, FormResponses } from '@/types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  MailCheck,
  Flame,
  Target,
} from 'lucide-react';

interface BlueprintResultViewProps {
  blueprint: BlueprintResult;
  responses: FormResponses;
  onReset: () => void;
}

export default function BlueprintResultView({
  blueprint,
  responses,
  onReset,
}: BlueprintResultViewProps) {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FFA800', '#FF3D00', '#D4AF37', '#ffffff'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not supported
    }
  }, []);

  const isHighBand = blueprint.scoreBand === 'high';
  const isMediumBand = blueprint.scoreBand === 'medium';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Banner Alert for Email Delivery */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <MailCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-300">
              Blueprint sent to <span className="underline">{responses.email}</span>
            </p>
            <p className="text-[11px] text-zinc-400">
              A copy of this complete breakdown has been emailed to you for reference.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Quiz</span>
        </button>
      </div>

      {/* Main Score & Readiness Header Card */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-orange-500/50 via-amber-500/30 to-orange-600/10 shadow-gem-lg">
        <div className="bg-[#0E0F14]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              {/* Hot Lead / High Fit Badge */}
              {blueprint.isHighFit ? (
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High Fit — Ready for a 2-Week MVP Build</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Target className="w-3.5 h-3.5 text-orange-400" />
                  <span>MVP Readiness Assessment</span>
                </div>
              )}

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {blueprint.bandTitle}
              </h2>
              <p className="text-base sm:text-lg text-orange-400/90 font-medium mt-1">
                {blueprint.bandMessage}
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex sm:flex-col items-baseline sm:items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 sm:min-w-[140px] text-center">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {blueprint.totalScore}
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 ml-2 sm:ml-0 sm:mt-1">
                / 100 PTS
              </span>
            </div>
          </div>

          {/* Score Category Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {blueprint.scoreBreakdown.map((cat, idx) => {
              const pct = Math.min(Math.round((cat.score / cat.maxScore) * 100), 100);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    {cat.category}
                  </span>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1.5">
                    <span>{cat.score} pts</span>
                    <span className="text-zinc-500">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Summary Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#111217] border border-white/[0.08] shadow-gem">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Product Summary</span>
        </div>
        <p className="text-lg sm:text-xl font-serif text-white leading-relaxed">
          {blueprint.productSummary}
        </p>

        {/* User Workflow Statement */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Core Version One User Workflow:
          </span>
          <p className="text-sm sm:text-base text-zinc-200 font-mono">
            "{blueprint.coreWorkflowSummary}"
          </p>
        </div>
      </div>

      {/* Two Column Breakdown: Build First vs Leave Out For Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. BUILD FIRST (V1 Core Essentials) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#111217] border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Build First <span className="text-xs font-sans font-medium text-emerald-400">(V1 Core Essentials)</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              These are the only elements required to deliver your core outcome in 2 weeks:
            </p>

            <ul className="space-y-3.5">
              {blueprint.buildFirstList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-emerald-400/90 font-medium">
            ✓ Focused strictly on proving customer adoption without wasted code.
          </div>
        </div>

        {/* 2. LEAVE OUT FOR NOW (Defer) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#111217] border border-red-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Leave Out For Now <span className="text-xs font-sans font-medium text-red-400">(Defer)</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Cut these from version one to prevent scope creep and guarantee launch speed:
            </p>

            <ul className="space-y-3.5">
              {blueprint.deferList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-zinc-300">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <strong className="text-white font-semibold">{item.feature}:</strong>{' '}
                    <span className="text-zinc-400">{item.reason}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-red-400/90 font-medium">
            ✕ Adding these early will delay your launch by 2 to 4 months.
          </div>
        </div>
      </div>

      {/* Biggest Risk Diagnosis Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-amber-500/[0.06] border border-amber-500/30 flex items-start space-x-4">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-1">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Biggest Risk Identified
          </span>
          <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
            {blueprint.biggestRisk}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2">
            Most first-time software founders fail not because their technology is bad, but because they build too much before their first paying customer touches the core workflow.
          </p>
        </div>
      </div>

      {/* Primary CTA Section */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 shadow-gem-lg text-center overflow-hidden">
        <div className="bg-[#0C0D12]/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Next Step: 30-Minute MVP Scoping Call</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
            Want to Turn This Into an Exact 2-Week Build Plan?
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Let’s review your answers together, lock down the smallest high-converting version of your software, and outline the exact roadmap to launch.
          </p>

          <a
            href={blueprint.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-sm sm:text-base uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 shadow-gem-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            <span>{blueprint.ctaText}</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-xs text-zinc-500 mt-4">
            Free 30-minute scoping session with Safiyah from webly • Zero obligation.
          </p>
        </div>
      </div>
    </div>
  );
}

