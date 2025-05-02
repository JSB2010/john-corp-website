import React, { useState } from 'react';
import GameModal from './GameModal';

/**
 * Subscription Modal Component
 * Displays subscription options for premium features
 */
function SubscriptionModal({ 
  isOpen, 
  onClose, 
  onSubscribe,
  currentPlan = 'free'
}) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [step, setStep] = useState(1); // 1: plan selection, 2: payment details
  
  // Subscription plans
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      period: 'forever',
      features: [
        'Access to all basic games',
        'Local leaderboards',
        'Limited game features'
      ],
      cta: 'Current Plan'
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 4.99,
      period: 'month',
      features: [
        'Premium features for 3 games of your choice',
        'Global leaderboards',
        'Ad-free experience',
        'Weekly challenges'
      ],
      cta: 'Choose Basic'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 9.99,
      period: 'month',
      features: [
        'Premium features for all games',
        'Global leaderboards',
        'Ad-free experience',
        'Weekly challenges',
        'Exclusive game modes',
        'Early access to new games'
      ],
      cta: 'Choose Premium',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: 99.99,
      period: 'year',
      features: [
        'All Premium Plan features',
        'Save 16% compared to monthly',
        'Exclusive annual challenges',
        'Priority support'
      ],
      cta: 'Choose Annual'
    }
  ];
  
  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    
    // Skip payment step for free plan
    if (planId === 'free') {
      handleSubscribe(planId);
    } else {
      setStep(2);
    }
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Handle subscription
  const handleSubscribe = (planId) => {
    // In a real app, this would process the payment
    onSubscribe(planId);
    onClose();
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would validate the form and process the payment
    handleSubscribe(selectedPlan);
  };
  
  // Render plan selection step
  const renderPlanSelection = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`
                border rounded-lg p-4 transition-all
                ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                ${plan.popular ? 'relative' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  POPULAR
                </div>
              )}
              
              <h3 className="text-lg font-bold">{plan.name}</h3>
              
              <div className="my-3">
                {plan.price === 0 ? (
                  <span className="text-2xl font-bold">Free</span>
                ) : (
                  <div>
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                )}
              </div>
              
              <ul className="text-sm space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-2 px-4 rounded-md ${
                  selectedPlan === plan.id && plan.id === currentPlan
                    ? 'bg-gray-300 cursor-default'
                    : selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                disabled={selectedPlan === plan.id && plan.id === currentPlan}
              >
                {selectedPlan === plan.id && plan.id === currentPlan ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render payment details step
  const renderPaymentDetails = () => {
    const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-800 mr-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">Payment Details</h2>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{selectedPlanDetails.name}</h3>
              <p className="text-gray-600 text-sm">Billed {selectedPlanDetails.period}ly</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${selectedPlanDetails.price}</p>
              <p className="text-gray-600 text-sm">/{selectedPlanDetails.period}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-bold mb-3">Payment Method</h3>
          
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handlePaymentMethodChange('credit_card')}
              className={`flex items-center justify-center p-3 border rounded-md ${
                paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              <span className="ml-2">Credit Card</span>
            </button>
            
            <button
              onClick={() => handlePaymentMethodChange('paypal')}
              className={`flex items-center justify-center p-3 border rounded-md ${
                paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.93 4.24h5.14c2.1 0 3.92 1.18 4.32 3.16.41 2.05-.1 3.77-1.43 4.72-.87.62-1.95.86-3.21.86h-.89c-.41 0-.76.3-.83.7l-.67 4.32H8.45L9.93 4.24zm3.96 2.5H10.9l-.93 6h2.43c1.17 0 2-.23 2.56-.89.96-1.12.63-3.43-.17-4.45-.31-.38-.95-.66-1.9-.66z" />
                <path d="M19.5 7.4c.41 2.05-.1 3.77-1.43 4.72-.87.62-1.95.86-3.21.86h-.89c-.41 0-.76.3-.83.7l-.67 4.32h-3.91l.23-1.5c.04-.21.23-.36.44-.36h.97c.41 0 .76-.3.83-.7l.67-4.32h.89c1.26 0 2.34-.24 3.21-.86 1.33-.95 1.84-2.67 1.43-4.72-.4-1.98-2.22-3.16-4.32-3.16h-5.14l-.23 1.5c-.04.21-.23.36-.44.36H4.5l-1.5 9.64h3.91l.67-4.32c.07-.4.42-.7.83-.7h.89c1.26 0 2.34-.24 3.21-.86 1.33-.95 1.84-2.67 1.43-4.72-.4-1.98-2.22-3.16-4.32-3.16H4.5l-.23 1.5c-.04.21-.23.36-.44.36H1.5" />
              </svg>
              <span className="ml-2">PayPal</span>
            </button>
          </div>
          
          {paymentMethod === 'credit_card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium"
                >
                  Subscribe Now
                </button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                  You can cancel your subscription at any time.
                </p>
              </div>
            </form>
          )}
          
          {paymentMethod === 'paypal' && (
            <div className="text-center py-6">
              <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
              <button
                onClick={() => handleSubscribe(selectedPlan)}
                className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-md font-medium"
              >
                Continue to PayPal
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <GameModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Subscription Plans" : "Complete Your Subscription"}
      size="xl"
    >
      {step === 1 ? renderPlanSelection() : renderPaymentDetails()}
    </GameModal>
  );
}

export default SubscriptionModal;
