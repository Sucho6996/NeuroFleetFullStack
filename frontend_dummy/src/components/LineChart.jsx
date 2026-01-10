import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Mon", trips: 400, revenue: 240 },
  { name: "Tue", trips: 300, revenue: 139 },
  { name: "Wed", trips: 500, revenue: 380 },
  { name: "Thu", trips: 200, revenue: 120 },
  { name: "Fri", trips: 600, revenue: 420 },
];

const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ReLineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip />
        <Line type="monotone" dataKey="trips" stroke="#6366f1" strokeWidth={2} />
        <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
