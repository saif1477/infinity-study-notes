"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Home, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Branding (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden"
      >
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/grid.svg)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-Nov-12-2025-09_49_06-PM-1762964365045.png"
              alt="Infinity Study Notes Logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl font-bold text-center mb-4"
          >
            Infinity Study Notes
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-white/90 text-center max-w-md"
          >
            Your ultimate platform for sharing and accessing course notes at GITAM University
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex items-center gap-3 text-white/80"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm">Connect. Learn. Share.</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8 mt-12 lg:mt-0"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-Nov-12-2025-09_49_06-PM-1762964365045.png"
                alt="Infinity Study Notes Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {userType === "student" && "Student Login"}
              {userType === "professor" && "Professor Login"}
              {!userType && "Welcome Back"}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {userType === "student" && "Sign in with your student account"}
              {userType === "professor" && "Sign in with your professor account"}
              {!userType && "Enter your GITAM email to continue"}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
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
                  className="h-11"
                />
                {email && !userType && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    Please use @student.gitam.edu (student) or @gitam.edu (professor)
                  </p>
                )}
                {userType && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    ✓ {userType === "student" ? "Student" : "Professor"} account detected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                variant="gradient"
                className="w-full h-11 text-base group" 
                disabled={isLoading || !userType}
              >
                {isLoading ? "Signing in..." : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary font-medium hover:underline underline-offset-4">
                Register here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}