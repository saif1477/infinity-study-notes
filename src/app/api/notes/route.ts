import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, users } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, semester, fileUrl, fileType, uploadedBy } = body;

    // Validate title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Title is required and cannot be empty',
          code: 'MISSING_TITLE'
        },
        { status: 400 }
      );
    }

    // Validate semester
    if (!semester || typeof semester !== 'number' || !Number.isInteger(semester)) {
      return NextResponse.json(
        { 
          error: 'Semester must be a valid integer',
          code: 'INVALID_SEMESTER_TYPE'
        },
        { status: 400 }
      );
    }

    if (semester < 1 || semester > 8) {
      return NextResponse.json(
        { 
          error: 'Semester must be between 1 and 8',
          code: 'INVALID_SEMESTER_RANGE'
        },
        { status: 400 }
      );
    }

    // Validate fileUrl
    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim() === '') {
      return NextResponse.json(
        { 
          error: 'File URL is required and cannot be empty',
          code: 'MISSING_FILE_URL'
        },
        { status: 400 }
      );
    }

    // Validate fileType
    if (!fileType || typeof fileType !== 'string') {
      return NextResponse.json(
        { 
          error: 'File type is required',
          code: 'MISSING_FILE_TYPE'
        },
        { status: 400 }
      );
    }

    const normalizedFileType = fileType.trim().toLowerCase();
    if (normalizedFileType !== 'pdf' && normalizedFileType !== 'docx') {
      return NextResponse.json(
        { 
          error: 'File type must be either "pdf" or "docx"',
          code: 'INVALID_FILE_TYPE'
        },
        { status: 400 }
      );
    }

    // Validate uploadedBy
    if (!uploadedBy || typeof uploadedBy !== 'number' || !Number.isInteger(uploadedBy)) {
      return NextResponse.json(
        { 
          error: 'Uploaded by must be a valid user ID',
          code: 'INVALID_UPLOADED_BY'
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, uploadedBy))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { 
          error: 'User ID does not exist',
          code: 'USER_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // Create new note
    const newNote = await db.insert(notes)
      .values({
        title: title.trim(),
        semester: semester,
        fileUrl: fileUrl.trim(),
        fileType: normalizedFileType,
        uploadedBy: uploadedBy,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newNote[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const semesterParam = searchParams.get('semester');
    const subjectParam = searchParams.get('subject');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse and validate limit
    const limit = limitParam 
      ? Math.min(parseInt(limitParam, 10), 100) 
      : 50;
    
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { 
          error: 'Limit must be a positive number',
          code: 'INVALID_LIMIT'
        },
        { status: 400 }
      );
    }

    // Parse and validate offset
    const offset = offsetParam 
      ? parseInt(offsetParam, 10) 
      : 0;
    
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { 
          error: 'Offset must be a non-negative number',
          code: 'INVALID_OFFSET'
        },
        { status: 400 }
      );
    }

    // Build conditions array
    const conditions = [];

    // Add semester filter if provided
    if (semesterParam) {
      const semester = parseInt(semesterParam, 10);
      
      if (isNaN(semester)) {
        return NextResponse.json(
          { 
            error: 'Semester must be a valid number',
            code: 'INVALID_SEMESTER_PARAM'
          },
          { status: 400 }
        );
      }

      if (semester < 1 || semester > 8) {
        return NextResponse.json(
          { 
            error: 'Semester must be between 1 and 8',
            code: 'INVALID_SEMESTER_RANGE'
          },
          { status: 400 }
        );
      }

      conditions.push(eq(notes.semester, semester));
    }

    // Add subject search filter if provided
    if (subjectParam && subjectParam.trim() !== '') {
      conditions.push(like(notes.title, `%${subjectParam.trim()}%`));
    }

    // Build and execute query
    let query = db.select().from(notes);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}