import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DonationCampaignCard from "./DonationCampaignCard";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="animate-spin text-accent mb-4" size={32} />
      <p className="font-bold tracking-widest text-[10px] uppercase text-foreground/50">Loading campaigns...</p>
    </div>
  );

  const titheCampaigns = intCampaigns.filter(c => c.isTithe);
  const otherCampaigns = intCampaigns.filter(c => !c.isTithe);

  return (
    <div className="w-full bg-background min-h-screen text-foreground font-sans">
      
      {/* HEADER */}
      <div className="pt-32 pb-16 px-4 md:px-16 border-b border-line text-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent mb-6 block">
          Church Member Giving
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Donate for Church
        </h1>
        <p className="text-base md:text-lg font-sans max-w-2xl mx-auto text-foreground/80 leading-relaxed">
          Support our sanctuary operations and widespread causes directly.
        </p>
      </div>

      <div className="py-24 px-4 md:px-16 max-w-7xl mx-auto">
        {/* TITHES SECTION */}
        {titheCampaigns.length > 0 && (
          <section className="mb-24">
            <h2 className="font-serif text-3xl font-bold mb-8 border-l border-accent pl-6">
              Monthly Tithes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {titheCampaigns.map(c => (
                <div key={c._id} className="border border-line hover:border-foreground transition-colors p-4">
                  <DonationCampaignCard
                    campaign={c}
                    role="churchMember"
                    onDonate={() => navigate(`/donate/${c._id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OTHER CAUSES SECTION */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-8 border-l border-foreground pl-6">
            Church Causes & Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCampaigns.length > 0 ? (
              otherCampaigns.map(c => (
                <div key={c._id} className="border border-line hover:border-foreground transition-colors p-4">
                  <DonationCampaignCard
                    campaign={c}
                    role="churchMember"
                    onDonate={() => navigate(`/donate/${c._id}`)}
                  />
                </div>
              ))
            ) : (
              <p className="text-foreground/50 italic col-span-full border border-line p-12 text-center">No other active church campaigns.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntDonation;
