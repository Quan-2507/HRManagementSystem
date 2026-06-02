import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
