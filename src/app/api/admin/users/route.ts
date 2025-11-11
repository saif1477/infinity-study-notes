import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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

    // Get all users with their notes count
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        notesCount: sql<number>`COALESCE(COUNT(${notes.id}), 0)`,
      })
      .from(users)
      .leftJoin(notes, eq(users.id, notes.userId))
      .groupBy(users.id);

    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}