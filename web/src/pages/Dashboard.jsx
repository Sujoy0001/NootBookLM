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
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const loading = false;

  return (
    <div className="h-full w-full px-2 sujoy1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold sujoy2">Overview</h1>
        <div className="flex items-center space-x-4 sujoy1 text-sm">
          <Link
            to="/app/integrations"
            className="px-3 py-2 rounded text-white hover:bg-white hover:text-black font-bold border border-white/20 transition-all duration-150"
          >
            <PlusCircleIcon className="w-4 h-4 inline mr-2" />
            Connect API
          </Link>

          <Link
            to="/app/upload"
            className="px-3 py-2 rounded bg-white text-black font-bold hover:bg-gray-200 transition-all duration-150"
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
                className="bg-zinc-950 rounded-2xl p-5 border border-white/10"
              >
                <h3 className="text-gray-200 text-sm">{item.title}</h3>
                <h1 className="text-3xl font-bold mt-2">{item.value}</h1>
                <p className="text-gray-400 text-sm mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 rounded-2xl p-5 border border-white/10 h-87.5">
              <h2 className="text-lg font-semibold mb-4">Total API Calls</h2>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={apiChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888" 
                    tick={{ fill: '#888' }}
                    axisLine={{ stroke: '#333' }}
                    tickLine={{ stroke: '#333' }}
                  />
                  <YAxis 
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    axisLine={{ stroke: '#333' }}
                    tickLine={{ stroke: '#333' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar 
                    dataKey="calls" 
                    fill="#fff" 
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-zinc-950 rounded-2xl p-5 border border-white/10 h-87.5">
              <h2 className="text-lg font-semibold mb-4">Storage Used</h2>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={storageChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    axisLine={{ stroke: '#333' }}
                    tickLine={{ stroke: '#333' }}
                  />
                  <YAxis 
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    axisLine={{ stroke: '#333' }}
                    tickLine={{ stroke: '#333' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="storage"
                    stroke="#fff"
                    strokeWidth={3}
                    dot={{ fill: '#fff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#fff' }}
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