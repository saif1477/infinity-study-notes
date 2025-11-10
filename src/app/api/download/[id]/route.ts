import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateDownloadUrl } from '@/lib/supabase-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    if (isNaN(noteId)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }

    // Get note from database
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (note.length === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    const noteData = note[0];

    // Generate presigned download URL (valid for 1 hour)
    const result = await generateDownloadUrl(noteData.fileKey, 3600);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.url,
      fileName: noteData.fileName,
      fileType: noteData.fileType,
    });
  } catch (error) {
    console.error('Generate download URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
