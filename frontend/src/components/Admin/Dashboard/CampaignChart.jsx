import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CampaignChart = ({ data }) => {
  const [selectedCampaign, setSelectedCampaign] = useState("All");

  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-10 rounded-none border border-border h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No campaign data available</p>
      </div>
    );
  }

  const filteredData = selectedCampaign === "All" 
    ? data 
    : data.filter(d => d.name === selectedCampaign);

  return (
    <div className="bg-card p-10 rounded-none border border-border h-[450px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-xl font-serif font-bold text-foreground tracking-tight">Campaign Performance</h3>
        <select 
          value={selectedCampaign} 
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="bg-background border border-border px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-accent min-w-[200px]"
        >
          <option value="All">All Campaigns</option>
          {data.map(d => (
            <option key={d.name} value={d.name}>
              {d.name.length > 25 ? d.name.substring(0, 25) + '...' : d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val.toLocaleString()}`} tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip 
              formatter={(val) => `₹${val.toLocaleString()}`}
              contentStyle={{ borderRadius: '0px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              cursor={{ fill: '#f8f4f0' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="goal" name="Goal Amount" fill="#E9D5FF" />
            <Bar dataKey="collected" name="Collected Amount" fill="#C06C4C" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignChart;
