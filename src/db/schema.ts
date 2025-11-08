import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Update users table - remove passwordHash, modify role
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  createdAt: text('created_at').notNull(),
});

// Update notes table - rename and modify fields
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  semester: integer('semester').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  uploadedBy: integer('uploaded_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
});

// Keep chats table as is
export const chats = sqliteTable('chats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noteId: integer('note_id').notNull().references(() => notes.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  receiverId: integer('receiver_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
});