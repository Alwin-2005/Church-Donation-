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
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-foreground">Donation Distribution</h3>
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
