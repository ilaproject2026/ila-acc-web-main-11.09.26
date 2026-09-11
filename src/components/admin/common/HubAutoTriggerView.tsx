import React, { useState, useEffect } from 'react';
import { 
  Radio, Clock, Send, Play, CheckCircle2, 
  MessageSquare, Mail, AlertTriangle, 
  Filter, Plus, Power, RefreshCw, Smartphone, 
  Settings, Check
} from 'lucide-react';
import { 
  FollowUpAutoTriggerItem, 
  getFollowUpAutoTriggers, 
  saveFollowUpAutoTrigger, 
  toggleAutoTriggerStatus, 
  simulateTriggerExecution 
} from '../../../lib/db';

interface HubAutoTriggerViewProps {
  departmentName: string;
  defaultEventTypes?: { key: string; label: string }[];
}

export const HubAutoTriggerView: React.FC<HubAutoTriggerViewProps> = ({
  departmentName,
  defaultEventTypes = [
    { key: 'incomplete_enrollment', label: 'Incomplete Registration / Drop-off' },
    { key: 'pending_payment', label: 'Pending Fee / Stipend Sign-off' },
    { key: 'document_pending', label: 'Missing Passport / Dossier Docs' },
    { key: 'profile_dropoff', label: 'Interview Prep / Resume Idle' }
  ]
}) => {
  const [triggers, setTriggers] = useState<FollowUpAutoTriggerItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  // Create / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<FollowUpAutoTriggerItem | null>(null);

  // Form State
  const [triggerName, setTriggerName] = useState('');
  const [eventType, setEventType] = useState<FollowUpAutoTriggerItem['eventType']>('incomplete_enrollment');
  const [channel, setChannel] = useState<FollowUpAutoTriggerItem['channel']>('Both');
  const [delayHours, setDelayHours] = useState<number>(2);
  const [messageTemplate, setMessageTemplate] = useState('');

  // Simulation State
  const [simulatingTriggerId, setSimulatingTriggerId] = useState<string | null>(null);
  const [simulatedResult, setSimulatedResult] = useState<{ name: string; recipient: string; message: string; channel: string } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadTriggers = () => {
    const list = getFollowUpAutoTriggers(departmentName);
    setTriggers(list);
  };

  useEffect(() => {
    loadTriggers();
    const handleUpdate = () => loadTriggers();
    window.addEventListener('ilas-followup-triggers-changed', handleUpdate);
    return () => window.removeEventListener('ilas-followup-triggers-changed', handleUpdate);
  }, [departmentName]);

  const handleOpenCreate = () => {
    setEditingTrigger(null);
    setTriggerName('');
    setEventType('incomplete_enrollment');
    setChannel('Both');
    setDelayHours(2);
    setMessageTemplate(`Hi {name}! Complete your ${departmentName} application today to unlock your fast-track processing and support.`);
    setShowModal(true);
  };

  const handleOpenEdit = (t: FollowUpAutoTriggerItem) => {
    setEditingTrigger(t);
    setTriggerName(t.triggerName);
    setEventType(t.eventType);
    setChannel(t.channel);
    setDelayHours(t.delayHours);
    setMessageTemplate(t.messageTemplate);
    setShowModal(true);
  };

  const handleSaveTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerName || !messageTemplate) return;

    const newTrigger: FollowUpAutoTriggerItem = {
      id: editingTrigger ? editingTrigger.id : 'trig-' + Date.now(),
      department: departmentName,
      triggerName,
      eventType,
      channel,
      delayHours: Number(delayHours) || 2,
      messageTemplate,
      isActive: editingTrigger ? editingTrigger.isActive : true,
      executionCount: editingTrigger ? editingTrigger.executionCount : 0,
      lastTriggered: editingTrigger?.lastTriggered
    };

    saveFollowUpAutoTrigger(newTrigger);
    setShowModal(false);
    showToast(`Auto-Trigger "${triggerName}" configured successfully.`);
  };

  const handleToggle = (id: string) => {
    toggleAutoTriggerStatus(id);
    showToast('Trigger active status toggled.');
  };

  const handleSimulate = (trigger: FollowUpAutoTriggerItem) => {
    setSimulatingTriggerId(trigger.id);
    const updated = simulateTriggerExecution(trigger.id);
    
    // Create preview payload
    const mockStudent = { name: 'Karthik Sharma', phone: '+91 98450 12345', email: 'karthik.s@gmail.com', program: departmentName };
    const renderedMsg = trigger.messageTemplate
      .replace('{name}', mockStudent.name)
      .replace('{program}', mockStudent.program);

    setTimeout(() => {
      setSimulatedResult({
        name: trigger.triggerName,
        recipient: `${mockStudent.name} (${trigger.channel === 'Email' ? mockStudent.email : mockStudent.phone})`,
        message: renderedMsg,
        channel: trigger.channel
      });
      setSimulatingTriggerId(null);
    }, 600);
  };

  const filteredTriggers = selectedFilter === 'All' 
    ? triggers 
    : triggers.filter(t => t.eventType === selectedFilter);

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
            <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
              Automated Follow-Up Engine
            </span>
            <span className="text-xs text-slate-300 font-bold">Dept: {departmentName}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Lead Recovery & Incomplete Enrollment Triggers
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Automatically track incomplete registrations, pending payments, and unverified documents. Trigger instant WhatsApp and Email follow-ups to maximize conversions.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + Configure Auto-Trigger
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Automated Rules</span>
          <div className="text-2xl font-black text-slate-900">{triggers.filter(t => t.isActive).length} / {triggers.length} Active</div>
          <p className="text-xs text-slate-500">24/7 background listener</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Follow-ups Dispatched</span>
          <div className="text-2xl font-black text-brand-600">
            {triggers.reduce((sum, t) => sum + t.executionCount, 0)} Messages
          </div>
          <p className="text-xs text-emerald-600 font-bold">WhatsApp + Email Delivery</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Average Re-engagement Rate</span>
          <div className="text-2xl font-black text-emerald-600">38.4%</div>
          <p className="text-xs text-slate-500">Resumed within 24 hours</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avg Delay Window</span>
          <div className="text-2xl font-black text-indigo-600">2 to 6 Hours</div>
          <p className="text-xs text-slate-500">Configurable smart cadences</p>
        </div>
      </div>

      {/* Trigger Filters & Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Triggers ({triggers.length})
            </button>
            {defaultEventTypes.map(et => (
              <button
                key={et.key}
                onClick={() => setSelectedFilter(et.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === et.key ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-bold shrink-0">
            {filteredTriggers.length} Triggers in {departmentName}
          </span>
        </div>

        {/* Triggers List */}
        <div className="space-y-3">
          {filteredTriggers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No follow-up auto-triggers configured for this category yet. Click "+ Configure Auto-Trigger" to create one.
            </div>
          ) : (
            filteredTriggers.map((trig) => (
              <div 
                key={trig.id}
                className={`p-5 rounded-2xl border transition-all ${
                  trig.isActive ? 'bg-white border-slate-200 hover:border-brand-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${trig.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <h4 className="font-bold text-slate-900 text-sm">{trig.triggerName}</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {trig.eventType.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                      "{trig.messageTemplate}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Delay: {trig.delayHours} Hours Post Drop-off
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-brand-700">
                        {trig.channel === 'WhatsApp' ? <Smartphone className="w-3.5 h-3.5" /> :
                         trig.channel === 'Email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        Channel: {trig.channel}
                      </span>
                      <span>Dispatched: <strong className="text-slate-900">{trig.executionCount} times</strong></span>
                      {trig.lastTriggered && <span>Last: {trig.lastTriggered}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSimulate(trig)}
                      disabled={simulatingTriggerId === trig.id}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Test send simulation"
                    >
                      <Play className="w-3.5 h-3.5 fill-indigo-700" />
                      {simulatingTriggerId === trig.id ? 'Testing...' : 'Test Send'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(trig)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggle(trig.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        trig.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={trig.isActive ? 'Deactivate Trigger' : 'Activate Trigger'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Simulation Result Modal */}
      {simulatedResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-2 border-b pb-3 text-emerald-700 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Follow-Up Trigger Dispatched (Simulator)
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Trigger Rule:</span>
                <span className="font-black text-slate-900">{simulatedResult.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Recipient:</span>
                <span className="font-bold text-slate-800">{simulatedResult.recipient}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Channel:</span>
                <span className="font-bold text-indigo-700">{simulatedResult.channel} Direct Gateway</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">Message Preview:</span>
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl font-mono text-[11px] leading-relaxed">
                  {simulatedResult.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSimulatedResult(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Simulation
            </button>
          </div>
        </div>
      )}

      {/* Trigger Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                Auto-Trigger Configuration
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingTrigger ? 'Edit Follow-up Trigger' : 'Create New Follow-up Trigger'}
              </h3>
            </div>

            <form onSubmit={handleSaveTrigger} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Trigger Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Incomplete Checkout Reminder or Missing Passport Alert"
                  value={triggerName}
                  onChange={(e) => setTriggerName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="incomplete_enrollment">Incomplete Registration</option>
                    <option value="pending_payment">Pending Fee / Payment</option>
                    <option value="document_pending">Missing Documents</option>
                    <option value="profile_dropoff">Profile Inactive Drop-off</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="Both">WhatsApp + Email</option>
                    <option value="WhatsApp">WhatsApp Only</option>
                    <option value="Email">Email Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delay Before Dispatch (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={delayHours}
                  onChange={(e) => setDelayHours(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Template (Dynamic Variables: {'{name}'}, {'{program}'}) *</label>
                <textarea
                  rows={3}
                  required
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl cursor-pointer"
                >
                  Save Trigger ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
