import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: userIdParam } = await params;
    const userId = parseInt(userIdParam);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Fetch notes uploaded by the user
    const userNotes = await db
      .select({
        id: notes.id,
        title: notes.title,
        subjectName: notes.subjectName,
        semester: notes.semester,
        fileUrl: notes.fileUrl,
        fileType: notes.fileType,
        description: notes.description,
        downloadsCount: notes.downloadsCount,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(notes.createdAt);

    return NextResponse.json(userNotes, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/notes/user/[userId] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user notes: ' + error.message },
      { status: 500 }
    );
  }
}
