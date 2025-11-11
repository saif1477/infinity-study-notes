import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleUsers = [
        {
            email: 'admin@gitam.edu',
            passwordHash: bcrypt.hashSync('password123', 10),
            name: 'Admin User',
            role: 'admin',
            isBlocked: false,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            email: 'student@student.gitam.edu',
            passwordHash: bcrypt.hashSync('password123', 10),
            name: 'Test Student',
            role: 'student',
            isBlocked: false,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            email: 'blocked.student@student.gitam.edu',
            passwordHash: bcrypt.hashSync('password123', 10),
            name: 'Blocked Student',
            role: 'student',
            isBlocked: false,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});