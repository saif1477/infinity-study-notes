import Image from "next/image";
import { FileText, UploadCloud, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1 text-sm text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live preview
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            GITAM Notes Hub
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            Upload, browse, and discuss course notes. Built with Next.js 15, Tailwind, and shadcn/ui.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-background transition-colors hover:opacity-90"
              href="/api/notes"
              rel="noopener noreferrer"
            >
              Browse Notes (API)
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-foreground hover:bg-accent"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
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
          <Image src="/next.svg" alt="Next.js" width={80} height={16} className="dark:invert" />
          <span className="text-sm">&middot;</span>
          <Image src="/vercel.svg" alt="Vercel" width={20} height={20} className="dark:invert" />
        </div>
      </main>
    </div>
  );
}