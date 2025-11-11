"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Send, Download, FileText, Home, Trash2, User } from "lucide-react";

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
}

interface Message {
  id: number;
  noteId: number;
  senderId: number;
  message: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userStr));
    loadNote();
    loadMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [resolvedParams.id, router]);

  const loadNote = async () => {
    try {
      const res = await fetch(`/api/notes?limit=100`);
      const data = await res.json();

      if (res.ok) {
        const foundNote = data.find((n: Note) => n.id === parseInt(resolvedParams.id));
        if (foundNote) {
          setNote(foundNote);
        } else {
          toast.error("Note not found");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Failed to load note");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/chats/${resolvedParams.id}`);
      const data = await res.json();

      if (res.ok) {
        setMessages(data);
      }
    } catch (error) {
      // Silently fail for polling
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: parseInt(resolvedParams.id),
          senderId: user.id,
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage("");
        loadMessages();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/chats/delete/${messageId}?userId=${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message deleted");
        loadMessages();
      } else {
        toast.error(data.error || "Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const canDeleteMessage = (messageCreatedAt: string) => {
    const messageTime = new Date(messageCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    return currentTime - messageTime <= fifteenMinutesInMs;
  };

  const handleDownload = async () => {
    if (!note) return;
    try {
      // Increment download count
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

      toast.success("Download started");
      loadNote();
    } catch (error) {
      toast.error("Failed to download note");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon" title="My Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Note Details */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-md bg-secondary p-2">
                  <FileText className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                  Semester {note.semester}
                </span>
                <span className="text-sm text-muted-foreground uppercase">{note.fileType}</span>
              </div>

              <h1 className="mb-2 text-2xl font-bold">{note.title}</h1>
              <p className="mb-4 text-lg text-muted-foreground">{note.subjectName}</p>

              {note.description && (
                <p className="mb-6 text-muted-foreground">{note.description}</p>
              )}

              <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="rounded-lg border border-border bg-card flex flex-col h-[600px]">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold">Discussion</h2>
              <p className="text-sm text-muted-foreground">Chat with others about this note</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="text-xs opacity-70">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                        {msg.senderId === user?.id && canDeleteMessage(msg.createdAt) && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}