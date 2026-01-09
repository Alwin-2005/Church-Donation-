import React from "react"
import COG from "../../assets/COG.png";
import { Link,useNavigate} from "react-router-dom";

const Navbar=()=>
{
   const navigate = useNavigate();

   const handleLogin = (e) => {
  
      const value=e.target.value;
      if(value) navigate(value);
  };
   

    return (
       <div className="flex items-center py-6 px-4 md:px-16 font-sans bg-white text-black border-gray w-full fixed top-0 left-0 w-full z-50 bg-black">
        <img src={COG} className="h-10 w-auto max-w-full "></img>
        <h1>Church of God</h1>
         <div className="ml-auto overflow-x-hidden flex gap-10 text-base font-sans  leading-relaxed  px-4 " >
          <h1><Link to="/home" className="transition-transform duration-200 hover:scale-110  hover:cursor-pointer">HOME</Link></h1>

               
             <select onChange={handleLogin} className="bg-black text-white rounded border border-white hover:cursor-pointer"> 
               
               <option value="" className="group-hover:hidden">DONATE</option>
                <option value="/ExtDon" className=" hover:cursor-pointer hover:text-xl">Donate for a Cause</option>
                 <option value="/IntDon" className=" hover:cursor-pointer hover:text-xl">Donate for a Church</option>
            </select>
            <h1><Link to="" className="hover:cursor-pointer hover:text-xl">SHOP</Link></h1>
              <h1><Link to="" className="hover:cursor-pointer hover:text-xl">EVENTS</Link></h1> 
              
                
        </div>
        

       </div>
       
    )
}

export default Navbar