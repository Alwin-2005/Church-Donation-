import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CategoryDistributionChart = ({ data }) => {
  // Defensive filtering to ensure no merchandise data leaks into the donation graph
  const filteredData = (data || []).filter(item => 
    item.name && 
    !item.name.toLowerCase().includes('merch') && 
    !item.name.toLowerCase().includes('revenue')
  );

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="bg-card p-10 rounded-none border border-border h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No distribution data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-10 rounded-none border border-border h-[450px]">
      <h3 className="text-xl font-serif font-bold mb-10 text-foreground tracking-tight">Donation Distribution</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(val) => `₹${val.toLocaleString()}`}
              contentStyle={{ borderRadius: '0px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ paddingLeft: '20px' }} 
              formatter={(value, entry) => `${value} (₹${entry.payload.value.toLocaleString()})`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
