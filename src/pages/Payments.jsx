import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Payments() {
  const { cart, getCartTotal } = useCart();

  return (
    <div className="container py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p className="text-gray-700 mb-8">
        Complete your purchase securely using our payment system.
      </p>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default Payments;
