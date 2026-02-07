"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Download, Home, LogOut, Upload, Calendar, User as UserIcon, Shield, Menu, X } from "lucide-react";

interface Note {
  id: number;
  title: string;
  subjectName: string;
  semester: number;
  fileUrl: string;
  fileType: string;
  description: string | null;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    loadUserNotes(userData.id);
  }, [router]);

  const loadUserNotes = async (userId: number) => {
    try {
      const res = await fetch(`/api/notes/user/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setNotes(data);
      } else {
        toast.error("Failed to load your notes");
      }
    } catch (error) {
      toast.error("An error occurred while loading your notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleDownload = async (note: Note) => {
    try {
      await fetch(`/api/notes/${note.id}/increment-download`, { method: "PUT" });
      
      // Get secure download URL
      const res = await fetch(`/api/download/${note.id}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to get download URL");
        return;
      }

      // Open file in new tab or trigger download
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        window.parent.postMessage(
          { type: "OPEN_EXTERNAL_URL", data: { url: data.url } },
          "*"
        );
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
      
      // Reload notes to update download count
      if (user) {
        loadUserNotes(user.id);
      }
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download note");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-base sm:text-xl font-bold">My Profile</h1>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4">
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/upload">
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Notes
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-3 space-y-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Notes
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="mb-8 rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-secondary shrink-0">
                <UserIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-secondary px-3 py-1 text-xs capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Uploaded Files Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Uploaded Files</h2>
            <span className="text-sm text-muted-foreground">
              {notes.length} {notes.length === 1 ? "file" : "files"}
            </span>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-border bg-card">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No files uploaded yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing your notes with the community</p>
              <Link href="/upload">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Note
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md bg-secondary p-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                        Sem {note.semester}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase">{note.fileType}</span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold line-clamp-2">{note.title}</h3>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">{note.subjectName}</p>
                  {note.description && (
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{note.description}</p>
                  )}

                  {/* Upload Date */}
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Uploaded on {formatDate(note.createdAt)}</span>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {note.downloadsCount} downloads
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={() => handleDownload(note)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}