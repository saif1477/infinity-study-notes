import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query database for note with matching id
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, parseInt(id)))
      .limit(1);

    // Return 404 if note not found
    if (note.length === 0) {
      return NextResponse.json(
        {
          error: 'Note not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return the note object
    return NextResponse.json(note[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}