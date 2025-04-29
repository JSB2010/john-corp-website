import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'

import { Button } from './ui/button'
import { cn } from '../lib/utils'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold tracking-tight">JOHN CORP</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Products
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link to="/founder" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Founder
            </Link>
            <Link to="/filmmaking" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Films
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/payments" className="flex items-center space-x-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">(3)</span>
            </Link>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Link to="/payments" className="mr-4 flex items-center space-x-1">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">(3)</span>
          </Link>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "container md:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <nav className="flex flex-col space-y-4 py-4">
          <Link 
            to="/products" 
            className="text-sm font-medium transition-colors hover:text-foreground/80"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium transition-colors hover:text-foreground/80"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/founder" 
            className="text-sm font-medium transition-colors hover:text-foreground/80"
            onClick={() => setIsMenuOpen(false)}
          >
            Founder
          </Link>
          <Link 
            to="/filmmaking" 
            className="text-sm font-medium transition-colors hover:text-foreground/80"
            onClick={() => setIsMenuOpen(false)}
          >
            Films
          </Link>
          <Link 
            to="/contact" 
            className="text-sm font-medium transition-colors hover:text-foreground/80"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
