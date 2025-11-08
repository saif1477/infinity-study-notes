import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Add users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add notes table
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  semester: integer('semester').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(),
  uploaderId: integer('uploader_id').notNull().references(() => users.id),
  description: text('description'),
  downloadsCount: integer('downloads_count').notNull().default(0),
  viewsCount: integer('views_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add chats table
export const chats = sqliteTable('chats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noteId: integer('note_id').notNull().references(() => notes.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  receiverId: integer('receiver_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
});