import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { downloads, notes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get downloaded notes with note details and uploader info
    const downloadedNotes = await db
      .select({
        downloadId: downloads.id,
        downloadedAt: downloads.downloadedAt,
        noteId: notes.id,
        title: notes.title,
        subjectName: notes.subjectName,
        semester: notes.semester,
        fileType: notes.fileType,
        description: notes.description,
        downloadsCount: notes.downloadsCount,
        createdAt: notes.createdAt,
        uploaderName: users.name,
        uploaderRole: users.role,
      })
      .from(downloads)
      .innerJoin(notes, eq(downloads.noteId, notes.id))
      .leftJoin(users, eq(notes.userId, users.id))
      .where(eq(downloads.userId, parsedUserId))
      .orderBy(downloads.downloadedAt);

    return NextResponse.json(downloadedNotes, { status: 200 });
  } catch (error) {
    console.error('GET /api/profile/downloads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
