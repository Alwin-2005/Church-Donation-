import React from "react";

const Filters = ({ duration, setDuration, dateRange, setDateRange }) => {
  const durations = [
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "financialYear", label: "Financial Year" },
    { id: "custom", label: "Custom Range" }
  ];

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Time Duration</h3>
          <div className="flex bg-muted p-1 rounded-xl">
            {durations.map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  duration === d.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {duration === "custom" && (
          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="bg-background border border-border px-3 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="bg-background border border-border px-3 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
