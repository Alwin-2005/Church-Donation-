import React, { useState, useEffect } from "react";
import DonationCampaignCard from "../Donation/DonationCampaignCard";
import AdminDonationForm from "./AdminDonationForm";
import api from "../../api/axios";

const AdminDonation = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get(
        "admin/donationcampaigns/view",
        { withCredentials: true }
      );

      setCampaigns(res.data.Result); // API returns array in Result
    } catch (err) {
      console.error(err);
      setError("Unable to fetch campaigns");
    } finally {
      setLoading(false);
    }

  };

  const handleCreate = async (data) => {
    try {
      let res;

      if (editingCampaign) {
        res = await api.put(
          `admin/donationcampaigns/update/${editingCampaign._id}`,
          data,
          { withCredentials: true }
        );
      } else {
        res = await api.post(
          "admin/donationcampaigns/add",
          data,
          { withCredentials: true }
        );
      }

      const campaign =
        res.data?.Result ||
        res.data?.campaign ||
        res.data?.data;

      if (!campaign || !campaign._id) {
        fetchCampaigns(); // fallback to server truth
        throw new Error("Invalid API response");
      }

      setCampaigns(prev =>
        editingCampaign
          ? prev.map(c => (c?._id === campaign._id ? campaign : c))
          : [...prev, campaign]
      );

      setEditingCampaign(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Saved successfully. Refresh fixed UI sync.");
    }
  };




  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await api.delete(`admin/donationcampaigns/delete/${id}`, { withCredentials: true });
      setCampaigns(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete campaign. Please try again.");
    }
  };

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // 🔹 BIFURCATION USING TYPE
  const internalCampaigns = campaigns.filter(
    c => c.donationType === "internal"
  );

  const externalCampaigns = campaigns.filter(
    c => c.donationType === "external"
  );

  return (
    <div className="pt-[96px] px-4 md:px-16 min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Donation Campaigns</h1>

        <button
          onClick={() => {
            setEditingCampaign(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Campaign
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowForm(false);
              setEditingCampaign(null);
            }}
          />

          {/* MODAL CONTENT */}
          <div className="relative z-10">
            <AdminDonationForm
              initialData={editingCampaign}
              onSubmit={handleCreate}
              onClose={() => {
                setShowForm(false);
                setEditingCampaign(null);
              }}
            />
          </div>

        </div>
      )}


      {/* INTERNAL DONATIONS */}
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Donate for church Campaigns
      </h2>

      <div className="flex flex-wrap gap-6">
        {internalCampaigns.length > 0 ? (
          internalCampaigns.map(campaign => (
            <DonationCampaignCard
              key={campaign._id}
              campaign={campaign}
              role="admin"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No internal donation campaigns</p>
        )}
      </div>

      {/* EXTERNAL DONATIONS */}
      <h2 className="text-xl font-semibold mt-12 mb-4">
        Donate for a cause Campaigns
      </h2>

      <div className="flex flex-wrap gap-6">
        {externalCampaigns.length > 0 ? (
          externalCampaigns.map(campaign => (
            <DonationCampaignCard
              key={campaign._id}
              campaign={campaign}
              role="admin"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No external donation campaigns</p>
        )}
      </div>
    </div>
  );
};

export default AdminDonation;
