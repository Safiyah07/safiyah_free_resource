'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MultiStepForm from '@/components/MultiStepForm';
import BlueprintResultView from '@/components/BlueprintResultView';
import Footer from '@/components/Footer';
import { BlueprintResult, FormResponses } from '@/types';

export default function Home() {
  const [blueprintResult, setBlueprintResult] = useState<BlueprintResult | null>(null);
  const [userResponses, setUserResponses] = useState<FormResponses | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleFormComplete = (blueprint: BlueprintResult, responses: FormResponses) => {
    setBlueprintResult(blueprint);
    setUserResponses(responses);

    // Smoothly scroll into result view
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleReset = () => {
    setBlueprintResult(null);
    setUserResponses(null);

    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#08080A] bg-grid-pattern relative flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Header />

      <div className="flex-1">
        {/* Editorial Hero Header */}
        {!blueprintResult && (
          <Hero
            onStartClick={() => {
              formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        )}

        {/* MultiStep Form or Instant Blueprint Result */}
        <section ref={formSectionRef} className="py-6 sm:py-10">
          {!blueprintResult ? (
            <MultiStepForm onComplete={handleFormComplete} />
          ) : (
            userResponses && (
              <BlueprintResultView
                blueprint={blueprintResult}
                responses={userResponses}
                onReset={handleReset}
              />
            )
          )}
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

