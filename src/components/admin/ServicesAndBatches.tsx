import React, { useState, useEffect } from 'react';
import { 
  Save, Edit, Trash2, BookOpen, Layers, Clock, CheckCircle, 
  FolderPlus, Tag, Plus, X, List, Shield, HelpCircle, Check, 
  ArrowRight, Sparkles, RefreshCw, Hash, Code, ToggleLeft, ToggleRight, Calendar, Zap
} from 'lucide-react';
import { 
  getGlobalCategories, setGlobalCategories, GlobalCategory,
  getGlobalPaths, setGlobalPaths, getGlobalBatches, setGlobalBatches, getGlobalCourses, setGlobalCourses,
  generateUniqueCode,
  GlobalPath, GlobalBatch, GlobalCourse 
} from '../../lib/db';
import CourseCreator from './CourseCreator';

export type TabType = 'CATEGORY' | 'SERVICE' | 'BATCH' | 'COURSE';

interface ServicesAndBatchesProps {
  initialTab?: TabType;
  onNavigateTab?: (tabName: string) => void;
}

export const ServicesAndBatches: React.FC<ServicesAndBatchesProps> = ({ initialTab = 'CATEGORY', onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
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

  // Wizard Inheritance State across Steps 1 -> 2 -> 3 -> 4
  const [wizardCategory, setWizardCategory] = useState<string>('Education & Languages');
  const [wizardSubCategory, setWizardSubCategory] = useState<string>('German Language (A1–C2)');
  const [wizardPathId, setWizardPathId] = useState<string>('');
  const [wizardBatchId, setWizardBatchId] = useState<string>('');
  const [batchNotApplicable, setBatchNotApplicable] = useState<boolean>(false);

  // Quick inline creation states for Step 1
  const [showInlineNewCategory, setShowInlineNewCategory] = useState<boolean>(false);
  const [showInlineNewTrack, setShowInlineNewTrack] = useState<boolean>(false);
  const [inlineCategoryName, setInlineCategoryName] = useState<string>('');
  const [inlineCategoryCode, setInlineCategoryCode] = useState<string>('');
  const [inlineTrackName, setInlineTrackName] = useState<string>('');
  const [inlineTrackCode, setInlineTrackCode] = useState<string>('');

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

      // Synchronize wizard state
      setWizardCategory(catToSave.name);
      if (catToSave.subCategories && catToSave.subCategories.length > 0) {
        setWizardSubCategory(catToSave.subCategories[0]);
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
        setWizardPathId(serviceToSave.id);
      } else {
        const newService: GlobalPath = { 
          ...serviceToSave, 
          id: Math.random().toString(36).substring(2, 9) 
        };
        const updated = [...serviceList, newService];
        setGlobalPaths(updated);
        alert(`New Education Path "${newService.name}" [${newService.code}] appended to directory.`);
        setWizardPathId(newService.id);
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
        setWizardBatchId(batchToSave.id);
      } else {
        const newBatch: GlobalBatch = { 
          ...batchToSave, 
          id: Math.random().toString(36).substring(2, 9) 
        };
        const updated = [...batchList, newBatch];
        setGlobalBatches(updated);
        alert(`New Batch Slot "${newBatch.name}" [${newBatch.code}] appended successfully.`);
        setWizardBatchId(newBatch.id);
      }
      setSelectedBatch(null);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 w-full flex flex-col gap-6 bg-slate-50 font-sans min-h-screen">
      
      {/* 4-Stage Sequential Creation Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { key: 'CATEGORY', stage: 'Stage 1', title: 'Category & Tracks', desc: 'Taxonomy & Codes', count: categoryList.length, icon: FolderPlus },
            { key: 'SERVICE', stage: 'Stage 2', title: 'Education & Paths', desc: 'Methodologies & Dates', count: serviceList.length, icon: Layers },
            { key: 'BATCH', stage: 'Stage 3', title: 'Batches & Slots', desc: batchNotApplicable ? 'Open-Schedule (Active)' : 'Timings & Schedules', count: batchList.length, icon: Clock },
            { key: 'COURSE', stage: 'Stage 4', title: 'Course Creator Studio', desc: 'Curriculum & Publishing', count: courseList.length, icon: BookOpen },
          ].map((item) => {
            const isCurrent = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key as TabType);
                  if (item.key !== 'COURSE') handleReset();
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm ring-2 ring-brand-500/20'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  isCurrent ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-brand-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-brand-200' : 'text-brand-600'}`}>
                      {item.stage}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="text-xs font-black truncate">
                    {item.title}
                  </div>
                  <div className={`text-[10px] truncate ${isCurrent ? 'text-brand-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Step 4: Course Creator Studio */}
      {activeTab === 'COURSE' ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <CourseCreator 
            inheritedCategory={wizardCategory}
            inheritedSubCategory={wizardSubCategory}
            inheritedPathId={wizardPathId}
            inheritedBatchId={wizardBatchId}
            batchNotApplicable={batchNotApplicable}
            isWizardMode={true}
            onNavigateTab={(tabName, subTab) => {
              if (tabName === 'SERVICES & BATCHES') {
                if (subTab === 'CATEGORY') setActiveTab('CATEGORY');
                else if (subTab === 'SERVICE') setActiveTab('SERVICE');
                else if (subTab === 'BATCH') setActiveTab('BATCH');
                else setActiveTab('CATEGORY');
              } else if (tabName === 'LIBRARY & CLASS ROOM' || tabName === 'ADMIN LIBRARY') {
                onNavigateTab?.('ADMIN LIBRARY');
              } else {
                onNavigateTab?.(tabName);
              }
            }} 
          />
        </div>
      ) : (
        <>
          {/* Form & Configuration Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-5">
            
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h2 className="text-lg md:text-xl font-black text-brand-900">
                  {activeTab === 'CATEGORY' && 'Step 1: Category & Sub-Category (Track)'}
                  {activeTab === 'SERVICE' && 'Step 2: Education Path & Training Methodology'}
                  {activeTab === 'BATCH' && 'Step 3: Batch & Slot Creation'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeTab === 'CATEGORY' && 'Define primary course categories, inline create tracks, auto-generate taxonomy codes, and save records.'}
                  {activeTab === 'SERVICE' && 'Inherit category from Step 1, configure delivery methods, starting dates, and generate connected path codes.'}
                  {activeTab === 'BATCH' && 'Link to category and path, configure time slots, or toggle Batch Not Applicable for open schedules.'}
                </p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                {activeTab === 'CATEGORY' ? 'Step 1: Categories' : activeTab === 'SERVICE' ? 'Step 2: Paths' : 'Step 3: Batches'}
              </span>
            </div>
        
        {/* TAB 1: CATEGORY & SUB-CATEGORY FORM */}
        {activeTab === 'CATEGORY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Quick Category Selection Dropdown with Inline '+' Action Button */}
            <div className="flex flex-col gap-1.5 md:col-span-2 bg-gradient-to-r from-slate-50 to-brand-50/40 p-4 rounded-xl border border-brand-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-brand-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <FolderPlus className="w-4 h-4 text-brand-600" />
                  Category Master Dropdown &amp; Quick Creator
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {categoryList.length} Categories Available
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = generateUniqueCode('CAT', 'New');
                      setSelectedCategory({
                        id: 'new',
                        name: '',
                        code: newCode,
                        subCategories: [],
                        description: ''
                      });
                      setShowInlineNewCategory(true);
                    }}
                    className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    title="Quick Add New Category"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <select
                  className="flex-1 border-2 border-brand-200 rounded-xl p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer shadow-2xs"
                  value={selectedCategory?.id || ''}
                  onChange={(e) => {
                    const catId = e.target.value;
                    if (!catId) {
                      setSelectedCategory(null);
                      return;
                    }
                    const matched = categoryList.find(c => c.id === catId);
                    if (matched) {
                      setSelectedCategory(matched);
                      setWizardCategory(matched.name);
                      if (matched.subCategories && matched.subCategories.length > 0) {
                        setWizardSubCategory(matched.subCategories[0]);
                      }
                    }
                  }}
                >
                  <option value="">-- Choose Category from Dropdown or click (+ Add Category) --</option>
                  {categoryList.map(c => (
                    <option key={c.id} value={c.id}>
                      📁 {c.name} [{c.code || 'CAT'}] — {c.subCategories?.length || 0} Tracks
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateUniqueCode('CAT', 'New');
                    setSelectedCategory({
                      id: 'new',
                      name: '',
                      code: newCode,
                      subCategories: [],
                      description: ''
                    });
                    setShowInlineNewCategory(true);
                  }}
                  className="px-3.5 py-2.5 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  title="Create fresh category"
                >
                  <Plus className="w-4 h-4 text-brand-600" />
                  <span className="hidden sm:inline">+ Add Category</span>
                </button>
              </div>

              {selectedCategory && (
                <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-800 bg-white/80 p-2 rounded-lg border border-brand-100 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Selected for Wizard Pipeline: <strong>{selectedCategory.name || 'Untitled'}</strong> (Code: <span className="font-mono font-bold text-indigo-700">{selectedCategory.code}</span>)</span>
                </div>
              )}
            </div>

            {/* Category Name Input */}
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
                    setWizardCategory(val);
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
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-all"
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

            {/* Sub-Categories (Tracks) Section with Dropdown & Inline '+' Creator */}
            <div className="flex flex-col gap-2.5 md:col-span-2 bg-brand-50/40 p-4 rounded-xl border border-brand-200/70">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-brand-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-brand-600" />
                  Sub-Category (Track) Dropdown &amp; Inline '+' Action
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedCategory?.subCategories?.length || 0} Tracks in Category
                </span>
              </div>

              {/* Track Selector Dropdown with inline + button */}
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 border border-brand-300 rounded-xl p-2.5 text-xs font-semibold bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer"
                  value={wizardSubCategory}
                  onChange={(e) => {
                    setWizardSubCategory(e.target.value);
                  }}
                >
                  <option value="">-- Select Active Track / Sub-Category --</option>
                  {selectedCategory?.subCategories?.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      🏷️ {sub}
                    </option>
                  ))}
                  {(!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0) && (
                    <option value="" disabled>No tracks yet - click (+ Add Track) beside</option>
                  )}
                </select>

                <button
                  type="button"
                  onClick={() => setShowInlineNewTrack(!showInlineNewTrack)}
                  className="px-3.5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all shadow-xs"
                  title="Add New Track to this Category"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Track</span>
                </button>
              </div>

              {/* Inline Track Creation Row */}
              {(showInlineNewTrack || !selectedCategory?.subCategories?.length) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-brand-200 shadow-2xs mt-1">
                  <div className="flex-1 min-w-[200px]">
                    <input 
                      type="text"
                      value={newSubCategoryTag}
                      onChange={(e) => {
                        setNewSubCategoryTag(e.target.value);
                        if (!inlineTrackCode && e.target.value) {
                          setInlineTrackCode(generateUniqueCode('TRK', e.target.value));
                        }
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubCategoryTag(); } }}
                      placeholder="Type track name (e.g. German A1–B2 Intensive / Full Stack MERN)..."
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded border border-brand-200">
                      {generateUniqueCode('TRK', newSubCategoryTag || 'Track')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSubCategoryTag.trim()) return;
                        handleAddSubCategoryTag();
                        setWizardSubCategory(newSubCategoryTag.trim());
                        setShowInlineNewTrack(false);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Track
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewTrack(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tag Badges List */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCategory?.subCategories?.map((tag, idx) => {
                  const isWizardActive = wizardSubCategory === tag;
                  return (
                    <span 
                      key={idx} 
                      onClick={() => setWizardSubCategory(tag)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                        isWizardActive 
                          ? 'bg-brand-600 text-white border-brand-700 shadow-xs' 
                          : 'bg-white border-brand-200 text-brand-900 hover:bg-brand-50'
                      }`}
                    >
                      <span>🏷️ {tag}</span>
                      {isWizardActive && <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-semibold">Active</span>}
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); handleRemoveSubCategoryTag(idx); }} 
                        className={`cursor-pointer font-bold ml-0.5 ${isWizardActive ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-600'}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {(!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No sub-categories assigned yet. Type above and click Save Track.</span>
                )}
              </div>
            </div>

            {/* Optional Course Link */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Optional: Link directly to an existing course in Library
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer"
                value={selectedCategory?.linkedCourseId || ''}
                onChange={(e) => {
                  const cId = e.target.value;
                  const matched = courseList.find(c => c.id === cId);
                  setSelectedCategory((prev: GlobalCategory | null) => {
                    const current = prev || { id: 'new', name: '', subCategories: [], description: '', code: '' };
                    return {
                      ...current,
                      linkedCourseId: cId || undefined,
                      linkedCourseName: matched?.name || undefined
                    };
                  });
                }}
              >
                <option value="">-- Optional: Assign to All Courses / Global Taxonomy --</option>
                {courseList.map(c => (
                  <option key={c.id} value={c.id}>
                    📚 {c.name} {c.category ? `[${c.category}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Category Description &amp; Scope</label>
              <textarea 
                rows={2}
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="Scope of courses, career pathways, language proficiencies, and industry certifications..." 
                value={selectedCategory?.description || ''}
                onChange={(e) => setSelectedCategory((prev: GlobalCategory | null) => prev ? {...prev, description: e.target.value} : { id: 'new', name: '', description: e.target.value, subCategories: [], code: '' })}
              />
            </div>

          </div>
        )}

        {/* TAB 2: SERVICE TAB FORM (EDUCATION PATH) */}
        {activeTab === 'SERVICE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Step 1 Inheritance Context Banner */}
            <div className="md:col-span-2 bg-gradient-to-r from-brand-50 via-indigo-50/50 to-white p-4 rounded-xl border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-brand-700 tracking-wider">
                    Step 1 Context Inherited
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Category: <span className="text-brand-700">{wizardCategory || 'None Selected'}</span>
                    {wizardSubCategory && <span className="text-slate-400 mx-1.5">•</span>}
                    {wizardSubCategory && <span>Track: <span className="text-indigo-700">{wizardSubCategory}</span></span>}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Connected Pipeline
              </span>
            </div>

            {/* Category Dropdown (Pre-selected from Step 1, functional for fresh selections) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-brand-600" />
                Inherited Category (Step 1)
              </label>
              <select
                className="border-2 border-brand-200 rounded-xl p-2.5 text-xs bg-white font-bold text-slate-800 focus:ring-1 focus:ring-brand-500 cursor-pointer"
                value={wizardCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setWizardCategory(val);
                  const matched = categoryList.find(c => c.name === val);
                  if (matched && matched.subCategories && matched.subCategories.length > 0) {
                    setWizardSubCategory(matched.subCategories[0]);
                  }
                  // Auto-update path code
                  const newCode = generateUniqueCode('PTH', selectedService?.name || val || 'Path');
                  setSelectedService(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: newCode });
                }}
              >
                {categoryList.map(c => (
                  <option key={c.id} value={c.name}>
                    📁 {c.name} [{c.code || 'CAT'}]
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category / Track Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" />
                Inherited Track / Sub-Category
              </label>
              <select
                className="border-2 border-indigo-200 rounded-xl p-2.5 text-xs bg-white font-bold text-slate-800 focus:ring-1 focus:ring-brand-500 cursor-pointer"
                value={wizardSubCategory}
                onChange={(e) => setWizardSubCategory(e.target.value)}
              >
                {(() => {
                  const currentCat = categoryList.find(c => c.name === wizardCategory);
                  const tracks = currentCat?.subCategories || [wizardSubCategory].filter(Boolean);
                  if (tracks.length === 0) return <option value="">General Track</option>;
                  return tracks.map((t, idx) => (
                    <option key={idx} value={t}>
                      🏷️ {t}
                    </option>
                  ));
                })()}
              </select>
            </div>

            {/* Education Path Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Education Path Name *</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="e.g. Goethe-Zertifikat Intensive Path / MERN Stack Mastery" 
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

            {/* Auto-Generated Connected Path Code */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-brand-600" />
                  Connected Path Code (Auto-Generated)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateUniqueCode('PTH', selectedService?.name || wizardCategory || 'PATH');
                    setSelectedService(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: newCode });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate
                </button>
              </div>

              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-900 bg-slate-50 focus:ring-1 focus:ring-brand-500 uppercase tracking-wider" 
                placeholder="e.g. PTH-INTE-602" 
                value={selectedService?.code || ''}
                onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, code: e.target.value.toUpperCase()} : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Training Method with Preset Quick Chips */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Training Method *</label>
                <div className="flex items-center gap-1.5">
                  {['Hybrid (Live + AI)', 'Online Live Class', 'IntelliCoach AI (Self-Paced)', 'Classroom Offline'].map((methodPreset) => (
                    <button
                      key={methodPreset}
                      type="button"
                      onClick={() => {
                        setSelectedService((prev: GlobalPath | null) => {
                          const current = prev || { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: '', code: '' };
                          return { ...current, methods: methodPreset };
                        });
                      }}
                      className="text-[10px] font-bold bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 transition-all cursor-pointer"
                    >
                      {methodPreset}
                    </button>
                  ))}
                </div>
              </div>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="e.g. Hybrid, Online Live / AI + Adaptive Learning" 
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
                  className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                  value={selectedService?.starting || ''}
                  onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, starting: e.target.value} : { id: 'new', name: '', methods: '', starting: e.target.value, ending: '', remarks: '', code: '' })}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-slate-700">Ending / Valid Till</label>
                <input 
                  type="date" 
                  className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                  value={selectedService?.ending || ''}
                  onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, ending: e.target.value} : { id: 'new', name: '', methods: '', starting: '', ending: e.target.value, remarks: '', code: '' })}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Remarks &amp; Curriculum Package</label>
              <input 
                type="text" 
                className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                placeholder="Full syllabus milestones, study material, certification..." 
                value={selectedService?.remarks || ''}
                onChange={(e) => setSelectedService((prev: GlobalPath | null) => prev ? {...prev, remarks: e.target.value} : { id: 'new', name: '', methods: '', starting: '', ending: '', remarks: e.target.value, code: '' })}
              />
            </div>
          </div>
        )}

        {/* TAB 3: BATCH TAB FORM */}
        {activeTab === 'BATCH' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Step 1 & Step 2 Inherited Context Display */}
            <div className="md:col-span-2 bg-gradient-to-r from-brand-50 via-indigo-50/50 to-white p-4 rounded-xl border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-brand-700 tracking-wider">
                    Pipeline Context Inherited (Steps 1 &amp; 2)
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Category: <span className="text-brand-700">{wizardCategory || 'General'}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    Path: <span className="text-indigo-700">{serviceList.find(p => p.id === wizardPathId)?.name || 'General Education Path'}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-200 self-start sm:self-auto flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-indigo-600" /> Connected to Course
              </span>
            </div>

            {/* AUTOMATED TOGGLE: Batch & Slot Not Applicable (specifically for IntelliCoach / Open-Schedule Modules) */}
            <div className={`md:col-span-2 p-4 rounded-2xl border transition-all ${
              batchNotApplicable 
                ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    batchNotApplicable ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>Batch &amp; Slot Not Applicable</span>
                      {batchNotApplicable ? (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider">
                          Active (Open-Schedule / IntelliCoach)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          Fixed Batches Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Enable this automated toggle for <strong>IntelliCoach 24/7 AI courses</strong>, asynchronous self-paced modules, or open-enrollment tracks where fixed calendar batch schedules and timings are not applicable.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBatchNotApplicable(!batchNotApplicable)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                    batchNotApplicable 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm ring-1 ring-amber-700' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-2xs'
                  }`}
                >
                  {batchNotApplicable ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  <span>{batchNotApplicable ? 'Open Schedule (ON)' : 'Set Batches (OFF)'}</span>
                </button>
              </div>

              {/* Status Banner when toggled ON */}
              {batchNotApplicable && (
                <div className="mt-3.5 pt-3.5 border-t border-amber-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Fixed batch times are bypassed. Students enroll continuously with 24/7 on-demand IntelliCoach.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Batch & Slot Creation Form (Shown when Batch is Applicable) */}
            {!batchNotApplicable && (
              <>
                {/* Linked Education Path */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-600" />
                    Select Education Path
                  </label>
                  <select
                    className="border-2 border-brand-300 rounded-xl p-2.5 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-semibold text-slate-800 cursor-pointer"
                    value={selectedBatch?.linkedPathId || wizardPathId || ''}
                    onChange={(e) => {
                      const pId = e.target.value;
                      const pMatch = serviceList.find(p => p.id === pId);
                      setWizardPathId(pId);
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
                    placeholder="e.g. Morning Batch A1 / Weekend Fast-Track" 
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
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate
                    </button>
                  </div>

                  <input 
                    type="text" 
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-900 bg-slate-50 focus:ring-1 focus:ring-brand-500 uppercase tracking-wider" 
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
                    className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
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
                      className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28 font-medium" 
                      onChange={(e) => {
                        const endVal = (document.getElementById('endTimeInput') as HTMLInputElement)?.value || '';
                        setNewTimeSlot(`${e.target.value} - ${endVal}`);
                      }}
                    />
                    <span className="font-bold text-slate-400 text-xs">TO</span>
                    <input 
                      type="time" 
                      id="endTimeInput"
                      className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28 font-medium" 
                      onChange={(e) => {
                        const startVal = (document.getElementById('startTimeInput') as HTMLInputElement)?.value || '';
                        setNewTimeSlot(`${startVal} - ${e.target.value}`);
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddTimeSlot} 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-all"
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
                  <label className="text-xs font-semibold text-slate-700">Batch Remarks &amp; Capacity</label>
                  <input 
                    type="text" 
                    className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium" 
                    placeholder="e.g. Fast Filling, Limited 15 seats, Open for Enrollment..." 
                    value={selectedBatch?.remarks || ''}
                    onChange={(e) => setSelectedBatch((prev: GlobalBatch | null) => prev ? {...prev, remarks: e.target.value} : { id: 'new', name: '', timings: [], starting: '', remarks: e.target.value, code: '' })}
                  />
                </div>
              </>
            )}

          </div>
        )}

        {/* Global Save Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeTab === 'CATEGORY' ? 'Category & Tracks Module' : activeTab === 'SERVICE' ? 'Education Paths Module' : 'Batch Slots Module'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              type="button"
              onClick={handleReset} 
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" /> RESET FORM
            </button>

            <button 
              type="button"
              onClick={handleDelete} 
              disabled={
                (activeTab === 'CATEGORY' && !selectedCategory) ||
                (activeTab === 'SERVICE' && !selectedService) || 
                (activeTab === 'BATCH' && !selectedBatch)
              } 
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> DELETE
            </button>

            <button 
              type="button"
              onClick={handleSave} 
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> SAVE RECORD
            </button>
          </div>
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
    </>
  )}

</div>
  );
};

export default ServicesAndBatches;