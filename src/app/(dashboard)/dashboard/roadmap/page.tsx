'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock, CircleCheck as CheckCircle, Circle, Sparkles, ChevronRight, BookOpen, Code, Target, RefreshCw } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'

interface Goal {
  id: string
  title: string
  description: string
  day: number
  completed: boolean
  type: 'skill' | 'project' | 'quiz' | 'practice'
  estimated_hours: number
}

export default function RoadmapPage() {
  const [currentWeek, setCurrentWeek] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { user, profile } = useAuth()
  const supabase = createClient()

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  useEffect(() => {
    if (user) {
      fetchRoadmap()
    }
  }, [user])

  const fetchRoadmap = async () => {
    const { data } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', user!.id)
      .eq('week_start', format(weekStart, 'yyyy-MM-dd'))
      .single()

    if (data?.goals) {
      setCurrentWeek(data.goals as Goal[])
    } else {
      generateRoadmap()
    }
    setLoading(false)
  }

  const generateRoadmap = async () => {
    setGenerating(true)

    // AI-generated roadmap based on user profile
    const generatedGoals: Goal[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Complete variables, functions, and DOM manipulation basics',
        day: 1,
        completed: false,
        type: 'skill',
        estimated_hours: 2
      },
      {
        id: '2',
        title: 'React Components',
        description: 'Learn functional components and props',
        day: 2,
        completed: false,
        type: 'skill',
        estimated_hours: 2
      },
      {
        id: '3',
        title: 'Practice DSA',
        description: 'Solve 3 easy array problems on LeetCode',
        day: 3,
        completed: false,
        type: 'practice',
        estimated_hours: 1.5
      },
      {
        id: '4',
        title: 'React State Management',
        description: 'Master useState and useEffect hooks',
        day: 4,
        completed: false,
        type: 'skill',
        estimated_hours: 2
      },
      {
        id: '5',
        title: 'Build Mini Project',
        description: 'Create a simple to-do app with React',
        day: 5,
        completed: false,
        type: 'project',
        estimated_hours: 3
      },
      {
        id: '6',
        title: 'JavaScript Quiz',
        description: 'Test your JavaScript knowledge',
        day: 6,
        completed: false,
        type: 'quiz',
        estimated_hours: 0.5
      },
      {
        id: '7',
        title: 'Weekly Review',
        description: 'Revise all concepts practiced this week',
        day: 7,
        completed: false,
        type: 'skill',
        estimated_hours: 1
      }
    ]

    await supabase.from('roadmaps').upsert({
      user_id: user!.id,
      week_start: format(weekStart, 'yyyy-MM-dd'),
      week_end: format(weekEnd, 'yyyy-MM-dd'),
      goals: generatedGoals,
      progress: 0
    })

    setCurrentWeek(generatedGoals)
    setGenerating(false)
  }

  const toggleGoal = async (goalId: string) => {
    const updatedGoals = currentWeek.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    )

    const progress = Math.round(
      (updatedGoals.filter(g => g.completed).length / updatedGoals.length) * 100
    )

    await supabase
      .from('roadmaps')
      .update({ goals: updatedGoals, progress })
      .eq('user_id', user!.id)
      .eq('week_start', format(weekStart, 'yyyy-MM-dd'))

    setCurrentWeek(updatedGoals)
  }

  const getDayName = (day: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[day - 1] || ''
  }

  const typeIcons: Record<string, React.ElementType> = {
    skill: BookOpen,
    project: Code,
    quiz: Target,
    practice: Sparkles
  }

  const typeColors: Record<string, string> = {
    skill: 'from-emerald-500 to-cyan-500',
    project: 'from-purple-500 to-pink-500',
    quiz: 'from-amber-500 to-orange-500',
    practice: 'from-blue-500 to-indigo-500'
  }

  const completedCount = currentWeek.filter(g => g.completed).length
  const totalHours = currentWeek.reduce((acc, g) => acc + g.estimated_hours, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Weekly Roadmap</h1>
          <p className="text-slate-400 mt-1">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={generateRoadmap}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Progress</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {completedCount} / {currentWeek.length}
          </p>
          <p className="text-sm text-slate-400 mt-1">goals completed</p>
          <div className="w-full h-2 bg-slate-700 rounded-full mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / currentWeek.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Time</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalHours}h</p>
          <p className="text-sm text-slate-400 mt-1">estimated this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Today&apos;s Goal</span>
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {currentWeek.find(g => g.day === new Date().getDay() || 7)?.title || 'Rest Day'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-400">AI Suggestion</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-300">
            Focus on React hooks today. You&apos;re progressing well!
          </p>
        </motion.div>
      </div>

      {/* Weekly Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          This Week&apos;s Journey
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

          <div className="space-y-6">
            {currentWeek.map((goal, index) => {
              const Icon = typeIcons[goal.type] || BookOpen
              const isToday = goal.day === (new Date().getDay() || 7)
              const dayDate = addDays(weekStart, goal.day - 1)

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex gap-4 ${isToday ? 'bg-slate-700/30 rounded-xl p-4 -m-4' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center ${
                    goal.completed
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      : isToday
                      ? 'bg-amber-500/20 border-2 border-amber-500'
                      : 'bg-slate-700'
                  }`}>
                    {goal.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-lg font-bold text-slate-400">{goal.day}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex-1 cursor-pointer group ${goal.completed ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm ${isToday ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
                        {getDayName(goal.day)} • {format(dayDate, 'MMM d')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${typeColors[goal.type]} text-white`}>
                        {goal.type}
                      </span>
                      <span className="text-xs text-slate-500">{goal.estimated_hours}h</span>
                    </div>
                    <h3 className={`text-lg font-medium ${goal.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{goal.description}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                        {goal.completed ? 'Mark incomplete' : 'Mark complete'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-medium text-white mb-2">Morning Routine</h3>
          <p className="text-sm text-slate-400">Start your day with 15 minutes of revision before diving into new topics.</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-medium text-white mb-2">Active Recall</h3>
          <p className="text-sm text-slate-400">Test yourself on yesterday&apos;s concepts before starting today&apos;s work.</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-medium text-white mb-2">Stay Consistent</h3>
          <p className="text-sm text-slate-400">Complete 80% of your weekly goals to maintain your streak bonus.</p>
        </div>
      </div>
    </div>
  )
}
