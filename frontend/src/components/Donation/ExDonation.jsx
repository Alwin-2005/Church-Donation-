import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DonationLayout from "./DonationLayout";
import api from "../../api/axios";


const ExtDonation = () => {
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
    <DonationLayout
      title="Donate for Cause"
      campaigns={exCampaigns}
      role="externalMember"
      onDonate={(c) => navigate(`/donate/${c._id}`)}
    />
  );
};

export default ExtDonation;