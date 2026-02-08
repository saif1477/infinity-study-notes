import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { supabase } from '@/lib/supabase-storage';

const BUCKET_NAME = 'profile-images';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Generate unique file key
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileKey = `${parsedUserId}/${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileKey, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileKey);

    const profileImageUrl = urlData.publicUrl;

    // Update user profile_image in database
    await db.update(users)
      .set({
        profileImage: profileImageUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, parsedUserId));

    return NextResponse.json({ profileImage: profileImageUrl }, { status: 200 });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
