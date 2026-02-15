// src/shared/components/Button/SoftButton.tsx
import React from 'react';

interface SoftButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

const SoftButton: React.FC<SoftButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  className = '',
}) => {
  const baseStyles = 'rounded-soft font-soft transition-all duration-300 transform hover:scale-105 hover:shadow-soft active:scale-95';
  
  const variants = {
    primary: 'bg-primary-warm text-white hover:bg-primary-soft hover:text-gray-700',
    secondary: 'bg-secondary-cream text-gray-700 hover:bg-primary-soft',
    outline: 'border-2 border-primary-warm text-primary-warm hover:bg-primary-soft hover:text-gray-700',
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default SoftButton;