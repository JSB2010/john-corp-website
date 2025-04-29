import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function MiniCart({ onClose }) {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleViewCart = () => {
    onClose();
    navigate('/payments');
  };

  if (cart.length === 0) {
    return (
      <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
      <div className="max-h-64 overflow-y-auto">
        {cart.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-2 mb-3 pb-3 border-b">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Image</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.quantity} × ${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 3 && (
        <p className="text-sm text-gray-500 mt-2">
          And {cart.length - 3} more items...
        </p>
      )}
      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-medium">${getCartTotal().toFixed(2)}</span>
        </div>
        <button
          onClick={handleViewCart}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Cart & Checkout
        </button>
      </div>
    </div>
  );
}

export default MiniCart;