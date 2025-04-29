import React from 'react'
import { cn } from '../../lib/utils'

export function Section({
  children,
  className,
  containerClassName,
  background = "default", // default, muted, dark
  size = "default", // default, sm, lg
}) {
  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/50",
    dark: "bg-black text-white",
  }

  const sizeClasses = {
    sm: "py-8 md:py-12",
    default: "py-12 md:py-16",
    lg: "py-16 md:py-24",
  }

  return (
    <section className={cn(
      backgroundClasses[background],
      sizeClasses[size],
      className
    )}>
      <div className={cn(
        "container px-4",
        containerClassName
      )}>
        {children}
      </div>
    </section>
  )
}

export function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
  titleClassName,
  subtitleClassName,
}) {
  return (
    <div className={cn(
      "mb-10 md:mb-16",
      centered && "text-center",
      className
    )}>
      {title && (
        <h2 className={cn(
          "text-3xl font-bold tracking-tight md:text-4xl",
          titleClassName
        )}>
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className={cn(
          "mt-4 text-lg text-muted-foreground",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
