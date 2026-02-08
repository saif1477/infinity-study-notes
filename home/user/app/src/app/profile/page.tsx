"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Home,
  LogOut,
  Upload,
  Calendar,
  User as UserIcon,
  Shield,
  Menu,
  X,
  Camera,
} from "lucide-react";

interface Note {
  id: number;
  title: string;
  subjectName: string;
  semester: number;
  fileUrl?: string;
  fileType: string;
  description: string | null;
  downloadsCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface DownloadedNote {
  downloadId: number;
  downloadedAt: string;
  noteId: number;
  title: string;
  subjectName: string;
  semester: number;
  fileType: string;
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
  profileImage?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [downloadedNotes, setDownloadedNotes] = useState<DownloadedNote[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"uploaded" | "downloaded">("uploaded");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    loadProfile(token);
    loadUserNotes(userData.id);
    loadDownloadedNotes(userData.id);
  }, [router]);

  const loadProfile = async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {
      // Use cached user data
    }
  };

  const loadUserNotes = async (userId: number) => {
    try {
      const res = await fetch(`/api/notes/user/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUploadedNotes(data);
      }
    } catch {
      toast.error("Failed to load uploaded notes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDownloadedNotes = async (userId: number) => {
    try {
      const res = await fetch(`/api/profile/downloads?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setDownloadedNotes(data);
      }
    } catch {
      // Non-critical
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleDownload = async (noteId: number) => {
    try {
      await fetch(`/api/notes/${noteId}/increment-download`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

      const res = await fetch(`/api/download/${noteId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to get download URL");
        return;
      }

      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        window.parent.postMessage(
          { type: "OPEN_EXTERNAL_URL", data: { url: data.url } },
          "*"
        );
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }

      if (user) {
        loadUserNotes(user.id);
      }
      toast.success("Download started");
    } catch {
      toast.error("Failed to download note");
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id.toString());

      const res = await fetch("/api/profile/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, profileImage: data.profileImage };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile photo updated");
      } else {
        toast.error(data.error || "Failed to upload photo");
      }
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        {/* User Info Card with Profile Image Upload */}
        <div className="mb-8 rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-secondary border-2 border-border">
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs capitalize">
                  {user?.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {uploadedNotes.length} uploaded &middot; {downloadedNotes.length} downloaded
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Hover over your photo to change it
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-border">
          <button
            onClick={() => setActiveTab("uploaded")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "uploaded"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="inline-block mr-1.5 h-4 w-4" />
            Uploaded Notes ({uploadedNotes.length})
          </button>
          <button
            onClick={() => setActiveTab("downloaded")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "downloaded"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="inline-block mr-1.5 h-4 w-4" />
            Downloaded Notes ({downloadedNotes.length})
          </button>
        </div>

        {/* Uploaded Notes Tab */}
        {activeTab === "uploaded" && (
          <div className="space-y-4">
            {uploadedNotes.length === 0 ? (
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
                {uploadedNotes.map((note) => (
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
                      onClick={() => handleDownload(note.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Downloaded Notes Tab */}
        {activeTab === "downloaded" && (
          <div className="space-y-4">
            {downloadedNotes.length === 0 ? (
              <div className="text-center py-12 rounded-lg border border-border bg-card">
                <Download className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No downloads yet</h3>
                <p className="text-muted-foreground mb-4">Browse the dashboard and download notes</p>
                <Link href="/dashboard">
                  <Button>
                    Browse Notes
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {downloadedNotes.map((note) => (
                  <div key={note.downloadId} className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
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

                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <UserIcon className="h-3 w-3" />
                      <span>{note.uploaderName}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">
                        {note.uploaderRole}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Downloaded on {formatDate(note.downloadedAt)}</span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(note.noteId)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Again
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
