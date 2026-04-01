import React, { useState, useEffect } from "react";
import ShopCard from "./ShopCard";
import CartButton from "./CartButton";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

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
    <div className="w-full min-h-screen bg-background text-foreground font-sans">
      {/* HERO HEADER */}
      <div className="pt-32 pb-16 px-4 md:px-16 border-b border-line text-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent mb-6 block">
          Church Store
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Shop
        </h1>
        <p className="text-base md:text-lg font-sans max-w-2xl mx-auto text-foreground/80 leading-relaxed">
          Support our sanctuary by purchasing high-quality merchandise crafted with faith and purpose.
        </p>
      </div>

      {/* GRID */}
      <div className="py-24 px-4 md:px-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border border-line">
            <Loader2 className="animate-spin mb-4 text-accent" size={32} />
            <p className="font-bold tracking-widest text-[10px] uppercase text-foreground/50">Unboxing the Sanctuary...</p>
          </div>
        ) : error ? (
          <div className="py-24 border border-accent text-center text-accent">
            <p className="font-serif text-2xl font-bold">{error}</p>
          </div>
        ) : merchItems.length === 0 ? (
          <div className="py-24 border border-line text-center">
            <p className="font-serif text-2xl font-bold mb-2">Coming Soon!</p>
            <p className="text-sm text-foreground/70">Our store is currently being restocked. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {merchItems.map(item => (
              <div key={item._id} className="border-b border-line pb-12">
                <ShopCard {...item} id={item._id} />
              </div>
            ))}
          </div>
        )}
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
