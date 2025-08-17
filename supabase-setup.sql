-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'health', 'livelihood', 'infrastructure', 'other')),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ngos table
CREATE TABLE IF NOT EXISTS ngos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  focus_areas TEXT[] NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_state ON stories(state);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ngos_focus_areas ON ngos USING GIN(focus_areas);
CREATE INDEX IF NOT EXISTS idx_ngos_state ON ngos(state);
CREATE INDEX IF NOT EXISTS idx_ngos_verified ON ngos(verified);

-- Enable Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to approved stories" ON stories
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public read access to verified ngos" ON ngos
  FOR SELECT USING (verified = true);

-- Create policies for insert (anyone can submit)
CREATE POLICY "Allow public insert to stories" ON stories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to ngos" ON ngos
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ngos_updated_at BEFORE UPDATE ON ngos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
