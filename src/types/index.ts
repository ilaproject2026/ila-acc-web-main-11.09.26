export type LanguageLevel = 'A1' | 'A2'

export type EducationLevel =
  | 'high-school'
  | 'bachelor'
  | 'master'
  | 'medical-degree'
  | 'vocational'

export type GermanLevel = 'none' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export interface EligibilityProfile {
  fullName: string
  email: string
  age: number
  education: EducationLevel
  fieldOfStudy: string
  gpa: number
  workExperienceYears: number
  germanLevel: GermanLevel
  preferredPath: 'ausbildung' | 'university' | 'medical' | 'job-seeker' | 'any'
}

export interface EligibilityMatch {
  ausbildungOptions: { title: string; city: string; duration: string; salary: string }[]
  universities: { name: string; type: 'public' | 'private'; city: string; program: string }[]
  hospitals: { name: string; type: 'public' | 'private'; city: string; role: string }[]
  locations: { city: string; score: number; reason: string }[]
  partTimeEligibility: {
    eligible: boolean
    maxHoursPerWeek: number
    notes: string
  }
  overallScore: number
  summary: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface LessonPrompt {
  id: string
  german: string
  english: string
  hint?: string
  expectedKeywords?: string[]
}

// ==========================================
// NEW ENTERPRISE ROLES & TASK MANAGEMENT TYPES
// ==========================================

export type UserRole = 'Super Admin' | 'CEO' | 'General Manager' | 'Tech Admin' | 'Dept Head' | 'Associate';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  permissions: string[]; // ഉദാഹരണത്തിന്: 'edit', 'view', 'delete'
  biometricId?: string;  // ബയോമെട്രിക് ഓതന്റിക്കേഷനായി
}

export interface EnterpriseTask {
  id: string;
  title: string;
  description: string;
  assignedToDept: string; // ഉദാ: 'Marketing', 'Visa', 'HR'
  status: 'Pending' | 'In Progress' | 'Success' | 'Negative';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
}