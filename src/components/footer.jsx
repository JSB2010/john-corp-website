import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram } from 'lucide-react'

import { Separator } from './ui/separator'

export function Footer() {
  return (
    <footer className="bg-secondary/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div>
            <h4 className="mb-4 text-sm font-medium">Products</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="transition-colors hover:text-foreground">
                  Jizz Tech Original
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition-colors hover:text-foreground">
                  Jizz Tech Pro
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition-colors hover:text-foreground">
                  Jizz Tech Quick
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition-colors hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition-colors hover:text-foreground">
                  Compare
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-medium">About John Corp</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  Our Company
                </Link>
              </li>
              <li>
                <Link to="/founder" className="transition-colors hover:text-foreground">
                  Our Founder
                </Link>
              </li>
              <li>
                <Link to="/filmmaking" className="transition-colors hover:text-foreground">
                  Filmmaking
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  Innovation
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  Values
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-medium">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Product Support
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  FAQs
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Warranty
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Service Programs
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-medium">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <button className="transition-colors hover:text-foreground">
                  Careers
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Newsroom
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Investors
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Ethics & Compliance
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-foreground">
                  Events
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-medium">Connect</h4>
            <div className="flex space-x-3 mb-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: info@johncorp.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>
                123 Innovation Way<br />
                Tech City, TC 12345<br />
                United States
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            Copyright © {new Date().getFullYear()} John Corp. All rights reserved. Innovating since 1634.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <button className="transition-colors hover:text-foreground">Privacy Policy</button>
            <button className="transition-colors hover:text-foreground">Terms of Use</button>
            <button className="transition-colors hover:text-foreground">Sales Policy</button>
            <button className="transition-colors hover:text-foreground">Legal</button>
            <button className="transition-colors hover:text-foreground">Site Map</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
