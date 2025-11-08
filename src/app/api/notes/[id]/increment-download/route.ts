import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid note ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const noteId = parseInt(id);

    // Check if note exists
    const existingNote = await db.select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Increment downloads count and update timestamp
    const updatedNote = await db.update(notes)
      .set({
        downloadsCount: sql`${notes.downloadsCount} + 1`,
        updatedAt: new Date().toISOString()
      })
      .where(eq(notes.id, noteId))
      .returning();

    if (updatedNote.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update note' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedNote[0], { status: 200 });

  } catch (error) {
    console.error('PUT /api/notes/[id]/download error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}