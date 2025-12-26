import React from "react"
import COG from "../../assets/COG.png";

const Navbar=()=>
{
   

    return (
       <div className="flex items-center py-6 px-4 md:px-16 font-sans bg-white text-black border-gray w-full">
        <img src={COG} className="h-20 w-auto max-w-full "></img>
         <div className="ml-auto overflow-x-hidden flex gap-10 text-lg font-sans text-lg leading-relaxed  px-4 " >
          <h1><a className="hover:text-red-500  hover:cursor-pointer">HOME</a></h1>

               
             <select className="bg-black text-white rounded border border-white hover:text-red-500  hover:cursor-pointer"> 
               
               <option value="">DONATE</option>
                <option value="Ext" className=" hover:cursor-pointer">External</option>
                 <option value="Int" className=" hover:cursor-pointer">Internal</option>
            </select>
            <h1><a className="hover:text-red-500 hover:cursor-pointer">SHOP</a></h1>
              <h1><a className="hover:text-red-500  hover:cursor-pointer">EVENTS</a></h1> 
              
                
        </div>
       </div>
       
    )
}

export default Navbar