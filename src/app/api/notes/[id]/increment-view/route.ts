import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate id parameter
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
    const existingNote = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { 
          error: 'Note not found',
          code: 'NOTE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Increment views count and update timestamp
    const updatedNote = await db
      .update(notes)
      .set({
        viewsCount: sql`${notes.viewsCount} + 1`,
        updatedAt: new Date().toISOString()
      })
      .where(eq(notes.id, noteId))
      .returning();

    return NextResponse.json(updatedNote[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}