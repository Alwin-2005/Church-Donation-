import React from "react";

const DonationHistory = () => {
  // mock data shaped exactly like populated backend response
  const donations = [
    {
      _id: "65fabc12e9a1",
      user: {
        name: "John D",
        email: "john@gmail.com",
      },
      campaign: {
        title: "Church Building Fund",
        donationType: "internal",
        status: "active",
      },
      amount: 2000,
      paymentStatus: "paid",
      receiptNo: "RCT-10231",
      createdAt: "2026-01-12T10:30:00",
    },
    {
      _id: "65fabd98aa21",
      user: {
        name: "Maria S",
        email: "maria@gmail.com",
      },
      campaign: {
        title: "Flood Relief",
        donationType: "external",
        status: "closed",
      },
      amount: 1000,
      paymentStatus: "failed",
      receiptNo: "RCT-10245",
      createdAt: "2026-02-02T14:15:00",
    },
  ];

  const formatDate = date =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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
                  <div className="font-medium">{d.user.name}</div>
                  <div className="text-xs text-gray-500">{d.user.email}</div>
                </td>

                <td className="p-3">{d.campaign.title}</td>

                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      d.campaign.donationType === "internal"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {d.campaign.donationType}
                  </span>
                </td>

                <td className="p-3 font-semibold">₹{d.amount}</td>

                <td className="p-3">{formatDate(d.createdAt)}</td>

                <td
                  className={`p-3 font-medium ${
                    d.paymentStatus === "paid"
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
