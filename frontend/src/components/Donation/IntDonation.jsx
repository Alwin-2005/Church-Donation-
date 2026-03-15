import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DonationCampaignCard from "./DonationCampaignCard";
import api from "../../api/axios";
import giving from "../../assets/giving.jpg";


const IntDonation = () => {
  
  const navigate = useNavigate();
  const [intCampaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

      const fetchCampaigns = async () => {
      try {
        const res = await api.get(
          "users/indonationcampaigns/view",
          { withCredentials: true }
        );

        setCampaigns(res.data.Result); 
      } catch (err) {
        console.error(err);
        setError("Unable to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="animate-pulse">Loading campaigns...</p>
    </div>
  );

  const titheCampaigns = intCampaigns.filter(c => c.isTithe);
  const otherCampaigns = intCampaigns.filter(c => !c.isTithe);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* GLOBAL FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <img
          src={giving}
          className="h-full w-full object-cover"
          alt="Church donation background"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* TITHES SECTION */}
        {titheCampaigns.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-yellow-400 pl-4 uppercase italic tracking-tighter">
              Monthly Tithes
            </h2>
            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
              {titheCampaigns.map(c => (
                <DonationCampaignCard
                  key={c._id}
                  campaign={c}
                  role="churchMember"
                  onDonate={() => navigate(`/donate/${c._id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* OTHER CAUSES SECTION */}
        <section>
          <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-primary pl-4 uppercase italic tracking-tighter">
            Church Causes & Missions
          </h2>
          <div className="flex flex-wrap gap-8 justify-center md:justify-start">
            {otherCampaigns.length > 0 ? (
              otherCampaigns.map(c => (
                <DonationCampaignCard
                  key={c._id}
                  campaign={c}
                  role="churchMember"
                  onDonate={() => navigate(`/donate/${c._id}`)}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No other active church campaigns.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
  
};

export default IntDonation;
