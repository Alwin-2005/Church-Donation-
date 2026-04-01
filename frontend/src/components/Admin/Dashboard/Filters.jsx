import React from "react";

const Filters = ({ duration, setDuration, dateRange, setDateRange }) => {
  const durations = [
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "financialYear", label: "Financial Year" },
    { id: "custom", label: "Custom Range" }
  ];

  const financialYears = ["2023-2024", "2024-2025", "2025-2026"];

  return (
    <div className="bg-card p-8 rounded-none border border-border mb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Time Duration</h3>
          <div className="flex flex-wrap gap-2">
            {durations.map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`px-5 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border ${
                  duration === d.id
                    ? "bg-accent text-primary-foreground border-accent shadow-lg shadow-accent/20"
                    : "bg-background text-muted-foreground border-border hover:border-accent hover:text-accent"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {duration === "financialYear" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Select Financial Year</h3>
            <select
              value={dateRange.financialYear || ""}
              onChange={(e) => setDateRange({ ...dateRange, financialYear: e.target.value })}
              className="bg-background border border-border px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-accent outline-none min-w-[200px]"
            >
              <option value="">Current Year</option>
              {financialYears.map(fy => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
          </div>
        )}

        {duration === "custom" && (
          <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-right-2 duration-500">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="bg-background border border-border px-4 py-2.5 rounded-none text-xs font-bold focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="bg-background border border-border px-4 py-2.5 rounded-none text-xs font-bold focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
