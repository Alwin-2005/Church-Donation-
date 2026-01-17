import React, { useState } from "react";
const ShopCard = (props) => {
  const [qty, setQty] = useState(0);

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <div
        className="bg-blue-200 text-black border border-black
                   min-h-60 w-68 p-4 m-5 rounded-xl
                   shadow-sm transition-all duration-300
                   hover:shadow-xl hover:-translate-y-1"
      >

        {/* Product Image */}
        <img src={props.loc}
          className="mx-auto mb-4
                     transition-transform duration-300
                     hover:scale-105"/>

        {/* Title */}
        <h2 className="font-extrabold uppercase tracking-wide border-b border-black pb-2">
          {props.name}
        </h2>

        {/* Description */}
        <h4 className="mt-4 text-sm text-gray-700">
          {props.desc}
        </h4>

        {/* Stock */}
        <h5 className="mt-4 font-semibold text-sm">
          Stock Available: {props.stock}
        </h5>

        {/* Price */}
        <h5 className="mt-3 font-bold text-lg">
          Price : ₹{props.price}
        </h5>

        {/* Add to Cart / Counter */}
        <div className="mt-5 flex justify-end">
          {qty === 0 ? (
            <button
              onClick={() => setQty(1)}
              className="text-sm font-bold px-4 py-1.5
                         border border-black rounded-full
                         transition-all duration-300
                         hover:bg-black hover:text-white"
            >
              Add to Cart
            </button>
          ) : (
            <div
              className="flex items-center gap-4
                         border border-black rounded-full
                         px-4 py-1"
            >
              <button className="font-bold text-lg hover:opacity-60"
              onClick={()=>setQty(qty-1)}>
                -
              </button>

              <span className="font-bold">{qty}</span>

              <button
                onClick={()=>setQty(qty+1)}
                disabled={qty === props.stock}
                className={`font-bold text-lg hover:opacity-60
                  ${qty === props.stock ? "opacity-40" : ""}`}
              >
                +
              </button>
              
            </div>
          )}
        </div>

        {/* Buy Now */}
        <div className="mt-4 flex justify-end">
          <button
            className="text-sm font-bold px-4 py-1.5
                       border border-black rounded-full
                       transition-all duration-300
                       hover:bg-black hover:text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
      <button
    className="fixed bottom-6 right-6
               w-15 h-15 rounded-full 
               bg-black text-white
               flex items-center justify-center
               text-xl pb-2
               hover:scale-105 transition"
  >
    🛒
    </button>
    </div>
    
  );
};

export default ShopCard;
