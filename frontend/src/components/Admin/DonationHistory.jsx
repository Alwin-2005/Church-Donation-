import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      <div className="bg-white rounded-lg shadow overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 font-medium">
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
              <tr key={d._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{d._id}</td>

                <td className="p-3">
                  <div className="font-medium">{d.userId?.fullname || "Unknown Donor"}</div>
                  <div className="text-xs text-gray-500">{d.userId?.email || "N/A"}</div>
                </td>

                <td className="p-3">{d.donationCampaignId?.title || "N/A"}</td>

                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${d.donationCampaignId?.donationType === "internal"
                      ? "bg-blue-100 text-blue-700"
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
                    <button className="text-blue-600 underline">
                      Receipt
                    </button>
                  )}
                  <button className="text-gray-600 underline">
                    View
                  </button>
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
