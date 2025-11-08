import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
    const password = 'password123';
    const passwordHash = bcrypt.hashSync(password, 10);

    const sampleUsers = [
        {
            email: 'rahul.sharma@gitam.in',
            passwordHash: passwordHash,
            name: 'Rahul Sharma',
            role: 'student',
            createdAt: new Date('2024-08-15').toISOString(),
            updatedAt: new Date('2024-08-15').toISOString(),
        },
        {
            email: 'priya.patel@gitam.in',
            passwordHash: passwordHash,
            name: 'Priya Patel',
            role: 'student',
            createdAt: new Date('2024-09-01').toISOString(),
            updatedAt: new Date('2024-09-01').toISOString(),
        },
        {
            email: 'arjun.kumar@gitam.in',
            passwordHash: passwordHash,
            name: 'Arjun Kumar',
            role: 'student',
            createdAt: new Date('2024-09-15').toISOString(),
            updatedAt: new Date('2024-09-15').toISOString(),
        },
        {
            email: 'sneha.reddy@gitam.in',
            passwordHash: passwordHash,
            name: 'Sneha Reddy',
            role: 'student',
            createdAt: new Date('2024-10-05').toISOString(),
            updatedAt: new Date('2024-10-05').toISOString(),
        },
        {
            email: 'aditya.singh@gitam.in',
            passwordHash: passwordHash,
            name: 'Aditya Singh',
            role: 'student',
            createdAt: new Date('2024-10-20').toISOString(),
            updatedAt: new Date('2024-10-20').toISOString(),
        },
        {
            email: 'neha.gupta@gitam.in',
            passwordHash: passwordHash,
            name: 'Neha Gupta',
            role: 'student',
            createdAt: new Date('2024-11-08').toISOString(),
            updatedAt: new Date('2024-11-08').toISOString(),
        },
        {
            email: 'karthik.rao@gitam.in',
            passwordHash: passwordHash,
            name: 'Karthik Rao',
            role: 'student',
            createdAt: new Date('2024-11-22').toISOString(),
            updatedAt: new Date('2024-11-22').toISOString(),
        },
        {
            email: 'dr.ramesh.gupta@gitam.in',
            passwordHash: passwordHash,
            name: 'Dr. Ramesh Gupta',
            role: 'professor',
            createdAt: new Date('2024-08-10').toISOString(),
            updatedAt: new Date('2024-08-10').toISOString(),
        },
        {
            email: 'prof.lakshmi.devi@gitam.in',
            passwordHash: passwordHash,
            name: 'Prof. Lakshmi Devi',
            role: 'professor',
            createdAt: new Date('2024-09-20').toISOString(),
            updatedAt: new Date('2024-09-20').toISOString(),
        },
        {
            email: 'dr.vijay.krishnan@gitam.in',
            passwordHash: passwordHash,
            name: 'Dr. Vijay Krishnan',
            role: 'professor',
            createdAt: new Date('2024-12-01').toISOString(),
            updatedAt: new Date('2024-12-01').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});