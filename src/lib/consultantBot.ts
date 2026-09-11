export type ConsultantTopic = 'visa' | 'arrival' | 'housing' | 'local' | 'jobs' | 'general'

export const topicLabels: Record<ConsultantTopic, string> = {
  visa: 'Visa Process',
  arrival: 'Arrival in Germany',
  housing: 'Finding Rooms',
  local: 'Local Guidance',
  jobs: 'Job Hunting',
  general: 'General Help',
}

export const topicStarters: Record<ConsultantTopic, string> = {
  visa: 'I need help with my visa application process.',
  arrival: 'I am arriving in Germany soon and need guidance.',
  housing: 'How do I find affordable rooms or apartments?',
  local: 'What local services should I know about in Germany?',
  jobs: 'I am looking for job opportunities in Germany.',
  general: 'Hello, I need assistance with my ILA journey.',
}

const responses: Record<ConsultantTopic, string[]> = {
  visa: [
    'For visa processing, ILA Global supports Business, Tourist, Student, and Job Seeker visas. Upload your documents to our AI Document Processor for a completeness check — it typically saves 60% processing time.',
    'Student visa checklist: admission letter, blocked account (Sperrkonto), health insurance, passport photos, and proof of language level. I can guide you step-by-step. Which visa type are you applying for?',
    'Job Seeker visa requires proof of qualifications, CV, financial means (~€947/month), and health insurance. Our team reviews applications within 48 hours.',
  ],
  arrival: [
    'Upon arrival: register your address (Anmeldung) within 14 days at the Bürgeramt, open a bank account, and get health insurance activated. ILA provides an arrival checklist PDF — shall I outline the first week?',
    'Airport to city: use DB (Deutsche Bahn) app for trains, or FLIX/ regional buses. For Berlin, get a temporary SIM at the airport and download BVG for public transport.',
    'First 48 hours: Anmeldung appointment, SIM card, grocery run (Aldi/Lidl/Rewe), and connect with your ILA arrival buddy if enrolled in our program.',
  ],
  housing: [
    'Popular platforms: WG-Gesucht (shared flats), ImmobilienScout24, eBay Kleinanzeigen. For students, Studentenwerk dormitories are affordable. Budget: €400–800/month depending on city.',
    'Berlin tip: start in outer districts (Neukölln, Wedding) for lower rent. Always visit before paying. ILA partners with verified landlords in Munich, Frankfurt, and Berlin.',
    'Required documents for renting: SCHUFA (credit check), proof of income or blocked account, ID/passport, and sometimes Mietschuldenfreiheitsbescheinigung.',
  ],
  local: [
    'Essential apps: DB Navigator (trains), Google Maps, Too Good To Go (food deals), NINA (emergency alerts). Public transport varies by city — Berlin AB zones, Munich MVV, Frankfurt RMV.',
    'Healthcare: register with a Hausarzt (GP). Emergency: 112. Non-emergency medical: 116 117. Pharmacy (Apotheke) — look for green cross sign.',
    'Integration: Volkshochschule (VHS) offers affordable German courses. ILA\'s Work While You Study program connects you with part-time roles while studying.',
  ],
  jobs: [
    'Job portals: StepStone, Indeed.de, LinkedIn, Make it in Germany (official). Blue-collar roles: our Doctor to Driver program places candidates in logistics, warehouse, and driving roles.',
    'Upload your resume to our AI Match portal — 94% match accuracy across 500+ employers. Include German level and work authorization status for best results.',
    'Ausbildung (vocational training) pays €800–1,200/month while you learn. IT and healthcare Ausbildung are in high demand in Bavaria and NRW.',
  ],
  general: [
    'Hello! I\'m Ilas, your ILA Live Consultant. I can help with visas, arrival, housing, local life, and jobs in Germany. Pick a topic below or type your question.',
    'ILA Global offers end-to-end support: education, visa, placement, and earn-while-learn programs. What would you like to explore today?',
  ],
}

export function getConsultantReply(topic: ConsultantTopic, userMessage: string, messageIndex: number): string {
  const topicResponses = responses[topic]
  const lower = userMessage.toLowerCase()

  if (lower.includes('thank') || lower.includes('danke')) {
    return 'Gerne! If you need human support, use "Talk to Us" below — our team responds within 24 hours. Viel Erfolg!'
  }
  if (lower.includes('berlin')) {
    return 'Berlin has strong demand for IT Ausbildung, healthcare trainees, and logistics jobs. Average part-time: 20 hrs/week for students. ILA has partner housing in Neukölln and Wedding.'
  }
  if (lower.includes('munich') || lower.includes('münchen')) {
    return 'Munich offers premium medical and engineering pathways. Public hospitals like Klinikum rechts der Isar accept FSP candidates. Housing is competitive — start search 3 months early.'
  }
  if (lower.includes('frankfurt')) {
    return 'Frankfurt is ideal for finance, logistics, and import-export careers. Part-time work common in airport/logistics hubs. ILA matches candidates with Rhein-Main employers.'
  }

  return topicResponses[messageIndex % topicResponses.length]
}

export const consultantWelcome =
  'Hi! I\'m **Ilas**, your ILA Live Consultant. I\'ll guide you through visa processes, arriving in Germany, finding rooms, local tips, and job hunting. Choose a topic or ask anything!'
