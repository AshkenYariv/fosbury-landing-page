"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/demo/Stepper";
import { ConnectScene } from "@/components/demo/ConnectScene";
import { CloseScene } from "@/components/demo/CloseScene";
import { MarginScene } from "@/components/demo/MarginScene";
import { CtaScene } from "@/components/demo/CtaScene";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Step = 1 | 2 | 3 | 4;

export function DemoExperience() {
  const [step, setStep] = useState<Step>(1);
  const [canAdvance, setCanAdvance] = useState(false);

  useEffect(() => {
    trackEvent("demo_view");
  }, []);

  useEffect(() => {
    setCanAdvance(false);
  }, [step]);

  const next = () => {
    if (step === 4) return;
    if (step === 1) trackEvent("demo_connect_completed");
    setStep((s) => (Math.min(4, s + 1) as Step));
  };

  const back = () => {
    if (step === 1) return;
    setStep((s) => (Math.max(1, s - 1) as Step));
  };

  const restart = () => {
    trackEvent("demo_restart");
    setStep(1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-10 pt-24 sm:pt-28">
        <div className="mb-8 sm:mb-12">
          <Stepper current={step} onJump={(s) => setStep(s)} />
        </div>

        <div key={step} className="min-h-[60vh]">
          {step === 1 && <ConnectScene onReady={() => setCanAdvance(true)} />}
          {step === 2 && <CloseScene onReady={() => setCanAdvance(true)} />}
          {step === 3 && <MarginScene onReady={() => setCanAdvance(true)} />}
          {step === 4 && <CtaScene onRestart={restart} />}
        </div>

        {step < 4 && (
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              size="md"
              onClick={back}
              disabled={step === 1}
              className={cn(step === 1 && "invisible")}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M11 3.5L6.5 8 11 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </Button>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[11px] uppercase tracking-eyebrow text-faint sm:inline">
                {canAdvance ? "Ready" : "Try the step above"}
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={next}
                disabled={!canAdvance}
              >
                Continue
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M5 3.5L9.5 8 5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
