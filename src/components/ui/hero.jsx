import React from 'react'
import { cn } from '../../lib/utils'

export function Hero({
  title,
  subtitle,
  children,
  className,
  backgroundClassName,
  contentClassName,
  titleClassName,
  subtitleClassName,
}) {
  return (
    <div className={cn(
      "relative w-full overflow-hidden bg-black text-white",
      backgroundClassName
    )}>
      <div className={cn(
        "container relative z-10 py-20 md:py-28",
        contentClassName
      )}>
        <div className="mx-auto max-w-3xl text-center">
          {title && (
            <h1 className={cn(
              "hero-title mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl",
              titleClassName
            )}>
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p className={cn(
              "hero-subtitle mb-8 text-lg text-muted-foreground md:text-xl",
              subtitleClassName
            )}>
              {subtitle}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </div>
  )
}
