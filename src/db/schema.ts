import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Update users table - add password_hash, modify role, add updated_at
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'student' or 'professor'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Update notes table - add user_id, subject_name, description, views/downloads counts, updated_at
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  subjectName: text('subject_name').notNull(),
  semester: integer('semester').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  description: text('description'),
  viewsCount: integer('views_count').notNull().default(0),
  downloadsCount: integer('downloads_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Update chats table - remove receiver_id and is_read, keep note_id, sender_id, message
export const chats = sqliteTable('chats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noteId: integer('note_id').notNull().references(() => notes.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});