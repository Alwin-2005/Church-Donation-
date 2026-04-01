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
    <div className="group relative w-full flex flex-col bg-background transition-all duration-500">

      {/* IMAGE CONTAINER */}
      <div className="aspect-square w-full bg-muted overflow-hidden relative border border-line">
        {props.url ? (
          <img
            src={props.url}
            alt={props.itemName}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-foreground/20">No Image</div>
        )}

        {/* PRICE BADGE */}
        <div className="absolute bottom-4 left-4 bg-background border border-line px-3 py-1.5 text-xs font-bold font-sans">
          ₹{props.price}
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-6 flex-1 flex flex-col">
        <h3 className="font-serif text-xl font-bold text-foreground leading-tight mb-2 group-hover:text-accent transition-colors">
          {props.itemName}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
            {props.category}
          </span>
          <span className="w-1 h-1 bg-line rounded-full" />
          <span className={`text-[9px] font-bold uppercase tracking-widest ${props.stockQuantity > 0 ? "text-foreground/40" : "text-red-500"}`}>
            {props.stockQuantity > 0 ? `${props.stockQuantity} in stock` : "Sold Out"}
          </span>
        </div>

        <p className="text-foreground/70 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {props.description}
        </p>

        {/* FOOTER ACTIONS */}
        <div className="mt-auto pt-6 border-t border-line">
          {qty === 0 ? (
            <button
              onClick={() => handleQtyChange(1)}
              disabled={props.stockQuantity === 0}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-foreground text-background py-3 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" /> Add to cart
            </button>
          ) : (
            <div className="flex items-center justify-between border border-line p-1">
              <button
                onClick={() => handleQtyChange(qty - 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-line transition-colors text-foreground"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-foreground">{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                disabled={qty >= props.stockQuantity}
                className="w-10 h-10 flex items-center justify-center bg-accent text-background hover:bg-foreground transition-colors disabled:opacity-30"
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

