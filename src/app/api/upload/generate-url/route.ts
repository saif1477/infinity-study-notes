import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { supabase } from '@/lib/supabase-storage';

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

    // Generate unique file key with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const fileKey = `notes/${userId}/${timestamp}-${sanitizedFileName}`;

    // Upload directly to Supabase storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('notes')
      .upload(fileKey, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ 
        error: uploadError.message || 'Failed to upload file to storage' 
      }, { status: 500 });
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('notes')
      .getPublicUrl(fileKey);

    const fileUrl = urlData.publicUrl;

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