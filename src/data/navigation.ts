export interface NavItem {
  label: string
  href?: string
  action?: string
  children?: { label: string; href: string; description?: string; action?: string }[]
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  {
    label: 'All Courses',
    href: '#education',
    children: [
      { label: 'German Language A1-C2', href: '#course-german-language', description: 'A1–C2 certified courses with IntelliCoach AI' },
      { label: 'IELTS/TOEFL/PTE', href: '#course-ielts', description: 'Band 8.0+ language proficiency training' },
      { label: 'Software Engineering', href: '#course-software-engineering', description: 'SAP, Odoo, Full-Stack & Cloud tech' },
      { label: 'Job-Related Programs', href: '#course-job-related-programs', description: 'Editorial magazine-style career sprints' },
    ],
  },
  {
    label: 'Work and Study',
    href: '#work-while-you-study-page',
    children: [
      { label: 'Work & Study in India', href: '#work-while-you-study-page#work-in-india', description: 'Domestic corporate pilots with ₹15K–₹35K monthly stipends' },
      { label: 'Work & Study in Abroad', href: '#work-while-you-study-page#work-in-abroad', description: 'Pickup, accommodation, documentation, IT & marketing roles' },
      { label: 'German Onboarding Projects', href: '#work-while-you-study-page#german-projects', description: 'Solar, Trade, AI & Healthcare international pathways' },
      { label: 'Reward & Study / Earning Platforms', href: '#work-while-you-study-page#reward-study-platform', description: 'Points, tour packages, incentives & marketing head certification' },
      { label: 'Apply for Work & Study 🎯', href: '#applications?tab=Work While You Study', description: 'Submit contact details & book intake orientation' },
    ],
  },
  {
    label: 'Study Abroad',
    href: '#study-abroad',
    children: [
      { label: 'German Public Universities (€0 Tuition)', href: '#study-abroad#public', description: 'Step-by-step admissions across 400+ public universities' },
      { label: 'German Private Universities', href: '#study-abroad#private', description: 'Explore top private institutions & scholarships' },
      { label: 'Visa & APS Documentation Support', href: '#study-abroad#visa', description: 'End-to-end guidance through embassy files' },
      { label: 'Complete Processing Advisory', href: '#study-abroad#processing', description: 'Backed by dedicated DACH education advisors' },
    ],
  },
  {
    label: 'Visa Services',
    href: '#visa-page',
    children: [
      { label: 'Student Visa', href: '#visa-page#student-visa', description: 'University Enrollment & Documentation' },
      { label: 'Job Seeker Visa', href: '#visa-page#job-seeker-visa', description: 'Professional Career Entry' },
      { label: 'Opportunity Card (Chancenkarte)', href: '#visa-page#opportunity-card', description: 'Points evaluation & fast-track filing' },
      { label: 'Business & Schengen Visa', href: '#visa-page#business-visa', description: 'Corporate Travel & DACH Market Expansion' },
      { label: 'All Documentation Process', href: '#visa-page#documentation', description: 'AI-driven document handling & verification' },
    ],
  },
  {
    label: 'Jobs & Careers',
    href: '#jobs-page',
    children: [
      { label: 'Premium Career Services', href: '#jobs-page', description: 'Strategic job support & applications' },
      { label: 'Doctor to Driver Direct EU Placement', href: '#jobs', description: '500+ German employer hiring network' },
      { label: 'AI Resume Match', href: '#jobs', description: 'Smart DIN-standard CV optimization portal' },
    ],
  },
  {
    label: 'Rewards 🎁',
    href: '#rewards',
    children: [
      { label: 'Junior Consultant ID Pass', href: '#rewards#consultant-card', description: 'Claim digital consultant card & earn referral points' },
      { label: 'Magazine Blog Stories', href: '#rewards#magazine-stories', description: 'Editorial guides on peer promotions, work-study & visas' },
      { label: 'Gamified Point Rules', href: '#rewards#reward-rules', description: 'Earn +50 to +200 points per milestone & action' },
      { label: 'Prizes, Tech & European Tours', href: '#rewards#reward-catalog', description: 'Redeem laptops, vouchers & sponsored Germany tours' },
      { label: 'Consultant Tiers & Upgrades', href: '#rewards#consultant-tiers', description: 'Junior to Global Venture Partner career tracks' },
      { label: 'Earn Abroad On-Ground Tasks', href: '#rewards#abroad-tasks', description: 'Pick up €50–€250 tasks in Germany & Europe' },
    ],
  },
  { label: 'Apply Now 🎯', href: '#applications' },
]

export type PortalRole = 'student' | 'employee' | 'team' | 'employer'

export const portalRoles: { id: PortalRole; label: string; description: string }[] = [
  { id: 'student', label: 'Student', description: 'Access courses, progress & certificates' },
  { id: 'employee', label: 'Partner/Consultant', description: 'Manage assignments & referrals' },
  { id: 'team', label: 'Team / Staff', description: 'Access Admin ERP CMS Dashboard' },
  { id: 'employer', label: 'Enterprise', description: 'Hire, manage & track candidates' },
]
