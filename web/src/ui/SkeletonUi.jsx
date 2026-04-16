import React from 'react';

export default function SkeletonUI() {
  return (
    <div className="h-full w-full py-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-36 w-full bg-zinc-800 border border-zinc-800 rounded-xl space-y-3 animate-pulse"
          >
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-72 w-full bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 animate-pulse"
          >
          </div>
        ))}
      </div>

    </div>
  );
}