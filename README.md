# Vihang - Community Stories Platform

A React TypeScript application that connects communities with NGOs and volunteers by allowing people to share their stories and needs.

## 🚀 Features

- **Story Submission**: Community members can submit stories about challenges they face
- **NGO Registration**: NGOs and volunteers can register to help communities
- **Story Browsing**: Browse and search through approved community stories
- **Responsive Design**: Mobile-first design with modern UI components
- **Real-time Data**: Powered by Supabase for real-time data management

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Routing**: Wouter
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Vihang
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor
   - This will create the necessary tables, indexes, and policies

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Stories Table
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `email` (Text, Required)
- `city` (Text, Required)
- `state` (Text, Required)
- `category` (Text, Required) - education, health, livelihood, infrastructure, other
- `title` (Text, Required)
- `story` (Text, Required)
- `photo_url` (Text, Optional)
- `tags` (Text Array, Optional)
- `status` (Text, Default: pending) - pending, approved, rejected
- `created_at`, `updated_at` (Timestamps)

### NGOs Table
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `email` (Text, Required, Unique)
- `phone` (Text, Required)
- `website` (Text, Optional)
- `description` (Text, Required)
- `focus_areas` (Text Array, Required)
- `city` (Text, Required)
- `state` (Text, Required)
- `verified` (Boolean, Default: false)
- `created_at`, `updated_at` (Timestamps)

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Environment Variables for Production**
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```

### Manual Deployment
The `netlify.toml` file is already configured for automatic deployment.

## 📱 Usage

1. **Submit a Story**: Users can submit stories about community challenges
2. **Browse Stories**: View approved stories from communities across India
3. **NGO Registration**: NGOs can register to receive relevant story notifications
4. **Contact**: Connect with the platform administrators

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Public read access only for approved/verified content
- Input validation with Zod schemas
- Environment variable protection

## 🎨 UI Components

Built with shadcn/ui components:
- Forms with validation
- Responsive navigation
- Modern card layouts
- Toast notifications
- Loading states

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ for India** - Connecting communities with helpers, one story at a time.