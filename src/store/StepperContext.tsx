import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type StepperContextValue = {
  currentStep: number;
  setStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
  totalSteps?: number;
};

const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);

type StepperProviderProps = {
  children: React.ReactNode;
  initialStep?: number;
  totalSteps?: number;
  persistKey?: string;
};

export function StepperProvider({
  children,
  initialStep = 0,
  totalSteps,
  persistKey,
}: StepperProviderProps) {
  const readInitial = () => {
    if (!persistKey) return initialStep;
    try {
      const v = sessionStorage.getItem(persistKey);
      return v !== null ? Number(v) : initialStep;
    } catch {
      return initialStep;
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(readInitial);

  const persist = useCallback(
    (step: number) => {
      if (!persistKey) return;
      try {
        sessionStorage.setItem(persistKey, String(step));
      } catch {}
    },
    [persistKey]
  );

  const setStep = useCallback(
    (step: number) => {
      const clamped =
        typeof totalSteps === "number"
          ? Math.max(0, Math.min(step, Math.max(0, totalSteps - 1)))
          : Math.max(0, step);
      setCurrentStep(clamped);
      persist(clamped);
    },
    [persist, totalSteps]
  );

  const goNext = useCallback(() => {
    setStep(currentStep + 1);
  }, [currentStep, setStep]);

  const goBack = useCallback(() => {
    setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const reset = useCallback(() => {
    setStep(0);
  }, [setStep]);

  const value = useMemo(
    () => ({ currentStep, setStep, goNext, goBack, reset, totalSteps }),
    [currentStep, goNext, goBack, reset, totalSteps]
  );

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
}

export function useStepper() {
  const context = useContext(StepperContext);
  if (!context)
    throw new Error("useStepper must be used within a StepperProvider");
  return context;
}
