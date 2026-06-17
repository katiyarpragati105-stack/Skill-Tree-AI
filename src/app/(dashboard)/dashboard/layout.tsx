'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TreeDeciduous, Calendar, FolderKanban,
  FileText, MessageSquare, Briefcase, Trophy, Settings,
  LogOut, ChevronLeft, ChevronRight, Bell, Search,
  Sparkles, Moon, Sun, Monitor, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Skill Tree', icon: TreeDeciduous, path: '/dashboard/skills' },
  { name: 'Roadmap', icon: Calendar, path: '/dashboard/roadmap' },
  { name: 'Projects', icon: FolderKanban, path: '/dashboard/projects' },
  { name: 'Resume', icon: FileText, path: '/dashboard/resume' },
  { name: 'Interview', icon: MessageSquare, path: '/dashboard/interview' },
  { name: 'Internships', icon: Briefcase, path: '/dashboard/internships' },
  { name: 'Achievements', icon: Trophy, path: '/dashboard/achievements' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMentor, setShowMentor] = useState(false)
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        className="bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-bold text-white whitespace-nowrap">SkillTree AI</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>

        {/* User profile & collapse */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>

          {user && (
            <div className={`flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-slate-900 flex-shrink-0">
                {profile?.name?.charAt(0) || 'U'}
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden flex-1"
                  >
                    <p className="text-sm font-medium text-white truncate">{profile?.name}</p>
                    <p className="text-xs text-slate-400">Level {profile?.level || 1}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-slate-800/30 backdrop-blur border-b border-slate-700/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search skills, projects..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Mentor Button */}
            <button
              onClick={() => setShowMentor(!showMentor)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showMentor
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">AI Mentor</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Theme toggle */}
            <button className="p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white transition-colors">
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Main content */}
            <div className={`flex-1 p-6 transition-all ${showMentor ? 'pr-96' : ''}`}>
              {children}
            </div>

            {/* AI Mentor Panel */}
            <AnimatePresence>
              {showMentor && (
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  className="w-96 bg-slate-800/50 backdrop-blur-xl border-l border-slate-700/50 flex flex-col fixed right-0 top-16 bottom-0"
                >
                  <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-slate-900" />
                      </div>
                      <span className="font-semibold text-white">AI Career Mentor</span>
                    </div>
                    <button onClick={() => setShowMentor(false)} className="text-slate-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <p className="text-slate-300 text-sm">
                        Hi {profile?.name?.split(' ')[0] || 'there'}! I&apos;m your AI career mentor. Based on your profile as a {profile?.year || ''} year {profile?.branch || 'student'} aiming to be a {profile?.goal || 'developer'}, here are my top suggestions:
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                          <p className="text-emerald-400 text-sm font-medium">Focus Area</p>
                          <p className="text-slate-300 text-sm mt-1">Build strong fundamentals in Data Structures & Algorithms</p>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                          <p className="text-cyan-400 text-sm font-medium">This Week</p>
                          <p className="text-slate-300 text-sm mt-1">Complete JavaScript basics and start React tutorials</p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                          <p className="text-amber-400 text-sm font-medium">Quick Tip</p>
                          <p className="text-slate-300 text-sm mt-1">Practice coding for 1-2 hours daily on LeetCode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700/50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                      <button className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
                        <Sparkles className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Notifications Panel (Overlay) */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-6 top-20 w-80 bg-slate-800 backdrop-blur-xl rounded-2xl border border-slate-700 p-4 z-50 shadow-xl"
            >
              <h3 className="font-semibold text-white mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-white">New achievement unlocked!</p>
                      <p className="text-xs text-slate-400 mt-1">Skill Explorer - 25 XP earned</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-white">Don&apos;t break your streak!</p>
                      <p className="text-xs text-slate-400 mt-1">3 days remaining to complete today&apos;s goal</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-white">AI Suggestion</p>
                      <p className="text-xs text-slate-400 mt-1">Try this project: To-Do App with React</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
