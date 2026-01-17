import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import ShopCard from "./Shopcard";
import CartButton from "./CartButton";
import Cross from "../../assets/cross.png"
import Mug from "../../assets/mug.png"
import Rosary from "../../assets/rosary.png"
import Bible from "../../assets/bible.png"
import Keychain from "../../assets/keychain.png"
import TShirt from "../../assets/tshirt.png"
import WallArt from "../../assets/wallart.png"
import Bookmark from "../../assets/bookmark.png"



const Shop=(props)=>{

  const merchDetails = [
  {
    loc: Bible,
    name: "Bible",
    description: "The Bible has 66 books, more than 1,000 chapters, and was written by about 40 different authors.",
    stock: 15,
    price: 399,
  },
  {
    loc: Cross,
    name: "Wooden Cross",
    description:
      "Handcrafted wooden cross symbolizing faith, sacrifice, and devotion.",
    stock: 20,
    price: 249
  },
  {
    loc: Rosary,
    name: "Holy Rosary",
    description:
      "Traditional rosary beads used for prayer and meditation.",
    stock: 25,
    price: 199
  },
  {
    loc: Mug,
    name: "Faith Mug",
    description:
      "Ceramic mug with inspirational scripture message.",
    stock: 10,
    price: 299
  },{
    loc: Keychain,
    name: "Cross Keychain",
    description: "Small metal cross keychain to carry your faith everywhere.",
    stock: 50,
    price: 99
  },
  {
    loc: TShirt,
    name: "Faith T-Shirt",
    description: "Comfortable black t-shirt with a printed scripture verse.",
    stock: 20,
    price: 499
  },
  {
    loc: Bookmark,
    name: "Bible Bookmark",
    description: "Elegant bookmark for your Bible or devotional book.",
    stock: 40,
    price: 79
  },
  {
    loc: WallArt,
    name: "Inspirational Wall Art",
    description: "Framed wall art with a motivational Bible verse.",
    stock: 8,
    price: 599
  }

];


    return(
        <div>
            <Navbar/>
            <div>
              <h1 className="text-2xl font-bold text-center mt-30 p-2  bg-black text-white">SHOP</h1> 
              
            </div>
            <div className="flex flex-wrap justify-center gap-6 px-6">
               {merchDetails.map(function(elem){
              return(<ShopCard loc={elem.loc} name={elem.name} desc={elem.description} stock={elem.stock} price={elem.price}/>)
            })}
            </div>
            <Footer/>
              
        </div>
    )
}

export default Shop