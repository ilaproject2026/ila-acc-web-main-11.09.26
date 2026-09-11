import type { EligibilityMatch, EligibilityProfile } from '../types'

const ausbildungCatalog = [
  { title: 'IT System Integration', city: 'Berlin', duration: '3 years', salary: '€950/mo' },
  { title: 'Nursing (Pflegefachmann)', city: 'Munich', duration: '3 years', salary: '€1,100/mo' },
  { title: 'Logistics Specialist', city: 'Frankfurt', duration: '3 years', salary: '€900/mo' },
  { title: 'Industrial Mechanic', city: 'Berlin', duration: '3.5 years', salary: '€980/mo' },
  { title: 'Hotel Management', city: 'Munich', duration: '3 years', salary: '€850/mo' },
  { title: 'Medical Assistant', city: 'Frankfurt', duration: '3 years', salary: '€1,050/mo' },
]

const universityCatalog = [
  { name: 'TU Berlin', type: 'public' as const, city: 'Berlin', program: 'Computer Science (B.Sc.)' },
  { name: 'LMU Munich', type: 'public' as const, city: 'Munich', program: 'Business Administration' },
  { name: 'Goethe University Frankfurt', type: 'public' as const, city: 'Frankfurt', program: 'Economics' },
  { name: 'SRH Berlin', type: 'private' as const, city: 'Berlin', program: 'International Business (B.A.)' },
  { name: 'Munich Business School', type: 'private' as const, city: 'Munich', program: 'MBA Pathway' },
]

const hospitalCatalog = [
  { name: 'Charité Berlin', type: 'public' as const, city: 'Berlin', role: 'Medical trainee / FSP prep' },
  { name: 'Klinikum rechts der Isar', type: 'public' as const, city: 'Munich', role: 'Residency observer' },
  { name: 'University Hospital Frankfurt', type: 'public' as const, city: 'Frankfurt', role: 'Clinical attachment' },
  { name: 'Helios Klinik Munich', type: 'private' as const, city: 'Munich', role: 'Nursing Ausbildung partner' },
]

function germanLevelScore(level: EligibilityProfile['germanLevel']): number {
  const map = { none: 0, A1: 20, A2: 40, B1: 60, B2: 80, C1: 100 }
  return map[level]
}

function educationScore(education: EligibilityProfile['education'], gpa: number): number {
  const base = { 'high-school': 40, vocational: 50, bachelor: 70, master: 85, 'medical-degree': 90 }[education]
  const gpaBonus = Math.min(20, Math.max(0, (gpa - 2) * 8))
  return Math.min(100, base + gpaBonus)
}

export function analyzeEligibility(profile: Partial<EligibilityProfile>, hasResume: boolean): EligibilityMatch {
  const age = profile.age ?? 0
  const gpa = profile.gpa ?? 0
  const workExp = profile.workExperienceYears ?? 0
  const education = profile.education ?? 'high-school'
  const germanLevel = profile.germanLevel ?? 'none'
  const path = profile.preferredPath ?? 'any'

  const eduScore = educationScore(education, gpa)
  const langScore = germanLevelScore(germanLevel)
  const expBonus = Math.min(15, workExp * 3)
  const resumeBonus = hasResume ? 10 : 0
  const overallScore = Math.min(100, Math.round((eduScore * 0.4 + langScore * 0.35 + expBonus + resumeBonus)))

  const cities = ['Berlin', 'Munich', 'Frankfurt'] as const
  const locationScores = cities.map((city) => {
    let score = 50 + langScore * 0.2 + expBonus
    if (education === 'medical-degree' && city === 'Munich') score += 20
    if (education === 'bachelor' && city === 'Berlin') score += 15
    if (workExp >= 2 && city === 'Frankfurt') score += 10
    score = Math.min(98, Math.round(score))
    const reasons: Record<string, string> = {
      Berlin: 'Strong IT & startup ecosystem, affordable Ausbildung options',
      Munich: 'Premium healthcare & engineering employers, high placement rate',
      Frankfurt: 'Finance, logistics & import-export hub with part-time demand',
    }
    return { city, score, reason: reasons[city] }
  }).sort((a, b) => b.score - a.score)

  let ausbildungOptions = ausbildungCatalog.filter((a) => {
    if (path === 'university' || (path as string) === 'medical') return false
    if (education === 'medical-degree') return a.title.includes('Medical') || a.title.includes('Nursing')
    if (education === 'bachelor' || education === 'master') return a.title.includes('IT') || a.title.includes('Logistics')
    return true
  })

  if (langScore < 20) {
    ausbildungOptions = ausbildungOptions.slice(0, 2)
  } else {
    ausbildungOptions = ausbildungOptions.slice(0, 4)
  }

  let universities = universityCatalog.filter((u) => {
    if (path === 'ausbildung' || path === 'job-seeker') return u.type === 'private'
    if (education === 'high-school') return u.type === 'private' || u.city === 'Berlin'
    if (gpa >= 3.5) return true
    return u.type === 'private'
  }).slice(0, 4)

  let hospitals = education === 'medical-degree' || (path as string) === 'medical'
    ? hospitalCatalog.slice(0, 3)
    : germanLevel !== 'none' && (path === 'any' || (path as string) === 'medical')
      ? hospitalCatalog.filter((h) => h.role.includes('Nursing')).slice(0, 2)
      : []

  const studentEligible = age >= 18 && age <= 35 && langScore >= 20
  const workPermitLikely = langScore >= 40 && eduScore >= 50
  const maxHours = studentEligible ? (langScore >= 60 ? 20 : 15) : workPermitLikely ? 30 : 0

  const partTimeEligibility = {
    eligible: maxHours > 0,
    maxHoursPerWeek: maxHours,
    notes: maxHours >= 20
      ? 'Eligible for standard student part-time work (up to 20 hrs/week during semester).'
      : maxHours > 0
        ? 'Limited part-time eligibility — improve German to B1 for full 20 hrs/week.'
        : 'Complete A1 German and provide resume to unlock part-time eligibility analysis.',
  }

  const summary = buildSummary(overallScore, education, germanLevel, path, hasResume)

  return {
    ausbildungOptions,
    universities,
    hospitals,
    locations: locationScores,
    partTimeEligibility,
    overallScore,
    summary,
  }
}

function buildSummary(
  score: number,
  education: EligibilityProfile['education'],
  germanLevel: EligibilityProfile['germanLevel'],
  path: EligibilityProfile['preferredPath'],
  hasResume: boolean,
): string {
  const tier = score >= 75 ? 'Strong' : score >= 50 ? 'Moderate' : 'Preliminary'
  const eduLabel = education.replace('-', ' ')
  let text = `${tier} match (${score}/100). Based on your ${eduLabel} background`
  if (germanLevel !== 'none') text += ` and ${germanLevel} German`
  text += `, we identified pathways aligned with your ${path === 'any' ? 'profile' : path + ' preference'}.`
  if (!hasResume) text += ' Upload your resume for more precise hospital and employer matches.'
  if (germanLevel === 'none') text += ' We recommend starting our A1 German course to unlock additional options.'
  return text
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
