import React, { useState, useEffect } from 'react';
import {
    FileText, ShieldCheck, Clock, CheckCircle2, AlertTriangle,
    Search, Filter, Plus, Calendar, Building, Globe,
    Send, Award, Radio, Megaphone, Users, ArrowRight,
    ExternalLink, Check, X, RefreshCw, Landmark, BookCheck, ShieldAlert
} from 'lucide-react';
import { Inquiry, getInquiries, updateInquiryVisaStage } from '../../lib/db';
import { HubSubNavBar, HubNavItem } from './common/HubSubNavBar';
import { HubHODView } from './common/HubHODView';
import { HubAutoTriggerView } from './common/HubAutoTriggerView';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';
import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

interface ConsulateSlot {
    id: string;
    city: string;
    consulate: string;
    nextSlotDate: string;
    waitlistDays: number;
    availableSlots: number;
    category: 'National Visa (16b)' | 'Opportunity Card (Chancenkarte)' | 'Job Seeker / Blue Card';
    status: 'Open' | 'Fast Filling' | 'Waitlist Only';
}

const DEFAULT_SLOTS: ConsulateSlot[] = [
    { id: 'cs-1', city: 'Mumbai', consulate: 'German Consulate General Mumbai (VFS BKC)', nextSlotDate: '2026-10-12', waitlistDays: 18, availableSlots: 14, category: 'National Visa (16b)', status: 'Fast Filling' },
    { id: 'cs-2', city: 'Bengaluru', consulate: 'German Consulate General Bengaluru (VFS Gopalan)', nextSlotDate: '2026-10-04', waitlistDays: 12, availableSlots: 26, category: 'National Visa (16b)', status: 'Open' },
    { id: 'cs-3', city: 'New Delhi', consulate: 'Embassy of the Federal Republic of Germany (VFS Shivaji)', nextSlotDate: '2026-10-22', waitlistDays: 28, availableSlots: 6, category: 'National Visa (16b)', status: 'Waitlist Only' },
    { id: 'cs-4', city: 'Chennai', consulate: 'German Consulate General Chennai', nextSlotDate: '2026-10-08', waitlistDays: 15, availableSlots: 19, category: 'Opportunity Card (Chancenkarte)', status: 'Open' },
    { id: 'cs-5', city: 'Frankfurt / BLS', consulate: 'European Ausländerbehörde Central Dispatch', nextSlotDate: '2026-09-28', waitlistDays: 7, availableSlots: 32, category: 'Job Seeker / Blue Card', status: 'Open' }
];

const IMMIGRATION_CHECKLISTS = [
    { id: 'chk-1', title: 'APS Certificate (Akademische Prüfstelle)', requirement: 'Mandatory verification certificate of Indian academic degrees from German Academic Evaluation Centre.', timeline: '3-5 Weeks', authority: 'German Embassy New Delhi', status: 'Strictly Enforced' },
    { id: 'chk-2', title: 'Blocked Account (€11,900 / yr Deposit)', requirement: 'Proof of minimum €992 / month living expenses deposited into Fintiba, Coracle, or Expatrio escrow account.', timeline: '2-4 Days', authority: 'Federal Foreign Office', status: 'Required' },
    { id: 'chk-3', title: 'Statutory Health Insurance (TK / Barmer)', requirement: 'German public health insurance certificate or eligible incoming private cover (Feather / Mawista).', timeline: 'Instant', authority: 'German Krankenkasse', status: 'Required' },
    { id: 'chk-4', title: 'Biometric Passport & Photos (35x45mm)', requirement: 'Valid for at least 12 months beyond intended stay with min 2 blank pages. ICAO compliant photos.', timeline: 'Immediate', authority: 'VFS Global Center', status: 'Required' },
    { id: 'chk-5', title: 'University Offer Letter / Zulassungsbescheid', requirement: 'Official admission notice or unconditional study acceptance confirmation from German University.', timeline: 'Conditional', authority: 'German Academic Senate', status: 'Required' },
    { id: 'chk-6', title: 'Letter of Motivation & Curriculum Vitae (Europass)', requirement: 'Chronological CV and convincing motivation statement outlining career objectives and return intention.', timeline: 'Ready', authority: 'Consular Visa Officer', status: 'Evaluated' }
];

export const VisaServiceHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        'pipeline' | 'slots' | 'checklists' | 'hod' | 'auto_trigger' | 'social_promo' | 'intake_tracking' | 'approvals'
    >('pipeline');

    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
    const [feedback, setFeedback] = useState<string | null>(null);

    // Slots state
    const [slots, setSlots] = useState<ConsulateSlot[]>(DEFAULT_SLOTS);
    const [slotCategoryFilter, setSlotCategoryFilter] = useState<string>('All');

    const loadInquiries = () => {
        const all = getInquiries();
        setInquiries(all);
    };

    useEffect(() => {
        loadInquiries();
        const handleDbChange = () => loadInquiries();
        window.addEventListener('ilas-db-changed', handleDbChange);
        return () => window.removeEventListener('ilas-db-changed', handleDbChange);
    }, []);

    const handleStageChange = (inquiryId: string, newStage: Inquiry['visaProcessingStage']) => {
        if (!newStage) return;
        const updated = updateInquiryVisaStage(inquiryId, newStage);
        setInquiries(updated);
        setFeedback(`✅ Candidate visa stage successfully updated to "${newStage}"`);
        setTimeout(() => setFeedback(null), 3500);
    };

    // Filter visa inquiries
    const visaInquiries = inquiries.filter(inq => {
        const isVisaOrAbroad = inq.category === 'Visa' || inq.category === 'Study Abroad' || inq.visaProcessingStage;
        const matchesSearch = (inq.name && inq.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inq.email && inq.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inq.phone && inq.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inq.path && inq.path.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStage = selectedStageFilter === 'All' || inq.visaProcessingStage === selectedStageFilter;
        return isVisaOrAbroad && matchesSearch && matchesStage;
    });

    const filteredSlots = slots.filter(s => slotCategoryFilter === 'All' || s.category === slotCategoryFilter);

    const navItems: HubNavItem[] = [
        { id: 'pipeline', label: 'Candidate Pipeline & APS', icon: ShieldCheck, badge: visaInquiries.length },
        { id: 'slots', label: 'Consulate Slots & VFS', icon: Calendar, badge: slots.length },
        { id: 'checklists', label: 'Immigration Checklists', icon: BookCheck, badge: IMMIGRATION_CHECKLISTS.length },
        { id: 'hod', label: 'HOD Visa Console', icon: Award },
        { id: 'auto_trigger', label: 'Comm Triggers', icon: Radio },
        { id: 'social_promo', label: 'Social Promo', icon: Megaphone },
        { id: 'intake_tracking', label: 'Intake Desk', icon: Users },
        { id: 'approvals', label: 'Compliance & Approvals', icon: FileText }
    ];

    return (
        <div className="flex flex-col w-full h-full min-h-[calc(100vh-12rem)] bg-slate-50 relative rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

            {/* Feedback Toast */}
            {feedback && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{feedback}</span>
                </div>
            )}

            {/* 1. SUB-NAVBAR: FULLY RESPONSIVE, SCROLLABLE & WRAP-ENABLED */}
            <HubSubNavBar
                items={navItems}
                activeTab={activeTab}
                onTabChange={(id:any) => setActiveTab(id as any)}
                activeColorClass="bg-emerald-600"
            />

            {/* Dynamic Content Area */}
            <div className="flex-1 w-full bg-slate-50 overflow-y-auto no-scrollbar relative p-4 md:p-6 space-y-6">

                {/* EXECUTIVE HEADER BANNER */}
                <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/60 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                                    <Landmark className="w-3.5 h-3.5" />
                                    Immigration &amp; Embassy Bureau
                                </span>
                                <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                                    National Student Visa (16b) • APS Certificate • Blocked Account €11,900
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                Visa and Service Hub &amp; Legal Compliance
                            </h1>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                Coordinate VFS appointment queues, monitor APS academic verification, track €11,900 blocked account proofs, and execute end-to-end legal compliance for European work and study migration.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <button
                                onClick={() => setActiveTab('slots')}
                                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                                <Calendar className="w-4 h-4" /> Check VFS Slots
                            </button>
                            <button
                                onClick={() => setActiveTab('checklists')}
                                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
                            >
                                <BookCheck className="w-4 h-4 text-emerald-300" /> Immigration Rules
                            </button>
                        </div>
                    </div>
                </div>

                {/* SUB-TAB 1: CANDIDATE PIPELINE & APS */}
                {activeTab === 'pipeline' && (
                    <div className="space-y-5 animate-in fade-in">
                        {/* Filter Bar */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                                <span className="text-xs font-black text-slate-400 uppercase mr-1">Stage:</span>
                                {[
                                    'All',
                                    'Profile Assessment',
                                    'APS Certificate',
                                    'Blocked Account',
                                    'Embassy Appointment',
                                    'Visa Approved'
                                ].map(stg => (
                                    <button
                                        key={stg}
                                        onClick={() => setSelectedStageFilter(stg)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedStageFilter === stg
                                                ? 'bg-slate-900 text-white shadow-xs font-black'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {stg}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search candidate name, phone, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* Candidate Table */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                            <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Active Immigration &amp; Visa Cases</h3>
                                    <p className="text-xs text-slate-500">Track candidates progressing through APS verification, blocked deposits, and consular biometrics.</p>
                                </div>
                                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                    {visaInquiries.length} Active Candidates
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-black border-b border-slate-100">
                                        <tr>
                                            <th className="py-3.5 px-4">Candidate</th>
                                            <th className="py-3.5 px-4">Contact</th>
                                            <th className="py-3.5 px-4">Target Country</th>
                                            <th className="py-3.5 px-4">Current Stage</th>
                                            <th className="py-3.5 px-4">Advance Stage Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                        {visaInquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                                    No candidate records found matching current criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            visaInquiries.map(cand => {
                                                const currentStage = cand.visaProcessingStage || 'Profile Assessment';
                                                return (
                                                    <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-bold text-slate-900">{cand.name}</div>
                                                            <div className="text-[11px] text-slate-400">Token: {cand.tokenNumber || cand.id.slice(0, 8)}</div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="text-slate-800">{cand.phone}</div>
                                                            <div className="text-[11px] text-slate-500">{cand.email}</div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                                                                <Globe className="w-3 h-3 text-emerald-600" />
                                                                {cand.path || cand.course || 'Germany (EU)'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${currentStage === 'Visa Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                                    currentStage === 'Embassy Appointment' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                                                        currentStage === 'Blocked Account' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                                            currentStage === 'APS Certificate' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                                'bg-slate-100 text-slate-700 border border-slate-200'
                                                                }`}>
                                                                <ShieldCheck className="w-3 h-3" />
                                                                {currentStage}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <select
                                                                value={currentStage}
                                                                onChange={(e) => handleStageChange(cand.id, e.target.value as any)}
                                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-xs"
                                                            >
                                                                <option value="Profile Assessment">1. Profile Assessment</option>
                                                                <option value="APS Certificate">2. APS Certificate</option>
                                                                <option value="Blocked Account">3. Blocked Account (€11.9k)</option>
                                                                <option value="Embassy Appointment">4. Embassy Appointment (VFS)</option>
                                                                <option value="Visa Approved">5. Visa Approved 🎉</option>
                                                                <option value="Visa Rejected">6. Visa Rejected</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUB-TAB 2: CONSULATE SLOTS & VFS */}
                {activeTab === 'slots' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                            <div>
                                <h3 className="text-base font-black text-slate-900">German Consular Slot Availability Queue</h3>
                                <p className="text-xs text-slate-500">Live monitoring of VFS Global appointment availability across diplomatic missions in India.</p>
                            </div>
                            <div className="flex gap-2">
                                {['All', 'National Visa (16b)', 'Opportunity Card (Chancenkarte)', 'Job Seeker / Blue Card'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSlotCategoryFilter(c)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${slotCategoryFilter === c ? 'bg-slate-900 text-white font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSlots.map(slot => (
                                <div key={slot.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                                            {slot.city} Mission
                                        </span>
                                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${slot.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                                                slot.status === 'Fast Filling' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-rose-100 text-rose-800'
                                            }`}>
                                            {slot.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm leading-snug">{slot.consulate}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{slot.category}</p>
                                    </div>

                                    <div className="bg-slate-50 p-3 rounded-2xl grid grid-cols-2 gap-2 text-xs border border-slate-100">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Next Open Slot</span>
                                            <span className="font-black text-slate-900 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                {slot.nextSlotDate}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Available Slots</span>
                                            <span className="font-black text-emerald-600 mt-0.5 block">
                                                {slot.availableSlots} Seats Free
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                                        Book Candidate Appointment <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUB-TAB 3: IMMIGRATION CHECKLISTS */}
                {activeTab === 'checklists' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Statutory Immigration Requirements &amp; Checklists</h3>
                                <p className="text-xs text-slate-500">Official German consulate document standards for 2026/2027 academic and skilled worker intakes.</p>
                            </div>
                            <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                Foreigners Authority Compliant
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {IMMIGRATION_CHECKLISTS.map(chk => (
                                <div key={chk.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                            {chk.status}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            {chk.timeline}
                                        </span>
                                    </div>

                                    <h4 className="font-black text-slate-900 text-sm">{chk.title}</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{chk.requirement}</p>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold">Verifying Agency:</span>
                                        <span className="font-black text-slate-800">{chk.authority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUB-TAB 4: HOD CONSOLE */}
                {activeTab === 'hod' && (
                    <div className="animate-in fade-in">
                        <HubHODView
                            departmentName="Visa and Service"
                            departmentTagline="Embassy Accreditations, Legal Compliance Audits, VFS Queue Strategy & Blocked Account Alliances"
                            defaultAgendas={[
                                { id: 'vag-1', title: 'Streamline 2026 Winter Cohort APS Clearance SLAs to under 21 days', targetDate: '2026-10-15', priority: 'Critical', status: 'In Progress' },
                                { id: 'vag-2', title: 'Direct Bank Consortium MOU for Instant Blocked Account Setup (€11,900)', targetDate: '2026-11-01', priority: 'High', status: 'In Progress' },
                                { id: 'vag-3', title: 'Annual Diplomatic Mission Audit & VFS Fast-Track Desk Allocation', targetDate: '2026-11-20', priority: 'Medium', status: 'Pending Review' }
                            ]}
                            defaultTieUps={[
                                { id: 'vtu-1', partnerName: 'German Federal Foreign Office / APS Bureau', location: 'New Delhi & Berlin', type: 'Academic Document Verification', terms: 'Certified Fast-Track Verification Channel', status: 'Active' },
                                { id: 'vtu-2', partnerName: 'Fintiba & Coracle Escrow Consortium', location: 'Frankfurt, Germany', type: 'Blocked Account Escrow', terms: 'Preferred Student Onboarding & Fee Waiver', status: 'MOU Signed' },
                                { id: 'vtu-3', partnerName: 'Techniker Krankenkasse (TK) Syndicate', location: 'Hamburg, Germany', type: 'Statutory Health Insurance', terms: 'Direct Online Certificate Dispatch to Embassy', status: 'Active' }
                            ]}
                        />
                    </div>
                )}

                {/* SUB-TAB 5: COMM TRIGGERS */}
                {activeTab === 'auto_trigger' && (
                    <div className="animate-in fade-in">
                        <HubAutoTriggerView
                            departmentName="Visa"
                            defaultEventTypes={[
                                { key: 'document_pending', label: 'Missing APS Certificate / Blocked Proof' },
                                { key: 'incomplete_enrollment', label: 'Consulate Appointment Form Incomplete' },
                                { key: 'pending_payment', label: 'Pending Blocked Account €11,900 Transfer' },
                                { key: 'profile_dropoff', label: 'VFS Biometrics Slot Idle' }
                            ]}
                        />
                    </div>
                )}

                {/* SUB-TAB 6: SOCIAL PROMO */}
                {activeTab === 'social_promo' && (
                    <div className="animate-in fade-in">
                        <HubSocialPromoView departmentName="Visa" />
                    </div>
                )}

                {/* SUB-TAB 7: INTAKE TRACKING DESK */}
                {activeTab === 'intake_tracking' && (
                    <div className="animate-in fade-in">
                        <HubIntakeTrackingView
                            departmentName="Visa"
                            departmentTitle="Visa and Service Hub / Embassy Candidate Pipeline Desk"
                        />
                    </div>
                )}

                {/* SUB-TAB 8: APPROVALS & AUDIT */}
                {activeTab === 'approvals' && (
                    <div className="space-y-6 animate-in fade-in">
                        <DepartmentApprovalsTab departmentName="Visa and Service Hub" />
                        <DepartmentUpdatesTab departmentName="Visa and Service Hub" />
                    </div>
                )}

            </div>
        </div>
    );
};

export default VisaServiceHub;
