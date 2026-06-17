'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Skill, UserSkill } from '@/types/database'
import { Lock, CheckCircle, PlayCircle, Code, Database, Server, Cpu, GitBranch, Network, Layers, Binary } from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  'Programming': Code,
  'Frontend': Layers,
  'Backend': Server,
  'Database': Database,
  'CS Fundamentals': Binary,
  'Tools': GitBranch,
  'Architecture': Network,
}

const statusColors = {
  locked: 'from-slate-600 to-slate-700 border-slate-600',
  available: 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/50',
  in_progress: 'from-amber-500/20 to-orange-500/20 border-amber-500/50',
  completed: 'from-emerald-500 to-cyan-500 border-emerald-400',
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<(Skill & { userSkill?: UserSkill })[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchSkills()
    }
  }, [user])

  const fetchSkills = async () => {
    const { data: allSkills } = await supabase.from('skills').select('*')

    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', user!.id)

    const merged = allSkills?.map(skill => ({
      ...skill,
      userSkill: userSkills?.find(us => us.skill_id === skill.id)
    })) || []

    setSkills(merged)
    setLoading(false)
  }

  const startSkill = async (skillId: string) => {
    const existing = skills.find(s => s.id === skillId && s.userSkill)

    if (existing?.userSkill) {
      await supabase
        .from('user_skills')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', existing.userSkill.id)
    } else {
      await supabase.from('user_skills').insert({
        user_id: user!.id,
        skill_id: skillId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        level: 0
      })
    }

    fetchSkills()
  }

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Skill Tree</h1>
          <p className="text-slate-400 mt-1">Your interactive learning path</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors">
            View Progress
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity">
            AI Suggest Path
          </button>
        </div>
      </div>

      {/* Skill Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-600 to-slate-700" />
          <span className="text-slate-400">Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50" />
          <span className="text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50" />
          <span className="text-slate-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-cyan-500" />
          <span className="text-slate-400">Completed</span>
        </div>
      </div>

      {/* Skill Tree Grid */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, categorySkills]) => {
          const Icon = categoryIcons[category] || Code
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{category}</h2>
                  <p className="text-sm text-slate-400">
                    {categorySkills.filter(s => s.userSkill?.status === 'completed').length} / {categorySkills.length} completed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorySkills.map((skill, index) => {
                  const status = skill.userSkill?.status || (index === 0 ? 'available' : 'locked')
                  const progress = skill.userSkill?.level || 0

                  return (
                    <motion.button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border bg-gradient-to-br ${statusColors[status]} transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center">
                          {status === 'locked' ? (
                            <Lock className="w-5 h-5 text-slate-500" />
                          ) : status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : status === 'in_progress' ? (
                            <PlayCircle className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Code className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        {skill.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            skill.difficulty === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                            skill.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {skill.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-white text-left">{skill.name}</h3>
                      {status === 'in_progress' && (
                        <div className="mt-3">
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{progress}% complete</p>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
                <Code className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{selectedSkill.name}</h2>
                <p className="text-sm text-slate-400">{selectedSkill.category}</p>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 mb-6">{selectedSkill.description}</p>

            {selectedSkill.difficulty && (
              <div className="mb-4">
                <span className="text-sm text-slate-400">Difficulty: </span>
                <span className={`font-medium ${
                  selectedSkill.difficulty === 'beginner' ? 'text-emerald-400' :
                  selectedSkill.difficulty === 'intermediate' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {selectedSkill.difficulty.charAt(0).toUpperCase() + selectedSkill.difficulty.slice(1)}
                </span>
              </div>
            )}

            {/* Resources */}
            {Array.isArray(selectedSkill.resources) && selectedSkill.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Learning Resources</h3>
                <div className="space-y-2">
                  {(selectedSkill.resources as Array<{ type: string; title: string; url: string }>).map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs">
                        {resource.type === 'video' ? '🎬' : resource.type === 'article' ? '📄' : '📚'}
                      </div>
                      <span className="text-sm text-white">{resource.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  startSkill(selectedSkill.id)
                  setSelectedSkill(null)
                }}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Start Learning
              </button>
              <button className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors">
                Take Quiz
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
