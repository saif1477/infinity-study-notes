# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for file uploads in your Infinity Study Notes app.

## 🎯 Overview

Your app now uses **Supabase Storage** instead of Google Drive, which means:
- ✅ Users upload files directly to your storage
- ✅ No Google Drive permissions needed
- ✅ Secure presigned URLs for uploads and downloads
- ✅ Files are automatically managed by your app
- ✅ Support for PDF and DOCX files up to 100MB

## 📋 Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new organization (if you don't have one)

## 📦 Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `infinity-study-notes` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Start with the **Free tier** (includes 1GB storage)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

## 🗄️ Step 3: Create Storage Bucket

1. In your Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Configure the bucket:
   - **Name**: `notes`
   - **Public bucket**: ❌ **Leave unchecked** (keep private for security)
   - **File size limit**: `104857600` (100MB in bytes)
   - **Allowed MIME types**: 
     ```
     application/pdf
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/msword
     ```
4. Click **"Create bucket"**

## 🔑 Step 4: Get Your API Keys

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see two important values:

### Project URL
```
https://your-project-id.supabase.co
```

### API Keys
- **anon public**: This is safe to use in the browser
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

## 🔒 Step 5: Configure Storage Policies

For secure file access, you need to set up Row Level Security (RLS) policies:

1. In Supabase dashboard, go to **Storage** → **Policies**
2. Click on the `notes` bucket
3. Click **"New Policy"**

### Policy 1: Allow Authenticated Uploads
- **Policy name**: `Allow authenticated uploads`
- **Policy definition**: 
  ```sql
  CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'notes');
  ```

### Policy 2: Allow Public Downloads (via presigned URLs)
- **Policy name**: `Allow presigned downloads`
- **Policy definition**: 
  ```sql
  CREATE POLICY "Allow presigned downloads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes');
  ```

## ⚙️ Step 6: Add Environment Variables

1. Copy your API keys from Step 4
2. Add them to your `.env` file:

```bash
# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Replace the placeholder values with your actual keys!

## 🧪 Step 7: Test the Setup

1. Restart your development server
2. Log in to your app
3. Go to **Upload Notes** page
4. Try uploading a PDF or DOCX file
5. Check if the upload progress bar appears
6. Verify the file appears in the dashboard

You can also verify in Supabase:
- Go to **Storage** → `notes` bucket
- You should see uploaded files organized by user ID

## 📊 Monitoring Usage

### Check Storage Usage
1. Go to **Settings** → **Billing**
2. View your current storage usage
3. Free tier includes **1GB** of storage

### View Uploaded Files
1. Go to **Storage** → `notes` bucket
2. Browse files by folder (organized by user ID)
3. Files are named: `notes/{userId}/{timestamp}-{filename}`

## 🔧 Troubleshooting

### Issue: "Failed to generate upload URL"
**Solution:** Check that:
- Your Supabase URL is correct in `.env`
- The `notes` bucket exists
- Storage policies are configured

### Issue: "Upload failed with status 403"
**Solution:** 
- Verify storage policies are set up correctly
- Check that the bucket is not set to public

### Issue: "File too large"
**Solution:** 
- Maximum file size is 100MB
- Adjust bucket settings if needed

### Issue: "Invalid file type"
**Solution:** 
- Only PDF and DOCX files are allowed
- Check the file extension

## 💰 Pricing Information

### Free Tier (Perfect for starting)
- ✅ 1GB storage
- ✅ 2GB bandwidth per month
- ✅ 50GB data transfer
- ✅ Unlimited API requests

### Pro Tier ($25/month)
- ✅ 100GB storage
- ✅ 200GB bandwidth
- ✅ More features

[View full pricing →](https://supabase.com/pricing)

## 🚀 Next Steps

After setup is complete:
1. ✅ Test file uploads with different file types
2. ✅ Test downloads from the dashboard
3. ✅ Monitor storage usage
4. ✅ Consider setting up automatic backups

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Security Best Practices](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Limits](https://supabase.com/docs/guides/storage#file-upload-limits)

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard for storage policies
3. Verify your API keys are correct in `.env`
4. Make sure the development server is restarted after adding env variables
