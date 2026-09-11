import React, { useState } from 'react';
import { Shield, Smartphone, Globe, TrendingUp, BarChart2, MousePointer, Search, Database } from 'lucide-react';

export default function ITMarketingAnalyticsDashboard() {
  const [activeSection, setActiveSection] = useState<'cookies' | 'social' | 'seo' | 'promotions'>('cookies');
  const [socialPlatform, setSocialPlatform] = useState<'WhatsApp' | 'Facebook' | 'Instagram' | 'LinkedIn'>('WhatsApp');

  // Dummy data for Cookies Management
  const cookieStats = { accepted: 8450, declined: 1240, activeSessions: 342 };
  const sessionLogs = [
    { id: 'S1', ip: '192.168.1.1', type: 'Desktop', status: 'Accepted', timestamp: '2026-08-22 10:15:00' },
    { id: 'S2', ip: '192.168.1.2', type: 'Mobile', status: 'Declined', timestamp: '2026-08-22 10:45:00' },
    { id: 'S3', ip: '192.168.1.3', type: 'Tablet', status: 'Accepted', timestamp: '2026-08-22 11:20:00' },
  ];

  // Dummy data for Social Media Marketing
  const socialData = {
    WhatsApp: [
      { id: 'W1', campaign: 'Nursing Fast-Track', leads: 145, ctr: '12%' },
      { id: 'W2', campaign: 'Ausbildung Webinar', leads: 89, ctr: '8%' }
    ],
    Facebook: [
      { id: 'F1', campaign: 'Study in Germany 2026', leads: 320, ctr: '4.5%' },
      { id: 'F2', campaign: 'Language Courses A1-B2', leads: 150, ctr: '3.2%' }
    ],
    Instagram: [
      { id: 'I1', campaign: 'Student Life Germany', leads: 410, ctr: '5.8%' },
      { id: 'I2', campaign: 'Nursing Jobs EU', leads: 280, ctr: '6.1%' }
    ],
    LinkedIn: [
      { id: 'L1', campaign: 'B2B Healthcare Partners', leads: 45, ctr: '2.1%' },
      { id: 'L2', campaign: 'Tech Placements EU', leads: 65, ctr: '3.4%' }
    ]
  };

  // Dummy data for SEO & Keyword Tracking
  const seoData = [
    { id: 'K1', keyword: 'study in germany', reach: '450k', indexStatus: 'Indexed', organicTraffic: '+15%' },
    { id: 'K2', keyword: 'ausbildung nursing', reach: '120k', indexStatus: 'Indexed', organicTraffic: '+22%' },
    { id: 'K3', keyword: 'german language courses', reach: '300k', indexStatus: 'Pending Update', organicTraffic: '+5%' },
  ];

  // Dummy data for ILA Promotions Tracker
  const promotionsData = [
    { id: 'P1', name: 'Autumn 2026 Intake Offer', engagement: 'High', conversion: '18%', status: 'Active' },
    { id: 'P2', name: 'Free B1 Demo Class', engagement: 'Medium', conversion: '12%', status: 'Active' },
    { id: 'P3', name: 'Referral Bonus Program', engagement: 'Very High', conversion: '25%', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">Analytics Hub</span>
          <h2 className="text-xl font-black text-slate-900 mt-1">IT & R&D / Marketing Analytics Dashboard</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => setActiveSection('cookies')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${activeSection === 'cookies' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🍪 Cookies & R&D</button>
        <button onClick={() => setActiveSection('social')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${activeSection === 'social' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📱 Social Media</button>
        <button onClick={() => setActiveSection('seo')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${activeSection === 'seo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🔍 SEO & Keywords</button>
        <button onClick={() => setActiveSection('promotions')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${activeSection === 'promotions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🚀 Promotions Tracker</button>
      </div>

      {/* 1. Cookies Management & R&D */}
      {activeSection === 'cookies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center">
              <Shield className="w-8 h-8 text-emerald-600 mb-2" />
              <div className="text-sm font-bold text-slate-600">GDPR Accepted</div>
              <div className="text-3xl font-black text-emerald-700">{cookieStats.accepted}</div>
            </div>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center">
              <Shield className="w-8 h-8 text-rose-600 mb-2" />
              <div className="text-sm font-bold text-slate-600">GDPR Declined</div>
              <div className="text-3xl font-black text-rose-700">{cookieStats.declined}</div>
            </div>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center">
              <Database className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-sm font-bold text-slate-600">Active Sessions</div>
              <div className="text-3xl font-black text-blue-700">{cookieStats.activeSessions}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-sm">Live Session & Consent Logs</h3>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Session ID / IP</th>
                    <th className="p-3">Device Type</th>
                    <th className="p-3">Consent Status</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50">
                      <td className="p-3 font-semibold text-slate-900">{log.id} - {log.ip}</td>
                      <td className="p-3 text-slate-600">{log.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${log.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Social Media Marketing */}
      {activeSection === 'social' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['WhatsApp', 'Facebook', 'Instagram', 'LinkedIn'].map(platform => (
              <button 
                key={platform} 
                onClick={() => setSocialPlatform(platform as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${socialPlatform === platform ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {platform}
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><Smartphone className="w-4 h-4 text-indigo-600" /> {socialPlatform} Campaigns</h3>
            <div className="grid gap-3">
              {socialData[socialPlatform].map(campaign => (
                <div key={campaign.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{campaign.campaign}</div>
                    <div className="text-xs text-slate-500 mt-1">ID: {campaign.id}</div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Leads</div>
                      <div className="font-black text-indigo-600">{campaign.leads}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">CTR</div>
                      <div className="font-black text-emerald-600">{campaign.ctr}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SEO & Keyword Tracking */}
      {activeSection === 'seo' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-600" /> SEO & Global Reach Tracker</h3>
          <div className="grid gap-3">
            {seoData.map(seo => (
              <div key={seo.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target Keyword</div>
                  <div className="font-extrabold text-slate-900 text-sm">"{seo.keyword}"</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Search Engine Reach</div>
                  <div className="font-black text-indigo-600">{seo.reach}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Index Status</div>
                  <div className="font-bold text-slate-700">{seo.indexStatus}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Organic Traffic</div>
                  <div className="font-black text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {seo.organicTraffic}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ILA Promotions Tracker */}
      {activeSection === 'promotions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600" /> Active Promotional Campaigns</h3>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Promotion Name</th>
                  <th className="p-4">User Engagement</th>
                  <th className="p-4">Conversion Rate</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {promotionsData.map((promo) => (
                  <tr key={promo.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50">
                    <td className="p-4 font-extrabold text-slate-900">{promo.name}</td>
                    <td className="p-4 font-bold text-slate-700">{promo.engagement}</td>
                    <td className="p-4 font-black text-emerald-600">{promo.conversion}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-md font-bold text-[10px] uppercase">
                        {promo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
