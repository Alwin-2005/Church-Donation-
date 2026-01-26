import React from "react";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import ShopCard from "./Shopcard";
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
  const { cart } = useCart(); // 👈 ONLY THIS ADDED

  const merchDetails = [
    { id: 1, loc: Bible, name: "Bible", description:"...", stock:15, price:399 },
    { id: 2, loc: Cross, name: "Wooden Cross", description:"...", stock:20, price:249 },
    { id: 3, loc: Rosary, name: "Holy Rosary", description:"...", stock:25, price:199 },
    { id: 4, loc: Mug, name: "Faith Mug", description:"...", stock:10, price:299 },
    { id: 5, loc: Keychain, name: "Cross Keychain", description:"...", stock:50, price:99 },
    { id: 6, loc: TShirt, name: "Faith T-Shirt", description:"...", stock:20, price:499 },
    { id: 7, loc: Bookmark, name: "Bible Bookmark", description:"...", stock:40, price:79 },
    { id: 8, loc: WallArt, name: "Inspirational Wall Art", description:"...", stock:8, price:599 }
  ];

  return (
    <div>
      <Navbar />

      <h1 className="text-2xl font-bold text-center mt-30 p-2 bg-black text-white">
        SHOP
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-6">
        {merchDetails.map(elem => (
          <ShopCard key={elem.id} {...elem} />
        ))}
      </div>

      <Link to="/cart">
        <CartButton cart={cart} />
      </Link>

      <Footer />
    </div>
  );
};

export default Shop;
