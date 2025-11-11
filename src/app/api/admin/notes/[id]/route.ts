import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { decodeToken } from "@/lib/auth-utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get note to delete from storage
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, parseInt(id)))
      .limit(1);

    if (!note.length) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Delete file from Supabase storage
    try {
      await supabase.storage.from("notes").remove([note[0].fileKey]);
    } catch (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete note from database (cascade will delete chats)
    await db.delete(notes).where(eq(notes.id, parseInt(id)));

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}