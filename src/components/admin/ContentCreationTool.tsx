import React, { useState } from 'react';
import { PenTool, Send, Sparkles, UploadCloud, CheckCircle2, Clock } from 'lucide-react';
import { addGlobalApproval, addGlobalUpdate } from '../../lib/db';

interface ContentCreationToolProps {
  departmentName: string;
}

export default function ContentCreationTool({ departmentName }: ContentCreationToolProps) {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [platform, setPlatform] = useState('WhatsApp');
  
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitted'>('idle');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(`Special Update from ${departmentName}!\n\n${topic}\n\nJoin us at ILA Global to experience top-tier services and continuous growth. Click the link below to get started and talk to our experts today!\n\nhttps://ilaglobal.com/apply\n\n#ILAGlobal #${departmentName.replace(/\s+/g, '')} #CareerGrowth`);
      setIsGenerating(false);
      setSubmissionStatus('idle');
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaUploaded(true);
    }
  };

  const handleSubmitForApproval = () => {
    if (!generatedContent && !mediaUploaded) return;
    setSubmissionStatus('submitted');
    
    addGlobalApproval({
      type: 'General',
      description: `New content submission for ${platform}`,
      requestedBy: 'Staff Member',
      department: departmentName
    });

    addGlobalUpdate({
      action: 'Content Submitted',
      details: `New promotional campaign drafted and submitted for approval.`,
      user: 'Staff Member',
      department: departmentName,
      category: 'Content'
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm mt-6">
      <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
        <PenTool className="w-5 h-5 text-indigo-600" />
        Content Creation & Brand Marketing Submissions - {departmentName}
      </h3>
      <p className="text-xs text-slate-500">
        Generate promotional text or upload brochures/images. All franchise and departmental content must route through the HQ Approval Hierarchy before public sharing.
      </p>

      <form onSubmit={handleGenerate} className="space-y-3 bg-slate-50 p-4 rounded-2xl border text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Platform / Campaign Type</label>
          <div className="flex gap-2 flex-wrap">
            {['WhatsApp', 'LinkedIn', 'Facebook', 'Instagram'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  platform === p ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Promo Topic / Description</label>
          <input 
            type="text" 
            required 
            placeholder="e.g., New fast-track admission process for August..." 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            className="w-full p-2.5 border rounded-xl bg-white outline-none focus:border-indigo-500" 
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="submit" 
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Generate Text'}
          </button>
          
          <label className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
            <UploadCloud className="w-4 h-4" />
            {mediaUploaded ? 'Media Attached' : 'Upload Brochure / Video'}
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </form>

      {generatedContent && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-medium text-slate-800 whitespace-pre-wrap">
            {generatedContent}
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            {submissionStatus === 'idle' ? (
              <button 
                onClick={handleSubmitForApproval}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" /> Submit to Marketing Head for Approval
              </button>
            ) : (
              <div className="w-full sm:w-auto px-6 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-sm">
                <Clock className="w-4 h-4 text-emerald-600" /> Content in Approval Queue
              </div>
            )}
          </div>
        </div>
      )}
      
      {submissionStatus === 'submitted' && (
        <div className="text-[10px] text-slate-500 flex items-start gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Your content is pending multi-level approval. Once approved, a ready-to-broadcast copy will be routed to your registered WhatsApp mobile number.</span>
        </div>
      )}
    </div>
  );
}