import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "lucide-react";

interface TypographyProps {
  /** typography variant: h1, h2, h3, h4, h5, h6, body, caption */
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "caption";

  /** content inside typography */
  children: React.ReactNode;

  className?: string;

  /** makes heading collapsible */
  collapsible?: boolean;
}

const variantMap = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold",
  body: "text-base",
  caption: "text-sm text-gray-600",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  children,
  className = "",
  collapsible = false,
}) => {
  const baseClass = variantMap[variant];

  if (collapsible) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`${baseClass} ${className} flex items-center gap-2 hover:text-blue-600 transition-colors`}
            >
              {children}
              <ChevronUpIcon
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 py-2 text-gray-700 bg-gray-50 rounded mt-2">
              Additional content goes here
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }

  return <div className={`${baseClass} ${className}`}>{children}</div>;
};
