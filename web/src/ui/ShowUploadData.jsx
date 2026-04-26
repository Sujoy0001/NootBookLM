import React, { useState, useMemo } from "react";
import {
  Search,
  Globe,
  Check,
  ArrowDown,
  Trash2,
  X,
} from "lucide-react";

export default function ShowUploadData({ services }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const counts = {
    Active: services.filter((s) => s.type === "active").length,
    Failed: services.filter((s) => s.type === "suspended").length,
    All: services.length,
  };

  const filteredServices = useMemo(() => {
    let filtered = services;

    if (activeTab === "Active")
      filtered = filtered.filter((s) => s.type === "active");
    if (activeTab === "Failed")
      filtered = filtered.filter((s) => s.type === "suspended");

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [services, activeTab, searchTerm]);

  const handleDelete = () => {
    if (confirmName === selectedFile.name) {
      alert(`${selectedFile.name} deleted`);
      setSelectedFile(null);
      setConfirmName("");
    }
  };

  return (
    <div className="sujoy2">
      <h2 className="text-xl font-bold mb-4 text-white">Uploaded Documents</h2>

      <div className="flex border border-zinc-800 w-fit mb-6 bg-[#0a0a0a]">
        {["Active", "Failed", "All"].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm transition-colors border-zinc-800 cursor-pointer ${
              activeTab === tab
                ? "bg-[#2e1065] text-white border border-[#2e1065]"
                : "text-zinc-400 hover:text-zinc-200"
            } ${idx !== 2 && activeTab !== tab ? "border-r" : ""}`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search files"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-zinc-800 rounded-md text-white text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-gray-300 border-b border-zinc-800">
            <div className="col-span-4">FILE NAME</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2">TYPE</div>
            <div className="col-span-2">SIZE</div>
            <div className="col-span-1 flex items-center gap-1">
              DATE <ArrowDown size={14} />
            </div>
            <div className="col-span-1"></div>
          </div>

          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-[#ffffff15] group"
            >
              <div className="col-span-4 flex italic items-center gap-3">
                <Globe className="text-zinc-500 w-4 h-4" />
                <span>{service.name}</span>
              </div>

              <div className="col-span-2 font-bold">
                {service.status === "Deployed" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#022c22] text-[#34d399]">
                    <Check size={12} />
                    Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-red-900/30 text-red-400">
                    Failed
                  </span>
                )}
              </div>

              <div className="col-span-2 uppercase">{service.ext}</div>
              <div className="col-span-2">{service.size}</div>
              <div className="col-span-1 min-w-[150px]">{service.date}</div>

              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => setSelectedFile(service)}
                  className="opacity-0 cursor-pointer group-hover:opacity-100 text-red-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 sujoy2 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-zinc-800 rounded p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white font-semibold">
                Confirm Delete
              </h3>
              <button onClick={() => setSelectedFile(null)}>
                <X className="text-zinc-400 cursor-pointer" />
              </button>
            </div>

            <p className="text-zinc-400 text-sm mb-3 italic">
              Type <span className="text-white">{selectedFile.name}</span> to
              confirm deletion.
            </p>

            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-zinc-700 rounded px-4 py-3 text-white outline-none"
              placeholder="Enter file name"
            />

            <button
              onClick={handleDelete}
              disabled={confirmName !== selectedFile.name}
              className="w-full mt-4 cursor-pointer bg-red-500 disabled:bg-zinc-700 text-white py-3 rounded"
            >
              Delete File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}