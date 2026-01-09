
import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = "flex items-center justify-center h-14 w-full rounded-xl font-medium transition-all duration-200 active:scale-95 text-lg shadow-sm";
  
  const variants = {
    primary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    accent: "bg-indigo-600 text-white hover:bg-indigo-500 font-bold",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
