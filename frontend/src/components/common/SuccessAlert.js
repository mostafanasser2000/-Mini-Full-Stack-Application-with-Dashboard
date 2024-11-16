import React from "react";
import { CheckCircle2, X } from "lucide-react";

const SuccessAlert = ({
  message,
  onClose,
  title = "Success",
  autoClose = 3000,
  className = "",
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); 
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        bg-green-50 border border-green-200 rounded-lg p-4 mb-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2
          className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <p className="mt-1 text-sm text-green-700">{message}</p>
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 rounded-lg p-1.5 inline-flex text-green-600 hover:text-green-800 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
