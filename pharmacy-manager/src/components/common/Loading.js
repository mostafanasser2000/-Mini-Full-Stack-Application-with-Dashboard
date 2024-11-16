import React from "react";

const Loading = ({ size = "lg", variant = "primary" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-32 w-32",
  };

  const variantClasses = {
    primary: "border-blue-600",
    secondary: "border-gray-600",
    success: "border-green-600",
    warning: "border-yellow-600",
    danger: "border-red-600",
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className={`
          animate-spin
          rounded-full
          border-4
          border-t-transparent
          border-opacity-75
          transition-all
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
