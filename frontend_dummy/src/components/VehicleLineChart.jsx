import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="engine"
          name="Engine Health"
          stroke="#16a34a"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="tire"
          name="Tire Health"
          stroke="#ca8a04"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="battery"
          name="Battery Health"
          stroke="#2563eb"
          strokeWidth={2}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
