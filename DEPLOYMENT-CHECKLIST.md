# 🚀 Vihang Deployment Checklist

## ✅ Pre-Deployment Tasks

### 1. Supabase Database Setup
- [ ] Go to https://supabase.com/dashboard/project/dzkjelogtbhauavhpbdy
- [ ] Click "SQL Editor"
- [ ] Copy and paste the entire content of `database-setup.sql`
- [ ] Click "Run" to execute the SQL
- [ ] Verify tables are created (should see `stories` and `contacts` tables)

### 2. Environment Variables
Copy these for your deployment platform:

```
VITE_SUPABASE_URL=https://dzkjelogtbhauavhpbdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6a2plbG9ndGJoYXVhdmhwYmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxOTkyMzIsImV4cCI6MjA3MDc3NTIzMn0.Ak6_cop_NSqsmoDbs8hT8xVZ66MwG-L8pIO2t_3l6Qo
```

## 🌐 Deployment Options

### Option A: Vercel (Recommended)
1. [ ] Go to https://vercel.com
2. [ ] Sign up with GitHub
3. [ ] Click "New Project"
4. [ ] Import "Vihang" repository
5. [ ] Add environment variables above
6. [ ] Click "Deploy"
7. [ ] Wait for deployment to complete
8. [ ] Test your live site!

### Option B: Netlify
1. [ ] Go to https://netlify.com
2. [ ] Sign up with GitHub
3. [ ] Click "New site from Git"
4. [ ] Select "Vihang" repository
5. [ ] Build command: `npm run build`
6. [ ] Publish directory: `dist`
7. [ ] Add environment variables in site settings
8. [ ] Deploy!

## 🧪 Post-Deployment Testing

After deployment, test these features:

- [ ] Homepage loads correctly
- [ ] Story submission form works
- [ ] Story listing displays properly
- [ ] Contact form works
- [ ] Search and filtering work
- [ ] Mobile responsive design
- [ ] Check browser console for errors

## 🔧 Troubleshooting

If you encounter issues:

1. **Build fails**: Check environment variables are set correctly
2. **Database errors**: Verify SQL script ran successfully in Supabase
3. **Blank page**: Check browser console for JavaScript errors
4. **Stories don't load**: Verify Supabase RLS policies are active

## 🎉 Go Live!

Once deployed, your Vihang platform will be accessible at:
- **Vercel**: `https://your-project-name.vercel.app`
- **Netlify**: `https://your-site-name.netlify.app`

Share your platform with communities across India! 🇮🇳
