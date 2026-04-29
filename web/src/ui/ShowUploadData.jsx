import React, { useState, useMemo } from "react";
import {
  Search,
  Globe,
  Check,
  ArrowDown,
  Trash2,
  X,
} from "lucide-react";
import { auth } from "../lib/firebase";

export default function ShowUploadData({ services }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Files");
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const counts = {
    Files: services.filter((s) => s.category === "file").length,
    URLs: services.filter((s) => s.category === "url").length,
    All: services.length,
  };

  const filteredServices = useMemo(() => {
    let filtered = services;

    if (activeTab === "Files")
      filtered = filtered.filter((s) => s.category === "file");
    if (activeTab === "URLs")
      filtered = filtered.filter((s) => s.category === "url");

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [services, activeTab, searchTerm]);

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmName === selectedFile.name) {
      setDeleting(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const backendUrl = import.meta.env.VITE_NODE_SERVER_URL || "http://localhost:3000";
        
        const endpoint = selectedFile.category === "url" 
          ? `${backendUrl}/api/url/${selectedFile.id}`
          : `${backendUrl}/api/upload/${selectedFile.id}`;
          
        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Delete failed");
        
        // Success: Close modal (Firestore onSnapshot will update the list automatically)
        setSelectedFile(null);
        setConfirmName("");
      } catch (error) {
        console.error("Failed to delete:", error);
        alert("Failed to delete file.");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="sujoy2">
      <h2 className="text-xl font-bold mb-4 text-white">Uploaded Documents</h2>

      <div className="flex border border-zinc-800 w-fit mb-6 bg-[#0a0a0a]">
        {["Files", "URLs", "All"].map((tab, idx) => (
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
                {service.url ? (
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-400 cursor-pointer truncate max-w-[200px]"
                    title={service.name}
                  >
                    {service.name}
                  </a>
                ) : (
                  <span className="truncate max-w-[200px]" title={service.name}>{service.name}</span>
                )}
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
              disabled={confirmName !== selectedFile.name || deleting}
              className="w-full mt-4 cursor-pointer bg-red-500 disabled:bg-zinc-700 text-white py-3 rounded"
            >
              {deleting ? "Deleting..." : "Delete File"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}