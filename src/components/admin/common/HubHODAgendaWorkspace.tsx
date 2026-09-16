import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, Calendar, Award, 
  Send, PlusCircle, CheckCircle2, 
  TrendingUp, Megaphone, Clock, Star,
  ShieldCheck, FileText, ChevronRight,
  Mic, MicOff, Volume2, Link as LinkIcon, 
  Youtube, LayoutGrid, Image, ExternalLink, 
  Trash2, Edit3, Copy, Check, Sparkles, 
  Layers, AlertCircle, ArrowUpRight, Play, RefreshCw, X
} from 'lucide-react';

export interface AgendaItem {
  id: string;
  department: string;
  title: string;
  targetDate: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'In Progress' | 'Completed' | 'Pending Review';
  notes: string;
  actionItems?: string[];
  createdAt: string;
}

export interface ReferenceLinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  notes?: string;
  addedAt: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  videoId: string;
  channelOrTopic: string;
  addedAt: string;
}

export interface WebAdItem {
  id: string;
  title: string;
  platform: 'Meta Ads' | 'Google Display' | 'LinkedIn' | 'WhatsApp Broadcast' | 'TikTok / Reels';
  imageUrl: string;
  targetUrl: string;
  copyText: string;
  addedAt: string;
}

export interface TieUpItem {
  id: string;
  partnerName: string;
  location: string;
  type: string;
  terms: string;
  status: 'Active' | 'Under Audit' | 'MOU Signed';
}

interface HubHODAgendaWorkspaceProps {
  departmentName: string;
  departmentTitle?: string;
  departmentTagline?: string;
  defaultAgendas?: Partial<AgendaItem>[];
  defaultTieUps?: TieUpItem[];
}

export const HubHODAgendaWorkspace: React.FC<HubHODAgendaWorkspaceProps> = ({
  departmentName,
  departmentTitle = `${departmentName} HOD Control Center`,
  departmentTagline = 'Executive Agendas, Live Voice/Text Workspace, Reference Links, YouTube Media, Web Ads & Strategic MoUs',
  defaultAgendas = [],
  defaultTieUps = [
    { id: 'tu-1', partnerName: 'European Academic Alliance & TU Munich', location: 'Munich, Germany', type: 'Academic & Exchange', terms: 'MOU for Fast-track Admissions & Credit Recognition', status: 'Active' },
    { id: 'tu-2', partnerName: 'Bosch & Siemens Dual Corporate Consortium', location: 'Stuttgart & Berlin', type: 'Corporate Placement', terms: 'Direct Interview Channels & €2,500/mo Sponsorships', status: 'MOU Signed' },
    { id: 'tu-3', partnerName: 'Telc & Goethe Certified Testing Syndicate', location: 'Frankfurt, Germany', type: 'Language & Certification', terms: 'Special Exam Centers & Expedited Results', status: 'Active' }
  ]
}) => {
  const deptKey = departmentName.toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Master HOD Sub-Navigation: 'agenda' is FIRST by requirement!
  const [hodSubNav, setHodSubNav] = useState<'agenda' | 'milestones' | 'tieups' | 'program_initiator'>('agenda');

  // ================= 1. AGENDAS & TYPING / VOICE STATE =================
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaPriority, setAgendaPriority] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [agendaTargetDate, setAgendaTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [agendaStatus, setAgendaStatus] = useState<'In Progress' | 'Completed' | 'Pending Review'>('In Progress');
  const [agendaNotes, setAgendaNotes] = useState('');
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);

  // Speech Recognition / Voice Input
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(true);
  const recognitionRef = useRef<any>(null);

  // ================= 2. SIDE PANEL RESOURCE STATE =================
  const [activeSideTab, setActiveSideTab] = useState<'links' | 'youtube' | 'ads'>('links');
  const [links, setLinks] = useState<ReferenceLinkItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>([]);
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string>('');
  const [webAds, setWebAds] = useState<WebAdItem[]>([]);

  // Modals for adding resources
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState('Guidelines');
  const [newLinkNotes, setNewLinkNotes] = useState('');

  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoChannel, setNewVideoChannel] = useState('Official ILA Briefing');

  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdPlatform, setNewAdPlatform] = useState<WebAdItem['platform']>('Meta Ads');
  const [newAdImageUrl, setNewAdImageUrl] = useState('');
  const [newAdTargetUrl, setNewAdTargetUrl] = useState('');
  const [newAdCopy, setNewAdCopy] = useState('');

  // Tie-Ups & Program Initiator state
  const [tieUps, setTieUps] = useState<TieUpItem[]>(defaultTieUps);
  const [showTieUpModal, setShowTieUpModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLocation, setNewPartnerLocation] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('Academic / Corporate Tie-Up');
  const [newPartnerTerms, setNewPartnerTerms] = useState('');

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progDuration, setProgDuration] = useState('6 Months');
  const [progCapacity, setProgCapacity] = useState('30 Seats');
  const [progNotification, setProgNotification] = useState(true);

  // Toast / Feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  };

  // Initialize data from localStorage or initial defaults
  useEffect(() => {
    // 1. Agendas
    const savedAgendas = localStorage.getItem(`ilas_hod_agendas_${deptKey}`);
    if (savedAgendas) {
      try {
        setAgendas(JSON.parse(savedAgendas));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialSeeds: AgendaItem[] = [
        {
          id: `ag-${Date.now()}-1`,
          department: departmentName,
          title: `Strategic Q3/Q4 Expansion & Academic Quality Standards for ${departmentName}`,
          targetDate: '2026-10-30',
          priority: 'Critical',
          status: 'In Progress',
          notes: `Core Focus Areas:\n1. Consolidate department candidate pipelines with 100% SLA turnaround.\n2. Verify international partner accreditations & visa compliance standards.\n3. Integrate live IntelliCoach AI telemetry with curriculum reviews.\n4. Bi-weekly review with CEO & GM on institutional tie-up conversions.`,
          actionItems: ['Review weekly CPL metrics', 'Approve certified trainer allocations', 'Finalize EU university MoU terms'],
          createdAt: '2026-09-01'
        },
        {
          id: `ag-${Date.now()}-2`,
          department: departmentName,
          title: `Cohort Digital Onboarding & Multi-Channel Marketing Campaign Kickoff`,
          targetDate: '2026-11-15',
          priority: 'High',
          status: 'In Progress',
          notes: `Deliverables:\n- Sync job descriptions and intake campaigns with Marketing Studio.\n- Deploy verified German partner creative reels and testimonial showcases.\n- Expand WhatsApp lead auto-responders for candidates.`,
          actionItems: ['Audit Meta Ads creative spend', 'Trigger CRM broadcast template'],
          createdAt: '2026-09-05'
        },
        ...defaultAgendas.map((a, i) => ({
          id: a.id || `ag-${Date.now()}-${i + 3}`,
          department: departmentName,
          title: a.title || `Operational Milestone ${i + 1}`,
          targetDate: a.targetDate || '2026-12-01',
          priority: a.priority || 'Medium',
          status: a.status || 'In Progress',
          notes: a.notes || 'Routine department operational agenda and compliance review.',
          createdAt: '2026-09-08'
        }))
      ];
      setAgendas(initialSeeds);
      localStorage.setItem(`ilas_hod_agendas_${deptKey}`, JSON.stringify(initialSeeds));
    }

    // 2. Reference Resources (Links, YouTube, Web Ads)
    const savedResources = localStorage.getItem(`ilas_hod_resources_${deptKey}`);
    if (savedResources) {
      try {
        const parsed = JSON.parse(savedResources);
        setLinks(parsed.links || []);
        setYoutubeVideos(parsed.youtubeVideos || []);
        setWebAds(parsed.webAds || []);
        if (parsed.youtubeVideos && parsed.youtubeVideos.length > 0) {
          setSelectedYoutubeId(parsed.youtubeVideos[0].videoId);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultLinks: ReferenceLinkItem[] = [
        {
          id: 'lnk-1',
          title: 'German Academic Exchange Service (DAAD) Official Portal',
          url: 'https://www.daad.de/en/',
          category: 'Compliance & Universities',
          notes: 'Official criteria for German university admissions & degree recognitions.',
          addedAt: '2026-09-10'
        },
        {
          id: 'lnk-2',
          title: 'Make it in Germany – Federal Government Skilled Immigration',
          url: 'https://www.make-it-in-germany.com/en/',
          category: 'Work & Visas',
          notes: 'Opportunity Card (Chancenkarte) & Fast-track visa rules documentation.',
          addedAt: '2026-09-11'
        },
        {
          id: 'lnk-3',
          title: 'Goethe-Institut & Telc Examination Guidelines',
          url: 'https://www.goethe.de/en/index.html',
          category: 'Language Benchmark',
          notes: 'CEFR A1–C2 testing schedules and evaluation matrices.',
          addedAt: '2026-09-12'
        }
      ];

      const defaultVideos: YouTubeVideoItem[] = [
        {
          id: 'yt-1',
          title: 'Studying & Working in Germany: Complete 2026 Official Guide',
          videoUrl: 'https://www.youtube.com/watch?v=0k2Zzkw4_8k',
          videoId: '0k2Zzkw4_8k',
          channelOrTopic: 'German Higher Education & Visas',
          addedAt: '2026-09-10'
        },
        {
          id: 'yt-2',
          title: 'Chancenkarte & Dual Vocational Ausbildung Explained',
          videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
          videoId: 'ScMzIvxBSi4',
          channelOrTopic: 'Career & Industry Placement',
          addedAt: '2026-09-12'
        }
      ];

      const defaultAds: WebAdItem[] = [
        {
          id: 'ad-1',
          title: 'Fast-Track German B1/B2 Ausbildung Onboarding 2026',
          platform: 'Meta Ads',
          imageUrl: 'https://images.unsplash.com/photo-1527891751199-722e374640d0?w=600&auto=format&fit=crop&q=80',
          targetUrl: 'https://ilas.global/work-while-you-study',
          copyText: 'Earn up to €1,200/month while learning German with ILA Academy. 100% verified hospital & corporate placement sponsorship.',
          addedAt: '2026-09-11'
        },
        {
          id: 'ad-2',
          title: 'European Master Degree & 20h/Week Student Roles',
          platform: 'Google Display',
          imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
          targetUrl: 'https://ilas.global/study-abroad',
          copyText: 'Zero Tuition Universities in Munich, Berlin & Frankfurt. Apply with direct APS assistance and fast-track German blocked accounts.',
          addedAt: '2026-09-13'
        }
      ];

      setLinks(defaultLinks);
      setYoutubeVideos(defaultVideos);
      setSelectedYoutubeId(defaultVideos[0].videoId);
      setWebAds(defaultAds);

      localStorage.setItem(`ilas_hod_resources_${deptKey}`, JSON.stringify({
        links: defaultLinks,
        youtubeVideos: defaultVideos,
        webAds: defaultAds
      }));
    }
  }, [deptKey, departmentName]);

  // Persist resources helper
  const persistResources = (newLinks: ReferenceLinkItem[], newVideos: YouTubeVideoItem[], newAds: WebAdItem[]) => {
    localStorage.setItem(`ilas_hod_resources_${deptKey}`, JSON.stringify({
      links: newLinks,
      youtubeVideos: newVideos,
      webAds: newAds
    }));
  };

  // ================= VOICE RECOGNITION IMPLEMENTATION =================
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupport(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = 'en-US';

    recognizer.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setAgendaNotes(prev => prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim());
      }
    };

    recognizer.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      setIsRecording(false);
    };

    recognizer.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognizer;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!voiceSupport || !recognitionRef.current) {
      // Fallback voice simulation
      simulateVoiceInput();
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsRecording(false);
      showToast('Voice recording paused.');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        showToast('🎙️ Microphone active: Speak to dictate agenda notes.');
      } catch (e) {
        console.warn('Recognition start failed, simulating fallback:', e);
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    const dictationPhrases = [
      "Review Q4 international intake conversion metrics and faculty allocations.",
      "Expand corporate placement tie-ups in Stuttgart & Munich for medical trainees.",
      "Verify APS clearance documentation and ensure all blocked account receipts are audited.",
      "Sync high-priority job descriptions with Marketing Studio for immediate broadcast."
    ];
    const phrase = dictationPhrases[Math.floor(Math.random() * dictationPhrases.length)];
    setIsRecording(true);
    showToast('🎙️ Voice dictation transcribing...');
    setTimeout(() => {
      setAgendaNotes(prev => prev ? `${prev}\n• ${phrase}` : `• ${phrase}`);
      setIsRecording(false);
      showToast('Transcribed speech into agenda notes.');
    }, 1200);
  };

  // ================= AGENDAS CRUD =================
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle.trim()) {
      alert('Please enter an Agenda Title.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    let updated: AgendaItem[];

    if (editingAgendaId) {
      updated = agendas.map(ag => ag.id === editingAgendaId ? {
        ...ag,
        title: agendaTitle,
        priority: agendaPriority,
        targetDate: agendaTargetDate,
        status: agendaStatus,
        notes: agendaNotes
      } : ag);
      showToast(`Updated agenda: "${agendaTitle}"`);
    } else {
      const newAg: AgendaItem = {
        id: `ag-${Date.now()}`,
        department: departmentName,
        title: agendaTitle,
        priority: agendaPriority,
        targetDate: agendaTargetDate,
        status: agendaStatus,
        notes: agendaNotes,
        createdAt: now
      };
      updated = [newAg, ...agendas];
      showToast(`Saved new HOD agenda: "${agendaTitle}"`);
    }

    setAgendas(updated);
    localStorage.setItem(`ilas_hod_agendas_${deptKey}`, JSON.stringify(updated));

    // Reset Form
    setEditingAgendaId(null);
    setAgendaTitle('');
    setAgendaNotes('');
  };

  const handleEditAgenda = (ag: AgendaItem) => {
    setEditingAgendaId(ag.id);
    setAgendaTitle(ag.title);
    setAgendaPriority(ag.priority);
    setAgendaTargetDate(ag.targetDate);
    setAgendaStatus(ag.status);
    setAgendaNotes(ag.notes || '');
    // scroll into view
    window.scrollTo({ top: 120, behavior: 'smooth' });
    showToast(`Loaded agenda "${ag.title}" into editor.`);
  };

  const handleDeleteAgenda = (id: string) => {
    if (confirm('Are you sure you want to remove this department agenda item?')) {
      const updated = agendas.filter(ag => ag.id !== id);
      setAgendas(updated);
      localStorage.setItem(`ilas_hod_agendas_${deptKey}`, JSON.stringify(updated));
      if (editingAgendaId === id) {
        setEditingAgendaId(null);
        setAgendaTitle('');
        setAgendaNotes('');
      }
      showToast('Agenda item removed.');
    }
  };

  const handleToggleAgendaStatus = (id: string) => {
    const updated = agendas.map(ag => {
      if (ag.id === id) {
        const nextStatus = ag.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...ag, status: nextStatus as any };
      }
      return ag;
    });
    setAgendas(updated);
    localStorage.setItem(`ilas_hod_agendas_${deptKey}`, JSON.stringify(updated));
    showToast('Agenda status updated.');
  };

  // ================= SIDE PANEL RESOURCE HANDLERS =================
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const item: ReferenceLinkItem = {
      id: `lnk-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: formattedUrl,
      category: newLinkCategory,
      notes: newLinkNotes.trim(),
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [item, ...links];
    setLinks(updated);
    persistResources(updated, youtubeVideos, webAds);
    setShowAddLinkModal(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkNotes('');
    showToast('Reference link saved to dock.');
  };

  const handleDeleteLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    persistResources(updated, youtubeVideos, webAds);
    showToast('Reference link removed.');
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoUrl) return;

    const vidId = extractYouTubeId(newVideoUrl);
    const item: YouTubeVideoItem = {
      id: `yt-${Date.now()}`,
      title: newVideoTitle.trim(),
      videoUrl: newVideoUrl.trim(),
      videoId: vidId || '0k2Zzkw4_8k',
      channelOrTopic: newVideoChannel.trim() || 'ILA Briefing',
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [item, ...youtubeVideos];
    setYoutubeVideos(updated);
    setSelectedYoutubeId(item.videoId);
    persistResources(links, updated, webAds);
    setShowAddVideoModal(false);
    setNewVideoTitle('');
    setNewVideoUrl('');
    showToast('YouTube briefing video added.');
  };

  const handleDeleteVideo = (id: string) => {
    const updated = youtubeVideos.filter(v => v.id !== id);
    setYoutubeVideos(updated);
    if (updated.length > 0) {
      setSelectedYoutubeId(updated[0].videoId);
    } else {
      setSelectedYoutubeId('');
    }
    persistResources(links, updated, webAds);
    showToast('YouTube video removed.');
  };

  const handleAddWebAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle) return;

    const item: WebAdItem = {
      id: `ad-${Date.now()}`,
      title: newAdTitle.trim(),
      platform: newAdPlatform,
      imageUrl: newAdImageUrl.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      targetUrl: newAdTargetUrl.trim() || 'https://ilas.global',
      copyText: newAdCopy.trim() || 'Global education, career pathways & verified EU placements.',
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [item, ...webAds];
    setWebAds(updated);
    persistResources(links, youtubeVideos, updated);
    setShowAddAdModal(false);
    setNewAdTitle('');
    setNewAdImageUrl('');
    setNewAdTargetUrl('');
    setNewAdCopy('');
    showToast('Web ad creative saved.');
  };

  const handleDeleteWebAd = (id: string) => {
    const updated = webAds.filter(a => a.id !== id);
    setWebAds(updated);
    persistResources(links, youtubeVideos, updated);
    showToast('Web ad creative removed.');
  };

  // Program and Tie-up submissions
  const handleAddTieUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName) return;
    const newTu: TieUpItem = {
      id: 'tu-' + Date.now(),
      partnerName: newPartnerName,
      location: newPartnerLocation || 'Frankfurt, Germany',
      type: newPartnerType,
      terms: newPartnerTerms || 'Direct institutional MoU signed for candidate induction',
      status: 'MOU Signed'
    };
    setTieUps([newTu, ...tieUps]);
    setShowTieUpModal(false);
    setNewPartnerName('');
    showToast('New Institutional / Corporate Tie-up established.');
  };

  const handleInitiateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle) return;
    setShowProgramModal(false);
    showToast(`Program "${progTitle}" initiated! Synced across Portal & Marketing Studio.`);
    setProgTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. MASTER HOD HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Primary Master Menu • HOD DB
            </span>
            <span className="text-xs text-slate-300 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Department: {departmentName}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {departmentTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
            {departmentTagline}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setShowProgramModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" /> Initiate Program
          </button>
          <button
            onClick={() => setShowTieUpModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-300" /> + Establish Tie-up
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION UNDER HOD DB: "Agenda" IS ALWAYS FIRST */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setHodSubNav('agenda')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hodSubNav === 'agenda'
              ? 'bg-slate-900 text-white shadow-md ring-2 ring-brand-400/30'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Agenda (Typing &amp; Voice Workspace)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-black">
            {agendas.length} Active
          </span>
        </button>

        <button
          onClick={() => setHodSubNav('milestones')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hodSubNav === 'milestones'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Executive Goals &amp; Milestones</span>
        </button>

        <button
          onClick={() => setHodSubNav('tieups')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hodSubNav === 'tieups'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Strategic Partnerships &amp; MoUs</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 font-bold">
            {tieUps.length}
          </span>
        </button>

        <button
          onClick={() => setHodSubNav('program_initiator')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hodSubNav === 'program_initiator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Program Initiator</span>
        </button>
      </div>

      {/* ================= 3. SUB-VIEW 1: AGENDA WORKSPACE (TYPING + VOICE + SIDE PANEL) ================= */}
      {hodSubNav === 'agenda' && (
        <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* LEFT 7 COLS: TYPING & VOICE AGENDA WORKSPACE */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-black uppercase rounded-full">
                      HOD Workstation
                    </span>
                    {editingAgendaId && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                        Editing Active Agenda
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {editingAgendaId ? 'Edit Department Agenda' : 'Compose Department Agenda & Action Notes'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Type strategic directives or click the microphone for live voice-to-text dictation.
                  </p>
                </div>

                {/* Voice Input Toggle Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      isRecording
                        ? 'bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                    title={isRecording ? 'Click to stop dictation' : 'Click to start voice dictation'}
                  >
                    {isRecording ? (
                      <>
                        <Mic className="w-4 h-4 text-white animate-bounce" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-brand-600" />
                        <span>Voice Dictation</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={simulateVoiceInput}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 text-xs transition-colors"
                    title="Simulate Voice Dictation Sample"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              </div>

              {/* Form Workspace */}
              <form onSubmit={handleSaveAgenda} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Agenda Title / Core Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={agendaTitle}
                    onChange={(e) => setAgendaTitle(e.target.value)}
                    placeholder="e.g. Q4 Institutional Intake Scale-Up & Faculty Accreditation Audit"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={agendaPriority}
                      onChange={(e) => setAgendaPriority(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Critical">🔴 Critical Priority</option>
                      <option value="High">🟡 High Priority</option>
                      <option value="Medium">🔵 Medium Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Target Execution Date
                    </label>
                    <input
                      type="date"
                      value={agendaTargetDate}
                      onChange={(e) => setAgendaTargetDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Workflow Status
                    </label>
                    <select
                      value={agendaStatus}
                      onChange={(e) => setAgendaStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending Review">Pending Review</option>
                    </select>
                  </div>
                </div>

                {/* Notes & Dictation Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                      Agenda Directives, Meeting Notes &amp; Voice Transcription
                    </label>
                    {isRecording && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        Transcribing Voice into Notes...
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={agendaNotes}
                    onChange={(e) => setAgendaNotes(e.target.value)}
                    placeholder="Type or dictate agenda notes, meeting minutes, resource requirements, key milestones, and delegated department action items..."
                    className="w-full p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium"
                  />
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(agendaNotes);
                        showToast('Notes copied to clipboard.');
                      }}
                      disabled={!agendaNotes}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgendaNotes('')}
                      disabled={!agendaNotes}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Clear
                    </button>
                    {editingAgendaId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAgendaId(null);
                          setAgendaTitle('');
                          setAgendaNotes('');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{editingAgendaId ? 'Update Department Agenda' : 'Save Department Agenda'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SAVED AGENDAS INVENTORY */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    Department Agendas Roster ({agendas.length})
                  </h4>
                  <p className="text-xs text-slate-500">Tracked execution goals and executive decisions for {departmentName}.</p>
                </div>
              </div>

              {agendas.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No agendas logged yet. Use the workspace above to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {agendas.map((ag) => (
                    <div
                      key={ag.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        ag.status === 'Completed'
                          ? 'bg-slate-50/80 border-slate-200 opacity-80'
                          : 'bg-white border-slate-200/90 hover:border-brand-500 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              ag.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              ag.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {ag.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ag.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {ag.status}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> Target: {ag.targetDate}
                            </span>
                          </div>
                          <h5 className="font-black text-slate-900 text-sm leading-snug">{ag.title}</h5>
                          {ag.notes && (
                            <p className="text-xs text-slate-600 line-clamp-2 font-medium pt-1">
                              {ag.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleAgendaStatus(ag.id)}
                            className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                              ag.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                            title={ag.status === 'Completed' ? 'Mark as In Progress' : 'Mark as Completed'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditAgenda(ag)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                            title="Edit Agenda"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAgenda(ag.id)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs transition-colors"
                            title="Delete Agenda"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 5 COLS: SIDE PANEL (REFERENCE LINKS, YOUTUBE VIDEOS, WEB ADS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full">
                    Side Media Dock
                  </span>
                  <h4 className="font-black text-slate-900 text-base mt-1">
                    Department References &amp; Media
                  </h4>
                  <p className="text-xs text-slate-500">
                    Save external documents, embedded YouTube clips, and web advertisements.
                  </p>
                </div>
              </div>

              {/* Side Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveSideTab('links')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSideTab === 'links'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Links ({links.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('youtube')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSideTab === 'youtube'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5 text-rose-600" />
                  <span>Videos ({youtubeVideos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('ads')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSideTab === 'ads'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ads ({webAds.length})</span>
                </button>
              </div>

              {/* SIDE TAB 1: REFERENCE LINKS */}
              {activeSideTab === 'links' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Saved Documentation Links</span>
                    <button
                      type="button"
                      onClick={() => setShowAddLinkModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Link
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {links.map((link) => (
                      <div key={link.id} className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 space-y-1.5 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100/80 text-blue-800 px-2 py-0.5 rounded">
                              {link.category}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs mt-1 leading-snug">{link.title}</h5>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-blue-600 border border-slate-200 transition-colors"
                              title="Open External URL"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                              title="Remove Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {link.notes && (
                          <p className="text-[11px] text-slate-500 font-medium">{link.notes}</p>
                        )}
                        <div className="text-[10px] text-slate-400 truncate font-mono">
                          {link.url}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SIDE TAB 2: YOUTUBE VIDEOS */}
              {activeSideTab === 'youtube' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Embedded Video Briefings</span>
                    <button
                      type="button"
                      onClick={() => setShowAddVideoModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Video
                    </button>
                  </div>

                  {/* Responsive Player */}
                  {selectedYoutubeId ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedYoutubeId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Youtube className="w-3.5 h-3.5 text-rose-600" />
                        <span>Now Playing: {youtubeVideos.find(v => v.videoId === selectedYoutubeId)?.title || 'Selected Video'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No video selected or added yet.
                    </div>
                  )}

                  {/* Playlist selector */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {youtubeVideos.map((vid) => {
                      const isPlaying = selectedYoutubeId === vid.videoId;
                      return (
                        <div
                          key={vid.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-400'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                          }`}
                          onClick={() => setSelectedYoutubeId(vid.videoId)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Play className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">{vid.title}</div>
                              <div className="text-[10px] text-slate-500">{vid.channelOrTopic}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVideo(vid.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Remove Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SIDE TAB 3: WEB ADVERTISEMENTS */}
              {activeSideTab === 'ads' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Saved Ad Creatives</span>
                    <button
                      type="button"
                      onClick={() => setShowAddAdModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Creative
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {webAds.map((ad) => (
                      <div key={ad.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs group">
                        {ad.imageUrl && (
                          <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/80 text-white backdrop-blur-md">
                              {ad.platform}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteWebAd(ad.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-rose-600 transition-colors"
                              title="Delete Ad"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="p-3.5 space-y-2">
                          <h5 className="font-bold text-slate-900 text-xs leading-snug">{ad.title}</h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-2">
                            {ad.copyText}
                          </p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <a
                              href={ad.targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-brand-700 hover:underline flex items-center gap-1"
                            >
                              <span>Destination Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${ad.title}\n\n${ad.copyText}\n\nLink: ${ad.targetUrl}`);
                                showToast('Ad copy & link copied.');
                              }}
                              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" /> Copy Copywriting
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ================= 4. SUB-VIEW 2: EXECUTIVE GOALS & MILESTONES ================= */}
      {hodSubNav === 'milestones' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Department Agendas</span>
              <div className="text-2xl font-black text-slate-900">{agendas.length} Goals</div>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {agendas.filter(a => a.status === 'Completed').length} Completed
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MoUs &amp; Strategic Tie-Ups</span>
              <div className="text-2xl font-black text-indigo-600">{tieUps.length} Institutional MoUs</div>
              <p className="text-xs text-slate-500">Verified German &amp; EU Network</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reference Assets Docked</span>
              <div className="text-2xl font-black text-amber-600">{links.length + youtubeVideos.length + webAds.length} Items</div>
              <p className="text-xs text-slate-500">Links, YouTube &amp; Ad Creatives</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Placement / Conversion Target</span>
              <div className="text-2xl font-black text-emerald-600">92.6%</div>
              <p className="text-xs text-slate-500">Fast-track onboarding verified</p>
            </div>
          </div>

          {/* Agendas Detailed Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm">Strategic Milestones &amp; Quarterly Roadmaps</h3>
              <button
                onClick={() => setHodSubNav('agenda')}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Compose New Agenda
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b">
                  <tr>
                    <th className="p-3">Agenda &amp; Execution Goal</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {agendas.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50/60">
                      <td className="p-3 max-w-md">
                        <div className="font-bold text-slate-900">{ag.title}</div>
                        {ag.notes && <div className="text-[11px] text-slate-500 line-clamp-1">{ag.notes}</div>}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          ag.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          ag.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ag.priority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-semibold">{ag.targetDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ag.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {ag.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            handleEditAgenda(ag);
                            setHodSubNav('agenda');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. SUB-VIEW 3: STRATEGIC PARTNERSHIPS & MOUS ================= */}
      {hodSubNav === 'tieups' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" /> Strategic Partnerships &amp; Institutional MoUs
                </h3>
                <p className="text-xs text-slate-500">Active university, employer, and European testing syndicate contracts for {departmentName}.</p>
              </div>
              <button
                onClick={() => setShowTieUpModal(true)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> + Establish New Tie-Up
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tieUps.map((tu) => (
                <div key={tu.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-brand-400 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{tu.partnerName}</h4>
                      <p className="text-xs text-slate-500">{tu.location} • <span className="font-semibold text-brand-700">{tu.type}</span></p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 shrink-0">
                      {tu.status}
                    </span>
                  </div>
                  <div className="text-xs bg-white p-3 rounded-xl border border-slate-200/80 text-slate-700 font-medium">
                    {tu.terms}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. SUB-VIEW 4: PROGRAM INITIATOR ================= */}
      {hodSubNav === 'program_initiator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="border-b pb-4">
              <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                HOD Curriculum &amp; Cohort Studio
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Initiate New Department Program</h3>
              <p className="text-xs text-slate-500">Configure new curriculum, corporate pilot, or cohort for {departmentName}.</p>
            </div>

            <form onSubmit={handleInitiateProgram} className="space-y-4 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Program / Cohort Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German Fast-Track C1 or European Healthcare Onboarding"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full p-3 border rounded-xl outline-none focus:border-brand-600 font-bold bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    className="w-full p-3 border rounded-xl outline-none font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Cohort Capacity</label>
                  <input
                    type="text"
                    value={progCapacity}
                    onChange={(e) => setProgCapacity(e.target.value)}
                    className="w-full p-3 border rounded-xl outline-none font-bold bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-medium">
                <input
                  type="checkbox"
                  id="progNotifDirect"
                  checked={progNotification}
                  onChange={(e) => setProgNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                />
                <label htmlFor="progNotifDirect" className="cursor-pointer">
                  Auto-sync with Marketing Studio &amp; Social Media Promo channels
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Program 🚀</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      
      {/* 1. Add Reference Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-blue-600" /> Save Reference Link
              </h4>
              <button onClick={() => setShowAddLinkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddLink} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DAAD University Requirements 2026"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/guidelines"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Compliance / University / Visa / Course Notes"
                  value={newLinkCategory}
                  onChange={(e) => setNewLinkCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brief Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Why is this reference needed?"
                  value={newLinkNotes}
                  onChange={(e) => setNewLinkNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-medium bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLinkModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-xs"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add YouTube Video Modal */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-rose-600" /> Add YouTube Briefing
              </h4>
              <button onClick={() => setShowAddVideoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass on German Opportunity Card"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">YouTube URL or Video ID *</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or ID"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Channel / Topic Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Official ILA Briefing or German Visa Syndicate"
                  value={newVideoChannel}
                  onChange={(e) => setNewVideoChannel(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-xs"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Web Advertisement Modal */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Image className="w-4 h-4 text-emerald-600" /> Save Web Advertisement / Creative
              </h4>
              <button onClick={() => setShowAddAdModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddWebAd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ad Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn 2026 German Nursing Pathway"
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Platform Tag</label>
                <select
                  value={newAdPlatform}
                  onChange={(e) => setNewAdPlatform(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                >
                  <option value="Meta Ads">Meta Ads (Instagram &amp; Facebook)</option>
                  <option value="Google Display">Google Display Network</option>
                  <option value="LinkedIn">LinkedIn Sponsored</option>
                  <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                  <option value="TikTok / Reels">TikTok / Reels</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Creative Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or media path"
                  value={newAdImageUrl}
                  onChange={(e) => setNewAdImageUrl(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Landing Page URL</label>
                <input
                  type="text"
                  placeholder="https://ilas.global/work-while-you-study"
                  value={newAdTargetUrl}
                  onChange={(e) => setNewAdTargetUrl(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ad Copy / Caption Text</label>
                <textarea
                  rows={2}
                  placeholder="Direct marketing copy or promotional messaging..."
                  value={newAdCopy}
                  onChange={(e) => setNewAdCopy(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-medium bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddAdModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-xs"
                >
                  Save Creative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Tie-up Modal */}
      {showTieUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Establish Institutional / Corporate Tie-Up</h3>
            <form onSubmit={handleAddTieUp} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Partner Institution / Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charité Universitätsmedizin Berlin"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Berlin, Germany"
                  value={newPartnerLocation}
                  onChange={(e) => setNewPartnerLocation(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">MoU Terms &amp; Scope</label>
                <textarea
                  rows={2}
                  placeholder="Direct interview channels, candidate sponsorship..."
                  value={newPartnerTerms}
                  onChange={(e) => setNewPartnerTerms(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowTieUpModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl"
                >
                  Save MoU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Program Wizard Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                HOD Course / Program Initiator
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Initiate New Department Program</h3>
              <p className="text-xs text-slate-500">Configure new curriculum, corporate pilot, or cohort for {departmentName}.</p>
            </div>

            <form onSubmit={handleInitiateProgram} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Program / Cohort Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German C1 Professional or Cloud Engineering FastTrack"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-brand-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cohort Capacity</label>
                  <input
                    type="text"
                    value={progCapacity}
                    onChange={(e) => setProgCapacity(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-medium">
                <input
                  type="checkbox"
                  id="progNotifDirect2"
                  checked={progNotification}
                  onChange={(e) => setProgNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                />
                <label htmlFor="progNotifDirect2" className="cursor-pointer">
                  Auto-sync with Marketing Studio &amp; Social Media Promo channels
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Launch Program 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HubHODAgendaWorkspace;
