import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    // Validate Bearer token format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return NextResponse.json(
        { 
          error: 'Invalid token format',
          code: 'INVALID_TOKEN_FORMAT'
        },
        { status: 401 }
      );
    }

    const token = tokenParts[1];
    
    // Get JWT secret from environment or use fallback
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // Verify and decode JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error: any) {
      console.error('JWT verification error:', error);
      
      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
          { 
            error: 'Invalid or expired token',
            code: 'TOKEN_EXPIRED'
          },
          { status: 401 }
        );
      }
      
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { 
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Invalid or expired token',
          code: 'TOKEN_VERIFICATION_FAILED'
        },
        { status: 401 }
      );
    }

    // Extract userId from decoded token
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired token',
          code: 'MISSING_USER_ID'
        },
        { status: 401 }
      );
    }

    // Query user from database
    const user = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user[0];

    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/me error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}