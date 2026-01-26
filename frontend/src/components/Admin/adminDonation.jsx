import React, { useState } from "react";
import DonationCampaignCard from "../Donation/DonationCampaignCard";
import AdminDonationForm from "./AdminDonationForm";

const AdminDonation = () => {
  const [campaigns, setCampaigns] = useState([
    {
      _id: "1",
      donationType: "internal",
      title: "Church Building Renovation",
      description: "Renovating the main church hall and roof structure.",
      goalAmount: 150000,
      collectedAmount: 86500,
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      status: "active",
    },
    {
      _id: "2",
      donationType: "internal",
      title: "Sunday Worship Equipment",
      description: "Upgrading sound systems and worship instruments.",
      goalAmount: 90000,
      collectedAmount: 47200,
      startDate: "2026-01-10",
      endDate: "2026-02-28",
      status: "paused",
    },
    {
      _id: "3",
      donationType: "external",
      title: "Community Water Well",
      description: "Providing clean drinking water to rural communities.",
      goalAmount: 100000,
      collectedAmount: 78000,
      startDate: "2026-01-15",
      endDate: "2026-04-01",
      status: "active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleCreate = (data) => {
    const newCampaign = {
      ...data,
      _id: Date.now().toString(),
      collectedAmount: 0,
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setShowForm(false);
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    setCampaigns(prev => prev.filter(c => c._id !== id));
  };

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
        <AdminDonationForm
          initialData={editingCampaign}
          onSubmit={handleCreate}
        />
      )}

      {/* CAMPAIGN LIST */}
      <div className="flex flex-wrap gap-6 mt-8">
        {campaigns.map(campaign => (
          <DonationCampaignCard
            key={campaign._id}
            campaign={campaign}
            role="admin"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDonation;
