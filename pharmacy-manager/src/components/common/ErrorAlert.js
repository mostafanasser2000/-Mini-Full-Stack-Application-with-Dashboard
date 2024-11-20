import React from "react";
import { XCircle, AlertCircle, Ban, X } from "lucide-react";

const iconTypes = {
  error: XCircle,
  warning: AlertCircle,
  blocked: Ban,
};

const ErrorAlert = ({
  errors = {},
  variant = "error",
  className = "",
  onClose,
  autoClose = 0,
}) => {
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

  // Flatten the errors into an array for easier rendering
  const formattedErrors = Object.entries(errors).flatMap(([field, messages]) =>
    Array.isArray(messages)
      ? messages.map((msg) => ({ field, message: msg }))
      : [{ field, message: messages }]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {formattedErrors.map((error, index) => {
        return (
          <div
            key={index}
            className={`flex items-center justify-between p-4 border rounded ${variantStyles[variant]}`}
          >
            <div className="flex items-center space-x-2">
              <div>
                {error.field !== "non_field_errors" && (
                  <h3 className="font-semibold capitalize">
                    {error.field.replace("_", " ")}
                  </h3>
                )}
                <p className="text-sm">{error.message}</p>
              </div>
            </div>

            {onClose && (
              <button
                className="ml-4 text-gray-400 hover:text-gray-600"
                onClick={() => onClose(index)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ErrorAlert;
