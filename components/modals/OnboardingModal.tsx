'use client';

import { useState, useEffect } from 'react';
import { X, Layers, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

const STEPS = [
  {
    icon: Layers,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
    title: 'Welcome to StreamPay',
    desc: 'The programmable billing protocol for Solana. This is a demo dashboard with simulated data — explore all features freely.',
  },
  {
    icon: Shield,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    title: 'Spend Authorizations',
    desc: 'The core primitive. Create one-time authorizations that let apps charge you within defined limits. You stay in full control.',
  },
  {
    icon: Zap,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    title: 'Real-Time Billing',
    desc: 'Enable Demo Mode in the top bar to simulate live API calls, subscription renewals, and usage charges updating in real-time.',
  },
];

export function OnboardingModal() {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.onboardingDone) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [state.onboardingDone]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => dispatch({ type: 'COMPLETE_ONBOARDING' }), 300);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (state.onboardingDone || !visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Steps indicator */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'bg-sky-400 flex-1' : i < step ? 'bg-sky-400/40 w-4' : 'bg-border w-4'
              }`}
            />
          ))}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${current.iconBg} flex items-center justify-center mb-5`}>
          <Icon className={`w-6 h-6 ${current.iconColor}`} />
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-2">{current.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.desc}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {step + 1} of {STEPS.length}
          </span>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-400 text-background font-medium"
              onClick={handleNext}
            >
              {step < STEPS.length - 1 ? (
                <>Next <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
