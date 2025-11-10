import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

const BUCKET_NAME = 'notes';

/**
 * Generate a presigned upload URL for direct client-side upload
 */
export async function generateUploadUrl(
  userId: number,
  fileName: string
): Promise<{ url: string; token: string; fileKey: string; error?: string }> {
  try {
    // Generate unique file key with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(fileName);
    const fileKey = `notes/${userId}/${timestamp}-${sanitizedFileName}`;

    // Create signed upload URL (valid for 30 minutes)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(fileKey);

    if (error) {
      console.error('Supabase upload URL error:', error);
      return {
        url: '',
        token: '',
        fileKey: '',
        error: error.message,
      };
    }

    return {
      url: data.signedUrl,
      token: data.token,
      fileKey: data.path,
    };
  } catch (error) {
    console.error('Generate upload URL error:', error);
    return {
      url: '',
      token: '',
      fileKey: '',
      error: error instanceof Error ? error.message : 'Failed to generate upload URL',
    };
  }
}

/**
 * Generate a presigned download URL (valid for 1 hour)
 */
export async function generateDownloadUrl(
  fileKey: string,
  expirationSeconds: number = 3600
): Promise<{ url: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileKey, expirationSeconds);

    if (error) {
      console.error('Supabase download URL error:', error);
      return { url: '', error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    console.error('Generate download URL error:', error);
    return {
      url: '',
      error: error instanceof Error ? error.message : 'Failed to generate download URL',
    };
  }
}

/**
 * Get public URL for a file (only works if bucket is public)
 */
export function getPublicUrl(fileKey: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileKey);
  return data.publicUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileKey]);

    if (error) {
      console.error('Supabase delete file error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}

/**
 * Sanitize filename to prevent path traversal and special characters
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/^.*[\\/]/, '') // Remove path separators
    .replace(/[^a-zA-Z0-9._-]/g, '-') // Replace special chars with dash
    .slice(0, 255); // Limit length
}

/**
 * Validate file type
 */
export function validateFileType(fileName: string): {
  valid: boolean;
  fileType?: 'pdf' | 'docx';
  error?: string;
} {
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return { valid: true, fileType: 'pdf' };
  } else if (ext === 'docx') {
    return { valid: true, fileType: 'docx' };
  } else if (ext === 'doc') {
    return { valid: true, fileType: 'docx' }; // Treat .doc as docx
  }

  return {
    valid: false,
    error: 'Only PDF and DOCX files are allowed',
  };
}

/**
 * Validate file size (max 100MB)
 */
export function validateFileSize(size: number): { valid: boolean; error?: string } {
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  if (size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 100MB',
    };
  }

  return { valid: true };
}
