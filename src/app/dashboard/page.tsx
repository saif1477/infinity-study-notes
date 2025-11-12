"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Download, MessageSquare, Upload, LogOut, Search, Home, User, Shield } from "lucide-react";

interface Note {
  id: number;
  title: string;
  subjectName: string;
  semester: number;
  fileUrl: string;
  fileType: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  description: string | null;
  downloadsCount: number;
  createdAt: string;
  uploaderName: string;
  uploaderRole: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userStr));
    loadNotes();
  }, [router]);

  const loadNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();

      if (res.ok) {
        setNotes(data);
        setFilteredNotes(data);
      } else {
        toast.error("Failed to load notes");
      }
    } catch (error) {
      toast.error("An error occurred while loading notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by semester
    if (semesterFilter !== "all") {
      filtered = filtered.filter((note) => note.semester === parseInt(semesterFilter));
    }

    setFilteredNotes(filtered);
  }, [searchQuery, semesterFilter, notes]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleDownload = async (note: Note) => {
    try {
      // Increment download count first
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
      loadNotes();
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download note");
    }
  };

  const handleView = async (noteId: number) => {
    router.push(`/notes/${noteId}`);
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Infinity Study Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link href="/profile">
              <Button variant="ghost" size="icon" title="My Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              {user?.name} ({user?.role})
            </span>
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold">Browse Notes</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No notes found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or upload new notes</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
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

                {/* Uploader Info */}
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{note.uploaderName}</span>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">
                    {note.uploaderRole}
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {note.fileSize && (
                    <span>
                      {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {note.downloadsCount}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleView(note.id)}>
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Chat
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleDownload(note)}>
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}