"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Welcome to Infinity Study Notes
          </motion.h2>
          
          {/* GITAM Icon - Enhanced with animations */}
          <Link href="/login">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative rounded-full bg-gradient-to-br from-primary via-primary to-accent p-1.5 shadow-2xl transition-all hover:shadow-primary/50"
            >
              <div className="rounded-full bg-background p-10 lg:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <GraduationCap className="h-28 w-28 lg:h-36 lg:w-36 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 relative z-10" />
              </div>
              {/* Pulse ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-3"
          >
            <h3 className="text-xl lg:text-2xl font-bold">GITAM University</h3>
            <p className="text-muted-foreground flex items-center gap-2 justify-center">
              Tap the icon to continue
              <ArrowRight className="h-4 w-4 animate-pulse" />
            </p>
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm px-6 py-4 shadow-lg"
          >
            <p className="text-sm text-muted-foreground">
              🎓 Access notes • 📚 Share knowledge • 💬 Connect with peers
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}