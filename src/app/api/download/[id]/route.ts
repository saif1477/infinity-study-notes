import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateDownloadUrl } from '@/lib/supabase-storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    
    // Get note from database
    const [note] = await db.select().from(notes).where(eq(notes.id, noteId));
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Generate presigned download URL from Supabase Storage
    const { url, error } = await generateDownloadUrl(note.fileKey, 3600); // Valid for 1 hour

    if (error || !url) {
      console.error('Failed to generate download URL:', error);
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
    }

    // Redirect to the presigned download URL
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}