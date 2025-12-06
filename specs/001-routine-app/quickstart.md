# Quickstart Guide: Routine App

Get the Routine app running locally in under 10 minutes.

## Prerequisites

- **Node.js** 20.x LTS or later
- **npm** 10.x or **pnpm** 8.x (recommended)
- **Git**
- **Supabase account** (free tier: [supabase.com](https://supabase.com))

## 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd routine-app

# Install dependencies (using pnpm recommended)
pnpm install
# or
npm install
```

## 2. Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `routine-app` (or your preference)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup (~2 minutes)

### Get API Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep secret!)

### Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and run the SQL from `specs/001-routine-app/data-model.md` (Database Schema section)
3. Also run the RLS policies from the same file

Or use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

### Enable Authentication

1. In Supabase dashboard, go to **Authentication → Providers**
2. Ensure **Email** is enabled
3. Optionally configure email templates under **Authentication → Email Templates**

## 3. Configure Environment

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Email (Resend)
RESEND_API_KEY=your-resend-key
```

> ⚠️ **Never commit `.env.local` to git!** It's already in `.gitignore`.

## 4. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Verify Setup

### Test Authentication

1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create a test account with email and password
3. Verify you're redirected to the dashboard

### Test Routines

1. On the dashboard, click "Add Routine"
2. Enter:
   - **Name**: "Test Routine"
   - **Daily Average**: 2
3. Click Save
4. Verify the routine appears in the table
5. Click +/- on any day to update points

## Project Structure

```
routine-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (public)/        # Landing, About, FAQ, Contact
│   │   ├── (auth)/          # Login, Signup
│   │   ├── (dashboard)/     # Protected app pages
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities, Supabase clients
│   ├── stores/              # Zustand state stores
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── tests/                   # Test files
├── supabase/                # Database migrations
└── public/                  # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm db:push` | Push database migrations |
| `pnpm db:reset` | Reset database (⚠️ destroys data) |

## Common Issues

### "Invalid API key" error
- Verify your `.env.local` has the correct Supabase keys
- Restart the dev server after changing env vars

### "Row Level Security" errors
- Ensure RLS policies are applied (see data-model.md)
- Check that you're authenticated when accessing protected routes

### Styles not loading
- Run `pnpm install` to ensure Tailwind is installed
- Check `tailwind.config.js` content paths include your files

### Database connection issues
- Verify your Supabase project is active (free tier pauses after inactivity)
- Check the Project URL is correct in `.env.local`

## Next Steps

1. **Customize styling**: Edit `src/app/globals.css` and Tailwind config
2. **Add features**: See `specs/001-routine-app/spec.md` for full requirements
3. **Write tests**: Add tests in `tests/` directory
4. **Deploy**: See deployment section below

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### Environment-Specific Supabase

For production, create a separate Supabase project:

```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
```

## Support

- **Spec**: `specs/001-routine-app/spec.md`
- **Data Model**: `specs/001-routine-app/data-model.md`
- **API Contracts**: `specs/001-routine-app/contracts/api.yaml`
- **Research Decisions**: `specs/001-routine-app/research.md`
