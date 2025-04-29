import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      console.log('PaymentMethod:', paymentMethod);
      alert('Payment successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <label className="block mb-4">
        <span className="text-gray-700">Card Details</span>
        <CardElement className="p-2 border rounded mt-2" />
      </label>
      <button
        type="submit"
        disabled={!stripe}
        className="btn btn-primary w-full"
      >
        Pay Now
      </button>
    </form>
  );
}

export default CheckoutForm;
