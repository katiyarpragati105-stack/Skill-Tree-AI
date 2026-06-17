'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Settings, User, Bell, Palette, Shield, HelpCircle, Moon, Sun, Monitor, Check } from 'lucide-react'

export default function SettingsPage() {
  const { profile, user, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    branch: profile?.branch || '',
    goal: profile?.goal || '',
    difficulty_mode: profile?.difficulty_mode || 'balanced',
    theme: profile?.theme || 'system'
  })
  const [notifications, setNotifications] = useState({
    daily_reminders: true,
    streak_warnings: true,
    achievement_alerts: true,
    weekly_reports: true,
    new_features: false
  })
  const supabase = createClient()

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'difficulty', label: 'Difficulty Mode', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ]

  const saveProfile = async () => {
    setLoading(true)
    await supabase
      .from('profiles')
      .update({
        name: formData.name,
        branch: formData.branch,
        goal: formData.goal,
        difficulty_mode: formData.difficulty_mode,
        theme: formData.theme
      })
      .eq('id', user!.id)
    await refreshProfile()
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Profile Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-3xl font-bold text-slate-900">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                    <input
                      value={formData.email}
                      disabled
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Branch</label>
                    <input
                      value={formData.branch}
                      onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Year</label>
                    <select
                      value={profile?.year || ''}
                      disabled
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed"
                    >
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="final">Final Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Career Goal</label>
                  <input
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={saveProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'daily_reminders', label: 'Daily Study Reminders', desc: 'Get reminded to complete your daily goals' },
                  { key: 'streak_warnings', label: 'Streak Warnings', desc: 'Alerts when your streak is at risk' },
                  { key: 'achievement_alerts', label: 'Achievement Alerts', desc: 'Notifications when you earn a new badge' },
                  { key: 'weekly_reports', label: 'Weekly Reports', desc: 'AI-generated progress summary every week' },
                  { key: 'new_features', label: 'New Features', desc: 'Updates about new SkillTree features' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev]
                      }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-400" />
                Appearance
              </h2>

              <div>
                <label className="block text-sm text-slate-400 mb-4">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {([
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Monitor },
                  ] as const).map((theme) => {
                    const Icon = theme.icon
                    const isActive = formData.theme === theme.id
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                        className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                          isActive
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                        <span className="font-medium">{theme.label}</span>
                        {isActive && <Check className="w-5 h-5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'difficulty' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                AI Difficulty Mode
              </h2>

              <p className="text-slate-400 mb-6">Adjust how challenging the AI-generated content and questions are.</p>

              <div className="space-y-4">
                {[
                  { id: 'beginner', label: 'Beginner', desc: 'Simpler concepts, more guidance, detailed explanations' },
                  { id: 'balanced', label: 'Balanced', desc: 'Mix of fundamental and intermediate topics' },
                  { id: 'advanced', label: 'Advanced', desc: 'Complex challenges, less hints, real-world scenarios' },
                ].map((mode) => {
                  const isActive = formData.difficulty_mode === mode.id
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setFormData(prev => ({ ...prev, difficulty_mode: mode.id as 'beginner' | 'balanced' | 'advanced' }))}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className={`font-medium ${isActive ? 'text-emerald-400' : 'text-white'}`}>{mode.label}</p>
                        {isActive && <Check className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <p className={`text-sm ${isActive ? 'text-emerald-300' : 'text-slate-400'}`}>{mode.desc}</p>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={saveProfile}
                disabled={loading}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}

          {activeTab === 'help' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                Help & Support
              </h2>

              <div className="space-y-4">
                <a href="#" className="block p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <p className="text-white font-medium">Getting Started Guide</p>
                  <p className="text-sm text-slate-400 mt-1">Learn how to use SkillTree AI effectively</p>
                </a>
                <a href="#" className="block p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <p className="text-white font-medium">FAQ</p>
                  <p className="text-sm text-slate-400 mt-1">Frequently asked questions</p>
                </a>
                <a href="#" className="block p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <p className="text-white font-medium">Contact Support</p>
                  <p className="text-sm text-slate-400 mt-1">Get help from our team</p>
                </a>
                <a href="#" className="block p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <p className="text-white font-medium">Report a Bug</p>
                  <p className="text-sm text-slate-400 mt-1">Help us improve SkillTree</p>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
