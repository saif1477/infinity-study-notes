import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq, and, or, asc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noteId, senderId, receiverId, message } = body;

    // Validate required fields
    if (!noteId || !senderId || !receiverId || !message) {
      return NextResponse.json(
        { 
          error: 'All fields are required: noteId, senderId, receiverId, message',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate IDs are valid integers
    const parsedNoteId = parseInt(noteId);
    const parsedSenderId = parseInt(senderId);
    const parsedReceiverId = parseInt(receiverId);

    if (isNaN(parsedNoteId) || isNaN(parsedSenderId) || isNaN(parsedReceiverId)) {
      return NextResponse.json(
        {
          error: 'noteId, senderId, and receiverId must be valid integers',
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

    // Validate sender and receiver are different
    if (parsedSenderId === parsedReceiverId) {
      return NextResponse.json(
        {
          error: 'Cannot send message to yourself',
          code: 'INVALID_RECEIVER'
        },
        { status: 400 }
      );
    }

    // Create new chat
    const newChat = await db.insert(chats)
      .values({
        noteId: parsedNoteId,
        senderId: parsedSenderId,
        receiverId: parsedReceiverId,
        message: trimmedMessage,
        createdAt: new Date().toISOString(),
        isRead: false
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const noteId = searchParams.get('noteId');
    const userId = searchParams.get('userId');

    // Validate required parameters
    if (!noteId || !userId) {
      return NextResponse.json(
        {
          error: 'Both noteId and userId are required query parameters',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate parameters are valid integers
    const parsedNoteId = parseInt(noteId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedNoteId) || isNaN(parsedUserId)) {
      return NextResponse.json(
        {
          error: 'Valid parameters required',
          code: 'INVALID_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // Fetch chat history
    const chatHistory = await db.select()
      .from(chats)
      .where(
        and(
          eq(chats.noteId, parsedNoteId),
          or(
            eq(chats.senderId, parsedUserId),
            eq(chats.receiverId, parsedUserId)
          )
        )
      )
      .orderBy(asc(chats.createdAt));

    return NextResponse.json(chatHistory, { status: 200 });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}