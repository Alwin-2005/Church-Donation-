import React, { useState, useEffect } from "react";
import DonationCampaignCard from "../Donation/DonationCampaignCard";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const AdminDonation = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FORM STATE
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [formData, setFormData] = useState({
    type: "internal",
    ctitle: "",
    desc: "",
    goalAmt: "",
    startDate: "",
    endate: "",
    status: "active",
    isTithe: false,
  });


  // Scroll lock while opening form
  useEffect(() => {
    if (showForm) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showForm]);


  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get(
        "admin/donationcampaigns/view",
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

  /* ---------- FORM HANDLERS ---------- */
  const handleAddClick = () => {
    setEditingCampaign(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      type: "internal",
      ctitle: "",
      desc: "",
      goalAmt: "",
      startDate: today,
      endate: "",
      status: "active",
      isTithe: false,
    });
    setShowForm(true);
  };

  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      type: campaign.donationType || "internal",
      ctitle: campaign.title || "",
      desc: campaign.description || "",
      goalAmt: campaign.goalAmount || "",
      startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
      endate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
      status: campaign.status || "active",
      isTithe: campaign.isTithe || false,
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isTithe") {
      setFormData(prev => ({
        ...prev,
        isTithe: checked,
        type: checked ? "internal" : prev.type // Tithe is always internal
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ctitle || (!formData.isTithe && !formData.goalAmt) || !formData.startDate || !formData.endate) {
      toast.error("Please fill all required fields");
      return;
    }

    // Only enforce that the start date must be today or future when CREATING a new campaign
    const today = new Date().toISOString().split('T')[0];
    if (!editingCampaign && formData.startDate < today) {
      toast.error("Start date cannot be before the current date");
      return;
    }

    if (formData.endate && formData.endate < formData.startDate) {
      toast.error("End date cannot be before the start date");
      return;
    }

    const payload = {
      ...formData,
      goalAmt: formData.isTithe ? 0 : Number(formData.goalAmt),
      donationType: formData.type
    };

    try {
      let res;
      if (editingCampaign) {
        // UPDATE
        res = await api.patch(
          `admin/donationcampaigns/update/${editingCampaign._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        // CREATE
        res = await api.post(
          "admin/donationcampaigns/add",
          payload,
          { withCredentials: true }
        );
      }

      const campaign = res.data?.Result || res.data?.campaign || res.data?.data;

      if (!campaign || !campaign._id) {
        fetchCampaigns();
      } else {
        setCampaigns(prev =>
          editingCampaign
            ? prev.map(c => (c._id === campaign._id ? campaign : c))
            : [...prev, campaign]
        );
      }

      setShowForm(false);
      setEditingCampaign(null);
      toast.success(editingCampaign ? "Campaign updated successfully!" : "Campaign created successfully!");

    } catch (err) {
      console.error(err);
      toast.error("Error saving campaign. Please check inputs.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await api.delete(`admin/donationcampaigns/delete/${id}`, { withCredentials: true });
      toast.success("Campaign deleted");
      setCampaigns(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete campaign.");
    }
  };

  if (loading) return (
    <div className="pt-24 px-6 text-center text-muted-foreground animate-pulse">
      Loading campaigns...
    </div>
  );

  const titheCampaigns = campaigns.filter(c => c.isTithe);
  const internalCampaigns = campaigns.filter(c => c.donationType === "internal" && !c.isTithe);
  const externalCampaigns = campaigns.filter(c => c.donationType === "external");

  const todayDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-24 px-6 md:px-16 min-h-screen bg-background pb-20">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donation Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage church and external fundraising causes</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-accent hover:scale-[1.02] text-primary-foreground px-8 py-3 rounded-none shadow-lg shadow-accent/10 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
        >
          <span>+</span> Add Campaign
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* SECTIONS */}
      <div className="space-y-12">

        {/* MONTHLY TITHES */}
        <section>
          <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-accent"></span>
            Monthly Tithes
          </h2>
          <div className="flex flex-wrap gap-6">
            {titheCampaigns.length > 0 ? (
              titheCampaigns.map(campaign => (
                <DonationCampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  role="admin"
                  onEdit={() => handleEditClick(campaign)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No active monthly tithe campaigns.</p>
            )}
          </div>
        </section>

        {/* INTERNAL */}
        <section>
          <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-black"></span>
            Church Campaigns
          </h2>
          <div className="flex flex-wrap gap-6">
            {internalCampaigns.length > 0 ? (
              internalCampaigns.map(campaign => (
                <DonationCampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  role="admin"
                  onEdit={() => handleEditClick(campaign)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No active church campaigns.</p>
            )}
          </div>
        </section>

        {/* EXTERNAL */}
        <section>
          <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gray-400"></span>
            External Causes
          </h2>
          <div className="flex flex-wrap gap-6">
            {externalCampaigns.length > 0 ? (
              externalCampaigns.map(campaign => (
                <DonationCampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  role="admin"
                  onEdit={() => handleEditClick(campaign)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No external causes.</p>
            )}
          </div>
        </section>

      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-card border border-border rounded-none w-full max-w-2xl shadow-2xl overflow-hidden scale-100 animate-scaleIn max-h-[90vh] overflow-y-auto">

            <div className="px-8 py-5 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-foreground hover:rotate-90 transition-transform text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Type & Tithe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-background rounded-none border border-border">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Campaign Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={formData.isTithe}
                    className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-xs font-bold uppercase tracking-widest bg-background disabled:bg-muted disabled:text-gray-400"
                  >
                    <option value="internal">Internal (Church)</option>
                    <option value="external">External (Cause)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isTithe"
                    name="isTithe"
                    checked={formData.isTithe}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-black rounded cursor-pointer"
                  />
                  <label htmlFor="isTithe" className="text-sm font-bold text-foreground cursor-pointer select-none">
                    Is Monthly Tithe?
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Campaign Title *</label>
                <input
                  type="text"
                  name="ctitle"
                  value={formData.ctitle}
                  onChange={handleInputChange}
                  placeholder={formData.isTithe ? "e.g. Monthly Tithes" : "e.g. Church Building Fund"}
                  className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium bg-background"
                  required
                />
              </div>

              {/* Goal Amount - Hidden for Tithe */}
              {!formData.isTithe && (
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Goal Amount (₹) *</label>
                  <input
                    type="number"
                    name="goalAmt"
                    value={formData.goalAmt}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium bg-background"
                    required
                  />
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    min={editingCampaign ? undefined : todayDateStr}
                    onChange={handleInputChange}
                    disabled={!!editingCampaign}
                    className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium bg-background disabled:bg-muted disabled:text-gray-400 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">End Date *</label>
                  <input
                    type="date"
                    name="endate"
                    value={formData.endate}
                    min={formData.startDate || todayDateStr}
                    onChange={handleInputChange}
                    className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium bg-background"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-xs font-bold uppercase tracking-widest bg-background"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the purpose of this campaign..."
                  className="w-full border border-border p-3 rounded-none focus:ring-1 focus:ring-accent outline-none transition-all text-sm min-h-[80px] bg-background"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-8 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 border border-border text-muted-foreground hover:bg-muted font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-accent text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                  {editingCampaign ? "Update Campaign" : "Create Campaign"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDonation;
