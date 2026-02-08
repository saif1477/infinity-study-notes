import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'student' or 'professor'
  profileImage: text('profile_image'), // URL to profile image in Supabase storage
  isBlocked: boolean('is_blocked').notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  subjectName: text('subject_name').notNull(),
  semester: integer('semester').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  fileKey: text('file_key').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  description: text('description'),
  downloadsCount: integer('downloads_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Track which users downloaded which notes
export const downloads = pgTable('user_downloads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  noteId: integer('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  downloadedAt: text('created_at').notNull(),
});

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  noteId: integer('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});
