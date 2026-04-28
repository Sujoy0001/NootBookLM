import SkeletonUI from "../ui/SkeletonUi";
import { Link } from "react-router-dom";
import { PlusCircleIcon, Upload } from "lucide-react";
import { useFirebaseData } from "../context/FirebaseContext";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { data, loading } = useFirebaseData();

  const isLoading = loading || !data;

  const dashboardStats = data?.dashboardStats || [];
  const apiChartData = data?.apiChartData || [];
  let storageChartData = data?.storageChartData || [];
  
  // Clean up old backend padding for a cleaner UI
  storageChartData = storageChartData.filter(d => !d.name.includes("0 MB") && !d.name.includes("0.00 MB"));
  
  // Ensure chart has a visual starting point (0)
  if (storageChartData.length > 0 && storageChartData[0].storage > 0) {
    storageChartData = [{ name: "0 Files", storage: 0, files: 0 }, ...storageChartData];
  } else if (storageChartData.length === 0) {
    storageChartData = [{ name: "0 Files", storage: 0, files: 0 }];
  }

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

      {isLoading ? (
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
                <BarChart data={apiChartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fff" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ 
                      backgroundColor: '#09090b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: '500' }}
                  />
                  <Bar 
                    dataKey="calls" 
                    fill="url(#colorCalls)" 
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-zinc-950 rounded-2xl p-5 border border-white/10 h-87.5">
              <h2 className="text-lg font-semibold mb-4">Storage Used</h2>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={storageChartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#09090b', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: '500' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="storage"
                    name="Storage (MB)"
                    stroke="#fff"
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorStorage)"
                    activeDot={{ r: 6, fill: '#fff', stroke: '#111', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}