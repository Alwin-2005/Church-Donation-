import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import api from "../../api/axios";
import { useParams } from "react-router-dom";

const DonatePage = () => {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchCampaign = async () => {
    try {
      const res = await api.get(
        `users/exdonationcampaigns/view/${campaignId}`
      );

      setCampaign(res.data.Result);
    } catch (err) {
      setError("Campaign not found");
    } finally {
      setLoading(false);
    }
  };

  fetchCampaign();
}, [campaignId]);


  const handleDonate = () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    // later: redirect to payment gateway
    console.log("Donating", amount, "to", campaign._id);
  };

  // 🛑 GUARDS
  if (loading) return <p>Loading campaign...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!campaign) return null;

  const progress = Math.min(
    (campaign.collectedAmount / campaign.goalAmount) * 100,
    100
  );

  return (
    <>
      <Navbar />

      {/* Offset for fixed navbar */}
      <div className="pt-28 pb-16 min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-3xl px-4 space-y-6">

          {/* Campaign Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {campaign.title}
            </h1>

            <p className="mt-2 text-gray-600">
              {campaign.description}
            </p>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                  ₹{campaign.collectedAmount.toLocaleString()} raised
                </span>
                <span>
                  Goal: ₹{campaign.goalAmount.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-black h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Donation Amount */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Enter Donation Amount
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {[500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-black hover:text-white transition"
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={campaign.status !== "active"}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            Proceed to Donate
          </button>

          {/* Trust Note */}
          <p className="text-center text-sm text-gray-500">
            Your donation is secure and will be used for the stated purpose 🙏
          </p>
        </div>
      </div>
    </>
  );
};

export default DonatePage;
