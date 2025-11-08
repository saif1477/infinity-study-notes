import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'rahul.sharma@gitam.in',
            name: 'Rahul Sharma',
            role: 'student',
            createdAt: new Date('2024-08-15').toISOString(),
        },
        {
            email: 'priya.patel@gitam.in',
            name: 'Priya Patel',
            role: 'student',
            createdAt: new Date('2024-09-01').toISOString(),
        },
        {
            email: 'arjun.kumar@gitam.in',
            name: 'Arjun Kumar',
            role: 'student',
            createdAt: new Date('2024-09-15').toISOString(),
        },
        {
            email: 'sneha.reddy@gitam.in',
            name: 'Sneha Reddy',
            role: 'student',
            createdAt: new Date('2024-10-01').toISOString(),
        },
        {
            email: 'vikram.singh@gitam.in',
            name: 'Vikram Singh',
            role: 'student',
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            email: 'ananya.iyer@gitam.in',
            name: 'Ananya Iyer',
            role: 'student',
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            email: 'ramesh.gupta@gitam.in',
            name: 'Dr. Ramesh Gupta',
            role: 'professor',
            createdAt: new Date('2024-08-01').toISOString(),
        },
        {
            email: 'lakshmi.devi@gitam.in',
            name: 'Prof. Lakshmi Devi',
            role: 'professor',
            createdAt: new Date('2024-08-10').toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});