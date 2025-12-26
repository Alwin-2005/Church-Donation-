import React from "react";
import Center from "./Center";
import Footer from "../Footer/Footer";
import Navbar from "../NavBar/NavBar";


const Sec1=()=>
{
  return(
    <div className="h-screen w-screen">
      <Navbar/>
      <Center/>
      <Footer/>
    </div>
  )
}

export default Sec1