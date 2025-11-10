"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subjectName: "",
    semester: "",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error("Please login to upload notes");
      router.push("/login");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF and DOCX files are allowed");
        return;
      }

      // Validate file size (100MB)
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 100MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!formData.title || !formData.subjectName || !formData.semester) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Get user info
      const token = localStorage.getItem("bearer_token");
      const userRes = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const userData = await userRes.json();

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("subjectName", formData.subjectName);
      uploadFormData.append("semester", formData.semester);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("userId", userData.user.id.toString());

      // Upload file
      const uploadRes = await fetch("/api/upload/generate-url", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      toast.success("Note uploaded successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Notes</h1>
          <p className="mt-2 text-muted-foreground">
            Share your course notes with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Data Structures Unit 1-3 Notes"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Name *</Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures"
              value={formData.subjectName}
              onChange={(e) =>
                setFormData({ ...formData, subjectName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester *</Label>
            <Select
              value={formData.semester}
              onValueChange={(value) =>
                setFormData({ ...formData, semester: value })
              }
            >
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional information about these notes..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File (PDF or DOCX, max 100MB) *</Label>
            <div className="flex items-center gap-3">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
              {file && (
                <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Notes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}