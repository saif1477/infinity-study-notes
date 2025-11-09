import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate all required fields are present
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { 
          error: 'All fields are required: email, password, name, role',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate fields are non-empty strings
    if (typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Email must be a non-empty string',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Password must be a non-empty string',
          code: 'INVALID_PASSWORD'
        },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Name must be a non-empty string',
          code: 'INVALID_NAME'
        },
        { status: 400 }
      );
    }

    if (typeof role !== 'string' || role.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Role must be a non-empty string',
          code: 'INVALID_ROLE'
        },
        { status: 400 }
      );
    }

    // Trim and normalize inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedPassword = password.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT'
        },
        { status: 400 }
      );
    }

    // Validate role is either 'student' or 'professor'
    if (trimmedRole !== 'student' && trimmedRole !== 'professor') {
      return NextResponse.json(
        { 
          error: 'Role must be either "student" or "professor"',
          code: 'INVALID_ROLE_VALUE'
        },
        { status: 400 }
      );
    }

    // Validate email based on role
    if (trimmedRole === 'student' && !trimmedEmail.endsWith('@student.gitam.edu')) {
      return NextResponse.json(
        { 
          error: 'Student email must end with @student.gitam.edu',
          code: 'INVALID_STUDENT_EMAIL'
        },
        { status: 400 }
      );
    }

    if (trimmedRole === 'professor' && !trimmedEmail.endsWith('@gitam.edu')) {
      return NextResponse.json(
        { 
          error: 'Professor email must end with @gitam.edu',
          code: 'INVALID_PROFESSOR_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (trimmedPassword.length < 8) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 8 characters long',
          code: 'PASSWORD_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { 
          error: 'Name must be at least 2 characters long',
          code: 'NAME_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          error: 'Email already registered',
          code: 'EMAIL_ALREADY_EXISTS'
        },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(trimmedPassword, 10);

    // Create timestamp
    const timestamp = new Date().toISOString();

    // Insert new user
    const newUser = await db.insert(users)
      .values({
        email: trimmedEmail,
        passwordHash: passwordHash,
        name: trimmedName,
        role: trimmedRole,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning();

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/register error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}