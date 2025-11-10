import { NextRequest, NextResponse } from 'next/server';
import { generateUploadUrl, validateFileType, validateFileSize } from '@/lib/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileSize, userId } = body;

    // Validate required fields
    if (!fileName || !fileSize || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileSize, userId' },
        { status: 400 }
      );
    }

    // Validate userId
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: 'Invalid userId' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileTypeValidation = validateFileType(fileName);
    if (!fileTypeValidation.valid) {
      return NextResponse.json(
        { error: fileTypeValidation.error },
        { status: 400 }
      );
    }

    // Validate file size
    const fileSizeValidation = validateFileSize(fileSize);
    if (!fileSizeValidation.valid) {
      return NextResponse.json(
        { error: fileSizeValidation.error },
        { status: 400 }
      );
    }

    // Generate presigned upload URL
    const result = await generateUploadUrl(parsedUserId, fileName);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.url,
      token: result.token,
      fileKey: result.fileKey,
      fileType: fileTypeValidation.fileType,
    });
  } catch (error) {
    console.error('Generate upload URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
