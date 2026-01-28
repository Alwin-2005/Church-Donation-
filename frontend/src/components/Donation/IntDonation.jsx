import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DonationLayout from "./DonationLayout";
import api from "../../api/axios";


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

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return(
    <DonationLayout
      title="Donate for Church"
      campaigns={intCampaigns}
      role="churchMember"
      onDonate={(c) => navigate(`/donate/${c._id}`)}
    />
  );
  
};

export default IntDonation;
