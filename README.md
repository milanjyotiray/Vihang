# Vihang 🇮🇳

**A platform for sharing community stories and connecting with helpers**

Vihang is a community-driven platform that enables people to share their stories, challenges, and needs while connecting them with individuals and organizations who can provide help and support.

![Vihang Platform](https://img.shields.io/badge/Platform-Community%20Stories-orange)
![Built with React](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![Database](https://img.shields.io/badge/Database-Supabase-green)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue)

## ✨ Features

- 📝 **Story Submission**: Easy-to-use form for sharing community stories
- 🔍 **Search & Filter**: Find stories by category, location, and keywords
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🗺️ **Location Detection**: Auto-detect user location for story submission
- 📊 **Real-time Updates**: Live story updates using Supabase real-time features
- 💬 **Contact System**: Direct communication system for helpers and story tellers
- 🏷️ **Categorization**: Stories organized by Education, Health, Livelihood, and Other
- 🌐 **Multi-state Support**: Coverage across all Indian states and territories

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vihang.git
cd vihang
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to SQL Editor and run the following schema:

```sql
-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'health', 'livelihood', 'other')),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_state ON stories(state);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);

-- Enable Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to stories
CREATE POLICY "Stories are publicly readable" ON stories
  FOR SELECT USING (true);

-- Create policy for public insert access to stories
CREATE POLICY "Anyone can submit stories" ON stories
  FOR INSERT WITH CHECK (true);

-- Create policy for public insert access to contacts
CREATE POLICY "Anyone can submit contacts" ON contacts
  FOR INSERT WITH CHECK (true);
```

### 4. Configure environment variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   You can find these values in your Supabase project settings under "API".

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
vihang/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (buttons, forms, etc.)
│   │   └── layout/         # Layout components (navbar, footer)
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and configurations
│   │   ├── supabase.ts     # Supabase client configuration
│   │   ├── queryClient.ts  # React Query setup & API services
│   │   └── utils.ts        # Helper utilities
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── shared/                 # Shared schemas and types
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter
- **Icons**: Lucide React

## 📱 API Services

The application uses Supabase for all backend operations:

- **Story Service**: CRUD operations for community stories
- **Contact Service**: Handle contact form submissions
- **Real-time Updates**: Live updates when new stories are submitted
- **Search**: Full-text search across stories
- **Filtering**: Filter by category, location, and other criteria

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vihang)

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/vihang)

### Other Deployment Options

- **Railway**: Supports both frontend and database hosting
- **DigitalOcean App Platform**: Simple deployment with managed databases
- **AWS Amplify**: Full-stack deployment with CI/CD
- **Render**: Free tier available for static sites

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

### Customization

- **Colors**: Modify the Indian flag colors in `tailwind.config.js`
- **States**: Update the list of Indian states in `src/pages/submit-story.tsx`
- **Categories**: Add or modify story categories in `shared/schema.ts`
- **Fonts**: Change fonts in `index.html` and `tailwind.config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for the Indian community
- Inspired by the spirit of helping others
- Thanks to all contributors and story sharers

---

**Made with ❤️ for connecting communities and spreading hope**

For questions or support, please create an issue or contact us through the platform.
