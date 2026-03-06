import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type TabsSize = "sm" | "md" | "lg";
type TabsVariant = "underline" | "solid" | "pill";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  children: React.ReactNode;
}

export interface TabListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface TabPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

type TabsRegistryItem = {
  value: string;
  ref: React.RefObject<HTMLButtonElement | null>;
  disabled?: boolean;
};

type TabsContextType = {
  value: string | undefined;
  setValue: (v: string) => void;
  size: TabsSize;
  variant: TabsVariant;
  idBase: string;

  registerTab: (
    value: string,
    ref: React.RefObject<HTMLButtonElement | null>,
    disabled?: boolean
  ) => void;

  unregisterTab: (value: string) => void;

  tabsRegistry: React.MutableRefObject<TabsRegistryItem[]>;
};

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsCtx() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  className = "",
  children,
}) => {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);

  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolledValue(v);
      onChange?.(v);
    },
    [isControlled, onChange]
  );

  const idBase = useId();
  const tabsRegistry = useRef<TabsRegistryItem[]>([]);

  const registerTab = useCallback(
    (
      value: string,
      ref: React.RefObject<HTMLButtonElement | null>,
      disabled?: boolean
    ) => {
      const existing = tabsRegistry.current.find((t) => t.value === value);
      if (!existing) {
        tabsRegistry.current.push({ value, ref, disabled });
      } else {
        existing.ref = ref;
        existing.disabled = disabled;
      }
    },
    []
  );

  const unregisterTab = useCallback((value: string) => {
    tabsRegistry.current = tabsRegistry.current.filter(
      (t) => t.value !== value
    );
  }, []);

  const ctxValue = useMemo<TabsContextType>(
    () => ({
      value: currentValue,
      setValue,
      size,
      variant,
      idBase,
      registerTab,
      unregisterTab,
      tabsRegistry,
    }),
    [
      currentValue,
      setValue,
      size,
      variant,
      idBase,
      registerTab,
      unregisterTab,
    ]
  );

  return (
    <TabsContext.Provider value={ctxValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({
  className = "",
  children,
  ...rest
}) => {
  const { idBase } = useTabsCtx();

  const base = "flex items-center gap-2 border-b border-gray-200";
  const combined = [base, className].join(" ");

  return (
    <div
      role="tablist"
      id={`${idBase}-tablist`}
      aria-orientation="horizontal"
      className={combined}
      {...rest}
    >
      {children}
    </div>
  );
};

const sizeClasses: Record<TabsSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-3",
};

const variantClasses: Record<
  TabsVariant,
  { base: string; active: string; inactive: string }
> = {
  underline: {
    base: "relative bg-transparent rounded-none",
    active:
      "text-blue-600 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-0.5 after:bg-blue-600",
    inactive: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
  },
  solid: {
    base: "rounded-md",
    active: "bg-blue-600 text-white",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  pill: {
    base: "rounded-full",
    active: "bg-blue-600 text-white",
    inactive: "text-gray-700 hover:bg-gray-100",
  },
};

export const Tab: React.FC<TabProps> = ({
  value,
  disabled = false,
  className = "",
  children,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const {
    value: active,
    setValue,
    size,
    variant,
    idBase,
    registerTab,
    unregisterTab,
    tabsRegistry,
  } = useTabsCtx();

  const isSelected = active === value;
  const btnRef = useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    registerTab(value, btnRef, disabled);
    return () => unregisterTab(value);
  }, [value, disabled]);

  const handleSelect = useCallback(
    (v: string) => {
      if (!disabled) setValue(v);
    },
    [disabled, setValue]
  );

  const handleKeyDownInternal = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const enabled = tabsRegistry.current.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.value === value);
    if (idx === -1) return;

    const focusTab = (i: number) => {
      const target = enabled[i];
      target?.ref.current?.focus();
      handleSelect(target.value);
    };

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab((idx + 1) % enabled.length);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab((idx - 1 + enabled.length) % enabled.length);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(enabled.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleSelect(value);
        break;
    }
  };

  const id = `${idBase}-tab-${value}`;
  const ariaControls = `${idBase}-panel-${value}`;

  const combinedClassName = [
    "inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant].base,
    isSelected ? variantClasses[variant].active : variantClasses[variant].inactive,
    className,
  ].join(" ");

  return (
    <button
      ref={btnRef}
      id={id}
      role="tab"
      aria-selected={isSelected}
      aria-controls={ariaControls}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={combinedClassName}
      onClick={(e) => {
        if (!disabled) handleSelect(value);
        onClick?.(e);
      }}
      onKeyDown={handleKeyDownInternal}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

export const TabPanels: React.FC<TabPanelsProps> = ({
  className = "",
  children,
  ...rest
}) => (
  <div className={["mt-3", className].join(" ")} {...rest}>
    {children}
  </div>
);

export const TabPanel: React.FC<TabPanelProps> = ({
  value,
  className = "",
  children,
  ...rest
}) => {
  const { value: active, idBase } = useTabsCtx();

  const isActive = active === value;
  const id = `${idBase}-panel-${value}`;
  const labelledBy = `${idBase}-tab-${value}`;

  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={!isActive}
      className={className}
      {...rest}
    >
      {isActive ? children : null}
    </div>
  );
};