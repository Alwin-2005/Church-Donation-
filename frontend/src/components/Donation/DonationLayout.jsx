import React from "react";
import { useNavigate } from "react-router-dom";
import DonationCampaignCard from "./DonationCampaignCard";
import giving from "../../assets/giving.jpg";



const DonationLayout = ({ title, campaigns = [], role }) => {
  const navigate = useNavigate();
  return (
    <div className="pt-20"> {/* ✅ OFFSET FOR FIXED NAVBAR */}

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">

        {/* BACKGROUND IMAGE */}
        <img
          src={giving}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Giving background"
        />

        {/* CONTENT OVER IMAGE */}
        <div className="relative z-20 pt-40">
          <h1 className="text-4xl font-bold text-center text-white">
            {title}
          </h1>

          <hr className="w-40 mx-auto my-6 border-white" />

          <div className="flex flex-wrap justify-center gap-6 px-6">
            {campaigns.length === 0 ? (
              <p className="text-white text-lg">
                No campaigns available
              </p>
            ) : (
              campaigns.map((campaign) => (
                <DonationCampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  role={role}
                  onDonate={(c) => navigate(`/donate/${c._id}`)}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


export default DonationLayout;
