import React from "react";
import { Link } from "react-router-dom";
import DonCard from "./DonCard";
import giving from "../../assets/giving.jpg"

const IntDonation = () => {
const internalChurchDonations = [ { title: "Church Building Maintenance", description: "Supporting regular maintenance, repairs, and upkeep of the church building and facilities.", goalamount: 150000, collectedamount: 86500, startdate: "2026-01-01", enddate: "2026-03-31" }, { title: "Sunday Worship Equipment", description: "Purchasing and upgrading sound systems, musical instruments, and worship equipment.", goalamount: 90000, collectedamount: 47200, startdate: "2026-01-10", enddate: "2026-02-28" }, { title: "Church Youth Ministry", description: "Funding youth programs, Bible studies, retreats, and leadership development activities.", goalamount: 75000, collectedamount: 38900, startdate: "2026-01-15", enddate: "2026-03-15" }, { title: "Sunday School Resources", description: "Providing teaching materials, books, and creative learning resources for children’s ministry.", goalamount: 50000, collectedamount: 28400, startdate: "2026-01-20", enddate: "2026-02-20" }, { title: "Church Outreach Fund", description: "Supporting local evangelism, prayer meetings, and community outreach initiatives.", goalamount: 100000, collectedamount: 61250, startdate: "2026-01-25", enddate: "2026-04-01" } ];


  return (
    <div>

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">

        {/* Background image */}
        <img
          src={giving}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          alt="Giving background"
        />


        {/* CONTENT OVER IMAGE */}
        <div className="relative z-20 pt-40">

          <h1 className="text-4xl font-bold text-center text-white">
            Donate for Church
          </h1>
          <hr className="w-40 mx-auto my-6 border-white" />

          <div className="flex flex-wrap justify-center gap-6 px-6 ">
            {internalChurchDonations.map((elem, index) => (
              <DonCard
                key={index}
                title={elem.title}
                desc={elem.description}
                gamount={elem.goalamount}
                camount={elem.collectedamount}
                start={elem.startdate}
                end={elem.enddate}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default IntDonation;
