export interface FollowUpRecord {
  id: string;
  date: string;
  staffName: string;
  channel: 'Phone Call' | 'WhatsApp' | 'In-Person' | 'Email';
  notes: string;
  outcome: 'Interested - Callback' | 'Docs Pending' | 'Fee Paid' | 'Not Interested' | 'Appointment Booked';
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type?: 'Walk-in' | 'Online' | 'Referral' | 'Phone';
  tokenNumber?: string;
  course: string;
  path: string;
  batch?: string;
  slot?: string;
  price: string;
  paymentStatus: 'Pending' | 'Contacted' | 'Partially Paid' | 'Paid' | 'Link Sent' | 'Refunded';
  amountPaid?: string;
  totalAmount?: string;
  classLink?: string;
  category: 'Education' | 'Study Abroad' | 'Visa' | 'Jobs' | 'Work While You Study' | 'General Front Office';
  timestamp: string;
  aiScore?: number;
  aiPath?: string;
  aiActionPlan?: string[];
  docStatus?: 'Approved' | 'Pending' | 'Consultation Scheduled' | 'Docs Requested';
  source?: string;
  department?: string;
  crmStatus?: 'New Lead' | 'In Progress' | 'Closed Won' | 'Closed Lost';
  pipelineStage?: 'Intake' | 'Assessment' | 'Documentation' | 'Processing' | 'Completed';
  assignedStaffId?: string;
  assignedStaffName?: string;
  intakeNotes?: string;
  visitorDetails?: {
    purpose?: string;
    accompaniedBy?: number;
    idProofVerified?: boolean;
    checkInTime?: string;
    receptionistName?: string;
  };
  followUpDate?: string;
  followUpStatus?: 'Due Today' | 'Overdue' | 'Scheduled' | 'Completed' | 'Pending';
  followUpHistory?: FollowUpRecord[];
  visaProcessingStage?: 'Not Applicable' | 'Profile Assessment' | 'APS Certificate' | 'Blocked Account' | 'Embassy Appointment' | 'Visa Approved' | 'Visa Rejected';
}

export interface VisitorLog {
  id: string;
  page: string;
  timeSpent: number;
  timestamp: string;
}

export interface EnterpriseTask {
  id: string;
  title: string;
  description: string;
  assignedToDept: string;
  status: 'Pending' | 'In Progress' | 'Success' | 'Negative';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  email: string;
  password: string;
  name: string;
  department: 'Super Admin' | 'General Manager' | 'Finance Officer' | 'HR Manager' | 'Marketing Exec' | 'Academic Counselor' | 'Education' | 'Visa';
  phone?: string;
  joiningDate?: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
  resumeUrl?: string;
  hrApprovalStatus?: 'Pending HR Approval' | 'Verified' | 'Rejected';
  hrIssuedId?: string;
  temporaryAccessExpiry?: string;
}

export interface AttendanceLog {
  id: string;
  staffId: string;
  staffName: string;
  checkInTime: string;
  status: 'Present' | 'On Leave' | 'Late';
  date: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'New Staff' | 'New Course' | 'Data Edit' | 'Deletion' | 'General';
  description: string;
  requestedBy: string;
  department: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface UpdateLog {
  id: string;
  action: string;
  details: string;
  user: string;
  department: string;
  timestamp: string;
  category: 'System' | 'Content' | 'Personnel' | 'Data';
}

// Education Hub Data Types
export const generateUniqueCode = (prefix: string, name: string): string => {
  const cleanPrefix = (prefix || 'ID').toUpperCase().trim();
  const slug = (name || 'ITEM')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 4) || 'GEN';
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${cleanPrefix}-${slug}-${randomNum}`;
};

export interface GlobalPath {
  id: string;
  name: string;
  code?: string;
  methods: string;
  position?: number;
  starting: string;
  ending: string;
  remarks: string;
  linkedCourseId?: string;
  linkedCourseName?: string;
}

export interface GlobalBatch {
  id: string;
  name: string;
  code?: string;
  timings: string[];
  starting: string;
  remarks: string;
  linkedCourseId?: string;
  linkedCourseName?: string;
  linkedPathId?: string;
  linkedPathName?: string;
}

export interface CourseMaterialItem {
  id: string;
  title: string;
  type: 'chapters' | 'images' | 'video' | 'promo';
  fileUrl?: string;
  fileName?: string;
  size?: string;
  format?: string;
  description?: string;
}

export interface ClassScheduleSession {
  id: string;
  date: string; // YYYY-MM-DD
  courseId: string;
  courseName: string;
  batchId?: string;
  batchName: string;
  pathId?: string;
  pathName: string;
  instructor: string;
  timeSlot: string; // e.g. "09:00 - 11:00"
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "11:00"
  status: 'Live' | 'Upcoming' | 'Completed' | 'Rescheduled';
  room: string; // e.g. "Virtual Studio 1 (Zoom HD)", "Smart Hall 204"
  enrolledStudents: number;
  attendedStudents?: number;
  topic?: string;
  meetingLink?: string;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  status: 'Present' | 'In Class' | 'Invited' | 'Absent';
  joinedAt?: string;
  attendanceScore?: number;
}

export interface GlobalCategory {
  id: string;
  name: string;
  code?: string;
  subCategories: string[];
  description?: string;
  linkedCourseId?: string;
  linkedCourseName?: string;
}

export interface TeachingStrategy {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pacingModel: string;
  targetLearner: string;
  defaultActive?: boolean;
}

export interface StudentAnalyzingStrategy {
  id: string;
  name: string;
  targetMetric: string;
  threshold: string;
  description: string;
  adaptationAction: string;
  active: boolean;
  customRule?: string;
}

export const DEFAULT_TEACHING_STRATEGIES: TeachingStrategy[] = [
  {
    id: 'ts-1',
    name: 'Fast for Fast',
    category: 'Velocity & Acceleration',
    tagline: 'High-velocity cognitive pacing with rapid syntactic challenge',
    description: 'Compresses learning cycles by 40% for advanced learners using rapid-fire interactive drills, minimal redundancy, and instant CEFR benchmark jumps.',
    pacingModel: 'Accelerated (1.5x Speed)',
    targetLearner: 'Fast Learners & Intensive Bootcamps',
    defaultActive: true
  },
  {
    id: 'ts-2',
    name: 'Slow for Slow',
    category: 'Foundational Pacing',
    tagline: 'Step-by-step deconstruction with zero-anxiety spaced repetition',
    description: 'Deconstructs complex grammar into digestible micro-units with multi-angle visual reinforcement, patient audio calibration, and confidence-building exercises.',
    pacingModel: 'Gradual Micro-Pacing (0.8x Speed)',
    targetLearner: 'Beginners & Anxious Learners',
    defaultActive: true
  },
  {
    id: 'ts-3',
    name: 'Executive & Professional',
    category: 'Corporate Mastery',
    tagline: 'Business cases, boardroom negotiations & professional email syntax',
    description: 'Focuses strictly on high-stakes corporate communication, formal etiquette, technical negotiations, and C-level executive presentation formats.',
    pacingModel: 'Direct & Scenario-Based',
    targetLearner: 'Working Executives & Corporate Teams',
    defaultActive: true
  },
  {
    id: 'ts-4',
    name: 'Kids & Young Learners',
    category: 'Gamified Immersion',
    tagline: 'Gamified mnemonics, animated songs & interactive story quests',
    description: 'Maximizes engagement through animated character dialogues, catchy musical mnemonics, color-coded picture flashcards, and gamified badge achievements.',
    pacingModel: 'Playful & High Engagement',
    targetLearner: 'Children & Young Students (Ages 6–14)',
    defaultActive: false
  },
  {
    id: 'ts-5',
    name: 'Scientific & Mathematical',
    category: 'Logical & Structural',
    tagline: 'Structural grammar theorems, logical syntax proofs & algorithmic formulas',
    description: 'Treats grammar rules as logical equations and mathematical schemas. Provides modular syntax trees, rule derivations, and deterministic linguistic structures.',
    pacingModel: 'Analytical & Rule-Driven',
    targetLearner: 'Engineers, Analysts & STEM Students',
    defaultActive: false
  },
  {
    id: 'ts-6',
    name: 'Immersion & Socratic Dialogue',
    category: 'Conversational Fluency',
    tagline: '100% target-language environment with provocative inquiry debates',
    description: 'Enforces complete immersion without mother-tongue translation. The AI prompts thought-provoking Socratic questions to stimulate spontaneous oral formulation.',
    pacingModel: 'Active Dialectic & Immersion',
    targetLearner: 'B1–C2 Advanced Speakers',
    defaultActive: false
  },
  {
    id: 'ts-7',
    name: 'Storytelling & Scenario Roleplay',
    category: 'Experiential Context',
    tagline: 'Narrative-driven daily immersion & realistic workplace roleplay',
    description: 'Embeds vocabulary into compelling episodic storytelling (e.g. relocating to Berlin, hospital rounds, airport immigration) for natural contextual retention.',
    pacingModel: 'Episodic & Narrative',
    targetLearner: 'Job Seekers & Expats',
    defaultActive: false
  },
  {
    id: 'ts-8',
    name: 'Clinical & Medical Healthcare',
    category: 'Vocational Specialized',
    tagline: 'Doctor-patient consultations, medical history (Anamnese) & FSP prep',
    description: 'Tailored for doctors, dentists, and nurses preparing for the German Fachsprachprüfung (FSP). Focuses on anamnese interviews, Arztbrief writing, and medical diagnosis.',
    pacingModel: 'Clinical Simulation',
    targetLearner: 'Healthcare Professionals',
    defaultActive: false
  },
  {
    id: 'ts-9',
    name: 'Exam & Certification Drills',
    category: 'Test Preparation',
    tagline: 'Goethe, Telc & IELTS Band 8.5+ timed test tactics & scoring rubric mocks',
    description: 'Targeted test simulations with strict countdown timers, Cambridge/Goethe official scoring rubrics, graph interpretation strategies, and timed essay evaluations.',
    pacingModel: 'Timed Mock & Rigorous Drills',
    targetLearner: 'Exam Candidates & Visa Seekers',
    defaultActive: false
  },
  {
    id: 'ts-10',
    name: 'Visual & Mind-Mapping Architecture',
    category: 'Visual Cognition',
    tagline: 'Infographic grammar charts, color-coded case diagrams & memory maps',
    description: 'Uses rich visual anchors, color-coded grammatical cases (Nom/Akk/Dat/Gen), interactive infographics, and spatial mind maps for visual memory encoding.',
    pacingModel: 'Visual-Spatial Encoding',
    targetLearner: 'Visual & Kinesthetic Learners',
    defaultActive: false
  }
];

export const DEFAULT_STUDENT_ANALYZING_STRATEGIES: StudentAnalyzingStrategy[] = [
  {
    id: 'sas-1',
    name: 'Catch-up Speed & Comprehension Velocity',
    targetMetric: 'Time to First Correct Response',
    threshold: '< 15 Seconds (Optimal)',
    description: 'Measures the time taken to grasp and respond to new concept prompts, dynamically increasing or reducing cognitive load.',
    adaptationAction: 'If speed drops below 60%, automatically inject a step-by-step deconstruction card.',
    active: true
  },
  {
    id: 'sas-2',
    name: 'Quiz & Exam Performance Scoring',
    targetMetric: 'Formative Assessment Accuracy',
    threshold: '≥ 85% Pass Mark',
    description: 'Tracks real-time quiz response accuracy and error clustering across key grammatical and technical competencies.',
    adaptationAction: 'Trigger targeted flashcard drill upon 2 consecutive incorrect attempts.',
    active: true
  },
  {
    id: 'sas-3',
    name: 'Attendance & Class Flow Continuity',
    targetMetric: 'Session Engagement & Punctuality',
    threshold: '≥ 90% Class Presence',
    description: 'Monitors student login punctuality, session duration, drop-off timestamps, and learning rhythm across consecutive days.',
    adaptationAction: 'Alert tutor and provide a 3-minute rapid catch-up summary for late joiners.',
    active: true
  },
  {
    id: 'sas-4',
    name: 'Response Accuracy & Error Recurrence',
    targetMetric: 'Persistent Error Frequency',
    threshold: '< 2 Recurring Mistakes',
    description: 'Categorizes recurring mistake types (e.g. Dative vs Accusative, article agreement) to identify systemic weak points.',
    adaptationAction: 'Auto-compile a personalized "Mistake Buster" micro-lesson at the end of each module.',
    active: true
  },
  {
    id: 'sas-5',
    name: 'Prompt Quality & Inquiry Depth',
    targetMetric: 'Syntactic & Contextual Complexity',
    threshold: 'Level B1+ Depth',
    description: 'Assesses the vocabulary maturity, question phrasing, and conceptual curiosity in student doubts and chat messages.',
    adaptationAction: 'Elevate AI tutor conversational complexity when student demonstrates high prompt depth.',
    active: true
  },
  {
    id: 'sas-6',
    name: 'Professional Intent & Career Alignment',
    targetMetric: 'Vocational Relevancy Index',
    threshold: '100% Industry Aligned',
    description: 'Maps student background (engineering, healthcare, IT, management) to tailor conversational examples to real workplace tasks.',
    adaptationAction: 'Swap generic daily examples with enterprise-grade clinical or tech case studies.',
    active: true
  },
  {
    id: 'sas-7',
    name: 'Audio Pronunciation & Phonetic Pitch',
    targetMetric: 'Acoustic Phoneme Match Score',
    threshold: '≥ 80% Native Waveform Match',
    description: 'Analyzes spoken audio waveforms, syllable stress, Umlaut clarity, and vocal hesitation during speaking drills.',
    adaptationAction: 'Display instant visual mouth-shape diagrams and waveform comparison overlays.',
    active: true
  },
  {
    id: 'sas-8',
    name: 'Retention & Spaced Memory Decay',
    targetMetric: 'Recall Rate across Intervals',
    threshold: '≥ 75% at 7-Day Marker',
    description: 'Tests retention of previously cleared concepts across 24-hour, 7-day, and 30-day spaced repetition checkpoints.',
    adaptationAction: 'Insert dynamic 60-second "Spaced Refreshers" into upcoming class intros.',
    active: true
  },
  {
    id: 'sas-9',
    name: 'Interactive Whiteboard & Activity Index',
    targetMetric: 'Canvas & Widget Interaction Rate',
    threshold: '≥ 5 Actions per Topic',
    description: 'Monitors cursor movement, whiteboard drawing participation, audio playback clicks, and exercise completion speed.',
    adaptationAction: 'Prompt inactive students with direct interactive multiple-choice popups.',
    active: true
  },
  {
    id: 'sas-10',
    name: 'Sentiment & Frustration Pattern Detection',
    targetMetric: 'Hesitation & Sentiment Score',
    threshold: 'Positive / Neutral Confidence',
    description: 'Detects repeated backspaces, long hesitation pauses (>30s), and negative sentiment keywords indicating confusion.',
    adaptationAction: 'Trigger encouraging AI voice affirmation and simplify the active exercise prompt.',
    active: true
  }
];

export interface AICoursePayload {
  curriculumOverview?: string;
  sourceLibraries?: string[];
  strategiesApplied?: string[];
  studentAnalyzingRules?: StudentAnalyzingStrategy[];
  multimediaConditions?: {
    primaryInstructionPrompt?: string;
    grammarComplexity?: string;
    vocabRange?: string;
    clipDurationBounds?: string;
    exerciseFrequency?: string;
    accentPreference?: string;
    passScoreThreshold?: string;
  };
  aiLibraryCategory?: 'Intelli Coach Classes' | 'Video + AI Answering Classes';
  aiTutorPersona?: string;
  generatedWhiteboardNotes?: string;
  testApprovalStatus?: 'Pending Review' | 'Approved' | 'Requires Refinement';
  recordedSessionUrl?: string;
  recordedSessionDate?: string;
  sampleExercise?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  customChapters?: {
    id: string;
    title: string;
    type: 'intro' | 'text' | 'video' | 'picture' | 'song';
    duration: string;
    status: 'Completed' | 'Ready' | 'AI Active';
    subtitles?: {
      id: string;
      title: string;
      timestamp: string;
      seconds: number;
      status: string;
      topic: string;
      notes: string;
      keyRules: string;
      practicePrompt: string;
    }[];
  }[];
}

export interface GlobalCourse {
  id: string;
  name: string;
  top_title?: string;
  subtitle: string;
  show_in_sub_nav?: boolean;
  displayPosition: number;
  viewType?: 'Main View' | 'Blocks View' | 'Both';
  aiLibrarySection?: 'Intelli Coach Classes' | 'Video + AI Answering Classes';
  teachingStrategies?: string[];
  studentAnalyzingStrategies?: StudentAnalyzingStrategy[];
  multimediaConditions?: {
    primaryInstructionPrompt?: string;
    grammarComplexity?: string;
    vocabRange?: string;
    clipDurationBounds?: string;
    exerciseFrequency?: string;
    accentPreference?: string;
    passScoreThreshold?: string;
  };
  testApprovalStatus?: 'Pending Review' | 'Approved' | 'Requires Refinement';
  recordedSessionUrl?: string;
  recordedSessionDate?: string;
  staff: string;
  chapter: string;
  duration: string;
  methods: string;
  pathId?: string;
  pathName?: string;
  batchId?: string;
  batchName?: string;
  materials: string;
  materialItems?: CourseMaterialItem[];
  fee: string;
  students: string;
  courseStructure?: string; // stores dynamic structured details/modules
  category?: string;
  subCategory?: string;
  libraryType?: 'TUTOR' | 'AI';
  enrolledStudentsList?: EnrolledStudent[];
  aiPayload?: AICoursePayload;
}

// Initial Seed Data
const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    type: 'Walk-in',
    tokenNumber: 'ILA-WALK-101',
    course: 'German Language A1–C2',
    path: 'Intelli-Coach AI Trainer™',
    price: '$199.00',
    amountPaid: '$199.00',
    totalAmount: '$199.00',
    paymentStatus: 'Paid',
    classLink: 'https://ilas.global/classroom/join/de-a1-sharma',
    category: 'Education',
    department: 'Education',
    source: 'Front-Desk Reception',
    crmStatus: 'Closed Won',
    pipelineStage: 'Processing',
    assignedStaffId: 'STAFF-003',
    assignedStaffName: 'Priya Sundaram (Senior Counselor)',
    intakeNotes: 'Candidate visited campus with parents. Enrolled on spot for German B1 intensive batch starting next Monday.',
    visitorDetails: {
      purpose: 'Course Enrollment & Demo',
      accompaniedBy: 2,
      idProofVerified: true,
      checkInTime: '09:30 AM',
      receptionistName: 'Meera Kapoor'
    },
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    followUpStatus: 'Scheduled',
    followUpHistory: [
      {
        id: 'fl-1',
        date: new Date().toLocaleDateString(),
        staffName: 'Priya Sundaram',
        channel: 'In-Person',
        notes: 'Completed intake orientation, provided digital classroom link and study material kit.',
        outcome: 'Fee Paid'
      }
    ],
    visaProcessingStage: 'Not Applicable',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'inq-102',
    name: 'Rahul Varma',
    email: 'rahul.varma@techmail.com',
    phone: '+91 98112 34567',
    type: 'Walk-in',
    tokenNumber: 'ILA-WALK-102',
    course: 'German Opportunity Card (Chancenkarte)',
    path: 'Direct Embassy Fast-Track™',
    price: '$499.00',
    amountPaid: '$200.00',
    totalAmount: '$499.00',
    paymentStatus: 'Partially Paid',
    category: 'Visa',
    department: 'Visa',
    source: 'Walk-in Reception',
    crmStatus: 'In Progress',
    pipelineStage: 'Documentation',
    assignedStaffId: 'STAFF-004',
    assignedStaffName: 'Dr. Klaus Mueller (Visa Head)',
    intakeNotes: 'Walk-in candidate seeking Chancenkarte points evaluation. B1 German certificate available; needs APS document verification.',
    visitorDetails: {
      purpose: 'Visa & Points Verification',
      accompaniedBy: 0,
      idProofVerified: true,
      checkInTime: '10:15 AM',
      receptionistName: 'Meera Kapoor'
    },
    followUpDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday -> Overdue 3-day touchpoint
    followUpStatus: 'Overdue',
    followUpHistory: [
      {
        id: 'fl-2',
        date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
        staffName: 'Dr. Klaus Mueller',
        channel: 'In-Person',
        notes: 'Initial profile points assessed at 75 points. Awaiting blocked account deposit confirmation.',
        outcome: 'Docs Pending'
      }
    ],
    visaProcessingStage: 'APS Certificate',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'inq-103',
    name: 'Kavita Patel',
    email: 'kavita.patel@globaledu.com',
    phone: '+91 97234 56789',
    type: 'Online',
    tokenNumber: 'ILA-WEB-301',
    course: 'TU Munich M.Sc. Informatics Track',
    path: 'Direct University Admissions',
    price: '$650.00',
    amountPaid: '$0.00',
    totalAmount: '$650.00',
    paymentStatus: 'Contacted',
    category: 'Study Abroad',
    department: 'Study Abroad',
    source: 'Website Study Abroad Portal',
    crmStatus: 'New Lead',
    pipelineStage: 'Assessment',
    aiScore: 94,
    aiPath: 'Public University Zero-Tuition Master Track',
    assignedStaffId: 'STAFF-005',
    assignedStaffName: 'Marcus Vance (Study Abroad Advisor)',
    intakeNotes: 'Submitted online assessment with 8.8 CGPA in Computer Science. Target Winter Intake 2026.',
    followUpDate: new Date().toISOString().split('T')[0], // Today -> Due Today
    followUpStatus: 'Due Today',
    visaProcessingStage: 'Profile Assessment',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'inq-104',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@devops.io',
    phone: '+91 99401 23456',
    type: 'Walk-in',
    tokenNumber: 'ILA-WALK-103',
    course: 'Cloud & DevOps European Placement',
    path: 'Corporate Talent Match',
    price: '$750.00',
    amountPaid: '$750.00',
    totalAmount: '$750.00',
    paymentStatus: 'Paid',
    category: 'Jobs',
    department: 'Jobs',
    source: 'Bangalore Walk-in Center',
    crmStatus: 'In Progress',
    pipelineStage: 'Processing',
    assignedStaffId: 'STAFF-006',
    assignedStaffName: 'Anjali Nair (Placement Lead)',
    intakeNotes: '5 years AWS/Kubernetes experience. Needs Europass CV localization and direct German client mock interviews.',
    visitorDetails: {
      purpose: 'Technical Job Screening',
      accompaniedBy: 1,
      idProofVerified: true,
      checkInTime: '11:45 AM',
      receptionistName: 'Meera Kapoor'
    },
    followUpDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    followUpStatus: 'Scheduled',
    followUpHistory: [
      {
        id: 'fl-3',
        date: new Date().toLocaleDateString(),
        staffName: 'Anjali Nair',
        channel: 'Phone Call',
        notes: 'Sent CV template and booked first interview simulation with German hiring partner.',
        outcome: 'Appointment Booked'
      }
    ],
    visaProcessingStage: 'Not Applicable',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'inq-105',
    name: 'Deepak Menon',
    email: 'deepak.menon@healthcare.in',
    phone: '+91 94471 88990',
    type: 'Online',
    tokenNumber: 'ILA-WEB-302',
    course: 'Dual Ausbildung (Healthcare & Nursing)',
    path: 'Work While You Study Dual Track',
    price: '$350.00',
    amountPaid: '$0.00',
    totalAmount: '$350.00',
    paymentStatus: 'Pending',
    category: 'Work While You Study',
    department: 'Work While You Study',
    source: 'Website Hero Form',
    crmStatus: 'New Lead',
    pipelineStage: 'Intake',
    aiScore: 88,
    aiPath: 'German Hospital Dual Syndicate Track',
    assignedStaffId: 'STAFF-007',
    assignedStaffName: 'Stefan Wagner (Ausbildung Coordinator)',
    intakeNotes: 'Registered B.Sc Nursing candidate interested in €1,200/month stipend dual apprenticeship program in Munich.',
    followUpDate: new Date().toISOString().split('T')[0], // Today -> Due Today
    followUpStatus: 'Due Today',
    visaProcessingStage: 'Profile Assessment',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const SEED_VISITOR_LOGS: VisitorLog[] = [
  { id: 'v1', page: 'Front Desk Reception', timeSpent: 340, timestamp: new Date(Date.now() - 10 * 60000).toLocaleString() },
  { id: 'v2', page: 'Visa Eligibility Calculator', timeSpent: 180, timestamp: new Date(Date.now() - 25 * 60000).toLocaleString() }
];

const SEED_TASKS: EnterpriseTask[] = [
  {
    id: 't1',
    title: 'German Hub Expansion Audit',
    description: 'Verify regional compliance and onboarding queues for Q3.',
    assignedToDept: 'Visa',
    status: 'In Progress',
    priority: 'High',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
];

const SEED_STAFF: StaffUser[] = [
  { id: 'STAFF-001', email: 'admin@ilas.global', password: '', name: 'Super Admin', department: 'Super Admin', phone: '+49 176 0000001', joiningDate: '2025-01-01', status: 'Active' },
  { id: 'STAFF-002', email: 'hr@ilas.global', password: '', name: 'HR Manager Lead', department: 'HR Manager', phone: '+49 176 0000002', joiningDate: '2025-06-15', status: 'Active' },
  { id: 'STAFF-003', email: 'priya.s@ilas.global', password: '', name: 'Priya Sundaram (Senior Counselor)', department: 'Academic Counselor', phone: '+91 98450 11223', joiningDate: '2025-03-10', status: 'Active' },
  { id: 'STAFF-004', email: 'klaus.m@ilas.global', password: '', name: 'Dr. Klaus Mueller (Visa Head)', department: 'Visa', phone: '+49 176 4433221', joiningDate: '2025-02-01', status: 'Active' },
  { id: 'STAFF-005', email: 'marcus.v@ilas.global', password: '', name: 'Marcus Vance (Study Abroad Advisor)', department: 'Education', phone: '+49 176 8899001', joiningDate: '2025-04-12', status: 'Active' },
  { id: 'STAFF-006', email: 'anjali.n@ilas.global', password: '', name: 'Anjali Nair (Placement Lead)', department: 'HR Manager', phone: '+91 98711 22334', joiningDate: '2025-05-20', status: 'Active' },
  { id: 'STAFF-007', email: 'stefan.w@ilas.global', password: '', name: 'Stefan Wagner (Ausbildung Coordinator)', department: 'Education', phone: '+49 176 5544332', joiningDate: '2025-07-01', status: 'Active' },
  { id: 'STAFF-008', email: 'meera.k@ilas.global', password: '', name: 'Meera Kapoor (Front Desk Officer)', department: 'Super Admin', phone: '+91 98100 99887', joiningDate: '2025-08-01', status: 'Active' }
];

const SEED_ATTENDANCE: AttendanceLog[] = [
  { id: 'ATT-1', staffId: 'STAFF-001', staffName: 'Super Admin', checkInTime: '09:00 AM', status: 'Present', date: new Date().toLocaleDateString() },
  { id: 'ATT-2', staffId: 'STAFF-008', staffName: 'Meera Kapoor (Front Desk Officer)', checkInTime: '08:45 AM', status: 'Present', date: new Date().toLocaleDateString() },
  { id: 'ATT-3', staffId: 'STAFF-003', staffName: 'Priya Sundaram', checkInTime: '09:10 AM', status: 'Present', date: new Date().toLocaleDateString() },
  { id: 'ATT-4', staffId: 'STAFF-004', staffName: 'Dr. Klaus Mueller', checkInTime: '09:15 AM', status: 'Present', date: new Date().toLocaleDateString() }
];

// DB Retrieval & Save Functions
export const getGlobalCategories = (): GlobalCategory[] => {
  const data = localStorage.getItem('ilas_categories');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_categories from localStorage, resetting to seed:', e);
    }
  }
  const seed: GlobalCategory[] = [
    {
      id: 'cat-1',
      name: 'Education & Languages',
      code: 'EDU-LANG',
      description: 'Foreign language certifications, CEFR tracks, and academic testing pathways.',
      subCategories: ['German Language (A1–C2)', 'IELTS / TOEFL / PTE', 'Medical German & FSP', 'French & Spanish']
    },
    {
      id: 'cat-2',
      name: 'Software & IT Training',
      code: 'TECH-SW',
      description: 'Modern full-stack engineering, cloud architecture, and DevOps tracks.',
      subCategories: ['Full-Stack Web Dev (React/Node)', 'Cloud DevOps & AWS', 'Python & AI Engineering', 'Cybersecurity']
    },
    {
      id: 'cat-3',
      name: 'Enterprise ERP & SAP',
      code: 'ERP-SAP',
      description: 'SAP S/4HANA functional modules, logistics, and financial workflows.',
      subCategories: ['SAP FICO (Financials)', 'SAP MM (Supply Chain)', 'SAP SD (Sales)', 'SAP S/4HANA Architecture']
    },
    {
      id: 'cat-4',
      name: 'Digital Marketing & Growth',
      code: 'MKT-GROWTH',
      description: 'Performance marketing, Meta & Google ads, and AI automation.',
      subCategories: ['Meta & Google Ads Strategy', 'AI Copywriting & SEO', 'Growth Automation & CRM', 'Viral Social Content']
    },
    {
      id: 'cat-5',
      name: 'Healthcare & Clinical Practice',
      code: 'MED-CARE',
      description: 'Medical terminology, nurse licensing, and German hospital clinical communications.',
      subCategories: ['Fachsprachprüfung (FSP)', 'Kenntnisprüfung (KP)', 'Clinical Nursing Standards', 'Doctor-Patient Intake']
    }
  ];
  localStorage.setItem('ilas_categories', JSON.stringify(seed));
  return seed;
};

export const setGlobalCategories = (categories: GlobalCategory[]) => {
  localStorage.setItem('ilas_categories', JSON.stringify(categories));
  window.dispatchEvent(new CustomEvent('ilas-categories-changed'));
};

export const getGlobalPaths = (): GlobalPath[] => {
  const data = localStorage.getItem('ilas_paths');
  if (data) {
    try {
      const parsed: GlobalPath[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.some(p => p.name.includes('Path 1 Test'))) {
        return parsed.sort((a, b) => (a.position || 99) - (b.position || 99));
      }
    } catch (e) {
      console.warn('Failed to parse ilas_paths from localStorage, resetting to seed:', e);
    }
  }
  const seed: GlobalPath[] = [
    // Paths for Course 1: German Language Test 1
    { id: 'p1-1', name: 'Path 1 Test - Intelli-Coach AI Adaptive Path', methods: 'AI + Adaptive Tutoring & Real-time Accent Coach', position: 1, starting: '2026-10-12', ending: '2026-12-12', remarks: '24/7 Intelligent Pacing', linkedCourseId: '1', linkedCourseName: 'German Language Test 1' },
    { id: 'p1-2', name: 'Path 2 Test - Interactive Video Labs & Workbooks', methods: 'Video Masterclass + Grammar Architecture Practice', position: 2, starting: '2026-10-15', ending: '2026-11-15', remarks: 'Self-paced with weekly assessments', linkedCourseId: '1', linkedCourseName: 'German Language Test 1' },
    { id: 'p1-3', name: 'Path 3 Test - Live Native Mentor Cohort', methods: 'Live Instructor 1-on-1 Dialogue & Mock Exam Simulation', position: 3, starting: '2026-10-20', ending: '2027-01-20', remarks: 'Weekend interactive cohorts', linkedCourseId: '1', linkedCourseName: 'German Language Test 1' },
    { id: 'p1-4', name: 'Path 4 Test - Clinical & Technical German Track', methods: 'Healthcare & Engineering Specialized Vocabulary', position: 4, starting: '2026-11-01', ending: '2027-02-01', remarks: 'Hospital / Industry Readiness', linkedCourseId: '1', linkedCourseName: 'German Language Test 1' },

    // Paths for Course 2: IELTS Test 2
    { id: 'p2-1', name: 'Path 1 Test - Band 8.5+ Strategy Masterclass', methods: 'Cambridge Official Framework + Timed Reading Drills', position: 1, starting: '2026-10-15', ending: '2026-11-30', remarks: 'High Band Target', linkedCourseId: '2', linkedCourseName: 'IELTS Test 2' },
    { id: 'p2-2', name: 'Path 2 Test - AI Essay & Writing Evaluation Clinic', methods: 'Automated Lexical & Grammar Scoring Engine', position: 2, starting: '2026-10-18', ending: '2026-11-20', remarks: 'Task 1 & Task 2 Mastery', linkedCourseId: '2', linkedCourseName: 'IELTS Test 2' },
    { id: 'p2-3', name: 'Path 3 Test - Live 1-on-1 Mock Speaking Panel', methods: 'Certified Cambridge Native Examiner Mock Sessions', position: 3, starting: '2026-10-25', ending: '2026-12-15', remarks: 'Speaking Confidence Booster', linkedCourseId: '2', linkedCourseName: 'IELTS Test 2' },
    { id: 'p2-4', name: 'Path 4 Test - FastTrack 30-Day Intensive Lab', methods: 'Daily Speed-Drills & High-Conversion Templates', position: 4, starting: '2026-11-01', ending: '2026-12-01', remarks: 'Fast Assessment', linkedCourseId: '2', linkedCourseName: 'IELTS Test 2' },

    // Paths for Course 3: Software Test 3
    { id: 'p3-1', name: 'Path 1 Test - Full-Stack React 19 & TypeScript', methods: 'Frontend Engineering & Enterprise Design Systems', position: 1, starting: '2026-10-20', ending: '2027-01-20', remarks: 'Modern Production Stack', linkedCourseId: '3', linkedCourseName: 'Software Test 3' },
    { id: 'p3-2', name: 'Path 2 Test - Node.js, Express & Cloud Microservices', methods: 'Backend Architecture, PostgreSQL & REST APIs', position: 2, starting: '2026-10-25', ending: '2027-02-10', remarks: 'Scalable Systems', linkedCourseId: '3', linkedCourseName: 'Software Test 3' },
    { id: 'p3-3', name: 'Path 3 Test - DevOps, Docker, CI/CD & Cloud Deploy', methods: 'Automated Pipelines & Cloud Infrastructure Lab', position: 3, starting: '2026-11-01', ending: '2027-02-28', remarks: 'Direct Job Deployment', linkedCourseId: '3', linkedCourseName: 'Software Test 3' },
    { id: 'p3-4', name: 'Path 4 Test - Enterprise AI Pair-Programming Lab', methods: 'AI Copilots, Refactoring & Code Quality Systems', position: 4, starting: '2026-11-15', ending: '2027-03-01', remarks: 'Cutting-Edge Tools', linkedCourseId: '3', linkedCourseName: 'Software Test 3' },

    // Paths for Course 4: SAP Course Test 4
    { id: 'p4-1', name: 'Path 1 Test - SAP FICO Financial Accounting Simulation', methods: 'General Ledger, Accounts Payable/Receivable & Asset Mgt', position: 1, starting: '2026-11-01', ending: '2027-01-15', remarks: 'Enterprise Hands-On Lab', linkedCourseId: '4', linkedCourseName: 'SAP Course Test 4' },
    { id: 'p4-2', name: 'Path 2 Test - SAP MM/SD Supply Chain Logistics', methods: 'Procurement, Inventory Management & Sales Order Workflows', position: 2, starting: '2026-11-05', ending: '2027-01-20', remarks: 'Supply Chain Operations', linkedCourseId: '4', linkedCourseName: 'SAP Course Test 4' },
    { id: 'p4-3', name: 'Path 3 Test - SAP S/4HANA Cloud Integration & Reporting', methods: 'Universal Journal & Real-Time Enterprise Analytics', position: 3, starting: '2026-11-10', ending: '2027-02-05', remarks: 'S/4HANA Migration Lab', linkedCourseId: '4', linkedCourseName: 'SAP Course Test 4' },
    { id: 'p4-4', name: 'Path 4 Test - Corporate Practical Certification Lab', methods: 'Live Enterprise Sandbox & Case-Study Audits', position: 4, starting: '2026-11-20', ending: '2027-02-15', remarks: 'Certified SAP Practice', linkedCourseId: '4', linkedCourseName: 'SAP Course Test 4' }
  ];
  localStorage.setItem('ilas_paths', JSON.stringify(seed));
  return seed.sort((a, b) => (a.position || 99) - (b.position || 99));
};

export const setGlobalPaths = (paths: GlobalPath[]) => {
  const sorted = [...paths].sort((a, b) => (a.position || 99) - (b.position || 99));
  localStorage.setItem('ilas_paths', JSON.stringify(sorted));
  window.dispatchEvent(new CustomEvent('ilas-paths-changed'));
};

export const getGlobalBatches = (): GlobalBatch[] => {
  const data = localStorage.getItem('ilas_batches');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_batches from localStorage, resetting to seed:', e);
    }
  }
  const seed: GlobalBatch[] = [
    { id: '1', name: 'Morning Batch A1', timings: ['09:00 - 11:00', '11:30 - 13:30'], starting: '2026-10-12', remarks: 'Fast Filling', linkedCourseId: '1', linkedCourseName: 'German Language Test 1', linkedPathId: 'p1-1', linkedPathName: 'Path 1 Test - Intelli-Coach AI Adaptive Path' },
    { id: '2', name: 'Evening Intensive Batch', timings: ['18:00 - 20:00'], starting: '2026-10-15', remarks: 'Open for Registration', linkedCourseId: '2', linkedCourseName: 'IELTS Test 2', linkedPathId: 'p2-1', linkedPathName: 'Path 1 Test - Band 8.5+ Strategy Masterclass' },
    { id: '3', name: 'Weekend Tech Bootcamp', timings: ['14:00 - 18:00 (Sat-Sun)'], starting: '2026-10-20', remarks: 'Available', linkedCourseId: '3', linkedCourseName: 'Software Test 3', linkedPathId: 'p3-1', linkedPathName: 'Path 1 Test - Full-Stack React 19 & TypeScript' },
    { id: '4', name: 'Weekday Corporate Slot', timings: ['10:00 - 12:00'], starting: '2026-11-01', remarks: 'Enterprise Direct', linkedCourseId: '4', linkedCourseName: 'SAP Course Test 4', linkedPathId: 'p4-1', linkedPathName: 'Path 1 Test - SAP FICO Financial Accounting Simulation' }
  ];
  localStorage.setItem('ilas_batches', JSON.stringify(seed));
  return seed;
};

export const setGlobalBatches = (batches: GlobalBatch[]) => {
  localStorage.setItem('ilas_batches', JSON.stringify(batches));
  window.dispatchEvent(new CustomEvent('ilas-batches-changed'));
};

export const getGlobalTeachingStrategies = (): TeachingStrategy[] => {
  const data = localStorage.getItem('ilas_teaching_strategies');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_teaching_strategies:', e);
    }
  }
  localStorage.setItem('ilas_teaching_strategies', JSON.stringify(DEFAULT_TEACHING_STRATEGIES));
  return DEFAULT_TEACHING_STRATEGIES;
};

export const setGlobalTeachingStrategies = (strategies: TeachingStrategy[]) => {
  localStorage.setItem('ilas_teaching_strategies', JSON.stringify(strategies));
  window.dispatchEvent(new CustomEvent('ilas-teaching-strategies-changed'));
};

export const getGlobalStudentAnalyzingStrategies = (): StudentAnalyzingStrategy[] => {
  const data = localStorage.getItem('ilas_student_analyzing_strategies');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_student_analyzing_strategies:', e);
    }
  }
  localStorage.setItem('ilas_student_analyzing_strategies', JSON.stringify(DEFAULT_STUDENT_ANALYZING_STRATEGIES));
  return DEFAULT_STUDENT_ANALYZING_STRATEGIES;
};

export const setGlobalStudentAnalyzingStrategies = (strategies: StudentAnalyzingStrategy[]) => {
  localStorage.setItem('ilas_student_analyzing_strategies', JSON.stringify(strategies));
  window.dispatchEvent(new CustomEvent('ilas-student-analyzing-strategies-changed'));
};

export const getGlobalCourses = (): GlobalCourse[] => {
  const data = localStorage.getItem('ilas_courses');
  if (data) {
    try {
      const parsed: GlobalCourse[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.some(c => c.name === 'German Language Test 1')) {
        return parsed.sort((a, b) => (a.displayPosition || 99) - (b.displayPosition || 99));
      }
    } catch (e) {
      console.warn('Failed to parse ilas_courses from localStorage, resetting to seed:', e);
    }
  }
  const seed: GlobalCourse[] = [
    { 
      id: '1', 
      name: 'German Language Test 1', 
      top_title: 'German Language & Proficiency', 
      subtitle: 'Goethe & Telc Standard Certification Pathways with Clinical & Technical German', 
      show_in_sub_nav: true, 
      displayPosition: 1, 
      viewType: 'Main View',
      staff: 'Nadeem - ID 091 (Senior German Specialist)', 
      chapter: '24', 
      duration: '16 Weeks', 
      methods: 'Path 1 Test - Intelli-Coach AI Adaptive Path [AI + Adaptive Tutoring]', 
      pathId: 'p1-1', 
      pathName: 'Path 1 Test - Intelli-Coach AI Adaptive Path', 
      batchId: '1', 
      batchName: 'Morning Batch A1', 
      materials: 'Digital Library & Goethe Workbooks', 
      fee: '$199', 
      students: '180', 
      category: 'Education & Languages',
      subCategory: 'German Language (A1–C2)',
      libraryType: 'TUTOR',
      enrolledStudentsList: [
        { id: 's1', name: 'Ananya Sharma', email: 'ananya.sharma@gmail.com', status: 'In Class', joinedAt: '09:00 AM', attendanceScore: 98 },
        { id: 's2', name: 'Lukas Meyer', email: 'lukas.m@tum.de', status: 'Present', joinedAt: '09:05 AM', attendanceScore: 95 }
      ],
      courseStructure: 'Module 1: CEFR A1 Fundamentals, Phonetics & Survival Vocabulary\nModule 2: CEFR A2 Daily Conversational & Workplace Dialogues\nModule 3: CEFR B1 Complex Sentence Structure & Business German\nModule 4: CEFR B2 Professional, Clinical & Technical Certification Mastery\nModule 5: Official Goethe / Telc Mock Simulations & Live Oral Prep' 
    },
    { 
      id: '2', 
      name: 'IELTS Test 2', 
      top_title: 'English Language Mastery', 
      subtitle: 'Target Band 8.0+ Academic & General Strategies with AI Essay Evaluation', 
      show_in_sub_nav: true, 
      displayPosition: 2, 
      viewType: 'Main View',
      staff: 'AI Bot & Cambridge Certified Mentor', 
      chapter: '16', 
      duration: '8 Weeks', 
      methods: 'Path 1 Test - Band 8.5+ Strategy Masterclass [Cambridge Mock Labs]', 
      pathId: 'p2-1', 
      pathName: 'Path 1 Test - Band 8.5+ Strategy Masterclass', 
      batchId: '2', 
      batchName: 'Evening Intensive Batch', 
      materials: 'Cambridge Mock Portal & Audio Labs', 
      fee: '$149', 
      students: '240', 
      category: 'Education & Languages',
      subCategory: 'IELTS / TOEFL / PTE',
      libraryType: 'AI',
      enrolledStudentsList: [
        { id: 's5', name: 'Rahul Varma', email: 'rahul.varma@gmail.com', status: 'In Class', joinedAt: '18:00 PM', attendanceScore: 96 }
      ],
      courseStructure: 'Module 1: Speaking Mock Interviews & Band 8.5 Accent Tuning\nModule 2: Academic Writing Task 1 & 2 Strategies & AI Essay Feedback\nModule 3: Critical Reading, Skimming & Scanning Drills\nModule 4: Multi-Accent Audio Listening Precision & Cambridge Mocks' 
    },
    { 
      id: '3', 
      name: 'Software Test 3', 
      top_title: 'Full-Stack & Cloud Architecture', 
      subtitle: 'Modern React, Node, DevOps, Microservices & AI Pair Programming', 
      show_in_sub_nav: true, 
      displayPosition: 3, 
      viewType: 'Main View',
      staff: 'Jane - ID 092 (Lead Cloud Architect)', 
      chapter: '32', 
      duration: '24 Weeks', 
      methods: 'Path 1 Test - Full-Stack React 19 & TypeScript [Live Instructor + Labs]', 
      pathId: 'p3-1', 
      pathName: 'Path 1 Test - Full-Stack React 19 & TypeScript', 
      batchId: '3', 
      batchName: 'Weekend Tech Bootcamp', 
      materials: 'Cloud Sandbox & Repos', 
      fee: '$599', 
      students: '95', 
      category: 'Software & IT Training',
      subCategory: 'Full-Stack Web Dev (React/Node)',
      libraryType: 'TUTOR',
      enrolledStudentsList: [
        { id: 's8', name: 'Vikram Mehta', email: 'vikram.m@dev.io', status: 'In Class', joinedAt: '14:00 PM', attendanceScore: 100 }
      ],
      courseStructure: 'Phase 1: React 19, TypeScript & Tailwind CSS Design Systems\nPhase 2: Node.js, Express, Microservices & PostgreSQL Databases\nPhase 3: Docker Containers, CI/CD Automated Pipelines & Cloud Deployments\nPhase 4: Live International Production Capstone Project' 
    },
    { 
      id: '4', 
      name: 'SAP Course Test 4', 
      top_title: 'Enterprise Software Training', 
      subtitle: 'Financials (FICO), Supply Chain & Logistics (MM/SD) Workflows', 
      show_in_sub_nav: true, 
      displayPosition: 4, 
      viewType: 'Main View',
      staff: 'Nadeem - ID 091 (SAP Certified Lead)', 
      chapter: '18', 
      duration: '10 Weeks', 
      methods: 'Path 1 Test - SAP FICO Financial Accounting Simulation [Corporate Labs]', 
      pathId: 'p4-1', 
      pathName: 'Path 1 Test - SAP FICO Financial Accounting Simulation', 
      batchId: '4', 
      batchName: 'Weekday Corporate Slot', 
      materials: 'SAP Sandbox Access & ECC/S4HANA Guides', 
      fee: '$499', 
      students: '60', 
      category: 'Enterprise ERP & SAP',
      subCategory: 'SAP FICO (Financials)',
      libraryType: 'TUTOR',
      enrolledStudentsList: [
        { id: 's10', name: 'Manish Gupta', email: 'manish.g@corp.de', status: 'In Class', joinedAt: '10:00 AM', attendanceScore: 95 }
      ],
      courseStructure: 'Module 1: SAP S/4HANA Enterprise Architecture & Navigation\nModule 2: Financial Ledger, General Accounting & Invoicing Systems\nModule 3: Procurement, Materials Management (MM) & Vendor Workflows\nModule 4: Sales & Distribution (SD), Enterprise Audit & Regulatory Reporting' 
    },
    { 
      id: '5', 
      name: 'Social Media & Growth AI', 
      top_title: 'Growth Marketing & Campaign Operations', 
      subtitle: 'Meta Ads, Google Ads, Viral Content Strategy & AI Copywriting', 
      show_in_sub_nav: false, 
      displayPosition: 5, 
      viewType: 'Blocks View',
      staff: 'Jane - ID 092 (Growth Lead)', 
      chapter: '12', 
      duration: '6 Weeks', 
      methods: 'Online FastTrack Video + AI [Video + AI Labs]', 
      pathId: '2', 
      pathName: 'Online FastTrack Video + AI', 
      batchId: '2', 
      batchName: 'Evening Intensive Batch', 
      materials: 'Ad Spend Simulator & Campaign Templates', 
      fee: '$179', 
      students: '110', 
      category: 'Digital Marketing & Growth',
      subCategory: 'Meta & Google Ads Strategy',
      libraryType: 'AI',
      enrolledStudentsList: [
        { id: 's12', name: 'Arjun Rao', email: 'arjun.growth@agency.com', status: 'In Class', joinedAt: '18:00 PM', attendanceScore: 91 }
      ],
      courseStructure: 'Module 1: High-Conversion Landing Pages\nModule 2: Search Engine Optimization (SEO)\nModule 3: Meta & Google Ads Architecture\nModule 4: AI Automation & CRM Lead Loops' 
    },
    { 
      id: '6', 
      name: 'Medical Terminology & FSP', 
      top_title: 'Healthcare German & Clinical Practice', 
      subtitle: 'Fachsprachprüfung (FSP) Preparation for Doctors, Dentists & Nurses', 
      show_in_sub_nav: false, 
      displayPosition: 6, 
      viewType: 'Blocks View',
      staff: 'Dr. Klaus (Clinical Mentor)', 
      chapter: '14', 
      duration: '12 Weeks', 
      methods: 'Live Enterprise Cohort [Live Instructor + Mentoring]', 
      pathId: '3', 
      pathName: 'Live Enterprise Cohort', 
      batchId: '1', 
      batchName: 'Morning Batch A1', 
      materials: 'Clinical Case Files & Simulated Audio Dialogues', 
      fee: '$399', 
      students: '45', 
      category: 'Healthcare & Clinical Practice',
      subCategory: 'Fachsprachprüfung (FSP)',
      libraryType: 'TUTOR',
      enrolledStudentsList: [
        { id: 's13', name: 'Dr. Anjali Nair', email: 'dr.anjali@med.de', status: 'In Class', joinedAt: '09:00 AM', attendanceScore: 99 }
      ],
      courseStructure: 'Unit 1: Doctor-Patient Consultations\nUnit 2: Medical History (Anamnese) Intake\nUnit 3: Clinical Documentation (Arztbrief)\nUnit 4: Mock Examination Panels' 
    }
  ];
  localStorage.setItem('ilas_courses', JSON.stringify(seed));
  return seed.sort((a, b) => (a.displayPosition || 99) - (b.displayPosition || 99));
};

export const setGlobalCourses = (courses: GlobalCourse[]) => {
  const sorted = [...courses].sort((a, b) => (a.displayPosition || 99) - (b.displayPosition || 99));
  localStorage.setItem('ilas_courses', JSON.stringify(sorted));
  window.dispatchEvent(new CustomEvent('ilas-courses-changed'));
};

export const getGlobalApprovals = (): ApprovalRequest[] => {
  const data = localStorage.getItem('ilas_global_approvals');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_global_approvals, resetting:', e);
    return [];
  }
};

export const addGlobalApproval = (approval: Omit<ApprovalRequest, 'id' | 'status' | 'date'>) => {
  const approvals = getGlobalApprovals();
  const newApproval: ApprovalRequest = {
    ...approval,
    id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    date: new Date().toLocaleDateString()
  };
  const updated = [newApproval, ...approvals];
  localStorage.setItem('ilas_global_approvals', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-approvals-changed'));
  return newApproval;
};

export const updateGlobalApproval = (id: string, status: 'Approved' | 'Rejected') => {
  const approvals = getGlobalApprovals();
  const updated = approvals.map(a => a.id === id ? { ...a, status } : a);
  localStorage.setItem('ilas_global_approvals', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-approvals-changed'));
  return updated;
};

export const getGlobalUpdates = (): UpdateLog[] => {
  const data = localStorage.getItem('ilas_global_updates');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_global_updates, resetting:', e);
    return [];
  }
};

export const addGlobalUpdate = (update: Omit<UpdateLog, 'id' | 'timestamp'>) => {
  const updates = getGlobalUpdates();
  const newUpdate: UpdateLog = {
    ...update,
    id: `UPD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleString()
  };
  const updated = [newUpdate, ...updates];
  localStorage.setItem('ilas_global_updates', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-updates-changed'));
  return newUpdate;
};

export const getInquiries = (): Inquiry[] => {
  const data = localStorage.getItem('ilas_inquiries');
  if (!data) {
    localStorage.setItem('ilas_inquiries', JSON.stringify(SEED_INQUIRIES));
    return SEED_INQUIRIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_inquiries, resetting to seed:', e);
    localStorage.setItem('ilas_inquiries', JSON.stringify(SEED_INQUIRIES));
    return SEED_INQUIRIES;
  }
};

export const saveInquiry = (inquiry: Omit<Inquiry, 'id' | 'timestamp'>): Inquiry[] => {
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  const updated = [newInquiry, ...inquiries];
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const updateInquiryStatus = (id: string, status: Inquiry['paymentStatus']): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === id) {
      return { ...item, paymentStatus: status };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const sendClassLink = (id: string, link: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === id) {
      return { ...item, paymentStatus: 'Link Sent' as const, classLink: link };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const getVisitorLogs = (): VisitorLog[] => {
  const data = localStorage.getItem('ilas_visitor_logs');
  if (!data) {
    localStorage.setItem('ilas_visitor_logs', JSON.stringify(SEED_VISITOR_LOGS));
    return SEED_VISITOR_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_visitor_logs, resetting to seed:', e);
    localStorage.setItem('ilas_visitor_logs', JSON.stringify(SEED_VISITOR_LOGS));
    return SEED_VISITOR_LOGS;
  }
};

export const logVisitorActivity = (page: string, timeSpent: number): void => {
  const logs = getVisitorLogs();
  const newLog: VisitorLog = {
    id: Math.random().toString(36).substr(2, 9),
    page,
    timeSpent,
    timestamp: new Date().toLocaleString()
  };
  logs.unshift(newLog);
  localStorage.setItem('ilas_visitor_logs', JSON.stringify(logs.slice(0, 100)));
  window.dispatchEvent(new CustomEvent('ilas-visitor-logs-changed'));
};

export const getVisitorStats = () => {
  const logs = getVisitorLogs();
  const counts: Record<string, number> = {};
  let totalTime = 0;
  
  logs.forEach(log => {
    counts[log.page] = (counts[log.page] || 0) + 1;
    totalTime += log.timeSpent;
  });
  
  const topCourses = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  return {
    topCourses,
    totalTime,
    totalVisitors: logs.length
  };
};

export const getEnterpriseTasks = (): EnterpriseTask[] => {
  const data = localStorage.getItem('ilas_enterprise_tasks');
  if (!data) {
    localStorage.setItem('ilas_enterprise_tasks', JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_enterprise_tasks, resetting to seed:', e);
    localStorage.setItem('ilas_enterprise_tasks', JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }
};

export const saveEnterpriseTask = (task: Omit<EnterpriseTask, 'id' | 'createdAt' | 'updatedAt'>): EnterpriseTask[] => {
  const tasks = getEnterpriseTasks();
  const newTask: EnterpriseTask = {
    ...task,
    id: 'TASK-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  };
  const updated = [newTask, ...tasks];
  localStorage.setItem('ilas_enterprise_tasks', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-tasks-changed'));
  return updated;
};

export const getStaffRegistry = (): StaffUser[] => {
  const data = localStorage.getItem('ilas_staff_registry');
  if (!data) {
    localStorage.setItem('ilas_staff_registry', JSON.stringify(SEED_STAFF));
    return SEED_STAFF;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to parse ilas_staff_registry, resetting to seed:', e);
    localStorage.setItem('ilas_staff_registry', JSON.stringify(SEED_STAFF));
    return SEED_STAFF;
  }
};

export const saveStaffMember = (staff: Omit<StaffUser, 'id'>): StaffUser[] => {
  const registry = getStaffRegistry();
  const nextIdNum = registry.length + 1;
  const newStaff: StaffUser = {
    ...staff,
    id: `STAFF-${String(nextIdNum).padStart(3, '0')}`,
    status: 'Active',
    joiningDate: new Date().toLocaleDateString()
  };
  const updated = [...registry, newStaff];
  localStorage.setItem('ilas_staff_registry', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
  return updated;
};

export const getAttendanceLogs = (): AttendanceLog[] => {
  const data = localStorage.getItem('ilas_attendance_logs');
  if (!data) {
    localStorage.setItem('ilas_attendance_logs', JSON.stringify(SEED_ATTENDANCE));
    return SEED_ATTENDANCE;
  }
  return JSON.parse(data);
};

export const logStaffAttendance = (staffId: string, staffName: string, status: AttendanceLog['status']): AttendanceLog[] => {
  const logs = getAttendanceLogs();
  const newLog: AttendanceLog = {
    id: 'ATT-' + Math.floor(1000 + Math.random() * 9000),
    staffId,
    staffName,
    checkInTime: new Date().toLocaleTimeString(),
    status,
    date: new Date().toLocaleDateString()
  };
  const updated = [newLog, ...logs];
  localStorage.setItem('ilas_attendance_logs', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-attendance-changed'));
  return updated;
};

export const syncHRPayrollToFinance = (totalPayrollAmount: number, department: string) => {
  const ledgerData = localStorage.getItem('ilas_ledger');
  const ledger = ledgerData ? JSON.parse(ledgerData) : [];
  
  const newExpense = {
    id: 'EXP-' + Math.floor(1000 + Math.random() * 9000),
    type: 'expense',
    category: 'Payroll Sync',
    description: `Monthly Salary Sync: ${department}`,
    amount: totalPayrollAmount,
    date: new Date().toISOString().split('T')[0]
  };
  
  localStorage.setItem('ilas_ledger', JSON.stringify([newExpense, ...ledger]));
  window.dispatchEvent(new CustomEvent('ilas-ledger-changed'));
};

export const getPendingStudentInquiries = (): Inquiry[] => {
  const inquiries = getInquiries();
  return inquiries.filter(item => item.category === 'Education' && item.paymentStatus !== 'Paid');
};

export const approveStudentPaymentAndUnlock = (id: string, classLink: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === id) {
      return { 
        ...item, 
        paymentStatus: 'Paid' as const, 
        classLink: classLink || 'https://ilas.global/classroom/join/default-session' 
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const processAutomatedPayment = (inquiryId: string, transactionId: string, amount: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === inquiryId) {
      return { 
        ...item, 
        paymentStatus: 'Paid' as const,
        classLink: `https://ilas.global/classroom/join/session-${transactionId}` 
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  
  syncEducationRevenueToFinance(amount, `Online Payment: ${transactionId}`);
  
  return updated;
};

export const syncEducationRevenueToFinance = (amount: string, description: string) => {
  const ledgerData = localStorage.getItem('ilas_ledger');
  const ledger = ledgerData ? JSON.parse(ledgerData) : [];
  
  const newRevenue = {
    id: 'REV-' + Math.floor(1000 + Math.random() * 9000),
    type: 'income',
    category: 'Education Revenue',
    description: description,
    amount: parseFloat(amount.replace(/[^0-9.-]+/g,"")) || 0,
    date: new Date().toISOString().split('T')[0]
  };
  
  localStorage.setItem('ilas_ledger', JSON.stringify([newRevenue, ...ledger]));
  window.dispatchEvent(new CustomEvent('ilas-ledger-changed'));
};

export const updateInquiry = (id: string, updates: Partial<Inquiry>): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const deleteInquiry = (id: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.filter(item => item.id !== id);
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const assignStaffToInquiry = (inquiryId: string, staffId: string, staffName: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === inquiryId) {
      return {
        ...item,
        assignedStaffId: staffId,
        assignedStaffName: staffName,
        crmStatus: item.crmStatus === 'New Lead' ? 'In Progress' : item.crmStatus
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const addFollowUpRecord = (
  inquiryId: string, 
  record: { staffName: string; channel: FollowUpRecord['channel']; notes: string; outcome: FollowUpRecord['outcome']; nextFollowUpDate?: string }
): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === inquiryId) {
      const history = item.followUpHistory || [];
      const newRecord: FollowUpRecord = {
        id: `FL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString(),
        staffName: record.staffName,
        channel: record.channel,
        notes: record.notes,
        outcome: record.outcome
      };
      
      const newStatus = record.outcome === 'Fee Paid' ? 'Completed' : 'Scheduled';
      
      return {
        ...item,
        followUpHistory: [newRecord, ...history],
        followUpDate: record.nextFollowUpDate || item.followUpDate,
        followUpStatus: newStatus as Inquiry['followUpStatus']
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const updateInquiryVisaStage = (inquiryId: string, stage: Inquiry['visaProcessingStage']): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === inquiryId) {
      return {
        ...item,
        visaProcessingStage: stage,
        pipelineStage: (stage === 'Visa Approved' ? 'Completed' : 'Processing') as Inquiry['pipelineStage']
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const updateInquiryPayment = (inquiryId: string, paymentStatus: Inquiry['paymentStatus'], amountPaid?: string): Inquiry[] => {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => {
    if (item.id === inquiryId) {
      return {
        ...item,
        paymentStatus,
        amountPaid: amountPaid !== undefined ? amountPaid : item.amountPaid,
        crmStatus: paymentStatus === 'Paid' ? 'Closed Won' : item.crmStatus
      };
    }
    return item;
  });
  localStorage.setItem('ilas_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-inquiries-changed'));
  return updated;
};

export const getDailyWalkinStats = () => {
  const inquiries = getInquiries();
  const walkins = inquiries.filter(i => i.type === 'Walk-in');
  const paidWalkins = walkins.filter(i => i.paymentStatus === 'Paid' || i.paymentStatus === 'Partially Paid');
  const dueFollowups = inquiries.filter(i => i.followUpStatus === 'Due Today' || i.followUpStatus === 'Overdue');
  
  return {
    totalWalkins: walkins.length,
    convertedPaid: paidWalkins.length,
    dueFollowupsCount: dueFollowups.length,
    activeVisaCases: inquiries.filter(i => i.category === 'Visa' && i.visaProcessingStage && i.visaProcessingStage !== 'Not Applicable' && i.visaProcessingStage !== 'Visa Approved').length
  };
};

// ============================================================================
// AUTOMATED COMMUNICATION TRIGGERS & DISPATCH TRACKING SYSTEM
// ============================================================================

export interface CommTriggerWorkflow {
  id: string;
  name: string;
  triggerEvent: 
    | 'student_registration' 
    | 'course_enrollment' 
    | 'contact_inquiry' 
    | 'class_start_24h' 
    | 'class_start_1h' 
    | 'pending_enrollment_24h' 
    | 'incomplete_registration_48h' 
    | 'payment_reminder';
  category: 'Welcome & Onboarding' | 'Class & Schedule Alerts' | 'Enrollment Follow-ups' | 'Payment & Retention';
  channel: 'WhatsApp' | 'Email' | 'SMS' | 'Multi-Channel';
  subject: string;
  messageTemplate: string;
  isActive: boolean;
  delayMinutes: number; // 0 = Instant dispatch
  badge: string;
  stats: {
    totalDispatched: number;
    delivered: number;
    openedOrRead: number;
    failed: number;
  };
  lastTriggered?: string;
}

export interface CommDispatchLog {
  id: string;
  triggerId: string;
  triggerName: string;
  category: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  courseOrBatch: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  status: 'Sent' | 'Delivered' | 'Read' | 'Pending' | 'Failed';
  timestamp: string;
  dispatchedAt: string;
  messagePreview: string;
  errorMessage?: string;
  engagementMetadata?: {
    deliveredAt?: string;
    readAt?: string;
    deliveryLatencyMs?: number;
  };
}

const SEED_COMM_WORKFLOWS: CommTriggerWorkflow[] = [
  {
    id: 'trig-welcome-reg',
    name: 'Instant Welcome & Portal Access on Registration',
    triggerEvent: 'student_registration',
    category: 'Welcome & Onboarding',
    channel: 'WhatsApp',
    subject: 'Willkommen to ILAS! Your Student Portal is Ready 🚀',
    messageTemplate: 'Hallo {{name}}, Herzlich Willkommen to ILAS! Your student account for {{course}} is active. Access your IntelliCoach AI, live schedules, and learning materials here: https://ilas.global/student-login. Your assigned counselor is on standby.',
    isActive: true,
    delayMinutes: 0,
    badge: 'Instant Zero-Latency',
    stats: {
      totalDispatched: 342,
      delivered: 339,
      openedOrRead: 318,
      failed: 3
    },
    lastTriggered: '12 mins ago'
  },
  {
    id: 'trig-welcome-enroll',
    name: 'Course Enrollment & Digital Kit Dispatch',
    triggerEvent: 'course_enrollment',
    category: 'Welcome & Onboarding',
    channel: 'Email',
    subject: 'Official Enrollment Confirmed: Welcome Kit & Study Blueprint Inside',
    messageTemplate: 'Dear {{name}}, congratulations on enrolling in {{course}}! We have provisioned your CEFR-aligned learning kit, smart slide decks, and batch calendar. Check your credentials and join our German/Tech community discord.',
    isActive: true,
    delayMinutes: 0,
    badge: 'Immediate Confirmation',
    stats: {
      totalDispatched: 215,
      delivered: 212,
      openedOrRead: 198,
      failed: 3
    },
    lastTriggered: '45 mins ago'
  },
  {
    id: 'trig-class-24h',
    name: 'Class Start 24-Hour Batch Orientation Alert',
    triggerEvent: 'class_start_24h',
    category: 'Class & Schedule Alerts',
    channel: 'WhatsApp',
    subject: 'Reminder: Your {{course}} Batch Starts Tomorrow!',
    messageTemplate: 'Guten Tag {{name}}! Friendly alert: Your upcoming live session for {{course}} starts in 24 hours (Tomorrow at {{time}}). Please test your microphone & camera setup. Mentor: {{tutor}}.',
    isActive: true,
    delayMinutes: 1440,
    badge: '24h Pre-Flight',
    stats: {
      totalDispatched: 489,
      delivered: 485,
      openedOrRead: 462,
      failed: 4
    },
    lastTriggered: '1 hour ago'
  },
  {
    id: 'trig-class-1h',
    name: '1-Hour Live Classroom & Video Link Dispatch',
    triggerEvent: 'class_start_1h',
    category: 'Class & Schedule Alerts',
    channel: 'SMS',
    subject: 'ILAS Classroom Live in 60 Mins: 1-Click Link Inside',
    messageTemplate: '⏰ {{name}}, your live batch for {{course}} begins in 60 minutes! Click to join your interactive room: https://ilas.global/live/{{batch_id}}. See you in class!',
    isActive: true,
    delayMinutes: 60,
    badge: '60-Min Direct Ping',
    stats: {
      totalDispatched: 512,
      delivered: 508,
      openedOrRead: 494,
      failed: 4
    },
    lastTriggered: '18 mins ago'
  },
  {
    id: 'trig-pending-enroll-24h',
    name: 'Pending Enrollment & Course Advisory Nudge',
    triggerEvent: 'pending_enrollment_24h',
    category: 'Enrollment Follow-ups',
    channel: 'WhatsApp',
    subject: 'Complete Your {{course}} Enrollment & Secure Your Seat',
    messageTemplate: 'Hi {{name}}, we noticed you started your intake for {{course}} yesterday. Only 4 seats remain in this upcoming batch! Need quick guidance? Reply 1 to chat with Senior Counselor Priya or click https://ilas.global/admissions/resume.',
    isActive: true,
    delayMinutes: 1440,
    badge: '24h Conversion Nudge',
    stats: {
      totalDispatched: 178,
      delivered: 174,
      openedOrRead: 149,
      failed: 4
    },
    lastTriggered: '2 hours ago'
  },
  {
    id: 'trig-incomplete-reg-48h',
    name: 'Incomplete Registration & Document Recovery',
    triggerEvent: 'incomplete_registration_48h',
    category: 'Enrollment Follow-ups',
    channel: 'Email',
    subject: 'Action Required: Finish Your ILAS Profile for {{course}}',
    messageTemplate: 'Dear {{name}}, your profile is 70% complete. Submit your identification copy or CEFR level assessment to finalize batch scheduling and activate your €0 tuition German university matching engine.',
    isActive: true,
    delayMinutes: 2880,
    badge: '48h Form Recovery',
    stats: {
      totalDispatched: 124,
      delivered: 121,
      openedOrRead: 98,
      failed: 3
    },
    lastTriggered: '5 hours ago'
  },
  {
    id: 'trig-payment-reminder',
    name: 'Tuition Fee & Milestone Payment Alert',
    triggerEvent: 'payment_reminder',
    category: 'Payment & Retention',
    channel: 'Multi-Channel',
    subject: 'Invoice & Installment Due Reminder for {{course}}',
    messageTemplate: 'Hallo {{name}}, your installment of {{amount}} for {{course}} is due in 3 days. Pay conveniently via Card, UPI, or SEPA to maintain uninterrupted access to IntelliCoach AI & live classes: https://ilas.global/pay/invoice-{{id}}.',
    isActive: true,
    delayMinutes: 4320,
    badge: 'Due-Date Automator',
    stats: {
      totalDispatched: 88,
      delivered: 87,
      openedOrRead: 81,
      failed: 1
    },
    lastTriggered: '1 day ago'
  }
];

const SEED_COMM_LOGS: CommDispatchLog[] = [
  {
    id: 'LOG-9081',
    triggerId: 'trig-welcome-reg',
    triggerName: 'Instant Welcome & Portal Access on Registration',
    category: 'Welcome & Onboarding',
    recipientName: 'Arjun Nair',
    recipientEmail: 'arjun.nair@example.com',
    recipientPhone: '+91 98450 77890',
    courseOrBatch: 'German B1 Intensive',
    channel: 'WhatsApp',
    status: 'Read',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    dispatchedAt: '12 mins ago',
    messagePreview: 'Hallo Arjun Nair, Herzlich Willkommen to ILAS! Your student account for German B1 Intensive is active...',
    engagementMetadata: {
      deliveredAt: '12 mins ago',
      readAt: '10 mins ago',
      deliveryLatencyMs: 412
    }
  },
  {
    id: 'LOG-9080',
    triggerId: 'trig-class-1h',
    triggerName: '1-Hour Live Classroom & Video Link Dispatch',
    category: 'Class & Schedule Alerts',
    recipientName: 'Sophie Meier',
    recipientEmail: 'sophie.m@berlin-tech.de',
    recipientPhone: '+49 176 892011',
    courseOrBatch: 'Medical German C1 Doctor Sprint',
    channel: 'SMS',
    status: 'Delivered',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    dispatchedAt: '18 mins ago',
    messagePreview: '⏰ Sophie Meier, your live batch for Medical German C1 Doctor Sprint begins in 60 minutes!...',
    engagementMetadata: {
      deliveredAt: '18 mins ago',
      deliveryLatencyMs: 650
    }
  },
  {
    id: 'LOG-9079',
    triggerId: 'trig-welcome-enroll',
    triggerName: 'Course Enrollment & Digital Kit Dispatch',
    category: 'Welcome & Onboarding',
    recipientName: 'Fatima Zahra',
    recipientEmail: 'fatima.zahra@gulfmed.org',
    recipientPhone: '+971 50 1234567',
    courseOrBatch: 'IELTS Band 8.0 Masterclass',
    channel: 'Email',
    status: 'Read',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    dispatchedAt: '45 mins ago',
    messagePreview: 'Dear Fatima Zahra, congratulations on enrolling in IELTS Band 8.0 Masterclass! We have provisioned your CEFR kit...',
    engagementMetadata: {
      deliveredAt: '45 mins ago',
      readAt: '39 mins ago',
      deliveryLatencyMs: 820
    }
  },
  {
    id: 'LOG-9078',
    triggerId: 'trig-class-24h',
    triggerName: 'Class Start 24-Hour Batch Orientation Alert',
    category: 'Class & Schedule Alerts',
    recipientName: 'Vikramaditya Roy',
    recipientEmail: 'v.roy@kolkata-eng.in',
    recipientPhone: '+91 98300 44556',
    courseOrBatch: 'SAP FICO & German Dual Track',
    channel: 'WhatsApp',
    status: 'Delivered',
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    dispatchedAt: '1 hour ago',
    messagePreview: 'Guten Tag Vikramaditya Roy! Friendly alert: Your upcoming live session for SAP FICO & German Dual Track starts in 24 hours...',
    engagementMetadata: {
      deliveredAt: '1 hour ago',
      deliveryLatencyMs: 380
    }
  },
  {
    id: 'LOG-9077',
    triggerId: 'trig-pending-enroll-24h',
    triggerName: 'Pending Enrollment & Course Advisory Nudge',
    category: 'Enrollment Follow-ups',
    recipientName: 'Sneha Kulkarni',
    recipientEmail: 'sneha.k@pune-nurse.com',
    recipientPhone: '+91 97654 32198',
    courseOrBatch: 'Healthcare Ausbildung B2',
    channel: 'WhatsApp',
    status: 'Read',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    dispatchedAt: '2 hours ago',
    messagePreview: 'Hi Sneha Kulkarni, we noticed you started your intake for Healthcare Ausbildung B2 yesterday...',
    engagementMetadata: {
      deliveredAt: '2 hours ago',
      readAt: '1.5 hours ago',
      deliveryLatencyMs: 510
    }
  },
  {
    id: 'LOG-9076',
    triggerId: 'trig-incomplete-reg-48h',
    triggerName: 'Incomplete Registration & Document Recovery',
    category: 'Enrollment Follow-ups',
    recipientName: 'Klaus Reinhardt',
    recipientEmail: 'klaus.r@munich-student.de',
    recipientPhone: '+49 151 778899',
    courseOrBatch: 'Master in Mechanical Engineering ($0 Tuition)',
    channel: 'Email',
    status: 'Delivered',
    timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
    dispatchedAt: '5 hours ago',
    messagePreview: 'Dear Klaus Reinhardt, your profile is 70% complete. Submit your identification copy or CEFR level assessment...',
    engagementMetadata: {
      deliveredAt: '5 hours ago',
      deliveryLatencyMs: 710
    }
  },
  {
    id: 'LOG-9075',
    triggerId: 'trig-payment-reminder',
    triggerName: 'Tuition Fee & Milestone Payment Alert',
    category: 'Payment & Retention',
    recipientName: 'Rohan Deshmukh',
    recipientEmail: 'rohan.deshmukh@gmail.com',
    recipientPhone: '+91 99220 11447',
    courseOrBatch: 'Full Stack Java & German B2',
    channel: 'WhatsApp',
    status: 'Sent',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    dispatchedAt: '1 day ago',
    messagePreview: 'Hallo Rohan Deshmukh, your installment of $199.00 for Full Stack Java & German B2 is due in 3 days...',
    engagementMetadata: {
      deliveredAt: '1 day ago',
      deliveryLatencyMs: 490
    }
  }
];

export const getCommTriggerWorkflows = (): CommTriggerWorkflow[] => {
  const data = localStorage.getItem('ilas_comm_workflows');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_comm_workflows:', e);
    }
  }
  localStorage.setItem('ilas_comm_workflows', JSON.stringify(SEED_COMM_WORKFLOWS));
  return SEED_COMM_WORKFLOWS;
};

export const saveCommTriggerWorkflow = (workflow: CommTriggerWorkflow): CommTriggerWorkflow[] => {
  const current = getCommTriggerWorkflows();
  const exists = current.some(w => w.id === workflow.id);
  const updated = exists 
    ? current.map(w => w.id === workflow.id ? workflow : w)
    : [workflow, ...current];
    
  localStorage.setItem('ilas_comm_workflows', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-comm-workflows-changed'));
  return updated;
};

export const toggleCommTriggerWorkflow = (id: string, isActive: boolean): CommTriggerWorkflow[] => {
  const current = getCommTriggerWorkflows();
  const updated = current.map(w => w.id === id ? { ...w, isActive } : w);
  localStorage.setItem('ilas_comm_workflows', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-comm-workflows-changed'));
  return updated;
};

export const deleteCommTriggerWorkflow = (id: string): CommTriggerWorkflow[] => {
  const current = getCommTriggerWorkflows();
  const updated = current.filter(w => w.id !== id);
  localStorage.setItem('ilas_comm_workflows', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-comm-workflows-changed'));
  return updated;
};

export const getCommDispatchLogs = (): CommDispatchLog[] => {
  const data = localStorage.getItem('ilas_comm_logs');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_comm_logs:', e);
    }
  }
  localStorage.setItem('ilas_comm_logs', JSON.stringify(SEED_COMM_LOGS));
  return SEED_COMM_LOGS;
};

export const addCommDispatchLog = (logData: Omit<CommDispatchLog, 'id' | 'timestamp' | 'dispatchedAt'>): CommDispatchLog => {
  const logs = getCommDispatchLogs();
  const newLog: CommDispatchLog = {
    ...logData,
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    dispatchedAt: 'Just now',
    engagementMetadata: {
      deliveredAt: 'Just now',
      deliveryLatencyMs: Math.floor(250 + Math.random() * 400)
    }
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem('ilas_comm_logs', JSON.stringify(updatedLogs));
  
  // Also increment the workflow trigger stats
  const workflows = getCommTriggerWorkflows();
  const updatedWorkflows = workflows.map(w => {
    if (w.id === logData.triggerId) {
      return {
        ...w,
        lastTriggered: 'Just now',
        stats: {
          ...w.stats,
          totalDispatched: w.stats.totalDispatched + 1,
          delivered: w.stats.delivered + 1,
          openedOrRead: w.stats.openedOrRead + 1
        }
      };
    }
    return w;
  });
  localStorage.setItem('ilas_comm_workflows', JSON.stringify(updatedWorkflows));

  window.dispatchEvent(new CustomEvent('ilas-comm-logs-changed'));
  window.dispatchEvent(new CustomEvent('ilas-comm-workflows-changed'));
  return newLog;
};

export const dispatchAutomatedMessage = (
  triggerEvent: CommTriggerWorkflow['triggerEvent'],
  recipient: { name: string; email: string; phone: string; courseOrBatch?: string }
): CommDispatchLog | null => {
  const workflows = getCommTriggerWorkflows();
  const matchingWorkflow = workflows.find(w => w.triggerEvent === triggerEvent && w.isActive);
  
  if (!matchingWorkflow) {
    return null;
  }

  const courseName = recipient.courseOrBatch || 'German Language & Tech Masterclass';
  const personalizedPreview = matchingWorkflow.messageTemplate
    .replace(/\{\{name\}\}/g, recipient.name)
    .replace(/\{\{course\}\}/g, courseName)
    .replace(/\{\{time\}\}/g, '09:00 AM CET')
    .replace(/\{\{tutor\}\}/g, 'Frau Lisa Weber')
    .replace(/\{\{amount\}\}/g, '$199.00');

  const channel = matchingWorkflow.channel === 'Multi-Channel' ? 'WhatsApp' : matchingWorkflow.channel;

  return addCommDispatchLog({
    triggerId: matchingWorkflow.id,
    triggerName: matchingWorkflow.name,
    category: matchingWorkflow.category,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    recipientPhone: recipient.phone,
    courseOrBatch: courseName,
    channel: channel as 'WhatsApp' | 'Email' | 'SMS',
    status: 'Delivered',
    messagePreview: personalizedPreview
  });
};

export const simulateTestTrigger = (
  workflowId: string,
  testRecipient?: { name: string; email: string; phone: string; courseOrBatch?: string }
): CommDispatchLog | null => {
  const workflows = getCommTriggerWorkflows();
  const workflow = workflows.find(w => w.id === workflowId);
  if (!workflow) return null;

  const recipient = testRecipient || {
    name: 'Live Student Simulator',
    email: 'simulator.student@ilas.global',
    phone: '+49 176 998877',
    courseOrBatch: 'German B2 Executive Clinical Path'
  };

  const personalizedPreview = workflow.messageTemplate
    .replace(/\{\{name\}\}/g, recipient.name)
    .replace(/\{\{course\}\}/g, recipient.courseOrBatch || 'German Language A1–C2')
    .replace(/\{\{time\}\}/g, '10:00 AM CET')
    .replace(/\{\{tutor\}\}/g, 'Dr. Klaus Mueller')
    .replace(/\{\{amount\}\}/g, '$299.00');

  const channel = workflow.channel === 'Multi-Channel' ? 'WhatsApp' : workflow.channel;

  return addCommDispatchLog({
    triggerId: workflow.id,
    triggerName: workflow.name,
    category: workflow.category,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    recipientPhone: recipient.phone,
    courseOrBatch: recipient.courseOrBatch || 'German Language A1–C2',
    channel: channel as 'WhatsApp' | 'Email' | 'SMS',
    status: 'Delivered',
    messagePreview: personalizedPreview
  });
};

export const getCommTriggerMetrics = () => {
  const logs = getCommDispatchLogs();
  const workflows = getCommTriggerWorkflows();
  
  const totalDispatches = logs.length;
  const deliveredCount = logs.filter(l => l.status === 'Delivered' || l.status === 'Read').length;
  const readCount = logs.filter(l => l.status === 'Read').length;
  const failedCount = logs.filter(l => l.status === 'Failed').length;
  const activeWorkflowsCount = workflows.filter(w => w.isActive).length;

  const deliveryRate = totalDispatches > 0 ? ((deliveredCount / totalDispatches) * 100).toFixed(1) : '99.2';
  const openRate = totalDispatches > 0 ? ((readCount / totalDispatches) * 100).toFixed(1) : '78.4';

  return {
    totalDispatches,
    deliveredCount,
    readCount,
    failedCount,
    activeWorkflowsCount,
    totalWorkflowsCount: workflows.length,
    deliveryRate,
    openRate
  };
};

// ============================================================================
// HOD / WORK & STUDY IN INDIA & ABROAD MANAGEMENT SYSTEM
// ============================================================================

export interface WorkStudyProgram {
  id: string;
  title: string;
  domain: 'IT & Software' | 'Solar & Engineering' | 'Global Trade & Sourcing' | 'Healthcare & Nursing' | 'Marketing & Growth' | 'Office Administration';
  role: string;
  salary: string;
  trainingDuration: string;
  internshipDuration: string;
  certification: string;
  location: 'India (Remote / Hybrid)' | 'On-Site Germany' | 'Dual Hybrid (India -> Germany)';
  spotsAvailable: number;
  activeEnrolledCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  mentorHOD: string;
  description: string;
  createdAt: string;
}

export interface WorkStudyCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  programId: string;
  programTitle: string;
  domain: string;
  stage: 'Intake Assessment' | 'AI & Skill Training' | 'Active Internship / Pilot' | 'German Sponsor Match' | 'Graduated & Relocated';
  stipendStatus: 'Active' | 'Under Review' | 'Disbursed';
  currentStipend: string;
  progressPct: number;
  mentorName: string;
  attendancePct: number;
  performanceRating: number; // 1 to 5
  notes: string;
  appliedDate: string;
  corporateProject: string;
}

const SEED_WORK_STUDY_PROGRAMS: WorkStudyProgram[] = [
  {
    id: 'WSP-101',
    title: 'AI Full-Stack Development & Social Media Growth Pilot',
    domain: 'IT & Software',
    role: 'Junior Software & AI Growth Consultant',
    salary: '₹18,000 - ₹32,000 / mo',
    trainingDuration: '8 Weeks Intensive',
    internshipDuration: '6 Months Live Corporate Pilot',
    certification: '1-Year Verified Corporate Experience Letter + DIN-Standard Portfolio',
    location: 'Dual Hybrid (India -> Germany)',
    spotsAvailable: 25,
    activeEnrolledCount: 18,
    status: 'Active',
    mentorHOD: 'Vikramaditya Roy (Head of IT)',
    description: 'Work on live software architectures, AI-assisted development, high-level SEO, and client acquisition funnels with direct EU placement sponsorship.',
    createdAt: '2026-01-15'
  },
  {
    id: 'WSP-102',
    title: 'Solar Energy & Industrial Technical Services Pilot',
    domain: 'Solar & Engineering',
    role: 'Solar & EV Field Technical Specialist',
    salary: '₹15,000 - ₹28,000 / mo',
    trainingDuration: '6 Weeks Technical Bootcamp',
    internshipDuration: '6 Months On-Ground Installation Pilot',
    certification: 'VDI German Technical Standard Certificate + Project Verification Letter',
    location: 'India (Remote / Hybrid)',
    spotsAvailable: 20,
    activeEnrolledCount: 14,
    status: 'Active',
    mentorHOD: 'Dr. Klaus Mueller (Engineering HOD)',
    description: 'Master hands-on technical solutions (Solar, EV, Diagnostics). We provide toolkits and supply chains to run local service pilots before Germany setup.',
    createdAt: '2026-01-20'
  },
  {
    id: 'WSP-103',
    title: 'European Cross-Border Sourcing & Import-Export Logistics',
    domain: 'Global Trade & Sourcing',
    role: 'International Trade & Supply Chain Coordinator',
    salary: '₹14,000 - ₹26,000 / mo',
    trainingDuration: '6 Weeks Global Commerce Sprint',
    internshipDuration: '6 Months Live Export-Import Project',
    certification: 'EU Trade Compliance & Customs Operations Certificate',
    location: 'India (Remote / Hybrid)',
    spotsAvailable: 15,
    activeEnrolledCount: 11,
    status: 'Active',
    mentorHOD: 'Stefan Wagner (Trade Operations Lead)',
    description: 'Research cross-border products, connect European suppliers, prepare customs documentation, and coordinate international supply chains.',
    createdAt: '2026-02-01'
  },
  {
    id: 'WSP-104',
    title: 'Healthcare Dual Ausbildung & Hospital Ward Coordination',
    domain: 'Healthcare & Nursing',
    role: 'Clinical Assistant & German Hospital Trainee',
    salary: '€1,200 / mo (Munich Stipend)',
    trainingDuration: '12 Weeks Clinical German & Triage',
    internshipDuration: '1 Year Hospital Rotation in Germany',
    certification: 'Official German Nursing Approbation Track + Hospital Work Contract',
    location: 'On-Site Germany',
    spotsAvailable: 30,
    activeEnrolledCount: 22,
    status: 'Active',
    mentorHOD: 'Priya Sundaram (Healthcare Director)',
    description: 'Direct corporate training and hospital ward placement across top medical syndicates in Munich and Frankfurt with full visa backing.',
    createdAt: '2026-02-10'
  }
];

const SEED_WORK_STUDY_CANDIDATES: WorkStudyCandidate[] = [
  {
    id: 'WSC-501',
    name: 'Rahul Varma',
    email: 'rahul.varma@techmail.com',
    phone: '+91 98112 34567',
    programId: 'WSP-101',
    programTitle: 'AI Full-Stack Development & Social Media Growth Pilot',
    domain: 'IT & Software',
    stage: 'Active Internship / Pilot',
    stipendStatus: 'Active',
    currentStipend: '₹25,000 / mo',
    progressPct: 65,
    mentorName: 'Vikramaditya Roy',
    attendancePct: 96,
    performanceRating: 5,
    notes: 'Completed sprint on React & Node.js backend. Leading client lead automation pipeline.',
    appliedDate: '2026-01-25',
    corporateProject: 'ILA Multi-Channel CRM & Automation Bot'
  },
  {
    id: 'WSC-502',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    programId: 'WSP-104',
    programTitle: 'Healthcare Dual Ausbildung & Hospital Ward Coordination',
    domain: 'Healthcare & Nursing',
    stage: 'German Sponsor Match',
    stipendStatus: 'Active',
    currentStipend: '€1,200 / mo',
    progressPct: 88,
    mentorName: 'Priya Sundaram',
    attendancePct: 98,
    performanceRating: 5,
    notes: 'B2 German passed. Matched with Asklepios Kliniken Munich for Q3 intake.',
    appliedDate: '2026-02-05',
    corporateProject: 'Hospital Ward Anamnesis & Patient Care Protocol'
  },
  {
    id: 'WSC-503',
    name: 'Deepak Menon',
    email: 'deepak.menon@healthcare.in',
    phone: '+91 94471 88990',
    programId: 'WSP-102',
    programTitle: 'Solar Energy & Industrial Technical Services Pilot',
    domain: 'Solar & Engineering',
    stage: 'AI & Skill Training',
    stipendStatus: 'Under Review',
    currentStipend: '₹15,000 / mo',
    progressPct: 35,
    mentorName: 'Dr. Klaus Mueller',
    attendancePct: 92,
    performanceRating: 4,
    notes: 'Completed Module 2 on inverter wiring and solar grid calculations.',
    appliedDate: '2026-02-18',
    corporateProject: '50kW Rooftop Solar Installation Pilot'
  },
  {
    id: 'WSC-504',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@pune-nurse.com',
    phone: '+91 97654 32198',
    programId: 'WSP-103',
    programTitle: 'European Cross-Border Sourcing & Import-Export Logistics',
    domain: 'Global Trade & Sourcing',
    stage: 'Intake Assessment',
    stipendStatus: 'Under Review',
    currentStipend: '₹14,000 / mo',
    progressPct: 15,
    mentorName: 'Stefan Wagner',
    attendancePct: 100,
    performanceRating: 4,
    notes: 'Initial profile screened. Commencing supply chain documentation training next week.',
    appliedDate: '2026-03-01',
    corporateProject: 'DACH Industrial Tool Benchmarking'
  }
];

export const getWorkStudyPrograms = (): WorkStudyProgram[] => {
  const data = localStorage.getItem('ilas_work_study_programs');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_work_study_programs:', e);
    }
  }
  localStorage.setItem('ilas_work_study_programs', JSON.stringify(SEED_WORK_STUDY_PROGRAMS));
  return SEED_WORK_STUDY_PROGRAMS;
};

export const saveWorkStudyProgram = (program: WorkStudyProgram): WorkStudyProgram[] => {
  const current = getWorkStudyPrograms();
  const exists = current.some(p => p.id === program.id);
  const updated = exists 
    ? current.map(p => p.id === program.id ? program : p)
    : [program, ...current];
    
  localStorage.setItem('ilas_work_study_programs', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-programs-changed'));
  return updated;
};

export const deleteWorkStudyProgram = (id: string): WorkStudyProgram[] => {
  const current = getWorkStudyPrograms();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem('ilas_work_study_programs', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-programs-changed'));
  return updated;
};

export const getWorkStudyCandidates = (): WorkStudyCandidate[] => {
  const data = localStorage.getItem('ilas_work_study_candidates');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_work_study_candidates:', e);
    }
  }
  localStorage.setItem('ilas_work_study_candidates', JSON.stringify(SEED_WORK_STUDY_CANDIDATES));
  return SEED_WORK_STUDY_CANDIDATES;
};

export const saveWorkStudyCandidate = (candidate: WorkStudyCandidate): WorkStudyCandidate[] => {
  const current = getWorkStudyCandidates();
  const exists = current.some(c => c.id === candidate.id);
  const updated = exists 
    ? current.map(c => c.id === candidate.id ? candidate : c)
    : [candidate, ...current];
    
  localStorage.setItem('ilas_work_study_candidates', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-candidates-changed'));
  return updated;
};

export const updateWorkStudyCandidateStage = (
  id: string, 
  stage: WorkStudyCandidate['stage'],
  progressPct?: number
): WorkStudyCandidate[] => {
  const current = getWorkStudyCandidates();
  const updated = current.map(c => {
    if (c.id === id) {
      return {
        ...c,
        stage,
        progressPct: progressPct !== undefined ? progressPct : c.progressPct
      };
    }
    return c;
  });
  localStorage.setItem('ilas_work_study_candidates', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-candidates-changed'));
  return updated;
};

export const getHODWorkStudyStats = () => {
  const programs = getWorkStudyPrograms();
  const candidates = getWorkStudyCandidates();
  
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === 'Active').length;
  const totalCandidates = candidates.length;
  const activeInterns = candidates.filter(c => c.stage === 'Active Internship / Pilot' || c.stage === 'German Sponsor Match').length;
  const germanMatched = candidates.filter(c => c.stage === 'German Sponsor Match' || c.stage === 'Graduated & Relocated').length;

  return {
    totalPrograms,
    activePrograms,
    totalCandidates,
    activeInterns,
    germanMatched,
    avgPerformanceRating: '4.8 / 5.0'
  };
};

// ============================================================================
// DYNAMIC WORK & STUDY PACKAGES (CRUD & MARKETING STUDIO PROMOTION ENGINE)
// ============================================================================

export interface WorkStudyPackage {
  id: string;
  category: 'work-in-india' | 'work-in-abroad' | 'german-projects' | 'reward-study-platform';
  categoryLabel: string;
  title: string;
  badge: string;
  stipend: string;
  trainingDuration: string;
  internshipDuration: string;
  certification: string;
  roles: string[]; // Sub-features & specific role bullets
  streams: string[]; // Selectable streams/courses for candidate dropdown
  actionText: string;
  description: string;
  termsAndConditions: string;
  status: 'Active' | 'Draft' | 'Archived';
  promotedToMarketing?: boolean;
  marketingCampaignId?: string;
  lastPromotedAt?: string;
  createdAt: string;
}

export const SEED_WORK_STUDY_PACKAGES: WorkStudyPackage[] = [
  // 1. Work & Study in India Blocks
  {
    id: 'WSP-PKG-IND-01',
    category: 'work-in-india',
    categoryLabel: 'Work & Study in India',
    title: 'Office Admin & Accounts',
    badge: 'Operations',
    stipend: '₹15,000 - ₹25,000 / mo',
    trainingDuration: '6 Months Initial Training Session',
    internshipDuration: '6 Months Corporate Pilot',
    certification: '1-Year Verified Corporate Experience Certificate + ISO Office Administration Credentials',
    roles: [
      '6 Months Initial Training Session',
      'Stipend: 15k to 25k during training',
      'Post-Training: Real-time onboarding & permanent employment opportunities.',
      'AI-Assisted Accounting & Tally Automation',
      'Billing & Financial Auditing',
      'Office Administration & HR Operations',
      'Vendor & Procurement Management'
    ],
    streams: [
      'General Office Administration',
      'AI-Assisted Accounting & Tally Prime',
      'Billing, Invoicing & GST Auditing',
      'Vendor & Supply Chain Procurement'
    ],
    actionText: 'Apply Now',
    description: 'Master enterprise office administration, automated accounting workflows, and corporate client billing while earning verified monthly stipends.',
    termsAndConditions: 'Eligibility: Minimum 10+2 / Graduate. Candidates must attend all scheduled training modules with minimum 85% attendance. Stipend is disbursed monthly post performance review. Successful graduates receive guaranteed placement interviews and official 1-year experience documentation.',
    status: 'Active',
    createdAt: '2026-01-10'
  },
  {
    id: 'WSP-PKG-IND-02',
    category: 'work-in-india',
    categoryLabel: 'Work & Study in India',
    title: 'Software, SEO & Social AI',
    badge: 'Tech & AI',
    stipend: '₹18,000 - ₹35,000 / mo',
    trainingDuration: '6 Months Initial Training Session',
    internshipDuration: '6 Months Live Development Sprint',
    certification: '1-Year Senior Software Engineer Experience Letter + GitHub DIN-Code Verified Portfolio',
    roles: [
      '6 Months Initial Training Session',
      'Stipend: 15k to 25k during training',
      'Post-Training: Real-time onboarding & permanent employment opportunities.',
      'AI-Powered Full-Stack Web Development',
      'High-Level SEO & Organic Growth Sprints',
      'Digital Client Funnel Automation',
      'Social Media Campaign AI Optimization'
    ],
    streams: [
      'Full-Stack Web Engineering (React & Python/Node)',
      'AI Engineering & Intelligent Automations',
      'High-Level Enterprise SEO & Growth',
      'Social Media Ad Funnels & Conversion AI'
    ],
    actionText: 'Apply Now',
    description: 'Build enterprise-grade software applications and master organic AI algorithms with direct placement avenues to European software consultancies.',
    termsAndConditions: 'Eligibility: IT/CS degree, Diploma, or demonstrable programming proficiency. Bi-weekly code reviews and milestone check-ins mandatory. Direct pathway for German Opportunity Card sponsorship provided for top tier performers.',
    status: 'Active',
    createdAt: '2026-01-12'
  },
  {
    id: 'WSP-PKG-IND-03',
    category: 'work-in-india',
    categoryLabel: 'Work & Study in India',
    title: 'Import, Export & Trade',
    badge: 'Global Logistics',
    stipend: '₹16,000 - ₹28,000 / mo',
    trainingDuration: '6 Months Initial Training Session',
    internshipDuration: '6 Months Live Cross-Border Trade Pilot',
    certification: 'European Trade Compliance & Customs Clearance Certified Specialist Document',
    roles: [
      '6 Months Initial Training Session',
      'Stipend: 15k to 25k during training',
      'Post-Training: Real-time onboarding & permanent employment opportunities.',
      'European & Asian Supplier Sourcing',
      'Customs Documentation & Clearance Protocols',
      'International Logistics Operations',
      'B2B Corporate Client Coordination'
    ],
    streams: [
      'European & Global Sourcing Specialist',
      'Customs Documentation & Cross-Border Compliance',
      'International Air & Sea Freight Logistics',
      'B2B Commercial Accounts & Invoicing'
    ],
    actionText: 'Apply Now',
    description: 'Work alongside international trading houses, coordinate cross-border logistics between India and Europe, and master multi-currency trade flows.',
    termsAndConditions: 'Eligibility: Commerce, Logistics, or Business graduates preferred. Training covers German Zoll (Customs) protocols, Incoterms 2020, and international letters of credit. Verified corporate reference letters issued upon completion.',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'WSP-PKG-IND-04',
    category: 'work-in-india',
    categoryLabel: 'Work & Study in India',
    title: 'Engineering & Technical Services',
    badge: 'Engineering',
    stipend: '₹15,000 - ₹30,000 / mo',
    trainingDuration: '6 Months Initial Training Session',
    internshipDuration: '6 Months Hands-on Field Service Pilot',
    certification: 'VDI German Technical Standard Certificate + Engineering Experience Record',
    roles: [
      '6 Months Initial Training Session',
      'Stipend: 15k to 25k during training',
      'Post-Training: Real-time onboarding & permanent employment opportunities.',
      'Solar Rooftop Grid & Inverter Engineering',
      'EV & Auto Diagnostic Systems',
      'HVAC & Industrial Assembly Kits',
      'Technical Audits & Safety Compliance'
    ],
    streams: [
      'Solar Photovoltaic & Inverter Systems',
      'Electric Vehicle (EV) Diagnostics & Powertrain',
      'Industrial HVAC & Automation Diagnostics',
      'Technical Safety Audits & Blueprint Review'
    ],
    actionText: 'Apply Now',
    description: 'Hands-on technical engineering tracks covering solar energy, EV systems, and German industrial machine operations with verified workplace hours.',
    termsAndConditions: 'Eligibility: Diploma or B.Tech in Mechanical, Electrical, Automobile, or Renewable Energy. Field safety protocols must be adhered to at all times. Eligible for direct German Apprenticeship / Duale Ausbildung bridge.',
    status: 'Active',
    createdAt: '2026-01-18'
  },

  // 2. Work & Study in Abroad
  {
    id: 'WSP-PKG-ABR-01',
    category: 'work-in-abroad',
    categoryLabel: 'Work & Study in Abroad',
    title: 'Airport Pick-up & Transit Services',
    badge: 'On-Ground Transit',
    stipend: '€50 – €100 / arrival',
    trainingDuration: '2 Weeks Transit Orientation',
    internshipDuration: 'Flexible University Semester Schedule',
    certification: 'European Student Transit & Welfare Coordinator Letter',
    roles: [
      'Airport Arrival & Transit Welcome Support',
      'Pre-scheduled airport reception booking on your student portal',
      'Direct coordination with arrival flights and local train transit',
      'Immediate cash payout upon verified student check-in',
      'Expand European network and connect with incoming scholars'
    ],
    streams: ['Frankfurt Airport Team', 'Munich Transit Desk', 'Berlin Regional Hub'],
    actionText: 'Register as Transit Coordinator',
    description: 'Receive newly arriving Indian and international students at German & EU airports. Assist with train connections, luggage transfer, and accommodation check-ins.',
    termsAndConditions: 'Available to enrolled students residing in Germany with valid residence permits (Aufenthaltstitel). Flexible hours up to legal 20h/week limit.',
    status: 'Active',
    createdAt: '2026-02-01'
  },
  {
    id: 'WSP-PKG-ABR-02',
    category: 'work-in-abroad',
    categoryLabel: 'Work & Study in Abroad',
    title: 'Student Flatshare & City Registration Support',
    badge: 'Accommodation & Setup',
    stipend: '€80 – €200 / student',
    trainingDuration: '2 Weeks German Bureaucracy Workshop',
    internshipDuration: 'Flexible / Per-Case Basis',
    certification: 'European Student Relocation Advisor Credential',
    roles: [
      'WG Flatshare & Apartment Matching Assistance',
      'Local City Hall Registration (Anmeldung) Appointment Escort',
      'German Bank Account Setup (Sparkasse, Deutsche Bank, N26)',
      'Public Statutory Health Insurance (TK, AOK, Barmer) Activation'
    ],
    streams: ['Bavaria Region', 'North Rhine-Westphalia Hub', 'Baden-Württemberg Support'],
    actionText: 'Register as Onboarding Lead',
    description: 'Guide incoming students in securing WG rooms, local SIM cards, public transport passes, and city hall registration.',
    termsAndConditions: 'Compensation is released immediately upon confirmation of student Anmeldung and accommodation contract handover.',
    status: 'Active',
    createdAt: '2026-02-05'
  },

  // 3. German Onboarding Projects
  {
    id: 'WSP-PKG-GER-01',
    category: 'german-projects',
    categoryLabel: 'German Onboarding Projects',
    title: 'German Language Immersion & Peer Mentoring',
    badge: 'Faculty Track',
    stipend: '€15 – €25 / hour',
    trainingDuration: '4 Weeks Goethe/Telc Pedagogical Bootcamp',
    internshipDuration: '6 Months Academic Semester',
    certification: 'German Language Peer Instructor & Immersion Fellow Certification',
    roles: [
      'Conduct daily conversational German breakout sessions (A1–B2)',
      'Review homework and pronunciation using IntelliCoach AI telemetry',
      'Organize weekly cultural Stammtisch meetups online and on-campus',
      'Direct recommendation to German university student tutor positions'
    ],
    streams: ['Medical German FSP Peer Coach', 'Tech German for Engineers', 'CEFR Foundation A1-B1'],
    actionText: 'Apply as Language Fellow',
    description: 'Lead interactive German conversation sessions for incoming batches while refining your own academic German fluency.',
    termsAndConditions: 'Requires minimum B2 certified German level. Payouts credited bi-weekly directly to IBAN / PayPal.',
    status: 'Active',
    createdAt: '2026-02-10'
  },

  // 4. Reward and Earning Platform
  {
    id: 'WSP-PKG-REW-01',
    category: 'reward-study-platform',
    categoryLabel: 'Reward & Study Platform',
    title: 'Junior Consultant & Campus Brand Lead',
    badge: 'Earning Engine',
    stipend: '₹10,000 – ₹50,000+ / mo (Incentives)',
    trainingDuration: '1 Week Fast-Track Consultant Training',
    internshipDuration: 'Continuous / Open Ended',
    certification: 'ILAS Certified Global Education Consultant Card & Badge',
    roles: [
      'Distribute personalized Junior Consultant referral cards',
      'Earn ₹5,000 to ₹15,000 per verified student enrollment',
      'Redeem points for laptops, Europe flight vouchers, and cash bonuses',
      'Automated real-time wallet tracking and instant payout triggers'
    ],
    streams: ['Campus Ambassador Track', 'Online Community Affiliate', 'Regional Education Agent'],
    actionText: 'Activate Consultant Card',
    description: 'Empower peers to pursue European higher education and career placements while building substantial recurring revenue for your own education fund.',
    termsAndConditions: 'Open to all verified students and alumni. Instant credit on student registration and enrollment milestones.',
    status: 'Active',
    createdAt: '2026-02-15'
  }
];

export const getWorkStudyPackages = (): WorkStudyPackage[] => {
  const data = localStorage.getItem('ilas_work_study_packages_v2');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_work_study_packages_v2:', e);
    }
  }
  localStorage.setItem('ilas_work_study_packages_v2', JSON.stringify(SEED_WORK_STUDY_PACKAGES));
  return SEED_WORK_STUDY_PACKAGES;
};

export const saveWorkStudyPackage = (pkg: WorkStudyPackage): WorkStudyPackage[] => {
  const current = getWorkStudyPackages();
  const exists = current.some(p => p.id === pkg.id);
  const updated = exists 
    ? current.map(p => p.id === pkg.id ? pkg : p)
    : [pkg, ...current];
    
  localStorage.setItem('ilas_work_study_packages_v2', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-packages-changed'));
  return updated;
};

export const deleteWorkStudyPackage = (id: string): WorkStudyPackage[] => {
  const current = getWorkStudyPackages();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem('ilas_work_study_packages_v2', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-work-study-packages-changed'));
  return updated;
};

export const resetDefaultWorkStudyPackages = (): WorkStudyPackage[] => {
  localStorage.setItem('ilas_work_study_packages_v2', JSON.stringify(SEED_WORK_STUDY_PACKAGES));
  window.dispatchEvent(new CustomEvent('ilas-work-study-packages-changed'));
  return SEED_WORK_STUDY_PACKAGES;
};

export interface JDPromotionPayload {
  packageId: string;
  jobTitle: string;
  domainOrCategory: string;
  stipend: string;
  channels: ('WhatsApp' | 'Meta Ads' | 'LinkedIn' | 'Email Funnel' | 'Public Contact Lists')[];
  customMessage?: string;
  targetRegion: string;
}

export const promoteJobDescriptionToMarketing = (payload: JDPromotionPayload) => {
  const campaignId = `JD-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  // 1. Mark package as promoted
  const packages = getWorkStudyPackages();
  const updatedPackages = packages.map(p => {
    if (p.id === payload.packageId) {
      return {
        ...p,
        promotedToMarketing: true,
        marketingCampaignId: campaignId,
        lastPromotedAt: now
      };
    }
    return p;
  });
  localStorage.setItem('ilas_work_study_packages_v2', JSON.stringify(updatedPackages));
  window.dispatchEvent(new CustomEvent('ilas-work-study-packages-changed'));

  // 2. Dispatch to Marketing Studio & Marketing Analytics
  const newMarketingCampaign = {
    id: campaignId,
    name: `Work & Study JD Broadcast: ${payload.jobTitle}`,
    channel: payload.channels.join(' + '),
    budget: payload.channels.length * 5000,
    spent: 0,
    status: 'Active',
    targetGeography: payload.targetRegion || 'All India & DACH Region',
    jobPackageId: payload.packageId,
    createdAt: now,
    leadsGenerated: 0
  };

  const existingCampaigns = JSON.parse(localStorage.getItem('ilas_marketing_campaigns') || '[]');
  existingCampaigns.unshift(newMarketingCampaign);
  localStorage.setItem('ilas_marketing_campaigns', JSON.stringify(existingCampaigns));

  // 3. Dispatch global system event so Marketing Studio & Analytics refresh automatically
  window.dispatchEvent(new CustomEvent('ilas-marketing-campaigns-updated', { detail: newMarketingCampaign }));

  return {
    success: true,
    campaignId,
    message: `Job Description "${payload.jobTitle}" broadcasted successfully to ${payload.channels.join(', ')}!`
  };
};

// ==========================================
// REWARD & CONSULTANT PLATFORM DATA MODELS & CRUD
// ==========================================

export interface RewardRule {
  id: string;
  actionTitle: string;
  category: 'Referral' | 'Course Milestone' | 'Study Abroad' | 'Visa' | 'Work & Study';
  pointsReward: number;
  cashIncentive: string;
  description: string;
  status: 'Active' | 'Paused';
}

export interface RewardCatalogItem {
  id: string;
  title: string;
  type: 'Gift Package' | 'Tour Package' | 'Salary Incentive' | 'Course Subsidy' | 'Cashback';
  pointsCost: number;
  monetaryValue: string;
  badge: string;
  stockStatus: 'In Stock' | 'Limited Availability' | 'On Request';
  description: string;
  imageUrl?: string;
}

export interface RewardUserScore {
  id: string;
  userName: string;
  userEmail: string;
  userRole: 'Junior Consultant' | 'Senior Executive' | 'Global Partner' | 'Student Ambassador';
  pointsBalance: number;
  totalPointsEarned: number;
  referralCount: number;
  milestonesCompleted: number;
  activeTier: 'Junior Consultant' | 'Senior Executive' | 'Global Partner';
  consultantCardId: string;
  lastActivity: string;
}

export interface RewardRedemptionRequest {
  id: string;
  userName: string;
  userEmail: string;
  rewardItemTitle: string;
  rewardType: 'Gift Package' | 'Tour Package' | 'Salary Incentive' | 'Course Subsidy' | 'Cashback';
  pointsDeducted: number;
  cashAmount?: string;
  status: 'Pending Review' | 'Approved by Marketing' | 'Approved by Accounts' | 'Fulfilled / Disbursed' | 'Rejected';
  requestDate: string;
  fulfillmentNotes?: string;
}

export interface RewardBlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: 'Referral & Peer Promotion' | 'Work & Study & Career Gains' | 'Study Abroad Pathways' | 'Visa & Placement Services';
  readTime: string;
  featuredBadge?: string;
  author: string;
  date: string;
  summary: string;
  contentParagraphs: string[];
  actionUrl: string;
  actionLabel: string;
  imageUrl: string;
  pointsBonusTag?: string;
}

const SEED_REWARD_RULES: RewardRule[] = [
  {
    id: 'RULE-01',
    actionTitle: 'Enrolling a Student / Peer in Course',
    category: 'Referral',
    pointsReward: 50,
    cashIncentive: '₹2,500 – ₹5,000 Cash Bonus',
    description: 'Awarded when a referred student completes enrollment in German Language (A1-B2) or Tech courses.',
    status: 'Active'
  },
  {
    id: 'RULE-02',
    actionTitle: 'Academy Course Level Completion',
    category: 'Course Milestone',
    pointsReward: 100,
    cashIncentive: 'Official Certificate + ₹3,000 Milestone Bonus',
    description: 'Awarded to students upon successfully clearing Goethe/IELTS examinations or tech track capstones.',
    status: 'Active'
  },
  {
    id: 'RULE-03',
    actionTitle: 'Study Abroad University Admission',
    category: 'Study Abroad',
    pointsReward: 150,
    cashIncentive: '₹10,000 Referral Commission',
    description: 'Awarded when a referred candidate obtains public or private university admission letter in Europe.',
    status: 'Active'
  },
  {
    id: 'RULE-04',
    actionTitle: 'On-Ground Abroad Arrival Support Task',
    category: 'Study Abroad',
    pointsReward: 75,
    cashIncentive: '€50 – €250 Euro Payout / Task',
    description: 'Assisting newly arriving students with airport pickup, train transit, or city hall (Anmeldung) registration.',
    status: 'Active'
  },
  {
    id: 'RULE-05',
    actionTitle: 'Verified Work & Study Corporate Pilot Delivery',
    category: 'Work & Study',
    pointsReward: 120,
    cashIncentive: '₹15,000 – ₹35,000 Monthly Stipend',
    description: 'Delivering audited live company projects in software, solar installation, or international trade.',
    status: 'Active'
  },
  {
    id: 'RULE-06',
    actionTitle: 'Successful European Visa Clearance',
    category: 'Visa',
    pointsReward: 200,
    cashIncentive: '₹15,000 Payout + 100% Free Placement Unlock',
    description: 'Embassy visa clearance achieved for German Opportunity Card, Blue Card, or 18a/b Skilled Worker.',
    status: 'Active'
  }
];

const SEED_REWARD_CATALOG: RewardCatalogItem[] = [
  {
    id: 'CAT-01',
    title: 'Developer Pro Laptop & Tech Kit',
    type: 'Gift Package',
    pointsCost: 500,
    monetaryValue: '₹65,000 Value',
    badge: 'Hardware Gift',
    stockStatus: 'In Stock',
    description: 'High-performance developer workstation with AI accelerator, mechanical keyboard, and official ILA consultant badge.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'CAT-02',
    title: '7-Day European Educational Tour Package',
    type: 'Tour Package',
    pointsCost: 1000,
    monetaryValue: '₹2,50,000 Value (All-Expense Paid)',
    badge: 'Grand Reward',
    stockStatus: 'Limited Availability',
    description: 'Fully sponsored international study tour visiting German public universities, tech hubs in Munich & Berlin, and Swiss partner firms.',
    imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'CAT-03',
    title: '₹15,000 Instant Wallet Payout',
    type: 'Cashback',
    pointsCost: 150,
    monetaryValue: '₹15,000 Direct Bank Transfer',
    badge: 'Instant Cash',
    stockStatus: 'In Stock',
    description: 'Disbursed directly into your verified bank account or European N26/Sparkasse account within 24 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'CAT-04',
    title: '50% Course Fee Concession Voucher',
    type: 'Course Subsidy',
    pointsCost: 100,
    monetaryValue: 'Up to ₹25,000 Savings',
    badge: 'Education Voucher',
    stockStatus: 'In Stock',
    description: 'Instant 50% tuition reduction applicable on all Goethe German language batches (A1-C1) or IELTS intensive coaching.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'CAT-05',
    title: 'Junior Consultant Executive Salary Step-Up',
    type: 'Salary Incentive',
    pointsCost: 300,
    monetaryValue: '+₹10,000 / Month Stipend Raise',
    badge: 'Career Growth',
    stockStatus: 'In Stock',
    description: 'Promotional monthly pay raise applied to active Work & Study junior consultants with certified performance audit.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800'
  }
];

const SEED_REWARD_SCORES: RewardUserScore[] = [
  {
    id: 'USR-801',
    userName: 'Rohan Sharma',
    userEmail: 'rohan.s@gmail.com',
    userRole: 'Junior Consultant',
    pointsBalance: 450,
    totalPointsEarned: 850,
    referralCount: 8,
    milestonesCompleted: 4,
    activeTier: 'Junior Consultant',
    consultantCardId: 'ILA-JC-2026-801',
    lastActivity: '2026-08-28'
  },
  {
    id: 'USR-802',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.d@outlook.com',
    userRole: 'Senior Executive',
    pointsBalance: 1250,
    totalPointsEarned: 2400,
    referralCount: 22,
    milestonesCompleted: 11,
    activeTier: 'Senior Executive',
    consultantCardId: 'ILA-SEC-2026-802',
    lastActivity: '2026-08-29'
  },
  {
    id: 'USR-803',
    userName: 'Klaus Mueller',
    userEmail: 'dr.klaus@charite.de',
    userRole: 'Global Partner',
    pointsBalance: 3100,
    totalPointsEarned: 5800,
    referralCount: 46,
    milestonesCompleted: 28,
    activeTier: 'Global Partner',
    consultantCardId: 'ILA-GVP-2026-803',
    lastActivity: '2026-08-27'
  }
];

const SEED_REDEMPTION_REQUESTS: RewardRedemptionRequest[] = [
  {
    id: 'RED-901',
    userName: 'Rohan Sharma',
    userEmail: 'rohan.s@gmail.com',
    rewardItemTitle: '₹15,000 Instant Wallet Payout',
    rewardType: 'Cashback',
    pointsDeducted: 150,
    cashAmount: '₹15,000',
    status: 'Approved by Accounts',
    requestDate: '2026-08-26',
    fulfillmentNotes: 'Disbursed via UPI transaction #ILA992140'
  },
  {
    id: 'RED-902',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.d@outlook.com',
    rewardItemTitle: '7-Day European Educational Tour Package',
    rewardType: 'Tour Package',
    pointsDeducted: 1000,
    cashAmount: '₹2,50,000 Value',
    status: 'Approved by Marketing',
    requestDate: '2026-08-28',
    fulfillmentNotes: 'Visa sponsorship documents dispatched for Munich & Berlin tour'
  },
  {
    id: 'RED-903',
    userName: 'Vikram Singh',
    userEmail: 'vikram.s@yahoo.com',
    rewardItemTitle: 'Developer Pro Laptop & Tech Kit',
    rewardType: 'Gift Package',
    pointsDeducted: 500,
    cashAmount: '₹65,000 Value',
    status: 'Pending Review',
    requestDate: '2026-08-29',
    fulfillmentNotes: 'Awaiting device dispatch address confirmation'
  }
];

const SEED_REWARD_BLOG_POSTS: RewardBlogPost[] = [
  {
    id: 'BLOG-01',
    title: 'Promote Your Education Course to Friends: Learn Together, Earn Together',
    subtitle: 'Turn Your Study Peer Group into a High-Income Study & Referral Squad',
    category: 'Referral & Peer Promotion',
    readTime: '4 min read',
    featuredBadge: 'Top Trending Guide',
    author: 'ILA Community Editorial',
    date: 'August 28, 2026',
    summary: 'Did you know that inviting a classmate to join Goethe German (A1-B2) or full-stack software classes earns you 50 Reward Points and ₹2,500 to ₹5,000 instant referral bonus? Learn how easy it is to share your student link.',
    contentParagraphs: [
      'Education is always more fun when you study with friends. When you introduce your classmates, college peers, or colleagues to ILA Global courses, you both win. Your friend receives structured, world-class coaching with interactive AI trainers, and you unlock instant cash bonuses and progression toward premium tech gifts.',
      'Every time a student registers using your Junior Consultant Card code, our automated communication trigger credits your wallet instantly. Enrolling just 2 friends covers your entire monthly living expenses or offsets your own course fees completely.'
    ],
    actionUrl: '#applications?tab=Reward Club - Refer Friends',
    actionLabel: 'Invite Friends & Earn Points →',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    pointsBonusTag: '+50 Points / Enrollment'
  },
  {
    id: 'BLOG-02',
    title: 'Work & Study & Career Gains: Build Real Experience While You Learn',
    subtitle: 'Why Passive Studying Is Dead — Step Straight into Paid Corporate Job Pilots',
    category: 'Work & Study & Career Gains',
    readTime: '5 min read',
    featuredBadge: 'Career Blueprint',
    author: 'HOD Corporate Relations',
    date: 'August 26, 2026',
    summary: 'Gain verified 1-year corporate experience letters, ₹15,000 to ₹35,000 monthly stipends, and real-world project portfolios in software, solar installations, and international trade.',
    contentParagraphs: [
      'In today’s competitive global job market, degrees alone are no longer sufficient. German employers and multinational corporations demand proven work experience. Through ILA Global’s Work & Study pilot programs, students participate in real business deliverables right from month one.',
      'Whether you are deploying web apps with AI frameworks, running commercial solar energy audits, or coordinating cross-border import-export files, your time is paid and audited. Top performers receive fast-track salary raises and direct international relocation sponsorship.'
    ],
    actionUrl: '#work-while-you-study-page',
    actionLabel: 'Explore Work & Study Programs →',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
    pointsBonusTag: '+120 Points / Milestone'
  },
  {
    id: 'BLOG-03',
    title: 'Study Abroad Pathways: Free Public Universities in Germany vs. London & Beyond',
    subtitle: 'Navigating 0€ Tuition Fees, Blocked Accounts, and International Student Living',
    category: 'Study Abroad Pathways',
    readTime: '6 min read',
    featuredBadge: 'Comprehensive Guide',
    author: 'Global Mobility Director',
    date: 'August 24, 2026',
    summary: 'Compare public vs. private university pathways, understand 0€ tuition models across Germany’s top institutions (TU9, LMU, FAU), and explore options for the UK, London, and broader Europe.',
    contentParagraphs: [
      'Germany offers an unparalleled education model: world-ranked public universities with zero tuition fees for international students. Students only pay nominal semester administration fees (around €150-€350 per semester) while receiving world-class education and free state-wide public transit passes.',
      'For candidates seeking private business schools or direct English-taught programs in destinations like London, Dublin, or Berlin, ILA Global arranges guaranteed scholarship assistance, blocked account processing (€11,900 compliance), and on-ground airport reception and apartment finder services.'
    ],
    actionUrl: '#study-abroad',
    actionLabel: 'Discover Free EU Universities →',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    pointsBonusTag: '+150 Points / Admission'
  },
  {
    id: 'BLOG-04',
    title: 'Visa & Job Placement Services: 100% Placement Potential in High-Demand European Markets',
    subtitle: 'German Opportunity Card, EU Blue Card, and Massive Shortages for Skilled Talent',
    category: 'Visa & Placement Services',
    readTime: '5 min read',
    featuredBadge: 'Visa & Jobs Intel',
    author: 'Immigration Legal Advisory',
    date: 'August 22, 2026',
    summary: 'Germany is experiencing historic labor shortages in Healthcare (Doctors & Nurses), IT/Software Engineering, and Technical trades. Learn how ILA’s end-to-end visa and placement engine guarantees career success.',
    contentParagraphs: [
      'With over 400,000 skilled job vacancies annually, Germany has modernized its immigration legislation through the Opportunity Card (Chancenkarte) and relaxed EU Blue Card salary thresholds. Healthcare workers, nurses, doctors, software developers, and electrical engineers are fast-tracked for permanent residency within 21–27 months.',
      'ILA Global provides full legal document vetting, Defizitbescheid deficit letter resolutions for medical professionals, sworn German translations, embassy appointment expediting, and direct interview matching with German hospital chains and tech enterprises.'
    ],
    actionUrl: '#jobs-page',
    actionLabel: 'View German Job Vacancies →',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    pointsBonusTag: '+200 Points / Visa Approved'
  }
];

// Getter & Setter Functions

export const getRewardRules = (): RewardRule[] => {
  const data = localStorage.getItem('ilas_reward_rules');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_reward_rules:', e);
    }
  }
  localStorage.setItem('ilas_reward_rules', JSON.stringify(SEED_REWARD_RULES));
  return SEED_REWARD_RULES;
};

export const saveRewardRule = (rule: RewardRule): RewardRule[] => {
  const current = getRewardRules();
  const exists = current.some(r => r.id === rule.id);
  const updated = exists ? current.map(r => r.id === rule.id ? rule : r) : [rule, ...current];
  localStorage.setItem('ilas_reward_rules', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-rules-changed'));
  return updated;
};

export const deleteRewardRule = (id: string): RewardRule[] => {
  const current = getRewardRules();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem('ilas_reward_rules', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-rules-changed'));
  return updated;
};

export const getRewardCatalog = (): RewardCatalogItem[] => {
  const data = localStorage.getItem('ilas_reward_catalog');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_reward_catalog:', e);
    }
  }
  localStorage.setItem('ilas_reward_catalog', JSON.stringify(SEED_REWARD_CATALOG));
  return SEED_REWARD_CATALOG;
};

export const saveRewardCatalogItem = (item: RewardCatalogItem): RewardCatalogItem[] => {
  const current = getRewardCatalog();
  const exists = current.some(i => i.id === item.id);
  const updated = exists ? current.map(i => i.id === item.id ? item : i) : [item, ...current];
  localStorage.setItem('ilas_reward_catalog', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-catalog-changed'));
  return updated;
};

export const deleteRewardCatalogItem = (id: string): RewardCatalogItem[] => {
  const current = getRewardCatalog();
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem('ilas_reward_catalog', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-catalog-changed'));
  return updated;
};

export const getRewardUserScores = (): RewardUserScore[] => {
  const data = localStorage.getItem('ilas_reward_scores');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_reward_scores:', e);
    }
  }
  localStorage.setItem('ilas_reward_scores', JSON.stringify(SEED_REWARD_SCORES));
  return SEED_REWARD_SCORES;
};

export const saveRewardUserScore = (userScore: RewardUserScore): RewardUserScore[] => {
  const current = getRewardUserScores();
  const exists = current.some(u => u.id === userScore.id);
  const updated = exists ? current.map(u => u.id === userScore.id ? userScore : u) : [userScore, ...current];
  localStorage.setItem('ilas_reward_scores', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-scores-changed'));
  return updated;
};

export const getRewardRedemptions = (): RewardRedemptionRequest[] => {
  const data = localStorage.getItem('ilas_reward_redemptions');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_reward_redemptions:', e);
    }
  }
  localStorage.setItem('ilas_reward_redemptions', JSON.stringify(SEED_REDEMPTION_REQUESTS));
  return SEED_REDEMPTION_REQUESTS;
};

export const saveRewardRedemption = (request: RewardRedemptionRequest): RewardRedemptionRequest[] => {
  const current = getRewardRedemptions();
  const exists = current.some(r => r.id === request.id);
  const updated = exists ? current.map(r => r.id === request.id ? request : r) : [request, ...current];
  localStorage.setItem('ilas_reward_redemptions', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-redemptions-changed'));
  return updated;
};

export const updateRedemptionStatus = (
  id: string, 
  status: RewardRedemptionRequest['status'],
  notes?: string
): RewardRedemptionRequest[] => {
  const current = getRewardRedemptions();
  const updated = current.map(r => {
    if (r.id === id) {
      return {
        ...r,
        status,
        fulfillmentNotes: notes !== undefined ? notes : r.fulfillmentNotes
      };
    }
    return r;
  });
  localStorage.setItem('ilas_reward_redemptions', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-redemptions-changed'));
  return updated;
};

export const getRewardBlogPosts = (): RewardBlogPost[] => {
  const data = localStorage.getItem('ilas_reward_blog_posts');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse ilas_reward_blog_posts:', e);
    }
  }
  localStorage.setItem('ilas_reward_blog_posts', JSON.stringify(SEED_REWARD_BLOG_POSTS));
  return SEED_REWARD_BLOG_POSTS;
};

export const saveRewardBlogPost = (post: RewardBlogPost): RewardBlogPost[] => {
  const current = getRewardBlogPosts();
  const exists = current.some(p => p.id === post.id);
  const updated = exists ? current.map(p => p.id === post.id ? post : p) : [post, ...current];
  localStorage.setItem('ilas_reward_blog_posts', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-blog-posts-changed'));
  return updated;
};

export const deleteRewardBlogPost = (id: string): RewardBlogPost[] => {
  const current = getRewardBlogPosts();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem('ilas_reward_blog_posts', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-reward-blog-posts-changed'));
  return updated;
};

export const getRewardHubStats = () => {
  const rules = getRewardRules();
  const catalog = getRewardCatalog();
  const users = getRewardUserScores();
  const redemptions = getRewardRedemptions();
  const blogs = getRewardBlogPosts();

  const totalPointsAwarded = users.reduce((acc, u) => acc + u.totalPointsEarned, 0);
  const totalPendingRedemptions = redemptions.filter(r => r.status === 'Pending Review' || r.status === 'Approved by Marketing').length;
  const totalFulfilled = redemptions.filter(r => r.status === 'Fulfilled / Disbursed').length;

  return {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.status === 'Active').length,
    totalCatalogItems: catalog.length,
    totalRegisteredConsultants: users.length,
    totalPointsAwarded,
    totalPendingRedemptions,
    totalFulfilled,
    totalBlogPosts: blogs.length
  };
};

// =========================================================================
// UNIVERSAL SUB-NAVIGATION & MULTI-HUB EXTENSIONS (STUDY ABROAD, JOBS, ETC)
// =========================================================================

// --- 1. STUDY ABROAD MODELS & CRUD ---
export interface CountryItem {
  id: string;
  name: string;
  code: string;
  flag: string;
  visaType: string;
  currency: string;
  avgTuition: string;
  livingCost: string;
  description: string;
  status: 'Active' | 'Coming Soon';
}

export interface CollegeItem {
  id: string;
  countryId: string;
  name: string;
  city: string;
  ranking: string;
  type: 'Public' | 'Private' | 'University of Applied Sciences' | 'Technical University';
  admissionCriteria: string;
  terms: string[];
  contactEmail: string;
  status: 'Active' | 'Partnered' | 'Under Review';
}

export interface AbroadCourseItem {
  id: string;
  countryId: string;
  collegeId: string;
  collegeName: string;
  courseName: string;
  degree: 'Bachelors' | 'Masters' | 'Ausbildung' | 'Diploma';
  duration: string;
  language: 'English' | 'German' | 'Bilingual';
  tuitionPerYear: string;
  minCGPA: number;
  minIELTS: number;
  minGermanLevel: 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  intakeSeason: string[];
  description: string;
  isFeatured: boolean;
}

export interface AbroadApplicationItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  targetCountryId: string;
  targetCountryName: string;
  targetDegree: string;
  preferredField: string;
  cgpa: number;
  ieltsScore: number;
  germanLevel: 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  budgetEUR: number;
  resumeFileName: string;
  assignedCollegeId?: string;
  assignedCollegeName?: string;
  matchedCourseId?: string;
  matchedCourseName?: string;
  matchScore?: number;
  isCollegeRevealed: boolean; // Privacy Gate: Revealed only when admin approves
  status: 'Submitted' | 'Matched' | 'Under Review' | 'College Approved' | 'Visa Processing' | 'Rejected';
  createdAt: string;
  adminNotes?: string;
}

const SEED_ABROAD_COUNTRIES: CountryItem[] = [
  {
    id: 'country-de',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    visaType: 'National Student Visa (APS / 16b)',
    currency: 'EUR (€)',
    avgTuition: '€0 - €3,000 / yr (Public Universities)',
    livingCost: '€934 - €1,000 / mo (Blocked Account)',
    description: 'World-renowned tuition-free public universities with 18-month post-study job seeker visa.',
    status: 'Active'
  },
  {
    id: 'country-at',
    name: 'Austria',
    code: 'AT',
    flag: '🇦🇹',
    visaType: 'Residence Permit Student',
    currency: 'EUR (€)',
    avgTuition: '€726 - €1,500 / semester',
    livingCost: '€900 - €1,100 / mo',
    description: 'High standard of living in Central Europe with premier research institutions in Vienna and Graz.',
    status: 'Active'
  },
  {
    id: 'country-ch',
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    visaType: 'Swiss Student Visa (Type D)',
    currency: 'CHF',
    avgTuition: 'CHF 1,000 - CHF 4,000 / yr',
    livingCost: 'CHF 1,800 - CHF 2,200 / mo',
    description: 'Top European technology institutes (ETH Zurich, EPFL) with global corporate innovation labs.',
    status: 'Active'
  },
  {
    id: 'country-ie',
    name: 'Ireland',
    code: 'IE',
    flag: '🇮🇪',
    visaType: 'Irish Study Visa (Stamp 2)',
    currency: 'EUR (€)',
    avgTuition: '€9,000 - €15,000 / yr',
    livingCost: '€1,000 - €1,300 / mo',
    description: 'European Tech Silicon Docks Hub with 2-year post-study work visa in top global multinational companies.',
    status: 'Active'
  }
];

const SEED_ABROAD_COLLEGES: CollegeItem[] = [
  {
    id: 'col-tum',
    countryId: 'country-de',
    name: 'Technical University of Munich (TUM)',
    city: 'Munich',
    ranking: 'QS #37 Global / #1 Germany',
    type: 'Public',
    admissionCriteria: 'Min 7.5 CGPA, APS Certificate, B2/C1 English or German B2',
    terms: ['APS Mandatory', 'GRE recommended for CS', 'Winter & Summer Intakes'],
    contactEmail: 'admissions@tum.de',
    status: 'Partnered'
  },
  {
    id: 'col-rwth',
    countryId: 'country-de',
    name: 'RWTH Aachen University',
    city: 'Aachen',
    ranking: 'QS #106 Global / Engineering Elite',
    type: 'Public',
    admissionCriteria: 'Min 7.0 CGPA, APS Certificate, IELTS 6.5 or TestDaF 4',
    terms: ['Uni-Assist VPD Required', 'Mechanical & Electrical Excellence', '€0 Tuition'],
    contactEmail: 'international@rwth-aachen.de',
    status: 'Partnered'
  },
  {
    id: 'col-fau',
    countryId: 'country-de',
    name: 'FAU Erlangen-Nürnberg',
    city: 'Erlangen / Nuremberg',
    ranking: 'QS #229 Global / Top AI & MedTech',
    type: 'Public',
    admissionCriteria: 'Min 6.8 CGPA, APS Certificate, IELTS 6.5',
    terms: ['Free Tuition', 'Siemens & Adidas Partner Campus', 'English Taught Tracks'],
    contactEmail: 'study-abroad@fau.de',
    status: 'Active'
  },
  {
    id: 'col-tu-wien',
    countryId: 'country-at',
    name: 'TU Wien (Vienna University of Technology)',
    city: 'Vienna',
    ranking: 'QS #184 Global',
    type: 'Public',
    admissionCriteria: 'Min 7.0 CGPA, A2 German for preparatory, IELTS 6.5',
    terms: ['Special University Entrance Qualification', 'Standard Austrian Semester Fee'],
    contactEmail: 'admissions@tuwien.ac.at',
    status: 'Partnered'
  }
];

const SEED_ABROAD_COURSES: AbroadCourseItem[] = [
  {
    id: 'crs-de-mba-hosp',
    countryId: 'country-de',
    collegeId: 'col-tum',
    collegeName: 'Munich Business & Hospitality School (TUM Affiliate)',
    courseName: 'MBA in International Hospitality Management',
    degree: 'Masters',
    duration: '2 Years (4 Semesters)',
    language: 'English',
    tuitionPerYear: '€0 (Public Subsidy)',
    minCGPA: 7.0,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct)', 'Summer (Apr)'],
    description: 'Premier Master program in luxury hotel operations, gastronomy economics, international resort leadership, and corporate hospitality asset management.',
    isFeatured: true
  },
  {
    id: 'crs-de-msc-catering',
    countryId: 'country-de',
    collegeId: 'col-fau',
    collegeName: 'FAU International School of Tourism & Culinary Arts',
    courseName: 'MSc in Tourism and Catering Management',
    degree: 'Masters',
    duration: '2 Years',
    language: 'English',
    tuitionPerYear: '€0 (Public Subsidy)',
    minCGPA: 6.8,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct)', 'Summer (Apr)'],
    description: 'Post-graduate program combining culinary operations administration, food logistics & supply chains, strategic catering economics, and sustainable tourism.',
    isFeatured: true
  },
  {
    id: 'crs-de-mba-exec',
    countryId: 'country-de',
    collegeId: 'col-rwth',
    collegeName: 'RWTH Aachen Business & Executive School',
    courseName: 'Master of Business Administration (Executive)',
    degree: 'Masters',
    duration: '1.5 - 2 Years (Fast-Track)',
    language: 'English',
    tuitionPerYear: '€0 (Fully Subsidized)',
    minCGPA: 7.0,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct)'],
    description: 'Executive MBA specifically designed for professionals with degrees and certificates in business administration, hotel management, and corporate operations.',
    isFeatured: true
  },
  {
    id: 'crs-de-msc-event',
    countryId: 'country-de',
    collegeId: 'col-fau',
    collegeName: 'FAU Erlangen-Nürnberg',
    courseName: 'M.Sc. in Sustainable Hospitality & Event Operations',
    degree: 'Masters',
    duration: '2 Years',
    language: 'English',
    tuitionPerYear: '€0 (Free Tuition)',
    minCGPA: 6.5,
    minIELTS: 6.0,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct)'],
    description: 'Strategic venue leadership, luxury hospitality branding, sustainable mega-event management, and international exhibition catering.',
    isFeatured: false
  },
  {
    id: 'crs-de-ausb-hotel',
    countryId: 'country-de',
    collegeId: 'col-fau',
    collegeName: 'FAU Vocational Academy & German Hotel Association (DEHOGA)',
    courseName: 'Ausbildung: State-Certified Hotel & Catering Specialist',
    degree: 'Ausbildung',
    duration: '3 Years (Dual Paid Study)',
    language: 'German',
    tuitionPerYear: '€0 + €1,200/mo Stipend',
    minCGPA: 6.0,
    minIELTS: 5.5,
    minGermanLevel: 'B1',
    intakeSeason: ['Autumn (Aug/Sep)'],
    description: 'Government-certified dual vocational program in five-star hotel operations, gastronomy management, and catering administration with monthly stipend.',
    isFeatured: true
  },
  {
    id: 'crs-de-bsc-culinary',
    countryId: 'country-de',
    collegeId: 'col-tum',
    collegeName: 'TUM School of Life Sciences & Management',
    courseName: 'B.Sc. in International Culinary Arts & Hospitality Management',
    degree: 'Bachelors',
    duration: '3-4 Years (Bachelors)',
    language: 'English',
    tuitionPerYear: '€0 (Public University)',
    minCGPA: 6.5,
    minIELTS: 6.0,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct)'],
    description: 'Comprehensive degree covering institutional food service management, commercial culinary operations, and hospitality business administration.',
    isFeatured: false
  }
];

const SEED_ABROAD_APPLICATIONS: AbroadApplicationItem[] = [
  {
    id: 'app-abroad-101',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma22@gmail.com',
    studentPhone: '+91 98450 11234',
    targetCountryId: 'country-de',
    targetCountryName: 'Germany',
    targetDegree: 'Masters',
    preferredField: 'Computer Science / AI',
    cgpa: 8.2,
    ieltsScore: 7.5,
    germanLevel: 'A2',
    budgetEUR: 12000,
    resumeFileName: 'Rohan_Sharma_BTech_CS_Resume.pdf',
    assignedCollegeId: 'col-tum',
    assignedCollegeName: 'Technical University of Munich (TUM)',
    matchedCourseId: 'crs-de-cs',
    matchedCourseName: 'M.Sc. Computer Science & AI Systems',
    matchScore: 94,
    isCollegeRevealed: false,
    status: 'Matched',
    createdAt: '2026-09-08'
  },
  {
    id: 'app-abroad-102',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.v99@outlook.com',
    studentPhone: '+91 97120 44556',
    targetCountryId: 'country-de',
    targetCountryName: 'Germany',
    targetDegree: 'Masters',
    preferredField: 'Automotive & Mechanical',
    cgpa: 7.6,
    ieltsScore: 6.5,
    germanLevel: 'B1',
    budgetEUR: 11000,
    resumeFileName: 'Ananya_Verma_Mechanical_CV.pdf',
    assignedCollegeId: 'col-rwth',
    assignedCollegeName: 'RWTH Aachen University',
    matchedCourseId: 'crs-de-auto',
    matchedCourseName: 'M.Sc. Automotive & Autonomous Mobility',
    matchScore: 88,
    isCollegeRevealed: true,
    status: 'College Approved',
    createdAt: '2026-09-05'
  }
];

export const getAbroadCountries = (): CountryItem[] => {
  const data = localStorage.getItem('ilas_abroad_countries');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_abroad_countries', JSON.stringify(SEED_ABROAD_COUNTRIES));
  return SEED_ABROAD_COUNTRIES;
};

export const saveAbroadCountry = (country: CountryItem): CountryItem[] => {
  const list = getAbroadCountries();
  const exists = list.some(c => c.id === country.id);
  const updated = exists ? list.map(c => c.id === country.id ? country : c) : [country, ...list];
  localStorage.setItem('ilas_abroad_countries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-countries-changed'));
  return updated;
};

export const deleteAbroadCountry = (id: string): CountryItem[] => {
  const list = getAbroadCountries().filter(c => c.id !== id);
  localStorage.setItem('ilas_abroad_countries', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('ilas-abroad-countries-changed'));
  return list;
};

export const getAbroadColleges = (): CollegeItem[] => {
  const data = localStorage.getItem('ilas_abroad_colleges');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_abroad_colleges', JSON.stringify(SEED_ABROAD_COLLEGES));
  return SEED_ABROAD_COLLEGES;
};

export const saveAbroadCollege = (college: CollegeItem): CollegeItem[] => {
  const list = getAbroadColleges();
  const exists = list.some(c => c.id === college.id);
  const updated = exists ? list.map(c => c.id === college.id ? college : c) : [college, ...list];
  localStorage.setItem('ilas_abroad_colleges', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-colleges-changed'));
  return updated;
};

export const deleteAbroadCollege = (id: string): CollegeItem[] => {
  const list = getAbroadColleges().filter(c => c.id !== id);
  localStorage.setItem('ilas_abroad_colleges', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('ilas-abroad-colleges-changed'));
  return list;
};

export const getAbroadCourses = (): AbroadCourseItem[] => {
  const data = localStorage.getItem('ilas_abroad_courses');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.some((c: AbroadCourseItem) => c.courseName.toLowerCase().includes('hospitality') || c.courseName.toLowerCase().includes('catering'))) {
        return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  localStorage.setItem('ilas_abroad_courses', JSON.stringify(SEED_ABROAD_COURSES));
  return SEED_ABROAD_COURSES;
};

export const saveAbroadCourse = (course: AbroadCourseItem): AbroadCourseItem[] => {
  const list = getAbroadCourses();
  const exists = list.some(c => c.id === course.id);
  const updated = exists ? list.map(c => c.id === course.id ? course : c) : [course, ...list];
  localStorage.setItem('ilas_abroad_courses', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-courses-changed'));
  return updated;
};

export const deleteAbroadCourse = (id: string): AbroadCourseItem[] => {
  const list = getAbroadCourses().filter(c => c.id !== id);
  localStorage.setItem('ilas_abroad_courses', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('ilas-abroad-courses-changed'));
  return list;
};

export const getAbroadApplications = (): AbroadApplicationItem[] => {
  const data = localStorage.getItem('ilas_abroad_applications');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_abroad_applications', JSON.stringify(SEED_ABROAD_APPLICATIONS));
  return SEED_ABROAD_APPLICATIONS;
};

export const saveAbroadApplication = (app: AbroadApplicationItem): AbroadApplicationItem[] => {
  const list = getAbroadApplications();
  const exists = list.some(a => a.id === app.id);
  const updated = exists ? list.map(a => a.id === app.id ? app : a) : [app, ...list];
  localStorage.setItem('ilas_abroad_applications', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-applications-changed'));
  return updated;
};

export const toggleCollegePrivacyReveal = (appId: string, reveal: boolean): AbroadApplicationItem[] => {
  const list = getAbroadApplications();
  const updated = list.map(a => a.id === appId ? { ...a, isCollegeRevealed: reveal, status: (reveal ? 'College Approved' : a.status) as AbroadApplicationItem['status'] } : a);
  localStorage.setItem('ilas_abroad_applications', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-applications-changed'));
  return updated;
};

// Auto match algorithm for Study Abroad student profile
export const matchStudentAbroadProfile = (
  countryId: string,
  _degree: string,
  cgpa: number,
  ielts: number,
  germanLevel: string
) => {
  const courses = getAbroadCourses().filter(c => c.countryId === countryId);
  const colleges = getAbroadColleges();

  const matches = courses.map(course => {
    let score = 50; // base score
    if (cgpa >= course.minCGPA) score += 25;
    else score -= Math.round((course.minCGPA - cgpa) * 15);

    if (ielts >= course.minIELTS) score += 15;
    if (course.minGermanLevel === 'None' || germanLevel >= course.minGermanLevel) score += 10;

    score = Math.min(99, Math.max(25, score));
    const college = colleges.find(col => col.id === course.collegeId);

    return {
      course,
      college,
      score,
      meetsMinCriteria: cgpa >= course.minCGPA && ielts >= course.minIELTS
    };
  }).sort((a, b) => b.score - a.score);

  return matches;
};

// --- 2. JOB SEARCH & LIVE RECRUITMENT DATABASE ---
export interface PartnerCompanyItem {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  country: string;
  hiringTier: 'Strategic Partner' | 'Enterprise Client' | 'Direct Recruiter';
  website: string;
  contactPerson: string;
  activeJobsCount: number;
  status: 'Active' | 'Under Audit';
}

export interface JobListingItem {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  domain: 'Software & IT' | 'Healthcare' | 'Engineering' | 'Business & Finance' | 'Operations';
  country: 'Germany' | 'Austria' | 'Switzerland' | 'Netherlands' | 'India';
  city: string;
  salaryRange: string;
  contractType: 'Full-Time Permanent' | 'Dual Training (Ausbildung)' | 'Hybrid Contractor';
  blueCardEligible: boolean;
  requiredSkills: string[];
  minExperience: string;
  minGermanLevel: 'None' | 'A2' | 'B1' | 'B2' | 'C1';
  openings: number;
  description: string;
  postedDate: string;
  status: 'Active' | 'Draft' | 'Filled';
}

export interface CandidateResumeItem {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  targetCountry: string;
  field: string;
  yearsOfExperience: number;
  highestDegree: string;
  primarySkills: string[];
  germanLevel: 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  englishLevel: 'Fluent' | 'Professional' | 'Basic';
  resumeFileName: string;
  uploadedAt: string;
  status: 'New' | 'Matched' | 'Interview Scheduled' | 'Placed' | 'Archived';
}

export interface JobMatchItem {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  status: 'Suggested' | 'Interview Scheduled' | 'Shortlisted' | 'Offer Extended' | 'Rejected';
  matchedAt: string;
}

const SEED_PARTNER_COMPANIES: PartnerCompanyItem[] = [
  {
    id: 'comp-siemens',
    name: 'Siemens AG',
    logo: '⚡',
    industry: 'Industrial Automation & IoT',
    location: 'Munich & Nuremberg',
    country: 'Germany',
    hiringTier: 'Strategic Partner',
    website: 'https://siemens.com',
    contactPerson: 'Klaus Fischer (Senior Talent Acquisition)',
    activeJobsCount: 4,
    status: 'Active'
  },
  {
    id: 'comp-bosch',
    name: 'Robert Bosch GmbH',
    logo: '🔴',
    industry: 'Automotive & Smart Devices',
    location: 'Stuttgart',
    country: 'Germany',
    hiringTier: 'Strategic Partner',
    website: 'https://bosch.com',
    contactPerson: 'Helena Weber (Global Mobility Lead)',
    activeJobsCount: 3,
    status: 'Active'
  },
  {
    id: 'comp-deliveryhero',
    name: 'Delivery Hero SE',
    logo: '🚀',
    industry: 'Quick Commerce & Software',
    location: 'Berlin',
    country: 'Germany',
    hiringTier: 'Enterprise Client',
    website: 'https://deliveryhero.com',
    contactPerson: 'Stefan Richter (Engineering Director)',
    activeJobsCount: 5,
    status: 'Active'
  },
  {
    id: 'comp-helios',
    name: 'Helios Kliniken GmbH',
    logo: '🏥',
    industry: 'Healthcare & Hospital Networks',
    location: 'Berlin / Leipzig',
    country: 'Germany',
    hiringTier: 'Strategic Partner',
    website: 'https://helios-gesundheit.de',
    contactPerson: 'Dr. Marion Becker (Head of Clinical Staffing)',
    activeJobsCount: 6,
    status: 'Active'
  }
];

const SEED_JOB_LISTINGS: JobListingItem[] = [
  {
    id: 'job-de-001',
    companyId: 'comp-siemens',
    companyName: 'Siemens AG',
    title: 'Senior Cloud & DevOps Engineer (Kubernetes/Go)',
    domain: 'Software & IT',
    country: 'Germany',
    city: 'Munich',
    salaryRange: '€68,000 - €82,000 / yr',
    contractType: 'Full-Time Permanent',
    blueCardEligible: true,
    requiredSkills: ['Kubernetes', 'Docker', 'Go', 'AWS', 'Terraform', 'CI/CD'],
    minExperience: '3+ Years',
    minGermanLevel: 'None',
    openings: 2,
    description: 'Lead automated cloud provisioning for industrial IoT telemetry clusters. Full European Blue Card sponsorship provided.',
    postedDate: '2026-09-02',
    status: 'Active'
  },
  {
    id: 'job-de-002',
    companyId: 'comp-bosch',
    companyName: 'Robert Bosch GmbH',
    title: 'Embedded Firmware Developer (Automotive C++)',
    domain: 'Engineering',
    country: 'Germany',
    city: 'Stuttgart',
    salaryRange: '€65,000 - €78,000 / yr',
    contractType: 'Full-Time Permanent',
    blueCardEligible: true,
    requiredSkills: ['C++', 'AUTOSAR', 'CAN Bus', 'RTOS', 'Microcontrollers'],
    minExperience: '2+ Years',
    minGermanLevel: 'A2',
    openings: 3,
    description: 'Design safety-critical ADAS micro-controllers for electric mobility. Relocation package included.',
    postedDate: '2026-09-04',
    status: 'Active'
  },
  {
    id: 'job-de-003',
    companyId: 'comp-helios',
    companyName: 'Helios Kliniken GmbH',
    title: 'Registered General Nurse (Pflegefachkraft)',
    domain: 'Healthcare',
    country: 'Germany',
    city: 'Berlin / Erfurt',
    salaryRange: '€38,000 - €46,000 / yr + Shift Bonus',
    contractType: 'Full-Time Permanent',
    blueCardEligible: true,
    requiredSkills: ['B.Sc Nursing / GNM', 'Patient Care', 'Clinical Documentation'],
    minExperience: '1+ Years',
    minGermanLevel: 'B2',
    openings: 10,
    description: 'Complete German recognition (Anerkennung) and fast-track hospital induction with subsidized housing.',
    postedDate: '2026-09-06',
    status: 'Active'
  }
];

const SEED_CANDIDATE_RESUMES: CandidateResumeItem[] = [
  {
    id: 'cand-001',
    candidateName: 'Karthik Nambiar',
    email: 'karthik.n@cloudtech.in',
    phone: '+91 99880 33445',
    targetCountry: 'Germany',
    field: 'Software & IT',
    yearsOfExperience: 4,
    highestDegree: 'B.Tech Computer Science',
    primarySkills: ['Kubernetes', 'Docker', 'Go', 'AWS', 'CI/CD', 'Node.js'],
    germanLevel: 'A1',
    englishLevel: 'Fluent',
    resumeFileName: 'Karthik_Nambiar_DevOps_Resume.pdf',
    uploadedAt: '2026-09-07',
    status: 'Matched'
  },
  {
    id: 'cand-002',
    candidateName: 'Pooja Nair',
    email: 'pooja.nair.rn@gmail.com',
    phone: '+91 94471 22334',
    targetCountry: 'Germany',
    field: 'Healthcare',
    yearsOfExperience: 3,
    highestDegree: 'B.Sc Nursing',
    primarySkills: ['ICU Care', 'Patient Care', 'Clinical Documentation', 'Emergency Care'],
    germanLevel: 'B2',
    englishLevel: 'Professional',
    resumeFileName: 'Pooja_Nair_Certified_Nurse.pdf',
    uploadedAt: '2026-09-06',
    status: 'Interview Scheduled'
  }
];

export const getPartnerCompanies = (): PartnerCompanyItem[] => {
  const data = localStorage.getItem('ilas_partner_companies');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_partner_companies', JSON.stringify(SEED_PARTNER_COMPANIES));
  return SEED_PARTNER_COMPANIES;
};

export const savePartnerCompany = (company: PartnerCompanyItem): PartnerCompanyItem[] => {
  const list = getPartnerCompanies();
  const exists = list.some(c => c.id === company.id);
  const updated = exists ? list.map(c => c.id === company.id ? company : c) : [company, ...list];
  localStorage.setItem('ilas_partner_companies', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-partner-companies-changed'));
  return updated;
};

export const deletePartnerCompany = (id: string): PartnerCompanyItem[] => {
  const list = getPartnerCompanies().filter(c => c.id !== id);
  localStorage.setItem('ilas_partner_companies', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('ilas-partner-companies-changed'));
  return list;
};

export const getJobListings = (): JobListingItem[] => {
  const data = localStorage.getItem('ilas_job_listings');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_job_listings', JSON.stringify(SEED_JOB_LISTINGS));
  return SEED_JOB_LISTINGS;
};

export const saveJobListing = (job: JobListingItem): JobListingItem[] => {
  const list = getJobListings();
  const exists = list.some(j => j.id === job.id);
  const updated = exists ? list.map(j => j.id === job.id ? job : j) : [job, ...list];
  localStorage.setItem('ilas_job_listings', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-job-listings-changed'));
  return updated;
};

export const deleteJobListing = (id: string): JobListingItem[] => {
  const list = getJobListings().filter(j => j.id !== id);
  localStorage.setItem('ilas_job_listings', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('ilas-job-listings-changed'));
  return list;
};

export const getCandidateResumes = (): CandidateResumeItem[] => {
  const data = localStorage.getItem('ilas_candidate_resumes');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.warn(e); }
  }
  localStorage.setItem('ilas_candidate_resumes', JSON.stringify(SEED_CANDIDATE_RESUMES));
  return SEED_CANDIDATE_RESUMES;
};

export const saveCandidateResume = (cand: CandidateResumeItem): CandidateResumeItem[] => {
  const list = getCandidateResumes();
  const exists = list.some(c => c.id === cand.id);
  const updated = exists ? list.map(c => c.id === cand.id ? cand : c) : [cand, ...list];
  localStorage.setItem('ilas_candidate_resumes', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-candidate-resumes-changed'));
  return updated;
};

export const parseAndMatchResume = (candidate: CandidateResumeItem) => {
  const activeJobs = getJobListings().filter(j => j.status === 'Active');
  
  const matches = activeJobs.map(job => {
    let score = 30; // base score

    // Domain / Field Match
    if (job.domain.toLowerCase().includes(candidate.field.toLowerCase()) || 
        candidate.field.toLowerCase().includes(job.domain.toLowerCase())) {
      score += 25;
    }

    // Skills overlap
    const skillMatches = job.requiredSkills.filter(reqSkill => 
      candidate.primarySkills.some(candSkill => 
        candSkill.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(candSkill.toLowerCase())
      )
    );
    score += Math.min(30, skillMatches.length * 10);

    // Language Match
    if (job.minGermanLevel === 'None' || candidate.germanLevel >= job.minGermanLevel) {
      score += 15;
    }

    score = Math.min(99, Math.max(20, score));

    return {
      job,
      matchScore: score,
      matchedSkills: skillMatches,
      isHighFit: score >= 75
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return matches;
};

// --- 3. UNIVERSAL INTAKE TRACKING & AUTO-TRIGGER FOLLOW-UP STORE ---
export interface DepartmentInquiryItem {
  id: string;
  department: 'Education' | 'Work While You Study' | 'Study Abroad' | 'Jobs' | 'Rewards' | 'Visa';
  type: 'Walk-in' | 'Online Funnel' | 'WhatsApp Direct' | 'Referral';
  name: string;
  email: string;
  phone: string;
  programOfInterest: string;
  notes: string;
  status: 'New' | 'Contacted' | 'In-Review' | 'Enrolled' | 'Dropped';
  counselorAssigned: string;
  createdAt: string;
  lastContactedAt?: string;
}

export interface FollowUpAutoTriggerItem {
  id: string;
  department: string;
  triggerName: string;
  eventType: 'incomplete_enrollment' | 'pending_payment' | 'profile_dropoff' | 'document_pending';
  channel: 'WhatsApp' | 'Email' | 'Both';
  delayHours: number;
  messageTemplate: string;
  isActive: boolean;
  executionCount: number;
  lastTriggered?: string;
}

export interface SocialMediaPromoPostItem {
  id: string;
  department: string;
  title: string;
  content: string;
  channels: ('Meta Ads' | 'LinkedIn' | 'Instagram' | 'X / Twitter' | 'WhatsApp Broadcast')[];
  targetAudience: string;
  mediaUrl?: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  scheduledAt: string;
  publishedAt?: string;
  metrics: { reach: number; clicks: number; shares: number };
}

const SEED_DEPARTMENT_INQUIRIES: DepartmentInquiryItem[] = [
  {
    id: 'inq-edu-1',
    department: 'Education',
    type: 'Walk-in',
    name: 'Suresh Menon',
    email: 'suresh.m@gmail.com',
    phone: '+91 98451 09876',
    programOfInterest: 'German B2 Intensive + FSP',
    notes: 'Visited Bangalore center. Requested morning slot with native German trainer.',
    status: 'In-Review',
    counselorAssigned: 'Nadeem (Lead Counselor)',
    createdAt: '2026-09-09',
    lastContactedAt: '2026-09-09'
  },
  {
    id: 'inq-work-1',
    department: 'Work While You Study',
    type: 'Online Funnel',
    name: 'Harish Babu',
    email: 'harish.b@yahoo.com',
    phone: '+91 97312 88990',
    programOfInterest: 'Office Admin & Corporate Pilot (₹25k Stipend)',
    notes: 'Completed Step 1 assessment. Pending document verification.',
    status: 'New',
    counselorAssigned: 'Divya (Placement Officer)',
    createdAt: '2026-09-10'
  },
  {
    id: 'inq-abroad-1',
    department: 'Study Abroad',
    type: 'Walk-in',
    name: 'Deepika Iyer',
    email: 'deepika.iyer@gmail.com',
    phone: '+91 99001 22334',
    programOfInterest: 'M.Sc Public University Munich (€0 Tuition)',
    notes: 'Needs APS certificate review & SOP draft evaluation.',
    status: 'Contacted',
    counselorAssigned: 'Klaus (European Admissions)',
    createdAt: '2026-09-08'
  },
  {
    id: 'inq-jobs-1',
    department: 'Jobs',
    type: 'WhatsApp Direct',
    name: 'Vikram Joshi',
    email: 'vikram.j@outlook.com',
    phone: '+91 98860 55443',
    programOfInterest: 'DevOps / Kubernetes Placement (Germany)',
    notes: 'Has 4.5 years experience, requested mock technical interview.',
    status: 'In-Review',
    counselorAssigned: 'Rahul (Tech Recruiter)',
    createdAt: '2026-09-07'
  },
  {
    id: 'inq-rew-1',
    department: 'Rewards',
    type: 'Referral',
    name: 'Amit Patel',
    email: 'amit.patel@consulting.in',
    phone: '+91 98200 44321',
    programOfInterest: 'Campus Ambassador Partnership / 15% Referral Tier',
    notes: 'College placement coordinator wanting to onboard 50 students.',
    status: 'Enrolled',
    counselorAssigned: 'Marketing Team',
    createdAt: '2026-09-06'
  }
];

const SEED_AUTO_TRIGGERS: FollowUpAutoTriggerItem[] = [
  {
    id: 'trig-1',
    department: 'Education',
    triggerName: 'Incomplete Classroom Registration Reminder',
    eventType: 'incomplete_enrollment',
    channel: 'Both',
    delayHours: 2,
    messageTemplate: 'Hi {name}! We noticed you started enrolling in {program}. Complete your enrollment today to reserve your seat and get free AI tutor access.',
    isActive: true,
    executionCount: 142,
    lastTriggered: '2026-09-10 10:15'
  },
  {
    id: 'trig-2',
    department: 'Work While You Study',
    triggerName: 'Pending Stipend Contract Signed Reminder',
    eventType: 'pending_payment',
    channel: 'WhatsApp',
    delayHours: 6,
    messageTemplate: 'Hello {name}, your ₹15,000-₹25,000 stipend placement contract is ready for sign-off. Please complete step 2 before spots close.',
    isActive: true,
    executionCount: 89,
    lastTriggered: '2026-09-10 09:30'
  },
  {
    id: 'trig-3',
    department: 'Study Abroad',
    triggerName: 'APS Certificate & Uni-Assist Missing Docs Alert',
    eventType: 'document_pending',
    channel: 'Email',
    delayHours: 12,
    messageTemplate: 'Dear {name}, your European university application profile is missing your academic transcript. Upload it now to maintain your eligibility priority.',
    isActive: true,
    executionCount: 64,
    lastTriggered: '2026-09-09 16:45'
  },
  {
    id: 'trig-4',
    department: 'Jobs',
    triggerName: 'European Employer Interview Readiness Trigger',
    eventType: 'profile_dropoff',
    channel: 'WhatsApp',
    delayHours: 4,
    messageTemplate: 'Greetings {name}! European employers are reviewing active resumes in {program}. Update your technical portfolio to secure an immediate interview slot.',
    isActive: true,
    executionCount: 51,
    lastTriggered: '2026-09-09 11:20'
  },
  {
    id: 'trig-5',
    department: 'Rewards',
    triggerName: 'Unclaimed Referral Cash Bonus Notification',
    eventType: 'pending_payment',
    channel: 'Both',
    delayHours: 24,
    messageTemplate: 'Congratulations {name}! You have unclaimed commission reward points waiting in your ILA Partner Account. Click to redeem your bank payout.',
    isActive: true,
    executionCount: 38,
    lastTriggered: '2026-09-08 14:10'
  }
];

const SEED_SOCIAL_PROMOS: SocialMediaPromoPostItem[] = [
  {
    id: 'promo-01',
    department: 'Study Abroad',
    title: 'Germany €0 Tuition Free Master Admissions 2026',
    content: '🎓 Study in Germany for €0 tuition fee! Apply now for top technical universities. Includes full APS visa guidance and €1,200/mo part-time student work assistance. Limited seats available! #StudyInGermany #FreeEducation #Europe2026',
    channels: ['Meta Ads', 'LinkedIn', 'Instagram', 'WhatsApp Broadcast'],
    targetAudience: 'Engineering & CS Graduates in India (Age 20-27)',
    status: 'Published',
    scheduledAt: '2026-09-10',
    publishedAt: '2026-09-10 08:00',
    metrics: { reach: 14200, clicks: 830, shares: 145 }
  },
  {
    id: 'promo-02',
    department: 'Work While You Study',
    title: 'Work & Study in India: ₹25k Stipend + 100% Placement',
    content: '💼 Launch your career with guaranteed corporate pilot experience! 6 months training with ₹15,000 - ₹25,000 monthly stipend + permanent onboarding. #WorkAndStudy #Internship #CareerLaunch',
    channels: ['Meta Ads', 'LinkedIn', 'Instagram'],
    targetAudience: 'Recent graduates, final year students & career changers',
    status: 'Published',
    scheduledAt: '2026-09-09',
    publishedAt: '2026-09-09 12:30',
    metrics: { reach: 9800, clicks: 620, shares: 92 }
  }
];

export const getDepartmentInquiries = (department?: string): DepartmentInquiryItem[] => {
  const data = localStorage.getItem('ilas_dept_inquiries');
  let list: DepartmentInquiryItem[] = [];
  if (data) {
    try { list = JSON.parse(data); } catch (e) { console.warn(e); }
  } else {
    list = SEED_DEPARTMENT_INQUIRIES;
    localStorage.setItem('ilas_dept_inquiries', JSON.stringify(list));
  }
  if (department && department !== 'All') {
    return list.filter(i => i.department.toLowerCase() === department.toLowerCase());
  }
  return list;
};

export const saveDepartmentInquiry = (inquiry: DepartmentInquiryItem): DepartmentInquiryItem[] => {
  const list = getDepartmentInquiries();
  const exists = list.some(i => i.id === inquiry.id);
  const updated = exists ? list.map(i => i.id === inquiry.id ? inquiry : i) : [inquiry, ...list];
  localStorage.setItem('ilas_dept_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-dept-inquiries-changed'));
  return updated;
};

export const updateDepartmentInquiryStatus = (id: string, status: DepartmentInquiryItem['status']): DepartmentInquiryItem[] => {
  const list = getDepartmentInquiries();
  const updated = list.map(i => i.id === id ? { ...i, status, lastContactedAt: new Date().toISOString().split('T')[0] } : i);
  localStorage.setItem('ilas_dept_inquiries', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-dept-inquiries-changed'));
  return updated;
};

export const getFollowUpAutoTriggers = (department?: string): FollowUpAutoTriggerItem[] => {
  const data = localStorage.getItem('ilas_followup_triggers');
  let list: FollowUpAutoTriggerItem[] = [];
  if (data) {
    try { list = JSON.parse(data); } catch (e) { console.warn(e); }
  } else {
    list = SEED_AUTO_TRIGGERS;
    localStorage.setItem('ilas_followup_triggers', JSON.stringify(list));
  }
  if (department && department !== 'All') {
    return list.filter(t => t.department.toLowerCase() === department.toLowerCase());
  }
  return list;
};

export const saveFollowUpAutoTrigger = (trigger: FollowUpAutoTriggerItem): FollowUpAutoTriggerItem[] => {
  const list = getFollowUpAutoTriggers();
  const exists = list.some(t => t.id === trigger.id);
  const updated = exists ? list.map(t => t.id === trigger.id ? trigger : t) : [trigger, ...list];
  localStorage.setItem('ilas_followup_triggers', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-followup-triggers-changed'));
  return updated;
};

export const toggleAutoTriggerStatus = (id: string): FollowUpAutoTriggerItem[] => {
  const list = getFollowUpAutoTriggers();
  const updated = list.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
  localStorage.setItem('ilas_followup_triggers', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-followup-triggers-changed'));
  return updated;
};

export const simulateTriggerExecution = (id: string): FollowUpAutoTriggerItem | null => {
  const list = getFollowUpAutoTriggers();
  let executedTrigger: FollowUpAutoTriggerItem | null = null;
  const updated = list.map(t => {
    if (t.id === id) {
      executedTrigger = {
        ...t,
        executionCount: t.executionCount + 1,
        lastTriggered: new Date().toLocaleString()
      };
      return executedTrigger;
    }
    return t;
  });
  localStorage.setItem('ilas_followup_triggers', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-followup-triggers-changed'));
  return executedTrigger;
};

export const getSocialMediaPromos = (department?: string): SocialMediaPromoPostItem[] => {
  const data = localStorage.getItem('ilas_social_promos');
  let list: SocialMediaPromoPostItem[] = [];
  if (data) {
    try { list = JSON.parse(data); } catch (e) { console.warn(e); }
  } else {
    list = SEED_SOCIAL_PROMOS;
    localStorage.setItem('ilas_social_promos', JSON.stringify(list));
  }
  if (department && department !== 'All') {
    return list.filter(p => p.department.toLowerCase() === department.toLowerCase());
  }
  return list;
};

export const saveSocialMediaPromo = (promo: SocialMediaPromoPostItem): SocialMediaPromoPostItem[] => {
  const list = getSocialMediaPromos();
  const exists = list.some(p => p.id === promo.id);
  const updated = exists ? list.map(p => p.id === promo.id ? promo : p) : [promo, ...list];
  localStorage.setItem('ilas_social_promos', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-social-promos-changed'));
  return updated;
};

export const broadcastSocialMediaPromo = (promoId: string): SocialMediaPromoPostItem | null => {
  const list = getSocialMediaPromos();
  let publishedPromo: SocialMediaPromoPostItem | null = null;
  const updated = list.map(p => {
    if (p.id === promoId) {
      publishedPromo = {
        ...p,
        status: 'Published',
        publishedAt: new Date().toLocaleString(),
        metrics: {
          reach: (p.metrics?.reach || 0) + Math.floor(1000 + Math.random() * 5000),
          clicks: (p.metrics?.clicks || 0) + Math.floor(50 + Math.random() * 200),
          shares: (p.metrics?.shares || 0) + Math.floor(10 + Math.random() * 40)
        }
      };
      return publishedPromo;
    }
    return p;
  });
  localStorage.setItem('ilas_social_promos', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-social-promos-changed'));
  return publishedPromo;
};

// ==========================================
// 8. STUDY ABROAD: DOCUMENT CHECKLIST & CONSULTANT ATS (HYBRID AI TRACKING)
// ==========================================

export interface DocumentChecklistItem {
  id: string;
  country: string;
  courseTrack: string;
  docName: string;
  isRequired: boolean;
  acceptedFormats: string;
  maxSizeMB: number;
  description: string;
}

export interface StudentAccountBinding {
  accountId: string;
  email: string;
  name: string;
  phone: string;
  registeredAt: string;
  activeJourney: 'Study Abroad' | 'Work & Study' | 'Job Search' | 'Course';
  uploadedDocs: Array<{
    checklistId: string;
    docName: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    status: 'Pending Verification' | 'Verified' | 'Requires Re-upload';
  }>;
}

export interface ConsultantATSTask {
  id: string;
  studentAccountId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  targetCountry: string;
  targetCourse: string;
  matchScore: number;
  stage: 'Lead / Intake' | 'Document Verification' | 'University Review' | 'Interview Scheduled' | 'Visa Preparation' | 'Enrolled' | 'Closed / Dropped';
  assignedConsultant: string;
  consultantNotes: Array<{
    id: string;
    author: string;
    note: string;
    timestamp: string;
    nextFollowUpDate?: string;
  }>;
  uploadedDocuments: Array<{
    checklistId: string;
    docName: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    verified: boolean;
  }>;
  hybridLogs: Array<{
    id: string;
    actor: 'ILA_AI' | 'HUMAN_CONSULTANT';
    action: string;
    details: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const SEED_DOCUMENT_CHECKLISTS: DocumentChecklistItem[] = [
  {
    id: 'chk-de-1',
    country: 'Germany',
    courseTrack: 'All',
    docName: 'Valid Passport (Information Pages)',
    isRequired: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSizeMB: 5,
    description: 'Clear color scan of passport front & back pages with at least 18 months validity.'
  },
  {
    id: 'chk-de-2',
    country: 'Germany',
    courseTrack: 'STEM & Engineering',
    docName: 'Official Academic Transcripts & Degree Certificate',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 10,
    description: 'Complete semester-wise mark sheets and provisional / final degree certificate (English or German translated).'
  },
  {
    id: 'chk-de-3',
    country: 'Germany',
    courseTrack: 'All',
    docName: 'APS Certificate (India Mandatory)',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 5,
    description: 'Akademische Prüfstelle (APS) verification certificate or appointment confirmation proof.'
  },
  {
    id: 'chk-de-4',
    country: 'Germany',
    courseTrack: 'All',
    docName: 'Europass CV & Motivation Letter (SOP)',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 5,
    description: 'Standardized European format curriculum vitae highlighting academic projects, plus a 1-page Statement of Purpose.'
  },
  {
    id: 'chk-de-5',
    country: 'Germany',
    courseTrack: 'All',
    docName: 'Language Proficiency Score (IELTS / Goethe / TestDaF)',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 5,
    description: 'Official test report form for English (IELTS 6.5+) or German certificate (A1-C1) according to chosen track.'
  },
  {
    id: 'chk-uk-1',
    country: 'United Kingdom',
    courseTrack: 'All',
    docName: 'Passport & UKVI Academic Reference Letters',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 5,
    description: 'Valid international passport and two official letters of recommendation from college faculty.'
  },
  {
    id: 'chk-ca-1',
    country: 'Canada',
    courseTrack: 'All',
    docName: 'WES Credential Evaluation & GIC Proof',
    isRequired: true,
    acceptedFormats: 'PDF',
    maxSizeMB: 10,
    description: 'World Education Services (WES) credential report and Canadian Guaranteed Investment Certificate (GIC) documentation.'
  }
];

export const SEED_CONSULTANT_ATS_TASKS: ConsultantATSTask[] = [
  {
    id: 'ats-001',
    studentAccountId: 'acc-rahul-01',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@example.com',
    studentPhone: '+91 98765 43210',
    targetCountry: 'Germany',
    targetCourse: 'M.Sc. Artificial Intelligence & Robotics',
    matchScore: 94,
    stage: 'Document Verification',
    assignedConsultant: 'Sarah Müller (Senior Admissions Lead)',
    consultantNotes: [
      {
        id: 'note-1',
        author: 'Sarah Müller',
        note: 'Spoke with candidate. CGPA is 8.4 from Tier-1 college. Verified English IELTS 7.5. Transcripts require official university seal.',
        timestamp: '2026-09-09 14:30',
        nextFollowUpDate: '2026-09-12'
      }
    ],
    uploadedDocuments: [
      {
        checklistId: 'chk-de-1',
        docName: 'Valid Passport (Information Pages)',
        fileName: 'rahul_passport_2026.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-09-08 11:20',
        verified: true
      },
      {
        checklistId: 'chk-de-2',
        docName: 'Official Academic Transcripts & Degree Certificate',
        fileName: 'btech_transcripts_consolidated.pdf',
        fileSize: '4.2 MB',
        uploadedAt: '2026-09-08 11:22',
        verified: false
      }
    ],
    hybridLogs: [
      {
        id: 'hlog-1',
        actor: 'ILA_AI',
        action: 'Profile Match Evaluated',
        details: 'ILA Intelli-Matcher evaluated candidate profile against 24 German University criteria. Compatibility Score: 94%.',
        timestamp: '2026-09-08 11:15'
      },
      {
        id: 'hlog-2',
        actor: 'ILA_AI',
        action: 'Auto Account Binding',
        details: 'Candidate account bound to rahul.sharma@example.com. All uploaded assets linked to ATS Lead ID ats-001.',
        timestamp: '2026-09-08 11:16'
      },
      {
        id: 'hlog-3',
        actor: 'HUMAN_CONSULTANT',
        action: 'Manual Intake Review',
        details: 'Assigned Sarah Müller as lead consultant. Initial consultation call scheduled.',
        timestamp: '2026-09-09 14:30'
      }
    ],
    createdAt: '2026-09-08',
    updatedAt: '2026-09-09'
  },
  {
    id: 'ats-002',
    studentAccountId: 'acc-priya-02',
    studentName: 'Priya Nair',
    studentEmail: 'priya.nair@example.com',
    studentPhone: '+91 97654 32109',
    targetCountry: 'Germany',
    targetCourse: 'M.Sc. Automotive Software Engineering',
    matchScore: 89,
    stage: 'University Review',
    assignedConsultant: 'Dr. Klaus Becker (German Academic Liaison)',
    consultantNotes: [
      {
        id: 'note-2',
        author: 'Dr. Klaus Becker',
        note: 'Submitted application dossier to TU Munich and RWTH Aachen. Uni-assist payment cleared.',
        timestamp: '2026-09-07 10:15',
        nextFollowUpDate: '2026-09-15'
      }
    ],
    uploadedDocuments: [
      {
        checklistId: 'chk-de-1',
        docName: 'Valid Passport (Information Pages)',
        fileName: 'priya_passport.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-09-05 09:30',
        verified: true
      },
      {
        checklistId: 'chk-de-3',
        docName: 'APS Certificate (India Mandatory)',
        fileName: 'aps_certificate_priya.pdf',
        fileSize: '890 KB',
        uploadedAt: '2026-09-05 09:35',
        verified: true
      }
    ],
    hybridLogs: [
      {
        id: 'hlog-201',
        actor: 'ILA_AI',
        action: 'Document Scan Verified',
        details: 'ILA Document Engine verified digital signatures on APS Certificate.',
        timestamp: '2026-09-05 09:40'
      },
      {
        id: 'hlog-202',
        actor: 'HUMAN_CONSULTANT',
        action: 'Dossier Forwarded',
        details: 'Sent official application pack to TU Munich portal.',
        timestamp: '2026-09-07 10:15'
      }
    ],
    createdAt: '2026-09-05',
    updatedAt: '2026-09-07'
  }
];

export const getDocumentChecklists = (country?: string, courseTrack?: string): DocumentChecklistItem[] => {
  const data = localStorage.getItem('ilas_abroad_checklists');
  let list: DocumentChecklistItem[] = [];
  if (data) {
    try { list = JSON.parse(data); } catch (e) { console.warn(e); }
  } else {
    list = SEED_DOCUMENT_CHECKLISTS;
    localStorage.setItem('ilas_abroad_checklists', JSON.stringify(list));
  }
  if (country && country !== 'All') {
    list = list.filter(c => c.country.toLowerCase() === country.toLowerCase() || c.country.toLowerCase() === 'all');
  }
  if (courseTrack && courseTrack !== 'All') {
    list = list.filter(c => c.courseTrack.toLowerCase() === courseTrack.toLowerCase() || c.courseTrack.toLowerCase() === 'all');
  }
  return list;
};

export const saveDocumentChecklist = (item: DocumentChecklistItem): DocumentChecklistItem[] => {
  const list = getDocumentChecklists();
  const exists = list.some(c => c.id === item.id);
  const updated = exists ? list.map(c => c.id === item.id ? item : c) : [item, ...list];
  localStorage.setItem('ilas_abroad_checklists', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-checklists-changed'));
  return updated;
};

export const deleteDocumentChecklist = (id: string): DocumentChecklistItem[] => {
  const list = getDocumentChecklists();
  const updated = list.filter(c => c.id !== id);
  localStorage.setItem('ilas_abroad_checklists', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-abroad-checklists-changed'));
  return updated;
};

export const getConsultantATSTasks = (): ConsultantATSTask[] => {
  const data = localStorage.getItem('ilas_consultant_ats_tasks');
  let list: ConsultantATSTask[] = [];
  if (data) {
    try { list = JSON.parse(data); } catch (e) { console.warn(e); }
  } else {
    list = SEED_CONSULTANT_ATS_TASKS;
    localStorage.setItem('ilas_consultant_ats_tasks', JSON.stringify(list));
  }
  return list;
};

export const saveConsultantATSTask = (task: ConsultantATSTask): ConsultantATSTask[] => {
  const list = getConsultantATSTasks();
  const exists = list.some(t => t.id === task.id);
  const updated = exists ? list.map(t => t.id === task.id ? task : t) : [task, ...list];
  localStorage.setItem('ilas_consultant_ats_tasks', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-ats-tasks-changed'));
  return updated;
};

export const updateConsultantATSTaskStage = (taskId: string, newStage: ConsultantATSTask['stage'], author: string = 'Admin'): ConsultantATSTask | null => {
  const list = getConsultantATSTasks();
  let updatedTask: ConsultantATSTask | null = null;
  const updated = list.map(t => {
    if (t.id === taskId) {
      const log = {
        id: `hlog-${Date.now()}`,
        actor: 'HUMAN_CONSULTANT' as const,
        action: 'Stage Advanced',
        details: `Stage updated from "${t.stage}" to "${newStage}" by ${author}.`,
        timestamp: new Date().toLocaleString()
      };
      updatedTask = {
        ...t,
        stage: newStage,
        updatedAt: new Date().toISOString().split('T')[0],
        hybridLogs: [log, ...t.hybridLogs]
      };
      return updatedTask;
    }
    return t;
  });
  localStorage.setItem('ilas_consultant_ats_tasks', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-ats-tasks-changed'));
  return updatedTask;
};

export const addConsultantNote = (taskId: string, author: string, note: string, nextFollowUpDate?: string): ConsultantATSTask | null => {
  const list = getConsultantATSTasks();
  let updatedTask: ConsultantATSTask | null = null;
  const updated = list.map(t => {
    if (t.id === taskId) {
      const newNote = {
        id: `note-${Date.now()}`,
        author,
        note,
        timestamp: new Date().toLocaleString(),
        nextFollowUpDate
      };
      const log = {
        id: `hlog-${Date.now()}`,
        actor: 'HUMAN_CONSULTANT' as const,
        action: 'Consultant Note Logged',
        details: `Follow-up note logged by ${author}: "${note.slice(0, 50)}${note.length > 50 ? '...' : ''}"`,
        timestamp: new Date().toLocaleString()
      };
      updatedTask = {
        ...t,
        consultantNotes: [newNote, ...t.consultantNotes],
        hybridLogs: [log, ...t.hybridLogs],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return updatedTask;
    }
    return t;
  });
  localStorage.setItem('ilas_consultant_ats_tasks', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ilas-ats-tasks-changed'));
  return updatedTask;
};

export const bindStudentAccountAndSubmitATS = (payload: {
  name: string;
  email: string;
  phone: string;
  targetCountry: string;
  targetCourse: string;
  matchScore: number;
  uploadedDocs: Array<{
    checklistId: string;
    docName: string;
    fileName: string;
    fileSize: string;
  }>;
}): { account: StudentAccountBinding; atsTask: ConsultantATSTask } => {
  const accountId = `acc-${payload.email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
  const taskId = `ats-${Date.now()}`;

  const account: StudentAccountBinding = {
    accountId,
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    registeredAt: new Date().toISOString().split('T')[0],
    activeJourney: 'Study Abroad',
    uploadedDocs: payload.uploadedDocs.map(d => ({
      ...d,
      uploadedAt: new Date().toLocaleString(),
      status: 'Pending Verification'
    }))
  };

  // Save account binding
  const accListRaw = localStorage.getItem('ilas_student_accounts');
  let accList: StudentAccountBinding[] = accListRaw ? JSON.parse(accListRaw) : [];
  accList = [account, ...accList.filter(a => a.email !== payload.email)];
  localStorage.setItem('ilas_student_accounts', JSON.stringify(accList));

  // Create Consultant ATS Task
  const atsTask: ConsultantATSTask = {
    id: taskId,
    studentAccountId: accountId,
    studentName: payload.name,
    studentEmail: payload.email,
    studentPhone: payload.phone,
    targetCountry: payload.targetCountry,
    targetCourse: payload.targetCourse,
    matchScore: payload.matchScore,
    stage: 'Lead / Intake',
    assignedConsultant: 'Sarah Müller (Senior Admissions Lead)',
    consultantNotes: [
      {
        id: `note-${Date.now()}`,
        author: 'System (ILA AI)',
        note: `Initial application intake received. Matched course: ${payload.targetCourse} (${payload.matchScore}% Match). Documents submitted: ${payload.uploadedDocs.length}.`,
        timestamp: new Date().toLocaleString()
      }
    ],
    uploadedDocuments: payload.uploadedDocs.map(d => ({
      ...d,
      uploadedAt: new Date().toLocaleString(),
      verified: false
    })),
    hybridLogs: [
      {
        id: `hlog-ai-1-${Date.now()}`,
        actor: 'ILA_AI',
        action: 'Account Auto-Bound',
        details: `Account successfully bound to ${payload.email}. Profile matched with ${payload.matchScore}% compatibility score.`,
        timestamp: new Date().toLocaleString()
      },
      {
        id: `hlog-ai-2-${Date.now()}`,
        actor: 'ILA_AI',
        action: 'Document Package Ingested',
        details: `Ingested ${payload.uploadedDocs.length} original documents according to ${payload.targetCountry} standard checklist.`,
        timestamp: new Date().toLocaleString()
      }
    ],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };

  saveConsultantATSTask(atsTask);

  return { account, atsTask };
};