import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decodeToken } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT token
    const decoded = decodeToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get current user from decoded token
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!currentUser.length || currentUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access only" }, { status: 403 });
    }

    // Get all notes with uploader info
    const allNotes = await db
      .select({
        id: notes.id,
        userId: notes.userId,
        title: notes.title,
        subjectName: notes.subjectName,
        semester: notes.semester,
        fileUrl: notes.fileUrl,
        fileType: notes.fileType,
        fileKey: notes.fileKey,
        fileName: notes.fileName,
        fileSize: notes.fileSize,
        description: notes.description,
        downloadsCount: notes.downloadsCount,
        createdAt: notes.createdAt,
        uploaderName: users.name,
        uploaderEmail: users.email,
        uploaderRole: users.role,
      })
      .from(notes)
      .leftJoin(users, eq(notes.userId, users.id))
      .orderBy(notes.createdAt);

    return NextResponse.json(allNotes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}