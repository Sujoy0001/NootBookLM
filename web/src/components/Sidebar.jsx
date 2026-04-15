import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { 
  Key, Users, Wallet, Puzzle, Settings, 
  MessageSquare, ChevronLeft, Building2
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NAV_ITEMS = [
    { icon: Key, label: 'Overview', path: '/app' },
    { icon: Users, label: 'People', path: '/app/people' },
    { icon: Wallet, label: 'Billing', path: '/app/billing' },
    { icon: Puzzle, label: 'Integrations', path: '/app/integrations' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const BOTTOM_ITEMS = [
    { icon: MessageSquare, label: 'Feedback', path: '/feedback', color: 'text-rose-400' },
  ];

  return (
    <div
      className={`
        h-full flex flex-col bg-zinc-800 text-zinc-300 sujoy2
        border-r border-zinc-700 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'} shrink-0
      `}
    >

      {/* Top */}
      <div className="p-4">
        {!isCollapsed ? (
          <span className="font-semibold text-gray-300 text-sm">
            ORGANIZATION
          </span>
        ) : (
          <div className="flex justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">

        {/* Main Nav */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.path}
                key={item.label}
                className={({ isActive }) => `
                  relative w-full flex items-center rounded transition-all duration-200 group hover:bg-zinc-900 cursor-pointer
                  ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'}
                  ${isActive ? 'bg-black/40 text-white' : 'text-white'}
                `}
              >
                <Icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'} transition-transform group-hover:scale-110`} />

                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}

                {/* Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-md sujoy2 rounded-md opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap border border-zinc-700">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">

          {/* Bottom Nav */}
          <nav className="p-3">
            {BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  to={item.path}
                  key={item.label}
                  className={({ isActive }) => `
                    relative w-full flex items-center rounded transition-all duration-200 group cursor-pointer
                    ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'}
                    ${isActive 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'} ${item.color}`} />

                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap border border-zinc-700">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <div className="p-3 border-t border-zinc-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                relative w-full flex items-center rounded transition-all duration-200 group cursor-pointer
                ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'}
                text-zinc-400 hover:bg-zinc-800/50 hover:text-white
              `}
            >
              <ChevronLeft
                className={`w-5 h-5 ${!isCollapsed && 'mr-3'} transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />

              {!isCollapsed && (
                <span className="text-sm font-medium">
                  Collapse menu
                </span>
              )}

              {/* Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap border border-zinc-700">
                  Expand menu
                </div>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;