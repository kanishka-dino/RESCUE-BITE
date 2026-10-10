import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs py-2 px-3.5 gap-1.5',
    md: 'text-sm py-2.5 px-5 gap-2',
    lg: 'text-base py-3 px-6 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#166534] hover:bg-[#12372A] text-white shadow-xs focus-visible:ring-[#166534]',
    secondary:
      'bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#12372A] focus-visible:ring-[#22C55E]',
    outline:
      'border border-[#12372A]/20 hover:border-[#166534] hover:bg-[#F5FAF4] text-[#17231D] focus-visible:ring-[#166534]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500',
    ghost:
      'text-[#647067] hover:text-[#17231D] hover:bg-black/5 focus-visible:ring-gray-400',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
