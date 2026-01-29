import React from "react";
import Navbar from "../NavBar/NavBar";
import { useCart } from "./CartContext";
import { Trash2, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, updateCart } = useCart();

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const handleRemove = (item) => {
    updateCart(item, 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Shopping Cart ({cart.reduce((a, c) => a + c.qty, 0)})
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
            <Link to="/shop" className="text-black font-semibold underline hover:text-amber-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-scaleIn">

            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                  {/* Item Image (if available or placeholder) */}
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.url ? (
                      <img src={item.url} alt={item.itemName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900">{item.itemName}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateCart(item, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-black hover:bg-gray-200 transition-colors"
                      >-</button>
                      <span className="font-bold w-4 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateCart(item, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-black rounded-full shadow-sm text-white hover:bg-gray-800 transition-colors"
                      >+</button>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-32">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-900 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    Secure Encryption Payment
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    Top-Up via Mobile App
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
