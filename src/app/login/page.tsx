"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Home, GraduationCap, UserCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Detect user type based on email
  const getUserType = () => {
    if (email.endsWith("@student.gitam.edu")) return "student";
    if (email.endsWith("@gitam.edu")) return "professor";
    return null;
  };

  const userType = getUserType();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {userType === "student" && <GraduationCap className="h-8 w-8 text-primary" />}
            {userType === "professor" && <UserCircle className="h-8 w-8 text-primary" />}
            {!userType && <GraduationCap className="h-8 w-8 text-muted-foreground" />}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userType === "student" && "Student Login"}
            {userType === "professor" && "Professor Login"}
            {!userType && "GITAM Login"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {userType === "student" && "Sign in with your student account"}
            {userType === "professor" && "Sign in with your professor account"}
            {!userType && "Enter your GITAM email to continue"}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                {userType === "student" && "Student Email"}
                {userType === "professor" && "Professor Email"}
                {!userType && "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  userType === "student" 
                    ? "student@student.gitam.edu" 
                    : userType === "professor"
                    ? "professor@gitam.edu"
                    : "your.email@gitam.edu"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              {email && !userType && (
                <p className="text-xs text-destructive">
                  Please use @student.gitam.edu (student) or @gitam.edu (professor)
                </p>
              )}
              {userType && (
                <p className="text-xs text-emerald-600">
                  ✓ {userType === "student" ? "Student" : "Professor"} account detected
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !userType}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-foreground underline hover:opacity-80">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}