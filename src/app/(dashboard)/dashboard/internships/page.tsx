'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Internship } from '@/types/database'
import { Briefcase, Plus, ExternalLink, Calendar, MapPin, Building2, X, CreditCard as Edit3, Trash2, Search, ListFilter as Filter } from 'lucide-react'
import { format } from 'date-fns'

const statusColors = {
  saved: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  interviewing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  offered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const kanbanColumns: Internship['status'][] = ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted']

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'saved' as Internship['status'],
    application_date: '',
    notes: '',
    url: ''
  })
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) fetchInternships()
  }, [user])

  const fetchInternships = async () => {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setInternships(data || [])
    setLoading(false)
  }

  const saveInternship = async () => {
    if (editingInternship) {
      await supabase
        .from('internships')
        .update({
          ...formData,
          application_date: formData.application_date || null
        })
        .eq('id', editingInternship.id)
    } else {
      await supabase.from('internships').insert({
        user_id: user!.id,
        ...formData,
        application_date: formData.application_date || null
      })
    }
    setShowModal(false)
    setEditingInternship(null)
    setFormData({ company: '', role: '', status: 'saved', application_date: '', notes: '', url: '' })
    fetchInternships()
  }

  const deleteInternship = async (id: string) => {
    await supabase.from('internships').delete().eq('id', id)
    fetchInternships()
  }

  const updateStatus = async (id: string, status: Internship['status']) => {
    await supabase.from('internships').update({ status }).eq('id', id)
    fetchInternships()
  }

  const stats = {
    total: internships.length,
    applied: internships.filter(i => i.status === 'applied').length,
    interviewing: internships.filter(i => i.status === 'interviewing').length,
    offered: internships.filter(i => ['offered', 'accepted'].includes(i.status)).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Internship Tracker</h1>
          <p className="text-slate-400 mt-1">Track all your job applications in one place</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Applied', value: stats.applied, color: 'text-blue-400' },
          { label: 'Interviewing', value: stats.interviewing, color: 'text-amber-400' },
          { label: 'Offers', value: stats.offered, color: 'text-emerald-400' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
          >
            List
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search applications..."
            className="bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((status) => (
            <div key={status} className="min-w-[200px]">
              <div className={`px-3 py-2 rounded-t-lg border-b ${statusColors[status].replace('text-', 'border-').replace('/20', '/30')}`}>
                <h3 className="font-medium capitalize text-sm">{status.replace('_', ' ')}</h3>
                <p className="text-xs text-slate-500">{internships.filter(i => i.status === status).length} items</p>
              </div>
              <div className="space-y-2 py-2">
                {internships
                  .filter(i => i.status === status)
                  .map((internship, index) => (
                    <motion.div
                      key={internship.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-700/50 p-3 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{internship.company}</p>
                            <p className="text-xs text-slate-400">{internship.role}</p>
                          </div>
                        </div>
                      </div>
                      {internship.notes && (
                        <p className="text-xs text-slate-400 mb-2 line-clamp-2">{internship.notes}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {internship.application_date && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(internship.application_date), 'MMM d')}
                          </span>
                        )}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select
                            value={internship.status}
                            onChange={(e) => updateStatus(internship.id, e.target.value as Internship['status'])}
                            className="text-xs bg-slate-900/50 border-slate-700 text-slate-300 rounded p-1"
                          >
                            {kanbanColumns.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {internship.url && (
                            <a href={internship.url} target="_blank" className="text-slate-400 hover:text-white">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button onClick={() => deleteInternship(internship.id)} className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-4 py-3 text-left text-sm text-slate-400">Company</th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((internship) => (
                  <tr key={internship.id} className="border-b border-slate-700/30 hover:bg-slate-900/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-white">{internship.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{internship.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs border ${statusColors[internship.status]}`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {internship.application_date ? format(new Date(internship.application_date), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {internship.url && (
                          <a href={internship.url} target="_blank" className="text-slate-400 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => deleteInternship(internship.id)} className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
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
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingInternship ? 'Edit Application' : 'Add Application'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Company</label>
                  <input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Google"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Role / Position</label>
                  <input
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Software Engineering Intern"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Internship['status'] }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Application Date</label>
                  <input
                    type="date"
                    value={formData.application_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, application_date: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Job Posting URL</label>
                  <input
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:border-emerald-500 focus:outline-none resize-none h-20"
                    placeholder="Any notes..."
                  />
                </div>
              </div>

              <button
                onClick={saveInternship}
                disabled={!formData.company || !formData.role}
                className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {editingInternship ? 'Update' : 'Add'} Application
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
