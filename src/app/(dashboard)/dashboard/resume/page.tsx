'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Sparkles, Plus, Trash2, Edit3, Eye, CheckCircle, AlertTriangle } from 'lucide-react'

interface ResumeSection {
  id: string
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects'
  content: Record<string, string>
}

export default function ResumePage() {
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: '1',
      type: 'header',
      content: { name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', location: 'Bangalore, India' }
    },
    {
      id: '2',
      type: 'summary',
      content: { text: 'Motivated software developer with expertise in React and Node.js. Passionate about building scalable web applications.' }
    },
    {
      id: '3',
      type: 'education',
      content: { degree: 'B.Tech Computer Science', school: 'XYZ Institute of Technology', year: '2024', gpa: '8.5' }
    },
    {
      id: '4',
      type: 'skills',
      content: { skills: 'JavaScript, React, Node.js, Python, SQL, Git, Docker' }
    }
  ])
  const [selectedSection, setSelectedSection] = useState<ResumeSection | null>(null)
  const [atsScore, setAtsScore] = useState(78)
  const [showPreview, setShowPreview] = useState(false)

  const sectionLabels: Record<string, string> = {
    header: 'Personal Info',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects'
  }

  const missingItems = [
    'Add measurable achievements to experience',
    'Include relevant keywords for job description',
    'Add certifications section'
  ]

  const generateWithAI = () => {
    // Simulate AI generation
    const aiSummary: ResumeSection = {
      id: Date.now().toString(),
      type: 'summary',
      content: {
        text: 'Result-driven software engineering student with hands-on experience in full-stack development. Proven track record of delivering impactful projects using modern web technologies. Strong foundation in data structures, algorithms, and software design principles. Eager to contribute to innovative tech solutions.'
      }
    }
    setSections(prev => prev.map(s => s.type === 'summary' ? aiSummary : s))
  }

  const addSection = (type: ResumeSection['type']) => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      type,
      content: type === 'projects'
        ? { title: '', description: '', tech: '' }
        : type === 'experience'
        ? { company: '', role: '', duration: '', description: '' }
        : { text: '' }
    }
    setSections(prev => [...prev, newSection])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
          <p className="text-slate-400 mt-1">Create ATS-friendly resumes with AI assistance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ATS Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">ATS Score</h3>
            {atsScore >= 70 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={atsScore >= 70 ? '#10b981' : '#f59e0b'}
                  strokeWidth="3"
                  strokeDasharray={`${atsScore}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                {atsScore}%
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-2">Missing items:</p>
              <ul className="space-y-1">
                {missingItems.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <h3 className="font-semibold text-white mb-4">AI Enhancements</h3>
          <div className="space-y-3">
            <button
              onClick={generateWithAI}
              className="w-full p-3 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-left transition-colors flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm text-white">Improve Summary</p>
                <p className="text-xs text-slate-400">AI will rewrite your summary</p>
              </div>
            </button>
            <button className="w-full p-3 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-left transition-colors flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-white">Suggest Keywords</p>
                <p className="text-xs text-slate-400">Add relevant job keywords</p>
              </div>
            </button>
            <button className="w-full p-3 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-left transition-colors flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-white">Optimize for Role</p>
                <p className="text-xs text-slate-400">Target specific job posting</p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section List */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedSection(section)}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 cursor-pointer hover:border-emerald-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                  {sectionLabels[section.type]}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {section.type === 'header' && (
                <div>
                  <p className="text-lg font-semibold text-white">{section.content.name}</p>
                  <p className="text-sm text-slate-400">{section.content.email} • {section.content.phone}</p>
                  <p className="text-sm text-slate-400">{section.content.location}</p>
                </div>
              )}

              {section.type === 'summary' && (
                <p className="text-sm text-slate-300 line-clamp-2">{section.content.text}</p>
              )}

              {section.type === 'education' && (
                <div>
                  <p className="text-white font-medium">{section.content.degree}</p>
                  <p className="text-sm text-slate-400">{section.content.school} • {section.content.year}</p>
                  {section.content.gpa && <p className="text-sm text-slate-400">GPA: {section.content.gpa}</p>}
                </div>
              )}

              {section.type === 'skills' && (
                <div className="flex flex-wrap gap-2">
                  {section.content.skills?.split(',').map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {section.type === 'experience' && (
                <div>
                  <p className="text-white font-medium">{section.content.role}</p>
                  <p className="text-sm text-slate-400">{section.content.company} • {section.content.duration}</p>
                  <p className="text-sm text-slate-300 mt-1 line-clamp-1">{section.content.description}</p>
                </div>
              )}

              {section.type === 'projects' && (
                <div>
                  <p className="text-white font-medium">{section.content.title}</p>
                  <p className="text-sm text-slate-300">{section.content.tech}</p>
                </div>
              )}

              <button className="mt-3 text-sm text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            </motion.div>
          ))}

          {/* Add Section */}
          <div className="flex flex-wrap gap-2">
            {['experience', 'education', 'skills', 'projects'].map((type) => (
              <button
                key={type}
                onClick={() => addSection(type as ResumeSection['type'])}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 capitalize"
              >
                <Plus className="w-4 h-4" />
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Templates</h3>
          {[
            { name: 'Modern', preview: 'bg-gradient-to-br from-slate-700 to-slate-800' },
            { name: 'Minimal', preview: 'bg-white' },
            { name: 'Creative', preview: 'bg-gradient-to-br from-purple-600 to-blue-600' },
          ].map((template) => (
            <button
              key={template.name}
              className="w-full p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors text-left"
            >
              <div className={`h-20 ${template.preview} rounded-lg mb-2`} />
              <p className="text-sm text-white">{template.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
