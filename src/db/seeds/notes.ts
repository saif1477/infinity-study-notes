import { db } from '@/db';
import { notes } from '@/db/schema';

async function main() {
    const sampleNotes = [
        {
            title: 'Data Structures',
            semester: 3,
            fileUrl: '/uploads/notes/data-structures-sem3.pdf',
            fileType: 'pdf',
            uploadedBy: 1,
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            title: 'Web Technologies',
            semester: 3,
            fileUrl: '/uploads/notes/web-technologies-sem3.docx',
            fileType: 'docx',
            uploadedBy: 2,
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            title: 'DBMS',
            semester: 4,
            fileUrl: '/uploads/notes/dbms-notes-sem4.pdf',
            fileType: 'pdf',
            uploadedBy: 3,
            createdAt: new Date('2024-11-01').toISOString(),
        },
        {
            title: 'Computer Networks',
            semester: 4,
            fileUrl: '/uploads/notes/computer-networks-sem4.docx',
            fileType: 'docx',
            uploadedBy: 4,
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            title: 'Operating Systems',
            semester: 5,
            fileUrl: '/uploads/notes/operating-systems-sem5.pdf',
            fileType: 'pdf',
            uploadedBy: 5,
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            title: 'Algorithms',
            semester: 5,
            fileUrl: '/uploads/notes/algorithms-sem5.docx',
            fileType: 'docx',
            uploadedBy: 6,
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            title: 'Software Engineering',
            semester: 6,
            fileUrl: '/uploads/notes/software-engineering-sem6.pdf',
            fileType: 'pdf',
            uploadedBy: 7,
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            title: 'Compiler Design',
            semester: 6,
            fileUrl: '/uploads/notes/compiler-design-sem6.docx',
            fileType: 'docx',
            uploadedBy: 8,
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            title: 'Machine Learning',
            semester: 7,
            fileUrl: '/uploads/notes/machine-learning-sem7.pdf',
            fileType: 'pdf',
            uploadedBy: 1,
            createdAt: new Date('2024-12-01').toISOString(),
        },
        {
            title: 'Computer Architecture',
            semester: 7,
            fileUrl: '/uploads/notes/computer-architecture-sem7.docx',
            fileType: 'docx',
            uploadedBy: 2,
            createdAt: new Date('2024-12-05').toISOString(),
        },
        {
            title: 'Theory of Computation',
            semester: 8,
            fileUrl: '/uploads/notes/theory-of-computation-sem8.pdf',
            fileType: 'pdf',
            uploadedBy: 3,
            createdAt: new Date('2024-12-10').toISOString(),
        },
        {
            title: 'Artificial Intelligence',
            semester: 8,
            fileUrl: '/uploads/notes/artificial-intelligence-sem8.docx',
            fileType: 'docx',
            uploadedBy: 4,
            createdAt: new Date('2024-12-15').toISOString(),
        },
    ];

    await db.insert(notes).values(sampleNotes);
    
    console.log('✅ Notes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});