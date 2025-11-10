import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { readFile } from 'fs/promises';
import { join } from 'path';

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

    // Read file from disk
    const filePath = join(process.cwd(), 'public', 'uploads', note.fileKey);
    const fileBuffer = await readFile(filePath);

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': note.fileType,
        'Content-Disposition': `attachment; filename="${note.fileName}"`,
        'Content-Length': note.fileSize.toString(),
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}