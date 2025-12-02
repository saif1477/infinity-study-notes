"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, UploadCloud, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live preview
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-gradient"
          >
            Infinity Study Notes
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed"
          >
            Your ultimate platform for sharing and accessing course notes. Connect with students and professors at GITAM University.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-started">
              <Button size="lg" variant="gradient" className="px-8 group">
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid w-full gap-6 sm:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="group relative rounded-xl border border-primary/20 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <motion.div
                className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <FileText className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Notes Dashboard</h3>
              <p className="text-sm text-muted-foreground">Filter by subject and semester, view metadata, and track views/downloads.</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="group relative rounded-xl border border-accent/20 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <motion.div
                className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <UploadCloud className="h-6 w-6 text-accent" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Upload Notes</h3>
              <p className="text-sm text-muted-foreground">Add subject, choose semester (1–8), and upload PDF/DOCX files.</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="group relative rounded-xl border border-primary/20 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <motion.div
                className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <MessageSquare className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">Discuss notes with uploaders and classmates, with message history.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="text-sm text-muted-foreground">Powered by Infinity Study Notes</span>
        </motion.div>
      </main>
    </div>
  );
}