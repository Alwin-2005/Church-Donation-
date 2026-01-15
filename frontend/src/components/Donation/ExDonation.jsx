import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import DonCard from "./DonCard";
import Footer from "../Footer/Footer";
import axios from "axios";

const ExDonation=(props)=>{

  const externalDonations = [
  {
    title: "School Library Renovation",
    description: "Renovating the local public school library with new books, furniture, and computers.",
    goalAmount: 5000,
    collectedAmount: 2300,
    startDate: "2026-01-01",
    endDate: "2026-02-28"
  },
  {
    title: "Community Water Well",
    description: "Building a clean water well for the rural community to provide safe drinking water.",
    goalAmount: 10000,
    collectedAmount: 7800,
    startDate: "2026-01-10",
    endDate: "2026-03-15"
  },
  {
    title: "Local Animal Shelter Support",
    description: "Providing food, medicine, and care for rescued stray animals in the community.",
    goalAmount: 6000,
    collectedAmount: 1500,
    startDate: "2026-01-15",
    endDate: "2026-03-01"
  },
  {
    title: "Youth Sports Equipment",
    description: "Funding equipment and coaching for local youth sports teams outside the church.",
    goalAmount: 4000,
    collectedAmount: 3200,
    startDate: "2026-01-20",
    endDate: "2026-02-28"
  },
  {
    title: "Community Health Camp",
    description: "Organizing a free health camp for underprivileged families in the city.",
    goalAmount: 7000,
    collectedAmount: 4200,
    startDate: "2026-01-25",
    endDate: "2026-03-05"
  }
];
// Connect to database and get request through axios
//const donation = await axios.get();


    return(
        <div>
            <Navbar/>
               <h1 className="text-2xl font-bold text-center pt-40">Donate for a Cause</h1> 
               <hr/>
            <div className="flex flex-wrap justify-center gap-6 px-6">
               {externalDonations.map(function(elem){
              return(<DonCard title={elem.title} desc={elem.description} gamount={elem.goalAmount} camount={elem.collectedAmount} start={elem.startDate} end={elem.endDate} />)
            })}
            </div>
           

            <Footer/>
              
        </div>
    )
}

export default ExDonation