import React from "react";
import Sec1 from "./components/Section1/section1";
import Log from "./components/Login/Log";
import Regis from "./components/Regis/Regis";
import { Route,Routes } from "react-router-dom";

//import Sec2 from "./components/Section2/section2";

const App=()=>
{
  return(
    <div className="w-full overflow-x-hidden" >
     <Routes>

      <Route path="/" element={<Log/>}/>
      <Route path="/home" element={<Sec1/>}/>
      <Route path="/registerNow" element={<Regis/>}/>

     </Routes>
     
     
    </div>
  )
}

export default App
