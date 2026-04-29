import { useState, useRef, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { useUserData } from "../context/FirebaseContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

function maskKey(key) {
  if (!key || typeof key !== 'string') return "";
  return key.slice(0, 10) + "•".repeat(16) + key.slice(-4);
}

const KeyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

const EyeOnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

// ── Create Modal ──────────────────────────────────────────────
function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 sujoy2">
      <div className="w-96 rounded border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-2xl">
        <p className="mb-1 text-[15px] font-medium text-[#f0f0f0]">Create API key</p>
        <p className="mb-5 text-xs text-[#aeaeae]">Give your key a name to identify it later.</p>

        <label className="mb-2 block text-[10px] uppercase tracking-widest text-[#878181]">Key name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onCreate(name.trim())}
          placeholder="e.g. production-app"
          className="w-full rounded border border-[#2a2a2a] bg-[#111] px-3 py-2.5 font-mono text-sm text-[#f0f0f0] placeholder-[#333] outline-none focus:border-[#444] transition-colors"
        />
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded border border-[#2a2a2a] py-2 text-sm text-[#666] hover:text-[#aaa] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onCreate(name.trim())}
            disabled={!name.trim()}
            className={`flex-1 rounded py-2 text-sm font-medium transition-all
              ${name.trim()
                ? "bg-white cursor-pointer text-black hover:bg-white/90 active:scale-95"
                : "bg-white/10 text-white/20 cursor-not-allowed"}`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────
function DeleteModal({ keyName, onClose, onConfirm }) {
  return (
    <div className="fixed sujoy2 inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-96 rounded border border-red-950 bg-[#1a1a1a] p-6 shadow-2xl">
        <p className="mb-1 text-xl font-medium text-[#f0f0f0]">Delete API key?</p>
        <p className="mb-5 text-sm leading-relaxed text-[#666]">
          This will permanently delete{" "}
          <span className="font-medium text-[#aaa]">"{keyName}"</span>.
          Any apps using it will stop working immediately.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded border border-[#2a2a2a] py-2 text-sm text-[#666] hover:text-[#aaa] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded border border-red-900 bg-red-900 py-2 text-sm font-medium text-red-300 hover:bg-red-800 active:scale-95 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function IntegrationsPage() {
  const { data: userData } = useUserData();
  const [apiKey, setApiKey]       = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied]       = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const warningTimer = useRef(null);

  // Sync API keys from context
  useEffect(() => {
    if (userData?.apiKeys && userData.apiKeys.length > 0) {
      const latestKey = userData.apiKeys[userData.apiKeys.length - 1];
      const keyValue = latestKey.value || latestKey.key || ""; // Handle legacy keys
      
      setApiKey({
        name: latestKey.name || "Default Key",
        value: keyValue,
        created: new Date(latestKey.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })
      });
    } else {
      setApiKey(null);
    }
  }, [userData]);

  const handleCreate = async (name) => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      
      const generateRandomText = (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const newKeyValue = generateRandomText(10) + "-" + auth.currentUser.uid;
      
      const newKey = {
        name: name,
        value: newKeyValue,
        createdAt: new Date().toISOString()
      };

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        apiKeys: arrayUnion(newKey)
      });

      setKeyVisible(true);
      setShowCreate(false);
      setShowWarning(true);
      clearTimeout(warningTimer.current);
      warningTimer.current = setTimeout(() => setShowWarning(false), 8000);
    } catch (err) {
      console.error(err);
      alert("Failed to create API key");
    }
  };

  const handleDelete = async () => {
    if (!apiKey) return;
    
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      
      // Find the exact object in the userData array
      const keyToDelete = userData.apiKeys.find(k => (k.value || k.key) === apiKey.value);
      
      if (keyToDelete) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          apiKeys: arrayRemove(keyToDelete)
        });
      }

      setKeyVisible(false);
      setShowWarning(false);
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete API key");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-white sujoy1">
      <div className="px-2">

        {/* ── Header ── */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-1 text-md uppercase tracking-[0.18em] text-gray-300 font-bold">RAG Studio</p>
            <h1 className="text-3xl font-medium text-white sujoy2">API Keys</h1>
          </div>
          <button
            onClick={() => !apiKey && setShowCreate(true)}
            disabled={!!apiKey}
            title={apiKey ? "Only one API key allowed" : "Create API key"}
            className={`flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium transition-all cursor-pointer sujoy1
              ${apiKey
                ? "cursor-not-allowed border border-white/10 bg-white/5 text-white/20"
                : "bg-white text-black hover:bg-white/90 active:scale-95"}`}
          >
            <KeyIcon />
            Create API key
          </button>
        </div>

        {/* ── Empty State ── */}
        {!apiKey && (
          <div className="flex flex-col items-center justify-center py-24 text-center sujoy1">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
              </svg>
            </div>
            <p className="mb-1.5 text-sm text-[#666]">No API keys yet</p>
            <p className="mb-6 max-w-[220px] text-xs leading-relaxed text-[#444]">
              Create your first key to start making API requests.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded cursor-pointer bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 active:scale-95 transition-all"
            >
              <KeyIcon />
              Create your first API key
            </button>
          </div>
        )}

        {/* ── Key Table ── */}
        {apiKey && (
          <div>
            {/* Warning banner */}
            {showWarning && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-yellow-900/60 bg-yellow-950/40 px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c98a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" /><path d="M12 17h.01" />
                </svg>
                <p className="text-xs leading-relaxed text-yellow-700">
                  API keys are sensitive credentials. Keep them secret and never share them publicly.
                </p>
              </div>
            )}

            {/* Column headers */}
            <div className="mb-1 grid grid-cols-12 gap-4 border-b border-[#1f1f1f] px-2 pb-3 mb-4">
              <span className="col-span-4 text-[10px] uppercase tracking-[0.15em] text-white">Key</span>
              <span className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-white">Name</span>
              <span className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-white">Created</span>
              <span className="col-span-2 text-right text-[10px] uppercase tracking-[0.15em] text-white">Actions</span>
            </div>

            {/* Key row */}
            <div className="grid grid-cols-12 gap-4 items-center rounded border border-[#1f1f1f] bg-white/[0.02] px-2 py-4 hover:bg-white/[0.035] transition-colors">
              <span className="col-span-4 break-all text-md text-emerald-400">
                {keyVisible ? apiKey.value : maskKey(apiKey.value)}
              </span>
              <span className="col-span-3 text-md text-[#aaa]">{apiKey.name}</span>
              <span className="col-span-3 text-md text-[#555]">{apiKey.created}</span>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <button
                  onClick={() => setKeyVisible(!keyVisible)}
                  title={keyVisible ? "Hide" : "Show"}
                  className="rounded-md p-1.5 cursor-pointer text-[#555] hover:text-white hover:bg-white/10 transition-all"
                >
                  {keyVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy"
                  className={`rounded-md p-1.5 cursor-pointer transition-all hover:bg-white/10 ${copied ? "text-emerald-400" : "text-[#555] hover:text-white"}`}
                >
                  <CopyIcon />
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  title="Delete"
                  className="rounded-md p-1.5 cursor-pointer text-[#999595] hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <p className="mt-3 px-1 text-[11px] text-[#8487e7]">
              1 / 1 keys used — delete to create a new one.
            </p>

            {/* Documentation Section */}
            <div className="mt-12 rounded-xl border border-white/10 bg-[#111] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                How to use your API Key
              </h2>

              <p className="text-zinc-400 text-sm mb-4">
                Use this API key to authenticate requests to the RagEngine RAG Server.
                Include it in the{" "}
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-xs">
                  x-api-key
                </code>{" "}
                header of your HTTP requests.
              </p>

              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-white/5 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
                  <span className="text-blue-400">curl</span>{" "}
                  <span className="text-yellow-300">
                    "https://nootbooklm.onrender.com/api/v2/chat/query"
                  </span>{" "}
                  \
                  {"\n"}  -H{" "}
                  <span className="text-emerald-400">
                    "x-api-key: YOUR_SECRET_KEY"
                  </span>{" "}
                  \
                  {"\n"}  -H{" "}
                  <span className="text-emerald-400">
                    "Content-Type: application/json"
                  </span>{" "}
                  \
                  {"\n"}  -X <span className="text-purple-400">POST</span> \
                  {"\n"}  -d{" "}
                  <span className="text-yellow-300">
                    {`'{
        "query": "what is your privacy policy?",
      }'`}
                  </span>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
      {showDelete && (
        <DeleteModal
          keyName={apiKey?.name}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}