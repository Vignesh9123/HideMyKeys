"use client";

import { useEffect, useState, use } from "react";
import { Plus, Key, Trash2, ArrowLeft, Eye, EyeOff, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Secret {
  id: string;
  key: string;
  value: string;
  createdAt: string;
}

export default function EnvironmentView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const environmentId = unwrappedParams.id;
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  const fetchSecrets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/environments/${environmentId}/secrets`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setSecrets(data);
    } catch (error) {
      console.error("Failed to fetch secrets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, [environmentId]);

  const handleCreateSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/environments/${environmentId}/secrets`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ key: newKey.toUpperCase(), value: newValue }),
      });
      if (res.ok) {
        setNewKey("");
        setNewValue("");
        fetchSecrets();
      }
    } catch (error) {
      console.error("Failed to create secret", error);
    }
  };

  const handleDeleteSecret = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3001/secrets/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchSecrets();
    } catch (error) {
      console.error("Failed to delete secret", error);
    }
  };

  const toggleVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <Key className="text-primary" size={32} />
          Secrets
        </h1>
        <p className="text-gray-400 mt-2">Manage your environment variables securely.</p>
        
        <div className="mt-6 p-4 glass rounded-xl inline-block">
          <p className="text-sm text-gray-400 mb-2">CLI integration environment ID:</p>
          <div className="flex items-center gap-4">
            <code className="text-primary font-mono bg-primary/10 px-3 py-1 rounded">{environmentId}</code>
            <button 
              onClick={() => copyToClipboard(environmentId)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy ID"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mb-12 glass p-6 rounded-2xl border-l-4 border-l-primary">
          <h2 className="text-xl font-semibold mb-4">Add New Secret</h2>
          <form onSubmit={handleCreateSecret} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-400 mb-2">KEY</label>
              <input
                type="text"
                placeholder="DATABASE_URL"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
              />
            </div>
            <div className="flex-[2] min-w-[250px]">
              <label className="block text-sm font-medium text-gray-400 mb-2">VALUE</label>
              <input
                type="text"
                placeholder="postgresql://..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!newKey.trim() || !newValue.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 h-[50px]"
            >
              <Plus size={20} /> Add
            </button>
          </form>
        </section>

        <section>
          {loading ? (
            <div className="text-gray-400 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading secrets...
            </div>
          ) : secrets && secrets.length === 0 ? (
            <div className="text-center p-12 glass rounded-2xl text-gray-400">
              No secrets found for this environment.
            </div>
          ) : secrets && secrets.length > 0 ? (
            <div className="glass rounded-2xl overflow-hidden border border-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-white/5">
                    <th className="p-4 text-sm font-medium text-gray-400">KEY</th>
                    <th className="p-4 text-sm font-medium text-gray-400">VALUE</th>
                    <th className="p-4 text-sm font-medium text-gray-400 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {secrets.map((secret) => (
                    <tr key={secret.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 font-mono text-primary">{secret.key}</td>
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-3">
                          {visibleSecrets[secret.id] ? (
                            <span className="text-foreground">{secret.value}</span>
                          ) : (
                            <span className="text-gray-500 tracking-widest text-lg leading-none">••••••••••••••••</span>
                          )}
                          <button
                            onClick={() => toggleVisibility(secret.id)}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            {visibleSecrets[secret.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(secret.value)}
                            className="text-gray-500 hover:text-white transition-colors p-2"
                            title="Copy Value"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteSecret(secret.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-2"
                            title="Delete Secret"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
