import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ note_id: string }> }
) {
  try {
    const { note_id } = await params;

    // Validate note_id parameter
    if (!note_id || isNaN(parseInt(note_id))) {
      return NextResponse.json(
        {
          error: 'Valid note ID is required',
          code: 'INVALID_NOTE_ID',
        },
        { status: 400 }
      );
    }

    // Query chats table for messages with the specified noteId
    const messages = await db
      .select()
      .from(chats)
      .where(eq(chats.noteId, parseInt(note_id)))
      .orderBy(asc(chats.createdAt));

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}