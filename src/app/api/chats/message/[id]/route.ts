import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    // Validate parameters
    const messageId = parseInt(id);
    const parsedUserId = parseInt(userId);

    if (isNaN(messageId) || isNaN(parsedUserId)) {
      return NextResponse.json(
        {
          error: 'Invalid message ID or user ID',
          code: 'INVALID_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // Get the message
    const message = await db
      .select()
      .from(chats)
      .where(eq(chats.id, messageId))
      .limit(1);

    if (message.length === 0) {
      return NextResponse.json(
        {
          error: 'Message not found',
          code: 'MESSAGE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if user is the sender
    if (message[0].senderId !== parsedUserId) {
      return NextResponse.json(
        {
          error: 'You can only delete your own messages',
          code: 'UNAUTHORIZED'
        },
        { status: 403 }
      );
    }

    // Check if message is within 15 minutes
    const messageTime = new Date(message[0].createdAt).getTime();
    const currentTime = new Date().getTime();
    const fifteenMinutesInMs = 15 * 60 * 1000;

    if (currentTime - messageTime > fifteenMinutesInMs) {
      return NextResponse.json(
        {
          error: 'Messages can only be deleted within 15 minutes of posting',
          code: 'TIME_LIMIT_EXCEEDED'
        },
        { status: 403 }
      );
    }

    // Delete the message
    await db.delete(chats).where(eq(chats.id, messageId));

    return NextResponse.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}
