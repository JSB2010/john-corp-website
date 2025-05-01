import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button component with Apple-inspired design
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.to - Link destination (if button is a link)
 * @param {string} props.href - External link destination
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {string} props.type - Button type (button, submit, reset)
 */
export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  ...props
}) {
  // Base classes for all button variants
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transform hover:scale-105',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm hover:shadow-md transform hover:scale-105',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50 transform hover:scale-105',
    text: 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 bg-transparent',
    dark: 'bg-gray-900 hover:bg-black text-white shadow-sm hover:shadow-md transform hover:scale-105',
  };
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;
  
  // Render as Link if 'to' prop is provided (internal link)
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }
  
  // Render as anchor if 'href' prop is provided (external link)
  if (href) {
    return (
      <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
