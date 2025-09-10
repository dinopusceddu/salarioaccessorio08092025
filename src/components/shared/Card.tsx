import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  titleClassName = '', 
  footer
}) => {
  return (
    <div className={`bg-white rounded-lg border border-[#f3e7e8] ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-[#f3e7e8] ${titleClassName}`}>
          <h3 className="text-lg font-bold text-[#1b0e0e] leading-tight">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-[#fcf8f8] border-t border-[#f3e7e8] rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};