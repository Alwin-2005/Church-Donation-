import React from "react"
import COG from "../../assets/COG.png";

const Navbar=()=>
{
   

    return (
       <div className="flex items-center py-6 px-4 md:px-16 font-sans bg-white text-black border-gray w-full fixed top-0 left-0 w-full z-50 bg-black">
        <img src={COG} className="h-10 w-auto max-w-full "></img>
         <div className="ml-auto overflow-x-hidden flex gap-10 text-base font-sans  leading-relaxed  px-4 " >
          <h1><a className="hover:text-xl  hover:cursor-pointer">HOME</a></h1>

               
             <select className="bg-black text-white rounded border border-white hover:cursor-pointer"> 
               
               <option value="">DONATE</option>
                <option value="Ext" className=" hover:cursor-pointer hover:text-xl">External</option>
                 <option value="Int" className=" hover:cursor-pointer hover:text-xl">Internal</option>
            </select>
            <h1><a className="hover:cursor-pointer hover:text-xl">SHOP</a></h1>
              <h1><a className="hover:cursor-pointer hover:text-xl">EVENTS</a></h1> 
              
                
        </div>
       </div>
       
    )
}

export default Navbar