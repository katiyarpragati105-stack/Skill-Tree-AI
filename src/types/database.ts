export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          year: '1st' | '2nd' | '3rd' | 'final' | null
          branch: string | null
          goal: string | null
          avatar_url: string | null
          career_score: number
          xp: number
          level: number
          current_streak: number
          max_streak: number
          last_activity_date: string | null
          difficulty_mode: 'beginner' | 'balanced' | 'advanced'
          theme: 'light' | 'dark' | 'system'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          year?: '1st' | '2nd' | '3rd' | 'final' | null
          branch?: string | null
          goal?: string | null
          avatar_url?: string | null
          career_score?: number
          xp?: number
          level?: number
          current_streak?: number
          max_streak?: number
          last_activity_date?: string | null
          difficulty_mode?: 'beginner' | 'balanced' | 'advanced'
          theme?: 'light' | 'dark' | 'system'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          year?: '1st' | '2nd' | '3rd' | 'final' | null
          branch?: string | null
          goal?: string | null
          avatar_url?: string | null
          career_score?: number
          xp?: number
          level?: number
          current_streak?: number
          max_streak?: number
          last_activity_date?: string | null
          difficulty_mode?: 'beginner' | 'balanced' | 'advanced'
          theme?: 'light' | 'dark' | 'system'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          icon_name: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          prerequisites: string[] | null
          resources: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          icon_name?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          prerequisites?: string[] | null
          resources?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          icon_name?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          prerequisites?: string[] | null
          resources?: Json
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          level: number
          status: 'locked' | 'available' | 'in_progress' | 'completed'
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          level?: number
          status?: 'locked' | 'available' | 'in_progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          level?: number
          status?: 'locked' | 'available' | 'in_progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          tech_stack: string[]
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          status: 'idea' | 'in_progress' | 'completed' | 'on_hold'
          progress: number
          ai_suggested: boolean
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          tech_stack?: string[]
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          status?: 'idea' | 'in_progress' | 'completed' | 'on_hold'
          progress?: number
          ai_suggested?: boolean
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          tech_stack?: string[]
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          status?: 'idea' | 'in_progress' | 'completed' | 'on_hold'
          progress?: number
          ai_suggested?: boolean
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      internships: {
        Row: {
          id: string
          user_id: string
          company: string
          role: string
          status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted'
          application_date: string | null
          notes: string | null
          url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          role: string
          status?: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted'
          application_date?: string | null
          notes?: string | null
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          role?: string
          status?: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted'
          application_date?: string | null
          notes?: string | null
          url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_name: string
          category: string | null
          xp_reward: number
          requirement_type: string | null
          requirement_value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_name: string
          category?: string | null
          xp_reward?: number
          requirement_type?: string | null
          requirement_value?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_name?: string
          category?: string | null
          xp_reward?: number
          requirement_type?: string | null
          requirement_value?: number | null
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      roadmaps: {
        Row: {
          id: string
          user_id: string
          week_start: string
          week_end: string
          goals: Json
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          week_end: string
          goals?: Json
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          week_end?: string
          goals?: Json
          progress?: number
          created_at?: string
        }
      }
      mock_interviews: {
        Row: {
          id: string
          user_id: string
          type: 'technical' | 'behavioral' | 'mixed'
          questions: Json
          answers: Json
          score: number | null
          feedback: Json | null
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'technical' | 'behavioral' | 'mixed'
          questions: Json
          answers?: Json
          score?: number | null
          feedback?: Json | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'technical' | 'behavioral' | 'mixed'
          questions?: Json
          answers?: Json
          score?: number | null
          feedback?: Json | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          completed_at?: string | null
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json
          ats_score: number | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content: Json
          ats_score?: number | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json
          ats_score?: number | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string | null
          type: 'reminder' | 'achievement' | 'streak' | 'suggestion' | 'alert'
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message?: string | null
          type: 'reminder' | 'achievement' | 'streak' | 'suggestion' | 'alert'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string | null
          type?: 'reminder' | 'achievement' | 'streak' | 'suggestion' | 'alert'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          skill_id: string | null
          questions: Json
          answers: Json
          score: number
          passed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id?: string | null
          questions: Json
          answers: Json
          score: number
          passed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string | null
          questions?: Json
          answers?: Json
          score?: number
          passed?: boolean
          created_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type UserSkill = Database['public']['Tables']['user_skills']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Internship = Database['public']['Tables']['internships']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type Roadmap = Database['public']['Tables']['roadmaps']['Row']
export type MockInterview = Database['public']['Tables']['mock_interviews']['Row']
export type Resume = Database['public']['Tables']['resumes']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type QuizResult = Database['public']['Tables']['quiz_results']['Row']
export type ChatMessage = Database['public']['Tables']['chat_history']['Row']
