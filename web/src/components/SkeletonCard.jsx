export default function SkeletonCard() {
  return (
    <div className="p-5 border border-gray-800 rounded-xl animate-pulse">
      <div className="h-4 w-24 bg-gray-700 rounded mb-3"></div>
      <div className="h-6 w-16 bg-gray-600 rounded"></div>
    </div>
  );
}