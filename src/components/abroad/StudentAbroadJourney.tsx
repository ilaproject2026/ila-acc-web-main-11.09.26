import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Globe, BookOpen, Building2, Home, HeartHandshake, Search, 
  Sparkles, Zap, CheckCircle2, ArrowRight, ShieldCheck, Upload, 
  FileText, Check, AlertCircle, RefreshCw, UserCheck, Clock, 
  DollarSign, ChevronRight, ChevronLeft, ChevronDown, CheckSquare, ChevronUp, Landmark, MapPin, X, User, Mail, Phone, Lock, Eye,
  Award, Briefcase, TrendingUp, Gift, Compass, HelpCircle, ArrowLeft,
  ExternalLink, Layers, CheckCircle, Paperclip, Hotel, Database, Wifi
} from 'lucide-react';
import { 
  CountryItem, 
  AbroadCourseItem, 
  DocumentChecklistItem,
  getAbroadCountries, 
  getAbroadCourses, 
  getDocumentChecklists,
  bindStudentAccountAndSubmitATS
} from '../../lib/db';
import { extractRawTextFromFile, parseResumeWithGeminiDirect } from '../../lib/clientDocumentParser';

interface StudentAbroadJourneyProps {
  onApplicationSubmitted?: (leadId: string) => void;
}

export interface DynamicCountryCategory {
  id: string;
  label: string;
  badge?: string;
}

// ---------------------------------------------------------------------------
// Phase 1 & 2: Tailored Sample Courses for Catering, Hotel & Business Management
// ---------------------------------------------------------------------------

// 1. Online Live Search Stream (Real-Time AI Web Sourced)
const ONLINE_LIVE_HOSPITALITY_COURSES: AbroadCourseItem[] = [
  {
    id: 'crs-live-mba-hosp',
    countryId: 'country-de',
    collegeId: 'col-mbs-live',
    collegeName: 'Munich Business School (MBS)',
    courseName: 'MBA in International Hospitality Management',
    degree: 'Masters',
    duration: '2 Years (4 Semesters)',
    language: 'English',
    tuitionPerYear: '€0 (State Subsidized)',
    minCGPA: 7.0,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct 2026)', 'Summer (Apr 2027)'],
    description: 'Live Online Sourced: Premier German curriculum in luxury hotel assets, strategic resort leadership, gastronomy economics, and corporate hospitality operations.',
    isFeatured: true
  },
  {
    id: 'crs-live-msc-catering',
    countryId: 'country-de',
    collegeId: 'col-fau-live',
    collegeName: 'FAU International Institute of Tourism & Culinary Arts',
    courseName: 'MSc in Tourism and Catering Management',
    degree: 'Masters',
    duration: '2 Years',
    language: 'English',
    tuitionPerYear: '€0 (Public Subsidy)',
    minCGPA: 6.8,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct 2026)'],
    description: 'Live Online Sourced: Specialized post-graduate degree in culinary service administration, gastronomy supply chain logistics, and sustainable European tourism.',
    isFeatured: true
  },
  {
    id: 'crs-live-mba-exec',
    countryId: 'country-de',
    collegeId: 'col-cbs-live',
    collegeName: 'CBS International Business School (Cologne / Berlin)',
    courseName: 'Master of Business Administration (Executive)',
    degree: 'Masters',
    duration: '1.5 - 2 Years (Fast-Track)',
    language: 'English',
    tuitionPerYear: '€0 (State Subsidized)',
    minCGPA: 7.0,
    minIELTS: 6.5,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct 2026)', 'Summer (Apr 2027)'],
    description: 'Live Online Sourced: Executive leadership MBA specifically tailored for holders of Catering & Hotel Management degrees and Postgraduate Business Administration certificates.',
    isFeatured: true
  },
  {
    id: 'crs-live-msc-event',
    countryId: 'country-de',
    collegeId: 'col-iu-live',
    collegeName: 'IU International University of Applied Sciences (Bad Honnef)',
    courseName: 'M.Sc. in Sustainable Hospitality & Event Operations',
    degree: 'Masters',
    duration: '2 Years',
    language: 'English',
    tuitionPerYear: '€0 (Tuition Free)',
    minCGPA: 6.5,
    minIELTS: 6.0,
    minGermanLevel: 'None',
    intakeSeason: ['Winter (Oct 2026)'],
    description: 'Live Online Sourced: Strategic convention catering, luxury hospitality branding, international mega-event management, and sustainable hospitality economics.',
    isFeatured: false
  }
];

// 2. Pre-Saved Internal Database Match Stream (Direct Tie-Ups)
const DATABASE_TIEUP_COURSES: AbroadCourseItem[] = [
  {
    id: 'crs-db-mba-hosp',
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
    description: 'Database Tie-Up: Guaranteed admissions quota for luxury hotel management, gastronomy operations, international resort strategy, and corporate hospitality assets.',
    isFeatured: true
  },
  {
    id: 'crs-db-msc-catering',
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
    description: 'Database Tie-Up: Institutional partnership covering culinary operations administration, food logistics, catering economics, and sustainable tourism.',
    isFeatured: true
  },
  {
    id: 'crs-db-mba-exec',
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
    description: 'Database Tie-Up: Fast-track executive MBA for professionals holding certifications in business administration and degrees in hotel & catering management.',
    isFeatured: true
  },
  {
    id: 'crs-db-ausb-hotel',
    countryId: 'country-de',
    collegeId: 'col-fau-voc',
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
    description: 'Database Tie-Up: Government-subsidized dual vocational training in five-star hotel operations, gastronomy management, and catering administration with stipend.',
    isFeatured: true
  },
  {
    id: 'crs-db-bsc-culinary',
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
    description: 'Database Tie-Up: Comprehensive undergraduate degree covering commercial culinary operations, institutional food service, and hotel administration.',
    isFeatured: false
  }
];


// =============================================================================
// CLIENT-SIDE DYNAMIC AI CONTENT GENERATOR FOR DESTINATION INSIGHTS
// =============================================================================

interface DestinationInsightData {
  countryName: string;
  flag: string;
  tagline: string;
  aiBadge?: string;
  visaBenefits: {
    title: string;
    description: string;
    statBadge: string;
    points: { label: string; text: string; icon: string }[];
  };
  pathways: {
    title: string;
    tag: string;
    tuition: string;
    badgeColor: string;
    perks: string[];
    bestFor: string;
  }[];
  requirements: {
    category: string;
    academicCutoff: string;
    languageReq: string;
    financialReq: string;
    steps: string[];
  }[];
}

// In-memory client cache to avoid redundant API queries while toggling
const clientAiInsightsCache: Record<string, DestinationInsightData> = {};

// Base Knowledge Repository for Instant Zero-Latency Client-Side Contextual Rendering
const BASE_DESTINATION_PROFILES: Record<string, DestinationInsightData> = {
  Germany: {
    countryName: 'Germany',
    flag: '🇩🇪',
    tagline: "Europe's premier industrial and educational powerhouse offering world-class free tuition, strong student work rights, and fast-track EU settlement.",
    visaBenefits: {
      title: '18-Month Job Seeker Visa & Fast-Track EU Blue Card',
      description: 'International graduates receive an unrestricted 18-month stay-back residence permit to seek professional employment in Germany. Transition seamlessly to an EU Blue Card upon securing a qualifying position.',
      statBadge: '18-Mo Stay-Back • PR in 21 Mo',
      points: [
        {
          label: 'Post-Study Stay-Back',
          text: '18 months of unrestricted full-time work authorization anywhere in Germany to secure corporate employment.',
          icon: 'clock'
        },
        {
          label: 'Permanent Settlement (PR)',
          text: 'Attain German Permanent Residency (Niederlassungserlaubnis) in only 21 months with B1 German (or 27 months with basic A1).',
          icon: 'shield'
        },
        {
          label: 'Student Work Rights',
          text: 'Work up to 140 full days (or 280 half days) per year (20 hrs/week), earning €1,000–€1,400/month during your studies.',
          icon: 'briefcase'
        },
        {
          label: 'Schengen Area Mobility',
          text: 'Full visa-free travel and cross-border European career access across all 29 European Schengen member states.',
          icon: 'globe'
        }
      ]
    },
    pathways: [
      {
        title: 'Public Universities (Staatliche Hochschulen)',
        tag: '100% Free Tuition',
        tuition: '€0 / Year (State Subsidized)',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        perks: [
          'Zero tuition fees funded by German federal states; small semester fee (~€150–€350) includes regional public transport transit.',
          'Elite global research reputation with state-of-the-art laboratory and academic facilities.',
          'Authentic European campus immersion and extensive international student community.'
        ],
        bestFor: 'Academic achievers seeking maximum ROI, zero tuition debt, and European research depth.'
      },
      {
        title: 'Private Universities (Staatlich anerkannt)',
        tag: 'Corporate Fast-Track',
        tuition: '€8,500 – €14,000 / Year',
        badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-400/30',
        perks: [
          'Rolling admissions with flexible Fall (Sep/Oct) and Spring (Mar/Apr) intakes.',
          'Direct corporate tie-ups with German multinationals (BMW, Siemens, Accor, SAP, Lufthansa) for guaranteed internships.',
          '100% English-taught specialized career curricula with smaller classes and personalized 1-on-1 coaching.'
        ],
        bestFor: 'Career pivoters, executive hospitality/MBA aspirants, and students seeking expedited visa appointment slots.'
      },
      {
        title: 'Ausbildung (Dual Vocational Training)',
        tag: 'Earn While You Learn',
        tuition: '€0 Tuition + €950–€1,350/Mo Stipend',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        perks: [
          'Structured dual system: ~70% hands-on corporate practical training + 30% vocational theoretical education.',
          'Guaranteed monthly salary from day 1 (€950–€1,350/month), eliminating the €11,208 blocked account requirement.',
          'Over 95% guaranteed absorption into permanent full-time German employment contracts upon completion.'
        ],
        bestFor: 'Hands-on practical professions in hotel management, culinary arts, healthcare, logistics, and technical trades.'
      }
    ],
    requirements: [
      {
        category: 'Public Universities',
        academicCutoff: '65%–70%+ Aggregate (German GPA ~2.5 or better)',
        languageReq: 'IELTS 6.5+ (no band < 6.0) or German B2/C1 for German-taught modules',
        financialReq: '€11,208 Blocked Account (Sperrkonto) + Statutory Health Insurance (€120/mo)',
        steps: [
          'Step 1: Academic credential validation via the Academic Evaluation Centre (APS) in New Delhi / home country.',
          'Step 2: Uni-Assist Preliminary Review Documentation (VPD) or direct university portal application.',
          'Step 3: Secure official unconditional Admission Letter (Zulassungsbescheid).',
          'Step 4: Deposit €11,208 into a certified German Blocked Account (Coracle / Expatrio / Fintiba).',
          'Step 5: Schedule and attend the German National Student Visa (Category D) interview.'
        ]
      },
      {
        category: 'Private Universities',
        academicCutoff: 'Flexible 50%+ Aggregate (Holistic profile and work experience evaluated)',
        languageReq: 'IELTS 6.0+ (or English Medium of Instruction letter accepted by select institutions)',
        financialReq: 'Tuition deposit (approx. €2,000–€3,000) + Living cost proof / Blocked Account',
        steps: [
          'Step 1: Direct university online application with degree transcripts, CV, and SOP.',
          'Step 2: Online interview or aptitude evaluation with admission offer issued in 3–7 business days.',
          'Step 3: Pay initial tuition deposit to release the unconditional visa admission letter.',
          'Step 4: Complete APS certification and set up blocked account funds.',
          'Step 5: Fast-track student visa appointment under priority private institution quota.'
        ]
      },
      {
        category: 'Ausbildung (Dual Training)',
        academicCutoff: 'Minimum 10+2 / High School completion, or relevant Diploma / Bachelor degree',
        languageReq: 'Mandatory German language proficiency at B1 or B2 level (Goethe / Telc / ÖSD)',
        financialReq: '€0 Blocked Account Needed (Monthly employer stipend covers full living expenses)',
        steps: [
          'Step 1: Format resume in German standard (tabellarischer Lebenslauf) and draft German cover letter.',
          'Step 2: Complete employer selection interviews with German partner hotels or corporations.',
          'Step 3: Receive signed Dual Vocational Training Contract (Ausbildungsvertrag) & ZAV pre-approval.',
          'Step 4: Secure statutory German healthcare coverage and confirm accommodation with employer.',
          'Step 5: Apply for German Vocational Training Visa (Visum zur Berufsausbildung).'
        ]
      }
    ]
  },
  'United Kingdom': {
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    tagline: 'World-renowned academic heritage with 2-year Graduate Route post-study work rights and accelerated 1-year Masters.',
    visaBenefits: {
      title: '2-Year Graduate Route Visa & Direct Skilled Worker Route',
      description: 'Graduates can work or seek employment in the UK at any skill level for 2 years (3 years for doctoral graduates) with no initial minimum salary restriction.',
      statBadge: '2-Yr Graduate Route • 1-Yr Masters',
      points: [
        {
          label: 'Graduate Route Stay-Back',
          text: '2 full years of post-study work authorization with no employer sponsorship required.',
          icon: 'clock'
        },
        {
          label: 'Skilled Worker Transition',
          text: 'Direct progression into UK Skilled Worker visa sponsorship upon securing qualifying professional employment.',
          icon: 'shield'
        },
        {
          label: 'Term-Time Work Rights',
          text: 'Work up to 20 hours per week during academic semesters and full-time during vacations.',
          icon: 'briefcase'
        },
        {
          label: 'Global Prestige',
          text: 'Prestigious qualifications recognized by employers and multinational conglomerates worldwide.',
          icon: 'globe'
        }
      ]
    },
    pathways: [
      {
        title: 'Russell Group Research Universities',
        tag: 'Global Elite',
        tuition: '£18,000 – £32,000 / Year',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
        perks: [
          'Top 100 QS world rankings with world-class faculty and Nobel-laureate research legacies.',
          'Direct campus recruitment by global financial institutions, tech giants, and consultancy firms.',
          'Intensive 1-year Masters programs saving 1 full year of living expenses and tuition.'
        ],
        bestFor: 'High-achieving candidates aiming for elite international consulting and finance careers.'
      },
      {
        title: 'Modern Applied Universities',
        tag: 'Industry Focused',
        tuition: '£13,000 – £18,500 / Year',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        perks: [
          'Hands-on curricula with optional 1-year paid industry placement / internship years.',
          'Generous international scholarships ranging from £1,500 to £5,000.',
          'High graduate employability and dedicated enterprise incubators.'
        ],
        bestFor: 'Students prioritizing practical industry readiness, affordable fees, and internship years.'
      }
    ],
    requirements: [
      {
        category: 'UK Higher Education',
        academicCutoff: '55%–65%+ Aggregate depending on university tier',
        languageReq: 'IELTS 6.0–6.5+ (no band < 5.5) or English waiver with 70%+ in Class 12 English',
        financialReq: 'Tuition balance + Living funds (£1,334/mo in London, £1,023/mo outside London for 9 months)',
        steps: [
          'Step 1: Submit application via university direct portal or UCAS with SOP and reference letters.',
          'Step 2: Receive Conditional / Unconditional Offer Letter and fulfill academic/financial terms.',
          'Step 3: Pay course deposit to receive Confirmation of Acceptance for Studies (CAS).',
          'Step 4: Maintain 28-day financial balance in student or parent bank account.',
          'Step 5: Apply online for UK Student Visa (formerly Tier 4) and book biometric appointment.'
        ]
      }
    ]
  },
  France: {
    countryName: 'France',
    flag: '🇫🇷',
    tagline: 'European culinary, luxury, and business capital with subsidized public education and 2-year post-study work authorization.',
    visaBenefits: {
      title: '2-Year APS / Post-Study Visa & EU Settlement Pathway',
      description: 'Master graduates are eligible for a 2-year Autorisation Provisoire de Séjour (APS) / Job Seeker Visa with streamlined transition to the Passeport Talent multi-year work permit.',
      statBadge: '2-Yr APS • €0-Low Tuition',
      points: [
        {
          label: 'Post-Study APS Permit',
          text: '2-year job seeker visa allowing full-time employment once professional work is secured.',
          icon: 'clock'
        },
        {
          label: 'Passeport Talent Route',
          text: '4-year renewable work visa with streamlined path to French Permanent Residency and Citizenship.',
          icon: 'shield'
        },
        {
          label: 'Student Work Rights',
          text: 'Allowed to work up to 964 hours per year (approx. 20 hrs/week) at French statutory minimum wage (SMIC).',
          icon: 'briefcase'
        },
        {
          label: 'State Housing Subsidy (CAF)',
          text: 'All international students can claim €100–€250/month rent subsidy directly from the French government.',
          icon: 'globe'
        }
      ]
    },
    pathways: [
      {
        title: 'Public Universities (Universités)',
        tag: 'State Subsidized',
        tuition: '€243 – €3,770 / Year',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        perks: [
          'Significantly subsidized tuition fees supported by the French Ministry of Higher Education.',
          'Comprehensive humanities, sciences, and hospitality research institutions.',
          'Full access to French university restaurants (CROUS €3.30 meals) and student privileges.'
        ],
        bestFor: 'Cost-conscious students seeking authentic French immersion and affordable academic excellence.'
      },
      {
        title: 'Grandes Écoles & Top Business Schools',
        tag: 'Triple Crown Accredited',
        tuition: '€11,000 – €22,000 / Year',
        badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-400/30',
        perks: [
          'World top 20 Master in Management & Hospitality rankings (EQUIS, AACSB, AMBA accredited).',
          'Alternance (Apprenticeship) contracts available: partner company pays 100% tuition + monthly salary.',
          'Direct recruitment by LVMH, Accor, L’Oréal, Airbus, BNP Paribas, and luxury groups.'
        ],
        bestFor: 'Students aspiring to leadership roles in luxury brand management, hospitality, and corporate strategy.'
      }
    ],
    requirements: [
      {
        category: 'French Higher Education',
        academicCutoff: '55%–60%+ Aggregate in Bachelor degree',
        languageReq: 'IELTS 6.0–6.5+ for English-taught courses; B2 DELF/TCF for French-taught programs',
        financialReq: 'Minimum €615/month living expenses (€7,380 for 1 year) + tuition deposit',
        steps: [
          'Step 1: Direct application to university or Grande École; receive admission offer letter.',
          'Step 2: Create account on Etudes en France (Campus France) and complete document verification.',
          'Step 3: Attend Campus France in-person or online academic interview.',
          'Step 4: Receive Campus France Attestation of Interview completion.',
          'Step 5: Apply for Long-Stay Student Visa (VLS-TS) via France-Visas portal.'
        ]
      }
    ]
  },
  Austria: {
    countryName: 'Austria',
    flag: '🇦🇹',
    tagline: 'World-renowned Central European cultural and research hub with highly subsidized public universities (€726/semester) and direct path to the Red-White-Red Card.',
    visaBenefits: {
      title: '12-Month Job Seeker Visa & Red-White-Red (RWR) Card',
      description: 'International graduates of Austrian universities receive a 12-month job seeker visa to find qualified employment, transitioning directly into the permanent Red-White-Red Card settlement system.',
      statBadge: '12-Mo Stay-Back • €726/Sem Tuition',
      points: [
        {
          label: 'Post-Study Job Search',
          text: '12 months of legal residence in Austria to secure qualifying professional employment without labor market testing.',
          icon: 'clock'
        },
        {
          label: 'Red-White-Red Card',
          text: 'Direct points-based immigration for university graduates leading to EU permanent residency status.',
          icon: 'shield'
        },
        {
          label: 'Student Work Rights',
          text: 'Legal student employment of up to 20 hours per week throughout bachelor and master studies.',
          icon: 'briefcase'
        },
        {
          label: 'Subsidized Living & Health',
          text: 'Statutory student health insurance at approx. €69/month and subsidized OeAD student dormitories.',
          icon: 'globe'
        }
      ]
    },
    pathways: [
      {
        title: 'Austrian Public Universities (Universitäten)',
        tag: 'Subsidized €726/Sem',
        tuition: '€726.72 / Semester',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        perks: [
          'Prestigious public institutions (University of Vienna, TU Wien, Graz University of Technology).',
          'Nominal tuition of €726.72 per semester for non-EU students + €22.70 student union (ÖH) fee.',
          'High concentration of English-taught Master and research PhD programs.'
        ],
        bestFor: 'Academic researchers and STEM candidates seeking affordable, top-tier European education.'
      },
      {
        title: 'Universities of Applied Sciences (Fachhochschulen)',
        tag: 'Industry Integrated',
        tuition: '€726 – €1,500 / Semester',
        badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-400/30',
        perks: [
          'Mandatory corporate internship semester embedded in every degree program.',
          'Fixed curriculum with guaranteed laboratory seats and practical industry tie-ups.',
          'High graduate employment rate in Austrian and southern German industrial hubs.'
        ],
        bestFor: 'Students prioritizing hands-on technical skills, applied management, and immediate employment.'
      }
    ],
    requirements: [
      {
        category: 'Austrian Higher Education',
        academicCutoff: '60%+ in Bachelor or Secondary School leaving certificate',
        languageReq: 'IELTS 6.5+ for English programs; German B2/C1 for German-taught curriculums',
        financialReq: 'Proof of funds: approx. €615/mo for under 24; €1,110/mo for over 24 in a recognized bank account',
        steps: [
          'Step 1: Apply directly to Austrian university portal with legalized degree certificates and Apostille.',
          'Step 2: Receive official Admission Letter (Zulassungsbescheid).',
          'Step 3: Secure OeAD student accommodation contract and health insurance.',
          'Step 4: Deposit maintenance funds in student bank account.',
          'Step 5: Apply for Austrian Residence Permit - Student (Aufenthaltsbewilligung Student) at embassy.'
        ]
      }
    ]
  },
  Switzerland: {
    countryName: 'Switzerland',
    flag: '🇨🇭',
    tagline: 'Global capital of hospitality management, finance, and elite STEM innovation (ETH Zurich, EPFL) with the highest graduate earning benchmarks in Europe.',
    visaBenefits: {
      title: '6-Month Post-Graduate Permit & High-Income Career Pathway',
      description: 'Graduates can extend their Swiss residence permit by 6 months for professional job searching, with high entry-level salary benchmarks (CHF 75,000–CHF 95,000/year).',
      statBadge: 'Top Global QS • CHF 2,200/mo Intern Wages',
      points: [
        {
          label: 'Post-Graduation Stay',
          text: '6-month job search extension for university graduates in high-demand technical and management sectors.',
          icon: 'clock'
        },
        {
          label: 'Paid Student Internships',
          text: 'Hospitality and STEM students undertake mandatory paid internships earning statutory minimum CHF 2,200–CHF 2,400/month.',
          icon: 'briefcase'
        },
        {
          label: 'Global Elite Recognition',
          text: 'ETH Zurich (#7 Global) and EPFL degrees command premier international recruiter preference worldwide.',
          icon: 'shield'
        },
        {
          label: 'Student Work Authorization',
          text: 'Allowed to work up to 15 hours per week during academic terms after 6 months of residency.',
          icon: 'globe'
        }
      ]
    },
    pathways: [
      {
        title: 'Swiss Federal Institutes & Cantonal Universities',
        tag: 'Research Excellence',
        tuition: 'CHF 1,000 – CHF 1,800 / Year',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
        perks: [
          'Consistently ranked among the top 10 universities globally with state-subsidized public tuition.',
          'Cutting-edge innovation labs funded directly by Swiss federal government and multinationals (Novartis, Roche, UBS).',
          'World-class peer cohort and direct faculty mentorship.'
        ],
        bestFor: 'Exceptional STEM and quantitative researchers seeking top-ranking academic credentials.'
      },
      {
        title: 'Swiss Hotel & Hospitality Management Schools',
        tag: 'Triple Luxury Standard',
        tuition: 'CHF 24,000 – CHF 38,000 / Year (All-Inclusive)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        perks: [
          'Full-board tuition packages covering 5-star campus accommodation, meals, and uniform.',
          'Guaranteed paid European and global internships with international luxury hotel chains.',
          'Global alumni network holding executive general manager positions worldwide.'
        ],
        bestFor: 'Aspiring luxury brand directors, resort managers, and international hospitality leaders.'
      }
    ],
    requirements: [
      {
        category: 'Swiss Higher Education',
        academicCutoff: '65%–75%+ for federal universities; 55%+ for hospitality academies',
        languageReq: 'IELTS 6.5–7.0+ for English programs; German/French B2 for regional curriculums',
        financialReq: 'CHF 21,000–CHF 24,000/year blocked or verified in a Swiss-recognized bank account',
        steps: [
          'Step 1: Direct application to Swiss university or business school; receive Certificate of Admission.',
          'Step 2: Transfer course fee / confirmation deposit.',
          'Step 3: Provide declaration of financial commitment and Swiss bank guarantee.',
          'Step 4: Book Swiss National Visa (Type D) appointment at the Swiss Embassy/Consulate.',
          'Step 5: File dossier forwarded to Cantonal Migration Office for biometric residence permit authorization.'
        ]
      }
    ]
  }
};

/**
 * Filter baseline destination data strictly to selected options
 * Ensures unselected pathways (like public universities if excluded) are completely omitted.
 */
function filterDestinationDataLocally(
  baseData: DestinationInsightData,
  institutionFilter: string,
  programFilter: string
): DestinationInsightData {
  let filteredPathways = [...baseData.pathways];
  let filteredRequirements = [...baseData.requirements];

  // 1. Institution Filtering
  if (institutionFilter === 'public_uni') {
    filteredPathways = filteredPathways.filter(p => p.title.toLowerCase().includes('public') || p.tag.toLowerCase().includes('free'));
    filteredRequirements = filteredRequirements.filter(r => r.category.toLowerCase().includes('public'));
  } else if (institutionFilter === 'private_uni') {
    filteredPathways = filteredPathways.filter(p => p.title.toLowerCase().includes('private') || p.tag.toLowerCase().includes('fast-track'));
    filteredRequirements = filteredRequirements.filter(r => r.category.toLowerCase().includes('private'));
  } else if (institutionFilter === 'exec_school') {
    filteredPathways = filteredPathways.filter(p => p.title.toLowerCase().includes('private') || p.title.toLowerCase().includes('business') || p.title.toLowerCase().includes('grande'));
    filteredRequirements = filteredRequirements.filter(r => r.category.toLowerCase().includes('private') || r.category.toLowerCase().includes('business'));
  }

  // 2. Program Filtering
  if (programFilter === 'ausbildung') {
    filteredPathways = filteredPathways.filter(p => p.title.toLowerCase().includes('ausbildung') || p.tag.toLowerCase().includes('learn'));
    filteredRequirements = filteredRequirements.filter(r => r.category.toLowerCase().includes('ausbildung'));
  } else if (programFilter === 'masters') {
    filteredPathways = filteredPathways.filter(p => !p.title.toLowerCase().includes('ausbildung'));
    filteredRequirements = filteredRequirements.filter(r => !r.category.toLowerCase().includes('ausbildung'));
  } else if (programFilter === 'bachelors') {
    filteredPathways = filteredPathways.filter(p => !p.title.toLowerCase().includes('ausbildung'));
    filteredRequirements = filteredRequirements.filter(r => !r.category.toLowerCase().includes('ausbildung'));
  }

  // Fallback safety if filter was so restrictive nothing matched
  if (filteredPathways.length === 0) filteredPathways = baseData.pathways.slice(0, 1);
  if (filteredRequirements.length === 0) filteredRequirements = baseData.requirements.slice(0, 1);

  return {
    ...baseData,
    aiBadge: `Context Filter: ${institutionFilter === 'all' ? 'All Institutions' : institutionFilter} • ${programFilter === 'all' ? 'All Programs' : programFilter}`,
    pathways: filteredPathways,
    requirements: filteredRequirements,
  };
}

/**
 * Direct Client-Side Gemini AI Generator
 * Generates tailored destination insights and visa overview directly from the React frontend.
 */
async function generateClientSideAiInsights(
  country: string,
  institutionFilter: string,
  programFilter: string
): Promise<DestinationInsightData | null> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_api_key_here') {
    return null;
  }

  const instName =
    institutionFilter === 'public_uni' ? 'Public University (€0 Free Tuition)' :
    institutionFilter === 'private_uni' ? 'Private University (Corporate Fast-Track)' :
    institutionFilter === 'exec_school' ? 'Executive Business School' : 'All Institutions';

  const progName =
    programFilter === 'masters' ? 'Masters / MBA' :
    programFilter === 'bachelors' ? 'Bachelors (Undergraduate)' :
    programFilter === 'ausbildung' ? 'Ausbildung (Dual Vocational Training with Monthly Stipends)' : 'All Programs';

  const prompt = `You are an elite European & Global Study Abroad Advisor and Immigration Strategist.
Generate high-value, highly specific destination insights and visa intelligence for an international student.

Target Country: "${country}"
Active Institution Filter: "${instName}"
Active Program Filter: "${progName}"

STRICT INSTRUCTION ON FILTER CONTEXT:
1. ONLY include pathways and requirements for the ACTIVE filters:
   - If institutionFilter is 'private_uni', ONLY include Private Universities. EXCLUDE Public Universities and Ausbildung.
   - If institutionFilter is 'public_uni', ONLY include Public Universities. EXCLUDE Private Universities and Ausbildung.
   - If programFilter is 'ausbildung', ONLY include Dual Vocational Training (Ausbildung).
   - If institutionFilter is 'all' and programFilter is 'all', include top 3 pathways for ${country}.
2. Provide authentic, precise visa stay-back data (e.g., 18-month Job Seeker Visa and 21-month PR in Germany, 2-year Graduate Route in UK, 2-year APS in France), student part-time work rights (20 hrs/wk, €1,000–€1,400/mo), and exact financial parameters.
3. Return STRICT JSON with no extra text or markdown fences, conforming exactly to this schema:
{
  "countryName": "${country}",
  "flag": "Flag emoji e.g. 🇩🇪",
  "tagline": "Compelling 1-sentence strategic summary tailored to ${country} and the selected filters",
  "visaBenefits": {
    "title": "Clear headline for visa & post-study stay-back",
    "description": "2-sentence clear overview of stay-back and PR pathway",
    "statBadge": "Short badge e.g. 18-Mo Stay-Back • PR in 21 Mo",
    "points": [
      { "label": "Post-Study Stay-Back", "text": "...", "icon": "clock" },
      { "label": "Permanent Settlement", "text": "...", "icon": "shield" },
      { "label": "Student Work Rights", "text": "...", "icon": "briefcase" },
      { "label": "Regional / Global Mobility", "text": "...", "icon": "globe" }
    ]
  },
  "pathways": [
    {
      "title": "Pathway Name",
      "tag": "Short highlight tag",
      "tuition": "Estimated tuition or stipend",
      "badgeColor": "bg-brand-500/20 text-brand-300 border-brand-400/30",
      "perks": ["perk 1", "perk 2", "perk 3"],
      "bestFor": "Target candidate profile"
    }
  ],
  "requirements": [
    {
      "category": "Pathway category name",
      "academicCutoff": "e.g. 65% aggregate / GPA 2.5",
      "languageReq": "e.g. IELTS 6.5+ or German B2",
      "financialReq": "e.g. €11,208 Blocked Account or €0 for Ausbildung",
      "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."]
    }
  ]
}`;

  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-3.5-pro-preview',
    'gemini-2.5-pro',
    'gemini-pro',
  ];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!res.ok) continue;

      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (parsed.visaBenefits && parsed.pathways && parsed.requirements) {
        return parsed as DestinationInsightData;
      }
    } catch {
      continue;
    }
  }

  return null;
}

interface DestinationInsightsSectionProps {
  country: string;
  institutionFilter: string;
  programFilter: string;
}

export const DestinationInsightsSection: React.FC<DestinationInsightsSectionProps> = ({
  country,
  institutionFilter,
  programFilter
}) => {
  const [activeTab, setActiveTab] = useState<'visa' | 'pathways' | 'requirements'>('visa');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isLiveAi, setIsLiveAi] = useState<boolean>(false);
  const [insights, setInsights] = useState<DestinationInsightData>(() => {
    const base = BASE_DESTINATION_PROFILES[country] || BASE_DESTINATION_PROFILES['Germany'];
    return filterDestinationDataLocally(base, institutionFilter, programFilter);
  });

  // Client-Side AI Generation Trigger on country or filter changes
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `${country}_${institutionFilter}_${programFilter}`;

    // 1. Immediately provide filtered local baseline (Zero latency)
    const base = BASE_DESTINATION_PROFILES[country] || BASE_DESTINATION_PROFILES['Germany'];
    const localFiltered = filterDestinationDataLocally(base, institutionFilter, programFilter);

    if (clientAiInsightsCache[cacheKey]) {
      setInsights(clientAiInsightsCache[cacheKey]);
      setIsLiveAi(true);
      setIsAiLoading(false);
      return;
    }

    setInsights(localFiltered);
    setIsLiveAi(false);

    // 2. Trigger Client-Side Gemini AI Call directly from React
    const fetchAiInsights = async () => {
      setIsAiLoading(true);
      try {
        const aiGenerated = await generateClientSideAiInsights(country, institutionFilter, programFilter);
        if (isMounted && aiGenerated) {
          clientAiInsightsCache[cacheKey] = aiGenerated;
          setInsights(aiGenerated);
          setIsLiveAi(true);
        }
      } catch (err) {
        console.warn('Gemini client generation fallback:', err);
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    };

    fetchAiInsights();

    return () => {
      isMounted = false;
    };
  }, [country, institutionFilter, programFilter]);

  const handleManualRegenerate = async () => {
    setIsAiLoading(true);
    const cacheKey = `${country}_${institutionFilter}_${programFilter}`;
    delete clientAiInsightsCache[cacheKey];
    try {
      const aiGenerated = await generateClientSideAiInsights(country, institutionFilter, programFilter);
      if (aiGenerated) {
        clientAiInsightsCache[cacheKey] = aiGenerated;
        setInsights(aiGenerated);
        setIsLiveAi(true);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const isFilterActive = institutionFilter !== 'all' || programFilter !== 'all';

  return (
    <section className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-brand-500/25 border-t-4 border-t-amber-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{insights.flag}</span>
            <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>{insights.countryName === 'Germany' ? 'Benefits of Education & Studying in Germany' : `Benefits of Education & Studying in ${insights.countryName}`}</span>
              <span className="text-xs font-normal text-amber-300 hidden sm:inline">• Degree &amp; Global Career Benefits</span>
            </h3>
            
            {/* Live AI Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 text-brand-300 border border-brand-400/30 text-[10px] font-bold">
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  <span className="text-amber-300">Gemini Neural AI Generating...</span>
                </>
              ) : isLiveAi ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="text-emerald-300">✨ Live Gemini AI Context</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-brand-400" />
                  <span>⚡ Instant Client Engine</span>
                </>
              )}
            </span>

            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
              {insights.visaBenefits.statBadge}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
            {insights.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRegenerate}
            disabled={isAiLoading}
            title="Re-run Client-Side Gemini AI for this combination"
            className="text-[11px] font-semibold text-brand-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/25 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isAiLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Regenerate AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Contextual Filter Notice when specific filters are active */}
      {isFilterActive && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-brand-900/30 via-slate-900/40 to-indigo-900/30 border border-brand-400/20 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping shrink-0" />
            <span>
              🎯 <strong className="text-white">Active AI Focus:</strong> Showing intelligence strictly for{' '}
              <span className="text-amber-300 font-bold">
                {institutionFilter !== 'all' ? institutionFilter.replace('_', ' ').toUpperCase() : ''}
              </span>{' '}
              {institutionFilter !== 'all' && programFilter !== 'all' ? '• ' : ''}
              <span className="text-emerald-300 font-bold">
                {programFilter !== 'all' ? programFilter.toUpperCase() : ''}
              </span>
              . Unselected institution pathways are omitted.
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded border border-brand-400/30 shrink-0">
            Tailored
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Clean 3-Tab Filter Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('visa')}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'visa'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">Visa &amp; Post-Study</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pathways')}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'pathways'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">Pathways &amp; Perks ({insights.pathways.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">Requirements &amp; Steps ({insights.requirements.length})</span>
            </button>
          </div>

          {/* TAB 1: VISA & POST-STUDY BENEFITS */}
          {activeTab === 'visa' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-brand-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                      Immigration &amp; Work Rights
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{insights.visaBenefits.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {insights.visaBenefits.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {insights.visaBenefits.statBadge}
                </span>
              </div>

              {/* 4 Point Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {insights.visaBenefits.points.map((pt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                        {idx === 0 && <Clock className="w-3.5 h-3.5" />}
                        {idx === 1 && <ShieldCheck className="w-3.5 h-3.5" />}
                        {idx === 2 && <Briefcase className="w-3.5 h-3.5" />}
                        {idx === 3 && <Globe className="w-3.5 h-3.5" />}
                      </div>
                      <h5 className="text-xs font-bold text-white">{pt.label}</h5>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed pl-8">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INSTITUTION PATHWAYS & PERKS */}
          {activeTab === 'pathways' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 animate-in fade-in duration-150">
              {insights.pathways.map((pw, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${pw.badgeColor}`}>
                        {pw.tag}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Track #{idx + 1}</span>
                    </div>

                    <h4 className="text-xs font-black text-white leading-snug">{pw.title}</h4>
                    
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-emerald-400">
                      {pw.tuition}
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {pw.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-brand-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400">
                    <strong className="text-slate-200">Best For:</strong> {pw.bestFor}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MINIMUM REQUIREMENTS & STEP-BY-STEP PROCEDURES */}
          {activeTab === 'requirements' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {insights.requirements.map((req, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/75 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center justify-center font-black text-xs">
                        {idx + 1}
                      </div>
                      <h4 className="text-xs font-black text-white">{req.category} — Admissions &amp; Visa Parameters</h4>
                    </div>
                  </div>

                  {/* Cut-off, Language, Financial 3-col grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">Academic Benchmark</span>
                      <span className="text-slate-200 font-medium">{req.academicCutoff}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Language Proficiency</span>
                      <span className="text-slate-200 font-medium">{req.languageReq}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-wider">Financial Solvency Proof</span>
                      <span className="text-slate-200 font-medium">{req.financialReq}</span>
                    </div>
                  </div>

                  {/* Step-by-Step Procedure */}
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Standard Step-by-Step Application &amp; Visa Pipeline:
                    </span>
                    <div className="space-y-1">
                      {req.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-[11px] text-slate-300 bg-white/[0.02] hover:bg-white/[0.04] p-1.5 rounded-md border border-white/5">
                          <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// =============================================================================
// OTHER SUPPORT & SERVICES AVAILABLE COMPONENT
// =============================================================================

const otherSupportServicesList = [
  {
    icon: Home,
    title: "Accommodation & Airport Pickup",
    desc: "Guaranteed student residence halls, WG flatshare assistance, and airport reception upon arrival in Germany and Europe.",
    tag: "Arrival Care",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30"
  },
  {
    icon: Landmark,
    title: "Blocked Account & Health Insurance",
    desc: "End-to-end guidance for Sperrkonto (€11,208) setup and statutory public health insurance coverage (TK / AOK / Barmer).",
    tag: "Finance & Health",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  },
  {
    icon: Briefcase,
    title: "Part-Time Job & Career Assistance",
    desc: "Direct access to pre-cleared student job pools (20 hrs/week) earning €1,000–€1,400/month to fund your living expenses.",
    tag: "Student Income",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30"
  },
  {
    icon: ShieldCheck,
    title: "21-Day Visa & APS Clearance",
    desc: "Fast-track APS certificate verification, German Embassy interview appointment booking, and visa file dossier preparation.",
    tag: "Visa Processing",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30"
  },
  {
    icon: FileText,
    title: "Uni-Assist & Document Attestation",
    desc: "Official certified German translation, document notarization, and error-free Uni-Assist VPD review submissions.",
    tag: "Documentation",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
  },
  {
    icon: HeartHandshake,
    title: "Local Registration (Anmeldung) & City Support",
    desc: "In-person guidance for German city hall registration (Anmeldung), tax ID allocation, and local bank account opening.",
    tag: "Settlement Support",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30"
  }
];

export const OtherSupportServicesSection: React.FC<{ country: string }> = ({ country }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-emerald-500/25 border-t-4 border-t-emerald-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-left space-y-1 relative z-10 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 text-[10px] font-bold uppercase tracking-wider mb-1">
          <HeartHandshake className="w-3.5 h-3.5 text-brand-400" />
          <span>Full-Lifecycle Ecosystem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Other Support &amp; Services Available
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Studying in {country} is more than university admission. We stand with you at every step—from initial document attestation and visa clearance to airport pickup and local permanent settlement.
        </p>
      </div>

      {/* 6 Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {otherSupportServicesList.map((srv, idx) => {
          const SrvIcon = srv.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-brand-400/60 transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-brand-300 group-hover:bg-brand-500/15 group-hover:border-brand-400/40 transition-all">
                    <SrvIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${srv.badgeColor}`}>
                    {srv.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {srv.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#applications?tab=Study%20Abroad';
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-brand-600 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 hover:border-brand-500"
                >
                  <span>Request Support</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All Services Action Bar */}
      <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-brand-950 via-indigo-950 to-slate-900 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xl">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">Ready to Begin Your {country} Journey?</h3>
          <p className="text-xs text-slate-300">Submit your preliminary profile now for personal counseling and university shortlisting.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#applications?tab=Study%20Abroad';
          }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
        >
          <span>Explore All Services &amp; Apply</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export const StudentAbroadJourney: React.FC<StudentAbroadJourneyProps> = ({ onApplicationSubmitted }) => {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [checklists, setChecklists] = useState<DocumentChecklistItem[]>([]);

  // Phase 2: Source Toggle (Online Live Search vs Database Match)
  const [matchSource, setMatchSource] = useState<'online' | 'database'>('online');

  // LEFT PANEL STATES (FORMS ONLY): 1 = Resume Upload, 2 = Verification Form, 3 = Static Profile Verified
  const [leftPanelStep, setLeftPanelStep] = useState<1 | 2 | 3>(1);

  // Country Selection
  const [selectedCountry, setSelectedCountry] = useState<string>('Germany');
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string } | null>(null);
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [parserNotice, setParserNotice] = useState<string>('');

  // Verified Candidate Form Parameters (With country-code phone validation)
  const [verifiedName, setVerifiedName] = useState<string>('');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [verifiedEducation, setVerifiedEducation] = useState<string>('');
  const [verifiedWorkExp, setVerifiedWorkExp] = useState<string>('');
  const [verifiedDuration, setVerifiedDuration] = useState<string>('2 Years (Masters)');
  const [verifiedTranscriptScore, setVerifiedTranscriptScore] = useState<string>('8.4 CGPA / 3.8 GPA (First Class)');
  const [verifiedField, setVerifiedField] = useState<string>('Hospitality, Tourism & Catering Management');
  const [verifiedLanguage, setVerifiedLanguage] = useState<string>('IELTS 7.5');

  // Form Validation Touched State
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // RIGHT PANEL STATES: 'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'
  const [rightPanelState, setRightPanelState] = useState<'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'>('hero');
  const [selectedCourse, setSelectedCourse] = useState<AbroadCourseItem | null>(ONLINE_LIVE_HOSPITALITY_COURSES[0]);
  const [matchingStepIndex, setMatchingStepIndex] = useState<number>(0);

  // Phase 4: Sub-Navigation Filters on Right Panel (Row 1: Square Institution buttons, Row 2: Pill Program buttons)
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string>('all');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
  const [courseSearchKeyword, setCourseSearchKeyword] = useState<string>('');

  // Phase 4: Document Upload & Final Submission
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { fileName: string; fileSize: string }>>({});
  const [isSubmittingDossier, setIsSubmittingDossier] = useState<boolean>(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{ leadId: string; consultant: string } | null>(null);

  // Dynamic Course Source Switcher
  const activeCoursePool = useMemo(() => {
    return matchSource === 'online' ? ONLINE_LIVE_HOSPITALITY_COURSES : DATABASE_TIEUP_COURSES;
  }, [matchSource]);

const ABROAD_PROMO_SLIDES = [
  {
    id: 'de-tuition-free',
    country: 'Germany',
    flag: '🇩🇪',
    badge: '€0 Public Tuition • 20h/Wk Work',
    title: 'Study in Germany: Zero Tuition & World-Class Degrees',
    desc: 'Access premier German public state universities with 100% tuition subsidy. Benefit from 20 hrs/week legal student employment, €1,000–€1,400 monthly earnings, and an 18-month post-study job seeker visa.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    stat: '€0 Tuition',
    statLabel: 'Public Universities',
    tags: ['APS Fast-Track', 'Uni-Assist Direct', 'English Taught'],
  },
  {
    id: 'at-alpine-hub',
    country: 'Austria',
    flag: '🇦🇹',
    badge: 'Low Tuition • Red-White-Red Card',
    title: 'Austrian Alpine Hub: University of Vienna & TU Graz',
    desc: 'Attend world-ranked universities in Vienna, Graz, and Innsbruck with nominal tuition (€726/sem for non-EU). Enjoy 20 hrs/week student work rights and an accelerated pathway to the Red-White-Red Permanent Card.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    stat: '€726/sem',
    statLabel: 'Standard Non-EU Fee',
    tags: ['Vienna Campus', '20h Work Rights', 'RWR Card'],
  },
  {
    id: 'ch-innovation',
    country: 'Switzerland',
    flag: '🇨🇭',
    badge: 'World #1 Innovation • Paid Internships',
    title: 'Swiss Higher Education & Luxury Hospitality Leadership',
    desc: 'Study at prestigious polytechnics like ETH Zürich & EPFL or top hospitality academies. Benefit from mandatory paid industry internships (CHF 2,200+/month) and high-yield global management placement.',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1200',
    stat: 'CHF 2,200+',
    statLabel: 'Monthly Paid Internships',
    tags: ['ETH / EPFL', 'Luxury Hospitality', 'Top Global Salaries'],
  },
  {
    id: 'ie-fr-tech-business',
    country: 'Ireland',
    flag: '🇮🇪',
    badge: '2-Year Stay-Back • European Silicon Docks',
    title: 'Ireland & France: Global Tech Conglomerates & Grandes Écoles',
    desc: 'Ireland offers a 2-year Third Level Graduate work scheme in Dublin’s tech capital (Google, Apple, Meta). France provides CAF housing allowances and accredited English-taught Master degrees in management & AI.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    stat: '2-Year',
    statLabel: 'Post-Study Work Visa',
    tags: ['Dublin Tech Docks', 'CAF Housing Subsidy', 'EU Silicon Valley'],
  },
];

const DEFAULT_ABROAD_COUNTRIES: CountryItem[] = [
  { id: 'country-de', name: 'Germany', code: 'DE', flag: '🇩🇪', visaType: 'National Visa D (§16b)', currency: 'EUR (€)', avgTuition: '€0 - €1,500/yr (Public: €0)', livingCost: '€934/mo (Blocked Account)', description: 'Tuition-free public universities, 20 hrs/week work rights, 18-month stay-back.', status: 'Active' },
  { id: 'country-at', name: 'Austria', code: 'AT', flag: '🇦🇹', visaType: 'Student Residence Permit (Aufenthaltsbewilligung)', currency: 'EUR (€)', avgTuition: '€726 - €1,500/sem', livingCost: '€950 - €1,200/mo', description: 'Top alpine public universities, 20 hrs/week work rights, Red-White-Red card pathway.', status: 'Active' },
  { id: 'country-ch', name: 'Switzerland', code: 'CH', flag: '🇨🇭', visaType: 'National Visa D (Student B Permit)', currency: 'CHF (Fr)', avgTuition: 'CHF 1,000 - 3,500/yr (ETH/EPFL)', livingCost: 'CHF 1,800 - 2,400/mo', description: 'World #1 innovation hub, prestigious polytechnics, top global salaries.', status: 'Active' },
  { id: 'country-ie', name: 'Ireland', code: 'IE', flag: '🇮🇪', visaType: 'Stamp 2 Student Visa', currency: 'EUR (€)', avgTuition: '€9,500 - €25,000/yr', livingCost: '€1,000 - €1,400/mo', description: 'European Silicon Valley hub, 2-year post-study work visa (Third Level Scheme).', status: 'Active' },
  { id: 'country-fr', name: 'France', code: 'FR', flag: '🇫🇷', visaType: 'VLS-TS Long-Stay Visa', currency: 'EUR (€)', avgTuition: '€2,770 - €3,770/yr (Public)', livingCost: '€800 - €1,200/mo (CAF subsidized)', description: 'Grandes Écoles, CAF housing subsidies, 20 hrs/wk work rights, 1-year APS stay-back.', status: 'Active' },
  { id: 'country-uk', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', visaType: 'Student Visa (Sub-tier 4)', currency: 'GBP (£)', avgTuition: '£12,000 - £28,000/yr', livingCost: '£1,023 - £1,334/mo', description: 'World-renowned Russell Group universities, 2-year Graduate Route work visa.', status: 'Active' },
  { id: 'country-ca', name: 'Canada', code: 'CA', flag: '🇨🇦', visaType: 'Study Permit', currency: 'CAD ($)', avgTuition: 'CAD 15,000 - 35,000/yr', livingCost: 'CAD 1,200 - 1,800/mo', description: 'DLI certified institutions, 24 hrs/week work rights, up to 3-year PGWP.', status: 'Active' },
  { id: 'country-au', name: 'Australia', code: 'AU', flag: '🇦🇺', visaType: 'Student Visa (Subclass 500)', currency: 'AUD ($)', avgTuition: 'AUD 20,000 - 42,000/yr', livingCost: 'AUD 1,600 - 2,200/mo', description: 'Group of Eight institutions, 48 hrs/fortnight work rights, 2-4 year Subclass 485 visa.', status: 'Active' },
];

  // Dynamic Right-Panel Promo Slider State
  const [currentPromoSlide, setCurrentPromoSlide] = useState<number>(0);
  const [isPromoPaused, setIsPromoPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % ABROAD_PROMO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPromoPaused]);

  const handleNextPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev + 1) % ABROAD_PROMO_SLIDES.length);
  };

  const handlePrevPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev - 1 + ABROAD_PROMO_SLIDES.length) % ABROAD_PROMO_SLIDES.length);
  };

  // Load Seed Countries & Checklists
  useEffect(() => {
    const loaded = getAbroadCountries();
    const map = new Map<string, CountryItem>();
    DEFAULT_ABROAD_COUNTRIES.forEach(c => map.set(c.name, c));
    if (Array.isArray(loaded)) {
      loaded.forEach(c => map.set(c.name, { ...c, flag: c.flag || map.get(c.name)?.flag || '🌍' }));
    }
    setCountries(Array.from(map.values()));
    setChecklists(getDocumentChecklists('Germany', 'All'));
    setSelectedCourse(activeCoursePool[0]);
  }, [activeCoursePool]);

  // Validation Rules
  const isNameValid = useMemo(() => {
    const trimmed = verifiedName.trim();
    return trimmed.length >= 3 && trimmed.split(/\s+/).length >= 2;
  }, [verifiedName]);

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verifiedEmail.trim());
  }, [verifiedEmail]);

  const isPhoneValid = useMemo(() => {
    const clean = verifiedPhone.trim();
    // Validates country code starting with + and at least 8 digits
    return clean.startsWith('+') && clean.replace(/[^0-9]/g, '').length >= 9;
  }, [verifiedPhone]);

  const isEducationValid = useMemo(() => {
    return verifiedEducation.trim().length >= 4;
  }, [verifiedEducation]);

  const isWorkExpValid = useMemo(() => {
    return verifiedWorkExp.trim().length >= 2;
  }, [verifiedWorkExp]);

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isEducationValid && isWorkExpValid;

  // Dropdown Filter Options
  const institutionDropdownOptions = useMemo(() => [
    { id: 'all', label: 'All Institutions' },
    { id: 'public_uni', label: 'Public University (€0 Tuition)' },
    { id: 'private_uni', label: 'Private University' },
    { id: 'exec_school', label: 'Executive Business School' },
  ], []);

  const programDropdownOptions = useMemo(() => [
    { id: 'all', label: 'All Programs' },
    { id: 'masters', label: 'Masters / MBA' },
    { id: 'bachelors', label: 'Bachelors' },
    { id: 'ausbildung', label: 'Ausbildung (Vocational)' },
  ], []);

  // Filtered Course List on Right Panel
  const filteredCourses = useMemo(() => {
    return activeCoursePool.filter(crs => {
      // Program Filter
      let matchProg = true;
      if (selectedProgramFilter !== 'all') {
        const p = selectedProgramFilter.toLowerCase();
        if (p === 'ausbildung') matchProg = crs.degree.toLowerCase().includes('ausbildung');
        else if (p === 'masters') matchProg = crs.degree.toLowerCase().includes('master');
        else if (p === 'bachelors') matchProg = crs.degree.toLowerCase().includes('bachelor');
      }

      // Institution Filter
      let matchInst = true;
      if (selectedInstitutionFilter !== 'all') {
        const inst = selectedInstitutionFilter.toLowerCase();
        if (inst === 'public_uni') {
          matchInst = crs.tuitionPerYear.includes('0') || crs.tuitionPerYear.toLowerCase().includes('free') || crs.tuitionPerYear.toLowerCase().includes('public');
        } else if (inst === 'private_uni') {
          matchInst = !crs.tuitionPerYear.includes('0') || crs.collegeName.toLowerCase().includes('cbs') || crs.collegeName.toLowerCase().includes('iu');
        } else if (inst === 'exec_school') {
          matchInst = crs.courseName.toLowerCase().includes('mba') || crs.collegeName.toLowerCase().includes('business');
        }
      }

      // Search Filter
      const matchSearch = courseSearchKeyword === '' || 
        crs.courseName.toLowerCase().includes(courseSearchKeyword.toLowerCase()) ||
        crs.description.toLowerCase().includes(courseSearchKeyword.toLowerCase()) ||
        crs.collegeName.toLowerCase().includes(courseSearchKeyword.toLowerCase());

      return matchProg && matchInst && matchSearch;
    });
  }, [activeCoursePool, selectedProgramFilter, selectedInstitutionFilter, courseSearchKeyword]);

  const activeChecklist = useMemo(() => {
    return getDocumentChecklists(selectedCountry, 'All');
  }, [selectedCountry]);

  // Phase 1: Client-Side File Reading & Direct Gemini AI Parsing
  const executeRealTimeAIParsing = async (file: File) => {
    setIsParsingResume(true);
    setParserNotice('Reading file text in browser (pdfjs-dist / mammoth)...');

    try {
      const rawText = await extractRawTextFromFile(file);

      const hasApiKey = Boolean(
        import.meta.env.VITE_GEMINI_API_KEY && 
        import.meta.env.VITE_GEMINI_API_KEY !== 'your_api_key_here'
      );

      setParserNotice(
        hasApiKey
          ? 'Calling Gemini Pro AI directly from browser...'
          : 'Extracting candidate parameters from document...'
      );

      const extracted = await parseResumeWithGeminiDirect(rawText, file.name);

      if (extracted.name) setVerifiedName(extracted.name);
      if (extracted.email) setVerifiedEmail(extracted.email);
      if (extracted.phone) setVerifiedPhone(extracted.phone);
      if (extracted.education) setVerifiedEducation(extracted.education);
      if (extracted.course_duration) setVerifiedDuration(extracted.course_duration);
      if (extracted.work_experience) setVerifiedWorkExp(extracted.work_experience);
      if (extracted.transcript_score) setVerifiedTranscriptScore(extracted.transcript_score);
      if (extracted.field_of_interest) setVerifiedField(extracted.field_of_interest);
      if (extracted.language_score) setVerifiedLanguage(extracted.language_score);

      setIsParsingResume(false);
      setLeftPanelStep(2);
    } catch (err) {
      console.error('Client-side parsing error:', err);
      setIsParsingResume(false);
      setLeftPanelStep(2);
    }
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      executeRealTimeAIParsing(file);
    }
  };

  // Phase 3: Left Panel locks in static Verified state, Right Panel reveals results
  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) {
      return; // Do not proceed if fields are invalid
    }

    // 1. Left Panel locks into static verified state
    setLeftPanelStep(3);

    // 2. Right Panel starts animated transition
    setRightPanelState('matching');
    setMatchingStepIndex(0);

    setTimeout(() => setMatchingStepIndex(1), 500);
    setTimeout(() => setMatchingStepIndex(2), 1000);

    // 3. Right Panel reveals matched results
    setTimeout(() => {
      setRightPanelState('results');
      setSelectedCourse(activeCoursePool[0]);
    }, 1500);
  };

  // Phase 4: Document Attach (Optional)
  const handleFileUpload = (checklistId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFiles(prev => ({
      ...prev,
      [checklistId]: {
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }
    }));
  };

  const handleSimulateQuickUpload = (checklistId: string, docName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [checklistId]: {
        fileName: docName,
        fileSize: `${(1.2 + Math.random() * 1.5).toFixed(1)} MB`
      }
    }));
  };

  const handleRemoveUploadedFile = (checklistId: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[checklistId];
      return copy;
    });
  };

  // Final Submit
  const handleFinalSubmit = () => {
    setIsSubmittingDossier(true);

    setTimeout(() => {
      const docsArray = Object.entries(uploadedFiles).map(([chkId, info]) => {
        const chkItem = checklists.find(c => c.id === chkId);
        return {
          checklistId: chkId,
          docName: chkItem ? chkItem.docName : 'Academic Document',
          fileName: info.fileName,
          fileSize: info.fileSize
        };
      });

      const result = bindStudentAccountAndSubmitATS({
        name: verifiedName || 'Ananya Sen',
        email: verifiedEmail || 'ananya.sen@example.com',
        phone: verifiedPhone || '+49 176 9821 5530',
        targetCountry: selectedCountry,
        targetCourse: selectedCourse ? selectedCourse.courseName : 'MBA in International Hospitality Management',
        matchScore: 98,
        uploadedDocs: docsArray
      });

      setSubmissionReceipt({
        leadId: result.atsTask.id,
        consultant: result.atsTask.assignedConsultant
      });
      setIsSubmittingDossier(false);
      setRightPanelState('success');
      if (onApplicationSubmitted) {
        onApplicationSubmitted(result.atsTask.id);
      }
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 font-sans">
      
      {/* 1. TOP SPECIALTY & "WHY CHOOSE US" SECTION (DECOUPLED & DISTINCT CONTAINER) */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-10 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 text-slate-900 border-2 border-indigo-100/90 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden ring-1 ring-slate-900/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        
        {/* Top Meta Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct University Admissions • Zero Traditional Agent Commissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Study Abroad Hub • Direct European Degree &amp; Career Gateway
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 self-start lg:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026/2027 Direct University Intake Open</span>
          </div>
        </div>

        {/* Specialty Explanation & 3-Click Process */}
        <div className="grid lg:grid-cols-12 gap-6 pt-5 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Eliminate expensive agent commissions and hidden consultancies. Our automated ATS platform directly evaluates your academic credentials against official statutory admission standards across German and European public universities — unlocking <strong className="text-amber-700 font-bold">€0 tuition fee opportunities</strong> (nominal semester administrative contribution only, approx. €150–€350/term with public transit ticket included), legal <strong className="text-emerald-700 font-bold">20 hrs/week student employment rights</strong> (€13–€16/hr minimum wage), and an unrestricted <strong className="text-brand-700 font-bold">18-month post-study job seeker visa</strong> (§20 AufenthG) for accelerated permanent settlement.
            </p>
            
            {/* 3-Step Process Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 block mb-1">Step 1 • 10 Seconds</span>
                <p className="text-xs font-bold text-slate-900">Upload Transcripts</p>
                <p className="text-[11px] text-slate-500 mt-0.5">AI extracts grades, ECTS credits &amp; course units.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">Step 2 • Automated</span>
                <p className="text-xs font-bold text-slate-900">Verify ECTS &amp; Criteria</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Instant match against verified university quotas.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">Step 3 • 1-Click</span>
                <p className="text-xs font-bold text-slate-900">ATS Direct Dispatch</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct routing to official university application portals.</p>
              </div>
            </div>

            {/* Why Us Line */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              <span>⭐</span>
              <span><strong className="text-amber-950 font-bold">Why Choose Us:</strong> Direct University Pathways • 100% Genuine Admission &amp; APS Clearance • Complete Settlement Ecosystem (Dorm, Blocked Account &amp; Anmeldung)</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              ⚖️ <em>Factual Transparency: Higher education admissions are governed by university faculty criteria and statutory residence laws (§16b AufenthG). We provide verifiable qualification auditing with zero middlemen.</em>
            </p>
          </div>

          {/* CTA Button Anchor */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center items-start lg:items-end gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('study-abroad-ats-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group scale-100 hover:scale-[1.02]"
            >
              <span>Connect to Form / Select Country &amp; Apply</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-500 text-left lg:text-right">
              No login required • Free preliminary eligibility assessment
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ANIMATED GLOWING CONTAINER: DEDICATED APPLICATION TOOL SECTION        */}
      {/* Floating active AI tool with running light/gradient border animation */}
      {/* ===================================================================== */}
      <div className="max-w-7xl mx-auto ai-tool-glowing-frame">
        <div className="ai-tool-inner-canvas p-4 sm:p-6 lg:p-7 space-y-6">

          {/* Standout Dedicated Tool Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-500/20 via-indigo-500/20 to-purple-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Active AI Matching Engine • 2026/27 Intake</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                AI-Powered Study Abroad Instant Match &amp; Application
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                Autonomously evaluate university admission criteria, verify tuition-free public degree eligibility across Germany, Austria, and Switzerland, and submit your dossier directly without traditional agent fees.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-400">Direct University Network</div>
                <div className="text-sm font-black text-emerald-400">100% Agent-Free Gateway</div>
              </div>
            </div>
          </div>

          {/* Main Split Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-5 items-start">

        {/* ===================================================================== */}
        {/* LEFT PANEL: COMPUTER-PROFESSIONAL ATS APPLICATION FORM CONTAINER      */}
        {/* With integrated country destination selection directly atop the form */}
        {/* ===================================================================== */}
        <div 
          id="study-abroad-ats-form"
          className="lg:col-span-5 bg-slate-50 border-2 border-slate-200/90 text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 ring-1 ring-slate-900/5 scroll-mt-28"
        >
          
          {/* Integrated Country Destination Selection */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-700">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Select Study Destination:</span>
              </span>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {selectedCountry} Selected
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {countries.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCountry(c.name)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCountry === c.name
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{c.flag || '🌍'}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ATS Terminal Header & Naming */}
          <div className="pb-3 border-b border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-black uppercase tracking-wider border border-brand-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI-Powered ATS Application Terminal</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Online • 2026/27 Intake</span>
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              International Student ATS Application
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target Destination: <strong className="text-brand-600 font-bold">{selectedCountry}</strong>. AI model parses academic credits and verifies university admission eligibility in real time with zero agent commission.
            </p>
          </div>
          
          {/* Phase 2: Source Toggle (Online Live Search vs Database Match) */}
          <div className="space-y-1.5 pb-1">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
              <span>Matching Source Engine:</span>
              <span className="font-bold text-brand-700">
                {matchSource === 'online' ? '🌐 Live Web Active' : '🗄️ Tie-Up DB Active'}
              </span>
            </div>

            {/* Prominent Segmented Toggle */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMatchSource('online')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matchSource === 'online'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>🌐</span>
                <span>Online Live Search</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                  matchSource === 'online' ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                }`}>
                  Live AI
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMatchSource('database')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matchSource === 'database'
                    ? 'bg-slate-900 text-white shadow-md scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>🗄️</span>
                <span>Database Match</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                  matchSource === 'database' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  Tie-Up DB
                </span>
              </button>
            </div>
          </div>

          {/* Left Panel Step Progress */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              leftPanelStep === 1 ? 'bg-brand-600 text-white shadow-md' : 'text-emerald-700 bg-emerald-50'
            }`}>
              1. Resume Upload
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              leftPanelStep === 2 ? 'bg-brand-600 text-white shadow-md' : leftPanelStep > 2 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'
            }`}>
              2. Data Verification
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              leftPanelStep === 3 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
            }`}>
              3. Profile Verified ✓
            </span>
          </div>

          {/* STEP 1: RESUME UPLOAD */}
          {leftPanelStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-wider">
                  Client-Side Gemini Pro Parser
                </span>
                <h2 className="text-xl font-black text-slate-900">Upload Candidate Dossier</h2>
                <p className="text-xs text-slate-500">
                  Target Destination: <strong className="text-brand-600 font-bold">{selectedCountry}</strong>. AI model extracts credentials directly in browser.
                </p>
              </div>

              {/* Upload Drop Zone */}
              <label className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-brand-50/20 transition-all group">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to browse or drop PDF / DOCX
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports Hospitality, Catering, Tourism &amp; Business credentials
                  </span>
                </div>
              </label>

              {/* Parsing Progress */}
              {isParsingResume && (
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-800">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
                      Client-Side Gemini Pro AI Parsing
                    </span>
                    <span className="text-[10px] text-brand-600">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{parserNotice}</p>
                  <div className="w-full bg-brand-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-600 h-1.5 rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              )}

              {/* Direct Simulator for Hotel & Catering Management Candidate */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5 text-brand-600" />
                    Target Profile Simulator:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">B.Sc + PGCert</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Simulate parsing for candidate with <strong>Bachelor of Science in Catering and Hotel Management</strong> and <strong>Postgraduate Certificate in Business Administration</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const sampleCv = `Candidate Full Name: Ananya Sen
Email Address: ananya.sen@hospitality.ac.in
Phone Number: +49 176 9821 5530
Academic Qualifications:
- Bachelor of Science in Catering and Hotel Management (Distinction)
- Postgraduate Certificate in Business Administration
Cumulative Grade Point: 8.4 CGPA / 3.8 GPA (First Class Honors)
Work History:
3.5 Years Experience as Operations Lead in Luxury Hotel & Catering Management
Language Test:
IELTS 7.5 Academic Band`;
                    const mockFile = new File([sampleCv], "Ananya_Sen_Hospitality_Resume.txt", { type: "text/plain" });
                    setResumeFile({ name: "Ananya_Sen_Hospitality_Resume.txt", size: "1.2 MB" });
                    executeRealTimeAIParsing(mockFile);
                  }}
                  className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-bold rounded-xl cursor-pointer transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulate Catering &amp; Hotel Management Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATA VERIFICATION FORM WITH RED BORDER VALIDATION */}
          {leftPanelStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Credentials Extracted
                </span>
                <button
                  onClick={() => setLeftPanelStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  ← Re-upload
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Verify Candidate Parameters</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm the candidate parameters. Any missing or invalid fields are highlighted with a red border.
                </p>
              </div>

              <form onSubmit={handleVerifyAndProceed} className="space-y-3 text-xs">
                
                {/* Full Name */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-700 font-bold">FULL Legal Name *</label>
                    {formSubmitted && !isNameValid && (
                      <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> Full name required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={verifiedName}
                    onChange={(e) => setVerifiedName(e.target.value)}
                    placeholder="Candidate's full legal name"
                    className={`w-full px-3 py-2 border rounded-xl outline-none font-semibold transition-all ${
                      formSubmitted && !isNameValid
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 text-red-900'
                        : 'border-slate-200 focus:border-brand-600 text-slate-900'
                    }`}
                  />
                </div>

                {/* Email & Full Phone with Country Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-bold">Email Address *</label>
                      {formSubmitted && !isEmailValid && (
                        <span className="text-[10px] text-red-600 font-bold">Invalid</span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={verifiedEmail}
                      onChange={(e) => setVerifiedEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className={`w-full px-3 py-2 border rounded-xl outline-none font-semibold transition-all ${
                        formSubmitted && !isEmailValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 text-red-900'
                          : 'border-slate-200 focus:border-brand-600 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-bold">Phone (+Country Code) *</label>
                      {formSubmitted && !isPhoneValid && (
                        <span className="text-[10px] text-red-600 font-bold">Needs +Code</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={verifiedPhone}
                      onChange={(e) => setVerifiedPhone(e.target.value)}
                      placeholder="e.g. +49 176 9821 5530"
                      className={`w-full px-3 py-2 border rounded-xl outline-none font-semibold transition-all ${
                        formSubmitted && !isPhoneValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 text-red-900'
                          : 'border-slate-200 focus:border-brand-600 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Latest Education & Background */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-700 font-bold">Latest Academic Degree &amp; Post-Grad Certification *</label>
                    {formSubmitted && !isEducationValid && (
                      <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> Required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={verifiedEducation}
                    onChange={(e) => setVerifiedEducation(e.target.value)}
                    placeholder="e.g. Bachelor of Science in Catering and Hotel Management, Postgraduate Certificate in Business Administration"
                    className={`w-full px-3 py-2 border rounded-xl outline-none font-semibold transition-all ${
                      formSubmitted && !isEducationValid
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 text-red-900'
                        : 'border-slate-200 focus:border-brand-600 text-slate-900'
                    }`}
                  />
                </div>

                {/* Work Experience & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-bold">Relevant Work Experience *</label>
                      {formSubmitted && !isWorkExpValid && (
                        <span className="text-[10px] text-red-600 font-bold">Required</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={verifiedWorkExp}
                      onChange={(e) => setVerifiedWorkExp(e.target.value)}
                      placeholder="e.g. 3.5 Years in Hotel & Catering Management"
                      className={`w-full px-3 py-2 border rounded-xl outline-none font-semibold transition-all ${
                        formSubmitted && !isWorkExpValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 text-red-900'
                          : 'border-slate-200 focus:border-brand-600 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Duration</label>
                    <input
                      type="text"
                      value={verifiedDuration}
                      onChange={(e) => setVerifiedDuration(e.target.value)}
                      placeholder="e.g. 2 Years (Masters)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-brand-600 outline-none text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Transcript & Language Score */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Transcript Score / GPA</label>
                    <input
                      type="text"
                      value={verifiedTranscriptScore}
                      onChange={(e) => setVerifiedTranscriptScore(e.target.value)}
                      placeholder="e.g. 8.4 CGPA / 3.8 GPA (First Class)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-brand-600 outline-none text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Language Score</label>
                    <input
                      type="text"
                      value={verifiedLanguage}
                      onChange={(e) => setVerifiedLanguage(e.target.value)}
                      placeholder="e.g. IELTS 7.5 / German B2"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-brand-600 outline-none text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Validation Error Banner if form fails */}
                {formSubmitted && !isFormValid && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Please correct the highlighted fields with red borders (full name, valid phone with country code, education).</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Verify &amp; Proceed (Match via {matchSource === 'online' ? 'Online Live Search' : 'Database'})</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: STATIC PROFILE VERIFIED STATE (Forms Locked, Results on Right Panel) */}
          {leftPanelStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Profile Verified &amp; Locked
                </span>
                <button
                  type="button"
                  onClick={() => { setLeftPanelStep(2); setFormSubmitted(false); }}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 underline cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>

              {/* Verified Student Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                    {(verifiedName || 'A').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{verifiedName || 'Ananya Sen'}</h4>
                    <p className="text-[11px] text-slate-500">{verifiedEmail || 'ananya.sen@example.com'} • {verifiedPhone || '+49 176 9821 5530'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Background:</span>
                    <span className="font-bold text-slate-800 text-right max-w-[210px]">
                      {verifiedEducation || 'Bachelor of Science in Catering and Hotel Management, Postgraduate Certificate in Business Administration'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-semibold text-slate-700">{verifiedWorkExp || '3.5 Years in Hotel & Catering Management'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transcript Score:</span>
                    <span className="font-bold text-emerald-700">{verifiedTranscriptScore || '8.4 CGPA (Distinction)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Language Score:</span>
                    <span className="font-semibold text-slate-700">{verifiedLanguage || 'IELTS 7.5'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Matching Mode:</span>
                    <span className="font-bold text-brand-700">
                      {matchSource === 'online' ? '🌐 Online Live Search' : '🗄️ Database Tie-Up Quota'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="font-bold text-slate-900">{selectedCountry} (Tuition-Free Track)</span>
                  </div>
                </div>
              </div>

              {/* Locked Notice */}
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-2xl text-[11px] text-slate-600 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>
                  <strong>All matching programs are now active on the right panel.</strong> Browse the results, view full curriculum details, and proceed to the document upload step.
                </span>
              </div>
            </div>
          )}

          {/* Left Panel Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> APS Fast-Track Clearance Verified
            </span>
            <span>Accredited EU Higher Education</span>
          </div>

        </div>


        {/* ===================================================================== */}
        {/* RIGHT PANEL: ALL RESULTS, SUB-NAV, DETAILS, UPLOAD & SUCCESS          */}
        {/* Phase 3: High-Grade Dark Background Image with bg-slate-950/85 Blur   */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[680px] flex flex-col justify-between">
          
          {/* Phase 3: High-Grade Dark Background Image Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop"
              alt="University Campus Architecture"
              className="w-full h-full object-cover object-center opacity-25"
            />
            {/* Dark Slate 950/85 backdrop blur overlay for crisp legibility */}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
          </div>

          {/* Foreground Interactive Right Panel Content */}
          <div className={`relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full space-y-4 ${rightPanelState === "results" ? "overflow-y-auto max-h-[880px] custom-scrollbar" : ""}`}>


            {/* =================================================================== */}
            {/* RIGHT PANEL DYNAMIC STATE MACHINE                                  */}
            {/* =================================================================== */}
            <div className={`${rightPanelState === "results" ? "py-1" : "my-auto py-2"}`}>


              {/* STATE 1: INITIAL HERO STATE (Dynamic Rotating Promo Slider) */}
              {rightPanelState === 'hero' && (
                <div 
                  className="space-y-5 animate-in fade-in duration-300"
                  onMouseEnter={() => setIsPromoPaused(true)}
                  onMouseLeave={() => setIsPromoPaused(false)}
                >
                  {/* Dynamic Rotating Feature Slide */}
                  {(() => {
                    const slide = ABROAD_PROMO_SLIDES[currentPromoSlide];
                    return (
                      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl min-h-[300px] flex flex-col justify-between p-5 sm:p-6 transition-all duration-700">
                        {/* Background Slide Image */}
                        <img
                          key={slide.id}
                          src={slide.image}
                          alt={slide.title}
                          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 opacity-45"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

                        {/* Top Slide Bar: Badge + Progress Indicators + Controls */}
                        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-300 border border-white/25 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
                            <span>{slide.flag}</span>
                            <span>{slide.badge}</span>
                          </span>

                          {/* Controls & Slide Counter */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                              0{currentPromoSlide + 1} / 0{ABROAD_PROMO_SLIDES.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevPromoSlide}
                                aria-label="Previous destination slide"
                                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextPromoSlide}
                                aria-label="Next destination slide"
                                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Middle Content */}
                        <div className="relative z-10 space-y-2.5 my-4">
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {slide.title}
                          </h3>
                          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
                            {slide.desc}
                          </p>

                          {/* Quick Metrics & Destination Button */}
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{slide.stat}: {slide.statLabel}</span>
                            </div>

                            {slide.tags.map(t => (
                              <span key={t} className="px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-300 text-[10px] font-medium border border-white/10">
                                {t}
                              </span>
                            ))}

                            <button
                              type="button"
                              onClick={() => setSelectedCountry(slide.country)}
                              className="ml-auto text-xs font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Set {slide.country} in Form</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Slide Dot Progress Indicators */}
                        <div className="relative z-10 flex items-center gap-1.5 pt-2 border-t border-white/15">
                          {ABROAD_PROMO_SLIDES.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setCurrentPromoSlide(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                currentPromoSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                              }`}
                              aria-label={`Jump to slide ${idx + 1}`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-2">
                            Autoplays every 5.5s • Hover to pause
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4 Feature Highlights */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <GraduationCap className="w-4 h-4" /> 100% Free Tuition
                      </div>
                      <h4 className="text-xs font-bold text-white">Public University Network</h4>
                      <p className="text-[10px] text-slate-300">Top German state universities with full tuition subsidy for hospitality &amp; business programs.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <Briefcase className="w-4 h-4" /> 20 Hrs / Week Work
                      </div>
                      <h4 className="text-xs font-bold text-white">Student Work Rights</h4>
                      <p className="text-[10px] text-slate-300">Earn €1,000–€1,400/month working in premier German hotels, catering operations, and resorts.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" /> 18-Month Stay Back
                      </div>
                      <h4 className="text-xs font-bold text-white">Job Seeker Transition</h4>
                      <p className="text-[10px] text-slate-300">Direct route to EU Blue Card with Marriott, Accor, Hilton, and German tourism conglomerates.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" /> APS Fast-Track Clearance
                      </div>
                      <h4 className="text-xs font-bold text-white">Certified Admission</h4>
                      <p className="text-[10px] text-slate-300">End-to-end dossier verification, Uni-Assist submissions, and blocked account assistance.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <strong className="text-white block">Ready to view matching degree programs?</strong>
                      <span>Select matching mode on the left and click "Verify &amp; Proceed" to display courses.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: THINKING / MATCHING ANIMATED TRANSITION */}
              {rightPanelState === 'matching' && (
                <div className="p-8 rounded-3xl bg-slate-950/80 border border-brand-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 animate-spin blur-md opacity-75" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center shadow-inner">
                          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        AI Neural Degree Matching Active • {matchSource === 'online' ? 'Online Live Search' : 'Database Tie-Up'}
                      </div>
                      <h3 className="text-xl font-black text-white">Analyzing Academic Credentials for {selectedCountry}</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {matchingStepIndex === 0 && "Evaluating Bachelor in Catering & Hotel Management + PGCert Business Admin..."}
                        {matchingStepIndex === 1 && `Cross-referencing accredited ${selectedCountry} university quotas & APS clearance...`}
                        {matchingStepIndex >= 2 && "Synthesizing optimal MBA in Hospitality Management & Executive Masters with €0 tuition..."}
                      </p>
                    </div>
                  </div>

                  {/* Pulsing Skeleton Loaders */}
                  <div className="space-y-3 pt-2 text-left">
                    <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 animate-pulse space-y-3">
                      <div className="h-4 bg-white/20 rounded-md w-3/4" />
                      <div className="h-3 bg-white/10 rounded-md w-1/2" />
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="h-8 bg-white/10 rounded-md" />
                        <div className="h-8 bg-white/10 rounded-md" />
                        <div className="h-8 bg-white/10 rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-brand-500 via-indigo-400 to-emerald-400 h-full transition-all duration-700 ease-out"
                      style={{ width: matchingStepIndex === 0 ? '35%' : matchingStepIndex === 1 ? '75%' : '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* STATE 3: ALL MATCHED COURSE RESULTS RENDERED ON RIGHT PANEL */}
              {rightPanelState === 'results' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Clean Minimalist Header (Space Efficient) */}
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">Matched Programs in {selectedCountry}</h3>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {filteredCourses.length} Found
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      matchSource === 'online'
                        ? 'text-amber-300 bg-amber-500/15 border-amber-400/30'
                        : 'text-purple-300 bg-purple-500/15 border-purple-400/30'
                    }`}>
                      {matchSource === 'online' ? '🌐 Live Web Search' : '🗄️ Database Tie-Up'}
                    </span>
                  </div>

                  {/* 1. Two Clean Dropdown Menus Placed Side-by-Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Institution Type Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>Institution Type</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedInstitutionFilter}
                          onChange={(e) => setSelectedInstitutionFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Institutions</option>
                          <option value="public_uni" className="bg-slate-900 text-white">Public University (€0 Tuition)</option>
                          <option value="private_uni" className="bg-slate-900 text-white">Private University</option>
                          <option value="exec_school" className="bg-slate-900 text-white">Executive Business School</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Program / Degree Type Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Program / Degree Type</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedProgramFilter}
                          onChange={(e) => setSelectedProgramFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Programs</option>
                          <option value="masters" className="bg-slate-900 text-white">Masters / MBA</option>
                          <option value="bachelors" className="bg-slate-900 text-white">Bachelors</option>
                          <option value="ausbildung" className="bg-slate-900 text-white">Ausbildung (Vocational)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Compact Keyword Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search courses by keyword (e.g. Hospitality, MBA, Tourism)..."
                      value={courseSearchKeyword}
                      onChange={(e) => setCourseSearchKeyword(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-brand-400 text-white placeholder-slate-400 transition-colors"
                    />
                  </div>

                  {/* 2. Compact Result Cards (Tiles): Approx. 2 inches height (~76px), full width, core info, click to expand */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredCourses.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
                        No courses found matching the selected criteria. Try selecting "All Institutions" or "All Programs".
                      </div>
                    ) : (
                      filteredCourses.map((crs, idx) => {
                        const matchPct = idx === 0 ? 98 : idx === 1 ? 96 : idx === 2 ? 95 : Math.max(88, 92 - idx * 2);

                        return (
                          <div
                            key={crs.id}
                            onClick={() => {
                              setSelectedCourse(crs);
                              setRightPanelState('details');
                            }}
                            className="w-full min-h-[72px] sm:h-[78px] px-3.5 py-2.5 rounded-xl bg-slate-900/75 hover:bg-slate-800/90 border border-white/10 hover:border-brand-400/80 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md flex items-center justify-between gap-3 text-left select-none"
                            title="Click anywhere to view full curriculum, tuition subsidies, and admission details"
                          >
                            {/* Degree Icon */}
                            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-brand-300 group-hover:border-brand-400/40 group-hover:bg-brand-500/15 transition-all shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>

                            {/* Core Info: Title + Meta */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {crs.courseName}
                                </h4>
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 shrink-0">
                                  {crs.degree}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                                <span className="text-slate-300 font-medium truncate max-w-[160px] sm:max-w-[210px]">{crs.collegeName}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-emerald-400 font-semibold">{crs.tuitionPerYear}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-300 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {crs.duration}
                                </span>
                              </div>
                            </div>

                            {/* Match Indicator & Expand Chevron */}
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                                ★ {matchPct}% Match
                              </span>
                              <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-500 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>


                </div>
              )}

              {/* STATE 4: COURSE DETAILS VIEW ON RIGHT PANEL */}
              {rightPanelState === 'details' && selectedCourse && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Matched Results
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
                      ★ 98% AI Match Recommendation
                    </span>
                  </div>

                  {/* Course Header */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-brand-400 block">
                      {selectedCourse.collegeName} • {selectedCountry}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {selectedCourse.courseName}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* 3 Metrics Pillars */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        Tuition Fee
                      </span>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        {selectedCourse.tuitionPerYear}
                      </h4>
                      <span className="text-[9px] text-slate-400">German State Subsidy</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Duration &amp; Degree
                      </span>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        {selectedCourse.degree}
                      </h4>
                      <span className="text-[9px] text-slate-400">{selectedCourse.duration}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                        Admissions Bar
                      </span>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        Min {selectedCourse.minCGPA} CGPA
                      </h4>
                      <span className="text-[9px] text-slate-400">IELTS {selectedCourse.minIELTS}+</span>
                    </div>
                  </div>

                  {/* Syllabus & Core Modules Highlight */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 block">
                      Curriculum Highlights for Hospitality &amp; Business Management
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Luxury Hotel &amp; Resort Operations</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Strategic Gastronomy Economics</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Corporate Financial Administration</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Global Tourism Logistics &amp; Events</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Entitlements */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-200">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>20 Hrs/Week Work Rights • 18-Month Post-Study Job Seeker Visa Included</span>
                    </span>
                    <span className="font-bold text-white">APS Fast-Track</span>
                  </div>

                  {/* Proceed to Document Upload */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('upload')}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Proceed with {selectedCourse.courseName.slice(0, 32)}...</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 5: DOCUMENT UPLOAD (ALL OPTIONAL) ON RIGHT PANEL */}
              {rightPanelState === 'upload' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                      Document Dossier (Optional)
                    </span>
                    <button
                      type="button"
                      onClick={() => setRightPanelState('details')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Course Details
                    </button>
                  </div>

                  {selectedCourse && (
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-brand-400 block">
                          Target Program
                        </span>
                        <h4 className="text-xs font-black text-white">{selectedCourse.courseName}</h4>
                        <p className="text-[10px] text-slate-300">
                          {selectedCourse.degree} • {selectedCourse.duration} • {selectedCourse.tuitionPerYear}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                        Selected
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white">Attach Academic Records (Optional)</h3>
                    <p className="text-xs text-slate-300">
                      All uploads are <strong>(Optional)</strong>. You may submit immediately without attaching documents — our admissions counselor will collect any required documents during your onboarding call.
                    </p>
                  </div>

                  {/* Optional Document Upload Fields */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {activeChecklist.map((chk) => {
                      const uploaded = uploadedFiles[chk.id];

                      return (
                        <div
                          key={chk.id}
                          className={`p-3 rounded-2xl border transition-all ${
                            uploaded 
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                              : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <FileText className={`w-3.5 h-3.5 ${uploaded ? 'text-emerald-400' : 'text-brand-400'}`} />
                                <h4 className="text-xs font-bold text-white">
                                  {chk.docName} <span className="text-slate-400 font-normal">(Optional)</span>
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-400">{chk.description}</p>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5">
                              {uploaded ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.8 rounded-lg border border-emerald-500/30">
                                    <Check className="w-3 h-3" /> Ready ({uploaded.fileSize})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUploadedFile(chk.id)}
                                    className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                                    title="Remove"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <label className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 cursor-pointer transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.docx,.jpg,.png"
                                      onChange={(e) => handleFileUpload(chk.id, e)}
                                      className="hidden"
                                    />
                                    Attach
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleSimulateQuickUpload(chk.id, `${chk.docName.replace(/\s+/g, '_')}.pdf`)}
                                    className="px-2 py-1 text-[10px] text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
                                    title="Quick simulate"
                                  >
                                    Simulate
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmittingDossier}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingDossier ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Transmitting Application to ATS Desk...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Submit Application to Admissions Desk</>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-1.5">
                      No attachments required to submit. Our admissions team follows up on all student inquiries.
                    </p>
                  </div>
                </div>
              )}

              {/* STATE 6: FINAL SUCCESS STATE ON RIGHT PANEL */}
              {rightPanelState === 'success' && (
                <div className="space-y-5 text-center py-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  {/* Exact Required Success Message */}
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                      Admissions Acknowledgment Confirmed
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      Your application is successful, and we will get in touch with you shortly.
                    </h3>
                  </div>

                  {/* Summary of Attached Files */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-brand-400" /> Attached Academic Dossier Summary
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {Object.keys(uploadedFiles).length} Files Attached
                      </span>
                    </div>

                    {Object.keys(uploadedFiles).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">
                        No documents attached (Optional). Our consultant will collect any necessary transcripts or records during your initial consultation.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {Object.entries(uploadedFiles).map(([chkId, fileInfo]) => {
                          const chkItem = checklists.find(c => c.id === chkId);
                          return (
                            <div key={chkId} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/5">
                              <span className="font-semibold text-slate-200 truncate max-w-[220px]">
                                {chkItem?.docName || fileInfo.fileName}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                {fileInfo.fileSize} • Uploaded
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Application Details */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Lead Tracking ID:</span>
                      <span className="font-mono font-bold text-brand-400">{submissionReceipt?.leadId || 'ATS-DE-2026-984'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Target Degree:</span>
                      <span className="font-bold text-white truncate max-w-[220px]">
                        {selectedCourse ? selectedCourse.courseName : 'MBA in International Hospitality Management'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assigned Counselor:</span>
                      <span className="font-bold text-emerald-400">{submissionReceipt?.consultant || 'Senior EU Admissions Desk (Munich/Berlin)'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Sourced Via:</span>
                      <span className="font-semibold text-brand-400">
                        {matchSource === 'online' ? '🌐 Online Live Search (2026/27 Intake)' : '🗄️ Database Pre-Approved Quota'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Browse More Programs
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Panel Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>EU Bologna Process Accredited</span>
              </span>
              <span>Real-Time Tie-Up Database Synchronized</span>
            </div>

          </div>

        </div>

      </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FINAL ACTION PROMPT: READY TO BEGIN YOUR JOURNEY                          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-950 via-indigo-950 to-slate-900 border-2 border-amber-500/35 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Admissions &amp; Fast-Track Processing</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">Ready to Begin Your {selectedCountry} Journey?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Shortlist verified universities, receive personalized application counseling, and secure your APS document clearance directly with our senior European admissions desk.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#applications?tab=Study%20Abroad';
          }}
          className="relative z-10 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 shrink-0 group"
        >
          <span>Apply for University Counseling</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VISUAL SECTION SEPARATOR: BENEFITS OF EDUCATION & STUDYING ABROAD         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-slate-700/60 shadow-sm" />
        </div>
        <div className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-full border border-amber-500/40 shadow-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            ✦ Benefits of Education / Studying Abroad ✦
          </span>
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            • Curated Country Benefits &amp; Career Intelligence
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BENEFITS OF STUDYING ABROAD (DESTINATION INTELLIGENCE & PATHWAYS)      */}
      {/* Dynamically linked to selectedCountry, institution & program filters      */}
      {/* ========================================================================= */}
      <div id="study-benefits-section" className="max-w-7xl mx-auto scroll-mt-28">
        <DestinationInsightsSection 
          country={selectedCountry}
          institutionFilter={selectedInstitutionFilter}
          programFilter={selectedProgramFilter}
        />
      </div>

      {/* ========================================================================= */}
      {/* VISUAL SECTION SEPARATOR: DIRECTLY TRANSITIONING TO SUPPORT & SERVICES     */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-slate-700/60 shadow-sm" />
        </div>
        <div className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-full border border-emerald-500/40 shadow-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
            ✦ Other Support &amp; Services Available ✦
          </span>
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            • Full-Lifecycle Student Settlement Ecosystem
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OTHER SUPPORT & SERVICES AVAILABLE (CLEAN CONCLUDING SERVICE SUMMARY)   */}
      {/* ========================================================================= */}
      <div id="complimentary-services" className="max-w-7xl mx-auto scroll-mt-28">
        <OtherSupportServicesSection country={selectedCountry} />
      </div>

    </div>
  );
};
