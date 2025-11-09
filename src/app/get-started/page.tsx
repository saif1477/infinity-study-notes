import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Welcome to Infinity Study Notes
          </h2>
          
          {/* GITAM Icon - Clickable */}
          <Link href="/login">
            <button className="group relative rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 transition-transform hover:scale-105 active:scale-95">
              <div className="rounded-full bg-background p-8">
                <GraduationCap className="h-32 w-32 text-primary transition-transform group-hover:rotate-12" />
              </div>
            </button>
          </Link>

          <div className="space-y-2">
            <h3 className="text-xl font-bold">GITAM University</h3>
            <p className="text-muted-foreground">Tap the icon to continue</p>
          </div>
        </div>
      </main>
    </div>
  );
}
