'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, GraduationCap, Target, Code, Sparkles, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const steps = [
  { id: 'year', title: 'What year are you in?', icon: GraduationCap },
  { id: 'branch', title: 'What\'s your field of study?', icon: Code },
  { id: 'goal', title: 'What\'s your primary career goal?', icon: Target },
  { id: 'skills', title: 'Which skills interest you?', icon: Sparkles },
]

const yearOptions = ['1st', '2nd', '3rd', 'final']
const branchOptions = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Data Science',
  'AI/ML',
  'Cybersecurity',
  'Other'
]
const goalOptions = [
  'Software Developer',
  'Data Scientist',
  'ML Engineer',
  'Product Manager',
  'DevOps Engineer',
  'Security Analyst',
  'Full Stack Developer',
  'Mobile Developer',
  'Entrepreneur',
  'Research Scientist'
]
const skillOptions = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'SQL', 'Machine Learning', 'Cloud Computing', 'DevOps',
  'System Design', 'Data Structures', 'Algorithms', 'Git'
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    goal: '',
    skills: [] as string[]
  })
  const { user, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        year: formData.year as '1st' | '2nd' | '3rd' | 'final',
        branch: formData.branch,
        goal: formData.goal,
        onboarding_completed: true,
        xp: 50 // Bonus XP for completing onboarding
      })
      .eq('id', user.id)

    if (!error) {
      // Initialize user skills based on interests
      const { data: skills } = await supabase
        .from('skills')
        .select('id, name')

      if (skills) {
        const userSkills = skills
          .filter(s => formData.skills.includes(s.name))
          .map(s => ({
            user_id: user.id,
            skill_id: s.id,
            status: 'available' as const
          }))

        if (userSkills.length > 0) {
          await supabase.from('user_skills').insert(userSkills)
        }
      }

      // Award first achievement
      const { data: achievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', 'First Steps')
        .single()

      if (achievement) {
        await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_id: achievement.id
        })
      }

      // Create welcome notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Welcome to SkillTree AI!',
        message: 'Your personalized learning journey begins now. Explore your dashboard to see your custom roadmap.',
        type: 'suggestion'
      })

      await refreshProfile()
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.year !== ''
      case 1: return formData.branch !== ''
      case 2: return formData.goal !== ''
      case 3: return formData.skills.length >= 2
      default: return false
    }
  }

  const Icon = steps[currentStep].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    : 'bg-slate-700'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className="w-5 h-5 text-white" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
              </div>

              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      onClick={() => setFormData(prev => ({ ...prev, year }))}
                      className={`p-6 rounded-xl border transition-all ${
                        formData.year === year
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900/50 border-slate-700 text-white hover:border-slate-500'
                      }`}
                    >
                      <span className="text-lg font-semibold">{year} Year</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {branchOptions.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => setFormData(prev => ({ ...prev, branch }))}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        formData.branch === branch
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900/50 border-slate-700 text-white hover:border-slate-500'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {goalOptions.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setFormData(prev => ({ ...prev, goal }))}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        formData.goal === goal
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900/50 border-slate-700 text-white hover:border-slate-500'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <p className="text-slate-400 mb-4">Select at least 2 skills you want to learn</p>
                  <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                          formData.skills.includes(skill)
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900/50 border-slate-700 text-white hover:border-slate-500'
                        }`}
                      >
                        {formData.skills.includes(skill) && <Check className="w-4 h-4" />}
                        <span className="text-sm">{skill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
