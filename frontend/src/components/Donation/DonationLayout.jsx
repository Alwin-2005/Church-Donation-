import React from "react";
import { useNavigate } from "react-router-dom";
import DonationCampaignCard from "./DonationCampaignCard";

const DonationLayout = ({ title, campaigns = [], role, simple = false }) => {
  const navigate = useNavigate();

  if (simple) {
    return (
      <div className="flex flex-wrap justify-center gap-8 py-8 w-full">
        {campaigns.length === 0 ? (
          <p className="w-full text-center text-foreground/50 text-sm font-medium italic border border-line py-12">
            No streams available at this time.
          </p>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="border border-line hover:border-foreground transition-colors p-4">
              <DonationCampaignCard
                campaign={campaign}
                role={role}
                onDonate={(c) => navigate(`/donate/${c._id}`)}
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pt-32 flex flex-col font-sans text-foreground">
      {/* HERO SECTION */}
      <div className="px-4 md:px-16 py-24 border-b border-line text-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent mb-6 block">
          Generosity
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto">
          {title}
        </h1>
      </div>

      <div className="py-24 px-4 md:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length === 0 ? (
            <div className="col-span-full py-24 border border-line text-center">
               <p className="font-serif text-2xl font-bold mb-2">No active campaigns</p>
               <p className="text-sm text-foreground/70">Check back later for new opportunities to give.</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="border border-line hover:border-foreground transition-colors p-4">
                <DonationCampaignCard
                  campaign={campaign}
                  role={role}
                  onDonate={(c) => navigate(`/donate/${c._id}`)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationLayout;
