"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [semester, setSemester] = useState<string>("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "docx">("pdf");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userStr));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!semester) {
      toast.error("Please select a semester");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title,
          subjectName,
          semester: parseInt(semester),
          fileUrl,
          fileType,
          description: description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to upload note");
        return;
      }

      toast.success("Note uploaded successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Notes</h1>
          <p className="mt-2 text-muted-foreground">Share your notes with the GITAM community</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Data Structures - Complete Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name *</Label>
              <Input
                id="subjectName"
                type="text"
                placeholder="e.g., Data Structures and Algorithms"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={semester} onValueChange={setSemester} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL *</Label>
              <Input
                id="fileUrl"
                type="url"
                placeholder="https://example.com/file.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Upload your file to Google Drive, Dropbox, or similar and paste the shareable link here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileType">File Type *</Label>
              <Select value={fileType} onValueChange={(value: "pdf" | "docx") => setFileType(value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional information about these notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Notes"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
