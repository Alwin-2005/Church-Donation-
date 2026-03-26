import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CampaignChart = ({ data }) => {
  const [selectedCampaign, setSelectedCampaign] = useState("All");

  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No campaign data available</p>
      </div>
    );
  }

  const filteredData = selectedCampaign === "All" 
    ? data 
    : data.filter(d => d.name === selectedCampaign);

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h3 className="text-lg font-bold text-foreground">Campaign Performance</h3>
        <select 
          value={selectedCampaign} 
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="bg-background border border-border px-3 py-1.5 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-black min-w-[150px] max-w-full sm:max-w-[200px]"
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              cursor={{ fill: '#f8f8f8' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="goal" name="Goal Amount" fill="#E9D5FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="collected" name="Collected Amount" fill="#9333EA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignChart;
