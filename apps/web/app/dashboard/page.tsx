"use client";

import { useEffect, useState } from "react";
import { Plus, FolderGit2, Trash2, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/projects", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (res.ok) {
        setNewProjectName("");
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3001/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your projects and secrets securely.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main>
        <section className="mb-12 glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderGit2 className="text-primary" /> Create New Project
          </h2>
          <form onSubmit={handleCreateProject} className="flex gap-4">
            <input
              type="text"
              placeholder="e.g., My Awesome App"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!newProjectName.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Create
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
          {loading ? (
            <div className="text-gray-400 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading projects...
            </div>
          ) : projects && projects.length === 0 ? (
            <div className="text-center p-12 glass rounded-2xl text-gray-400">
              No projects found. Create one above to get started.
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass p-6 rounded-2xl group hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 flex-1">
                    Created on {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="mt-auto flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium group/link"
                  >
                    View Environments
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
