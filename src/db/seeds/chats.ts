import { db } from '@/db';
import { chats } from '@/db/schema';

async function main() {
    const sampleChats = [
        // Note 1 - Conversation about Data Structures notes
        {
            noteId: 1,
            senderId: 2,
            message: 'Thanks for uploading these notes! Very helpful for exams.',
            createdAt: new Date('2024-11-05T10:30:00').toISOString(),
        },
        {
            noteId: 1,
            senderId: 1,
            message: 'Glad it helps! Let me know if you need clarification on any topic.',
            createdAt: new Date('2024-11-05T11:15:00').toISOString(),
        },
        {
            noteId: 1,
            senderId: 3,
            message: 'Could you explain the concept on page 5 about binary trees?',
            createdAt: new Date('2024-11-06T14:20:00').toISOString(),
        },
        {
            noteId: 1,
            senderId: 1,
            message: 'Sure! Binary trees have nodes with at most two children. The left child is smaller and right child is larger than parent. Check the diagram on page 6 for visual reference.',
            createdAt: new Date('2024-11-06T15:45:00').toISOString(),
        },
        
        // Note 3 - Discussion about DBMS notes
        {
            noteId: 3,
            senderId: 4,
            message: 'These are excellent! Saved me a lot of time preparing for finals.',
            createdAt: new Date('2024-11-08T09:00:00').toISOString(),
        },
        {
            noteId: 3,
            senderId: 5,
            message: 'Do you have notes for chapter 4 on transactions as well?',
            createdAt: new Date('2024-11-08T16:30:00').toISOString(),
        },
        {
            noteId: 3,
            senderId: 1,
            message: 'I\'ll upload chapter 4 notes by tomorrow. Working on them right now!',
            createdAt: new Date('2024-11-08T17:10:00').toISOString(),
        },
        
        // Note 5 - Operating Systems discussion
        {
            noteId: 5,
            senderId: 6,
            message: 'Is this for mid-term or final exam?',
            createdAt: new Date('2024-11-10T11:00:00').toISOString(),
        },
        {
            noteId: 5,
            senderId: 2,
            message: 'These cover topics for the final exam. Mid-term notes are uploaded separately.',
            createdAt: new Date('2024-11-10T11:30:00').toISOString(),
        },
        {
            noteId: 5,
            senderId: 7,
            message: 'The diagrams are really clear, appreciate it!',
            createdAt: new Date('2024-11-11T08:45:00').toISOString(),
        },
        
        // Note 7 - Computer Networks conversation
        {
            noteId: 7,
            senderId: 8,
            message: 'Can you share the reference books for this topic?',
            createdAt: new Date('2024-11-12T13:20:00').toISOString(),
        },
        {
            noteId: 7,
            senderId: 3,
            message: 'Main reference is Tanenbaum\'s Computer Networks. Also check out Kurose and Ross for more details.',
            createdAt: new Date('2024-11-12T14:00:00').toISOString(),
        },
        {
            noteId: 7,
            senderId: 8,
            message: 'Perfect, thank you so much!',
            createdAt: new Date('2024-11-12T14:15:00').toISOString(),
        },
        
        // Note 10 - Single appreciation message
        {
            noteId: 10,
            senderId: 9,
            message: 'This is exactly what I was looking for! Great work.',
            createdAt: new Date('2024-11-15T10:00:00').toISOString(),
        },
        
        // Note 12 - Machine Learning discussion
        {
            noteId: 12,
            senderId: 10,
            message: 'Could you add some practice problems for neural networks?',
            createdAt: new Date('2024-11-18T09:30:00').toISOString(),
        },
        {
            noteId: 12,
            senderId: 4,
            message: 'I\'ll create a separate document with practice problems and upload it this week.',
            createdAt: new Date('2024-11-18T12:00:00').toISOString(),
        },
        
        // Note 14 - Web Development notes
        {
            noteId: 14,
            senderId: 2,
            message: 'Are the React examples tested? I\'m getting some errors.',
            createdAt: new Date('2024-11-20T15:45:00').toISOString(),
        },
        {
            noteId: 14,
            senderId: 5,
            message: 'All examples work with React 18. Make sure you have the latest version installed.',
            createdAt: new Date('2024-11-20T16:20:00').toISOString(),
        },
        {
            noteId: 14,
            senderId: 2,
            message: 'Got it working! The npm update fixed it. Thanks!',
            createdAt: new Date('2024-11-20T17:00:00').toISOString(),
        },
        
        // Note 16 - Algorithms notes
        {
            noteId: 16,
            senderId: 6,
            message: 'The complexity analysis section is really well explained. Helped me understand Big O notation better.',
            createdAt: new Date('2024-11-22T11:00:00').toISOString(),
        },
        
        // Note 18 - Software Engineering discussion
        {
            noteId: 18,
            senderId: 7,
            message: 'Do you have notes on Agile methodology as well?',
            createdAt: new Date('2024-11-25T14:30:00').toISOString(),
        },
        {
            noteId: 18,
            senderId: 6,
            message: 'Yes! Check note ID 19, I uploaded Agile and Scrum notes there.',
            createdAt: new Date('2024-11-25T15:00:00').toISOString(),
        },
        
        // Note 2 - Quick thank you
        {
            noteId: 2,
            senderId: 1,
            message: 'Thanks for sharing! This helped me understand pointers much better.',
            createdAt: new Date('2024-11-27T10:20:00').toISOString(),
        },
        
        // Note 8 - Compiler Design discussion
        {
            noteId: 8,
            senderId: 9,
            message: 'The parsing examples are great. Could you add more on semantic analysis?',
            createdAt: new Date('2024-11-28T13:45:00').toISOString(),
        },
        {
            noteId: 8,
            senderId: 7,
            message: 'I\'ll update the notes with semantic analysis examples by next week. Stay tuned!',
            createdAt: new Date('2024-11-28T16:30:00').toISOString(),
        },
        
        // Note 11 - Graphics notes
        {
            noteId: 11,
            senderId: 10,
            message: 'The 3D transformation matrices are confusing. Any tips?',
            createdAt: new Date('2024-12-01T09:15:00').toISOString(),
        },
        {
            noteId: 11,
            senderId: 8,
            message: 'Try visualizing them step by step. I can share some interactive demos if that helps.',
            createdAt: new Date('2024-12-01T10:30:00').toISOString(),
        },
        
        // Note 15 - Discrete Mathematics
        {
            noteId: 15,
            senderId: 3,
            message: 'Perfect timing! Exam is next week and these notes are comprehensive.',
            createdAt: new Date('2024-12-03T08:00:00').toISOString(),
        },
        
        // Note 20 - Theory of Computation
        {
            noteId: 20,
            senderId: 4,
            message: 'Could you add more examples for Turing machines? The theory is clear but need practice.',
            createdAt: new Date('2024-12-05T14:20:00').toISOString(),
        },
        {
            noteId: 20,
            senderId: 9,
            message: 'I\'ll prepare a problem set with solutions. Give me 2-3 days.',
            createdAt: new Date('2024-12-05T15:45:00').toISOString(),
        },
    ];

    await db.insert(chats).values(sampleChats);
    
    console.log('✅ Chats seeder completed successfully - 30 messages created');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});