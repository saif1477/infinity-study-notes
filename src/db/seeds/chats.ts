import { db } from '@/db';
import { chats } from '@/db/schema';

async function main() {
    const sampleChats = [
        {
            noteId: 1,
            senderId: 2,
            receiverId: 1,
            message: 'Hey! Thanks for uploading these DSA notes. Could you explain the concept on page 5 about binary trees?',
            createdAt: new Date('2024-11-15T10:30:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 1,
            senderId: 1,
            receiverId: 2,
            message: 'Sure! Binary trees are hierarchical data structures. Page 5 covers the traversal methods - I can send you some additional examples if needed.',
            createdAt: new Date('2024-11-15T11:45:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 1,
            senderId: 2,
            receiverId: 1,
            message: 'That would be great! The diagrams are really clear, appreciate it!',
            createdAt: new Date('2024-11-15T14:20:00Z').toISOString(),
            isRead: false,
        },
        {
            noteId: 3,
            senderId: 4,
            receiverId: 3,
            message: 'Is this for the mid-term or final exam? I need to prepare for both.',
            createdAt: new Date('2024-11-20T09:15:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 3,
            senderId: 3,
            receiverId: 4,
            message: 'These are specifically for the mid-term. I will upload final exam notes next week!',
            createdAt: new Date('2024-11-20T10:30:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 5,
            senderId: 5,
            receiverId: 1,
            message: 'Thanks for sharing these DBMS notes! Very helpful for exams. Do you have notes for chapter 4 as well?',
            createdAt: new Date('2024-11-25T16:45:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 5,
            senderId: 1,
            receiverId: 5,
            message: 'Yes! I will upload chapter 4 notes tomorrow. They cover normalization and transactions.',
            createdAt: new Date('2024-11-25T18:00:00Z').toISOString(),
            isRead: false,
        },
        {
            noteId: 7,
            senderId: 6,
            receiverId: 2,
            message: 'The machine learning examples are excellent! Could you share the Python code for the neural network section?',
            createdAt: new Date('2024-12-01T13:20:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 7,
            senderId: 2,
            receiverId: 6,
            message: 'Sure! I have the Jupyter notebook with all the code. I will attach it in the notes section soon.',
            createdAt: new Date('2024-12-01T14:55:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 9,
            senderId: 3,
            receiverId: 4,
            message: 'Are these notes complete? I see chapter 3 is missing some topics.',
            createdAt: new Date('2024-12-05T11:00:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 9,
            senderId: 4,
            receiverId: 3,
            message: 'You are right! I will update them with the missing topics by this weekend. Thanks for pointing it out!',
            createdAt: new Date('2024-12-05T12:30:00Z').toISOString(),
            isRead: false,
        },
        {
            noteId: 10,
            senderId: 5,
            receiverId: 6,
            message: 'These probability notes are amazing! The examples really help understand the concepts better.',
            createdAt: new Date('2024-12-08T15:40:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 11,
            senderId: 1,
            receiverId: 3,
            message: 'Do you have the formula sheet for the upcoming exam? These notes are great but a quick reference would help.',
            createdAt: new Date('2024-12-10T09:25:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 12,
            senderId: 4,
            receiverId: 5,
            message: 'Thanks for the software engineering notes! The UML diagrams are very well explained.',
            createdAt: new Date('2024-12-12T10:50:00Z').toISOString(),
            isRead: true,
        },
        {
            noteId: 12,
            senderId: 5,
            receiverId: 4,
            message: 'Glad you found them useful! Let me know if you need any clarification on the design patterns section.',
            createdAt: new Date('2024-12-12T13:15:00Z').toISOString(),
            isRead: false,
        },
    ];

    await db.insert(chats).values(sampleChats);
    
    console.log('✅ Chats seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});