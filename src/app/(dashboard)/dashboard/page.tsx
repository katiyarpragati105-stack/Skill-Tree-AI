'use client'

import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Flame, Zap, BookOpen, Award, Clock, ArrowUpRight, Play, Calendar, FileText, Briefcase, Trophy } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import Link from 'next/link'

const weeklyData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3.5 },
  { day: 'Wed', hours: 2.5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 3 },
  { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 2 },
]

const skillProgress = [
  { name: 'JavaScript', level: 75 },
  { name: 'React', level: 45 },
  { name: 'Python', level: 30 },
  { name: 'Node.js', level: 20 },
]

const quickActions = [
  { name: 'Start Interview', icon: Play, href: '/dashboard/interview', color: 'from-purple-500 to-pink-500' },
  { name: 'Generate Roadmap', icon: Calendar, href: '/dashboard/roadmap', color: 'from-emerald-500 to-cyan-500' },
  { name: 'Build Resume', icon: FileText, href: '/dashboard/resume', color: 'from-amber-500 to-orange-500' },
  { name: 'Track Internship', icon: Briefcase, href: '/dashboard/internships', color: 'from-blue-500 to-indigo-500' },
]

export default function DashboardPage() {
  const { profile } = useAuth()

  const xpToNextLevel = ((profile?.level || 1) * 100) - (profile?.xp || 0)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Good {getTimeOfDay()}, {profile?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-400 mt-1">
            {profile?.goal ? `Your goal: ${profile.goal}` : 'Set your career goal to get personalized recommendations'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Current Streak</p>
            <p className="text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              {profile?.current_streak || 0} days
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Career Score"
          value={profile?.career_score || 0}
          suffix="/100"
          icon={Target}
          trend="+12 this week"
          color="text-emerald-400"
        />
        <StatCard
          title="Total XP"
          value={profile?.xp || 0}
          suffix={` XP`}
          icon={Zap}
          trend={`${xpToNextLevel} to next level`}
          color="text-amber-400"
        />
        <StatCard
          title="Skills Learned"
          value={12}
          suffix=""
          icon={BookOpen}
          trend="3 in progress"
          color="text-cyan-400"
        />
        <StatCard
          title="Achievements"
          value={5}
          suffix={` badges`}
          icon={Award}
          trend="2 new unlocked"
          color="text-purple-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 spans */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Career Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  AI Career Overview
                </h2>
                <p className="text-sm text-slate-400 mt-1">Your personalized career health report</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                On Track
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-sm text-slate-400">Placement Readiness</p>
                <p className="text-3xl font-bold text-white mt-2">68%</p>
                <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                  <div className="w-[68%] h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-sm text-slate-400">Predicted Salary</p>
                <p className="text-3xl font-bold text-white mt-2">8-12L</p>
                <p className="text-xs text-slate-500 mt-1">Based on current skills</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-sm text-slate-400">Skill Gaps</p>
                <p className="text-3xl font-bold text-white mt-2">4</p>
                <p className="text-xs text-amber-400 mt-1">Critical: System Design</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/roadmap" className="flex-1 py-2 text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Generate Weekly Roadmap
              </Link>
              <Link href="/dashboard/interview" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4" />
                Quick Interview
              </Link>
            </div>
          </motion.div>

          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Weekly Activity</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">Hours</button>
                <button className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                  XP
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Skill Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Skill Progress</h2>
              <Link href="/dashboard/skills" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {skillProgress.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-slate-300">{skill.name}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 w-12 text-right">{skill.level}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Level Progress</h3>
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: ((profile?.xp || 0) % 100) }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill="url(#levelGradient)"
                    />
                    <defs>
                      <linearGradient id="levelGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-white">{profile?.level || 1}</span>
                  <span className="text-sm text-slate-400">Level</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-4">
              {xpToNextLevel} XP to Level {(profile?.level || 1) + 1}
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-white">{action.name}</p>
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Badges</h3>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-slate-900/50 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-slate-300">Week Warrior</p>
              </div>
              <div className="flex-1 p-3 bg-slate-900/50 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-slate-300">Skill Explorer</p>
              </div>
              <div className="flex-1 p-3 bg-slate-900/50 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-slate-300">Fast Learner</p>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Upcoming Tasks
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-white">Complete React Quiz</p>
                  <p className="text-xs text-slate-400">Due today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-white">Practice DSA problems</p>
                  <p className="text-xs text-slate-400">Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-white">Update resume</p>
                  <p className="text-xs text-slate-400">In 3 days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, suffix, icon: Icon, trend, color }: {
  title: string
  value: number
  suffix: string
  icon: React.ElementType
  trend: string
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{title}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">
        {value}
        <span className="text-lg text-slate-400">{suffix}</span>
      </p>
      <p className="text-xs text-slate-500 mt-1">{trend}</p>
    </motion.div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
