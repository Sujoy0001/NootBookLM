import React, { useRef } from "react";
import { Upload } from "lucide-react";
import ShowUploadData from "../ui/ShowUploadData";
import { uploadedDocs } from "../data/uploadData";

export default function UploadPage() {
  const fileInputRef = useRef(null);

  return (
    <div className="min-h-screen px-2 sujoy1">
      <div className="mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4 sujoy2">Document Upload</h1>

          <div className="bg-zinc-950 border border-white/20 rounded-xl relative overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-3">
                Get organized with Projects
              </h2>

              <p className="text-zinc-300 mb-6 max-w-sm">
                An easier way to organize your resources and collaborate with
                team members.
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-medium hover:bg-zinc-200"
                >
                  <Upload size={18} />
                  Upload File
                </button>
              </div>
            </div>

            <div className="hidden md:flex md:w-1/2 border-l border-zinc-800 bg-zinc-950 items-center justify-center p-4">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-full h-full border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={40} className="mb-3" />
                <p className="text-lg font-medium">Drag & Drop</p>
                <p className="text-sm text-zinc-500">or click to upload</p>
              </div>
            </div>
          </div>

          <input ref={fileInputRef} type="file" className="hidden" multiple />
        </div>

        <ShowUploadData services={uploadedDocs} />
      </div>
    </div>
  );
}