import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const ShopCard = (props) => {
  const { cart, updateCart } = useCart();
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const item = cart.find(i => i.id === props.id);
    setQty(item ? item.qty : 0);
  }, [cart, props.id]);

  const handleQtyChange = (newQty) => {
    setQty(newQty);
    updateCart(props, newQty);
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <div className="bg-blue-200 text-black border border-black min-h-60 w-68 p-4 m-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        <img src={props.loc} className="mx-auto mb-4 transition-transform duration-300 hover:scale-105"/>

        <h2 className="font-extrabold uppercase tracking-wide border-b border-black pb-2">
          {props.name}
        </h2>

        <h4 className="mt-4 text-sm text-gray-700">{props.description}</h4>

        <h5 className="mt-4 font-semibold text-sm">
          Stock Available: {props.stock}
        </h5>

        <h5 className="mt-3 font-bold text-lg">
          Price : ₹{props.price}
        </h5>

        <div className="mt-5 flex justify-end">
          {qty === 0 ? (
            <button
              onClick={() => handleQtyChange(1)}
              className="text-sm font-bold px-4 py-1.5 border border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-4 border border-black rounded-full px-4 py-1">
              <button onClick={() => handleQtyChange(qty - 1)}>-</button>
              <span className="font-bold">{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                disabled={qty === props.stock}
                className={`${qty === props.stock ? "opacity-40" : ""}`}
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button className="text-sm font-bold px-4 py-1.5 border border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
