import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import DonCard from "./DonCard";
import giving from "../../assets/giving.jpg"

const ExtDonation = () => {
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

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">

        {/* Background image */}
        <img
          src={giving}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          alt="Giving background"
        />


        {/* CONTENT OVER IMAGE */}
        <div className="relative z-20 pt-40">

          <h1 className="text-4xl font-bold text-center text-white">
            Donate for Cause
          </h1>
          <hr className="w-40 mx-auto my-6 border-white" />

          <div className="flex flex-wrap justify-center gap-6 px-6 ">
            {externalDonations.map((elem, index) => (
              <DonCard
                key={index}
                title={elem.title}
                desc={elem.description}
                gamount={elem.gamount}
                camount={elem.camount}
                start={elem.start}
                end={elem.end}
              />
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExtDonation;
