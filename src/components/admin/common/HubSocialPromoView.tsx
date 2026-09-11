import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Send, Share2, Sparkles, CheckCircle2, 
  Globe2, Eye, RefreshCw, BarChart2, TrendingUp, 
  Smartphone, Plus, Check, MessageSquare
} from 'lucide-react';
import { 
  SocialMediaPromoPostItem, 
  getSocialMediaPromos, 
  saveSocialMediaPromo, 
  broadcastSocialMediaPromo 
} from '../../../lib/db';

interface HubSocialPromoViewProps {
  departmentName: string;
  defaultCampaignTypes?: string[];
}

export const HubSocialPromoView: React.FC<HubSocialPromoViewProps> = ({
  departmentName,
  defaultCampaignTypes = [
    'Direct Course / Intake Enrollment',
    'Special Discount / Fee Waiver',
    'Corporate Hiring & Placement Drive',
    'Free Webinar & Live Info Session'
  ]
}) => {
  const [promos, setPromos] = useState<SocialMediaPromoPostItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Promo Form
  const [promoTitle, setPromoTitle] = useState('');
  const [promoContent, setPromoContent] = useState('');
  const [promoChannels, setPromoChannels] = useState<SocialMediaPromoPostItem['channels']>([
    'Meta Ads', 'LinkedIn', 'Instagram', 'WhatsApp Broadcast'
  ]);
  const [promoTargetAudience, setPromoTargetAudience] = useState('All Qualified Aspirants in India & Europe');
  const [promoScheduledDate, setPromoScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  // Broadcasting State
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [broadcastResult, setBroadcastResult] = useState<SocialMediaPromoPostItem | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadPromos = () => {
    setPromos(getSocialMediaPromos(departmentName));
  };

  useEffect(() => {
    loadPromos();
    const handleUpdate = () => loadPromos();
    window.addEventListener('ilas-social-promos-changed', handleUpdate);
    return () => window.removeEventListener('ilas-social-promos-changed', handleUpdate);
  }, [departmentName]);

  const toggleChannel = (ch: any) => {
    if (promoChannels.includes(ch)) {
      setPromoChannels(promoChannels.filter(c => c !== ch));
    } else {
      setPromoChannels([...promoChannels, ch]);
    }
  };

  const handleGenerateAICopy = () => {
    const templates: Record<string, string> = {
      'Education': `🚀 Boost your global career with ILA certified German language & tech tracks! Get 24/7 AI tutor support, Goethe exam preparation, and guaranteed interview connections. Enroll today! #LearnGerman #TechCareers2026 #GlobalEducation`,
      'Work While You Study': `💼 Earn ₹15,000 to ₹25,000 monthly stipend while gaining hands-on corporate experience! 6 Months initial training + 1-year verified corporate certificate with permanent transition opportunities. #WorkAndStudy #Internship #CareerGrowth`,
      'Study Abroad': `🎓 Study in Germany for €0 tuition! Apply for top public university Master & Bachelor programs. End-to-end APS clearance, blocked account setup, and 18-month post-study visa assistance. #StudyInGermany #FreeEducation #Europe2026`,
      'Jobs': `⚡ Hiring for top European employers in Germany & Netherlands! Direct openings for DevOps Engineers, Nurses, and Embedded Developers with full Blue Card sponsorship. Send your CV today! #GermanyJobs #BlueCard #WorkInEurope`,
      'Rewards': `🎁 Earn direct cash payouts for every successful candidate referral! Join the ILA Partner & Consultant Network and unlock milestone rewards up to ₹50,000. Start referring now! #Affiliate #ReferralRewards #PartnerNetwork`
    };

    const copy = templates[departmentName] || `📢 Exciting opportunities in ${departmentName} at ILA! Direct global pathways and certified mentorship. Apply now!`;
    setPromoContent(copy);
    if (!promoTitle) setPromoTitle(`${departmentName} 2026 Direct Admissions & Fast-Track Drive`);
    showToast('AI Promotional Copy generated!');
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoContent) return;

    const newPost: SocialMediaPromoPostItem = {
      id: 'promo-' + Date.now(),
      department: departmentName,
      title: promoTitle,
      content: promoContent,
      channels: promoChannels.length > 0 ? promoChannels : ['Meta Ads', 'LinkedIn'],
      targetAudience: promoTargetAudience,
      status: 'Draft',
      scheduledAt: promoScheduledDate,
      metrics: { reach: 0, clicks: 0, shares: 0 }
    };

    saveSocialMediaPromo(newPost);
    setShowCreateModal(false);
    showToast('Promotional campaign draft saved successfully.');
  };

  const handleBroadcast = (promoId: string) => {
    setBroadcastingId(promoId);
    setTimeout(() => {
      const res = broadcastSocialMediaPromo(promoId);
      setBroadcastingId(null);
      setBroadcastResult(res);
      showToast('Campaign successfully published to integrated social media channels!');
    }, 800);
  };

  const totalReach = promos.reduce((sum, p) => sum + (p.metrics?.reach || 0), 0);
  const totalClicks = promos.reduce((sum, p) => sum + (p.metrics?.clicks || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
              Social Media Promo Studio
            </span>
            <span className="text-xs text-slate-300 font-bold">Dept: {departmentName}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Content Creator & Multi-Channel Publisher
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Create high-conversion promotional creatives and 1-click broadcast across Meta Ads (Facebook & Instagram), LinkedIn, WhatsApp Broadcast Channels, and X (Twitter).
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => {
              setPromoTitle(`${departmentName} Campaign ${new Date().toLocaleDateString()}`);
              handleGenerateAICopy();
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> + Create Promo Campaign
          </button>
        </div>
      </div>

      {/* Analytics Overview Bar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Promo Campaigns</span>
          <div className="text-2xl font-black text-slate-900">{promos.length} Campaigns</div>
          <p className="text-xs text-slate-500">{promos.filter(p => p.status === 'Published').length} Published Live</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Social Media Reach</span>
          <div className="text-2xl font-black text-brand-600">{totalReach.toLocaleString()} Views</div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Across all connected platforms
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Inquiry Conversions / Clicks</span>
          <div className="text-2xl font-black text-indigo-600">{totalClicks.toLocaleString()} Clicks</div>
          <p className="text-xs text-slate-500">Redirecting to intake desk</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Integrated Channels</span>
          <div className="text-2xl font-black text-emerald-600">5 Gateways</div>
          <p className="text-xs text-slate-500">Meta, LinkedIn, WA, Insta, X</p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {promos.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-3xl border text-center text-slate-400 text-xs">
            No promotional campaigns created for {departmentName} yet. Click "+ Create Promo Campaign" to design and broadcast one.
          </div>
        ) : (
          promos.map((promo) => (
            <div key={promo.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {promo.department}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{promo.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    promo.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {promo.status}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                  {promo.content}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {promo.channels.map((ch, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500">
                  {promo.publishedAt ? `Live since: ${promo.publishedAt}` : `Target: ${promo.scheduledAt}`}
                  {promo.metrics && promo.metrics.reach > 0 && (
                    <div className="font-bold text-indigo-600 mt-0.5">
                      👁️ {promo.metrics.reach} views • 🖱️ {promo.metrics.clicks} clicks
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBroadcast(promo.id)}
                  disabled={broadcastingId === promo.id}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  {broadcastingId === promo.id ? 'Broadcasting...' : promo.status === 'Published' ? 'Re-Trigger ⚡' : 'Publish Live 🚀'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Result Modal */}
      {broadcastResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-2 border-b pb-3 text-emerald-700 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Live Social Media Broadcast Confirmed!
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Campaign:</span>
                <span className="font-black text-slate-900">{broadcastResult.title}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Dispatched To:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {broadcastResult.channels.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-black">Estimated Immediate Reach</span>
                <div className="text-xl font-black text-brand-600">{broadcastResult.metrics.reach.toLocaleString()} Aspirants</div>
              </div>
            </div>
            <button
              onClick={() => setBroadcastResult(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Campaign Studio
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">New Social Media Promo</h3>
              </div>
              <button
                onClick={handleGenerateAICopy}
                className="px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Generate
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Headline *</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={promoTargetAudience}
                  onChange={(e) => setPromoTargetAudience(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Content & Hashtags *</label>
                <textarea
                  rows={4}
                  required
                  value={promoContent}
                  onChange={(e) => setPromoContent(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Publish To Channels:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Meta Ads', 'LinkedIn', 'Instagram', 'X / Twitter', 'WhatsApp Broadcast'].map(ch => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        promoChannels.includes(ch as any)
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[9px] text-white ${
                        promoChannels.includes(ch as any) ? 'bg-brand-600' : 'bg-slate-300'
                      }`}>
                        ✓
                      </span>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl cursor-pointer"
                >
                  Save Campaign 📢
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
