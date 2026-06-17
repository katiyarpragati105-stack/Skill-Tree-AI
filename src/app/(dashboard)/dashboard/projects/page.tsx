'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/types/database'
import { FolderKanban, Plus, Sparkles, ExternalLink, Clock, CheckCircle, Pause, Lightbulb, X, Code, Trash2 } from 'lucide-react'

const statusConfig = {
  idea: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: Lightbulb },
  in_progress: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  completed: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  on_hold: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: Pause },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech_stack: [] as string[],
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  })
  const [techInput, setTechInput] = useState('')
  const { user, profile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) fetchProjects()
  }, [user])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const createProject = async () => {
    await supabase.from('projects').insert({
      user_id: user!.id,
      title: newProject.title,
      description: newProject.description,
      tech_stack: newProject.tech_stack,
      difficulty: newProject.difficulty,
      status: 'idea'
    })
    setShowModal(false)
    setNewProject({ title: '', description: '', tech_stack: [], difficulty: 'beginner' })
    fetchProjects()
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  const updateStatus = async (id: string, status: Project['status']) => {
    const updates: Partial<Project> = { status }
    if (status === 'in_progress') updates.started_at = new Date().toISOString()
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString()
      updates.progress = 100
    }
    await supabase.from('projects').update(updates).eq('id', id)
    fetchProjects()
  }

  const getAiSuggestions = () => {
    setAiSuggesting(true)
    // Simulated AI suggestions based on profile
    setTimeout(() => {
      const suggestions = [
        { title: 'E-Commerce Dashboard', description: 'Build a full-stack e-commerce admin dashboard with React and Node.js', tech_stack: ['React', 'Node.js', 'MongoDB'], difficulty: 'intermediate' as const },
        { title: 'Weather App', description: 'Create a weather application with location-based forecasts', tech_stack: ['React', 'API'], difficulty: 'beginner' as const },
        { title: 'Task Manager', description: 'Build a Kanban-style task management app', tech_stack: ['React', 'Supabase'], difficulty: 'beginner' as const }
      ]
      setProjects(prev => [...prev.map(p => ({ ...p, ai_suggested: false })), ...suggestions.map(s => ({
        id: `ai-${Date.now()}-${Math.random()}`,
        user_id: user!.id,
        ...s,
        status: 'idea' as const,
        progress: 0,
        ai_suggested: true,
        started_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as Project[]])
      setAiSuggesting(false)
    }, 1500)
  }

  const addTech = () => {
    if (techInput && !newProject.tech_stack.includes(techInput)) {
      setNewProject(prev => ({ ...prev, tech_stack: [...prev.tech_stack, techInput] }))
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setNewProject(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(t => t !== tech) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Workspace</h1>
          <p className="text-slate-400 mt-1">Track, build, and showcase your projects</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={getAiSuggestions}
            disabled={aiSuggesting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
          >
            <Sparkles className={`w-4 h-4 ${aiSuggesting ? 'animate-pulse' : ''}`} />
            AI Suggest
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'idea', 'in_progress', 'completed', 'on_hold'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors capitalize"
          >
            {filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => {
          const config = statusConfig[project.status]
          const StatusIcon = config.icon
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs border ${config.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {project.status.replace('_', ' ')}
                  </span>
                  {project.ai_suggested && (
                    <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>

              {project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {project.difficulty && (
                <span className={`text-xs px-2 py-1 rounded ${
                  project.difficulty === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                  project.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {project.difficulty}
                </span>
              )}

              {project.status === 'in_progress' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                <select
                  value={project.status}
                  onChange={(e) => updateStatus(project.id, e.target.value as Project['status'])}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                >
                  <option value="idea">Idea</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
                <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Project</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Project Title</label>
                  <input
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none resize-none h-24"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tech Stack</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTech()}
                      className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="Add technology..."
                    />
                    <button onClick={addTech} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button onClick={() => removeTech(tech)} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Difficulty</label>
                  <div className="flex gap-3">
                    {['beginner', 'intermediate', 'advanced'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setNewProject(prev => ({ ...prev, difficulty: diff as typeof newProject.difficulty }))}
                        className={`flex-1 py-2 rounded-xl capitalize transition-all ${
                          newProject.difficulty === diff
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={createProject}
                disabled={!newProject.title}
                className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create Project
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
