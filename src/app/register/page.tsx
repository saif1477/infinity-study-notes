"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Home, Sparkles, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "professor">("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push("/login");
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
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-accent via-accent/90 to-primary overflow-hidden"
      >
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/grid.svg)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-Nov-12-2025-09_49_06-PM-1762964365045.png"
                alt="Infinity Study Notes Logo"
                width={120}
                height={120}
                className="object-contain drop-shadow-2xl relative"
              />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl font-bold text-center mb-4"
          >
            Join Our Community
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-white/90 text-center max-w-md"
          >
            {role === "student" 
              ? "Connect with fellow students and access thousands of study materials"
              : "Share your expertise and help students excel in their academic journey"}
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
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
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="mt-3 text-muted-foreground">Join the GITAM Notes community</p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">I am a</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "student" | "professor")} disabled={isLoading}>
                  <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal cursor-pointer flex-1">
                      <div className="font-medium">Student</div>
                      <div className="text-xs text-muted-foreground">Access and share study materials</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors">
                    <RadioGroupItem value="professor" id="professor" />
                    <Label htmlFor="professor" className="font-normal cursor-pointer flex-1">
                      <div className="font-medium">Professor</div>
                      <div className="text-xs text-muted-foreground">Share knowledge and guide students</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">GITAM Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={role === "student" ? "student@student.gitam.edu" : "professor@gitam.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  {role === "student" ? "Must end with @student.gitam.edu" : "Must end with @gitam.edu"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}