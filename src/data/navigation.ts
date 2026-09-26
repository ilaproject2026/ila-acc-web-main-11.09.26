export interface NavSubItem {
  label: string
  href: string
  description?: string
  action?: string
}

export interface NavChildItem {
  label: string
  href: string
  description?: string
  action?: string
  subCategories?: NavSubItem[]
}

export interface NavItem {
  label: string
  href?: string
  action?: string
  children?: NavChildItem[]
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  {
    label: 'All Courses',
    href: '#education',
    children: [
      {
        label: 'Language & Education',
        href: '#education?category=Language%20%26%20Education',
        description: 'German A1–C2, IELTS, French, Spanish & Medical German certifications',
        subCategories: [
          { label: 'German Language (A1–C2)', href: '#education?category=Language%20%26%20Education&subCategory=German%20Language%20(A1%E2%80%93C2)', description: 'Goethe & Telc certified training with IntelliCoach AI' },
          { label: 'IELTS / TOEFL / PTE', href: '#education?category=Language%20%26%20Education&subCategory=IELTS%20%2F%20TOEFL%20%2F%20PTE', description: 'Band 8.0+ language proficiency training' },
          { label: 'French Language', href: '#education?category=Language%20%26%20Education&subCategory=French%20Language', description: 'DELF/DALF European standard curriculum' },
          { label: 'Spanish Language', href: '#education?category=Language%20%26%20Education&subCategory=Spanish%20Language', description: 'DELE international certification pathways' },
          { label: 'Medical German & FSP', href: '#education?category=Language%20%26%20Education&subCategory=Medical%20German%20%26%20FSP', description: 'Clinical communication & doctor licensing prep' },
        ]
      },
      {
        label: 'Software & IT Training',
        href: '#education?category=Software%20%26%20IT%20Training',
        description: 'Full-Stack, Cloud DevOps, Python AI & Cybersecurity tech tracks',
        subCategories: [
          { label: 'Full-Stack Web Dev (React/Node)', href: '#education?category=Software%20%26%20IT%20Training&subCategory=Full-Stack%20Web%20Dev%20(React%2FNode)', description: 'Modern React 19, TypeScript & microservices' },
          { label: 'Cloud DevOps & AWS', href: '#education?category=Software%20%26%20IT%20Training&subCategory=Cloud%20DevOps%20%26%20AWS', description: 'Docker, Kubernetes, CI/CD automated deploy' },
          { label: 'Python & AI Engineering', href: '#education?category=Software%20%26%20IT%20Training&subCategory=Python%20%26%20AI%20Engineering', description: 'LLM fine-tuning, ML pipelines & copilot agents' },
          { label: 'Cybersecurity', href: '#education?category=Software%20%26%20IT%20Training&subCategory=Cybersecurity', description: 'SOC analysis, ISO 27001 & threat auditing' },
        ]
      },
      {
        label: 'Enterprise Software Training (SAP)',
        href: '#education?category=Enterprise%20Software%20Training%20(SAP)',
        description: 'SAP S/4HANA functional modules, logistics & financials',
        subCategories: [
          { label: 'SAP FICO (Financials)', href: '#education?category=Enterprise%20Software%20Training%20(SAP)&subCategory=SAP%20FICO%20(Financials)', description: 'GL, AP/AR & asset management simulation' },
          { label: 'SAP MM (Supply Chain)', href: '#education?category=Enterprise%20Software%20Training%20(SAP)&subCategory=SAP%20MM%20(Supply%20Chain)', description: 'Procurement & vendor management workflows' },
          { label: 'SAP SD (Sales)', href: '#education?category=Enterprise%20Software%20Training%20(SAP)&subCategory=SAP%20SD%20(Sales)', description: 'Order-to-cash & international billing' },
          { label: 'SAP S/4HANA Architecture', href: '#education?category=Enterprise%20Software%20Training%20(SAP)&subCategory=SAP%20S%2F4HANA%20Architecture', description: 'Cloud migration & enterprise ERP integration' },
        ]
      },
      {
        label: 'Digital Marketing & Growth',
        href: '#education?category=Digital%20Marketing%20%26%20Growth',
        description: 'Performance marketing, Meta & Google ads, and AI automation',
        subCategories: [
          { label: 'Meta & Google Ads Strategy', href: '#education?category=Digital%20Marketing%20%26%20Growth&subCategory=Meta%20%26%20Google%20Ads%20Strategy', description: 'Performance marketing & campaign scaling' },
          { label: 'AI Copywriting & SEO', href: '#education?category=Digital%20Marketing%20%26%20Growth&subCategory=AI%20Copywriting%20%26%20SEO', description: 'Organic search & generative content workflows' },
          { label: 'Growth Automation & CRM', href: '#education?category=Digital%20Marketing%20%26%20Growth&subCategory=Growth%20Automation%20%26%20CRM', description: 'HubSpot, Klaviyo & customer retention funnels' },
          { label: 'Viral Social Content', href: '#education?category=Digital%20Marketing%20%26%20Growth&subCategory=Viral%20Social%20Content', description: 'Short-form video algorithms & organic distribution' },
        ]
      },
      {
        label: 'Health & Clinical',
        href: '#education?category=Health%20%26%20Clinical',
        description: 'Medical terminology, nurse licensing, and German hospital clinical communications',
        subCategories: [
          { label: 'Fachsprachprüfung (FSP)', href: '#education?category=Health%20%26%20Clinical&subCategory=Fachsprachpr%C3%BCfung%20(FSP)', description: 'Doctor medical language examination protocol' },
          { label: 'Kenntnisprüfung (KP)', href: '#education?category=Health%20%26%20Clinical&subCategory=Kenntnispr%C3%BCfung%20(KP)', description: 'Medical knowledge evaluation & Approbation' },
          { label: 'Clinical Nursing Standards', href: '#education?category=Health%20%26%20Clinical&subCategory=Clinical%20Nursing%20Standards', description: 'Patient care & German hospital ward documentation' },
          { label: 'Doctor-Patient Intake', href: '#education?category=Health%20%26%20Clinical&subCategory=Doctor-Patient%20Intake', description: 'Anamnese interviews & physical exam protocols' },
        ]
      },
      {
        label: 'Other Job-Related Courses',
        href: '#education?category=Other%20Job-Related%20Courses',
        description: 'Vocational career programs, technical certifications, European workplace onboarding and placements',
        subCategories: [
          { label: 'Vocational Career Sprints', href: '#education?category=Other%20Job-Related%20Courses&subCategory=Vocational%20Career%20Sprints', description: 'Fast-track career transition & corporate sprints' },
          { label: 'European Workplace Onboarding', href: '#education?category=Other%20Job-Related%20Courses&subCategory=European%20Workplace%20Onboarding', description: 'Workplace culture, contract review & relocation' },
          { label: 'German Technical Standards', href: '#education?category=Other%20Job-Related%20Courses&subCategory=German%20Technical%20Standards', description: 'DIN & VDI engineering documentation standards' },
          { label: 'Hospitality & Logistics', href: '#education?category=Other%20Job-Related%20Courses&subCategory=Hospitality%20%26%20Logistics%20Management', description: 'Supply chain operations & European service tracks' },
        ]
      },
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
