"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { FileText, Download, MessageSquare, Upload, LogOut, Search, Home, User, Shield, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

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
  uploaderProfileImage: string | null;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      // Increment download count first, tracking user
      await fetch(`/api/notes/${note.id}/increment-download`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-full sm:w-[200px]" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="mb-2 h-6 w-full" />
                <Skeleton className="mb-4 h-4 w-3/4" />
                <div className="mb-4 flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-lg">
          <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hidden sm:inline-flex">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 sm:hidden">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GITAM Notes Hub
              </h1>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="icon" title="My Profile" className="hover:bg-primary/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden lg:inline">
                {user?.name} ({user?.role})
              </span>
              <Link href="/upload">
                <Button size="sm" variant="gradient">
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
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-2">
              <p className="text-xs text-muted-foreground px-2">{user?.name} ({user?.role})</p>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-primary/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-primary/10">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-primary/10">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Notes
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-4"
        >
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Browse Notes
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur-sm"
              />
            </div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card/50 backdrop-blur-sm">
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
        </motion.div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No notes found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or upload new notes</p>
            <Link href="/upload">
              <Button className="mt-6" variant="gradient">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Note
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group rounded-xl border border-border bg-gradient-to-br from-card to-card/40 p-6 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 backdrop-blur-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-gradient-to-br from-primary/20 to-primary/10 p-2 border border-primary/20">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-1 text-xs font-medium text-primary">
                      Sem {note.semester}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase font-medium">{note.fileType}</span>
                </div>

                <h3 className="mb-2 text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h3>
                <p className="mb-1 text-sm font-medium text-primary">{note.subjectName}</p>
                {note.description && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{note.description}</p>
                )}

                {/* Uploader Info */}
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {note.uploaderProfileImage ? (
                      <img
                        src={note.uploaderProfileImage}
                        alt={note.uploaderName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span>{note.uploaderName}</span>
                  </div>
                  <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs capitalize text-accent">
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-primary/10 hover:border-primary/30"
                    onClick={() => handleView(note.id)}
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant="gradient"
                    className="flex-1"
                    onClick={() => handleDownload(note)}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}