import type { LanguageLevel, LessonPrompt } from '../types'

export const levelMeta: Record<LanguageLevel, { title: string; description: string; topics: string[] }> = {
  A1: {
    title: 'Beginner (A1)',
    description: 'Greetings, introductions, and everyday basics',
    topics: ['Greetings', 'Numbers', 'Ordering food', 'Asking directions'],
  },
  A2: {
    title: 'Elementary (A2)',
    description: 'Daily routines, shopping, and simple conversations',
    topics: ['Daily routine', 'Shopping', 'Travel', 'Describing people'],
  },
}

export const lessonPrompts: Record<LanguageLevel, LessonPrompt[]> = {
  A1: [
    {
      id: 'a1-1',
      german: 'Guten Tag! Wie heißen Sie?',
      english: 'Good day! What is your name?',
      hint: 'Reply with "Ich heiße [your name]"',
      expectedKeywords: ['heiße', 'ich', 'name'],
    },
    {
      id: 'a1-2',
      german: 'Woher kommen Sie?',
      english: 'Where are you from?',
      hint: 'Reply with "Ich komme aus [country]"',
      expectedKeywords: ['komme', 'aus', 'ich'],
    },
    {
      id: 'a1-3',
      german: 'Sprechen Sie Deutsch?',
      english: 'Do you speak German?',
      hint: 'Try "Ja, ein bisschen" (Yes, a little)',
      expectedKeywords: ['ja', 'nein', 'bisschen', 'deutsch'],
    },
    {
      id: 'a1-4',
      german: 'Wie geht es Ihnen?',
      english: 'How are you?',
      hint: 'Reply "Mir geht es gut, danke!"',
      expectedKeywords: ['gut', 'danke', 'mir', 'geht'],
    },
  ],
  A2: [
    {
      id: 'a2-1',
      german: 'Was machen Sie beruflich?',
      english: 'What do you do for work?',
      hint: 'Reply with "Ich arbeite als..." or "Ich studiere..."',
      expectedKeywords: ['arbeite', 'studiere', 'beruf'],
    },
    {
      id: 'a2-2',
      german: 'Können Sie mir den Weg zum Bahnhof erklären?',
      english: 'Can you explain the way to the train station?',
      hint: 'Use direction words: links, rechts, geradeaus',
      expectedKeywords: ['links', 'rechts', 'geradeaus', 'bahnhof'],
    },
    {
      id: 'a2-3',
      german: 'Ich suche eine Wohnung in Berlin. Haben Sie Tipps?',
      english: 'I am looking for an apartment in Berlin. Do you have tips?',
      hint: 'Mention WG, Miete, or online portals',
      expectedKeywords: ['wohnung', 'miete', 'wg', 'berlin'],
    },
    {
      id: 'a2-4',
      german: 'Wann beginnt Ihr Deutschkurs?',
      english: 'When does your German course start?',
      hint: 'Use time expressions: morgen, nächste Woche, um...',
      expectedKeywords: ['morgen', 'woche', 'montag', 'beginnt', 'kurs'],
    },
  ],
}

export function evaluateResponse(prompt: LessonPrompt, userInput: string): {
  correct: boolean
  feedback: string
  score: number
} {
  const normalized = userInput.toLowerCase().trim()
  if (!normalized) {
    return { correct: false, feedback: 'Please type a response in German to continue.', score: 0 }
  }

  const keywords = prompt.expectedKeywords ?? []
  const matched = keywords.filter((k) => normalized.includes(k.toLowerCase()))
  const ratio = keywords.length ? matched.length / keywords.length : 0.5

  if (ratio >= 0.5 || normalized.length >= 8) {
    return {
      correct: true,
      feedback: getPositiveFeedback(matched.length),
      score: Math.min(100, Math.round(60 + ratio * 40)),
    }
  }

  return {
    correct: false,
    feedback: `Good try! ${prompt.hint ?? 'Use more German vocabulary from the lesson.'}`,
    score: Math.round(ratio * 50),
  }
}

function getPositiveFeedback(matchedCount: number): string {
  const messages = [
    'Excellent! Your response sounds natural.',
    'Sehr gut! Great use of vocabulary.',
    'Well done — keep that conversational flow going!',
    'Perfect! You matched key phrases correctly.',
  ]
  return messages[Math.min(matchedCount, messages.length - 1)]
}

export function getTutorIntro(level: LanguageLevel): string {
  return level === 'A1'
    ? 'Willkommen! I am your ILA AI Language Trainer. We will practice real-life German at A1 level. I will ask questions — reply in German and I will give instant feedback. Ready? Los geht\'s!'
    : 'Willkommen zurück! At A2 we focus on practical conversations for work, housing, and daily life in Germany. Answer in German and I will coach you in real time. Bereit?'
}
