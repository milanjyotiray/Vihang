-- Vihang Database Setup Script
-- Copy and paste this entire script into your Supabase SQL Editor

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

-- Insert sample data (optional)
INSERT INTO stories (name, email, city, state, category, title, story, featured) VALUES
('Priya Sharma', 'priya@example.com', 'Mumbai', 'maharashtra', 'education', 'Need School Books for Rural Children', 'Our village school lacks basic textbooks and learning materials for 50+ children. We are seeking support to provide quality education resources.', true),
('Rajesh Kumar', 'rajesh@example.com', 'Delhi', 'delhi', 'health', 'Medical Support for Elderly Care', 'Our community needs a mobile health clinic to serve elderly residents who cannot travel to distant hospitals for regular check-ups.', true),
('Sunita Devi', 'sunita@example.com', 'Bangalore', 'karnataka', 'livelihood', 'Women Skill Development Program', 'Looking for support to start a tailoring and handicrafts training center for women in our community to promote self-employment.', false);
