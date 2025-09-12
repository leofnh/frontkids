import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBase({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
