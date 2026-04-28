import React, { useState } from "react";
import { Bell, Shield, Key, Moon, Globe, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    apiAlerts: false,
    darkMode: true,
    publicProfile: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="h-full w-full px-2 sujoy1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white sujoy2 tracking-tight">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your account preferences and configurations.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl mx-auto">
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
                
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-sm text-zinc-400">Toggle dark space theme across the app.</p>
                  </div>
                  <button 
                    disabled
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-not-allowed opacity-50 ${settings.darkMode ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-white font-medium">Public Profile</h3>
                    <p className="text-sm text-zinc-400">Make your basic stats visible to others.</p>
                  </div>
                  <button 
                    disabled
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-not-allowed opacity-50 ${settings.publicProfile ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${settings.publicProfile ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-medium">Email Updates</h3>
                    <p className="text-sm text-zinc-400">Receive weekly summaries of your RAG usage.</p>
                  </div>
                  <button 
                    disabled
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-not-allowed opacity-50 ${settings.emailNotifications ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-white font-medium">API Limits Alert</h3>
                    <p className="text-sm text-zinc-400">Get notified when you reach 90% of your API quota.</p>
                  </div>
                  <button 
                    disabled
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-not-allowed opacity-50 ${settings.apiAlerts ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${settings.apiAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Change Password</h3>
                      <p className="text-sm text-zinc-400">Update your account password securely.</p>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 bg-white/5 text-white/40 rounded-lg transition-colors font-medium text-sm cursor-not-allowed">
                    Update
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-zinc-400">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 bg-white/20 text-black/50 rounded-lg transition-colors font-bold text-sm cursor-not-allowed">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
