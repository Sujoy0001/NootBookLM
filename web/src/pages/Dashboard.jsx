import useDashboardData from "../hooks/useDashboardData";
import SkeletonUI from "../ui/SkeletonUi";
import { Link } from "react-router-dom";
import { Link2Icon, UploadCloud } from "lucide-react";

export default function DashboardHome() {
  const { data, loading } = useDashboardData();

  return (
    <div className="h-full w-full px-2 sujoy2">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <div className="flex items-center space-x-4 sujoy1 text-sm">
          <Link to="/app/upload" className="px-3 py-2 bg-white rounded text-black font-bold hover:bg-gray-200 transition-all duration-150">
            <UploadCloud className="w-4 h-4 inline mr-2" />
            Upload Documents
          </Link>
          <Link to="/app/integrations" className="px-3 py-2 border border-white rounded-md text-white font-bold hover:bg-white/10 transition-all duration-150">
            <Link2Icon className="w-4 h-4 inline mr-2" />
            connect api
          </Link>
        </div>
      </div> 

        {loading ? (
          <>
            <SkeletonUI />
          </>
        ) : (
          <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 border border-gray-800 rounded-xl">
              <p className="text-gray-400 text-sm">Documents</p>
              <h2 className="text-2xl mt-2">{data?.documents}</h2>
            </div>

            <div className="p-5 border border-gray-800 rounded-xl">
              <p className="text-gray-400 text-sm">API Requests</p>
              <h2 className="text-2xl mt-2">{data?.requests}</h2>
            </div>

            <div className="p-5 border border-gray-800 rounded-xl">
              <p className="text-gray-400 text-sm">Storage Used</p>
              <h2 className="text-2xl mt-2">{data?.storage}</h2>
            </div>
            </div>
          </>
        )}

      

    </div>
  );
}