import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get("admin/donations/view");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donation history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (donation) => {
    setDownloadingId(donation._id);
    try {
      const res = await api.get(`admin/donations/${donation._id}/receipt`, {
        responseType: "blob",
        withCredentials: true,
      });

      // Create a temporary object URL and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${donation.receiptNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Receipt download failed:", err);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = date =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) return <div className="mt-24 px-6 text-center">Loading donations...</div>;
  if (error) return <div className="mt-24 px-6 text-center text-red-500">{error}</div>;

  return (
    <div className="mt-24 px-6">
      <h1 className="text-2xl font-semibold mb-6">Donation History </h1>

      <div className="bg-card rounded-lg shadow overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted font-medium">
            <tr>
              <th className="p-3">Donation ID</th>
              <th className="p-3">Donor</th>
              <th className="p-3">Cause</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Receipt</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map(d => (
              <tr key={d._id} className="border-t hover:bg-background">
                <td className="p-3 font-mono text-xs">{d._id}</td>

                <td className="p-3">
                  <div className="font-medium">{d.userId?.fullname || "Unknown Donor"}</div>
                  <div className="text-xs text-muted-foreground">{d.userId?.email || "N/A"}</div>
                </td>

                <td className="p-3">{d.donationCampaignId?.title || "N/A"}</td>

                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${d.donationCampaignId?.donationType === "internal"
                      ? "bg-blue-100 text-primary"
                      : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {d.donationCampaignId?.donationType || "N/A"}
                  </span>
                </td>

                <td className="p-3 font-semibold">₹{d.amount}</td>

                <td className="p-3">{formatDate(d.createdAt)}</td>

                <td
                  className={`p-3 font-medium ${d.paymentStatus === "paid"
                    ? "text-green-600"
                    : d.paymentStatus === "failed"
                      ? "text-red-500"
                      : "text-yellow-600"
                    }`}
                >
                  {d.paymentStatus}
                </td>

                <td className="p-3 text-xs">{d.receiptNo}</td>

                <td className="p-3 space-x-2">
                  {d.paymentStatus === "paid" && (
                    <button
                      onClick={() => handleDownloadReceipt(d)}
                      disabled={downloadingId === d._id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-black text-white text-xs font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {downloadingId === d._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          Downloading…
                        </>
                      ) : (
                        <>
                          ↓ Receipt
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationHistory;

