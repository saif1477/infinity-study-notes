# Infinity Study Notes 🎓

Infinity Study Notes is a modern, collaborative digital library and learning platform specifically tailored for students and professors at **GITAM University**. The platform provides a centralized, organized way to share course materials, discuss topics in real-time, and track academic resources.

## 🚀 Features

- **Centralized Notes Hub:** Browse, filter, and download course notes structured cleanly by subject and semester (1-8).
- **Seamless Uploads:** Easily upload class materials (PDF, DOCX) along with rich metadata and descriptions.
- **Real-Time Collaboration:** Every note includes a dedicated live chat room where students and professors can discuss the content.
- **Role-Based Access Control:** Differentiated roles for Students, Professors, and Administrators to ensure platform integrity and quality.
- **Resource Analytics:** Tracks view counts, downloads, and file sizes to help students discover the most helpful resources.
- **Dynamic & Responsive UI:** Built with Framer Motion and Tailwind CSS for a premium, buttery-smooth user experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Radix UI
- **Database:** PostgreSQL via [Supabase](https://supabase.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Deployment:** Vercel

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and `npm` installed.
- A [Supabase](https://supabase.com/) account for the Postgres database.

### 1. Clone the repository
```bash
git clone https://github.com/saif1477/infinity-study-notes.git
cd infinity-study-notes
```

### 2. Install Dependencies
We strictly use `npm` as the package manager.
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` or `.env.local` file in the root directory and add the following keys. *(Check `SUPABASE_STORAGE_SETUP.md` and `ADMIN_SETUP.md` for extended configurations)*.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_postgresql_database_url
```

### 4. Database Migrations
Ensure your local or remote Supabase database matches the Drizzle schema.

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Repository Structure
- `/src/app` - Next.js App Router containing pages (login, register, notes, dashboard, admin, etc.)
- `/src/components` - Reusable UI components.
- `/src/db` - Database schema definitions (`schema.ts`).
- `/public` - Static assets and global styles.

## 🤝 Contributing
Contributions are welcome! If you're a GITAM student and want to improve the platform, feel free to submit a Pull Request or open an Issue.

## 📄 License
This project is for educational and community use.
