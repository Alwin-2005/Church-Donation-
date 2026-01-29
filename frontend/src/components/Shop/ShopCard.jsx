import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus } from "lucide-react";

const ShopCard = (props) => {
  const { cart, updateCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const item = cart.find(i => i.id === props.id);
    setQty(item ? item.qty : 0);
  }, [cart, props.id]);

  const handleQtyChange = (newQty) => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    setQty(newQty);
    updateCart(props, newQty);
  };

  return (
    <div className="group relative bg-white w-[280px] rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">

      {/* IMAGE CONTAINER */}
      <div className="h-[260px] w-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {props.url ? (
          <img
            src={props.url}
            alt={props.itemName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="text-gray-300">No Image</div>
        )}

        {/* ABSOLUTE PRICE BADGE */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          ₹{props.price}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-bold text-lg text-gray-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
          {props.itemName}
        </h2>

        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          {props.category}
        </p>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {props.description}
        </p>

        {/* FOOTER ACTIONS */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className={`text-xs font-medium ${props.stockQuantity > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {props.stockQuantity > 0 ? `${props.stockQuantity} in stock` : "Out of Stock"}
          </span>

          {qty === 0 ? (
            <button
              onClick={() => handleQtyChange(1)}
              disabled={props.stockQuantity === 0}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-1 py-1">
              <button
                onClick={() => handleQtyChange(qty - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-black hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                disabled={qty >= props.stockQuantity}
                className="w-8 h-8 flex items-center justify-center bg-black rounded-full shadow-sm text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShopCard;

