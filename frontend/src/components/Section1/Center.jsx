import React from "react";
import middle from "../../assets/middle.png";
import footer2 from "../../assets/footer2.jpg";


const Center=()=>
{
  return(
    <div className="relative shadow-lg  overflow-x-hidden">
       
       <img src={footer2} className="h-screen w-full border "></img>

       

       <div className="absolute top-15  w-full inset-0 flex flex-col items-center justify-center text-center px-6">
         <h1 className="text-white text-lg font-bold mb-4">Bible Engaged, Spirit Empowered, Missions Participating</h1>

        <h1 className="text-white text-3xl font-bold mb-6">Welcome to the Church of God</h1>

         <h1 className="text-white text-xl md:text-4xl font-bold max-w-4xl  ">Join us in our mission to see a healthy, Spirit-empowered church in every community!</h1>
       </div>

       

    </div>
  )
}

export default Center