import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const UserGrowthChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No user growth data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-foreground">User Growth</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" hide />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="stepAfter" 
              dataKey="count" 
              name="Member Count"
              stroke="#6366F1" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
