import React from "react";

type AlertType = "success" | "error" | "warning" | "info";
type IconKey = AlertType | "close";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  message: string;
  closable?: boolean;
  onClose?: () => void;
}

const alertStyles: Record<AlertType, React.CSSProperties> = {
  success: {
    background: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
  warning: {
    background: "#fff3cd",
    color: "#856404",
    border: "1px solid #ffeeba",
  },
  info: {
    background: "#d1ecf1",
    color: "#0c5460",
    border: "1px solid #bee5eb",
  },
};

const icons: Record<IconKey, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4m0 4h.01M4.93 19h14.14c.86 0 1.4-.93.97-1.67L12.97 5.3a1.1 1.1 0 00-1.94 0L3.96 17.33c-.43.74.11 1.67.97 1.67z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8h.01M11 11h1v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  close: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  closable = false,
  onClose,
  children,
  className,
  style,
  ...rest
}) => (
  <div
    style={{
      ...alertStyles[type],
      padding: "12px 16px",
      borderRadius: "4px",
      margin: "8px 0",
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      ...style,
    }}
    className={className}
    role="alert"
    {...rest}
  >
    <span
      style={{
        marginRight: "12px",
        marginTop: "1px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {icons[type]}
    </span>
    <span style={{ flex: 1 }}>{children ?? message}</span>
    {closable && (
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginLeft: "12px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Close"
      >
        {icons.close}
      </button>
    )}
  </div>
);
