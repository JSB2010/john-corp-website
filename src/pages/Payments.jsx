import React, { useState } from 'react'

function Payments() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would process the payment here
    alert('Payment processed successfully! Your order will be shipped soon.')
    setFormData({
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto py-16 px-4">
          <div style={{ maxWidth: '768px' }}>
            <h1 className="mb-4">Secure Checkout</h1>
            <p className="mb-6" style={{ fontSize: '1.25rem' }}>
              Complete your purchase of Jizz Tech products with our secure payment system.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky" style={{ top: '2rem' }}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 h-16 w-16 flex-shrink-0 rounded"></div>
                  <div className="flex-grow">
                    <h3 className="font-bold">Jizz Tech Original</h3>
                    <p className="text-gray-600">Quantity: 2</p>
                  </div>
                  <div className="font-bold">$39.98</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 h-16 w-16 flex-shrink-0 rounded"></div>
                  <div className="flex-grow">
                    <h3 className="font-bold">Jizz Tech Pro</h3>
                    <p className="text-gray-600">Quantity: 1</p>
                  </div>
                  <div className="font-bold">$29.99</div>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-bold">$69.97</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span className="font-bold">$5.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span className="font-bold">$6.12</span>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">$82.08</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Information</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`flex items-center gap-2 p-4 border rounded-lg ${paymentMethod === 'credit-card' ? 'border-blue-700 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handlePaymentMethodChange('credit-card')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Credit Card</span>
                </button>
                
                <button 
                  className={`flex items-center gap-2 p-4 border rounded-lg ${paymentMethod === 'paypal' ? 'border-blue-700 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.539h6.581c2.129 0 3.683.578 4.602 1.718.866 1.074 1.048 2.363.542 3.836-.035.102-.069.21-.104.315-.739 2.157-2.565 3.417-5.427 3.738a9.227 9.227 0 0 1-1.143.069H7.987l-1.165 8.48zm7.389-11.698a.304.304 0 0 1-.069.172c-.7 1.033-2.026 1.543-3.921 1.543h-.83l.552-3.5h1.03c.934 0 1.631.172 2.095.516.463.344.654.86.573 1.543a.305.305 0 0 1 .069.172c0 .172-.069.344-.138.516l-.361.038z" />
                    <path d="M19.538 7.783c.069-.172.069-.344.069-.516 0-.86-.361-1.58-1.03-2.157-.67-.578-1.631-.86-2.87-.86h-6.65a.641.641 0 0 0-.633.539L5.317 21.666a.641.641 0 0 0 .633.74h4.606l1.165-8.48h2.66c.395 0 .76-.035 1.143-.069 2.862-.321 4.688-1.58 5.427-3.738.035-.105.07-.213.104-.315.506-1.473.324-2.762-.542-3.836a3.363 3.363 0 0 0-.975-.86z" />
                  </svg>
                  <span>PayPal</span>
                </button>
                
                <button 
                  className={`flex items-center gap-2 p-4 border rounded-lg ${paymentMethod === 'apple-pay' ? 'border-blue-700 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handlePaymentMethodChange('apple-pay')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.445 10.638c-.67-1.436-.318-2.855.236-3.797.554-.943 1.437-1.663 2.455-1.89-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706z" />
                  </svg>
                  <span>Apple Pay</span>
                </button>
              </div>
            </div>
            
            {/* Credit Card Form */}
            {paymentMethod === 'credit-card' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cardName" className="block text-gray-700 font-medium mb-2">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-gray-700 font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="billingAddress" className="block text-gray-700 font-medium mb-2">Street Address</label>
                      <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State/Province</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-2">ZIP/Postal Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                          <option value="China">China</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Complete Payment - $82.08
                  </button>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Your payment information is encrypted and secure. We never store your full credit card details.
                  </p>
                </div>
              </form>
            )}
            
            {/* PayPal Form */}
            {paymentMethod === 'paypal' && (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.539h6.581c2.129 0 3.683.578 4.602 1.718.866 1.074 1.048 2.363.542 3.836-.035.102-.069.21-.104.315-.739 2.157-2.565 3.417-5.427 3.738a9.227 9.227 0 0 1-1.143.069H7.987l-1.165 8.48zm7.389-11.698a.304.304 0 0 1-.069.172c-.7 1.033-2.026 1.543-3.921 1.543h-.83l.552-3.5h1.03c.934 0 1.631.172 2.095.516.463.344.654.86.573 1.543a.305.305 0 0 1 .069.172c0 .172-.069.344-.138.516l-.361.038z" />
                  <path d="M19.538 7.783c.069-.172.069-.344.069-.516 0-.86-.361-1.58-1.03-2.157-.67-.578-1.631-.86-2.87-.86h-6.65a.641.641 0 0 0-.633.539L5.317 21.666a.641.641 0 0 0 .633.74h4.606l1.165-8.48h2.66c.395 0 .76-.035 1.143-.069 2.862-.321 4.688-1.58 5.427-3.738.035-.105.07-.213.104-.315.506-1.473.324-2.762-.542-3.836a3.363 3.363 0 0 0-.975-.86z" />
                </svg>
                <h3 className="text-xl font-bold mb-4">Continue to PayPal</h3>
                <p className="text-gray-600 mb-6">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Continue to PayPal - $82.08
                </button>
              </div>
            )}
            
            {/* Apple Pay Form */}
            {paymentMethod === 'apple-pay' && (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.445 10.638c-.67-1.436-.318-2.855.236-3.797.554-.943 1.437-1.663 2.455-1.89-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706-.236.707-.472 1.36-.708 2.066-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.414-.708 2.12-.236.707-.472 1.36-.708 2.066.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706.236-.235.472-.47.708-.706z" />
                </svg>
                <h3 className="text-xl font-bold mb-4">Pay with Apple Pay</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to pay using Apple Pay.
                </p>
                <button
                  onClick={handleSubmit}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Pay with Apple Pay - $82.08
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-800">Secure Payment Processing</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Encryption</h3>
              <p className="text-gray-600">
                All payment information is encrypted using industry-standard SSL technology to ensure your data remains private and secure.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fraud Protection</h3>
              <p className="text-gray-600">
                Our advanced fraud detection systems monitor transactions 24/7 to protect you from unauthorized charges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Payment Options</h3>
              <p className="text-gray-600">
                Choose from a variety of payment methods including credit cards, PayPal, and Apple Pay for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments
