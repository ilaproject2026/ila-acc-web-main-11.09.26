import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gift, 
  DollarSign, 
  Users, 
  Award, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Trash2,
  Edit,
  Sparkles,
  BookOpen,
  Send,
  Star,
  Globe2,
  X,
  Clock,
  Eye,
  Radio,
  Megaphone
} from 'lucide-react';
import { 
  RewardRule,
  RewardCatalogItem,
  RewardUserScore,
  RewardRedemptionRequest,
  RewardBlogPost,
  getRewardRules,
  saveRewardRule,
  deleteRewardRule,
  getRewardCatalog,
  saveRewardCatalogItem,
  deleteRewardCatalogItem,
  getRewardUserScores,
  saveRewardUserScore,
  getRewardRedemptions,
  updateRedemptionStatus,
  getRewardBlogPosts,
  saveRewardBlogPost,
  deleteRewardBlogPost,
  getRewardHubStats
} from '../../lib/db';
import { HubHODView } from './common/HubHODView';
import { HubAutoTriggerView } from './common/HubAutoTriggerView';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';

export default function RewardManagementHub() {
  const [activeTab, setActiveTab] = useState<
    'rules' | 'catalog' | 'users' | 'redemptions' | 'blogs' | 'hod' | 'auto_trigger' | 'social_promo' | 'intake_tracking'
  >('rules');
  const [searchTerm, setSearchTerm] = useState('');

  const [rules, setRules] = useState<RewardRule[]>([]);
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);
  const [users, setUsers] = useState<RewardUserScore[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemptionRequest[]>([]);
  const [blogs, setBlogs] = useState<RewardBlogPost[]>([]);
  const [stats, setStats] = useState(getRewardHubStats());

  // Modal States
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);

  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<RewardCatalogItem | null>(null);

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<RewardBlogPost | null>(null);

  const loadAllData = () => {
    setRules(getRewardRules());
    setCatalog(getRewardCatalog());
    setUsers(getRewardUserScores());
    setRedemptions(getRewardRedemptions());
    setBlogs(getRewardBlogPosts());
    setStats(getRewardHubStats());
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('ilas-reward-rules-changed', loadAllData);
    window.addEventListener('ilas-reward-catalog-changed', loadAllData);
    window.addEventListener('ilas-reward-scores-changed', loadAllData);
    window.addEventListener('ilas-reward-redemptions-changed', loadAllData);
    window.addEventListener('ilas-reward-blog-posts-changed', loadAllData);

    return () => {
      window.removeEventListener('ilas-reward-rules-changed', loadAllData);
      window.removeEventListener('ilas-reward-catalog-changed', loadAllData);
      window.removeEventListener('ilas-reward-scores-changed', loadAllData);
      window.removeEventListener('ilas-reward-redemptions-changed', loadAllData);
      window.removeEventListener('ilas-reward-blog-posts-changed', loadAllData);
    };
  }, []);

  // Handlers for Rules
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    saveRewardRule(editingRule);
    setShowRuleModal(false);
    setEditingRule(null);
  };

  // Handlers for Catalog
  const handleSaveCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog) return;
    saveRewardCatalogItem(editingCatalog);
    setShowCatalogModal(false);
    setEditingCatalog(null);
  };

  // Handlers for Blog Posts
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    saveRewardBlogPost(editingBlog);
    setShowBlogModal(false);
    setEditingBlog(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> Rewards & Referral Growth Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Reward Management & Magazine Blog Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
            Configure gamified reward points, manage gift & tour catalogs, track consultant performance scores, and publish interactive magazine articles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-slate-300 font-bold block uppercase">Points Awarded</span>
            <span className="text-lg font-black text-amber-300">{stats.totalPointsAwarded.toLocaleString()} pts</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-slate-300 font-bold block uppercase">Active Consultants</span>
            <span className="text-lg font-black text-emerald-400">{stats.totalRegisteredConsultants}</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Configured Rules</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalRules} Rules</div>
            <span className="text-[10px] text-emerald-600 font-bold">Active in Ecosystem</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Catalog Items</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalCatalogItems} Rewards</div>
            <span className="text-[10px] text-amber-600 font-bold">Gifts, Tours & Cash</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Pending Redemptions</span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{stats.totalPendingRedemptions} Requests</div>
            <span className="text-[10px] text-slate-500 font-bold">{stats.totalFulfilled} Disbursed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Magazine Articles</span>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{stats.totalBlogPosts} Published</div>
            <span className="text-[10px] text-indigo-600 font-bold">Frontend Promo Blog</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'rules', label: '1. Points & Trigger Rules', icon: Award, count: rules.length },
            { id: 'catalog', label: '2. Reward Catalog (Gifts & Tours)', icon: Gift, count: catalog.length },
            { id: 'users', label: '3. Consultant Scores & Tiers', icon: Users, count: users.length },
            { id: 'redemptions', label: '4. Redemptions & Payouts', icon: DollarSign, count: redemptions.length },
            { id: 'blogs', label: '5. Magazine Blog Stories', icon: BookOpen, count: blogs.length },
            { id: 'hod', label: '6. HOD Console (Affiliates)', icon: Award, count: undefined },
            { id: 'auto_trigger', label: '7. Auto-Trigger (Milestones)', icon: Radio, count: undefined },
            { id: 'social_promo', label: '8. Social Promo Broadcast', icon: Megaphone, count: undefined },
            { id: 'intake_tracking', label: '9. Intake Desk', icon: Users, count: undefined }
          ].map(t => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  isSel 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action depending on Tab */}
        {activeTab === 'rules' && (
          <button
            onClick={() => {
              setEditingRule({
                id: 'RULE-' + Math.floor(100 + Math.random() * 900),
                actionTitle: '',
                category: 'Referral',
                pointsReward: 50,
                cashIncentive: '₹3,000 Payout',
                description: '',
                status: 'Active'
              });
              setShowRuleModal(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Point Rule
          </button>
        )}

        {activeTab === 'catalog' && (
          <button
            onClick={() => {
              setEditingCatalog({
                id: 'CAT-' + Math.floor(100 + Math.random() * 900),
                title: '',
                type: 'Gift Package',
                pointsCost: 250,
                monetaryValue: '₹25,000 Value',
                badge: 'New Item',
                stockStatus: 'In Stock',
                description: '',
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
              });
              setShowCatalogModal(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Reward Item
          </button>
        )}

        {activeTab === 'blogs' && (
          <button
            onClick={() => {
              setEditingBlog({
                id: 'BLOG-' + Math.floor(100 + Math.random() * 900),
                title: '',
                subtitle: '',
                category: 'Referral & Peer Promotion',
                readTime: '4 min read',
                featuredBadge: 'Featured Post',
                author: 'ILA Editorial Team',
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                summary: '',
                contentParagraphs: [''],
                actionUrl: '#rewards',
                actionLabel: 'Learn More →',
                imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
                pointsBonusTag: '+50 Points'
              });
              setShowBlogModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Publish Blog Article
          </button>
        )}
      </div>

      {/* 4. TAB 1: RULES & TRIGGER MILESTONES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {r.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {r.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug mb-1">{r.actionTitle}</h3>
                  <div className="text-xs font-bold text-amber-600 mb-2">{r.cashIncentive}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{r.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-black text-emerald-700">+{r.pointsReward} Points</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingRule(r);
                        setShowRuleModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Rule"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete rule "${r.actionTitle}"?`)) {
                          deleteRewardRule(r.id);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 2: REWARD CATALOG */}
      {activeTab === 'catalog' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {catalog.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                {item.imageUrl && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md">
                      {item.badge}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>{item.type}</span>
                    <span className="text-emerald-700 font-black">{item.stockStatus}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">{item.title}</h3>
                  <div className="text-xs font-bold text-indigo-600 mb-2">{item.monetaryValue}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-sm font-black text-amber-600">{item.pointsCost} Points Required</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingCatalog(item);
                      setShowCatalogModal(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete catalog item "${item.title}"?`)) {
                        deleteRewardCatalogItem(item.id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. TAB 3: CONSULTANT USER SCORES */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Consultant Details</th>
                  <th className="py-3 px-4">Card ID & Role</th>
                  <th className="py-3 px-4">Referrals & Milestones</th>
                  <th className="py-3 px-4">Active Balance</th>
                  <th className="py-3 px-4">Total Earned</th>
                  <th className="py-3 px-4">Tier Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{u.userName}</div>
                      <div className="text-[11px] font-normal text-slate-500">{u.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-bold">
                        {u.consultantCardId}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{u.userRole}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{u.referralCount} Referrals</span>
                      <div className="text-[10px] text-slate-500">{u.milestonesCompleted} milestones cleared</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-amber-600 text-sm">
                      {u.pointsBalance} pts
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {u.totalPointsEarned} pts
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {u.activeTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          const addPts = prompt(`Add points to ${u.userName}'s wallet:`, '50');
                          if (addPts && !isNaN(Number(addPts))) {
                            saveRewardUserScore({
                              ...u,
                              pointsBalance: u.pointsBalance + Number(addPts),
                              totalPointsEarned: u.totalPointsEarned + Number(addPts)
                            });
                          }
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg cursor-pointer"
                      >
                        + Credit Points
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 4: REDEMPTIONS & PAYOUTS */}
      {activeTab === 'redemptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Reward Claimed</th>
                  <th className="py-3 px-4">Points & Value</th>
                  <th className="py-3 px-4">Request Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fulfillment Notes</th>
                  <th className="py-3 px-4">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{red.userName}</div>
                      <div className="text-[11px] font-normal text-slate-500">{red.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{red.rewardItemTitle}</div>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{red.rewardType}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-amber-600">-{red.pointsDeducted} pts</div>
                      <div className="text-[11px] font-bold text-slate-700">{red.cashAmount}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {red.requestDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        red.status === 'Fulfilled / Disbursed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : red.status === 'Approved by Accounts' || red.status === 'Approved by Marketing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {red.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {red.fulfillmentNotes || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {red.status !== 'Fulfilled / Disbursed' && (
                          <button
                            onClick={() => {
                              const notes = prompt('Enter payment transaction ID or dispatch note:', 'Disbursed via bank transfer');
                              if (notes !== null) {
                                updateRedemptionStatus(red.id, 'Fulfilled / Disbursed', notes);
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer shadow-xs"
                          >
                            Mark Disbursed
                          </button>
                        )}
                        {red.status === 'Pending Review' && (
                          <button
                            onClick={() => updateRedemptionStatus(red.id, 'Approved by Accounts', 'Approved for disbursement')}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. TAB 5: MAGAZINE BLOG STORIES CMS */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-5">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-indigo-400 transition-all">
                <div>
                  <div className="h-48 w-full overflow-hidden relative">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-black uppercase text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                        {b.category}
                      </span>
                      {b.featuredBadge && (
                        <span className="text-[10px] font-black uppercase text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md">
                          {b.featuredBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>{b.author} • {b.date}</span>
                      <span>{b.readTime}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">{b.title}</h3>
                    <p className="text-xs font-bold text-indigo-700 mb-2">{b.subtitle}</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">{b.summary}</p>

                    {b.pointsBonusTag && (
                      <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                        {b.pointsBonusTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-[11px] text-slate-500">CTA: {b.actionLabel}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingBlog(b);
                        setShowBlogModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete blog post "${b.title}"?`)) {
                          deleteRewardBlogPost(b.id);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HOD CONSOLE (REWARDS & AFFILIATES) */}
      {activeTab === 'hod' && (
        <div className="animate-in fade-in">
          <HubHODView 
            departmentName="Rewards & Affiliate Partnerships"
            departmentTagline="Affiliate Expansion, Campus Ambassador MoUs & Quarterly Referral Payout Agendas"
            defaultAgendas={[
              { id: 'rew-1', title: 'Onboard 25 Engineering College Placement Ambassadors', targetDate: '2026-09-30', priority: 'High', status: 'In Progress' },
              { id: 'rew-2', title: 'Launch 15% VIP Commission Tier for Corporate Consultants', targetDate: '2026-10-15', priority: 'Critical', status: 'In Progress' },
              { id: 'rew-3', title: 'Q3 Direct Bank Payout Audit & Tax Compliance Clearance', targetDate: '2026-11-05', priority: 'Medium', status: 'Pending Review' }
            ]}
          />
        </div>
      )}

      {/* 7. AUTO-TRIGGER (MILESTONE NOTIFICATIONS) */}
      {activeTab === 'auto_trigger' && (
        <div className="animate-in fade-in">
          <HubAutoTriggerView 
            departmentName="Rewards"
            defaultEventTypes={[
              { key: 'pending_payment', label: 'Unclaimed Referral Payout' },
              { key: 'incomplete_enrollment', label: 'Incomplete Ambassador Onboarding' },
              { key: 'profile_dropoff', label: 'Inactive Consultant Re-engagement' }
            ]}
          />
        </div>
      )}

      {/* 8. SOCIAL MEDIA PROMO BROADCAST */}
      {activeTab === 'social_promo' && (
        <div className="animate-in fade-in">
          <HubSocialPromoView departmentName="Rewards" />
        </div>
      )}

      {/* 9. INTAKE TRACKING DESK */}
      {activeTab === 'intake_tracking' && (
        <div className="animate-in fade-in">
          <HubIntakeTrackingView 
            departmentName="Rewards" 
            departmentTitle="Affiliate & Consultant Partnership Intake Desk" 
          />
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Rule Modal */}
      {showRuleModal && editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Configure Reward Point Rule</h3>
              <button onClick={() => setShowRuleModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Action / Trigger Title:</label>
                <input
                  type="text"
                  required
                  value={editingRule.actionTitle}
                  onChange={(e) => setEditingRule({ ...editingRule, actionTitle: e.target.value })}
                  placeholder="e.g. Enrolling a Student in German Course"
                  className="w-full p-2.5 border rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={editingRule.category}
                    onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="Referral">Referral</option>
                    <option value="Course Milestone">Course Milestone</option>
                    <option value="Study Abroad">Study Abroad</option>
                    <option value="Visa">Visa</option>
                    <option value="Work & Study">Work & Study</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Points Awarded:</label>
                  <input
                    type="number"
                    required
                    value={editingRule.pointsReward}
                    onChange={(e) => setEditingRule({ ...editingRule, pointsReward: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cash Incentive / Bonus:</label>
                  <input
                    type="text"
                    required
                    value={editingRule.cashIncentive}
                    onChange={(e) => setEditingRule({ ...editingRule, cashIncentive: e.target.value })}
                    placeholder="e.g. ₹3,500 Direct Payout"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rule Status:</label>
                  <select
                    value={editingRule.status}
                    onChange={(e) => setEditingRule({ ...editingRule, status: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rule Description & Verification Criteria:</label>
                <textarea
                  rows={3}
                  required
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  placeholder="Explain when points and cash payouts are triggered..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowRuleModal(false)} className="flex-1 py-2.5 bg-slate-100 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 font-black text-slate-950 rounded-xl">
                  Save Point Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog Modal */}
      {showCatalogModal && editingCatalog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Add / Edit Reward Catalog Item</h3>
              <button onClick={() => setShowCatalogModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Title:</label>
                <input
                  type="text"
                  required
                  value={editingCatalog.title}
                  onChange={(e) => setEditingCatalog({ ...editingCatalog, title: e.target.value })}
                  placeholder="e.g. 7-Day European Educational Tour Package"
                  className="w-full p-2.5 border rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reward Type:</label>
                  <select
                    value={editingCatalog.type}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, type: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="Gift Package">Gift Package</option>
                    <option value="Tour Package">Tour Package</option>
                    <option value="Salary Incentive">Salary Incentive</option>
                    <option value="Course Subsidy">Course Subsidy</option>
                    <option value="Cashback">Cashback</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Points Cost:</label>
                  <input
                    type="number"
                    required
                    value={editingCatalog.pointsCost}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, pointsCost: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monetary Value:</label>
                  <input
                    type="text"
                    required
                    value={editingCatalog.monetaryValue}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, monetaryValue: e.target.value })}
                    placeholder="e.g. ₹2,50,000 Value"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Status:</label>
                  <select
                    value={editingCatalog.stockStatus}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, stockStatus: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Availability">Limited Availability</option>
                    <option value="On Request">On Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL:</label>
                <input
                  type="url"
                  value={editingCatalog.imageUrl || ''}
                  onChange={(e) => setEditingCatalog({ ...editingCatalog, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description:</label>
                <textarea
                  rows={2}
                  required
                  value={editingCatalog.description}
                  onChange={(e) => setEditingCatalog({ ...editingCatalog, description: e.target.value })}
                  placeholder="Detailed reward terms and delivery information..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCatalogModal(false)} className="flex-1 py-2.5 bg-slate-100 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 font-black text-slate-950 rounded-xl">
                  Save Catalog Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Post Modal */}
      {showBlogModal && editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Publish / Edit Magazine Blog Post</h3>
              <button onClick={() => setShowBlogModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title:</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  placeholder="e.g. Promote Your Education Course to Friends"
                  className="w-full p-2.5 border rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Tagline:</label>
                <input
                  type="text"
                  required
                  value={editingBlog.subtitle}
                  onChange={(e) => setEditingBlog({ ...editingBlog, subtitle: e.target.value })}
                  placeholder="e.g. Turn Your Study Peer Group into a High-Income Study & Referral Squad"
                  className="w-full p-2.5 border rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="Referral & Peer Promotion">Referral & Peer Promotion</option>
                    <option value="Work & Study & Career Gains">Work & Study & Career Gains</option>
                    <option value="Study Abroad Pathways">Study Abroad Pathways</option>
                    <option value="Visa & Placement Services">Visa & Placement Services</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Featured Badge:</label>
                  <input
                    type="text"
                    value={editingBlog.featuredBadge || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, featuredBadge: e.target.value })}
                    placeholder="e.g. Top Trending Guide"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Points Bonus Tag:</label>
                  <input
                    type="text"
                    value={editingBlog.pointsBonusTag || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, pointsBonusTag: e.target.value })}
                    placeholder="e.g. +50 Points / Enrollment"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Read Time:</label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL:</label>
                <input
                  type="url"
                  required
                  value={editingBlog.imageUrl}
                  onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summary Excerpt:</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.summary}
                  onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  placeholder="Brief introductory summary..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Article Paragraphs:</label>
                <textarea
                  rows={4}
                  required
                  value={editingBlog.contentParagraphs.join('\n\n')}
                  onChange={(e) => setEditingBlog({ ...editingBlog, contentParagraphs: e.target.value.split('\n\n') })}
                  placeholder="Write full story content (separate paragraphs with blank line)..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button Text:</label>
                  <input
                    type="text"
                    value={editingBlog.actionLabel}
                    onChange={(e) => setEditingBlog({ ...editingBlog, actionLabel: e.target.value })}
                    placeholder="e.g. Invite Friends & Earn Points →"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Target URL / Hash:</label>
                  <input
                    type="text"
                    value={editingBlog.actionUrl}
                    onChange={(e) => setEditingBlog({ ...editingBlog, actionUrl: e.target.value })}
                    placeholder="e.g. #applications?tab=Reward Club"
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowBlogModal(false)} className="flex-1 py-2.5 bg-slate-100 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-black text-white rounded-xl">
                  Publish to Magazine Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
