import React, { useRef, useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import ShowUploadData from "../ui/ShowUploadData";
import { useUploadDocs } from "../context/FirebaseContext";
import { auth } from "../lib/firebase";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const { data: rawDocs, loading } = useUploadDocs();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!auth.currentUser) {
      alert("You must be logged in to upload files.");
      return;
    }

    setUploading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      
      const formData = new FormData();
      formData.append("file", file);

      // We'll use VITE_NODE_SERVER_URL or fallback to localhost:3000
      const backendUrl = import.meta.env.VITE_NODE_SERVER_URL || "http://localhost:3000";
      
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      // We don't need to manually update state; Firestore onSnapshot will pick up the new doc!
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Error uploading file: " + err.message);
    } finally {
      setUploading(false);
      // clear the input so the same file can be uploaded again if needed
      event.target.value = null;
    }
  };

  // Map the raw Firestore documents to the format expected by ShowUploadData
  const uploadedDocs = rawDocs.map((doc) => ({
    id: doc.id,
    name: doc.filename || "Unknown File",
    ext: doc.filename ? doc.filename.split('.').pop() : "unknown",
    status: doc.status === 'processed' ? 'Deployed' : (doc.status === 'processing' ? 'Processing' : 'Failed'),
    size: doc.sizeBytes ? (doc.sizeBytes / (1024 * 1024)).toFixed(1) + " MB" : "0 MB",
    date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Unknown date",
    type: doc.status === 'processed' ? 'active' : 'suspended'
  }));

  return (
    <div className="min-h-screen px-2 sujoy1">
      <div className="mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 sujoy2">Document Upload</h1>

          <div className="bg-zinc-950 border border-white/20 rounded-xl relative overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-3">
                Get organized your documents in one place
              </h2>

              <p className="text-zinc-300 mb-6 max-w-sm">
                Upload your documents and let our RAG engine handle the rest. From extracting knowledge to generating context-aware answers, our platform makes information retrieval effortless and efficient.
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="bg-white text-black cursor-pointer px-4 py-2 rounded flex items-center gap-2 font-medium hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? <LoaderCircle size={18} className="animate-spin" /> : <Upload size={18} />}
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>

            <div className="hidden md:flex md:w-1/2 border-l border-zinc-800 bg-zinc-950 items-center justify-center p-4">
              <div
                onClick={() => !uploading && fileInputRef.current.click()}
                className={`w-full h-full border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {uploading ? (
                  <LoaderCircle size={40} className="mb-3 animate-spin text-zinc-400" />
                ) : (
                  <Upload size={40} className="mb-3" />
                )}
                <p className="text-lg font-medium">{uploading ? "Uploading..." : "Drag & Drop"}</p>
                {!uploading && <p className="text-sm text-zinc-500">or click to upload</p>}
              </div>
            </div>
          </div>

          <input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>

        {loading ? (
          <p className="text-zinc-400 text-center mt-8">Loading documents...</p>
        ) : (
          <ShowUploadData services={uploadedDocs} />
        )}
      </div>
    </div>
  );
}