import { db } from '@/db';
import { notes } from '@/db/schema';

async function main() {
    const sampleNotes = [
        // Semester 3
        {
            title: 'Data Structures and Algorithms - Complete Notes',
            semester: 3,
            fileUrl: '/uploads/notes/data-structures-sem3.pdf',
            fileType: 'pdf',
            uploadedBy: 1,
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            title: 'Web Technologies - HTML, CSS, JavaScript Basics',
            semester: 3,
            fileUrl: '/uploads/notes/web-tech-sem3.docx',
            fileType: 'docx',
            uploadedBy: 3,
            createdAt: new Date('2024-11-02').toISOString(),
        },
        // Semester 4
        {
            title: 'Database Management Systems - SQL and Normalization',
            semester: 4,
            fileUrl: '/uploads/notes/dbms-notes-sem4.pdf',
            fileType: 'pdf',
            uploadedBy: 2,
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            title: 'Computer Networks - OSI Model and Protocols',
            semester: 4,
            fileUrl: '/uploads/notes/computer-networks-sem4.docx',
            fileType: 'docx',
            uploadedBy: 5,
            createdAt: new Date('2024-11-08').toISOString(),
        },
        // Semester 5
        {
            title: 'Operating Systems - Process Management and Scheduling',
            semester: 5,
            fileUrl: '/uploads/notes/operating-systems-sem5.pdf',
            fileType: 'pdf',
            uploadedBy: 4,
            createdAt: new Date('2024-10-25').toISOString(),
        },
        {
            title: 'Advanced Algorithms - Greedy and Dynamic Programming',
            semester: 5,
            fileUrl: '/uploads/notes/algorithms-sem5.pdf',
            fileType: 'pdf',
            uploadedBy: 6,
            createdAt: new Date('2024-11-12').toISOString(),
        },
        // Semester 6
        {
            title: 'Software Engineering - SDLC and Design Patterns',
            semester: 6,
            fileUrl: '/uploads/notes/software-engineering-sem6.docx',
            fileType: 'docx',
            uploadedBy: 7,
            createdAt: new Date('2024-10-30').toISOString(),
        },
        {
            title: 'Compiler Design - Lexical Analysis and Parsing',
            semester: 6,
            fileUrl: '/uploads/notes/compiler-design-sem6.pdf',
            fileType: 'pdf',
            uploadedBy: 8,
            createdAt: new Date('2024-11-15').toISOString(),
        },
        // Semester 7
        {
            title: 'Machine Learning - Supervised and Unsupervised Learning',
            semester: 7,
            fileUrl: '/uploads/notes/machine-learning-sem7.pdf',
            fileType: 'pdf',
            uploadedBy: 1,
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            title: 'Computer Architecture - CPU Design and Memory Hierarchy',
            semester: 7,
            fileUrl: '/uploads/notes/computer-architecture-sem7.docx',
            fileType: 'docx',
            uploadedBy: 3,
            createdAt: new Date('2024-11-18').toISOString(),
        },
        // Semester 8
        {
            title: 'Theory of Computation - Automata and Formal Languages',
            semester: 8,
            fileUrl: '/uploads/notes/theory-computation-sem8.pdf',
            fileType: 'pdf',
            uploadedBy: 2,
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            title: 'Artificial Intelligence - Search Algorithms and Knowledge Representation',
            semester: 8,
            fileUrl: '/uploads/notes/artificial-intelligence-sem8.pdf',
            fileType: 'pdf',
            uploadedBy: 4,
            createdAt: new Date('2024-11-22').toISOString(),
        },
    ];

    await db.insert(notes).values(sampleNotes);
    
    console.log('✅ Notes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});