import React ,{useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import footer2 from "../../assets/footer2.jpg";
import DonationLayout from "../Donation/DonationLayout";
import api from "../../api/axios";

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

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  
  return (
    <div className="relative h-screen w-full overflow-hidden shadow-lg">
      
      <img
        src={footer2}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <DonationLayout
          title="Donate for Cause"
          campaigns={exCampaigns}
          role="externalMember"
          onDonate={(c) => navigate(`/donate/${c._id}`)}
        />

    </div>
    </div>
  );
}

export default Sec2;