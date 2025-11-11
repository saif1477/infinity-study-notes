import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, users } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, subjectName, semester, fileUrl, fileType, fileKey, fileName, fileSize, description } = body;

    // Validate required fields
    if (!userId || !title || !subjectName || !semester || !fileUrl || !fileType || !fileKey || !fileName || !fileSize) {
      return NextResponse.json(
        { 
          error: 'All required fields must be provided: userId, title, subjectName, semester, fileUrl, fileType, fileKey, fileName, fileSize',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate userId is integer
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { 
          error: 'User ID must be a valid integer',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parsedUserId))
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

    // Validate title
    if (typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Title is required and cannot be empty',
          code: 'INVALID_TITLE'
        },
        { status: 400 }
      );
    }

    // Validate subjectName
    if (typeof subjectName !== 'string' || subjectName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Subject name is required and cannot be empty',
          code: 'INVALID_SUBJECT_NAME'
        },
        { status: 400 }
      );
    }

    // Validate semester
    const parsedSemester = parseInt(semester);
    if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 8) {
      return NextResponse.json(
        { 
          error: 'Semester must be a valid integer between 1 and 8',
          code: 'INVALID_SEMESTER'
        },
        { status: 400 }
      );
    }

    // Validate fileUrl
    if (typeof fileUrl !== 'string' || fileUrl.trim() === '') {
      return NextResponse.json(
        { 
          error: 'File URL is required and cannot be empty',
          code: 'INVALID_FILE_URL'
        },
        { status: 400 }
      );
    }

    // Validate fileType
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

    // Validate fileKey
    if (typeof fileKey !== 'string' || fileKey.trim() === '') {
      return NextResponse.json(
        { 
          error: 'File key is required and cannot be empty',
          code: 'INVALID_FILE_KEY'
        },
        { status: 400 }
      );
    }

    // Validate fileName
    if (typeof fileName !== 'string' || fileName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'File name is required and cannot be empty',
          code: 'INVALID_FILE_NAME'
        },
        { status: 400 }
      );
    }

    // Validate fileSize
    const parsedFileSize = parseInt(fileSize);
    if (isNaN(parsedFileSize) || parsedFileSize <= 0) {
      return NextResponse.json(
        { 
          error: 'File size must be a positive integer',
          code: 'INVALID_FILE_SIZE'
        },
        { status: 400 }
      );
    }

    // Create timestamp
    const timestamp = new Date().toISOString();

    // Create new note - removed viewsCount
    const newNote = await db.insert(notes)
      .values({
        userId: parsedUserId,
        title: title.trim(),
        subjectName: subjectName.trim(),
        semester: parsedSemester,
        fileUrl: fileUrl.trim(),
        fileType: normalizedFileType,
        fileKey: fileKey.trim(),
        fileName: fileName.trim(),
        fileSize: parsedFileSize,
        description: description ? description.trim() : null,
        downloadsCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
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
    const subjectParam = searchParams.get('subject_name');
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
      conditions.push(like(notes.subjectName, `%${subjectParam.trim()}%`));
    }

    // Build and execute query with JOIN to get uploader info - removed viewsCount
    let query = db.select({
      id: notes.id,
      title: notes.title,
      subjectName: notes.subjectName,
      semester: notes.semester,
      fileUrl: notes.fileUrl,
      fileType: notes.fileType,
      fileKey: notes.fileKey,
      fileName: notes.fileName,
      fileSize: notes.fileSize,
      description: notes.description,
      downloadsCount: notes.downloadsCount,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      userId: notes.userId,
      uploaderName: users.name,
      uploaderRole: users.role
    })
    .from(notes)
    .leftJoin(users, eq(notes.userId, users.id));

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