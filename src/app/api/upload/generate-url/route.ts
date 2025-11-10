import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const subjectName = formData.get('subjectName') as string;
    const semester = parseInt(formData.get('semester') as string);
    const description = formData.get('description') as string;
    const userId = parseInt(formData.get('userId') as string);

    if (!file || !title || !subjectName || !semester || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
    const filePath = join(uploadsDir, uniqueFileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create file URL (accessible via /uploads/filename)
    const fileUrl = `/uploads/${uniqueFileName}`;
    const fileKey = uniqueFileName;

    // Save to database
    const now = new Date().toISOString();
    const [note] = await db.insert(notes).values({
      userId,
      title,
      subjectName,
      semester,
      fileUrl,
      fileType: file.type,
      fileKey,
      fileName: file.name,
      fileSize: file.size,
      description: description || null,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      note,
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}