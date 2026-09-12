import React, { useState, useEffect } from 'react';
import { 
  Zap, MessageSquare, Mail, Phone, Clock, CheckCircle2, 
  AlertCircle, Play, Plus, RefreshCw, Search, Filter,
  Send, ShieldCheck, Sparkles, Bell, ArrowRight, UserCheck,
  Smartphone, Eye, Layers, Copy, Check, Info, Settings,
  Radio, BarChart3, ChevronRight, X, Flame
} from 'lucide-react';
import {
  CommTriggerWorkflow,
  CommDispatchLog,
  getCommTriggerWorkflows,
  saveCommTriggerWorkflow,
  toggleCommTriggerWorkflow,
  getCommDispatchLogs,
  simulateTestTrigger,
  getCommTriggerMetrics
} from '../../lib/db';

interface AutomatedCommTriggersHubProps {
  onNavigateToCourseCatalog?: () => void;
}

export const AutomatedCommTriggersHub: React.FC<AutomatedCommTriggersHubProps> = ({
  onNavigateToCourseCatalog
}) => {
  const [workflows, setWorkflows] = useState<CommTriggerWorkflow[]>([]);
  const [logs, setLogs] = useState<CommDispatchLog[]>([]);
  const [metrics, setMetrics] = useState(getCommTriggerMetrics());
  
  // Tab within Comm Hub: 'workflows' | 'logs' | 'simulator'
  const [activeSubTab, setActiveSubTab] = useState<'workflows' | 'logs' | 'simulator'>('workflows');

  // Log filters
  const [logSearch, setLogSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Simulator Form State
  const [simName, setSimName] = useState('Ananya Sharma');
  const [simEmail, setSimEmail] = useState('ananya.sharma@example.com');
  const [simPhone, setSimPhone] = useState('+91 98765 43210');
  const [simCourse, setSimCourse] = useState('German Language B2 Executive Track');
  const [simWorkflowId, setSimWorkflowId] = useState<string>('trig-welcome-reg');
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  // Selected Workflow for Detailed Preview / Edit Modal
  const [previewWorkflow, setPreviewWorkflow] = useState<CommTriggerWorkflow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Customer Lifecycle Rule Builder Modal State
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<CommTriggerWorkflow | null>(null);

  // Rule Form Fields
  const [ruleName, setRuleName] = useState('');
  const [ruleEvent, setRuleEvent] = useState<CommTriggerWorkflow['triggerEvent']>('student_registration');
  const [ruleCategory, setRuleCategory] = useState<CommTriggerWorkflow['category']>('Welcome & Onboarding');
  const [ruleChannel, setRuleChannel] = useState<CommTriggerWorkflow['channel']>('WhatsApp');
  const [ruleSubject, setRuleSubject] = useState('');
  const [ruleTemplate, setRuleTemplate] = useState('');
  const [ruleDelay, setRuleDelay] = useState<number>(0);
  const [ruleBadge, setRuleBadge] = useState('Instant Zero-Latency');

  const handleOpenRuleModal = (rule?: CommTriggerWorkflow) => {
    if (rule) {
      setEditingRule(rule);
      setRuleName(rule.name);
      setRuleEvent(rule.triggerEvent);
      setRuleCategory(rule.category);
      setRuleChannel(rule.channel);
      setRuleSubject(rule.subject);
      setRuleTemplate(rule.messageTemplate);
      setRuleDelay(rule.delayMinutes);
      setRuleBadge(rule.badge);
    } else {
      setEditingRule(null);
      setRuleName('');
      setRuleEvent('student_registration');
      setRuleCategory('Welcome & Onboarding');
      setRuleChannel('WhatsApp');
      setRuleSubject('Willkommen to ILAS! Your Journey Begins 🚀');
      setRuleTemplate('Hallo {{name}}, welcome to {{course}}! Your student portal is now active.');
      setRuleDelay(0);
      setRuleBadge('Instant Zero-Latency');
    }
    setShowRuleModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleTemplate) {
      alert('Please fill out the rule name and message template.');
      return;
    }

    const ruleToSave: CommTriggerWorkflow = {
      id: editingRule ? editingRule.id : `trig-flow-${Date.now().toString().slice(-5)}`,
      name: ruleName,
      triggerEvent: ruleEvent,
      category: ruleCategory,
      channel: ruleChannel,
      subject: ruleSubject,
      messageTemplate: ruleTemplate,
      isActive: true,
      delayMinutes: Number(ruleDelay) || 0,
      badge: ruleBadge || (ruleDelay === 0 ? 'Instant Zero-Latency' : `${ruleDelay}m Delay`),
      stats: editingRule ? editingRule.stats : {
        totalDispatched: 0,
        delivered: 0,
        openedOrRead: 0,
        failed: 0
      }
    };

    saveCommTriggerWorkflow(ruleToSave);
    setShowRuleModal(false);
    loadData();
  };

  const loadData = () => {
    setWorkflows(getCommTriggerWorkflows());
    setLogs(getCommDispatchLogs());
    setMetrics(getCommTriggerMetrics());
  };

  useEffect(() => {
    loadData();

    const handleWorkflowsChanged = () => loadData();
    const handleLogsChanged = () => loadData();

    window.addEventListener('ilas-comm-workflows-changed', handleWorkflowsChanged);
    window.addEventListener('ilas-comm-logs-changed', handleLogsChanged);

    return () => {
      window.removeEventListener('ilas-comm-workflows-changed', handleWorkflowsChanged);
      window.removeEventListener('ilas-comm-logs-changed', handleLogsChanged);
    };
  }, []);

  const handleToggleWorkflow = (id: string, currentState: boolean) => {
    toggleCommTriggerWorkflow(id, !currentState);
  };

  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    const result = simulateTestTrigger(simWorkflowId, {
      name: simName,
      email: simEmail,
      phone: simPhone,
      courseOrBatch: simCourse
    });

    if (result) {
      setSimFeedback(`✅ Trigger fired! Live payload dispatched via ${result.channel} to ${result.recipientName}.`);
      setTimeout(() => setSimFeedback(null), 5000);
    }
  };

  const handleCopyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.recipientName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.recipientEmail.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.recipientPhone.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.courseOrBatch.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.triggerName.toLowerCase().includes(logSearch.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;
    const matchesChannel = selectedChannel === 'All' || log.channel === selectedChannel;
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesChannel && matchesCategory;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'SMS':
        return <Smartphone className="w-4 h-4 text-amber-600" />;
      default:
        return <Zap className="w-4 h-4 text-purple-600" />;
    }
  };

  const getStatusBadge = (status: CommDispatchLog['status']) => {
    switch (status) {
      case 'Read':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-600" /> Read
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Delivered
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Send className="w-3 h-3 text-purple-600" /> Sent
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE HEADER & REAL-TIME SYSTEM STATUS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/50 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Automation Engine Active
              </span>
              <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                Avg Latency: ~380ms
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Automated Communication Triggers
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Backend-driven real-time multi-channel communication engine. Automatically triggers instant welcome kits on registration, 24h & 1h class start countdowns, and pending enrollment recovery nudges via WhatsApp, Email, & SMS.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveSubTab('simulator')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
            >
              <Play className="w-4 h-4 fill-white" />
              Test Trigger Live
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all cursor-pointer"
              title="Refresh Trigger Metrics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME METRICS COCKPIT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Dispatches */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Dispatches</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.totalDispatches.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All automated events synced
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Delivery Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {metrics.deliveryRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            WhatsApp & SMS Gateway verified
          </div>
        </div>

        {/* Student Read Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Engagement Open Rate</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {metrics.openRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Read within 15 mins of arrival
          </div>
        </div>

        {/* Active Workflows */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Workflows</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">
            {metrics.activeWorkflowsCount} / {metrics.totalWorkflowsCount}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            100% operational rules
          </div>
        </div>
      </div>

      {/* 3. SUB-NAV VIEW SWITCHER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('workflows')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'workflows'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Trigger Workflows ({workflows.length})
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Live Delivery Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Trigger Simulator
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Real-time webhook sync enabled</span>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {activeSubTab === 'workflows' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Configured Automated Messaging Workflows
              </h2>
              <p className="text-xs text-slate-500">
                Trigger rules automatically run when students register, complete partial intakes, or have upcoming classes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenRuleModal()}
                className="text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Configure Flow Rule
              </button>
              <button
                onClick={() => setActiveSubTab('simulator')}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Test Single Trigger
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {workflows.map((wf) => {
              const isTurnedOn = wf.isActive;

              return (
                <div 
                  key={wf.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isTurnedOn ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div>
                    {/* Card Top: Category, Channel & Active Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                          {getChannelIcon(wf.channel)}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {wf.channel}
                        </span>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleToggleWorkflow(wf.id, isTurnedOn)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isTurnedOn ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={isTurnedOn ? 'Workflow Active (Click to Pause)' : 'Workflow Paused (Click to Enable)'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isTurnedOn ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Title & Badge */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                          {wf.badge}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {wf.delayMinutes === 0 ? '⚡ Zero Latency' : `⏰ ${wf.delayMinutes >= 1440 ? `${wf.delayMinutes / 1440}d` : `${wf.delayMinutes}m`} Delay`}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {wf.name}
                      </h3>
                    </div>

                    {/* Subject / Intent */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Subject Header</div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {wf.subject}
                      </div>
                    </div>

                    {/* Template Message Preview */}
                    <div className="relative bg-slate-900 text-slate-200 rounded-xl p-3 text-[11px] font-mono leading-relaxed mb-4">
                      <div className="line-clamp-3">
                        {wf.messageTemplate}
                      </div>
                      <button
                        onClick={() => handleCopyTemplate(wf.messageTemplate, wf.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                        title="Copy Template"
                      >
                        {copiedId === wf.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Card Footer: Real-time Stats & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div>
                        <span className="font-black text-slate-900">{wf.stats.totalDispatched}</span>
                        <span className="text-[10px] text-slate-500 ml-1">Sent</span>
                      </div>
                      <div>
                        <span className="font-black text-emerald-600">{wf.stats.delivered}</span>
                        <span className="text-[10px] text-slate-500 ml-1">Delivered</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewWorkflow(wf)}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. LIVE DELIVERY & ENGAGEMENT LOGS */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search student name, email, phone, course, or trigger..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="All">All Statuses</option>
                <option value="Read">Read</option>
                <option value="Delivered">Delivered</option>
                <option value="Sent">Sent</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="All">All Channels</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>

              <button
                onClick={() => {
                  setLogSearch('');
                  setSelectedStatus('All');
                  setSelectedChannel('All');
                  setSelectedCategory('All');
                }}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Recipient Student</th>
                    <th className="py-3 px-4">Trigger Event</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Message Preview</th>
                    <th className="py-3 px-4 text-right">Time & Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <div className="font-bold text-slate-600">No communication logs match your filter</div>
                        <div className="text-[11px]">Try adjusting your search criteria or running a live trigger test.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Recipient info */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900">{log.recipientName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{log.recipientPhone}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{log.recipientEmail}</span>
                          </div>
                        </td>

                        {/* Trigger Name & Course */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 line-clamp-1">{log.triggerName}</div>
                          <div className="text-[10px] font-semibold text-indigo-600 mt-0.5 bg-indigo-50/80 inline-block px-2 py-0.5 rounded">
                            {log.courseOrBatch}
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700">
                            {getChannelIcon(log.channel)}
                            <span>{log.channel}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(log.status)}
                        </td>

                        {/* Message Preview */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-[11px] text-slate-600 font-mono line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                            {log.messagePreview}
                          </div>
                        </td>

                        {/* Latency & Timestamp */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-slate-800">{log.dispatchedAt}</div>
                          {log.engagementMetadata?.deliveryLatencyMs && (
                            <div className="text-[10px] text-emerald-600 font-medium">
                              ⚡ {log.engagementMetadata.deliveryLatencyMs}ms
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-800">{filteredLogs.length}</span> of <span className="font-bold text-slate-800">{logs.length}</span> dispatches
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium">Live Stream Sync Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE TRIGGER SIMULATOR & TEST CONSOLE */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Simulator Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Trigger Dispatch Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate a real-time student registration intake, class countdown reminder, or pending enrollment follow-up to test message templates and live channel delivery.
              </p>
            </div>

            {simFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{simFeedback}</span>
              </div>
            )}

            <form onSubmit={handleRunSimulator} className="space-y-4">
              {/* Select Trigger Rule */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Communication Workflow
                </label>
                <select
                  value={simWorkflowId}
                  onChange={(e) => setSimWorkflowId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {workflows.map(w => (
                    <option key={w.id} value={w.id}>
                      [{w.channel.toUpperCase()}] {w.name} ({w.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    placeholder="e.g. ananya.sharma@example.com"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Student Phone & Target Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Course / Batch Track
                  </label>
                  <input
                    type="text"
                    required
                    value={simCourse}
                    onChange={(e) => setSimCourse(e.target.value)}
                    placeholder="e.g. German B2 Executive Track"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white font-black text-sm shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                Simulate & Dispatch Message Instantly
              </button>
            </form>
          </div>

          {/* Right Live Device Mockup Preview */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Device Rendering</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Instant Preview
                </span>
              </div>

              {/* Simulated Phone Frame */}
              <div className="bg-slate-800/80 rounded-2xl border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-2">
                  <span className="font-bold text-white">ILAS Automated Gateway</span>
                  <span>Today, Just now</span>
                </div>

                <div className="text-xs font-mono text-emerald-300 bg-slate-900/90 p-3 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                  {(() => {
                    const sel = workflows.find(w => w.id === simWorkflowId);
                    if (!sel) return 'Select a workflow to preview';
                    return sel.messageTemplate
                      .replace(/\{\{name\}\}/g, simName || 'Student Name')
                      .replace(/\{\{course\}\}/g, simCourse || 'German B2')
                      .replace(/\{\{time\}\}/g, '09:00 AM CET')
                      .replace(/\{\{tutor\}\}/g, 'Frau Lisa Weber')
                      .replace(/\{\{amount\}\}/g, '$199.00');
                  })()}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Channel: <strong className="text-white">{workflows.find(w => w.id === simWorkflowId)?.channel}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Ready for dispatch</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Dynamic Placeholders:
              </div>
              <p>Supported tags: <code className="text-indigo-300">{"{{name}}"}</code>, <code className="text-indigo-300">{"{{course}}"}</code>, <code className="text-indigo-300">{"{{time}}"}</code>, <code className="text-indigo-300">{"{{tutor}}"}</code>.</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. INSPECT WORKFLOW MODAL */}
      {previewWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  {getChannelIcon(previewWorkflow.channel)}
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{previewWorkflow.name}</h3>
                  <span className="text-[11px] text-slate-500">{previewWorkflow.category} • {previewWorkflow.channel}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewWorkflow(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Subject Line</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 mt-1">
                  {previewWorkflow.subject}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Message Template</label>
                <div className="p-3 bg-slate-900 text-slate-200 font-mono rounded-xl border border-slate-800 mt-1 whitespace-pre-wrap leading-relaxed">
                  {previewWorkflow.messageTemplate}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Delivered Total</div>
                  <div className="text-lg font-black text-emerald-900">{previewWorkflow.stats.delivered}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Read & Opened</div>
                  <div className="text-lg font-black text-blue-900">{previewWorkflow.stats.openedOrRead}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSimWorkflowId(previewWorkflow.id);
                  setPreviewWorkflow(null);
                  setActiveSubTab('simulator');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Test This Trigger
              </button>
              <button
                onClick={() => setPreviewWorkflow(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOMER FLOW RULE BUILDER MODAL */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowRuleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Customer Flow Engine
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingRule ? 'Edit Communication Rule' : 'Configure Customer Flow Communication Rule'}
              </h3>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Step 1: Welcome Kit WhatsApp Dispatch on Registration"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Customer Flow Event
                  </label>
                  <select
                    value={ruleEvent}
                    onChange={(e) => setRuleEvent(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="student_registration">Step 1: Student Registration Intake</option>
                    <option value="course_enrollment">Step 2: Course Enrolled & Active</option>
                    <option value="payment_reminder">Step 3: Fee Payment / Deposit Alert</option>
                    <option value="class_start_24h">Step 4: Class 24h Countdown</option>
                    <option value="class_start_1h">Step 5: Class 1h Emergency Alert</option>
                    <option value="pending_enrollment_24h">Drop-off: Incomplete Intake (24h Nudge)</option>
                    <option value="incomplete_registration_48h">Drop-off: Incomplete Registration (48h)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Channel
                  </label>
                  <select
                    value={ruleChannel}
                    onChange={(e) => setRuleChannel(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="WhatsApp">WhatsApp Gateway</option>
                    <option value="Email">Email (SMTP / SendGrid)</option>
                    <option value="SMS">SMS Gateway</option>
                    <option value="Multi-Channel">Multi-Channel (Omni-channel)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Workflow Category
                  </label>
                  <select
                    value={ruleCategory}
                    onChange={(e) => setRuleCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Welcome & Onboarding">Welcome &amp; Onboarding</option>
                    <option value="Class & Schedule Alerts">Class &amp; Schedule Alerts</option>
                    <option value="Enrollment Follow-ups">Enrollment Follow-ups</option>
                    <option value="Payment & Retention">Payment &amp; Retention</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dispatch Delay (Minutes, 0 = Instant)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={ruleDelay}
                    onChange={(e) => setRuleDelay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Line / Notification Header
                </label>
                <input
                  type="text"
                  required
                  value={ruleSubject}
                  onChange={(e) => setRuleSubject(e.target.value)}
                  placeholder="e.g. Willkommen to ILAS! Your Student Portal is Ready 🚀"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Template Copy
                </label>
                <textarea
                  rows={4}
                  required
                  value={ruleTemplate}
                  onChange={(e) => setRuleTemplate(e.target.value)}
                  placeholder="Hallo {{name}}, Herzlich Willkommen! Your course {{course}} is scheduled. Access your dashboard at {{portal_link}}."
                  className="w-full px-3.5 py-2 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
                <span className="text-[10px] text-slate-400">
                  Supported tokens: <code className="text-indigo-600 font-bold">{"{{name}}"}</code>, <code className="text-indigo-600 font-bold">{"{{course}}"}</code>, <code className="text-indigo-600 font-bold">{"{{time}}"}</code>, <code className="text-indigo-600 font-bold">{"{{tutor}}"}</code>
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingRule ? 'Update Rule' : 'Save Communication Rule'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default AutomatedCommTriggersHub;
