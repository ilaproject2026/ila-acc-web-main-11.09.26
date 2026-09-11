import { useState, useEffect, useRef } from 'react'
import { X, Mic, Send, Bot, Volume2, ChevronRight, Sparkles } from 'lucide-react'
import type { ChatMessage, LanguageLevel } from '../../types'
import {
  levelMeta,
  lessonPrompts,
  evaluateResponse,
  getTutorIntro,
} from '../../lib/languageLessons'
import { renderFormattedText } from '../../lib/formatText'

type Phase = 'select' | 'lesson' | 'complete'

export default function LanguageTrainer() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('select')
  const [level, setLevel] = useState<LanguageLevel | null>(null)
  const [promptIndex, setPromptIndex] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const [listening, setListening] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-language-trainer', handler)
    return () => window.removeEventListener('open-language-trainer', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const reset = () => {
    setPhase('select')
    setLevel(null)
    setPromptIndex(0)
    setMessages([])
    setInput('')
    setScores([])
    setTyping(false)
  }

  const close = () => {
    setOpen(false)
    setTimeout(reset, 300)
  }

  const addMessage = (role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date() },
    ])
  }

  const tutorSpeak = (text: string, delay = 800): Promise<void> =>
    new Promise((resolve) => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        addMessage('assistant', text)
        resolve()
      }, delay)
    })

  const startLesson = async (selected: LanguageLevel) => {
    setLevel(selected)
    setPhase('lesson')
    setMessages([])
    setPromptIndex(0)
    setScores([])
    await tutorSpeak(getTutorIntro(selected), 1200)
    const first = lessonPrompts[selected][0]
    await tutorSpeak(`**${first.german}**\n_${first.english}_\n\n${first.hint ?? 'Reply in German below.'}`, 600)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !level || typing) return

    const userText = input.trim()
    setInput('')
    addMessage('user', userText)

    const prompts = lessonPrompts[level]
    const current = prompts[promptIndex]
    const result = evaluateResponse(current, userText)
    setScores((prev) => [...prev, result.score])

    await tutorSpeak(
      `${result.correct ? '✓' : '↻'} ${result.feedback} (Score: ${result.score}/100)`,
      700,
    )

    const nextIndex = promptIndex + 1
    if (nextIndex < prompts.length) {
      setPromptIndex(nextIndex)
      const next = prompts[nextIndex]
      await tutorSpeak(`Next:\n**${next.german}**\n_${next.english}_`, 500)
    } else {
      const avg = Math.round([...scores, result.score].reduce((a, b) => a + b, 0) / (scores.length + 1))
      setPhase('complete')
      await tutorSpeak(
        `Lesson complete! Average score: **${avg}/100**. You practiced ${prompts.length} real-life ${level} conversations. Enroll in ILA Live classes for full certification prep!`,
        800,
      )
    }
  }

  const simulateVoice = () => {
    if (!level) return
    const sample = ['Ich heiße Maria.', 'Ich komme aus Indien.', 'Ja, ein bisschen Deutsch.'][promptIndex % 3]
    setListening(true)
    setTimeout(() => {
      setListening(false)
      setInput(sample)
    }, 1500)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-brand-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold">Live Language Trainer</h2>
              <p className="text-xs text-blue-200">AI-powered conversational German</p>
            </div>
          </div>
          <button onClick={close} className="p-2 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level selection */}
        {phase === 'select' && (
          <div className="p-6 overflow-y-auto">
            <p className="text-slate-600 mb-6">Select your level to start a sample AI class with real-time feedback.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(['A1', 'A2'] as LanguageLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startLesson(lvl)}
                  className="text-left p-5 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-brand-700">{lvl}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{levelMeta[lvl].title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{levelMeta[lvl].description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {levelMeta[lvl].topics.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lesson chat */}
        {(phase === 'lesson' || phase === 'complete') && (
          <>
            <div className="px-4 py-2 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
              <span className="text-sm font-medium text-brand-700">
                {level} Class · Prompt {Math.min(promptIndex + 1, lessonPrompts[level!].length)}/{lessonPrompts[level!].length}
              </span>
              {phase === 'complete' && (
                <button onClick={reset} className="text-xs font-semibold text-brand-600 hover:underline">
                  Try another level
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[320px] max-h-[420px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-brand-700 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}
                  >
                    {renderFormattedText(msg.content)}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  AI tutor is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {phase === 'lesson' && (
              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={simulateVoice}
                  disabled={listening}
                  className={`p-2.5 rounded-lg border ${listening ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  title="Simulate voice input"
                >
                  <Mic className={`w-5 h-5 ${listening ? 'animate-pulse' : ''}`} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response in German..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  disabled={typing}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="p-2.5 rounded-lg bg-brand-700 text-white disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}

            {phase === 'complete' && (
              <div className="p-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-3 rounded-lg border border-brand-200 text-brand-700 font-semibold text-sm hover:bg-brand-50"
                >
                  Start New Lesson
                </button>
                <button
                  onClick={() => { close(); document.getElementById('eligibility')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="flex-1 py-3 rounded-lg bg-brand-700 text-white font-semibold text-sm hover:bg-brand-800 flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Check Eligibility
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
