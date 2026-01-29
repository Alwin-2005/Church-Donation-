import React, { useState, useEffect } from "react";
import ShopCard from "./ShopCard";
import CartButton from "./CartButton";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "../../api/axios";
import footerImg from "../../assets/footer2.jpg";

const Shop = () => {
  const { cart } = useCart();
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const response = await api.get("/home/merchandise/view");
        setMerchItems(response.data);
      } catch (err) {
        console.error("Error fetching merchandise:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={footerImg}
          className="w-full h-full object-cover"
          alt="Shop background"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10">
        {/* HERO HEADER */}
        <div className="pt-32 pb-14 px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase italic">
            SHOP
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium tracking-wide">
            Support our sanctuary by purchasing high-quality merchandise crafted with faith and purpose.
          </p>
        </div>

        {/* GRID */}
        <div className="max-w-7xl mx-auto px-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
              <p className="text-gray-400 font-black tracking-widest uppercase text-xs">Unboxing the Sanctuary...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 backdrop-blur-md text-rose-500 p-10 rounded-[40px] text-center border border-rose-500/20 max-w-xl mx-auto shadow-2xl">
              <p className="font-black italic text-xl uppercase tracking-tighter">{error}</p>
            </div>
          ) : merchItems.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md text-gray-400 p-20 rounded-[40px] text-center border border-white/10 max-w-2xl mx-auto shadow-inner">
              <p className="text-3xl font-black uppercase italic tracking-tighter">Coming Soon!</p>
              <p className="mt-4 font-medium text-lg">Our store is currently being restocked. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fadeIn">
              {merchItems.map(item => (
                <div key={item._id} className="hover:scale-[1.02] transition-transform duration-500">
                  <ShopCard {...item} id={item._id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOAT CART BUTTON */}
      <div className="fixed bottom-10 right-10 z-50">
        <Link to="/cart">
          <CartButton cart={cart} />
        </Link>
      </div>
    </div>
  );
};

export default Shop;
