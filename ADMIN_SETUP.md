# Admin Panel Setup Guide

## Overview
The admin panel provides comprehensive management tools for the Infinity Study Notes platform, including user management, file moderation, and analytics.

## Creating an Admin User

Since admin access should be restricted, users cannot register as "admin" through the normal registration form. Instead, you need to manually promote a user to admin status in the database.

### Method 1: Using Database Studio (Recommended)

1. Go to the **Database Studio** tab at the top of the page (next to Analytics)
2. Navigate to the `users` table
3. Find the user you want to promote to admin
4. Edit the `role` field and change it from `student` or `professor` to `admin`
5. Save the changes

### Method 2: Using SQL Query

Execute this SQL query in your database console:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@gitam.edu';
```

Replace `your-email@gitam.edu` with the email of the user you want to make an admin.

### Method 3: Using Drizzle Studio (Local Development)

If running locally:

```bash
npx drizzle-kit studio
```

Then navigate to the users table and update the role field.

## Accessing the Admin Panel

Once a user has been promoted to admin:

1. Log in with the admin account
2. Navigate to `/admin` or click the **"Admin Panel"** button in the dashboard header
3. The admin panel has three main sections:

### 📊 Overview Tab
- **Statistics Dashboard**: Total users, notes, downloads, and views
- **Users by Role**: Breakdown of students, professors, and admins
- **Notes by Semester**: Distribution of notes across semesters
- **Storage Usage**: Total file storage consumed

### 👥 Users Tab
- **User Management**: View all registered users
- **User Details**: Name, email, role, notes count, join date
- **User Actions**: Delete users (except yourself)
- **Search**: Filter users by name or email
- **Note**: Deleting a user will cascade delete all their notes and chats

### 📝 Notes Tab
- **File Management**: View all uploaded notes
- **File Details**: Title, subject, semester, uploader info, views, downloads, file size
- **File Actions**: Delete inappropriate or problematic notes
- **Search**: Filter notes by title, subject, or uploader
- **Note**: Deleting a note removes the file from storage and all associated chats

## Admin Features

### User Management
- View complete user list with activity metrics
- Delete user accounts (with cascade deletion of their content)
- Cannot delete your own admin account
- Search and filter users

### File Moderation
- Monitor all uploaded files
- View detailed file metadata
- Delete inappropriate content
- Track file engagement (views/downloads)
- Automatic storage cleanup on deletion

### Analytics
- Real-time platform statistics
- User role distribution
- Semester-wise note distribution
- Storage usage tracking
- Total engagement metrics

## Security Features

1. **Role-Based Access Control**: Only users with `role = 'admin'` can access the panel
2. **API Protection**: All admin API routes verify admin status
3. **Self-Protection**: Admins cannot delete their own accounts
4. **Cascade Deletion**: Maintains database integrity when deleting users or notes
5. **Storage Cleanup**: Automatically removes files from Supabase storage when notes are deleted

## API Endpoints

All admin endpoints require authentication with admin role:

- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/[id]` - Delete a user
- `GET /api/admin/notes` - List all notes
- `DELETE /api/admin/notes/[id]` - Delete a note
- `GET /api/admin/stats` - Get platform statistics

## Important Notes

⚠️ **Admin Responsibilities**:
- Deleting users permanently removes all their content
- Deleting notes removes files from storage (cannot be undone)
- Be careful with delete actions - they cannot be reversed
- Monitor storage usage to manage hosting costs

🔒 **Security Best Practices**:
- Only promote trusted users to admin
- Use strong passwords for admin accounts
- Regularly review admin access list
- Monitor admin activity logs

## Troubleshooting

**Cannot access admin panel?**
- Verify your user role is set to "admin" in the database
- Clear browser cache and localStorage
- Re-login to refresh your session

**Delete actions not working?**
- Check you have SUPABASE_SERVICE_ROLE_KEY in .env
- Verify database cascade rules are properly set
- Check browser console for error messages

**Stats not loading?**
- Ensure database connection is active
- Check API route logs for errors
- Verify admin authentication token

## Support

For additional help or feature requests, contact the development team.
