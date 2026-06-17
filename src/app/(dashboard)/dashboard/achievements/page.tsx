'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Achievement, UserAchievement } from '@/types/database'
import { Trophy, Zap, Flame, Star, Sunrise, Moon, Compass, Award, FileText, MessageSquare, Lock, Unlock } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  'user-check': Award,
  'compass': Compass,
  'award': Trophy,
  'folder': FileText,
  'flame': Flame,
  'star': Star,
  'message-square': MessageSquare,
  'file-text': FileText,
  'sunrise': Sunrise,
  'moon': Moon,
}

const categoryColors: Record<string, string> = {
  onboarding: 'from-emerald-500 to-cyan-500',
  learning: 'from-blue-500 to-indigo-500',
  projects: 'from-purple-500 to-pink-500',
  streak: 'from-amber-500 to-orange-500',
  progression: 'from-emerald-500 to-teal-500',
  career: 'from-cyan-500 to-blue-500',
  activity: 'from-rose-500 to-pink-500',
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<(Achievement & { earned?: boolean; earnedAt?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) fetchAchievements()
  }, [user])

  const fetchAchievements = async () => {
    const { data: allAchievements } = await supabase.from('achievements').select('*')
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user!.id)

    const merged = allAchievements?.map(a => {
      const earned = userAchievements?.find(ua => ua.achievement_id === a.id)
      return {
        ...a,
        earned: !!earned,
        earnedAt: earned?.earned_at
      }
    }) || []

    setAchievements(merged)
    setLoading(false)
  }

  const earnedCount = achievements.filter(a => a.earned).length
  const totalXP = achievements
    .filter(a => a.earned)
    .reduce((acc, a) => acc + (a.xp_reward || 0), 0)

  const grouped = achievements.reduce((acc, achievement) => {
    const cat = achievement.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(achievement)
    return acc
  }, {} as Record<string, typeof achievements>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
          <p className="text-slate-400 mt-1">Track your milestones and earn badges</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-400">Badges Earned</p>
              <p className="text-3xl font-bold text-white">{earnedCount} / {achievements.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-400">XP from Achievements</p>
              <p className="text-3xl font-bold text-white">{totalXP} XP</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Completion</span>
            <span className="text-sm text-slate-400">{Math.round((earnedCount / achievements.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / achievements.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">{achievements.length - earnedCount} badges to unlock</p>
        </motion.div>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, categoryAchievements], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 capitalize flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[category] || 'from-slate-500 to-slate-600'} flex items-center justify-center`}>
                <Trophy className="w-4 h-4 text-white" />
              </div>
              {category}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categoryAchievements.map((achievement, index) => {
                const Icon = iconMap[achievement.icon_name] || Trophy
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-6 rounded-2xl border transition-all ${
                      achievement.earned
                        ? 'bg-slate-800/50 border-slate-700/50'
                        : 'bg-slate-900/30 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`relative mb-3 ${achievement.earned ? '' : 'opacity-30'}`}>
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${achievement.earned ? (categoryColors[category] || 'from-emerald-500 to-cyan-500') : 'from-slate-700 to-slate-800'} flex items-center justify-center`}>
                          {achievement.earned ? (
                            <Unlock className="w-6 h-6 text-white absolute -top-1 -right-1" />
                          ) : (
                            <Lock className="w-6 h-6 text-slate-500" />
                          )}
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        {achievement.earned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                          >
                            <Zap className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>

                      <h3 className={`font-medium mb-1 ${achievement.earned ? 'text-white' : 'text-slate-500'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-2">{achievement.description}</p>

                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        achievement.earned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'
                      }`}>
                        +{achievement.xp_reward} XP
                      </span>

                      {achievement.earned && achievement.earnedAt && (
                        <p className="text-xs text-slate-500 mt-2">
                          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievement Toast */}
      {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 left-4 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl flex items-center gap-3 z-40"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">New Badge!</p>
            <p className="text-xs text-slate-400">{achievement.name} earned</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
