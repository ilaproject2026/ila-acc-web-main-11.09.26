import React, { useState, useEffect } from 'react';
import { 
  Save, Edit, Trash2, BookOpen, Layers, Clock, CheckCircle, 
  FolderPlus, Tag, Plus, X, List, Shield, HelpCircle, Check, 
  ArrowRight, Sparkles, RefreshCw, Hash, Code
} from 'lucide-react';
import { 
  getGlobalCategories, setGlobalCategories, GlobalCategory,
  getGlobalPaths, setGlobalPaths, getGlobalBatches, setGlobalBatches, getGlobalCourses, setGlobalCourses,
  generateUniqueCode,
  GlobalPath, GlobalBatch, GlobalCourse 
} from '../../lib/db';

type TabType = 'CATEGORY' | 'SERVICE' | 'BATCH';

const ServicesAndBatches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('CATEGORY');
  
  // Lists State
  const [categoryList, setCategoryList] = useState<GlobalCategory[]>([]);
  const [serviceList, setServiceList] = useState<GlobalPath[]>([]);
  const [batchList, setBatchList] = useState<GlobalBatch[]>([]);
  const [courseList, setCourseList] = useState<GlobalCourse[]>([]);

  // Selected State for Editing
  const [selectedCategory, setSelectedCategory] = useState<GlobalCategory | null>(null);
  const [selectedService, setSelectedService] = useState<GlobalPath | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<GlobalBatch | null>(null);

  // Sub-Category Tag Input Temp State
  const [newSubCategoryTag, setNewSubCategoryTag] = useState('');
  
  // Batch Time Slot Temp State
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Auto-linked Course from Course Creator Navigation
  useEffect(() => {
    const loadData = () => {
      const dbCategories = getGlobalCategories();
      const dbPaths = getGlobalPaths();
      const dbBatches = getGlobalBatches();
      const dbCourses = getGlobalCourses();

      setCategoryList(dbCategories);
      setServiceList(dbPaths);
      setBatchList(dbBatches);
      setCourseList(dbCourses);

      // Check if navigated from Course Creator with a specific course context
      const navCourseStr = localStorage.getItem('ilas_active_nav_course');
      if (navCourseStr) {
        try {
          const navCourse = JSON.parse(navCourseStr);
          if (navCourse.courseId || navCourse.courseName) {
            const matched = dbCourses.find(c => c.id === navCourse.courseId || c.name === navCourse.courseName);
            if (matched) {
              setSelectedCategory(prev => prev || {
                id: 'new',
                name: matched.category || matched.name,
                code: generateUniqueCode('CAT', matched.category || matched.name),
                subCategories: matched.subCategory ? [matched.subCategory] : ['General Specialization'],
                description: `Curriculum taxonomy for ${matched.name}`,
                linkedCourseId: matched.id,
                linkedCourseName: matched.name
              });
            }
          }
        } catch (e) {
          // ignore
        }
      }
    };

    loadData();

    const handleCustomNav = (e: any) => {
      if (e.detail?.subTab) {
        setActiveTab(e.detail.subTab as TabType);
      }
      if (e.detail?.courseId || e.detail?.courseName) {
        const dbCourses = getGlobalCourses();
        const matched = dbCourses.find(c => c.id === e.detail.courseId || c.name === e.detail.courseName);
        if (matched) {
          setSelectedCategory({
            id: 'new',
            name: matched.category || matched.name,
            code: generateUniqueCode('CAT', matched.category || matched.name),
            subCategories: matched.subCategory ? [matched.subCategory] : ['General Specialization'],
            description: `Curriculum taxonomy for ${matched.name}`,
            linkedCourseId: matched.id,
            linkedCourseName: matched.name
          });
        }
      }
    };

    window.addEventListener('ilas-categories-changed', loadData);
    window.addEventListener('ilas-paths-changed', loadData);
    window.addEventListener('ilas-batches-changed', loadData);
    window.addEventListener('ilas-courses-changed', loadData);
    window.addEventListener('ilas-navigate-tab', handleCustomNav);

    return () => {
      window.removeEventListener('ilas-categories-changed', loadData);
      window.removeEventListener('ilas-paths-changed', loadData);
      window.removeEventListener('ilas-batches-changed', loadData);
      window.removeEventListener('ilas-courses-changed', loadData);
      window.removeEventListener('ilas-navigate-tab', handleCustomNav);
    };
  }, []);

  // Row selection handler
  const handleRowClick = (item: any) => {
    if (activeTab === 'CATEGORY') {
      setSelectedCategory(item as GlobalCategory);
      setNewSubCategoryTag('');
    } else if (activeTab === 'SERVICE') {
      setSelectedService(item as GlobalPath);
    } else {
      setSelectedBatch(item as GlobalBatch);
      setNewTimeSlot('');
    }
  };

  // Reset form handler
  const handleReset = () => {
    localStorage.removeItem('ilas_active_nav_course');
    if (activeTab === 'CATEGORY') {
      setSelectedCategory(null);
      setNewSubCategoryTag('');
    } else if (activeTab === 'SERVICE') {
      setSelectedService(null);
    } else {
      setSelectedBatch(null);
      setNewTimeSlot('');
    }
  };

  // Delete handler
  const handleDelete = () => {
    const confirmation = window.confirm("Are you sure you want to delete this record?");
    if (!confirmation) return;

    if (activeTab === 'CATEGORY' && selectedCategory) {
      const updated = categoryList.filter(c => c.id !== selectedCategory.id);
      setGlobalCategories(updated);
      setSelectedCategory(null);
      alert("Category deleted successfully.");
    } else if (activeTab === 'SERVICE' && selectedService) {
      const updated = serviceList.filter(s => s.id !== selectedService.id);
      setGlobalPaths(updated);
      setSelectedService(null);
      alert("Education Path deleted successfully.");
    } else if (activeTab === 'BATCH' && selectedBatch) {
      const updated = batchList.filter(b => b.id !== selectedBatch.id);
      setGlobalBatches(updated);
      setSelectedBatch(null);
      alert("Batch Slot deleted successfully.");
    }
  };

  // Sub-Category Tags Handlers
  const handleAddSubCategoryTag = () => {
    if (!newSubCategoryTag.trim()) return;
    const tagToAdd = newSubCategoryTag.trim();
    setSelectedCategory((prev: GlobalCategory | null) => {
      const cat = prev || { 
        id: 'new', 
        name: '', 
        subCategories: [], 
        description: '', 
        code: generateUniqueCode('CAT', 'New') 
      };
      if (cat.subCategories.includes(tagToAdd)) return cat;
      return { ...cat, subCategories: [...(cat.subCategories || []), tagToAdd] };
    });
    setNewSubCategoryTag('');
  };

  const handleRemoveSubCategoryTag = (index: number) => {
    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev) return prev;
      const updatedTags = [...(prev.subCategories || [])];
      updatedTags.splice(index, 1);
      return { ...prev, subCategories: updatedTags };
    });
  };

  // Time Slots Handlers
  const handleAddTimeSlot = () => {
    if (!newTimeSlot.trim()) return;
    setSelectedBatch((prev: GlobalBatch | null) => {
      const batch = prev || { 
        id: 'new', 
        name: '', 
        timings: [], 
        starting: '', 
        remarks: '', 
        code: generateUniqueCode('BAT', 'Slot') 
      };
      return { ...batch, timings: [...(batch.timings || []), newTimeSlot.trim()] };
    });
    setNewTimeSlot('');
  };

  const handleRemoveTimeSlot = (index: number) => {
    setSelectedBatch((prev: GlobalBatch | null) => {
      if (!prev) return prev;
      const newTimings = [...(prev.timings || [])];
      newTimings.splice(index, 1);
      return { ...prev, timings: newTimings };
    });
  };

  // Save handler for all tabs
  const handleSave = () => {
    if (activeTab === 'CATEGORY') {
      if (!selectedCategory || !selectedCategory.name.trim()) {
        alert("Validation Error: Please provide a Category Name.");
        return;
      }

      const generatedCode = selectedCategory.code?.trim() || generateUniqueCode('CAT', selectedCategory.name);

      const matchedCourse = courseList.find(c => c.id === selectedCategory.linkedCourseId);
      const catToSave: GlobalCategory = {
        id: selectedCategory.id && selectedCategory.id !== 'new' ? selectedCategory.id : `cat-${Math.random().toString(36).substring(2, 7)}`,
        name: selectedCategory.name.trim(),
        code: generatedCode,
        description: selectedCategory.description?.trim() || '',
        subCategories: selectedCategory.subCategories || [],
        linkedCourseId: selectedCategory.linkedCourseId || undefined,
        linkedCourseName: matchedCourse?.name || selectedCategory.linkedCourseName || undefined
      };

      if (selectedCategory.id && selectedCategory.id !== 'new') {
        const updated = categoryList.map(c => c.id === selectedCategory.id ? catToSave : c);
        setGlobalCategories(updated);
        alert(`Category "${catToSave.name}" [${catToSave.code}] updated successfully.`);
      } else {
        const updated = [...categoryList, catToSave];
        setGlobalCategories(updated);
        alert(`New Category "${catToSave.name}" [${catToSave.code}] created and added to directory.`);
      }

      // If linked with a course, automatically update the course's category in the DB
      if (selectedCategory.linkedCourseId) {
        const updatedCourses = courseList.map(c => {
          if (c.id === selectedCategory.linkedCourseId) {
            return {
              ...c,
              category: catToSave.name,
              subCategory: catToSave.subCategories.length > 0 ? catToSave.subCategories[0] : c.subCategory
            };
          }
          return c;
        });
        setGlobalCourses(updatedCourses);
      }

      localStorage.removeItem('ilas_active_nav_course');
      setSelectedCategory(null);
      setNewSubCategoryTag('');
    } else if (activeTab === 'SERVICE') {
      if (!selectedService || !selectedService.name || !selectedService.methods) {
        alert("Validation Error: Please provide Path Name and Training Method.");
        return;
      }

      const generatedCode = selectedService.code?.trim() || generateUniqueCode('PTH', selectedService.name);
      const matchedCourse = courseList.find(c => c.id === selectedService.linkedCourseId);
      const serviceToSave: GlobalPath = {
        ...selectedService,
        code: generatedCode,
        linkedCourseName: matchedCourse?.name || (selectedService.linkedCourseId ? selectedService.linkedCourseName : undefined)
      };

      if (selectedService.id && selectedService.id !== 'new') {
        const updated = serviceList.map(s => s.id === selectedService.id ? serviceToSave : s);
        setGlobalPaths(updated);
        alert(`Education Path "${serviceToSave.name}" [${serviceToSave.code}] updated successfully.`);
      } else {
        const newService: GlobalPath = { 
          ...serviceToSave, 
          id: Math.random().toString(36).substring(2, 9) 
        };
        const updated = [...serviceList, newService];
        setGlobalPaths(updated);
        alert(`New Education Path "${newService.name}" [${newService.code}] appended to directory.`);
      }
      setSelectedService(null);
    } else {
      if (!selectedBatch || !selectedBatch.name) {
        alert("Validation Error: Please provide a Batch Name.");
        return;
      }

      const generatedCode = selectedBatch.code?.trim() || generateUniqueCode('BAT', selectedBatch.name);
      const matchedCourse = courseList.find(c => c.id === selectedBatch.linkedCourseId);
      const matchedPath = serviceList.find(p => p.id === selectedBatch.linkedPathId);
      const batchToSave: GlobalBatch = {
        ...selectedBatch,
        code: generatedCode,
        linkedCourseName: matchedCourse?.name || (selectedBatch.linkedCourseId ? selectedBatch.linkedCourseName : undefined),
        linkedPathName: matchedPath?.name || (selectedBatch.linkedPathId ? selectedBatch.linkedPathName : undefined),
        timings: selectedBatch.timings || []
      };

      if (selectedBatch.id && selectedBatch.id !== 'new') {
        const updated = batchList.map(b => b.id === selectedBatch.id ? batchToSave : b);
        setGlobalBatches(updated);
        alert(`Batch Slot "${batchToSave.name}" [${batchToSave.code}] updated successfully.`);
      } else {
        const newBatch: GlobalBatch = { 
          ...batchToSave, 
          id: Math.random().toString(36).substring(2, 9) 
        };
        const updated = [...batchList, newBatch];
        setGlobalBatches(updated);
        alert(`New Batch Slot "${newBatch.name}" [${newBatch.code}] appended successfully.`);
      }
      setSelectedBatch(null);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 w-full flex flex-col gap-6 bg-slate-50 font-sans min-h-screen">
      
      {/* Header Tracking Bar */}
      <div className="bg-white border border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-semibold text-slate-600 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-900">CONSOLE:</span>
          <span className="bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-lg border border-brand-200 font-bold">PATH & BATCH OPERATIONS</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>LOGIN ID: <strong className="text-brand-700">ADM-001</strong></span>
          <span>ADMINISTRATOR: <strong className="text-brand-700">SUPER ADMIN</strong></span>
        </div>
      </div>

      {/* Sleek Navigation Tabs (No Step Numbers) */}
      <div className="flex border-b border-slate-200 px-2 pt-2 gap-2 bg-slate-100/70 rounded-t-2xl">
        
        {/* Tab 1: Category & Sub-Category */}
        <button
          onClick={() => { setActiveTab('CATEGORY'); handleReset(); }}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'CATEGORY'
              ? 'bg-white text-brand-900 border-brand-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-white/50'
          }`}
        >
          <FolderPlus className="w-4 h-4 text-brand-600" />
          <span>Category & Sub-Category</span>
          <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.2 rounded-full font-mono font-bold">
            {categoryList.length}
          </span>
        </button>
        
        {/* Tab 2: Education Path */}
        <button
          onClick={() => { setActiveTab('SERVICE'); handleReset(); }}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'SERVICE'
              ? 'bg-white text-brand-900 border-brand-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-white/50'
          }`}
        >
          <Layers className="w-4 h-4 text-brand-600" />
          <span>Education Path</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full font-mono font-bold">
            {serviceList.length}
          </span>
        </button>

        {/* Tab 3: Batch Slots */}
        <button
          onClick={() => { setActiveTab('BATCH'); handleReset(); }}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'BATCH'
              ? 'bg-white text-brand-900 border-brand-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-white/50'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-600" />
          <span>Batch Slots</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full font-mono font-bold">
            {batchList.length}
          </span>
        </button>
      </div>

      {/* Form & Configuration Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-5">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-lg md:text-xl font-black text-brand-900">
              {activeTab === 'CATEGORY' && 'Category & Sub-Category Taxonomy Engine'}
              {activeTab === 'SERVICE' && 'Education Path & Training Methodology'}
              {activeTab === 'BATCH' && 'Batch Slots & Interactive Timings'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'CATEGORY' && 'Define primary course categories, auto-generate unique taxonomy codes, and manage specialization tracks.'}
              {activeTab === 'SERVICE' && 'Configure delivery methods, unique path codes, validity dates, and link to specific courses.'}
              {activeTab === 'BATCH' && 'Configure batch slots, auto-generate batch codes, allocate interactive timings, and assign to a course.'}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            {activeTab === 'CATEGORY' ? 'Category Setup' : activeTab === 'SERVICE' ? 'Education Path' : 'Batch Slots'}
          </span>
        </div>
        
        {/* TAB 1: CATEGORY & SUB-CATEGORY FORM */}
        {activeTab === 'CATEGORY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Top Course Selection Dropdown (Auto-selected from Course Creator or Manual Selection) */}
            <div className="flex flex-col gap-1 md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  Select Course (Auto-Linked from Course Creator or Manual)
                </label>
                {selectedCategory?.linkedCourseId ? (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Linked to {selectedCategory.linkedCourseName || 'Course'}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">Optional Course Link</span>
                )}
              </div>

              <select
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer mt-1"
                value={selectedCategory?.linkedCourseId || ''}
                onChange={(e) => {
                  const cId = e.target.value;
                  const matched = courseList.find(c => c.id === cId);
                  setSelectedCategory((prev: GlobalCategory | null) => {
                    const current = prev || { 
                      id: 'new', 
                      name: '', 
                      subCategories: [], 
                      description: '', 
                      code: '' 
                    };
                    return {
                      ...current,
                      linkedCourseId: cId || undefined,
                      linkedCourseName: matched?.name || undefined,
                      name: current.name || (matched?.category || matched?.name || ''),
                      code: current.code || generateUniqueCode('CAT', matched?.category || matched?.name || 'GEN')
                    };
                  });
                }}
              >
                <option value="">-- Optional: Assign to All Courses / Global Taxonomy --</option>
                {courseList.map(c => (
                  <option key={c.id} value={c.id}>
                    📚 {c.name} {c.category ? `[${c.category}]` : ''} {c.top_title ? `(${c.top_title})` : ''}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500">
                Linking a course directly auto-assigns this category taxonomy to the course upon saving.
              </span>
            </div>

            {/* Category Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Category Name *</label>
              <div className="relative">
                <FolderPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 text-xs font-medium focus:ring-1 focus:ring-brand-500" 
                  placeholder="e.g. Education & Languages / Software & IT Training" 
                  value={selectedCategory?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategory((prev: GlobalCategory | null) => {
                      const current = prev || { id: 'new', name: '', subCategories: [], description: '', code: '' };
                      return {
                        ...current,
                        name: val,
                        code: current.code || generateUniqueCode('CAT', val)
                      };
                    });
                  }}
                />
              </div>
            </div>

            {/* Auto-Generated Category Code with Regenerate Action */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-brand-600" />
                  Category Code (Auto-Generated)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateUniqueCode('CAT', selectedCategory?.name || 'GEN');
                    setSelectedCategory(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', code: newCode, subCategories: [], description: '' });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"
                  title="Generate New Unique Code"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate
                </button>
              </div>

              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-900 bg-slate-50 focus:ring-1 focus:ring-brand-500 uppercase tracking-wider" 
                placeholder="e.g. CAT-LANG-402 / CAT-TECH-109" 
                value={selectedCategory?.code || ''}
                onChange={(e) => setSelectedCategory((prev: GlobalCategory | null) => prev ? {...prev, code: e.target.value.toUpperCase()} : { id: 'new', name: '', code: e.target.value.toUpperCase(), subCategories: [], description: '' })}
              />
            </div>

            {/* Sub-Categories Tag Manager */}
            <div className="flex flex-col gap-2 md:col-span-2 bg-brand-50/40 p-4 rounded-xl border border-brand-200/70">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-brand-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-brand-600" />
                  Sub-Categories & Specializations
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedCategory?.subCategories?.length || 0} Specializations Linked
                </span>
              </div>

              {/* Add Sub-Category Tag Input */}
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={newSubCategoryTag}
                  onChange={(e) => setNewSubCategoryTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubCategoryTag(); } }}
                  placeholder="Type sub-category specialization (e.g. German Language A1–C2) and click Add..."
                  className="flex-1 border border-slate-300 rounded-xl p-2 text-xs bg-white focus:ring-1 focus:ring-brand-500 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddSubCategoryTag}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Track
                </button>
              </div>

              {/* Tag Badges List */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedCategory?.subCategories?.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-900 text-xs font-bold shadow-2xs"
                  >
                    <span>🏷️ {tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSubCategoryTag(idx)} 
                      className="text-slate-400 hover:text-red-600 cursor-pointer font-bold ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No sub-categories assigned yet. Type above and click Add Track.</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Category Description & Scope</label>
              <textarea 
                rows={2}
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                placeholder="Scope of courses, career pathways, and industry certifications..." 
                value={selectedCategory?.description || ''}
                onChange={(e) => setSelectedCategory((prev: GlobalCategory | null) => prev ? {...prev, description: e.target.value} : { id: 'new', name: '', description: e.target.value, subCategories: [], code: '' })}
              />
            </div>

          </div>
        )}

        {/* TAB 2: SERVICE TAB FORM (EDUCATION PATH) */}
        {activeTab === 'SERVICE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Associated Course Selector */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                Select Course (Assign to Course)
              </label>
              <select
                className="w-full border-2 border-brand-300 rounded-xl p-2.5 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-semibold text-slate-800 cursor-pointer"
                value={selectedService?.linkedCourseId || ''}
                onChange={(e) => {
                  const cId = e.target.value;
                  const cMatch = courseList.find(c => c.id === cId);
                  setSelectedService((prev: GlobalPath | null) => prev 
                    ? { ...prev, linkedCourseId: cId, linkedCourseName: cMatch?.name } 
                    : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: generateUniqueCode('PTH', 'Path'), linkedCourseId: cId, linkedCourseName: cMatch?.name }
                  );
                }}
              >
                <option value="">-- Optional: Assign to All Courses / General --</option>
                {courseList.map(c => (
                  <option key={c.id} value={c.id}>
                    📚 {c.name} {c.category ? `[${c.category}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Path Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Education Path Name *</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="e.g. Premium IELTS Path / Live Class Path" 
                value={selectedService?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedService((prev: GlobalPath | null) => {
                    const current = prev || { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: '' };
                    return {
                      ...current,
                      name: val,
                      code: current.code || generateUniqueCode('PTH', val)
                    };
                  });
                }}
              />
            </div>

            {/* Auto-Generated Path Code */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-brand-600" />
                  Path Code (Auto-Generated)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateUniqueCode('PTH', selectedService?.name || 'PATH');
                    setSelectedService(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: newCode });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate
                </button>
              </div>

              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-900 bg-slate-50 focus:ring-1 focus:ring-brand-500 uppercase" 
                placeholder="e.g. PTH-INTE-602" 
                value={selectedService?.code || ''}
                onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, code: e.target.value.toUpperCase()} : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Training Method */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Training Method *</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                placeholder="e.g. Hybrid, Online / AI + Adaptive" 
                value={selectedService?.methods || ''}
                onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, methods: e.target.value} : { id: 'new', name: '', methods: e.target.value, starting: '', ending: '', remarks: '', code: '' })}
              />
            </div>

            {/* Dates */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-slate-700">Starting From</label>
                <input 
                  type="date" 
                  className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                  value={selectedService?.starting || ''}
                  onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, starting: e.target.value} : { id: 'new', name: '', methods: '', starting: e.target.value, ending: '', remarks: '', code: '' })}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-slate-700">Ending / Valid Till</label>
                <input 
                  type="date" 
                  className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                  value={selectedService?.ending || ''}
                  onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, ending: e.target.value} : { id: 'new', name: '', methods: '', starting: '', ending: e.target.value, remarks: '', code: '' })}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Remarks & Details</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                placeholder="Full details, syllabus milestones, and delivery package..." 
                value={selectedService?.remarks || ''}
                onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, remarks: e.target.value} : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: e.target.value, code: '' })}
              />
            </div>
          </div>
        )}

        {/* TAB 3: BATCH TAB FORM */}
        {activeTab === 'BATCH' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Linked Course Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                Select Course (Assign to Course)
              </label>
              <select
                className="border-2 border-brand-300 rounded-xl p-2.5 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-semibold text-slate-800 cursor-pointer"
                value={selectedBatch?.linkedCourseId || ''}
                onChange={(e) => {
                  const cId = e.target.value;
                  const cMatch = courseList.find(c => c.id === cId);
                  setSelectedBatch((prev: GlobalBatch | null) => prev 
                    ? { ...prev, linkedCourseId: cId, linkedCourseName: cMatch?.name } 
                    : { id: 'new', name: '', timings: [], starting: '', remarks: '', code: generateUniqueCode('BAT', cMatch?.name || 'Slot'), linkedCourseId: cId, linkedCourseName: cMatch?.name }
                  );
                }}
              >
                <option value="">-- Select Course --</option>
                {courseList.map(c => (
                  <option key={c.id} value={c.id}>
                    📚 {c.name} {c.top_title ? `(${c.top_title})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Linked Education Path */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600" />
                Select Education Path
              </label>
              <select
                className="border-2 border-brand-300 rounded-xl p-2.5 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-semibold text-slate-800 cursor-pointer"
                value={selectedBatch?.linkedPathId || ''}
                onChange={(e) => {
                  const pId = e.target.value;
                  const pMatch = serviceList.find(p => p.id === pId);
                  setSelectedBatch((prev: GlobalBatch | null) => prev 
                    ? { ...prev, linkedPathId: pId, linkedPathName: pMatch?.name } 
                    : { id: 'new', name: '', timings: [], starting: '', remarks: '', code: generateUniqueCode('BAT', pMatch?.name || 'Slot'), linkedPathId: pId, linkedPathName: pMatch?.name }
                  );
                }}
              >
                <option value="">-- Select Education Path --</option>
                {serviceList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.methods}]
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Batch Name *</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="e.g. Morning Batch A1 / Weekend Bootcamp" 
                value={selectedBatch?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedBatch((prev: GlobalBatch | null) => {
                    const current = prev || { id: 'new', name: '', timings: [], starting: '', remarks: '', code: '' };
                    return {
                      ...current,
                      name: val,
                      code: current.code || generateUniqueCode('BAT', val)
                    };
                  });
                }}
              />
            </div>

            {/* Auto-Generated Batch Code */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-brand-600" />
                  Batch Slot Code (Auto-Generated)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateUniqueCode('BAT', selectedBatch?.name || 'BATCH');
                    setSelectedBatch(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', timings: [], starting: '', remarks: '', code: newCode });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate
                </button>
              </div>

              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-900 bg-slate-50 focus:ring-1 focus:ring-brand-500 uppercase" 
                placeholder="e.g. BAT-MORN-801" 
                value={selectedBatch?.code || ''}
                onChange={(e) => setSelectedBatch((prev: GlobalBatch | null) => prev ? {...prev, code: e.target.value.toUpperCase()} : { id: 'new', name: '', timings: [], starting: '', remarks: '', code: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Starting Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Starting Date</label>
              <input 
                type="date" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                value={selectedBatch?.starting || ''}
                onChange={(e) => setSelectedBatch((prev: GlobalBatch | null) => prev ? {...prev, starting: e.target.value} : { id: 'new', name: '', timings: [], starting: e.target.value, remarks: '', code: '' })}
              />
            </div>

            {/* Interactive Time Slots Config */}
            <div className="flex flex-col gap-2 md:col-span-2 bg-indigo-50/40 p-4 rounded-xl border border-indigo-200/70">
              <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                 <Clock className="w-4 h-4 text-indigo-600" /> Interactive Time Slots Config
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                <input 
                  type="time" 
                  id="startTimeInput"
                  className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28" 
                  onChange={(e) => {
                    const endVal = (document.getElementById('endTimeInput') as HTMLInputElement)?.value || '';
                    setNewTimeSlot(`${e.target.value} - ${endVal}`);
                  }}
                />
                <span className="font-bold text-slate-400 text-xs">TO</span>
                <input 
                  type="time" 
                  id="endTimeInput"
                  className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28" 
                  onChange={(e) => {
                    const startVal = (document.getElementById('startTimeInput') as HTMLInputElement)?.value || '';
                    setNewTimeSlot(`${startVal} - ${e.target.value}`);
                  }}
                />
                <button 
                  type="button"
                  onClick={handleAddTimeSlot} 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  + Add Slot
                </button>
              </div>
              
              {/* Render Selected Slots */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedBatch?.timings?.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                     <span>⏰ {time}</span>
                     <button type="button" onClick={() => handleRemoveTimeSlot(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer font-bold ml-1">×</button>
                  </div>
                ))}
                {(!selectedBatch?.timings || selectedBatch.timings.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No slots added. Select times and click Add Slot.</span>
                )}
              </div>
            </div>

            {/* Batch Remarks */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Batch Remarks & Capacity</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500" 
                placeholder="e.g. Fast Filling, Open for Enrollment..." 
                value={selectedBatch?.remarks || ''}
                onChange={(e) => setSelectedBatch((prev: GlobalBatch | null) => prev ? {...prev, remarks: e.target.value} : { id: 'new', name: '', timings: [], starting: '', remarks: e.target.value, code: '' })}
              />
            </div>
          </div>
        )}

        {/* Global Save Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleReset} 
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" /> RESET FORM
          </button>

          <button 
            onClick={handleDelete} 
            disabled={
              (activeTab === 'CATEGORY' && !selectedCategory) ||
              (activeTab === 'SERVICE' && !selectedService) || 
              (activeTab === 'BATCH' && !selectedBatch)
            } 
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> DELETE
          </button>

          <button 
            onClick={handleSave} 
            className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> SAVE RECORD
          </button>
        </div>

      </div>

      {/* Directory Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 overflow-hidden flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-black text-slate-900">
            {activeTab === 'CATEGORY' && 'Directory of Categories & Sub-Categories'}
            {activeTab === 'SERVICE' && 'Directory of Education Paths'}
            {activeTab === 'BATCH' && 'Directory of Batch Slots & Timings'}
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Total {activeTab === 'CATEGORY' ? categoryList.length : activeTab === 'SERVICE' ? serviceList.length : batchList.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            
            {/* 1. Category Table */}
            {activeTab === 'CATEGORY' && (
              <>
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Category Name</th>
                    <th className="px-4 py-3">Unique Code</th>
                    <th className="px-4 py-3">Linked Course</th>
                    <th className="px-4 py-3">Sub-Categories / Specializations</th>
                    <th className="px-4 py-3">Course Count</th>
                    <th className="px-4 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {categoryList.map((cat) => {
                    const isSelected = selectedCategory?.id === cat.id;
                    const linkedCoursesCount = courseList.filter(c => c.category === cat.name || c.name.toLowerCase().includes(cat.name.toLowerCase())).length;

                    return (
                      <tr 
                        key={cat.id} 
                        onClick={() => handleRowClick(cat)} 
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-brand-50/80 ring-1 ring-brand-300 font-semibold' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-brand-900">
                          📁 {cat.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono text-[10px] font-bold border border-indigo-200">
                            {cat.code || generateUniqueCode('CAT', cat.name)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {cat.linkedCourseName ? (
                            <span className="font-bold text-slate-900">📚 {cat.linkedCourseName}</span>
                          ) : (
                            <span className="text-slate-400 italic">All / Global</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap max-w-md">
                            {cat.subCategories?.map((sub, sIdx) => (
                              <span key={sIdx} className="bg-brand-50 text-brand-800 text-[10px] px-2 py-0.5 rounded-full font-medium border border-brand-200/60">
                                {sub}
                              </span>
                            ))}
                            {(!cat.subCategories || cat.subCategories.length === 0) && (
                              <span className="text-slate-400 italic text-[11px]">No sub-categories</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">
                          {linkedCoursesCount} Courses
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRowClick(cat); }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-600 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {/* 2. Service (Education Path) Table */}
            {activeTab === 'SERVICE' && (
              <>
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Path Name</th>
                    <th className="px-4 py-3">Unique Code</th>
                    <th className="px-4 py-3">Linked Course</th>
                    <th className="px-4 py-3">Methods</th>
                    <th className="px-4 py-3">Starting</th>
                    <th className="px-4 py-3">Ending</th>
                    <th className="px-4 py-3 rounded-tr-xl">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {serviceList.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => handleRowClick(item)} 
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedService?.id === item.id ? 'bg-brand-50 ring-1 ring-brand-200' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-brand-700">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono text-[10px] font-bold border border-indigo-200">
                          {item.code || generateUniqueCode('PTH', item.name)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                        {item.linkedCourseName ? `📚 ${item.linkedCourseName}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.methods}</td>
                      <td className="px-4 py-3 text-slate-600">{item.starting}</td>
                      <td className="px-4 py-3 text-slate-600">{item.ending || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-500">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* 3. Batch Slots Table */}
            {activeTab === 'BATCH' && (
              <>
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Batch Name</th>
                    <th className="px-4 py-3">Unique Code</th>
                    <th className="px-4 py-3">Linked Course</th>
                    <th className="px-4 py-3">Linked Path</th>
                    <th className="px-4 py-3">Allocated Time Slots</th>
                    <th className="px-4 py-3">Starting</th>
                    <th className="px-4 py-3 rounded-tr-xl">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {batchList.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => handleRowClick(item)} 
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedBatch?.id === item.id ? 'bg-brand-50 ring-1 ring-brand-200' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-brand-700">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono text-[10px] font-bold border border-indigo-200">
                          {item.code || generateUniqueCode('BAT', item.name)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                        {item.linkedCourseName ? `📚 ${item.linkedCourseName}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{item.linkedPathName || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {item.timings?.map((t, idx) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.starting}</td>
                      <td className="px-4 py-3 text-slate-500">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

          </table>
        </div>
      </div>

    </div>
  );
};

export default ServicesAndBatches;