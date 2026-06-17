'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Play, ChevronRight, Clock, Award, MessageSquare, Mic, Send, RotateCcw, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Question = {
  id: string
  question: string
  category: string
}

const questionBank: Record<string, Question[]> = {
  technical: [
    { id: '1', question: 'What is the difference between let, const, and var in JavaScript?', category: 'JavaScript' },
    { id: '2', question: 'Explain how React\'s virtual DOM works.', category: 'React' },
    { id: '3', question: 'What is Big O notation? Give examples.', category: 'DSA' },
    { id: '4', question: 'Explain the concept of closures in JavaScript.', category: 'JavaScript' },
    { id: '5', question: 'What is the difference between SQL and NoSQL databases?', category: 'Database' },
  ],
  behavioral: [
    { id: '1', question: 'Tell me about a challenging project you worked on.', category: 'Experience' },
    { id: '2', question: 'How do you handle conflicts in a team?', category: 'Teamwork' },
    { id: '3', question: 'Describe a time you had to learn something new quickly.', category: 'Learning' },
    { id: '4', question: 'What motivates you in your career?', category: 'Motivation' },
    { id: '5', question: 'How do you prioritize tasks when everything seems urgent?', category: 'Time Management' },
  ]
}

export default function InterviewPage() {
  const [selectedType, setSelectedType] = useState<'technical' | 'behavioral' | 'mixed'>('technical')
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<Record<string, { score: number; feedback: string }>>({})
  const { user } = useAuth()
  const supabase = createClient()

  const startInterview = () => {
    let selectedQuestions: Question[] = []

    if (selectedType === 'mixed') {
      selectedQuestions = [
        ...questionBank.technical.slice(0, 3),
        ...questionBank.behavioral.slice(0, 2)
      ]
    } else {
      selectedQuestions = questionBank[selectedType].slice(0, 5)
    }

    setQuestions(selectedQuestions)
    setCurrentQuestion(0)
    setAnswers({})
    setCurrentAnswer('')
    setIsCompleted(false)
    setIsStarted(true)
  }

  const submitAnswer = () => {
    const q = questions[currentQuestion]
    setAnswers(prev => ({ ...prev, [q.id]: currentAnswer }))

    // Simulate AI feedback
    const aiScore = Math.floor(Math.random() * 40) + 60 // 60-100
    const feedbackMessages = [
      'Good answer! Consider adding more specific examples.',
      'Well structured response. Could elaborate more on implementation.',
      'Excellent explanation! Clear and concise.',
      'Good conceptual understanding. Add practical experience.',
      'Solid answer. Consider mentioning edge cases.'
    ]

    setFeedback(prev => ({
      ...prev,
      [q.id]: {
        score: aiScore,
        feedback: feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]
      }
    }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setCurrentAnswer('')
    } else {
      finishInterview()
    }
  }

  const finishInterview = async () => {
    const avgScore = Math.round(
      Object.values(feedback).reduce((acc, f) => acc + f.score, 0) / questions.length
    )

    setScore(avgScore)
    setIsCompleted(true)

    await supabase.from('mock_interviews').insert({
      user_id: user!.id,
      type: selectedType,
      questions: questions,
      answers: answers,
      score: avgScore,
      feedback: feedback,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Mock Interview</h1>
          <p className="text-slate-400 mt-1">Practice with AI-powered interview simulation</p>
        </div>
      </div>

      {!isStarted ? (
        <div className="space-y-6">
          {/* Interview Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { type: 'technical', title: 'Technical Interview', desc: 'DSA, coding, system design', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              { type: 'behavioral', title: 'Behavioral Interview', desc: 'Teamwork, leadership, problem-solving', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
              { type: 'mixed', title: 'Mixed Interview', desc: 'Combination of both', icon: Award, color: 'from-emerald-500 to-teal-500' },
            ].map((interview) => {
              const Icon = interview.icon
              const isActive = selectedType === interview.type
              return (
                <button
                  key={interview.type}
                  onClick={() => setSelectedType(interview.type as typeof selectedType)}
                  className={`relative p-6 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-br ' + interview.color + ' border-transparent'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-white' : 'text-white'}`}>
                    {interview.title}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {interview.desc}
                  </p>
                </button>
              )
            })}
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Ready to Start?</h2>
            <p className="text-slate-400 mb-6">5 questions • ~15 minutes • AI-powered feedback</p>
            <button
              onClick={startInterview}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Start Interview
            </button>
          </motion.div>
        </div>
      ) : !isCompleted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          {/* Progress */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex-1 h-2 bg-slate-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">--:--</span>
            </div>
          </div>

          {/* Current Question */}
          <div className="mb-6">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm mb-4 inline-block">
              {questions[currentQuestion]?.category}
            </span>
            <h2 className="text-xl font-medium text-white">
              {questions[currentQuestion]?.question}
            </h2>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
            />

            {/* Previous Feedback */}
            {currentQuestion > 0 && feedback[questions[currentQuestion - 1]?.id] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 rounded-xl p-4"
              >
                <p className="text-sm text-slate-400">Previous answer feedback:</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-lg font-bold text-emerald-400">
                    {feedback[questions[currentQuestion - 1].id].score}%
                  </span>
                  <p className="text-sm text-slate-300">
                    {feedback[questions[currentQuestion - 1].id].feedback}
                  </p>
                </div>
              </motion.div>
            )}

            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Interview
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Results Summary */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center gap-8">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Score', value: score },
                        { name: 'Remaining', value: 100 - score }
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      <Cell fill={getScoreColor(score)} />
                      <Cell fill="#334155" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
                <p className="text-5xl font-bold text-white mb-2">{score}%</p>
                <p className="text-slate-400">
                  {score >= 80 ? 'Excellent performance!' : score >= 60 ? 'Good job! Keep practicing.' : 'Room for improvement. Keep learning!'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Feedback</h3>
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                      Q{idx + 1}
                    </span>
                    <span className={`font-bold ${feedback[q.id]?.score >= 80 ? 'text-emerald-400' : feedback[q.id]?.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {feedback[q.id]?.score}%
                    </span>
                  </div>
                  <p className="text-white mb-2">{q.question}</p>
                  <p className="text-sm text-slate-400 mt-2">
                    {feedback[q.id]?.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsStarted(false)
                setIsCompleted(false)
              }}
              className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Another Interview
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity">
              Save Results
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
