import { NavigateFunction } from "react-router-dom";
import { TSteps } from "../types/types";

export const handleNext = (
  setCurrentStep: React.Dispatch<React.SetStateAction<TSteps>>,
  step: number,
  steps: TSteps[],
  navigate: NavigateFunction
) => {
  if (step < steps.length) {
    const index = step;
    const nextRoute = steps[index].title;
    navigate(nextRoute);
    setCurrentStep(steps[index]);
  }
};

export const handleBack = (
  setCurrentStep: React.Dispatch<React.SetStateAction<TSteps>>,
  step: number,
  steps: TSteps[],
  navigate: NavigateFunction
) => {
  if (step > 1) {
    const index = step - 1;
    const nextRoute = steps[index - 1].title;
    navigate(nextRoute);
    setCurrentStep(steps[index - 1]);
  }
};
