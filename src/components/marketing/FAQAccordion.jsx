import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { frequentlyAskedQuestions } from '../../data/marketingContent';

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Transparent answers about capabilities, workflows, evaluation modes, and deployment.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {frequentlyAskedQuestions.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-brand-300 bg-brand-50/20 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed animate-in fade-in duration-200 border-t border-brand-100/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact inquiry card below FAQ */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <h4 className="font-bold text-slate-900 text-base">Have more specific questions?</h4>
          <p className="text-sm text-slate-600">
            Our team is available to discuss custom clinic workflow requirements, doctor rosters,
            and deployment questions.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              Contact our sales engineering team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
