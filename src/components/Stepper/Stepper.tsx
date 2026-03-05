import { TabGroup, TabList, Tab } from "@headlessui/react";

export type Step = {
  title: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
  variant?: "default" | "minimal";
  onChange?: (step: number) => void;
};

export default function Stepper({
  steps,
  currentStep,
  variant = "default",
  onChange,
}: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <TabGroup selectedIndex={currentStep} onChange={onChange}>
        <TabList className="flex items-start w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            const circleSize =
              variant === "minimal" ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm";

            return (
              <div key={index} className="flex items-start flex-1">
                {/* Step */}
                <Tab className="flex flex-col items-center outline-none">
                  <div
                    className={`
                    flex items-center justify-center rounded-full border-2 transition
                    ${circleSize}
                    ${
                      isCompleted
                        ? "bg-blue-500 border-blue-500 text-white"
                        : isActive
                        ? "border-blue-500 text-blue-500"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                  >
                    {variant === "minimal" ? "" : isCompleted ? "✓" : index + 1}
                  </div>

                  <span
                    className={`mt-2 text-sm ${
                      isActive ? "text-blue-600 font-medium" : "text-gray-500"
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
                    ${index < currentStep ? "bg-blue-500" : "bg-gray-300"}
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