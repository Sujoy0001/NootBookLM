import SkeletonUI from "../ui/SkeletonUi";
import { Link } from "react-router-dom";
import { PlusCircleIcon, Upload } from "lucide-react";
import {
  dashboardStats,
  apiChartData,
  storageChartData,
} from "../data/dashboardData";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

export default function DashboardHome() {
  const loading = false;

  return (
    <div className="h-full w-full px-2 sujoy2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <div className="flex items-center space-x-4 sujoy1 text-sm">
          <Link
            to="/app/integrations"
            className="px-3 py-2 text-white hover:bg-gray-200 hover:text-black font-bold bg-white/10 transition-all duration-150"
          >
            <PlusCircleIcon className="w-4 h-4 inline mr-2" />
            Connect API
          </Link>

          <Link
            to="/app/upload"
            className="px-3 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-all duration-150"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Documents
          </Link>
        </div>
      </div>

      {loading ? (
        <SkeletonUI />
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            {dashboardStats.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-5 border border-white/10"
              >
                <h3 className="text-gray-400 text-sm">{item.title}</h3>
                <h1 className="text-3xl font-bold mt-2">{item.value}</h1>
                <p className="text-gray-500 text-sm mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-[350px]">
              <h2 className="text-lg font-semibold mb-4">Total API Calls</h2>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={apiChartData}>
                  <XAxis dataKey="name" stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#fff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-[350px]">
              <h2 className="text-lg font-semibold mb-4">Storage Used</h2>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={storageChartData}>
                  <XAxis dataKey="name" stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="storage"
                    stroke="#fff"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}