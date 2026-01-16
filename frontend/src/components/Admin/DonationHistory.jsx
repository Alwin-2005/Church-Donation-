import React from "react";

const DonationHistory = () => {
  const donations = [
    {
      id: "DON001",
      cause: "Church Building Fund",
      amount: 2000,
      date: "12 Jan 2026",
      status: "Success",
    },
    {
      id: "DON002",
      cause: "Orphan Support",
      amount: 1500,
      date: "22 Jan 2026",
      status: "Success",
    },
    {
      id: "DON003",
      cause: "Flood Relief",
      amount: 1000,
      date: "02 Feb 2026",
      status: "Failed",
    },
  ];

  return (
    <div className="mt-24 px-6">
      <h1 className="text-2xl font-semibold mb-6">Donation History</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Donation ID</th>
              <th className="p-3">Cause</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map(d => (
              <tr key={d.id} className="border-t text-sm">
                <td className="p-3">{d.id}</td>
                <td className="p-3">{d.cause}</td>
                <td className="p-3">₹{d.amount}</td>
                <td className="p-3">{d.date}</td>
                <td
                  className={`p-3 font-medium ${
                    d.status === "Success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {d.status}
                </td>
                <td className="p-3">
                  {d.status === "Success" && (
                    <button className="text-blue-600 underline text-sm">
                      Download Receipt
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
