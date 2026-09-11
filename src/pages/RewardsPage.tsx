import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Globe, 
  Star, 
  Zap, 
  Award,
  ArrowRight, 
  Crown,
  Gift,
  CheckCircle2, 
  Briefcase,
  GraduationCap,
  Sparkles,
  Plane,
  Home,
  FileCheck,
  Compass,
  PlusCircle,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  QrCode,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  Send,
  MapPin,
  Camera,
  Share2,
  Copy
} from 'lucide-react';
import { 
  RewardRule, 
  RewardCatalogItem, 
  getRewardRules, 
  getRewardCatalog
} from '../lib/db';

const consultantAvatars = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', label: 'Ambassador 1' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', label: 'Ambassador 2' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400', label: 'Ambassador 3' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', label: 'Ambassador 4' }
];

const magazineStoryCards = [
  {
    id: 'story-peer',
    title: 'Promote Courses to Friends & Earn Together',
    badge: 'Peer Promotion',
    tag: 'Instant Cash Bonus',
    payout: '₹2,500 – ₹5,000 + 50 Pts',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    keyPoints: [
      'Invite college peers to German (A1-B2) or Tech courses',
      'Automatic wallet credit on fee confirmation',
      '2 referrals cover your full monthly living expense'
    ],
    actionText: 'Invite Friends & Earn →',
    actionUrl: '#applications?tab=Reward Club - Refer Friends'
  },
  {
    id: 'story-work',
    title: 'Work & Study: Corporate Pilots & Career Gains',
    badge: 'Work & Study',
    tag: 'Monthly Stipends',
    payout: '₹15,000 – ₹35,000 / Mo',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    keyPoints: [
      'Live software, solar & international trade projects',
      '1-Year verified corporate certificate for visa dossiers',
      'Transition directly to full salary packages'
    ],
    actionText: 'Join Work & Study Pilot →',
    actionUrl: '#work-while-you-study-page'
  },
  {
    id: 'story-abroad',
    title: 'Study Abroad: Free 0€ German Universities',
    badge: 'Study Abroad',
    tag: '0€ Tuition Model',
    payout: 'TU9 / LMU / FAU Admissions',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    keyPoints: [
      'World-ranked public universities with zero tuition fees',
      'Guaranteed APS & blocked account (€11,900) advisory',
      'Options for private institutions in Berlin, Munich & London'
    ],
    actionText: 'Explore EU Universities →',
    actionUrl: '#study-abroad'
  },
  {
    id: 'story-visa',
    title: 'Visa & Jobs: 100% European Placement',
    badge: 'Visa & Career',
    tag: 'High Shortage Demand',
    payout: 'German EU Blue Card & Chancenkarte',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    keyPoints: [
      'Massive shortages for Doctors, Nurses, IT & Engineers',
      'Opportunity Card fast-track and direct employer interviews',
      'Defizitbescheid deficit letter & license recognition support'
    ],
    actionText: 'View European Vacancies →',
    actionUrl: '#jobs-page'
  }
];

const consultantTiers = [
  {
    level: "Junior Consultant",
    tag: "Entry Level & Student Ambassadors",
    criteria: "0 – 10 Referrals / 500 Pts",
    badge: "Official Digital ID",
    color: "from-blue-600 to-indigo-700",
    perks: [
      "Official Verified Consultant Digital ID Card",
      "Instant Wallet Cashback (₹2,500 – ₹5,000 per referral)",
      "+50 to +100 Points for every friend enrolled",
      "Special 20% Discount on Goethe German & IELTS Courses"
    ],
    highlight: false
  },
  {
    level: "Senior Executive Consultant",
    tag: "Community Leaders & Growth Leads",
    criteria: "11 – 50 Referrals / 2,000 Pts",
    badge: "Most Popular",
    color: "from-amber-500 to-orange-600",
    perks: [
      "Priority 2x Points Multiplier on all ILA Services",
      "Free Developer Pro Laptop / Apple iPad Tech Kit",
      "100% Free €0 European Job Placement Package",
      "+₹10,000 / Month Corporate Stipend Step-Up"
    ],
    highlight: true
  },
  {
    level: "Global Venture Partner",
    tag: "Top Tier Performer & Regional Head",
    criteria: "50+ Active Referrals / 5,000 Pts",
    badge: "VIP Leadership",
    color: "from-purple-600 to-indigo-900",
    perks: [
      "All-Expense Paid 7-Day Germany & Swiss Educational Tour",
      "Permanent Salaried European Project Sponsorship",
      "Direct Revenue Profit Sharing on Regional Batches",
      "Full Sponsorship for German Opportunity Card / Blue Card"
    ],
    highlight: false
  }
];

const onGroundAbroadServices = [
  {
    title: "Room & WG Flat Scouting",
    earning: "€100 – €250 / verified room",
    icon: Home,
    desc: "Inspect apartments, verify local German landlords, and coordinate WG flatshares for newly arriving international students."
  },
  {
    title: "Airport Welcome & Transit",
    earning: "€50 – €100 / arrival group",
    icon: Plane,
    desc: "Receive fresh scholars at Frankfurt, Munich, or Berlin airports and guide regional train transit to their university campus."
  },
  {
    title: "City Paperwork (Anmeldung)",
    earning: "€50 – €100 / completed dossier",
    icon: FileCheck,
    desc: "Assist incoming students with City Hall municipal registration (Anmeldung), local bank accounts, and statutory health insurance."
  },
  {
    title: "Mini-Job & Employer Connections",
    earning: "€50 – €250 / job connection",
    icon: Briefcase,
    desc: "Connect new arrivals with verified 20h/week part-time student mini-jobs across supermarkets, retail, and IT logistics hubs."
  }
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState('pamphlet-hero');
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);

  // Digital Consultant Card Preview State
  const [cardName, setCardName] = useState('Aditya Verma');
  const [cardRole, setCardRole] = useState('Junior Consultant');
  const [cardTrack, setCardTrack] = useState('German Academy & Tech');
  const [selectedAvatar, setSelectedAvatar] = useState(consultantAvatars[0].url);
  const [copiedCode, setCopiedCode] = useState(false);

  const loadData = () => {
    setRules(getRewardRules());
    setCatalog(getRewardCatalog());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-reward-rules-changed', loadData);
    window.addEventListener('ilas-reward-catalog-changed', loadData);
    return () => {
      window.removeEventListener('ilas-reward-rules-changed', loadData);
      window.removeEventListener('ilas-reward-catalog-changed', loadData);
    };
  }, []);

  const navigateTo = (url: string) => {
    window.location.hash = url;
  };

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ILA-JC-2026-8894');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="pt-20 bg-slate-100 min-h-screen">
      
      {/* ================= 1. VISUAL PROMOTIONAL PAMPHLET HERO SECTION ================= */}
      <section className="container-max px-4 sm:px-6 pt-4 mb-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-brand-950 to-indigo-950 text-white p-6 sm:p-10 lg:p-12 border-2 border-amber-400/40 shadow-2xl">
          
          {/* Background Ambient Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Promotional Headline & Badges */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-400/20">
              <Sparkles className="w-4 h-4 text-slate-950" /> Official Rewards & Earning Pamphlet
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-md">
              “Join Our Team & Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Junior Consultant Card</span> — Promote All Our Facilities, Features & Services, Get Paid & Have Fun!”
            </h1>

            <p className="text-slate-200 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
              A high-reward gamified ecosystem where students, peers, and consultants earn continuous wallet cashbacks, milestone points, premium developer hardware, and fully sponsored European study tours.
            </p>
          </div>

          {/* 4 Pictorial Value Callouts (Brochure Style) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/15">
            
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center group hover:bg-white/15 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black mb-2 shadow-md group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-amber-300">₹2,500 – ₹5,000</div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider block mt-0.5">Per Peer Enrollment</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center group hover:bg-white/15 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black mb-2 shadow-md group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-emerald-300">+50 to +200 Pts</div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider block mt-0.5">Per Milestone Action</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center group hover:bg-white/15 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-400 text-slate-950 flex items-center justify-center font-black mb-2 shadow-md group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-indigo-300">Developer Laptops</div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider block mt-0.5">& Tech Toolkits</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center group hover:bg-white/15 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-rose-400 text-slate-950 flex items-center justify-center font-black mb-2 shadow-md group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-rose-300">7-Day EU Tour</div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider block mt-0.5">Germany & Switzerland</span>
            </div>

          </div>

          {/* Quick Action Bar */}
          <div className="relative z-10 flex flex-wrap justify-center items-center gap-3 mt-8">
            <button
              onClick={() => scrollTo('card-customizer-section')}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-amber-400/25 cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              <CreditCard className="w-4 h-4" /> Get Your Consultant ID Card <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('rewards-catalog-section')}
              className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-md flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-amber-300" /> Explore Prize Vault ↓
            </button>
            <button
              onClick={() => scrollTo('magazine-stories-section')}
              className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-md flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-300" /> Magazine Stories ↓
            </button>
          </div>

        </div>
      </section>

      {/* ================= 2. STICKY SUB-NAVIGATION ================= */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 mb-8 transition-all duration-300">
        <div className="container-max mx-auto px-4 flex justify-center items-center gap-3 sm:gap-6 flex-wrap">
          {[
            { id: 'card-customizer-section', label: '1. Junior Consultant ID' },
            { id: 'magazine-stories-section', label: '2. Magazine Feature Stories' },
            { id: 'reward-rules-section', label: '3. Gamified Point Rules' },
            { id: 'rewards-catalog-section', label: '4. Prizes, Tech & Tours' },
            { id: 'consultant-tiers-section', label: '5. Career Tiers & Growth' },
            { id: 'abroad-tasks-section', label: '6. Earn Abroad Tasks' }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={`text-xs sm:text-sm font-black pb-1 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected 
                    ? 'text-brand-600 border-b-2 border-brand-600' 
                    : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-max mx-auto px-4 sm:px-6 space-y-16 pb-20">
        
        {/* ================= 2. INTERACTIVE JUNIOR CONSULTANT ID CARD DISPLAY ================= */}
        <section id="card-customizer-section" className="scroll-mt-28">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-6 sm:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Form Controls */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Digital Ambassador Identity
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  Customize Your Verified Consultant Card
                </h2>
                
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  Enter your name, pick an ambassador profile photo, and select your specialization. Your card includes an automated tracking token for instant referral commissions.
                </p>

                {/* Avatar Photo Selector */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                    Choose Ambassador Photo Placeholder:
                  </label>
                  <div className="flex items-center gap-3">
                    {consultantAvatars.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedAvatar === av.url 
                            ? 'border-amber-500 ring-4 ring-amber-400/30 scale-105' 
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        {selectedAvatar === av.url && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-slate-950 font-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Role Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Aditya Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Consultant Role:</label>
                      <select
                        value={cardRole}
                        onChange={(e) => setCardRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-600"
                      >
                        <option value="Junior Consultant">Junior Consultant</option>
                        <option value="Student Ambassador">Student Ambassador</option>
                        <option value="Senior Executive">Senior Executive</option>
                        <option value="Global Venture Partner">Global Partner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Focus Domain:</label>
                      <select
                        value={cardTrack}
                        onChange={(e) => setCardTrack(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-600"
                      >
                        <option value="German Academy & Tech">German Academy & Tech</option>
                        <option value="Study Abroad & Universities">Study Abroad & Universities</option>
                        <option value="Work & Study Corporate Pilots">Work & Study Pilots</option>
                        <option value="European Visas & Jobs">European Visas & Jobs</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigateTo(`#applications?tab=Reward Club - Claim Consultant ID (${encodeURIComponent(cardName)} - ${encodeURIComponent(cardRole)})`)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-brand-600 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Claim & Register Digital ID</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Referral Code'}</span>
                  </button>
                </div>
              </div>

              {/* Right Photorealistic Digital Card Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-7 rounded-[2rem] border-2 border-amber-400/60 shadow-2xl relative overflow-hidden group hover:scale-102 transition-transform duration-300">
                  
                  {/* Glowing Holographic Accents */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                        ILA
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-amber-300">ILA GLOBAL ACADEMY</div>
                        <div className="text-[10px] text-slate-300 font-medium">International Consultant Pass</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Verified 2026
                    </span>
                  </div>

                  {/* Card Photo + Identity Grid */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg relative">
                      <img src={selectedAvatar} alt="Ambassador" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[8px] text-center text-amber-300 font-bold py-0.5">
                        OFFICIAL
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Authorized Holder</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {cardName || 'Your Name'}
                      </h3>
                      <div className="inline-block px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black rounded border border-amber-400/30">
                        {cardRole}
                      </div>
                    </div>
                  </div>

                  {/* Serial & QR Verification Block */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Card Referral Token</span>
                      <span className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider">
                        ILA-JC-2026-8894
                      </span>
                      <div className="text-[10px] text-slate-300 mt-0.5">{cardTrack}</div>
                    </div>
                    
                    <div className="p-2 bg-white rounded-lg text-slate-950 shrink-0 shadow-md">
                      <QrCode className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Footer Earning Guarantee */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> +50 Pts / Student Enrollment
                    </span>
                    <span className="text-amber-300 font-bold">100% Cashable</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. CONCISE, IMAGERY-DRIVEN STORY BLOCKS ================= */}
        <section id="magazine-stories-section" className="scroll-mt-28 border-t border-slate-200 pt-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              Editorial Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">
              The ILA Global Opportunity Magazine
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore concise, highly visual stories connecting peer promotions, paid corporate pilots, free public universities, and guaranteed international jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {magazineStoryCards.map((card) => (
              <div 
                key={card.id}
                className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* High Quality Visual Header */}
                  <div className="h-60 w-full overflow-hidden relative">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20">
                        {card.badge}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                        {card.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs font-bold text-amber-300 block">Earning Potential:</span>
                      <div className="text-lg sm:text-xl font-black text-white">{card.payout}</div>
                    </div>
                  </div>

                  {/* Concise Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h3>

                    {/* Concise Bullet Points */}
                    <div className="space-y-2 pt-1">
                      {card.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <button
                    onClick={() => navigateTo(card.actionUrl)}
                    className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{card.actionText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. GAMIFIED POINT RULES & MILESTONE TRIGGERS ================= */}
        <section id="reward-rules-section" className="scroll-mt-28 border-t border-slate-200 pt-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Point Rules Breakdown
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">
              Gamified Point Rules & Milestone Triggers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Every productive action across the ecosystem credits your wallet with instant points and cash bonuses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {rule.category}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                      +{rule.pointsReward} Points
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">
                    {rule.actionTitle}
                  </h3>

                  <div className="text-xs font-black text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 mb-3">
                    💰 {rule.cashIncentive}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigateTo(`#applications?tab=Reward Club - Action: ${encodeURIComponent(rule.actionTitle)}`)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Trigger This Milestone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. VISUAL GRID FOR PRIZES, GIFTS & TOURS ================= */}
        <section id="rewards-catalog-section" className="scroll-mt-28 border-t border-slate-200 pt-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest text-amber-800 uppercase bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Redeemable Reward Vault
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">
              Tech Kits, Developer Laptops & European Tours
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Exchange your points balance for high-end hardware, cash vouchers, or 7-day all-expense-paid European industry visit tours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  {item.imageUrl && (
                    <div className="h-52 w-full overflow-hidden relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 text-[10px] font-black uppercase text-slate-950 bg-amber-400 px-3 py-1 rounded-full shadow-md">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>{item.type}</span>
                      <span className="text-emerald-600 font-bold">{item.stockStatus}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-snug">{item.title}</h3>
                    <div className="text-xs font-black text-indigo-700 mb-2">{item.monetaryValue}</div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500 font-bold">Points Cost:</span>
                    <span className="text-sm font-black text-amber-600">{item.pointsCost} Points</span>
                  </div>

                  <button
                    onClick={() => navigateTo(`#applications?tab=Claim Reward: ${encodeURIComponent(item.title)}`)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Redeem This Prize</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 6. CONSULTANT CAREER TIERS ================= */}
        <section id="consultant-tiers-section" className="scroll-mt-28 border-t border-slate-200 pt-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              Career Elevation Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">
              Consultant Tiers, Gifts & European Tours
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Progress through performance milestones to unlock company-sponsored tours, gadget gifts, and equity sharing.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {consultantTiers.map((tier, idx) => (
              <div 
                key={idx}
                className={`p-8 sm:p-10 rounded-3xl border-2 flex flex-col justify-between relative shadow-lg hover:shadow-2xl transition-all ${
                  tier.highlight 
                    ? 'bg-slate-900 text-white border-amber-400 ring-4 ring-amber-400/30' 
                    : 'bg-white text-slate-900 border-slate-300'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    Top Career Choice
                  </div>
                )}
                
                <div>
                  <div className="mb-6">
                    <span className={`text-xs font-black uppercase tracking-wider ${tier.highlight ? 'text-amber-400' : 'text-brand-600'}`}>
                      {tier.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black mt-1">{tier.level}</h3>
                    <div className="text-xs font-bold text-slate-400 mt-1">Requirement: {tier.criteria}</div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-amber-400' : 'text-brand-600'}`} />
                        <span className={tier.highlight ? 'text-slate-200' : 'text-slate-700'}>
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigateTo(`#applications?tab=Reward Club - Tier: ${tier.level}`)}
                  className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                    tier.highlight 
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Join {tier.level} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 7. ON-GROUND ABROAD SUPPORT TASKS ================= */}
        <section id="abroad-tasks-section" className="scroll-mt-28 border-t border-slate-200 pt-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Euro & Dollar On-Ground Earning
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">
              Pick Tasks in Germany & Abroad for Instant Income
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              When you or your contacts are abroad, register available rooms, jobs, and local guidance on our portal to get assigned candidates, boost your reward points, and claim direct payouts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {onGroundAbroadServices.map((task, idx) => {
              const TaskIcon = task.icon;
              return (
                <div key={idx} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                      <TaskIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30 inline-block mb-2">
                      {task.earning}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">{task.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                      {task.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigateTo('#applications?tab=Reward Club - Claim Abroad Tasks')}
                    className="w-full py-2 bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/15"
                  >
                    Claim This Task Track →
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 8. ROYAL ILAS CONSULTANT AI SUITE ================= */}
        <section className="bg-slate-950 p-8 sm:p-12 rounded-3xl text-white border-2 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <div className="text-amber-400 font-black uppercase text-xs mb-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" /> Royal Lifetime Consultant Partner
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-100 mb-2">
              Ilas With You Consultant AI Suite
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              24/7 Personal Consulting Advisor: Auto-generate client pitch presentations, calculate referral rewards in real-time, simulate European visa eligibility, and track every student arrival dossier.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('#ilas-companion')} 
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all shadow-lg shadow-amber-500/20 hover:scale-102 shrink-0"
          >
            Access Ilas Consultant Companion →
          </button>
        </section>

      </div>
    </div>
  );
}