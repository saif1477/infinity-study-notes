import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract and validate Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Decode and verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Get current user from database
    const currentUser = await db.select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 401 }
      );
    }

    // Check if current user is admin
    if (currentUser[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access only', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Extract and validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const targetUserId = parseInt(id);

    // Prevent blocking yourself
    if (decoded.userId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot block your own account', code: 'CANNOT_BLOCK_SELF' },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await db.select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update user's isBlocked field
    const updatedUser = await db.update(users)
      .set({
        isBlocked: true,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, targetUserId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    // Remove passwordHash from response
    const { passwordHash, ...userResponse } = updatedUser[0];

    return NextResponse.json(userResponse, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}