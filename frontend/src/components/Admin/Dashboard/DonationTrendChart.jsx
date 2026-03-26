import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const DonationTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No donation trend data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-foreground">Donation Trends</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val.toLocaleString()}`} tick={{ fontSize: 11, fill: '#888' }} />
            <Tooltip 
              formatter={(val) => `₹${val.toLocaleString()}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area 
                type="monotone" 
                dataKey="amount" 
                name="Total Donations"
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationTrendChart;
