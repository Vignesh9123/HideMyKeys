"use client";

import { useEffect, useState, use } from "react";
import { Plus, Server, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Environment {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProjectView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [newEnvName, setNewEnvName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEnvironments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/projects/${projectId}/environments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setEnvironments(data);
    } catch (error) {
      console.error("Failed to fetch environments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, [projectId]);

  const handleCreateEnvironment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvName.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/projects/${projectId}/environments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newEnvName }),
      });
      if (res.ok) {
        setNewEnvName("");
        fetchEnvironments();
      }
    } catch (error) {
      console.error("Failed to create environment", error);
    }
  };

  const handleDeleteEnvironment = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3001/environments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchEnvironments();
    } catch (error) {
      console.error("Failed to delete environment", error);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Environments
        </h1>
        <p className="text-gray-400 mt-2">Manage the environments for this project.</p>
      </header>

      <main>
        <section className="mb-12 glass p-6 rounded-2xl border-l-4 border-l-primary">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Server className="text-primary" /> Create New Environment
          </h2>
          <form onSubmit={handleCreateEnvironment} className="flex gap-4">
            <input
              type="text"
              placeholder="e.g., Production, Staging, Development"
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!newEnvName.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </form>
        </section>

        <section>
          {loading ? (
            <div className="text-gray-400 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading environments...
            </div>
          ) : environments && environments.length === 0 ? (
            <div className="text-center p-12 glass rounded-2xl text-gray-400">
              No environments found. Add one above.
            </div>
          ) : environments && environments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className="glass p-6 rounded-2xl group hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full bg-gradient-to-br from-white/5 to-transparent"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      {env.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEnvironment(env.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 flex-1">
                    ID: <span className="font-mono text-xs">{env.id}</span>
                  </p>
                  <Link
                    href={`/environments/${env.id}`}
                    className="mt-auto flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium group/link"
                  >
                    Manage Secrets
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
