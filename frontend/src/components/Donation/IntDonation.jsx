import React from "react";
import DonationLayout from "./DonationLayout";

const IntDonation = () => {
  

  const internalChurchDonations = [
  {
    _id: "1",
    title: "Church Building Maintenance",
    description:
      "Supporting regular maintenance, repairs, and upkeep of the church building and facilities.",
    goalAmount: 150000,
    collectedAmount: 86500,
    startDate: "2026-01-01",
    endDate: "2026-03-31",
  },
  {
    _id: "2",
    title: "Sunday Worship Equipment",
    description:
      "Purchasing and upgrading sound systems, musical instruments, and worship equipment.",
    goalAmount: 90000,
    collectedAmount: 47200,
    startDate: "2026-01-10",
    endDate: "2026-02-28",
  },
  {
    _id: "3",
    title: "Church Youth Ministry",
    description:
      "Funding youth programs, Bible studies, retreats, and leadership development activities.",
    goalAmount: 75000,
    collectedAmount: 38900,
    startDate: "2026-01-15",
    endDate: "2026-03-15",
  },
  {
    _id: "4",
    title: "Sunday School Resources",
    description:
      "Providing teaching materials, books, and creative learning resources for children’s ministry.",
    goalAmount: 50000,
    collectedAmount: 28400,
    startDate: "2026-01-20",
    endDate: "2026-02-20",
  },
  {
    _id: "5",
    title: "Church Outreach Fund",
    description:
      "Supporting local evangelism, prayer meetings, and community outreach initiatives.",
    goalAmount: 100000,
    collectedAmount: 61250,
    startDate: "2026-01-25",
    endDate: "2026-04-01",
  },
];
  return(
    <DonationLayout
      title="Donate for Church"
      campaigns={internalChurchDonations}
      role="churchMember"
      onDonate={(c) => navigate(`/donate/${c._id}`)}
    />
  );
  
};

export default IntDonation;
