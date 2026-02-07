"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FileText,
  Users,
  Download,
  Trash2,
  Search,
  Home,
  BarChart3,
  LogOut,
  AlertTriangle,
  Ban,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  notesCount: number;
}

interface Note {
  id: number;
  userId: number;
  title: string;
  subjectName: string;
  semester: number;
  fileType: string;
  fileName: string;
  fileSize: number;
  downloadsCount: number;
  createdAt: string;
  uploaderName: string;
  uploaderEmail: string;
  uploaderRole: string;
}

interface Stats {
  totalUsers: number;
  totalNotes: number;
  totalChats: number;
  totalDownloads: number;
  usersByRole: { role: string; count: number }[];
  notesBySemester: { semester: number; count: number }[];
  storageUsage: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "user" | "note"; id: number } | null>(null);
  const [blockTarget, setBlockTarget] = useState<{ userId: number; userName: string; isBlocked: boolean } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    
    if (user.role !== "admin") {
      toast.error("Access denied - Admin only");
      router.push("/dashboard");
      return;
    }

    setCurrentUser(user);
    loadAdminData();
  }, [router]);

  const loadAdminData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const [usersRes, notesRes, statsRes] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/notes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("User deleted successfully");
        loadAdminData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting user");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/admin/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Note deleted successfully");
        loadAdminData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete note");
      }
    } catch (error) {
      toast.error("An error occurred while deleting note");
    }
  };

  const handleBlockUser = async (userId: number, shouldBlock: boolean) => {
    const token = localStorage.getItem("token");
    const endpoint = shouldBlock ? "block" : "unblock";

    try {
      const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        toast.success(`User ${shouldBlock ? "blocked" : "unblocked"} successfully`);
        loadAdminData();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${endpoint} user`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${shouldBlock ? "blocking" : "unblocking"} user`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "user") {
      handleDeleteUser(deleteTarget.id);
    } else {
      handleDeleteNote(deleteTarget.id);
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const confirmBlock = () => {
    if (!blockTarget) return;
    handleBlockUser(blockTarget.userId, !blockTarget.isBlocked);
    setBlockDialogOpen(false);
    setBlockTarget(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
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
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              {currentUser?.name} (Admin)
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="mr-2 h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Notes</p>
                    <p className="text-3xl font-bold">{stats?.totalNotes || 0}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                    <p className="text-3xl font-bold">{stats?.totalDownloads || 0}</p>
                  </div>
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
                <div className="space-y-3">
                  {stats?.usersByRole.map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{item.role}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Notes by Semester</h3>
                <div className="space-y-3">
                  {stats?.notesBySemester
                    .sort((a, b) => a.semester - b.semester)
                    .map((item) => (
                      <div key={item.semester} className="flex items-center justify-between">
                        <span className="text-sm">Semester {item.semester}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-2">Storage Usage</h3>
              <p className="text-3xl font-bold">
                {((stats?.storageUsage || 0) / 1024 / 1024 / 1024).toFixed(2)} GB
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total file storage across all notes
              </p>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{user.name}</td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {user.isBlocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive">
                              <Ban className="h-3 w-3" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{user.notesCount}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.id !== currentUser?.id && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setBlockTarget({
                                      userId: user.id,
                                      userName: user.name,
                                      isBlocked: user.isBlocked,
                                    });
                                    setBlockDialogOpen(true);
                                  }}
                                  title={user.isBlocked ? "Unblock user" : "Block user"}
                                >
                                  {user.isBlocked ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Ban className="h-4 w-4 text-orange-600" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDeleteTarget({ type: "user", id: user.id });
                                    setDeleteDialogOpen(true);
                                  }}
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No users found</h3>
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notes Management</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Uploader</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Downloads</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredNotes.map((note) => (
                      <tr key={note.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm max-w-xs truncate">{note.title}</td>
                        <td className="px-4 py-3 text-sm">{note.subjectName}</td>
                        <td className="px-4 py-3 text-sm">{note.semester}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium">{note.uploaderName}</p>
                            <p className="text-xs text-muted-foreground">{note.uploaderEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{note.downloadsCount}</td>
                        <td className="px-4 py-3 text-sm">
                          {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: "note", id: note.id });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No notes found</h3>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "user"
                ? "Are you sure you want to delete this user? This will permanently delete all their notes and chats. This action cannot be undone."
                : "Are you sure you want to delete this note? This will permanently delete the file and all associated chats. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {blockTarget?.isBlocked ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Ban className="h-5 w-5 text-orange-600" />
              )}
              {blockTarget?.isBlocked ? "Unblock User" : "Block User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockTarget?.isBlocked
                ? `Are you sure you want to unblock ${blockTarget?.userName}? They will regain access to the platform.`
                : `Are you sure you want to block ${blockTarget?.userName}? They will be unable to login until unblocked.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className={blockTarget?.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
            >
              {blockTarget?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}