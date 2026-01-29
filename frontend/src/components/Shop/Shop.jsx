import React from "react";
import ShopCard from "./ShopCard";
import CartButton from "./CartButton";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

import Cross from "../../assets/cross.png";
import Mug from "../../assets/mug.png";
import Rosary from "../../assets/rosary.png";
import Bible from "../../assets/bible.png";
import Keychain from "../../assets/keychain.png";
import TShirt from "../../assets/tshirt.png";
import WallArt from "../../assets/wallart.png";
import Bookmark from "../../assets/bookmark.png";

const Shop = () => {
  const { cart } = useCart();

  const merchDetails = [
    { id: 1, url: Bible, itemName: "Holy Bible", category: "Books", description: "Standard Edition Holy Bible", stockQuantity: 15, price: 399 },
    { id: 2, url: Cross, itemName: "Wooden Cross", category: "Decor", description: "Handcrafted wooden cross", stockQuantity: 20, price: 249 },
    { id: 3, url: Rosary, itemName: "Holy Rosary", category: "Accessories", description: "Pearl beads rosary", stockQuantity: 25, price: 199 },
    { id: 4, url: Mug, itemName: "Faith Mug", category: "Lifestyle", description: "Ceramic mug with quote", stockQuantity: 10, price: 299 },
    { id: 5, url: Keychain, itemName: "Cross Keychain", category: "Accessories", description: "Metal keychain", stockQuantity: 50, price: 99 },
    { id: 6, url: TShirt, itemName: "Faith T-Shirt", category: "Apparel", description: "Cotton printed t-shirt", stockQuantity: 20, price: 499 },
    { id: 7, url: Bookmark, itemName: "Bible Bookmark", category: "Stationery", description: "Leather bookmark", stockQuantity: 40, price: 79 },
    { id: 8, url: WallArt, itemName: "Wall Art", category: "Decor", description: "Framed scripture art", stockQuantity: 8, price: 599 }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HERO HEADER */}
      <div className="bg-black text-white pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          CHURCH STORE
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Support our ministry by purchasing high-quality merchandise combined with faith and purpose.
        </p>
      </div>

      {/* GRID */}
      <div className="-mt-10 relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8">
          {merchDetails.map(elem => (
            <ShopCard key={elem.id} {...elem} />
          ))}
        </div>
      </div>

      {/* FLOAT CART BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/cart">
          <CartButton cart={cart} />
        </Link>
      </div>

    </div>
  );
};

export default Shop;
