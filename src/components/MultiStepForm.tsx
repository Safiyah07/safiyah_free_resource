'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '@/lib/questions';
import { FormResponses, BlueprintResult, Question } from '@/types';
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2, Lock, ShieldCheck } from 'lucide-react';

interface MultiStepFormProps {
  onComplete: (blueprint: BlueprintResult, responses: FormResponses) => void;
}

export default function MultiStepForm({ onComplete }: MultiStepFormProps) {
  // Current step: 0 to 9 for Questions 1-10; 10 for Contact Info Screen
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [responses, setResponses] = useState<FormResponses>({
    q1_productType: '',
    q2_stage: '',
    q3_targetCustomer: '',
    q4_problem: '',
    q5_currentSolution: [],
    q6_mainOutcome: '',
    q7_userJourney: '',
    q8_features: [],
    q9_timeline: '',
    q10_investment: '',
    firstName: '',
    email: '',
    phone: '',
  });

  const totalSteps = QUESTIONS.length + 1; // 10 questions + 1 contact step
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const currentQuestion: Question | undefined = QUESTIONS[currentStep];

  // Advance to next step
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  // Go to previous step
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Single choice selection handler
  const handleSingleSelect = (fieldName: keyof FormResponses, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldName]: value }));
    // Auto-advance for ultra-smooth Typeform feel
    setTimeout(() => {
      handleNext();
    }, 280);
  };

  // Multiple choice selection handler
  const handleMultiToggle = (fieldName: 'q5_currentSolution' | 'q8_features', value: string) => {
    setResponses((prev) => {
      const currentList = prev[fieldName] || [];
      const exists = currentList.includes(value);

      // Handle "I'm not sure" mutually exclusive logic for Q5
      if (fieldName === 'q5_currentSolution' && value.includes('not sure')) {
        return { ...prev, [fieldName]: exists ? [] : [value] };
      }

      let updatedList = exists
        ? currentList.filter((item) => item !== value)
        : [...currentList.filter((item) => !item.includes('not sure')), value];

      return { ...prev, [fieldName]: updatedList };
    });
  };

  // Keyboard navigation listener (A, B, C, D, Enter, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        handlePrev();
        return;
      }

      if (currentQuestion && currentQuestion.type === 'single' && currentQuestion.options) {
        const keyChar = e.key.toUpperCase();
        const matched = currentQuestion.options.find((opt) => opt.key === keyChar);
        if (matched) {
          const fieldMap: Record<number, keyof FormResponses> = {
            1: 'q1_productType',
            2: 'q2_stage',
            6: 'q6_mainOutcome',
            9: 'q9_timeline',
            10: 'q10_investment',
          };
          const field = fieldMap[currentQuestion.id];
          if (field) {
            handleSingleSelect(field, matched.value);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, currentQuestion, handleNext, handlePrev]);

  // Submission handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError(null);

    if (!responses.firstName.trim()) {
      setSubmitError('Please enter your first name.');
      return;
    }

    if (!responses.email.trim() || !responses.email.includes('@')) {
      setSubmitError('Please enter a valid email address to receive your blueprint.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responses),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate blueprint.');
      }

      onComplete(data.blueprint, responses);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Determine if Next button is disabled
  const isNextDisabled = () => {
    if (currentStep === 10) {
      return !responses.firstName.trim() || !responses.email.trim();
    }
    if (!currentQuestion) return false;

    if (currentQuestion.id === 1) return !responses.q1_productType;
    if (currentQuestion.id === 2) return !responses.q2_stage;
    if (currentQuestion.id === 3) return !responses.q3_targetCustomer.trim();
    if (currentQuestion.id === 4) return !responses.q4_problem.trim();
    if (currentQuestion.id === 5) return (responses.q5_currentSolution || []).length === 0;
    if (currentQuestion.id === 6) return !responses.q6_mainOutcome;
    if (currentQuestion.id === 7) return !responses.q7_userJourney.trim();
    if (currentQuestion.id === 8) return (responses.q8_features || []).length === 0;
    if (currentQuestion.id === 9) return !responses.q9_timeline;
    if (currentQuestion.id === 10) return !responses.q10_investment;

    return false;
  };

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    }),
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative">
      {/* Outer Gemstone Glowing Frame */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-orange-500/40 via-amber-500/20 to-orange-600/10 shadow-gem-lg">
        {/* Inner Card Container */}
        <div className="relative bg-[#0E0F14]/95 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/[0.06] flex flex-col min-h-[580px] sm:min-h-[620px]">
          {/* Progress Header */}
          <div className="px-6 sm:px-10 pt-8 pb-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold tracking-widest text-orange-400">
                {currentStep < 10 ? `Step ${currentQuestion?.questionNumber} of 10` : 'Final Step'}
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400 font-medium">
                {currentStep < 10 ? 'MVP Scoping Blueprint' : 'Blueprint Delivery'}
              </span>
            </div>

            {/* Percentage Bar & Pill */}
            <div className="flex items-center space-x-3">
              <div className="w-24 sm:w-36 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-400 w-8 text-right">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 px-6 sm:px-10 py-8 flex flex-col justify-center">
            {isSubmitting ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-gem animate-pulse">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  Assembling Your MVP Scope Blueprint...
                </h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Calculating readiness score, tailoring your 2-week build-first list, and screening deferrals...
                </p>
              </div>
            ) : (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  {/* Step 1 to 10 Questions */}
                  {currentStep < 10 && currentQuestion && (
                    <div>
                      {/* Question Index Badge & Title */}
                      <div className="flex items-start space-x-4 mb-4">
                        <span className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {currentQuestion.questionNumber}
                        </span>
                        <div>
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-white leading-snug">
                            {currentQuestion.title}
                            <span className="text-orange-500 ml-1">*</span>
                          </h2>
                          {currentQuestion.subtitle && (
                            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                              {currentQuestion.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Options / Inputs according to type */}
                      <div className="mt-6 space-y-3">
                        {/* 1. Single Select Options */}
                        {currentQuestion.type === 'single' && currentQuestion.options && (
                          <div className="grid grid-cols-1 gap-2.5">
                            {currentQuestion.options.map((opt) => {
                              const fieldMap: Record<number, keyof FormResponses> = {
                                1: 'q1_productType',
                                2: 'q2_stage',
                                6: 'q6_mainOutcome',
                                9: 'q9_timeline',
                                10: 'q10_investment',
                              };
                              const currentVal = responses[fieldMap[currentQuestion.id]] as string;
                              const isSelected = currentVal === opt.value;

                              return (
                                <button
                                  key={opt.key || opt.value}
                                  type="button"
                                  onClick={() => handleSingleSelect(fieldMap[currentQuestion.id], opt.value)}
                                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${isSelected
                                    ? 'border-orange-500 bg-orange-500/15 shadow-gem'
                                    : 'border-white/[0.08] bg-white/[0.02] hover:border-orange-500/40 hover:bg-white/[0.05]'
                                    }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span
                                      className={`w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center border transition-colors ${isSelected
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'bg-zinc-900 border-white/10 text-zinc-400 group-hover:border-orange-400/50 group-hover:text-zinc-200'
                                        }`}
                                    >
                                      {opt.key}
                                    </span>
                                    <span
                                      className={`text-sm sm:text-base font-medium ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                                        }`}
                                    >
                                      {opt.label}
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <Check className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* 2. Multi-Select Options (Q5 & Q8) */}
                        {currentQuestion.type === 'multiple' && currentQuestion.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {currentQuestion.options.map((opt) => {
                              const fieldName =
                                currentQuestion.id === 5 ? 'q5_currentSolution' : 'q8_features';
                              const currentList = responses[fieldName] || [];
                              const isSelected = currentList.includes(opt.value);

                              return (
                                <button
                                  key={opt.key || opt.value}
                                  type="button"
                                  onClick={() => handleMultiToggle(fieldName, opt.value)}
                                  className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${isSelected
                                    ? 'border-orange-500 bg-orange-500/15 shadow-gem'
                                    : 'border-white/[0.08] bg-white/[0.02] hover:border-orange-500/40 hover:bg-white/[0.05]'
                                    }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'border-zinc-700 bg-zinc-900 group-hover:border-orange-500/50'
                                        }`}
                                    >
                                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span
                                      className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                                        }`}
                                    >
                                      {opt.label}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* 3. Short Free-Text Field (Q3) */}
                        {currentQuestion.type === 'text' && (
                          <div>
                            <input
                              type="text"
                              value={responses.q3_targetCustomer}
                              onChange={(e) =>
                                setResponses((prev) => ({
                                  ...prev,
                                  q3_targetCustomer: e.target.value,
                                }))
                              }
                              placeholder={currentQuestion.placeholder}
                              autoFocus
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all"
                            />
                            <p className="text-xs text-zinc-500 mt-2">
                              Press <strong className="text-zinc-300">Enter ↵</strong> when ready to proceed.
                            </p>
                          </div>
                        )}

                        {/* 4. Long Free-Text Field (Q4 & Q7) */}
                        {currentQuestion.type === 'textarea' && (
                          <div>
                            <textarea
                              rows={4}
                              value={
                                currentQuestion.id === 4
                                  ? responses.q4_problem
                                  : responses.q7_userJourney
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (currentQuestion.id === 4) {
                                  setResponses((prev) => ({ ...prev, q4_problem: val }));
                                } else {
                                  setResponses((prev) => ({ ...prev, q7_userJourney: val }));
                                }
                              }}
                              placeholder={currentQuestion.placeholder}
                              autoFocus
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all resize-none"
                            />
                            <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
                              <span>Specific workflows help us map an exact 2-week MVP scope.</span>
                              <span>
                                {currentQuestion.id === 4
                                  ? `${responses.q4_problem.length} chars`
                                  : `${responses.q7_userJourney.length} chars`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 11: Contact Capture Screen */}
                  {currentStep === 10 && (
                    <div>
                      {/* Gemstone Sparkle Badge */}
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        <span>Almost Done</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
                        Your MVP Scope Blueprint is almost ready.
                      </h2>
                      <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                        Enter your details to see the smallest version of your product you should build first—and what to leave out for now.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            First Name <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={responses.firstName}
                            onChange={(e) =>
                              setResponses((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                            placeholder="e.g. Alex"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            Email Address <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={responses.email}
                            onChange={(e) =>
                              setResponses((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="alex@company.com"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all"
                          />
                          <span className="text-[11px] text-zinc-500 mt-1 block">
                            We’ll send your full customized Scope Blueprint & Build-First list here.
                          </span>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                            Phone Number<span className="text-orange-500">*</span>
                            {/* <span className="text-zinc-500 font-normal lowercase">for WhatsApp follow-up</span> */}
                          </label>
                          <input
                            type="tel"
                            required
                            value={responses.phone}
                            onChange={(e) =>
                              setResponses((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all"
                          />
                        </div>

                        {submitError && (
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                            {submitError}
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting || !responses.firstName.trim() || !responses.email.trim()}
                            className="w-full py-4 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 shadow-gem-lg hover:shadow-gem transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <span>Generate My MVP Scope Blueprint</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-500 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>100% Privacy. Instant on-screen results + email copy.</span>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Bottom Navigation Bar */}
          {!isSubmitting && (
            <div className="px-6 sm:px-10 py-5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between">
              {/* Back Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors ${currentStep === 0
                  ? 'border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'border-white/10 text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Next / Submit Button */}
              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-gem flex items-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>OK</span>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline text-[10px] text-white/80 font-normal ml-1">
                    Press Enter ↵
                  </span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

