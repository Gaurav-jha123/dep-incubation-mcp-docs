import { TabGroup, TabList, Tab } from "@headlessui/react";
import { Check } from "lucide-react";

export type Step = {
  title: string;
};

export type StepperPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export type StepperProps = {
  steps: Step[];
  currentStep: number;
  variant?: "default" | "minimal";
  onChange?: (step: number) => void;
  pseudoState?: StepperPseudoState;
  pseudoStateTarget?: number;
};

export default function Stepper({
  steps,
  currentStep,
  variant = "default",
  onChange,
  pseudoState = "none",
  pseudoStateTarget = 1,
}: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <TabGroup selectedIndex={currentStep} onChange={onChange}>
        <TabList className="flex items-start w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const pseudoStateData =
              index === pseudoStateTarget && pseudoState !== "none"
                ? pseudoState
                : undefined;
            const isDisabled = pseudoStateData === "disabled";

            const circleSize =
              variant === "minimal" ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm";

            return (
              <div key={index} className="flex items-start flex-1">
                {/* Step */}
                <Tab
                  disabled={isDisabled}
                  data-pseudo-state={pseudoStateData}
                  className="flex flex-col items-center outline-none transition-[transform,box-shadow] data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=active]:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div
                    data-pseudo-state={pseudoStateData}
                    className={`
                    flex items-center justify-center rounded-full border-2 transition
                    ${circleSize}
                    ${
                      isCompleted
                        ? "bg-primary-500 border-primary-500 text-primary-50"
                        : isActive
                          ? "border-primary-500"
                          : "border-neutral-200"
                    }
                    data-[pseudo-state=hover]:shadow-md
                    data-[pseudo-state=active]:scale-95
                    data-[pseudo-state=focus]:ring-2
                    data-[pseudo-state=focus]:ring-neutral-400/60
                    data-[pseudo-state=focus-visible]:ring-2
                    data-[pseudo-state=focus-visible]:ring-primary-500/40
                  `}
                  >
                    {variant === "minimal" ? (
                      ""
                    ) : isCompleted ? (
                      <Check aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={`mt-2 text-sm ${
                      isActive
                        ? "text-primary-700 font-medium"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </Tab>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div
                    className={`
                    flex-1 h-[2px] mx-3 mt-5
                    ${
                    variant === "minimal" ? "mt-[14px]" : "mt-[20px]"
                    }
                    ${index < currentStep ? "bg-primary-500" : "bg-neutral-200"}
                  `}
                  />
                )}
              </div>
            );
          })}
        </TabList>
      </TabGroup>
    </div>
  );
}