import React from 'react';

export default function TopBanner() {
  return (
    <div className="w-full bg-linear-to-r from-black via-gray-900 to-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center relative">

        {/* Background dotted pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#22c55e_1px,_transparent_1px)] [background-size:16px_16px]"></div>

        {/* Content */}
        <p className="relative z-10 text-center">
          Team accounts with unlimited members now available to everyone! Invite your teammates and ship faster together, even on the Free Plan.
          <span className="ml-2">›</span>
        </p>

      </div>
    </div>
  );
}