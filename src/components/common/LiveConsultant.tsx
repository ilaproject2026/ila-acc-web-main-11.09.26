import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Plane,
  Home,
  MapPin,
  Briefcase,
  FileText,
  Phone,
  Mail,
} from 'lucide-react'
import type { ChatMessage } from '../../types'
import {
  consultantWelcome,
  getConsultantReply,
  topicLabels,
  topicStarters,
  type ConsultantTopic,
} from '../../lib/consultantBot'

const topicIcons: Record<ConsultantTopic, typeof Plane> = {
  visa: FileText,
  arrival: Plane,
  housing: Home,
  local: MapPin,
  jobs: Briefcase,
  general: MessageCircle,
}

export default function LiveConsultant() {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState<ConsultantTopic>('general')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [replyCount, setReplyCount] = useState(0)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: consultantWelcome,
          timestamp: new Date(),
        },
      ])
    }
  }, [open, messages.length])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text: string, selectedTopic?: ConsultantTopic) => {
    if (!text.trim()) return
    const activeTopic = selectedTopic ?? topic

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() },
    ])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = getConsultantReply(activeTopic, text, replyCount)
      setReplyCount((c) => c + 1)
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply, timestamp: new Date() },
      ])
    }, 900 + Math.random() * 600)
  }

  const selectTopic = (t: ConsultantTopic) => {
    setTopic(t)
    sendMessage(topicStarters[t], t)
  }

  const renderContent = (content: string) =>
    content.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-3.5 bg-brand-700 text-white rounded-full shadow-lg hover:bg-brand-800 transition-all hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold text-sm hidden sm:inline">Ilas Live Consultant</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[90] w-[calc(100vw-2rem)] sm:w-[400px] max-h-[calc(100vh-3rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-brand-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-400 flex items-center justify-center text-brand-900 font-bold text-xs">
                IL
              </div>
              <div>
                <div className="font-semibold text-sm">Ilas Live Consultant</div>
                <div className="text-[10px] text-blue-200">Visa · Arrival · Housing · Jobs</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Topic chips */}
          <div className="px-3 py-2 border-b border-slate-100 flex gap-1.5 overflow-x-auto">
            {(Object.keys(topicLabels) as ConsultantTopic[]).filter((t) => t !== 'general').map((t) => {
              const Icon = topicIcons[t]
              return (
                <button
                  key={t}
                  onClick={() => selectTopic(t)}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    topic === t ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {topicLabels[t]}
                </button>
              )
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[280px] max-h-[360px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-700 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </span>
                Ilas is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="p-3 border-t border-slate-100 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about visa, housing, jobs..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" disabled={!input.trim() || typing} className="p-2 rounded-lg bg-brand-700 text-white disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Talk to Us backup */}
          <div className="px-3 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Talk to Us — Manual Backup</p>
            <div className="flex gap-2">
              <a
                href="tel:+493012345678"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:border-brand-200"
              >
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                Call Us
              </a>
              <a
                href="mailto:contact@ilaglobal.com"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:border-brand-200"
              >
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
