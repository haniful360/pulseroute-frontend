import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
  stepTitle,
}) => {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  const isComplete = currentStep === totalSteps;

  return (
    <div className="mx-auto mb-8 w-full max-w-2xl">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold tracking-wider uppercase">
        <span className={isComplete ? 'text-emerald-600' : 'text-red-600'}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-slate-400">{percentage}% Complete</span>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {stepTitle}
        </h2>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete ? 'bg-emerald-500' : 'bg-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
