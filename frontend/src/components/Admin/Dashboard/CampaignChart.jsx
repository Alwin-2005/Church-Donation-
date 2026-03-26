import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CampaignChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No campaign data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-foreground">Campaign Performance</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip 
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
