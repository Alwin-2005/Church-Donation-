import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import DonationCampaignCard from "./DonationCampaignCard";
import giving from "../../assets/giving.jpg";

const ExtDonation = () => {
  const navigate = useNavigate();

  const externalDonations = [
    {
      _id: "1",
      title: "School Library Renovation",
      description: "Renovating the local public school library with new books, furniture, and computers.",
      goalAmount: 5000,
      collectedAmount: 2300,
      startDate: "2026-01-01",
      endDate: "2026-02-28"
    },
    {
      _id: "2",
      title: "Community Water Well",
      description: "Building a clean water well for the rural community to provide safe drinking water.",
      goalAmount: 10000,
      collectedAmount: 7800,
      startDate: "2026-01-10",
      endDate: "2026-03-15"
    },
    {
      _id: "3",
      title: "Local Animal Shelter Support",
      description: "Providing food, medicine, and care for rescued stray animals in the community.",
      goalAmount: 6000,
      collectedAmount: 1500,
      startDate: "2026-01-15",
      endDate: "2026-03-01"
    }
  ];

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">
        <img
          src={giving}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          alt="Giving background"
        />

        <div className="relative z-20 pt-40">
          <h1 className="text-4xl font-bold text-center text-white">
            Donate for Cause
          </h1>

          <hr className="w-40 mx-auto my-6 border-white" />

          <div className="flex flex-wrap justify-center gap-6 px-6">
            {externalDonations.map(campaign => (
              <DonationCampaignCard
                key={campaign._id}
                campaign={campaign}
                role="externalMember"
                onDonate={(c) => navigate(`/donate/${c._id}`)}
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
