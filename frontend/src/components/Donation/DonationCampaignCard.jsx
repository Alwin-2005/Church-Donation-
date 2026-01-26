import React from "react";

const DonationCampaignCard = ({
  campaign,
  role,
  onEdit,
  onDelete,
  onDonate,
}) => {
  const {
    title,
    description,
    goalAmount,
    collectedAmount,
    startDate,
    endDate,
    status,
  } = campaign;

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <div className="border min-h-60 w-68 p-5 shadow-lg rounded-lg m-10 bg-white opacity-95">

        {/* TITLE */}
        <h2 className="font-bold underline">{title}</h2>

        {/* DESCRIPTION */}
        <h4 className="mt-5">{description}</h4>

        {/* AMOUNTS */}
        <h5 className="mt-4 font-bold">
          Goal Amount: ₹{goalAmount}
        </h5>

        <h5 className="mt-4 font-bold">
          Collected Amount: ₹{collectedAmount || 0}
        </h5>

        {/* DATES */}
        <h5 className="mt-4 font-bold">
          Start Date: {new Date(startDate).toLocaleDateString()}
        </h5>

        {endDate && (
          <h5 className="mt-4 font-bold">
            End Date: {new Date(endDate).toLocaleDateString()}
          </h5>
        )}

        {/* MEMBER ACTION */}
        {(role === "churchMember" || role === "externalMember") && (
          <button
            onClick={() => onDonate?.(campaign)}
            className="mt-4 text-center text-sm ml-35 font-bold w-20 border-2 hover:opacity-40 rounded"
          >
            Donate
          </button>
        )}

        {/* ADMIN CONTROLS */}
        {role === "admin" && (
          <>
            <h5 className="mt-4 font-bold">
              Status:{" "}
              <span
                className={
                  status === "active"
                    ? "text-green-600"
                    : status === "paused"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {status}
              </span>
            </h5>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(campaign)}
                className="text-sm font-bold border-2 px-3 py-1 rounded hover:opacity-40"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(campaign._id)}
                className="text-sm font-bold border-2 px-3 py-1 rounded hover:opacity-40"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationCampaignCard;
