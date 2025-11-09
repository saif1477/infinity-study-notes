import Image from "next/image";
import Link from "next/link";
import { FileText, UploadCloud, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1 text-sm text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live preview
          </div>
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Infinity Study Notes
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Your ultimate platform for sharing and accessing course notes. Connect with students and professors at GITAM University.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-started">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Notes Dashboard</h3>
            <p className="mt-1 text-sm text-muted-foreground">Filter by subject and semester, view metadata, and track views/downloads.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Upload Notes</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add subject, choose semester (1–8), and upload PDF/DOCX files.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Real-time Chat</h3>
            <p className="mt-1 text-sm text-muted-foreground">Discuss notes with uploaders and classmates, with message history.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-80">
          <span className="text-sm">Powered by Infinity AI Diet APP</span>
        </div>
      </main>
    </div>
  );
}