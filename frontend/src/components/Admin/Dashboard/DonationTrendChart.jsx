import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const DonationTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-10 rounded-none border border-border h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No donation trend data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-10 rounded-none border border-border h-[450px]">
      <h3 className="text-xl font-serif font-bold mb-8 text-foreground tracking-tight">Donation Trends</h3>
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
              contentStyle={{ borderRadius: '0px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
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
