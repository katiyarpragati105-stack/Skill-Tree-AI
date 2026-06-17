import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message, profile } = await request.json()

  // Store user message
  await supabase.from('chat_history').insert({
    user_id: session.user.id,
    role: 'user',
    content: message,
  })

  // Generate AI response
  let aiResponse = ''

  if (GEMINI_API_KEY) {
    try {
      const systemPrompt = `You are an AI career mentor for students. The user's profile:
- Name: ${profile?.name || 'Student'}
- Year: ${profile?.year || 'Not specified'}
- Branch: ${profile?.branch || 'Not specified'}
- Goal: ${profile?.goal || 'Not specified'}
- Level: ${profile?.level || 1}
- XP: ${profile?.xp || 0}

Provide helpful, personalized career guidance. Be encouraging but realistic. Keep responses concise (2-3 paragraphs max).`

      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'I understand. I will act as a helpful career mentor.' }] },
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      })

      const data = await res.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch {
      aiResponse = ''
    }
  }

  // Fallback responses
  if (!aiResponse) {
    const fallbackResponses: Record<string, string> = {
      skills: `Based on your goal to become ${profile?.goal || 'a developer'}, I recommend focusing on these core skills:\n\n1. **JavaScript/TypeScript** - Foundation for modern web development\n2. **React** - Most popular frontend library\n3. **Data Structures & Algorithms** - Essential for interviews\n4. **System Design** - For senior roles\n\nWould you like me to create a personalized learning path for any of these?`,
      interview: `To ace your interviews, focus on:\n\n1. **Technical Skills**: Practice DSA problems daily (LeetCode, HackeRank)\n2. **Communication**: Clear explanations of your thought process\n3. **Projects**: Be ready to discuss your projects in depth\n\nTry a mock interview on SkillTree to get AI feedback on your answers!`,
      resume: `Here are tips to improve your resume:\n\n1. **Use action verbs**: "Built", "Developed", "Optimized"\n2. **Quantify achievements**: "Improved performance by 40%"\n3. **Tailor keywords**: Match job descriptions\n4. **Keep it concise**: One page for freshers\n\nUse SkillTree's AI Resume Builder to get ATS-optimized templates!`,
      default: `Hello ${profile?.name?.split(' ')[0] || 'there'}! I'm your AI career mentor. Based on your goal to become ${profile?.goal || 'a developer'}, I can help you with:\n\n• **Skill recommendations** - What to learn next\n• **Interview prep** - Practice questions and tips\n• **Resume building** - ATS optimization\n• **Career guidance** - Industry insights\n\nWhat would you like to explore today?`,
    }

    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      aiResponse = fallbackResponses.skills
    } else if (lowerMessage.includes('interview') || lowerMessage.includes('job')) {
      aiResponse = fallbackResponses.interview
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      aiResponse = fallbackResponses.resume
    } else {
      aiResponse = fallbackResponses.default
    }
  }

  // Store AI response
  await supabase.from('chat_history').insert({
    user_id: session.user.id,
    role: 'assistant',
    content: aiResponse,
  })

  return NextResponse.json({ response: aiResponse })
}
