-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  year TEXT CHECK (year IN ('1st', '2nd', '3rd', 'final')),
  branch TEXT,
  goal TEXT,
  avatar_url TEXT,
  career_score INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  difficulty_mode TEXT DEFAULT 'balanced' CHECK (difficulty_mode IN ('beginner', 'balanced', 'advanced')),
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills master table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prerequisites UUID[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skills progress
CREATE TABLE user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

-- Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'in_progress', 'completed', 'on_hold')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  ai_suggested BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internship applications
CREATE TABLE internships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted')),
  application_date DATE,
  notes TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements (badges)
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT NOT NULL,
  category TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Weekly roadmaps
CREATE TABLE roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  goals JSONB DEFAULT '[]',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Mock interviews
CREATE TABLE mock_interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'behavioral', 'mixed')),
  questions JSONB NOT NULL,
  answers JSONB DEFAULT '[]',
  score INTEGER,
  feedback JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Resume data
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'My Resume',
  content JSONB NOT NULL,
  ats_score INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'achievement', 'streak', 'suggestion', 'alert')),
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz results
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat history
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for user_skills
CREATE POLICY "select_own_user_skills" ON user_skills FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_user_skills" ON user_skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_user_skills" ON user_skills FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_user_skills" ON user_skills FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "select_own_projects" ON projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_projects" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_projects" ON projects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_projects" ON projects FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for internships
CREATE POLICY "select_own_internships" ON internships FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_internships" ON internships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_internships" ON internships FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_internships" ON internships FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "select_own_user_achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_user_achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for roadmaps
CREATE POLICY "select_own_roadmaps" ON roadmaps FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_roadmaps" ON roadmaps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_roadmaps" ON roadmaps FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mock_interviews
CREATE POLICY "select_own_mock_interviews" ON mock_interviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_mock_interviews" ON mock_interviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_mock_interviews" ON mock_interviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_results
CREATE POLICY "select_own_quiz_results" ON quiz_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_quiz_results" ON quiz_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "select_own_chat_history" ON chat_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_chat_history" ON chat_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_chat_history" ON chat_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Skills are publicly readable
CREATE POLICY "select_skills" ON skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_achievements" ON achievements FOR SELECT TO authenticated USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email_split_part('@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default skills
INSERT INTO skills (name, category, description, icon_name, difficulty, resources) VALUES
('JavaScript', 'Programming', 'Core language for web development', 'code', 'beginner', '[{"type": "video", "url": "https://youtube.com", "title": "JavaScript Basics"}, {"type": "article", "url": "https://developer.mozilla.org", "title": "MDN JavaScript Guide"}]'),
('React', 'Frontend', 'Modern UI library for building user interfaces', 'layout', 'intermediate', '[{"type": "video", "url": "https://youtube.com", "title": "React Course"}]'),
('Python', 'Programming', 'Versatile language for data science and backend', 'code', 'beginner', '[]'),
('Node.js', 'Backend', 'JavaScript runtime for server-side development', 'server', 'intermediate', '[]'),
('TypeScript', 'Programming', 'Typed superset of JavaScript', 'code', 'intermediate', '[]'),
('SQL', 'Database', 'Database query language', 'database', 'beginner', '[]'),
('Git', 'Tools', 'Version control system', 'git-branch', 'beginner', '[]'),
('Data Structures', 'CS Fundamentals', 'Core computer science concepts', 'layers', 'beginner', '[]'),
('Algorithms', 'CS Fundamentals', 'Problem-solving techniques', 'cpu', 'intermediate', '[]'),
('System Design', 'Architecture', 'Designing scalable systems', 'network', 'advanced', '[]');

-- Insert default achievements
INSERT INTO achievements (name, description, icon_name, category, xp_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your profile setup', 'user-check', 'onboarding', 50, 'profile_complete', 1),
('Skill Explorer', 'Start learning your first skill', 'compass', 'learning', 25, 'skills_started', 1),
('Skill Master', 'Complete a skill to 100%', 'award', 'learning', 100, 'skills_completed', 1),
('Project Builder', 'Complete your first project', 'folder', 'projects', 150, 'projects_completed', 1),
('Week Warrior', 'Maintain a 7-day streak', 'flame', 'streak', 200, 'streak_days', 7),
('Rising Star', 'Reach level 5', 'star', 'progression', 300, 'level', 5),
('Interview Ready', 'Complete a mock interview', 'message-square', 'career', 75, 'interviews_completed', 1),
('Resume Pro', 'Create your first resume', 'file-text', 'career', 50, 'resumes_created', 1),
('Early Bird', 'Log in before 8 AM', 'sunrise', 'activity', 25, 'early_login', 1),
('Night Owl', 'Study after 10 PM', 'moon', 'activity', 25, 'late_study', 1);
