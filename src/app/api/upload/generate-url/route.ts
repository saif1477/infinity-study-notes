import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { supabase } from '@/lib/supabase-storage';

// Step 1: Generate a signed upload URL (no file in body)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileSize, userId } = body;

    if (!fileName || !fileType || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    if (fileSize > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const fileKey = `notes/${userId}/${timestamp}-${sanitizedFileName}`;

    const { data, error } = await supabase.storage
      .from('notes')
      .createSignedUploadUrl(fileKey);

    if (error || !data) {
      console.error('Signed URL error:', error);
      return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl, fileKey, token: data.token });
  } catch (error: any) {
    console.error('Generate URL error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate upload URL' }, { status: 500 });
  }
}

// Step 2: Save note metadata to DB after client uploads to Supabase
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, subjectName, semester, description, fileKey, fileName, fileType, fileSize } = body;

    if (!userId || !title || !subjectName || !semester || !fileKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: urlData } = supabase.storage.from('notes').getPublicUrl(fileKey);
    const fileUrl = urlData.publicUrl;

    const now = new Date().toISOString();
    const [note] = await db.insert(notes).values({
      userId: parseInt(userId),
      title,
      subjectName,
      semester: parseInt(semester),
      fileUrl,
      fileType,
      fileKey,
      fileName,
      fileSize: parseInt(fileSize),
      description: description || null,
      downloadsCount: 0,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error('Save note error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save note' }, { status: 500 });
  }
}
