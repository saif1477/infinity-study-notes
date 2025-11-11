import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Update users table - add isBlocked field
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'student' or 'professor'
  isBlocked: integer('is_blocked', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Update notes table - remove viewsCount
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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

// Update chats table - add ON DELETE CASCADE for both noteId and senderId foreign keys
export const chats = sqliteTable('chats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noteId: integer('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});