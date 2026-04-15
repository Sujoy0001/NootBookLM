import useDashboardData from "../hooks/useDashboardData";
import SkeletonUI from "../ui/SkeletonUi";

export default function DashboardHome() {
  const { data, loading } = useDashboardData();

  return (
    <div className="h-full w-full px-2 sujoy2">

      <h1 className="text-3xl font-semibold">Overview</h1>

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