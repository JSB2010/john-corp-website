import React from 'react';
import { ScrollReveal } from './ScrollReveal';

/**
 * Section component for consistent layout and spacing
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Section ID for navigation
 * @param {boolean} props.fullWidth - Whether section should be full width
 * @param {string} props.background - Background color or class
 * @param {boolean} props.animate - Whether to animate section on scroll
 * @param {string} props.animationType - Type of animation
 * @param {number} props.animationDelay - Delay before animation starts
 * @param {boolean} props.withContainer - Whether to wrap content in a container
 */
export function Section({
  children,
  className = '',
  id,
  fullWidth = false,
  background = '',
  animate = true,
  animationType = ScrollReveal.ANIMATION_TYPES.FADE_UP,
  animationDelay = 0,
  withContainer = true,
}) {
  const sectionContent = withContainer ? (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${fullWidth ? 'max-w-none' : ''}`}>
      {children}
    </div>
  ) : children;

  const sectionClasses = `py-12 md:py-16 lg:py-20 ${background} ${className}`;

  return animate ? (
    <section id={id} className={sectionClasses}>
      <ScrollReveal type={animationType} delay={animationDelay}>
        {sectionContent}
      </ScrollReveal>
    </section>
  ) : (
    <section id={id} className={sectionClasses}>
      {sectionContent}
    </section>
  );
}

/**
 * Grid component for responsive layouts
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid content
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.cols - Number of columns on desktop
 * @param {string} props.gap - Gap size between grid items
 */
export function Grid({
  children,
  className = '',
  cols = 3,
  gap = 'gap-6 md:gap-8',
}) {
  let gridCols;
  
  switch (cols) {
    case 1:
      gridCols = 'grid-cols-1';
      break;
    case 2:
      gridCols = 'grid-cols-1 sm:grid-cols-2';
      break;
    case 3:
      gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      break;
    case 4:
      gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      break;
    default:
      gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }

  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Container component for consistent max-width and padding
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.narrow - Whether container should be narrow
 */
export function Container({
  children,
  className = '',
  narrow = false,
}) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${narrow ? 'max-w-4xl' : ''} ${className}`}>
      {children}
    </div>
  );
}
