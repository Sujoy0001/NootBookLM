import React, { useState } from "react";

const StorageGraph = () => {
  const DAILY_LIMIT = 20;
  const used = 12;
  const remaining = DAILY_LIMIT - used;
  const percentage = (used / DAILY_LIMIT) * 100;

  const getCircleColor = () => {
    if (percentage <= 70) return "text-blue-500";
    if (percentage <= 90) return "text-yellow-400";
    return "text-red-500";
  };

  const radius = 60;
  const diameter = radius * 2;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (percentage / 100) * circumference;

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full h-full bg-zinc-900 rounded-xl p-5 shadow-sm sujoy1">
      
      {/* Title */}
      <h2 className="text-base font-bold text-white mb-4">
        API Usage
      </h2>

      {/* Half Circular Progress */}
      <div className="flex justify-center mb-4">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <svg
            width="180"
            height="120"
            viewBox="0 0 140 80"
            className="overflow-visible"
          >
            {/* Background */}
            <path
              d={`M 10,70 A ${radius},${radius} 0 0,1 ${diameter + 10},70`}
              stroke="#3f3f46"
              strokeWidth="10"
              fill="none"
              strokeLinecap="butt"   // 🔥 flat start/end
            />

            {/* Progress */}
            <path
              d={`M 10,70 A ${radius},${radius} 0 0,1 ${diameter + 10},70`}
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="butt"   // 🔥 flat start/end
              className={`transition-all duration-500 ease-out ${getCircleColor()}`}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center bottom-2">
            <span className="text-2xl font-bold text-white">
              {used}
            </span>
            <span className="text-xs text-zinc-400 ml-1">
              / {DAILY_LIMIT}
            </span>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              {used} API calls used
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45"></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center space-y-1 mt-2">
        <p className="text-sm text-zinc-300">
          {remaining} requests remaining
        </p>
        <p className="text-xs text-zinc-500">
          Daily limit: {DAILY_LIMIT}
        </p>
      </div>
    </div>
  );
};

export default StorageGraph;