import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chats } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noteId, senderId, message } = body;

    // Validate required fields
    if (!noteId || !senderId || !message) {
      return NextResponse.json(
        { 
          error: 'All fields are required: noteId, senderId, message',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate IDs are valid integers
    const parsedNoteId = parseInt(noteId);
    const parsedSenderId = parseInt(senderId);

    if (isNaN(parsedNoteId) || isNaN(parsedSenderId)) {
      return NextResponse.json(
        {
          error: 'noteId and senderId must be valid integers',
          code: 'INVALID_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // Sanitize message
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return NextResponse.json(
        {
          error: 'Message cannot be empty',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Create new chat
    const newChat = await db.insert(chats)
      .values({
        noteId: parsedNoteId,
        senderId: parsedSenderId,
        message: trimmedMessage,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newChat[0], { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}