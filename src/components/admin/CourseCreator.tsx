import React, { useState, useEffect } from 'react';
import { 
  Save, Edit, RefreshCw, Trash2, Send, CheckSquare, 
  BookOpen, Clock, Users, BookMarked, Info, Briefcase, FileUp, Upload, Navigation, Layers, Plus, X, Check,
  FileText, Image as ImageIcon, Video as VideoIcon, Sparkles, Download, Eye, ExternalLink
} from 'lucide-react';
import { 
  getGlobalCourses, setGlobalCourses, getGlobalPaths, setGlobalPaths, getGlobalBatches, setGlobalBatches,
  getGlobalCategories, GlobalCategory,
  GlobalCourse, GlobalPath, GlobalBatch, CourseMaterialItem 
} from '../../lib/db';

const DEFAULT_MATERIALS: CourseMaterialItem[] = [
  { id: 'm1', title: 'Chapter 1-3 Official Study Notes & Grammar Handbook', type: 'chapters', fileName: 'German_A1_Handout_Vol1.pdf', size: '4.8 MB', format: 'PDF' },
  { id: 'm2', title: 'Curriculum Progression & CEFR Milestone Guide', type: 'chapters', fileName: 'CEFR_Milestones_Curriculum.pdf', size: '2.1 MB', format: 'PDF' },
  { id: 'm3', title: 'Grammar Syntax & Sentence Formation Infographic', type: 'images', fileName: 'Grammar_Architecture.png', size: '1.4 MB', format: 'PNG' },
  { id: 'm4', title: 'Visual Flashcards: Top 500 Daily Vocabulary', type: 'images', fileName: 'Flashcards_Deck_A1.png', size: '3.2 MB', format: 'PNG' },
  { id: 'm5', title: 'Interactive Intelli-Coach AI Demo Lecture (Live Preview)', type: 'video', fileName: 'AI_Tutor_Demo_Class.mp4', size: '24.5 MB', format: 'MP4', fileUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
  { id: 'm6', title: 'Germany Job Seeker & Ausbildung Placement Kit', type: 'promo', fileName: 'Ausbildung_Placement_Kit.pdf', size: '5.6 MB', format: 'PDF' },
  { id: 'm7', title: 'Visa Readiness Checklist & Blocked Account Setup', type: 'promo', fileName: 'Visa_Checklist_Guide.pdf', size: '1.9 MB', format: 'PDF' }
];

interface CourseCreatorProps {
  onNavigateTab?: (tabName: string, subTab?: string) => void;
}

const CourseCreator: React.FC<CourseCreatorProps> = ({ onNavigateTab }) => {
  const [courseList, setCourseList] = useState<GlobalCourse[]>([]);
  const [availablePaths, setAvailablePaths] = useState<GlobalPath[]>([]);
  const [availableBatches, setAvailableBatches] = useState<GlobalBatch[]>([]);
  const [availableCategories, setAvailableCategories] = useState<GlobalCategory[]>([]);

  useEffect(() => {
    const loadData = () => {
      setCourseList(getGlobalCourses());
      setAvailablePaths(getGlobalPaths());
      setAvailableBatches(getGlobalBatches());
      setAvailableCategories(getGlobalCategories());
    };
    loadData();
    window.addEventListener('ilas-courses-changed', loadData);
    window.addEventListener('ilas-paths-changed', loadData);
    window.addEventListener('ilas-batches-changed', loadData);
    window.addEventListener('ilas-categories-changed', loadData);
    return () => {
      window.removeEventListener('ilas-courses-changed', loadData);
      window.removeEventListener('ilas-paths-changed', loadData);
      window.removeEventListener('ilas-batches-changed', loadData);
      window.removeEventListener('ilas-categories-changed', loadData);
    };
  }, []);

  // Form State
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [topTitle, setTopTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [showInSubNav, setShowInSubNav] = useState(true);
  const [displayPosition, setDisplayPosition] = useState(1);
  const [viewType, setViewType] = useState<'Main View' | 'Blocks View' | 'Both'>('Main View');
  const [chapters, setChapters] = useState('');
  const [durationVal, setDurationVal] = useState('');
  const [durationType, setDurationType] = useState('Weeks');
  const [staff, setStaff] = useState('');
  const [fee, setFee] = useState('');
  const [selectedPathId, setSelectedPathId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [courseStructure, setCourseStructure] = useState('');
  const [materialItems, setMaterialItems] = useState<CourseMaterialItem[]>(DEFAULT_MATERIALS);
  const [selectedCourse, setSelectedCourse] = useState<GlobalCourse | null>(null);

  // Asset Upload Modal State
  const [activeAssetModalType, setActiveAssetModalType] = useState<'chapters' | 'images' | 'video' | 'promo' | null>(null);
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetFileName, setNewAssetFileName] = useState('');
  const [newAssetSize, setNewAssetSize] = useState('3.5 MB');
  const [newAssetFormat, setNewAssetFormat] = useState('PDF');

  // Modals for adding Path and Batch directly from Course Creator
  const [showPathModal, setShowPathModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Modal Form States - Path
  const [modalPathName, setModalPathName] = useState('');
  const [modalPathMethod, setModalPathMethod] = useState('AI + Adaptive Tutoring');
  const [modalPathStarting, setModalPathStarting] = useState('');
  const [modalPathEnding, setModalPathEnding] = useState('');
  const [modalPathRemarks, setModalPathRemarks] = useState('');
  const [modalPathCourseId, setModalPathCourseId] = useState('');
  const [modalPathCourseName, setModalPathCourseName] = useState('');

  // Modal Form States - Batch
  const [modalBatchName, setModalBatchName] = useState('');
  const [modalBatchStarting, setModalBatchStarting] = useState('');
  const [modalBatchRemarks, setModalBatchRemarks] = useState('Open for Registration');
  const [modalBatchTimeSlot, setModalBatchTimeSlot] = useState('');
  const [modalBatchTimings, setModalBatchTimings] = useState<string[]>(['09:00 - 11:00']);
  const [modalBatchCourseId, setModalBatchCourseId] = useState('');
  const [modalBatchCourseName, setModalBatchCourseName] = useState('');
  const [modalBatchPathId, setModalBatchPathId] = useState('');

  const handleRowClick = (course: GlobalCourse) => {
    setSelectedCourse(course);
    setCategory(course.category || '');
    setSubCategory(course.subCategory || '');
    setTopTitle(course.top_title || '');
    setCourseName(course.name);
    setSubtitle(course.subtitle || '');
    setShowInSubNav(course.show_in_sub_nav !== false);
    setDisplayPosition(course.displayPosition || 1);
    setViewType(course.viewType || (course.displayPosition <= 3 ? 'Main View' : 'Blocks View'));
    setCourseStructure(course.courseStructure || '');
    setMaterialItems(course.materialItems || DEFAULT_MATERIALS);
    setChapters(course.chapter);
    setDurationVal(course.duration ? course.duration.split(' ')[0] : '');
    setDurationType(course.duration ? course.duration.split(' ')[1] || 'Weeks' : 'Weeks');
    setStaff(course.staff);
    setFee(course.fee ? course.fee.replace('$', '') : '');
    setSelectedPathId(course.pathId || '');
    setSelectedBatchId(course.batchId || '');
  };

  const handleReset = () => {
    setSelectedCourse(null);
    setCategory('');
    setSubCategory('');
    setTopTitle('');
    setCourseName('');
    setSubtitle('');
    setShowInSubNav(true);
    setDisplayPosition(1);
    setViewType('Main View');
    setCourseStructure('');
    setMaterialItems(DEFAULT_MATERIALS);
    setChapters('');
    setDurationVal('');
    setDurationType('Weeks');
    setStaff('');
    setFee('');
    setSelectedPathId('');
    setSelectedBatchId('');
  };

  const handleDelete = () => {
    if (!selectedCourse) return;
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (confirm) {
      const updated = courseList.filter(c => c.id !== selectedCourse.id);
      setGlobalCourses(updated);
      handleReset();
    }
  };

  const handleSave = () => {
    if (!courseName.trim()) {
      alert("Please provide at least a Course Title.");
      return;
    }
    
    const matchedPath = availablePaths.find(p => p.id === selectedPathId);
    const matchedBatch = availableBatches.find(b => b.id === selectedBatchId);

    let methodString = "Custom Plan";
    if (matchedPath && matchedBatch) {
      methodString = `${matchedPath.name} (${matchedBatch.name}) [${matchedPath.methods}]`;
    } else if (matchedPath) {
      methodString = `${matchedPath.name} [${matchedPath.methods}]`;
    } else if (matchedBatch) {
      methodString = `Batch: ${matchedBatch.name}`;
    }

    const currentCourseId = selectedCourse?.id || Math.random().toString(36).substr(2, 9);

    const newCourse: GlobalCourse = {
      id: currentCourseId,
      category: category.trim() || undefined,
      subCategory: subCategory.trim() || undefined,
      top_title: topTitle.trim() || undefined,
      name: courseName.trim(),
      subtitle: subtitle.trim(),
      show_in_sub_nav: showInSubNav,
      displayPosition: displayPosition || 1,
      viewType: viewType || 'Main View',
      staff: staff || 'Unassigned',
      chapter: chapters || '0',
      duration: `${durationVal || '1'} ${durationType}`,
      methods: methodString,
      pathId: selectedPathId || undefined,
      pathName: matchedPath?.name || undefined,
      batchId: selectedBatchId || undefined,
      batchName: matchedBatch?.name || undefined,
      materials: `${materialItems.length} Verified Digital Resources`,
      materialItems: materialItems,
      fee: `$${fee || '0'}`,
      students: selectedCourse?.students || '0',
      courseStructure: courseStructure
    };

    if (selectedCourse) {
      const updated = courseList.map(c => c.id === selectedCourse.id ? newCourse : c);
      setGlobalCourses(updated);
      alert("Course updated successfully with connected materials.");
    } else {
      const updated = [...courseList, newCourse];
      setGlobalCourses(updated);
      alert("Course created and saved successfully with connected materials.");
    }
    handleReset();
  };

  // Asset Upload Handlers
  const handleOpenAssetModal = (type: 'chapters' | 'images' | 'video' | 'promo') => {
    setActiveAssetModalType(type);
    setNewAssetTitle('');
    if (type === 'chapters') {
      setNewAssetFileName('Chapter_Lecture_Handout.pdf');
      setNewAssetFormat('PDF');
    } else if (type === 'images') {
      setNewAssetFileName('Visual_Infographic_Diagram.png');
      setNewAssetFormat('PNG');
    } else if (type === 'video') {
      setNewAssetFileName('Interactive_Lesson_Demo.mp4');
      setNewAssetFormat('MP4');
    } else {
      setNewAssetFileName('Career_Brochure_Placement_Kit.pdf');
      setNewAssetFormat('PDF');
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim() || !activeAssetModalType) return;

    const newAsset: CourseMaterialItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: newAssetTitle.trim(),
      type: activeAssetModalType,
      fileName: newAssetFileName.trim() || `${newAssetTitle.trim().replace(/\s+/g, '_')}.${newAssetFormat.toLowerCase()}`,
      size: newAssetSize || '2.5 MB',
      format: newAssetFormat
    };

    setMaterialItems(prev => [...prev, newAsset]);
    setNewAssetTitle('');
    alert(`Added ${newAsset.title} to ${activeAssetModalType.toUpperCase()} materials!`);
  };

  const handleRemoveAsset = (id: string) => {
    setMaterialItems(prev => prev.filter(item => item.id !== id));
  };

  // Open Category Manager in Services & Batches
  const handleOpenCategoryManager = () => {
    const currentCourse = {
      courseId: selectedCourse?.id || '',
      courseName: courseName.trim() || selectedCourse?.name || ''
    };
    localStorage.setItem('ilas_active_nav_course', JSON.stringify(currentCourse));
    if (onNavigateTab) {
      onNavigateTab('SERVICES & BATCHES', 'CATEGORY');
    }
    window.dispatchEvent(new CustomEvent('ilas-navigate-tab', { 
      detail: { tab: 'SERVICES & BATCHES', subTab: 'CATEGORY', ...currentCourse } 
    }));
  };

  // Open Path Modal with current course context prefilled automatically
  const handleOpenPathModal = () => {
    const cId = selectedCourse?.id || (courseName.trim() ? `course-${Math.random().toString(36).substring(2, 7)}` : '');
    const cName = courseName.trim() || selectedCourse?.name || '';
    setModalPathCourseId(cId);
    setModalPathCourseName(cName);
    setModalPathName(cName ? `${cName} FastTrack Path` : '');
    setModalPathRemarks(cName ? `Dedicated pathway for ${cName}` : '');
    setShowPathModal(true);
  };

  // Open Batch Modal with current course and path context prefilled automatically
  const handleOpenBatchModal = () => {
    const cId = selectedCourse?.id || (courseName.trim() ? `course-${Math.random().toString(36).substring(2, 7)}` : '');
    const cName = courseName.trim() || selectedCourse?.name || '';
    setModalBatchCourseId(cId);
    setModalBatchCourseName(cName);
    setModalBatchPathId(selectedPathId || '');
    setModalBatchName(cName ? `${cName} Morning Cohort` : '');
    setShowBatchModal(true);
  };

  // Save Path from Modal
  const handleSaveModalPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPathName.trim()) {
      alert("Please provide an Education Path Name.");
      return;
    }

    const currentActiveCourseName = courseName.trim() || modalPathCourseName || selectedCourse?.name;
    const currentActiveCourseId = modalPathCourseId || selectedCourse?.id;

    const newPathId = Math.random().toString(36).substring(2, 9);
    const newPathObj: GlobalPath = {
      id: newPathId,
      name: modalPathName.trim(),
      methods: modalPathMethod.trim(),
      position: availablePaths.length + 1,
      starting: modalPathStarting || new Date().toISOString().split('T')[0],
      ending: modalPathEnding || '',
      remarks: modalPathRemarks.trim() || 'Custom created path',
      linkedCourseId: currentActiveCourseId || undefined,
      linkedCourseName: currentActiveCourseName || undefined
    };

    const updatedPaths = [...availablePaths, newPathObj];
    setGlobalPaths(updatedPaths);
    setSelectedPathId(newPathId);
    setShowPathModal(false);
    alert(`🎉 Education Path "${newPathObj.name}" created and automatically linked to "${currentActiveCourseName || 'Current Course'}"!`);
  };

  // Save Batch from Modal
  const handleSaveModalBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalBatchName.trim()) {
      alert("Please provide a Batch Name.");
      return;
    }

    const currentActiveCourseName = courseName.trim() || modalBatchCourseName || selectedCourse?.name;
    const currentActiveCourseId = modalBatchCourseId || selectedCourse?.id;
    const matchedPath = availablePaths.find(p => p.id === modalBatchPathId) || availablePaths.find(p => p.id === selectedPathId);

    const newBatchId = Math.random().toString(36).substring(2, 9);
    const newBatchObj: GlobalBatch = {
      id: newBatchId,
      name: modalBatchName.trim(),
      starting: modalBatchStarting || new Date().toISOString().split('T')[0],
      remarks: modalBatchRemarks.trim() || 'Open for Registration',
      timings: modalBatchTimings.length > 0 ? modalBatchTimings : ['09:00 - 11:00'],
      linkedCourseId: currentActiveCourseId || undefined,
      linkedCourseName: currentActiveCourseName || undefined,
      linkedPathId: matchedPath?.id,
      linkedPathName: matchedPath?.name
    };

    const updatedBatches = [...availableBatches, newBatchObj];
    setGlobalBatches(updatedBatches);
    setSelectedBatchId(newBatchId);
    setShowBatchModal(false);
    alert(`🎉 Batch Slot "${newBatchObj.name}" created and automatically linked to "${currentActiveCourseName || 'Current Course'}"!`);
  };

  const handleAddModalTiming = () => {
    if (!modalBatchTimeSlot.trim()) return;
    setModalBatchTimings(prev => [...prev, modalBatchTimeSlot.trim()]);
    setModalBatchTimeSlot('');
  };

  const handleRemoveModalTiming = (idx: number) => {
    setModalBatchTimings(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculate material counts
  const chaptersCount = materialItems.filter(m => m.type === 'chapters').length;
  const imagesCount = materialItems.filter(m => m.type === 'images').length;
  const videoCount = materialItems.filter(m => m.type === 'video').length;
  const promoCount = materialItems.filter(m => m.type === 'promo').length;

  return (
    <div className="flex-1 p-4 md:p-6 w-full flex flex-col gap-6 bg-slate-50 font-sans min-h-screen">
      
      {/* Header Tracking Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-end gap-6 text-xs font-semibold text-slate-600 rounded-lg shadow-sm">
        <span>LOGIN ID: <span className="text-brand-700 font-bold">ADM-001</span></span>
        <span>NAME: <span className="text-brand-700 font-bold">ADMINISTRATOR</span></span>
        <button className="text-brand-600 hover:underline flex items-center gap-1"><Clock className="w-3 h-3"/> ACTIVITY LOG</button>
      </div>

      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-900">Create / Edit Course</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure course catalog, top title, sub-navigation visibility, and link Education Paths, Batch slots, & Study Materials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Create / View Form (Left Section) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
            
            {/* Dedicated Category & Sub-Category Section */}
            <div className="bg-brand-50/70 border border-brand-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xs">
              {/* Section Header */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-black text-brand-900 flex items-center gap-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Category &amp; Sub-Category Classification</span>
                </label>
                <span className="text-[10px] font-bold text-brand-700 bg-white px-2.5 py-0.5 rounded-full border border-brand-200 shadow-2xs shrink-0">
                  Academic Taxonomy
                </span>
              </div>

              {/* Form Fields Stack */}
              <div className="flex flex-col gap-3.5">
                {/* 1. Primary Category (Dropdown + Create Category Button neatly side-by-side) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                      <span>Primary Category</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Select Master Domain</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                      <select
                        value={category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setCategory(newCat);
                          const found = availableCategories.find(c => c.name === newCat);
                          if (found && found.subCategories && found.subCategories.length > 0) {
                            setSubCategory(found.subCategories[0]);
                          }
                        }}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs cursor-pointer transition-all truncate"
                      >
                        <option value="">-- Select Primary Category --</option>
                        {availableCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                        <option value="Education & Languages">Education & Languages</option>
                        <option value="Software & IT Training">Software & IT Training</option>
                        <option value="Enterprise ERP & SAP">Enterprise ERP & SAP</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenCategoryManager}
                      className="h-[38px] px-3 sm:px-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      title="Navigate to Path & Batch to create or manage Categories & Sub-Categories"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Category</span>
                    </button>
                  </div>
                </div>

                {/* 2. Sub-Category Input / Dropdown (Properly aligned with appropriate spacing below) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Sub-Category / Specialization
                    </label>
                    {category && (
                      <span className="text-[10px] text-brand-700 bg-brand-100/60 font-semibold px-2 py-0.5 rounded">
                        Linked to {category}
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    {availableCategories.find(c => c.name === category)?.subCategories && (availableCategories.find(c => c.name === category)?.subCategories.length || 0) > 0 ? (
                      <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs cursor-pointer transition-all"
                      >
                        <option value="">-- Select Sub-Category --</option>
                        {availableCategories.find(c => c.name === category)?.subCategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                        <option value="General Specialization">General Specialization</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="e.g. German Language (A1–C2) / SAP S/4HANA Finance"
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs transition-all"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Categorize the course under its academic taxonomy for frontend navigation filtering and catalog categorization.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Title Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                TOP TITLE (Header / Category Badge)
              </label>
              <input 
                type="text" 
                value={topTitle} 
                onChange={(e) => setTopTitle(e.target.value)} 
                className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-brand-500 bg-slate-50/50" 
                placeholder="e.g. German Language & Proficiency / English Language Mastery" 
              />
              <span className="text-[10px] text-slate-500">Displayed prominently at the top badge of the Course Page.</span>
            </div>

            {/* Course Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">COURSE TITLE *</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)} 
                  className="w-full border border-slate-300 rounded p-2 pl-9 text-sm focus:ring-1 focus:ring-brand-500 font-medium" 
                  placeholder="e.g. German Language A1–C2 / SAP ERP Fundamentals" 
                />
              </div>
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">SUBTITLE / TAGLINE</label>
              <input 
                type="text" 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)} 
                className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-brand-500" 
                placeholder="e.g. Goethe & Telc Standard Certification Pathways" 
              />
            </div>

            {/* View Layout & Target Canvas Selector */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-600" />
                  <span>VIEW LAYOUT & TARGET CANVAS</span>
                </label>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {viewType}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setViewType('Main View')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                    viewType === 'Main View'
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Main View
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('Blocks View')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                    viewType === 'Blocks View'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Blocks View
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('Both')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                    viewType === 'Both'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Both Views
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                {viewType === 'Main View' && '✨ Expands dynamically on the sequential main canvas in numerical position order (1, 2, 3...).'}
                {viewType === 'Blocks View' && '📦 Renders in the catalog blocks section at the bottom with Grid / Line display.'}
                {viewType === 'Both' && '🌟 Displays on both the dynamic sequential main canvas and the catalog blocks section.'}
              </p>
            </div>

            {/* Sub-Navigation Visibility Checkbox */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showInSubNav} 
                    onChange={(e) => setShowInSubNav(e.target.checked)} 
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                  />
                  <span>Show in Sub Navigation (Course Page)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-1 pl-5.5">
                  {showInSubNav 
                    ? '✅ Will appear as a primary tab in the Course Page top Sub-Navigation bar.' 
                    : '📌 Will appear under "Job-Related Certifications & Specialized Programs" section.'}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                showInSubNav ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {showInSubNav ? 'Sub-Nav Tab' : 'Job-Related'}
              </span>
            </div>

            {/* Display Position & Chapters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">DISPLAY POSITION (INDEX)</label>
                <input 
                  type="number" 
                  value={displayPosition} 
                  onChange={(e) => setDisplayPosition(Number(e.target.value))} 
                  className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-brand-500" 
                  placeholder="1" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">CHAPTERS / MODULES</label>
                <div className="relative">
                  <BookMarked className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    value={chapters} 
                    onChange={(e) => setChapters(e.target.value)} 
                    className="w-full border border-slate-300 rounded p-2 pl-9 text-sm focus:ring-1 focus:ring-brand-500" 
                    placeholder="12" 
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">DURATION</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={durationVal} 
                  onChange={(e) => setDurationVal(e.target.value)} 
                  className="w-24 border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-brand-500" 
                  placeholder="12" 
                />
                <select 
                  value={durationType} 
                  onChange={(e) => setDurationType(e.target.value)} 
                  className="flex-1 border border-slate-300 rounded p-2 text-sm bg-slate-50 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>
            </div>

            {/* Staff Info */}
            <div className="flex items-end gap-2 pt-2 border-t border-slate-100">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">STAFF INFO</label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={staff} 
                    onChange={(e) => setStaff(e.target.value)} 
                    className="w-full border border-slate-300 rounded p-2 pl-9 text-sm bg-slate-50 focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="">Select Staff</option>
                    <option value="Nadeem - ID 091">Nadeem - ID 091</option>
                    <option value="Jane - ID 092">Jane - ID 092</option>
                    <option value="AI Bot">AI Bot</option>
                  </select>
                </div>
              </div>
              <button className="bg-amber-100 text-amber-700 p-2 px-3 rounded text-xs font-bold hover:bg-amber-200 border border-amber-200 flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> (ADD TASK)
              </button>
            </div>

            {/* PATH and BATCH fields on the same line with + Add Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-600" />
                  EDUCATION PATH & BATCH CONFIGURATION
                </label>
                <span className="text-[10px] text-slate-400">Linked to Services & Batches</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Path Dropdown + Add Button */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-600">Education Path</label>
                    <button
                      type="button"
                      onClick={handleOpenPathModal}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {/* <span>Add Path</span> */}
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <select 
                      value={selectedPathId} 
                      onChange={(e) => {
                        if (e.target.value === '__CREATE_NEW_PATH__') {
                          handleOpenPathModal();
                        } else {
                          setSelectedPathId(e.target.value);
                          setSelectedBatchId(''); // Reset batch when path changes
                        }
                      }} 
                      className="w-full border border-brand-300 rounded p-2 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-medium cursor-pointer"
                    >
                      <option value="">-- Select Education Path --</option>
                      {availablePaths.map(path => (
                        <option key={path.id} value={path.id}>
                          {path.name} [{path.methods}]
                        </option>
                      ))}
                      <option value="__CREATE_NEW_PATH__" className="font-bold text-indigo-700 bg-indigo-50">
                        ➕ + Create New Path...
                      </option>
                    </select>
                  </div>
                </div>

                {/* Batch Dropdown + Add Button */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-600">Batch</label>
                    <button
                      type="button"
                      onClick={handleOpenBatchModal}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {/* <span>Add Batch</span> */}
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <select 
                      value={selectedBatchId} 
                      onChange={(e) => {
                        if (e.target.value === '__CREATE_NEW_BATCH__') {
                          handleOpenBatchModal();
                        } else {
                          setSelectedBatchId(e.target.value);
                        }
                      }}
                      disabled={!selectedPathId}
                      className="w-full border border-brand-300 rounded p-2 text-xs bg-brand-50/60 focus:ring-1 focus:ring-brand-500 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{selectedPathId ? '-- Select Batch --' : '-- Select Path First --'}</option>
                      {availableBatches
                        .filter(batch => batch.linkedPathId === selectedPathId)
                        .map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name} {batch.timings.length > 0 ? `(${batch.timings[0]})` : ''}
                        </option>
                      ))}
                      <option value="__CREATE_NEW_BATCH__" className="font-bold text-emerald-700 bg-emerald-50">
                        ➕ + Create New Batch...
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">*Linked Path & Batch configurations will display dynamically on the Course page.</p>
            </div>

            {/* Dynamic Course Structure & Details */}
            <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  DYNAMIC COURSE STRUCTURE & DETAILS
                </label>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Frontend Syllabus Sync
                </span>
              </div>
              <textarea 
                value={courseStructure} 
                onChange={(e) => setCourseStructure(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-brand-500 h-28 resize-y font-mono bg-slate-50/50 leading-relaxed" 
                placeholder={`Module 1: ERP Introduction & Architecture\nModule 2: General Ledger & Account Setup\nModule 3: Integration & Reporting Workflows\nModule 4: Enterprise Mock Drills & Certification`}
              />
              <span className="text-[10px] text-slate-500">
                Enter each module on a new line. These modules will automatically render under "SYLLABUS & MODULE BREAKDOWNS" on the frontend Course page.
              </span>
            </div>
            
          </div>

          {/* Upload & Pricing Section (Right Section) */}
          <div className="flex flex-col gap-6">
            
            {/* 🌟 Interactive Course Assets & Materials Block */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Course Assets & Materials</span>
                </h3>
                <span className="text-[11px] text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full font-bold border border-brand-200">
                  {materialItems.length} Total Resources
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. UPLOAD CHAPTERS */}
                <div 
                  onClick={() => handleOpenAssetModal('chapters')}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-400 transition-all group relative"
                >
                  <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {chaptersCount} Files
                  </span>
                  <FileUp className="w-7 h-7 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">UPLOAD CHAPTERS</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PDFs, Lecture Notes</span>
                </div>

                {/* 2. IMAGES */}
                <div 
                  onClick={() => handleOpenAssetModal('images')}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-400 transition-all group relative"
                >
                  <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {imagesCount} Images
                  </span>
                  <Upload className="w-7 h-7 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">IMAGES</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Diagrams & Flashcards</span>
                </div>

                {/* 3. VIDEO */}
                <div 
                  onClick={() => handleOpenAssetModal('video')}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 hover:border-amber-400 transition-all group relative"
                >
                  <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {videoCount} Video
                  </span>
                  <VideoIcon className="w-7 h-7 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">VIDEO</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Lessons & Demo Previews</span>
                </div>

                {/* 4. PROMO MATERIALS */}
                <div 
                  onClick={() => handleOpenAssetModal('promo')}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-50 hover:border-brand-400 bg-brand-50/40 transition-all group relative"
                >
                  <span className="absolute top-2 right-2 bg-brand-200 text-brand-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {promoCount} Kits
                  </span>
                  <Upload className="w-7 h-7 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-brand-800">PROMO MATERIALS</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">(Content Creation Link)</span>
                </div>

              </div>

              {/* Active Materials Overview Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Active Resources Ready for Frontend:
                </span>
                <span className="font-bold text-slate-900">
                  {materialItems.length} Uploaded Items
                </span>
              </div>
            </div>

            {/* Course Fee */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
                COURSE FEE 
                <span className="text-xs font-normal text-slate-500 flex items-center gap-1"><Info className="w-3 h-3"/> RECOMMENDATION</span>
              </h3>
              
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input 
                    type="text" 
                    value={fee} 
                    onChange={(e) => setFee(e.target.value)} 
                    className="w-full border border-slate-300 rounded p-3 pl-8 font-bold text-lg text-brand-900 focus:ring-1 focus:ring-brand-500" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Market Avg: $450<br/>
                  <a href="#" className="text-brand-600 hover:underline">View Price References</a>
                </div>
              </div>
            </div>
            
            {/* Action Buttons & Integrations */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="col-span-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]">
                <BookOpen className="w-5 h-5"/> ADD TO LIBRARY <span className="text-xs font-normal opacity-80">(Push to Class Room)</span>
              </button>
              <button className="py-2 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 flex items-center justify-center gap-1">
                <CheckSquare className="w-4 h-4"/> SEND FOR APPROVAL
              </button>
              <button className="py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center justify-center gap-1">
                <Send className="w-4 h-4"/> SEND TO UPDATE
              </button>
              <div className="col-span-2 flex gap-2 justify-center mt-2">
                <button onClick={handleReset} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 flex items-center justify-center gap-1 cursor-pointer"><Edit className="w-3 h-3"/> RESET</button>
                <button onClick={handleDelete} disabled={!selectedCourse} className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"><Trash2 className="w-3 h-3"/> DELETE</button>
                <button onClick={handleSave} className="flex-1 py-2 bg-brand-50 text-brand-700 text-xs font-bold rounded hover:bg-brand-100 border border-brand-200 flex items-center justify-center gap-1 cursor-pointer"><RefreshCw className="w-3 h-3"/> UPDATE</button>
                <button onClick={handleSave} className="flex-1 py-2 bg-brand-600 text-white text-xs font-bold rounded hover:bg-brand-700 shadow flex items-center justify-center gap-1 cursor-pointer"><Save className="w-3 h-3"/> SAVE</button>
              </div>
            </div>

          </div>
        </div>

        {/* Course List Table (Bottom) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">List of Courses (Click to View/Edit)</h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Total Courses: {courseList.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Category & Sub-Category</th>
                  <th className="px-4 py-3">Top Title / Badge</th>
                  <th className="px-4 py-3">Course Name</th>
                  <th className="px-4 py-3">Sub-Nav</th>
                  <th className="px-4 py-3">Linked Path</th>
                  <th className="px-4 py-3">Linked Batch</th>
                  <th className="px-4 py-3">Materials</th>
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3 rounded-tr-lg">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseList.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleRowClick(item)} 
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedCourse?.id === item.id ? 'bg-brand-50 ring-1 ring-brand-200' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs">
                      {item.category ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-900">{item.category}</span>
                          <span className="text-[10px] text-slate-500">{item.subCategory || 'General'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">{item.top_title || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-brand-700">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.show_in_sub_nav !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.show_in_sub_nav !== false ? 'Sub-Nav' : 'Job-Related'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.pathName || item.methods || '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.batchName || '-'}</td>
                    <td className="px-4 py-3 text-xs font-medium text-indigo-700">
                      📦 {item.materialItems?.length || 7} Resources
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.staff}</td>
                    <td className="px-4 py-3 text-slate-600">{item.duration}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.fee}</td>
                    <td className="px-4 py-3 text-slate-500">{item.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🌟 ASSET & MATERIALS MANAGEMENT MODAL */}
      {activeAssetModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveAssetModalType(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                {activeAssetModalType === 'chapters' && <FileText className="w-5 h-5" />}
                {activeAssetModalType === 'images' && <ImageIcon className="w-5 h-5" />}
                {activeAssetModalType === 'video' && <VideoIcon className="w-5 h-5" />}
                {activeAssetModalType === 'promo' && <Upload className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase">
                  Manage {activeAssetModalType} Materials
                </h3>
                <p className="text-xs text-slate-500">
                  Course: <strong>{courseName || selectedCourse?.name || 'Current Course'}</strong>
                </p>
              </div>
            </div>

            {/* Add New Asset Form */}
            <form onSubmit={handleAddAsset} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                + Upload / Add New {activeAssetModalType === 'chapters' ? 'Chapter Handout' : activeAssetModalType === 'video' ? 'Video Lesson' : activeAssetModalType === 'images' ? 'Infographic Diagram' : 'Promo Kit'}
              </span>
              
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Asset Title / Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Grammar Drills & Homework Handout"
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">File Name / Video Link</label>
                  <input
                    type="text"
                    placeholder="e.g. Handout_Vol2.pdf"
                    value={newAssetFileName}
                    onChange={(e) => setNewAssetFileName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">File Size / Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.2 MB / 15 mins"
                    value={newAssetSize}
                    onChange={(e) => setNewAssetSize(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Asset to Course</span>
              </button>
            </form>

            {/* List of Existing Assets for this Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Current {activeAssetModalType.toUpperCase()} ({materialItems.filter(m => m.type === activeAssetModalType).length})
                </span>
                <span className="text-[10px] text-slate-400">Available on Course Page</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {materialItems.filter(m => m.type === activeAssetModalType).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-2xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {item.format || 'FILE'}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.fileName} • {item.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 font-bold text-xs cursor-pointer ml-2"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {materialItems.filter(m => m.type === activeAssetModalType).length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-slate-100">
                    No {activeAssetModalType} materials uploaded yet. Use the form above to add one.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveAssetModalType(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Done & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🌟 CREATE EDUCATION PATH MODAL */}
      {showPathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPathModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create New Education Path</h3>
                <p className="text-xs text-slate-500">Configure path details for this course</p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="text-xs text-indigo-900 font-medium">
                  Auto-linking to Course: <strong className="text-indigo-950 font-bold">{courseName || selectedCourse?.name || 'Current Course'}</strong>
                </span>
              </div>
              <span className="bg-indigo-200/80 text-indigo-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Auto-Filled
              </span>
            </div>

            <form onSubmit={handleSaveModalPath} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Associated Course (Pre-Selected)</label>
                <select
                  value={modalPathCourseId}
                  onChange={(e) => {
                    const cMatch = courseList.find(c => c.id === e.target.value);
                    setModalPathCourseId(e.target.value);
                    if (cMatch) setModalPathCourseName(cMatch.name);
                  }}
                  className="w-full border border-indigo-300 bg-indigo-50/40 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={modalPathCourseId || ''}>
                    {courseName || selectedCourse?.name || '-- Current Form Course --'}
                  </option>
                  {courseList.filter(c => c.id !== modalPathCourseId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Education Path Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Executive Hybrid Track"
                  value={modalPathName}
                  onChange={(e) => setModalPathName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Training Method *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI + Adaptive Tutoring, Live Interactive"
                  value={modalPathMethod}
                  onChange={(e) => setModalPathMethod(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Starting Date</label>
                  <input
                    type="date"
                    value={modalPathStarting}
                    onChange={(e) => setModalPathStarting(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ending Date (Opt)</label>
                  <input
                    type="date"
                    value={modalPathEnding}
                    onChange={(e) => setModalPathEnding(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Remarks & Details</label>
                <input
                  type="text"
                  placeholder="e.g. Recommended for corporate learners"
                  value={modalPathRemarks}
                  onChange={(e) => setModalPathRemarks(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPathModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Select Path</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 CREATE BATCH SLOT MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBatchModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create New Batch Slot</h3>
                <p className="text-xs text-slate-500">Configure time slots and link to course & path</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs text-emerald-900 font-medium">
                  Auto-linking to Course: <strong className="text-emerald-950 font-bold">{courseName || selectedCourse?.name || 'Current Course'}</strong>
                </span>
              </div>
              <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Auto-Filled
              </span>
            </div>

            <form onSubmit={handleSaveModalBatch} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Associated Course</label>
                  <select
                    value={modalBatchCourseId}
                    onChange={(e) => {
                      const cMatch = courseList.find(c => c.id === e.target.value);
                      setModalBatchCourseId(e.target.value);
                      if (cMatch) setModalBatchCourseName(cMatch.name);
                    }}
                    className="w-full border border-emerald-300 bg-emerald-50/40 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={modalBatchCourseId || ''}>
                      {courseName || selectedCourse?.name || '-- Current Form Course --'}
                    </option>
                    {courseList.filter(c => c.id !== modalBatchCourseId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Associated Path</label>
                  <select
                    value={modalBatchPathId}
                    onChange={(e) => setModalBatchPathId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Select Path (Optional) --</option>
                    {availablePaths.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Late Evening Global Batch"
                  value={modalBatchName}
                  onChange={(e) => setModalBatchName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Starting Date</label>
                <input
                  type="date"
                  value={modalBatchStarting}
                  onChange={(e) => setModalBatchStarting(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Time Slots Config */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time Slots Config</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 20:00 - 22:00"
                    value={modalBatchTimeSlot}
                    onChange={(e) => setModalBatchTimeSlot(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddModalTiming}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                  >
                    + Add Slot
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {modalBatchTimings.map((time, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">
                      <span>⏰ {time}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalTiming(idx)}
                        className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Batch Remarks & Status</label>
                <input
                  type="text"
                  placeholder="e.g. Open for Registration / Fast Filling"
                  value={modalBatchRemarks}
                  onChange={(e) => setModalBatchRemarks(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Select Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseCreator;