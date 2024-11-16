import React from "react";
import { XCircle, AlertCircle, Ban, X } from "lucide-react";

const iconTypes = {
  error: XCircle,
  warning: AlertCircle,
  blocked: Ban,
};

const ErrorAlert = ({
  title = "Error",
  message,
  variant = "error",
  className = "",
  onClose,
  autoClose = 0,
}) => {
  const IconComponent = iconTypes[variant];

  React.useEffect(() => {
    if (autoClose > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const variantStyles = {
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    blocked: "bg-gray-50 border-gray-200 text-gray-900",
  };

  const iconStyles = {
    error: "text-red-500",
    warning: "text-yellow-500",
    blocked: "text-gray-500",
  };

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-lg border
        ${variantStyles[variant]}
        ${className}
      `}
      role="alert"
    >
      <IconComponent
        className={`h-5 w-5 ${iconStyles[variant]} flex-shrink-0 mt-0.5`}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded"
          aria-label="Close alert"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
