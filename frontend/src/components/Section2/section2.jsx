import React ,{useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import DonationLayout from "../Donation/DonationLayout";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

const Sec2 = () => {
  const navigate = useNavigate();
  const [exCampaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get(
        "users/exdonationcampaigns/view",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32">
        <Loader2 className="animate-spin text-accent mb-4" size={32} />
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-sans text-foreground/50">Loading Campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <p className="font-serif text-2xl font-bold text-accent">{error}</p>
      </div>
    );
  }

  return (
    <DonationLayout
      title="Donate for Cause"
      campaigns={exCampaigns}
      role="externalMember"
      onDonate={(c) => navigate(`/donate/${c._id}`)}
    />
  );
}

export default Sec2;