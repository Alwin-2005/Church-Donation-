import React from "react";


const IntDonCard=(props)=>
{
    return(
        <div className="flex flex-wrap justify-center gap-6">
            <div  className="border min-h-60 w-68 p-5 shadow-lg rounded-lg m-10 ">

             
           <h2 className="font-bold underline">{props.title}</h2>
            <h4  className="mt-5">{props.desc}</h4>
            <h5 className="mt-4 font-bold">Goal Amount:{props.gamount}</h5> 
            <h5  className="mt-4 font-bold">Collected Amount:{props.camount}</h5> 
             <h5 className="mt-4 font-bold">Start Date:{props.start}</h5> 
              <h5  className="mt-4 font-bold">End Start:{props.end}</h5>
              <button  className="mt-4 text-center text-sm ml-35 font-bold w-20 border-2 hover:opacity-40 rounded">Donate</button>

            </div>
            
           
        </div>
    )
}

export default IntDonCard