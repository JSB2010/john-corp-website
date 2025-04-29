import React, { useState } from 'react'
import { ShoppingCart, Trash2, CreditCard, Check } from 'lucide-react'

import { Hero } from '../components/ui/hero'
import { Section, SectionTitle } from '../components/ui/section'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'

function Payments() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [step, setStep] = useState('cart') // cart, checkout, confirmation

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item =>
      item.id === id ? {...item, quantity: newQuantity} : item
    ))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 12.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Your Cart"
        subtitle="Review your items and complete your purchase."
        backgroundClassName="bg-gradient-to-br from-black to-gray-900"
      />

      {step === 'cart' && (
        <Section size="lg">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <SectionTitle
                title="Shopping Cart"
                className="md:text-left mb-6"
              />

              {cartItems.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                      <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
                      <Button asChild>
                        <a href="/products">Continue Shopping</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <Card key={item.id} className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="bg-muted/50 h-24 w-24 flex-shrink-0 rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">Product Image</p>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-r-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <div className="h-8 px-3 flex items-center justify-center border-y">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-l-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionTitle
                title="Order Summary"
                className="md:text-left mb-6"
              />

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <Button
                      className="w-full mt-4"
                      size="lg"
                      disabled={cartItems.length === 0}
                      onClick={() => setStep('checkout')}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      )}

      {step === 'checkout' && (
        <Section size="lg">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <SectionTitle
                title="Checkout"
                className="md:text-left mb-6"
              />

              <Card className="border-0 shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" placeholder="10001" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="flex">
                        <Input id="card-number" placeholder="4242 4242 4242 4242" />
                        <CreditCard className="ml-2 h-5 w-5 text-muted-foreground self-center" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="John Doe" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('cart')}>
                    Back to Cart
                  </Button>
                  <Button onClick={() => setStep('confirmation')}>
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <SectionTitle
                title="Order Summary"
                className="md:text-left mb-6"
              />

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      )}

      {step === 'confirmation' && (
        <Section size="lg">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <SectionTitle
              title="Order Confirmed!"
              centered={true}
            />
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
              We've sent a confirmation email to your inbox with all the details.
            </p>
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h3 className="font-medium mb-2">Order Number</h3>
              <p className="text-muted-foreground mb-4">#JC-{Math.floor(100000 + Math.random() * 900000)}</p>
              <Separator className="my-4" />
              <h3 className="font-medium mb-2">Estimated Delivery</h3>
              <p className="text-muted-foreground">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </Section>
      )}
    </div>
  )
}

// Initial cart items data
const initialCartItems = [
  {
    id: 1,
    name: "Jizz Tech Original",
    description: "Our flagship adhesive product, perfect for general-purpose applications.",
    price: 19.99,
    quantity: 2
  },
  {
    id: 2,
    name: "Jizz Tech Pro",
    description: "Industrial-grade adhesive for professional and heavy-duty applications.",
    price: 29.99,
    quantity: 1
  }
]

export default Payments
