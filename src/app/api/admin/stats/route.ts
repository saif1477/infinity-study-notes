import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes, chats } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user from token
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(token)))
      .limit(1);

    if (!currentUser.length || currentUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access only" }, { status: 403 });
    }

    // Get total counts
    const totalUsers = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const totalNotes = await db.select({ count: sql<number>`COUNT(*)` }).from(notes);
    const totalChats = await db.select({ count: sql<number>`COUNT(*)` }).from(chats);
    
    // Get total downloads and views
    const downloadStats = await db.select({
      totalDownloads: sql<number>`SUM(${notes.downloadsCount})`,
      totalViews: sql<number>`SUM(${notes.viewsCount})`,
    }).from(notes);

    // Get users by role
    const usersByRole = await db.select({
      role: users.role,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .groupBy(users.role);

    // Get notes by semester
    const notesBySemester = await db.select({
      semester: notes.semester,
      count: sql<number>`COUNT(*)`,
    })
    .from(notes)
    .groupBy(notes.semester);

    // Get storage usage (total file sizes)
    const storageUsage = await db.select({
      totalSize: sql<number>`SUM(${notes.fileSize})`,
    }).from(notes);

    return NextResponse.json({
      totalUsers: totalUsers[0].count || 0,
      totalNotes: totalNotes[0].count || 0,
      totalChats: totalChats[0].count || 0,
      totalDownloads: downloadStats[0].totalDownloads || 0,
      totalViews: downloadStats[0].totalViews || 0,
      usersByRole: usersByRole || [],
      notesBySemester: notesBySemester || [],
      storageUsage: storageUsage[0].totalSize || 0,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
