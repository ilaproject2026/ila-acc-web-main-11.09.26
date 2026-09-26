import React, { useState, useEffect } from 'react';
import {
  Save, Edit, Trash2, BookOpen, Layers, Clock, CheckCircle,
  FolderPlus, Tag, Plus, X, List, Shield, HelpCircle, Check,
  ArrowRight, Sparkles, RefreshCw, Hash, Code, ToggleLeft, ToggleRight, Calendar, Zap, Radio,
  ArrowUp, ArrowDown, DollarSign, CheckSquare, Square, Sliders, Briefcase, Award,
  ExternalLink, BrainCircuit, CheckCheck, ChevronRight, Copy, Link2, Globe, Table
} from 'lucide-react';
import {
  getGlobalCategories, setGlobalCategories, GlobalCategory, SubCategoryProduct, buildSubCategoryProducts,
  getGlobalPaths, setGlobalPaths, getGlobalBatches, setGlobalBatches, getGlobalCourses, setGlobalCourses,
  generateUniqueCode, generateCompositeCourseId,
  GlobalPath, GlobalBatch, GlobalCourse
} from '../../lib/db';
import CourseCreator from './CourseCreator';

export const STANDARD_PATH_PRESETS = [
  { name: 'IntelliCoach AI Adaptive Path', method: 'Live AI Adaptive', fee: '$799', noBatchRequired: true },
  { name: 'Video + AI', method: 'Interactive Video + AI Stream', fee: '$699', noBatchRequired: true },
  { name: 'Slide + AI', method: 'Visual Knowledge Decks & AI Drills', fee: '$649', noBatchRequired: true },
  { name: '1-to-1 Online', method: '1-to-1 Private Mentorship', fee: '$1,299', noBatchRequired: false },
  { name: '1-to-Group Online', method: 'Online Interactive Cohorts', fee: '$899', noBatchRequired: false },
  { name: 'Camp Classes', method: 'Physical Immersion Mega-Camp', fee: '$999', noBatchRequired: false },
  { name: 'Spot Classes', method: 'On-Site Campus & Corporate Delivery', fee: '$949', noBatchRequired: false }
];

export interface MatrixRowItem {
  id: string;
  specialization: string;
  pathId: string;
  pathName: string;
  pathMethod: string;
  noBatchRequired: boolean;
  level: string;
  price: string;
  batchName: string;
  timings: string[];
  code: string;
  isSaved: boolean;
  batchId?: string;
  studentAccessUrl: string;
}

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

  // Sub-Category / Product Name Input States
  const [newSubCategoryTag, setNewSubCategoryTag] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [newProductPosition, setNewProductPosition] = useState<number | ''>('');

  // Specialization & Stage Tag Temp States
  const [newSpecializationTag, setNewSpecializationTag] = useState('');
  const [newStageTag, setNewStageTag] = useState('');

  // Batch Time Slot Temp State
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Stage pricing temporary inputs for Education Level Builder
  const [newCustomStageName, setNewCustomStageName] = useState('');
  const [newCustomStagePrice, setNewCustomStagePrice] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelPrice, setNewLevelPrice] = useState('');
  const [inlinePathName, setInlinePathName] = useState('');
  const [inlineTrainingMethod, setInlineTrainingMethod] = useState('');
  const [inlineNoBatchRequired, setInlineNoBatchRequired] = useState<boolean>(false);

  // Wizard Inheritance State across Steps 1 -> 2 -> 3 -> 4
  const [wizardCategory, setWizardCategory] = useState<string>('Language & Education');
  const [wizardSubCategory, setWizardSubCategory] = useState<string>('German Language');
  const [wizardSpecialization, setWizardSpecialization] = useState<string>('General / Standard');
  const [wizardPathId, setWizardPathId] = useState<string>('');
  const [wizardStage, setWizardStage] = useState<string>('A1');
  const [wizardBatchId, setWizardBatchId] = useState<string>('');
  const [batchNotApplicable, setBatchNotApplicable] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Batch & Price Matrix Generator State (Excel-Style Allotment)
  const [matrixCategory, setMatrixCategory] = useState<string>('Language & Education');
  const [matrixSubCategory, setMatrixSubCategory] = useState<string>('German Language');
  const [matrixRows, setMatrixRows] = useState<MatrixRowItem[]>([]);
  const [isMatrixGenerated, setIsMatrixGenerated] = useState<boolean>(false);
  const [copiedMatrixId, setCopiedMatrixId] = useState<string | null>(null);
  const [bulkMatrixPrice, setBulkMatrixPrice] = useState<string>('$149');
  const [bulkMatrixTiming, setBulkMatrixTiming] = useState<string>('09:00 - 11:00');
  const [matrixFilterSpec, setMatrixFilterSpec] = useState<string>('ALL');
  const [matrixFilterPath, setMatrixFilterPath] = useState<string>('ALL');

  useEffect(() => {
    if (wizardCategory) setMatrixCategory(wizardCategory);
  }, [wizardCategory]);

  useEffect(() => {
    if (wizardSubCategory) setMatrixSubCategory(wizardSubCategory);
  }, [wizardSubCategory]);

  // Quick inline creation states for Step 1
  const [showInlineNewCategory, setShowInlineNewCategory] = useState<boolean>(false);
  const [showInlineNewTrack, setShowInlineNewTrack] = useState<boolean>(false);
  const [inlineCategoryName, setInlineCategoryName] = useState<string>('');
  const [inlineCategoryCode, setInlineCategoryCode] = useState<string>('');
  const [inlineTrackName, setInlineTrackName] = useState<string>('');
  const [inlineTrackCode, setInlineTrackCode] = useState<string>('');

  // Path Creation Mode (Step 2): 'CREATE' (fresh path creation) or 'MANAGE' (edit existing paths)
  const [pathMode, setPathMode] = useState<'CREATE' | 'MANAGE'>('CREATE');

  // AI Generation Hub Redirection Modal state
  const [showAiGenerationModal, setShowAiGenerationModal] = useState<boolean>(false);
  const [generatedAiUrl, setGeneratedAiUrl] = useState<string>('');
  const [generatedCourseSummary, setGeneratedCourseSummary] = useState<any>(null);

  // Library Access Modal & Target URL state
  const [showLibraryAccessModal, setShowLibraryAccessModal] = useState<boolean>(false);
  const [libraryAccessUrl, setLibraryAccessUrl] = useState<string>(() => {
    return localStorage.getItem('ilas_custom_library_url') || 'https://ila-ai-engine-hub091026.vercel.app/';
  });
  const [copiedLibraryLink, setCopiedLibraryLink] = useState<boolean>(false);

  // Sub-Category inline edit temp state
  const [editingSubCatIndex, setEditingSubCatIndex] = useState<number | null>(null);
  const [editingSubCatText, setEditingSubCatText] = useState<string>('');

  // Specialization inline edit temp state
  const [editingSpecIndex, setEditingSpecIndex] = useState<number | null>(null);
  const [editingSpecText, setEditingSpecText] = useState<string>('');

  // Helper to generate a unique, clean product code
  const generateProductCode = (categoryName: string, productName: string): string => {
    const cleanCat = categoryName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'CAT';
    const cleanProd = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'PRD';
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `PRD-${cleanCat}-${cleanProd}${randomNum}`;
  };

  // Helper returning curated program presets based on active category
  const getSubCategoryPresets = (categoryName: string): string[] => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('lang') || lower.includes('german') || lower.includes('edu')) {
      return ['German Language', 'IELTS', 'TOEFL', 'PET', 'French', 'Spanish', 'Medical German & FSP'];
    }
    if (lower.includes('soft') || lower.includes('it') || lower.includes('tech')) {
      return ['Full-Stack Web Dev', 'Cloud DevOps & AWS', 'Python & AI Engineering', 'Cybersecurity', 'Mobile App Development'];
    }
    if (lower.includes('sap') || lower.includes('erp')) {
      return ['SAP FICO (Financials)', 'SAP MM (Supply Chain)', 'SAP SD (Sales)', 'SAP S/4HANA Architecture'];
    }
    if (lower.includes('market') || lower.includes('growth')) {
      return ['Meta & Google Ads Strategy', 'AI Copywriting & SEO', 'Growth Automation & CRM', 'Viral Social Content'];
    }
    if (lower.includes('health') || lower.includes('clinic') || lower.includes('med')) {
      return ['Fachsprachprüfung (FSP)', 'Kenntnisprüfung (KP)', 'Clinical Nursing Standards', 'Doctor-Patient Intake'];
    }
    return ['Vocational Career Sprints', 'European Workplace Onboarding', 'German Technical Standards', 'Hospitality & Logistics'];
  };

  // Preset Selection Handler
  const handleSelectPresetProduct = (presetName: string) => {
    setNewSubCategoryTag(presetName);
    const catName = selectedCategory?.name || wizardCategory || 'General';
    const code = generateProductCode(catName, presetName);
    setNewProductCode(code);
    const nextPos = (selectedCategory?.subCategories?.length || 0) + 1;
    setNewProductPosition(nextPos);
  };

  // Add or Update Sub-Category / Product
  const handleAddOrUpdateProduct = () => {
    const prodName = newSubCategoryTag.trim();
    if (!prodName) {
      alert("Please enter a Sub-Category / Product Name.");
      return;
    }

    const catName = selectedCategory?.name || wizardCategory || 'General';
    const code = newProductCode.trim() || generateProductCode(catName, prodName);
    const pos = typeof newProductPosition === 'number' && newProductPosition > 0
      ? newProductPosition
      : ((selectedCategory?.subCategories?.length || 0) + 1);

    setSelectedCategory((prev: GlobalCategory | null) => {
      const current = prev || {
        id: 'new',
        name: wizardCategory || 'New Category',
        code: generateUniqueCode('CAT', wizardCategory || 'New'),
        subCategories: [],
        subCategoryProducts: [],
        subCategoryCodes: {},
        description: '',
        position: categoryList.length + 1
      };

      const existingProducts: SubCategoryProduct[] = current.subCategoryProducts ? [...current.subCategoryProducts] : [];
      const matchIdx = existingProducts.findIndex(p => p.name.toLowerCase() === prodName.toLowerCase());

      const productItem: SubCategoryProduct = {
        id: matchIdx >= 0 ? existingProducts[matchIdx].id : `prd-${Math.random().toString(36).substring(2, 7)}`,
        name: prodName,
        code: code,
        position: pos
      };

      let updatedProducts: SubCategoryProduct[];
      if (matchIdx >= 0) {
        updatedProducts = existingProducts.map((p, i) => i === matchIdx ? productItem : p);
      } else {
        updatedProducts = [...existingProducts, productItem];
      }

      // Sort products strictly by position
      updatedProducts.sort((a, b) => (a.position || 99) - (b.position || 99));

      const updatedSubCategories = updatedProducts.map(p => p.name);
      const updatedCodes: Record<string, string> = {};
      updatedProducts.forEach(p => {
        updatedCodes[p.name] = p.code;
      });

      const updatedCat: GlobalCategory = {
        ...current,
        subCategories: updatedSubCategories,
        subCategoryProducts: updatedProducts,
        subCategoryCodes: updatedCodes
      };

      // Persist immediately to global categories for instant reactive frontend synchronization
      const updatedCatList = categoryList.map(c => c.id === updatedCat.id ? updatedCat : c);
      setCategoryList(updatedCatList);
      setGlobalCategories(updatedCatList);

      return updatedCat;
    });

    setWizardSubCategory(prodName);
    setNewSubCategoryTag('');
    setNewProductCode('');
    setNewProductPosition('');
  };

  // Populate Product for Edit
  const handleSelectProductForEdit = (prodName: string) => {
    if (!prodName) return;
    const cat = selectedCategory;
    const product = cat?.subCategoryProducts?.find(p => p.name === prodName);
    const code = product?.code || cat?.subCategoryCodes?.[prodName] || generateProductCode(cat?.name || wizardCategory, prodName);
    const pos = product?.position || (cat?.subCategories?.indexOf(prodName) ?? -1) + 1;

    setNewSubCategoryTag(prodName);
    setNewProductCode(code);
    setNewProductPosition(pos);
    setWizardSubCategory(prodName);
  };

  // Delete Product
  const handleDeleteProduct = (prodName: string) => {
    if (!prodName) return;
    if (!window.confirm(`Are you sure you want to delete Sub-Category / Product "${prodName}"?`)) return;

    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev) return prev;
      const updatedProducts = (prev.subCategoryProducts || []).filter(p => p.name !== prodName);
      const updatedSubCategories = (prev.subCategories || []).filter(s => s !== prodName);
      const updatedCodes = { ...(prev.subCategoryCodes || {}) };
      delete updatedCodes[prodName];

      const updatedCat: GlobalCategory = {
        ...prev,
        subCategories: updatedSubCategories,
        subCategoryProducts: updatedProducts,
        subCategoryCodes: updatedCodes
      };

      const updatedCatList = categoryList.map(c => c.id === updatedCat.id ? updatedCat : c);
      setCategoryList(updatedCatList);
      setGlobalCategories(updatedCatList);

      return updatedCat;
    });

    if (wizardSubCategory === prodName) {
      setWizardSubCategory(selectedCategory?.subCategories?.find(s => s !== prodName) || '');
    }
    setNewSubCategoryTag('');
    setNewProductCode('');
    setNewProductPosition('');
  };

  // Sub-Category / Product Position Reordering Helper (Preserves codes and positions)
  const handleMoveSubCategoryOrder = (index: number, direction: 'up' | 'down') => {
    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev || !prev.subCategories) return prev;
      const list = [...prev.subCategories];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;

      const existingProducts = prev.subCategoryProducts || [];
      const updatedProducts: SubCategoryProduct[] = list.map((name, i) => {
        const found = existingProducts.find(p => p.name === name);
        return {
          id: found?.id || `prd-${i + 1}`,
          name: name,
          code: found?.code || prev.subCategoryCodes?.[name] || generateProductCode(prev.name, name),
          position: i + 1
        };
      });

      const updatedCodes: Record<string, string> = {};
      updatedProducts.forEach(p => {
        updatedCodes[p.name] = p.code;
      });

      const updatedCat: GlobalCategory = {
        ...prev,
        subCategories: list,
        subCategoryProducts: updatedProducts,
        subCategoryCodes: updatedCodes
      };

      const updatedCatList = categoryList.map(c => c.id === updatedCat.id ? updatedCat : c);
      setCategoryList(updatedCatList);
      setGlobalCategories(updatedCatList);

      return updatedCat;
    });
  };

  // Specialization Track Position Reordering Helper
  const handleMoveSpecializationOrder = (index: number, direction: 'up' | 'down') => {
    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev || !prev.specializations) return prev;
      const list = [...prev.specializations];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, specializations: list };
    });
  };

  // Sub-Category Inline Edit Handler
  const handleEditSubCategory = (index: number) => {
    if (editingSubCatIndex === index) {
      if (!editingSubCatText.trim()) {
        setEditingSubCatIndex(null);
        return;
      }
      setSelectedCategory((prev: GlobalCategory | null) => {
        if (!prev || !prev.subCategories) return prev;
        const list = [...prev.subCategories];
        list[index] = editingSubCatText.trim();
        return { ...prev, subCategories: list };
      });
      setWizardSubCategory(editingSubCatText.trim());
      setEditingSubCatIndex(null);
      setEditingSubCatText('');
    } else {
      setEditingSubCatIndex(index);
      setEditingSubCatText(selectedCategory?.subCategories?.[index] || '');
    }
  };

  // Specialization Track Inline Edit Handler
  const handleEditSpecialization = (index: number) => {
    if (editingSpecIndex === index) {
      if (!editingSpecText.trim()) {
        setEditingSpecIndex(null);
        return;
      }
      setSelectedCategory((prev: GlobalCategory | null) => {
        if (!prev || !prev.specializations) return prev;
        const list = [...prev.specializations];
        list[index] = editingSpecText.trim();
        return { ...prev, specializations: list };
      });
      setWizardSpecialization(editingSpecText.trim());
      setEditingSpecIndex(null);
      setEditingSpecText('');
    } else {
      setEditingSpecIndex(index);
      setEditingSpecText(selectedCategory?.specializations?.[index] || '');
    }
  };

  // Position Reordering Helper for Categories
  const handleMoveCategoryOrder = (catId: string, direction: 'up' | 'down') => {
    const currentList = [...categoryList].sort((a, b) => (a.position || 99) - (b.position || 99));
    const idx = currentList.findIndex(c => c.id === catId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === currentList.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = currentList[idx];
    currentList[idx] = currentList[targetIdx];
    currentList[targetIdx] = temp;

    const updated = currentList.map((c, i) => ({
      ...c,
      position: i + 1
    }));

    setGlobalCategories(updated);
    setCategoryList(updated);
  };

  // Auto-linked Course from Course Creator Navigation
  useEffect(() => {
    const loadData = () => {
      const dbCategories = getGlobalCategories();
      const sortedCategories = [...dbCategories].sort((a, b) => (a.position || 99) - (b.position || 99));
      const dbPaths = getGlobalPaths();
      const dbBatches = getGlobalBatches();
      const dbCourses = getGlobalCourses();

      setCategoryList(sortedCategories);
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
                linkedCourseName: matched.name,
                position: (dbCategories.length + 1),
                isJobRelated: false,
                showInNav: true,
                assignedCourseIds: [matched.id]
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
      setInlinePathName('');
      setInlineTrainingMethod('');
      setInlineNoBatchRequired(false);
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

  // Specialization Tags Handlers
  const handleAddSpecializationTag = (tagToAdd?: string) => {
    const text = (tagToAdd || newSpecializationTag).trim();
    if (!text) return;
    setSelectedCategory((prev: GlobalCategory | null) => {
      const cat = prev || {
        id: 'new',
        name: '',
        subCategories: [],
        specializations: [],
        description: '',
        code: generateUniqueCode('CAT', 'New')
      };
      const existing = cat.specializations || [];
      if (existing.includes(text)) return cat;
      return { ...cat, specializations: [...existing, text] };
    });
    if (!tagToAdd) setNewSpecializationTag('');
  };

  const handleRemoveSpecializationTag = (index: number) => {
    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev) return prev;
      const updated = [...(prev.specializations || [])];
      updated.splice(index, 1);
      return { ...prev, specializations: updated };
    });
  };

  // Stage of Education Tags Handlers
  const handleAddStageTag = (stageToAdd?: string) => {
    const text = (stageToAdd || newStageTag).trim();
    if (!text) return;
    setSelectedCategory((prev: GlobalCategory | null) => {
      const cat = prev || {
        id: 'new',
        name: '',
        subCategories: [],
        stages: [],
        description: '',
        code: generateUniqueCode('CAT', 'New')
      };
      const existing = cat.stages || [];
      if (existing.includes(text)) return cat;
      return { ...cat, stages: [...existing, text] };
    });
    if (!stageToAdd) setNewStageTag('');
  };

  const handleRemoveStageTag = (index: number) => {
    setSelectedCategory((prev: GlobalCategory | null) => {
      if (!prev) return prev;
      const updated = [...(prev.stages || [])];
      updated.splice(index, 1);
      return { ...prev, stages: updated };
    });
  };

  const handleDeleteCategoryById = (catId: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete category "${catName}"?`)) {
      return;
    }
    const updated = categoryList.filter(c => c.id !== catId);
    setGlobalCategories(updated);
    setCategoryList(updated);
    if (selectedCategory?.id === catId) {
      setSelectedCategory(null);
    }
    alert(`Category "${catName}" deleted.`);
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
        position: typeof selectedCategory.position === 'number' && !isNaN(selectedCategory.position) ? selectedCategory.position : (categoryList.length + 1),
        isJobRelated: !!selectedCategory.isJobRelated,
        showInNav: selectedCategory.showInNav !== false,
        specializations: selectedCategory.specializations && selectedCategory.specializations.length > 0
          ? selectedCategory.specializations
          : ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'],
        stages: selectedCategory.stages && selectedCategory.stages.length > 0
          ? selectedCategory.stages
          : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'A1-C2 Combined Package'],
        assignedCourseIds: selectedCategory.assignedCourseIds || [],
        linkedCourseId: selectedCategory.linkedCourseId || undefined,
        linkedCourseName: matchedCourse?.name || selectedCategory.linkedCourseName || undefined
      };

      let updatedList: GlobalCategory[] = [];
      if (selectedCategory.id && selectedCategory.id !== 'new') {
        updatedList = categoryList.map(c => c.id === selectedCategory.id ? catToSave : c);
        alert(`Category "${catToSave.name}" [${catToSave.code}] updated successfully.`);
      } else {
        updatedList = [...categoryList, catToSave];
        alert(`New Category "${catToSave.name}" [${catToSave.code}] created and added to directory.`);
      }

      // Sort by position
      updatedList.sort((a, b) => (a.position || 99) - (b.position || 99));
      setGlobalCategories(updatedList);
      setCategoryList(updatedList);

      // Synchronize wizard state
      setWizardCategory(catToSave.name);
      if (catToSave.subCategories && catToSave.subCategories.length > 0) {
        setWizardSubCategory(catToSave.subCategories[0]);
      }

      // Sync courses: if assignedCourseIds has entries, update those courses to this category
      let updatedCourses = [...courseList];
      let coursesModified = false;
      if (catToSave.assignedCourseIds && catToSave.assignedCourseIds.length > 0) {
        updatedCourses = updatedCourses.map(c => {
          if (catToSave.assignedCourseIds?.includes(c.id)) {
            coursesModified = true;
            return {
              ...c,
              category: catToSave.name
            };
          }
          return c;
        });
      }

      // If linked with a course, automatically update the course's category in the DB
      if (selectedCategory.linkedCourseId) {
        updatedCourses = updatedCourses.map(c => {
          if (c.id === selectedCategory.linkedCourseId) {
            coursesModified = true;
            return {
              ...c,
              category: catToSave.name,
              subCategory: catToSave.subCategories.length > 0 ? catToSave.subCategories[0] : c.subCategory
            };
          }
          return c;
        });
      }

      if (coursesModified) {
        setGlobalCourses(updatedCourses);
        setCourseList(updatedCourses);
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

      const defaultStagePricing: Record<string, string> = {
        'A1': '$129',
        'A2': '$149',
        'B1': '$179',
        'B2': '$219',
        'C1': '$269',
        'C2': '$319',
        'A1-C2 Package': '$799'
      };

      const finalStagePricing = selectedService.stagePricing && Object.keys(selectedService.stagePricing).length > 0
        ? selectedService.stagePricing
        : defaultStagePricing;

      const finalStages = selectedService.stages && selectedService.stages.length > 0
        ? selectedService.stages
        : (selectedService.stagePricing && Object.keys(selectedService.stagePricing).length > 0
            ? Object.keys(selectedService.stagePricing)
            : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'All Levels Combined']);

      const serviceToSave: GlobalPath = {
        ...selectedService,
        code: generatedCode,
        category: wizardCategory,
        subCategory: wizardSubCategory,
        position: typeof selectedService.position === 'number' && !isNaN(selectedService.position) ? selectedService.position : (serviceList.length + 1),
        methods: selectedService.methods || inlineTrainingMethod || 'Live AI Adaptive',
        trainingMethods: selectedService.trainingMethods && selectedService.trainingMethods.length > 0
          ? selectedService.trainingMethods
          : [selectedService.methods || inlineTrainingMethod || 'Live AI Adaptive'],
        noBatchRequired: selectedService.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired,
        specializations: selectedService.specializations && selectedService.specializations.length > 0
          ? selectedService.specializations
          : ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'],
        stages: finalStages,
        stagePricing: selectedService.stagePricing || {},
        fee: selectedService.fee || '',
        linkedCourseName: matchedCourse?.name || (selectedService.linkedCourseId ? selectedService.linkedCourseName : undefined)
      };

      if (selectedService.id && selectedService.id !== 'new') {
        const updated = serviceList.map(s => s.id === selectedService.id ? serviceToSave : s);
        setGlobalPaths(updated);
        setServiceList(updated);
        alert(`Education Path "${serviceToSave.name}" [${serviceToSave.code}] updated successfully.`);
        setWizardPathId(serviceToSave.id);
      } else {
        const newService: GlobalPath = {
          ...serviceToSave,
          id: Math.random().toString(36).substring(2, 9)
        };
        const updated = [...serviceList, newService];
        setGlobalPaths(updated);
        setServiceList(updated);
        alert(`New Education Path "${newService.name}" [${newService.code}] appended to directory.`);
        setWizardPathId(newService.id);
      }
      setSelectedService(null);
      setInlinePathName('');
      setInlineTrainingMethod('');
      setInlineNoBatchRequired(false);
    } else {
      if (!selectedBatch || !selectedBatch.name) {
        alert("Validation Error: Please provide a Batch Name.");
        return;
      }

      const generatedCode = selectedBatch.code?.trim() || generateUniqueCode('BAT', selectedBatch.name);
      const matchedCourse = courseList.find(c => c.id === selectedBatch.linkedCourseId);
      const matchedPath = serviceList.find(p => p.id === selectedBatch.linkedPathId);
      const studentUrl = selectedBatch.studentAccessUrl || `${window.location.origin}/#education?category=${encodeURIComponent(selectedBatch.category || wizardCategory || 'General')}&subCategory=${encodeURIComponent(selectedBatch.subCategory || wizardSubCategory || 'All')}&specialization=${encodeURIComponent(selectedBatch.specialization || wizardSpecialization || 'General')}&path=${encodeURIComponent(matchedPath?.name || selectedBatch.linkedPathName || 'Path')}&level=${encodeURIComponent(selectedBatch.level || wizardStage || 'All')}&batch=${encodeURIComponent(generatedCode)}`;

      const batchToSave: GlobalBatch = {
        ...selectedBatch,
        code: generatedCode,
        category: selectedBatch.category || wizardCategory,
        subCategory: selectedBatch.subCategory || wizardSubCategory,
        specialization: selectedBatch.specialization || wizardSpecialization,
        level: selectedBatch.level || wizardStage,
        fee: selectedBatch.fee || '$149',
        studentAccessUrl: studentUrl,
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

  // --- EXCEL-STYLE BATCH & PRICING MATRIX HANDLERS ---
  const handleGenerateMatrix = (targetCat?: string, targetSubCat?: string) => {
    const activeCat = targetCat || matrixCategory || wizardCategory || 'Language & Education';
    const activeSub = targetSubCat || matrixSubCategory || wizardSubCategory || 'German Language';

    const catObj = categoryList.find(c => c.name === activeCat);
    const specs = catObj?.specializations && catObj.specializations.length > 0
      ? catObj.specializations
      : ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'];

    // Collect all paths: Standard presets + all user-created / registered paths
    const presetPathItems: GlobalPath[] = STANDARD_PATH_PRESETS.map((p, idx) => ({
      id: `preset-${idx}`,
      name: p.name,
      code: `PRESET-${idx + 1}`,
      methods: p.method,
      trainingMethods: [p.method],
      starting: '',
      ending: '',
      remarks: `Standard Preset: ${p.method}`,
      stages: ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)'],
      noBatchRequired: p.noBatchRequired
    }));

    // Find custom paths that are registered
    const customRegisteredPaths = serviceList.filter(p =>
      !STANDARD_PATH_PRESETS.some(preset => preset.name.toLowerCase() === p.name.toLowerCase())
    );

    // If an existing registered path matches a preset name, overlay its custom configuration
    const mergedStandardPaths = presetPathItems.map(preset => {
      const customMatch = serviceList.find(s => s.name.toLowerCase() === preset.name.toLowerCase());
      if (customMatch) {
        return {
          ...preset,
          ...customMatch,
          noBatchRequired: customMatch.noBatchRequired !== undefined ? customMatch.noBatchRequired : preset.noBatchRequired,
          stages: customMatch.stages && customMatch.stages.length > 0 ? customMatch.stages : preset.stages
        };
      }
      return preset;
    });

    const allMatchedPaths = [...mergedStandardPaths, ...customRegisteredPaths];

    const currentBatches = getGlobalBatches();
    const rows: MatrixRowItem[] = [];

    specs.forEach((spec, sIdx) => {
      allMatchedPaths.forEach((pth, pIdx) => {
        const isNoBatch = pth.noBatchRequired !== undefined
          ? pth.noBatchRequired
          : (pth.methods?.toLowerCase().includes('ai') || pth.name.toLowerCase().includes('ai') || pth.name.toLowerCase().includes('intellicoach'));

        const levels = pth.stages && pth.stages.length > 0
          ? pth.stages
          : (pth.stagePricing && Object.keys(pth.stagePricing).length > 0
              ? Object.keys(pth.stagePricing)
              : (catObj?.stages && catObj.stages.length > 0
                  ? catObj.stages
                  : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)']));

        levels.forEach((lvl, lIdx) => {
          const rowId = `matrix-${sIdx}-${pIdx}-${lIdx}`;
          const existing = currentBatches.find(b =>
            (b.category === activeCat || !b.category) &&
            (b.subCategory === activeSub || !b.subCategory) &&
            b.specialization === spec &&
            (b.linkedPathId === pth.id || b.linkedPathName === pth.name) &&
            b.level === lvl
          );

          const codeSlug = (lvl || 'LVL').replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
          const defaultCode = existing?.code || (isNoBatch ? `AI-${codeSlug}-${sIdx + 1}${lIdx + 1}` : `BAT-${codeSlug}-${sIdx + 1}${lIdx + 1}`);
          const defaultBatchName = existing?.name || (isNoBatch ? `${lvl} 24/7 AI Access` : `${lvl} Cohort - ${spec.split('/')[0].trim()}`);
          const defaultPrice = existing?.fee || pth.stagePricing?.[lvl] || bulkMatrixPrice || '$149';
          const defaultTimings = existing?.timings && existing.timings.length > 0
            ? existing.timings
            : [isNoBatch ? 'Continuous 24/7 AI Access' : (bulkMatrixTiming || '09:00 - 11:00')];

          const studentUrl = existing?.studentAccessUrl || `${window.location.origin}/#education?category=${encodeURIComponent(activeCat)}&subCategory=${encodeURIComponent(activeSub)}&specialization=${encodeURIComponent(spec)}&path=${encodeURIComponent(pth.name)}&level=${encodeURIComponent(lvl)}&batch=${encodeURIComponent(defaultCode)}`;

          rows.push({
            id: rowId,
            specialization: spec,
            pathId: pth.id,
            pathName: pth.name,
            pathMethod: pth.methods || 'Live Interactive',
            noBatchRequired: !!isNoBatch,
            level: lvl,
            price: defaultPrice,
            batchName: defaultBatchName,
            timings: defaultTimings,
            code: defaultCode,
            isSaved: !!existing,
            batchId: existing?.id,
            studentAccessUrl: studentUrl
          });
        });
      });
    });

    setMatrixRows(rows);
    setIsMatrixGenerated(true);
  };

  const handleUpdateMatrixRow = (rowId: string, field: keyof MatrixRowItem, value: any) => {
    setMatrixRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, [field]: value };
      if (field === 'code' || field === 'batchName') {
        updated.studentAccessUrl = `${window.location.origin}/#education?category=${encodeURIComponent(matrixCategory)}&subCategory=${encodeURIComponent(matrixSubCategory)}&specialization=${encodeURIComponent(updated.specialization)}&path=${encodeURIComponent(updated.pathName)}&level=${encodeURIComponent(updated.level)}&batch=${encodeURIComponent(updated.code)}`;
      }
      return updated;
    }));
  };

  const handleSaveMatrixRow = (rowId: string) => {
    const row = matrixRows.find(r => r.id === rowId);
    if (!row) return;

    const currentBatches = getGlobalBatches();
    const batchId = row.batchId || `bat-${Math.random().toString(36).substring(2, 9)}`;
    const studentUrl = `${window.location.origin}/#education?category=${encodeURIComponent(matrixCategory)}&subCategory=${encodeURIComponent(matrixSubCategory)}&specialization=${encodeURIComponent(row.specialization)}&path=${encodeURIComponent(row.pathName)}&level=${encodeURIComponent(row.level)}&batch=${encodeURIComponent(row.code)}`;

    const isNoBatch = row.noBatchRequired;
    const defaultBatchTitle = isNoBatch ? `${row.level} 24/7 AI Access` : `${row.level} Cohort - ${row.specialization.split('/')[0].trim()}`;

    const batchToSave: GlobalBatch = {
      id: batchId,
      name: row.batchName || defaultBatchTitle,
      code: row.code,
      timings: row.timings && row.timings.length > 0 ? row.timings : [isNoBatch ? 'Continuous 24/7 AI Access' : '09:00 - 11:00'],
      starting: new Date().toISOString().split('T')[0],
      remarks: `${row.specialization} - ${row.pathName} (${row.level}) [${isNoBatch ? 'No Batch / Self-Paced AI' : 'Live Cohort'}]`,
      category: matrixCategory,
      subCategory: matrixSubCategory,
      specialization: row.specialization,
      level: row.level,
      fee: row.price,
      linkedPathId: row.pathId,
      linkedPathName: row.pathName,
      studentAccessUrl: studentUrl,
      noBatchRequired: isNoBatch,
      isSelfPaced: isNoBatch
    };

    let updatedList: GlobalBatch[];
    const exists = currentBatches.some(b => b.id === batchId);
    if (exists) {
      updatedList = currentBatches.map(b => b.id === batchId ? batchToSave : b);
    } else {
      updatedList = [batchToSave, ...currentBatches];
    }

    setBatchList(updatedList);
    setGlobalBatches(updatedList);
    setMatrixRows(prev => prev.map(r => r.id === rowId ? { ...r, isSaved: true, batchId, studentAccessUrl: studentUrl } : r));
    alert(isNoBatch
      ? `⚡ Self-Paced Access Registered!\nPath: ${batchToSave.linkedPathName} (${batchToSave.level})\nPrice: ${batchToSave.fee}\nDirect Student Access Link Generated (No Batch Cohort Required).`
      : `🎉 Batch "${batchToSave.name}" [${batchToSave.code}] created!\nPrice: ${batchToSave.fee}\nStudent Access Link Generated.`);
  };

  const handleBulkSaveMatrix = () => {
    if (matrixRows.length === 0) return;

    let updatedBatches = [...getGlobalBatches()];
    const updatedRows = matrixRows.map(row => {
      const batchId = row.batchId || `bat-${Math.random().toString(36).substring(2, 9)}`;
      const studentUrl = `${window.location.origin}/#education?category=${encodeURIComponent(matrixCategory)}&subCategory=${encodeURIComponent(matrixSubCategory)}&specialization=${encodeURIComponent(row.specialization)}&path=${encodeURIComponent(row.pathName)}&level=${encodeURIComponent(row.level)}&batch=${encodeURIComponent(row.code)}`;
      const isNoBatch = row.noBatchRequired;
      const defaultBatchTitle = isNoBatch ? `${row.level} 24/7 AI Access` : `${row.level} Cohort - ${row.specialization.split('/')[0].trim()}`;

      const batchToSave: GlobalBatch = {
        id: batchId,
        name: row.batchName || defaultBatchTitle,
        code: row.code,
        timings: row.timings && row.timings.length > 0 ? row.timings : [isNoBatch ? 'Continuous 24/7 AI Access' : '09:00 - 11:00'],
        starting: new Date().toISOString().split('T')[0],
        remarks: `${row.specialization} - ${row.pathName} (${row.level}) [${isNoBatch ? 'No Batch / Self-Paced AI' : 'Live Cohort'}]`,
        category: matrixCategory,
        subCategory: matrixSubCategory,
        specialization: row.specialization,
        level: row.level,
        fee: row.price,
        linkedPathId: row.pathId,
        linkedPathName: row.pathName,
        studentAccessUrl: studentUrl,
        noBatchRequired: isNoBatch,
        isSelfPaced: isNoBatch
      };

      const existingIndex = updatedBatches.findIndex(b => b.id === batchId);
      if (existingIndex >= 0) {
        updatedBatches[existingIndex] = batchToSave;
      } else {
        updatedBatches.push(batchToSave);
      }

      return { ...row, isSaved: true, batchId, studentAccessUrl: studentUrl };
    });

    setBatchList(updatedBatches);
    setGlobalBatches(updatedBatches);
    setMatrixRows(updatedRows);
    alert(`🎉 Successfully saved all ${updatedRows.length} batches & pricing links for "${matrixCategory} > ${matrixSubCategory}"!`);
  };

  // --- INLINE CATEGORY HANDLERS ---
  const handleInlineAddCategory = () => {
    const newCatName = selectedCategory?.name?.trim() || 'New Category';
    const newCode = generateUniqueCode('CAT', newCatName);
    const newCat: GlobalCategory = {
      id: `cat-${Math.random().toString(36).substring(2, 7)}`,
      name: newCatName,
      code: newCode,
      position: categoryList.length + 1,
      showInNav: true,
      isJobRelated: false,
      specializations: ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'],
      stages: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'A1-C2 Package'],
      subCategories: ['General Program'],
      subCategoryProducts: [{ id: 'prd-gen-1', name: 'General Program', code: `PRD-${newCode}-01`, position: 1 }],
      subCategoryCodes: { 'General Program': `PRD-${newCode}-01` },
      description: ''
    };
    const updated = [...categoryList, newCat];
    setCategoryList(updated);
    setGlobalCategories(updated);
    setSelectedCategory(newCat);
    setWizardCategory(newCat.name);
    setWizardSubCategory('General Program');
    alert(`New Category "${newCat.name}" created and selected.`);
  };

  const handleInlineEditCategory = () => {
    if (!selectedCategory || !selectedCategory.name?.trim()) {
      alert("Please select or specify a Category to update.");
      return;
    }
    const catToSave: GlobalCategory = {
      ...selectedCategory,
      code: selectedCategory.code?.trim() || generateUniqueCode('CAT', selectedCategory.name),
      position: typeof selectedCategory.position === 'number' ? selectedCategory.position : 1,
      subCategories: selectedCategory.subCategories || [],
      subCategoryProducts: selectedCategory.subCategoryProducts || buildSubCategoryProducts(selectedCategory.name, selectedCategory.subCategories || []),
      subCategoryCodes: selectedCategory.subCategoryCodes || {}
    };
    const updated = categoryList.map(c => c.id === catToSave.id ? catToSave : c);
    setCategoryList(updated);
    setGlobalCategories(updated);
    setWizardCategory(catToSave.name);
    alert(`Category "${catToSave.name}" updated successfully.`);
  };

  const handleInlineDeleteCategory = () => {
    if (!selectedCategory || selectedCategory.id === 'new') {
      setSelectedCategory(null);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${selectedCategory.name}"?`)) return;
    const updated = categoryList.filter(c => c.id !== selectedCategory.id);
    setCategoryList(updated);
    setGlobalCategories(updated);
    setSelectedCategory(null);
    alert("Category deleted successfully.");
  };

  // --- STAGE 1: SAVE & NEXT TO STAGE 2 ---
  const handleCategorySaveAndNext = () => {
    if (!selectedCategory || !selectedCategory.name.trim()) {
      alert("Validation Error: Please select or enter a Category Name.");
      return;
    }

    const generatedCode = selectedCategory.code?.trim() || generateUniqueCode('CAT', selectedCategory.name);
    const catToSave: GlobalCategory = {
      id: selectedCategory.id && selectedCategory.id !== 'new' ? selectedCategory.id : `cat-${Math.random().toString(36).substring(2, 7)}`,
      name: selectedCategory.name.trim(),
      code: generatedCode,
      description: selectedCategory.description?.trim() || '',
      subCategories: selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? selectedCategory.subCategories : ['General Program'],
      subCategoryProducts: selectedCategory.subCategoryProducts && selectedCategory.subCategoryProducts.length > 0
        ? selectedCategory.subCategoryProducts
        : buildSubCategoryProducts(selectedCategory.name, selectedCategory.subCategories || ['General Program']),
      subCategoryCodes: selectedCategory.subCategoryCodes || {},
      position: typeof selectedCategory.position === 'number' && !isNaN(selectedCategory.position) ? selectedCategory.position : (categoryList.length + 1),
      isJobRelated: !!selectedCategory.isJobRelated,
      showInNav: selectedCategory.showInNav !== false,
      specializations: selectedCategory.specializations && selectedCategory.specializations.length > 0
        ? selectedCategory.specializations
        : ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'],
      stages: selectedCategory.stages && selectedCategory.stages.length > 0
        ? selectedCategory.stages
        : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'A1-C2 Combined Package'],
      assignedCourseIds: selectedCategory.assignedCourseIds || [],
      linkedCourseId: selectedCategory.linkedCourseId || undefined,
      linkedCourseName: selectedCategory.linkedCourseName || undefined
    };

    let updatedList: GlobalCategory[] = [];
    if (selectedCategory.id && selectedCategory.id !== 'new') {
      updatedList = categoryList.map(c => c.id === selectedCategory.id ? catToSave : c);
    } else {
      updatedList = [...categoryList, catToSave];
    }
    updatedList.sort((a, b) => (a.position || 99) - (b.position || 99));
    setGlobalCategories(updatedList);
    setCategoryList(updatedList);
    setSelectedCategory(catToSave);

    // Carry forward into Wizard State
    setWizardCategory(catToSave.name);
    if (catToSave.subCategories && catToSave.subCategories.length > 0) {
      setWizardSubCategory(catToSave.subCategories[0]);
    }
    if (catToSave.specializations && catToSave.specializations.length > 0) {
      setWizardSpecialization(catToSave.specializations[0]);
    }

    // Advance smoothly to Stage 2
    setActiveTab('SERVICE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- STAGE 2: SAVE & NEXT TO STAGE 3 ---
  const handleServiceSaveAndNext = () => {
    const pName = (selectedService?.name || inlinePathName).trim();
    const pMethod = (selectedService?.methods || inlineTrainingMethod).trim();

    if (!pName) {
      alert("Validation Error: Please provide an Education Path Name.");
      return;
    }
    if (!pMethod) {
      alert("Validation Error: Please configure a Training Method for this path.");
      return;
    }

    const generatedCode = selectedService?.code?.trim() || generateUniqueCode('PTH', pName);
    const finalStages = selectedService?.stages && selectedService.stages.length > 0
      ? selectedService.stages
      : (selectedService?.stagePricing && Object.keys(selectedService.stagePricing).length > 0
          ? Object.keys(selectedService.stagePricing)
          : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'All Levels Combined']);

    const serviceToSave: GlobalPath = {
      ...(selectedService || {}),
      id: selectedService?.id && selectedService.id !== 'new' ? selectedService.id : `pth-${Math.random().toString(36).substring(2, 7)}`,
      name: pName,
      code: generatedCode,
      category: wizardCategory,
      subCategory: wizardSubCategory,
      position: typeof selectedService?.position === 'number' && !isNaN(selectedService.position) ? selectedService.position : (serviceList.length + 1),
      methods: pMethod,
      trainingMethods: selectedService?.trainingMethods && selectedService.trainingMethods.length > 0
        ? selectedService.trainingMethods
        : [pMethod],
      specializations: selectedService?.specializations && selectedService.specializations.length > 0
        ? selectedService.specializations
        : [wizardSpecialization || 'General / Standard'],
      stages: finalStages,
      stagePricing: selectedService?.stagePricing || {},
      fee: selectedService?.fee || '',
      starting: selectedService?.starting || new Date().toISOString().split('T')[0],
      ending: selectedService?.ending || '',
      remarks: selectedService?.remarks || `Specialized ${wizardSpecialization} curriculum track delivered via ${pMethod}.`
    };

    let updatedPaths: GlobalPath[] = [];
    if (selectedService?.id && selectedService.id !== 'new') {
      updatedPaths = serviceList.map(s => s.id === selectedService.id ? serviceToSave : s);
    } else {
      updatedPaths = [...serviceList, serviceToSave];
    }
    setGlobalPaths(updatedPaths);
    setServiceList(updatedPaths);
    setWizardPathId(serviceToSave.id);
    setSelectedService(serviceToSave);

    // Initialize default wizardStage from path stages or category
    if (serviceToSave.stages && serviceToSave.stages.length > 0) {
      setWizardStage(serviceToSave.stages[0]);
    } else {
      const isLang = wizardCategory.toLowerCase().includes('lang') || wizardCategory.toLowerCase().includes('german');
      setWizardStage(isLang ? 'A1' : 'Foundation');
    }

    // Smart auto-check for Batch applicability based on Training Method
    const lowerMethod = pMethod.toLowerCase();
    if (lowerMethod.includes('ai adaptive') || lowerMethod.includes('intellicoach') || lowerMethod.includes('video + ai') || lowerMethod.includes('slide + ai') || lowerMethod.includes('self-paced')) {
      setBatchNotApplicable(true);
    } else {
      setBatchNotApplicable(false);
    }

    // Advance to Stage 3: Batch & Slot Hub
    setActiveTab('BATCH');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- STAGE 3: INLINE BATCH HANDLERS ---
  const handleInlineAddBatch = () => {
    const bName = selectedBatch?.name?.trim() || 'New Cohort Batch';
    const newBatch: GlobalBatch = {
      id: `bat-${Math.random().toString(36).substring(2, 7)}`,
      name: bName,
      code: generateUniqueCode('BAT', bName),
      timings: ['09:00 AM - 11:00 AM IST'],
      starting: new Date().toISOString().split('T')[0],
      remarks: 'Open for enrollment',
      category: wizardCategory,
      subCategory: wizardSubCategory,
      specialization: wizardSpecialization,
      linkedPathId: wizardPathId,
      isSelfPaced: false
    };
    const updated = [...batchList, newBatch];
    setBatchList(updated);
    setGlobalBatches(updated);
    setSelectedBatch(newBatch);
    setWizardBatchId(newBatch.id);
    alert(`Batch "${newBatch.name}" created successfully.`);
  };

  const handleInlineEditBatch = () => {
    if (!selectedBatch || !selectedBatch.name?.trim()) {
      alert("Please select or enter a Batch Name.");
      return;
    }
    const updated = batchList.map(b => b.id === selectedBatch.id ? selectedBatch : b);
    setBatchList(updated);
    setGlobalBatches(updated);
    alert(`Batch "${selectedBatch.name}" updated successfully.`);
  };

  const handleInlineDeleteBatch = () => {
    if (!selectedBatch) return;
    if (!window.confirm(`Are you sure you want to delete batch "${selectedBatch.name}"?`)) return;
    const updated = batchList.filter(b => b.id !== selectedBatch.id);
    setBatchList(updated);
    setGlobalBatches(updated);
    setSelectedBatch(null);
    alert("Batch deleted.");
  };

  // --- STAGE 3: SAVE & GENERATE COURSE WITH AI ---
  const handleSaveAndGenerateWithAi = () => {
    const matchedPath = serviceList.find(p => p.id === wizardPathId) || serviceList[0];
    const stageSuffix = wizardStage ? ` (${wizardStage})` : '';
    const courseTitle = `${wizardSubCategory || wizardCategory} - ${wizardSpecialization || 'Specialization Track'}${stageSuffix}`;

    let effectiveBatch: GlobalBatch;

    if (batchNotApplicable) {
      effectiveBatch = {
        id: `batch-sp-${Math.random().toString(36).substring(2, 7)}`,
        name: 'IntelliCoach Open-Schedule (24/7 AI)',
        code: generateUniqueCode('BAT', 'AI-OPEN'),
        timings: ['24/7 On-Demand AI Access'],
        starting: new Date().toISOString().split('T')[0],
        remarks: 'Continuous enrollment with 24/7 on-demand IntelliCoach AI trainer. Fixed calendar batches bypassed.',
        linkedPathId: matchedPath?.id,
        linkedPathName: matchedPath?.name,
        isSelfPaced: true,
        category: wizardCategory,
        subCategory: wizardSubCategory,
        specialization: wizardSpecialization
      };
      const updatedBatches = [...batchList.filter(b => b.name !== effectiveBatch.name), effectiveBatch];
      setGlobalBatches(updatedBatches);
      setBatchList(updatedBatches);
      setWizardBatchId(effectiveBatch.id);
    } else {
      if (!selectedBatch || !selectedBatch.name?.trim()) {
        alert("Validation Error: Please select or enter a Batch Name.");
        return;
      }
      const bCode = selectedBatch.code?.trim() || generateUniqueCode('BAT', selectedBatch.name);
      effectiveBatch = {
        ...selectedBatch,
        id: selectedBatch.id && selectedBatch.id !== 'new' ? selectedBatch.id : `batch-${Math.random().toString(36).substring(2, 7)}`,
        name: selectedBatch.name.trim(),
        code: bCode,
        starting: selectedBatch.starting || new Date().toISOString().split('T')[0],
        timings: selectedBatch.timings && selectedBatch.timings.length > 0 ? selectedBatch.timings : ['09:00 AM - 11:00 AM IST'],
        remarks: selectedBatch.remarks || 'Standard Cohort Batch',
        linkedPathId: matchedPath?.id || selectedBatch.linkedPathId,
        linkedPathName: matchedPath?.name || selectedBatch.linkedPathName,
        category: wizardCategory,
        subCategory: wizardSubCategory,
        specialization: wizardSpecialization,
        isSelfPaced: false
      };
      let updatedBatches: GlobalBatch[];
      if (selectedBatch.id && selectedBatch.id !== 'new') {
        updatedBatches = batchList.map(b => b.id === selectedBatch.id ? effectiveBatch : b);
      } else {
        updatedBatches = [...batchList, effectiveBatch];
      }
      setGlobalBatches(updatedBatches);
      setBatchList(updatedBatches);
      setWizardBatchId(effectiveBatch.id);
    }

    // Synchronize course record into Global Courses
    const dynamicCompositeId = generateCompositeCourseId(
      wizardCategory,
      matchedPath?.name,
      batchNotApplicable ? 'AI-OPEN' : effectiveBatch.name,
      `${courseTitle}-${wizardStage || 'ALL'}`
    );
    const existingCourses = getGlobalCourses();
    const existingMatch = existingCourses.find(c => c.name.toLowerCase() === courseTitle.toLowerCase());

    const courseRecord: GlobalCourse = {
      id: existingMatch?.id || `crs-${Math.random().toString(36).substring(2, 7)}`,
      name: courseTitle,
      subtitle: `Mastery program in ${wizardCategory} - ${wizardSpecialization} [${wizardStage || 'All Stages'}]`,
      category: wizardCategory,
      subCategory: wizardSubCategory,
      top_title: wizardSpecialization,
      chapter: '10 Chapters',
      duration: '8 Weeks',
      staff: 'Senior Academic Lead',
      fee: matchedPath?.stagePricing?.[wizardStage] || matchedPath?.fee || '$799',
      methods: matchedPath?.methods || (batchNotApplicable ? 'Live AI Adaptive' : 'Live Interactive Mentorship'),
      materials: 'Curriculum slides, real-world case scenarios, AI simulator modules',
      students: '0',
      displayPosition: existingMatch?.displayPosition || existingCourses.length + 1,
      courseStructure: `Comprehensive curriculum for ${courseTitle}.\nCategory: ${wizardCategory} | Track: ${wizardSubCategory}\nDelivery Modality: ${matchedPath?.methods || 'AI Adaptive'}\nTarget Specialization: ${wizardSpecialization}\nLevel of Education: ${wizardStage}\nAllocated Schedule: ${batchNotApplicable ? 'Self-Paced AI (Continuous Enrollment - Batches Bypassed)' : effectiveBatch.name}`,
      libraryType: 'AI',
      aiLibrarySection: 'Intelli Coach Classes',
      testApprovalStatus: 'Approved',
      compositeCourseId: dynamicCompositeId
    };

    const updatedCourses = existingMatch
      ? existingCourses.map(c => c.id === courseRecord.id ? courseRecord : c)
      : [...existingCourses, courseRecord];
    setGlobalCourses(updatedCourses);
    setCourseList(updatedCourses);
    window.dispatchEvent(new CustomEvent('ilas-courses-changed'));

    // Construct Direct Student Access URL
    const studentAccessUrl = `${window.location.origin}/#education?category=${encodeURIComponent(wizardCategory)}&subCategory=${encodeURIComponent(wizardSubCategory)}&specialization=${encodeURIComponent(wizardSpecialization)}&stage=${encodeURIComponent(wizardStage)}`;

    // Construct AI Engine Hub URL parameters
    const baseUrl = 'https://ila-ai-engine-hub091026.vercel.app/';
    const params = new URLSearchParams();
    params.set('courseName', courseRecord.name);
    if (courseRecord.category) params.set('category', courseRecord.category);
    if (courseRecord.subCategory) params.set('subCategory', courseRecord.subCategory);
    if (courseRecord.top_title) params.set('topTitle', courseRecord.top_title);
    params.set('chapters', '10');
    params.set('duration', '8 Weeks');
    params.set('staff', 'Senior Academic Lead');
    params.set('fee', courseRecord.fee || '$799');
    params.set('methods', courseRecord.methods || 'Live AI Adaptive');
    if (matchedPath?.name) params.set('pathName', matchedPath.name);
    params.set('stage', wizardStage);
    params.set('level', wizardStage);
    params.set('batchName', batchNotApplicable ? 'Open-Schedule (24/7 AI)' : effectiveBatch.name);
    params.set('courseStructure', courseRecord.courseStructure || '');
    params.set('compositeId', dynamicCompositeId);
    params.set('studentUrl', studentAccessUrl);
    params.set('autoGenerate', 'true');
    params.set('returnUrl', window.location.href);

    const fullUrl = `${baseUrl}?${params.toString()}`;

    setGeneratedAiUrl(fullUrl);
    setGeneratedCourseSummary({
      title: courseRecord.name,
      category: wizardCategory,
      subCategory: wizardSubCategory,
      specialization: wizardSpecialization,
      stage: wizardStage,
      path: matchedPath?.name,
      method: matchedPath?.methods,
      batch: batchNotApplicable ? 'Bypassed (24/7 Open AI Access)' : effectiveBatch.name,
      compositeId: dynamicCompositeId,
      studentAccessUrl
    });
    setShowAiGenerationModal(true);

    // Launch external AI Engine in a new tab
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="flex-1 p-4 md:p-6 w-full flex flex-col gap-6 bg-slate-50 font-sans min-h-screen">

      {/* 4-Stage Sequential Creation Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { key: 'CATEGORY', stage: 'Stage 1', title: 'Category & Tracks', desc: 'Taxonomy & Ordering', count: categoryList.length, icon: FolderPlus },
            { key: 'SERVICE', stage: 'Stage 2', title: 'Education & Paths', desc: 'Methodologies & Pricing', count: serviceList.length, icon: Layers },
            { key: 'BATCH', stage: 'Stage 3', title: 'Batches, Slots & AI Hub', desc: batchNotApplicable ? 'Open-Schedule (Active)' : 'Timings & Schedules', count: batchList.length, icon: Clock },
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
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${isCurrent
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm ring-2 ring-brand-500/20'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isCurrent ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-brand-700'
                  }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-brand-200' : 'text-brand-600'}`}>
                      {item.stage}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
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
                  {activeTab === 'CATEGORY' && 'Stage 1: Category, Tracks & Specialization Management'}
                  {activeTab === 'SERVICE' && 'Stage 2: Education Path & Training Method Configuration'}
                  {activeTab === 'BATCH' && 'Stage 3: Batch, Slot & AI Generation Hub'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeTab === 'CATEGORY' && 'Define primary course categories, tracks, and specialization tracks with split inputs, position ordering, and inline controls.'}
                  {activeTab === 'SERVICE' && 'Inherited category context, structured path creation, integrated training methods, and dynamic education level builders.'}
                  {activeTab === 'BATCH' && 'Inherited pipeline hierarchy, batch vs self-paced conditional checks, automated slot codes, and direct AI Engine generation.'}
                </p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                {activeTab === 'CATEGORY' ? 'Stage 1: Taxonomy' : activeTab === 'SERVICE' ? 'Stage 2: Paths & Methods' : 'Stage 3: Batches & AI'}
              </span>
            </div>

            {/* TAB 1: CATEGORY & SUB-CATEGORY & SPECIALIZATION TRACK SINGLE-PAGE FORM */}
            {activeTab === 'CATEGORY' && (
              <div className="space-y-6">

                {/* 1. MAIN CATEGORY ROW & PLACEMENT CONTROLS */}
                <div className="bg-slate-50/90 p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <FolderPlus className="w-4 h-4 text-brand-600" />
                      1. Main Category Management
                    </label>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {categoryList.length} Categories Registered
                    </span>
                  </div>

                  {/* Split-Width Inputs with Inline Add/Edit/Delete Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Column 1: Dropdown to Choose Existing Category */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">Select Existing Category</label>
                      <select
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer shadow-2xs"
                        value={selectedCategory?.id || ''}
                        onChange={(e) => {
                          const catId = e.target.value;
                          if (!catId) {
                            setSelectedCategory(null);
                            return;
                          }
                          const matched = categoryList.find(c => c.id === catId);
                          if (matched) {
                            setSelectedCategory({ ...matched });
                            setWizardCategory(matched.name);
                            if (matched.subCategories && matched.subCategories.length > 0) {
                              setWizardSubCategory(matched.subCategories[0]);
                            }
                            if (matched.specializations && matched.specializations.length > 0) {
                              setWizardSpecialization(matched.specializations[0]);
                            }
                          }
                        }}
                      >
                        <option value="">-- Choose Category to Edit or Manage --</option>
                        {categoryList.map(c => (
                          <option key={c.id} value={c.id}>
                            📁 #{c.position || 1} {c.name} [{c.code || 'CAT'}]
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Column 2: Text Input for Category Name */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">Main Category Name *</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                        placeholder="e.g. Language & Education"
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

                    {/* Column 3: Inline Add / Edit / Delete Action Controls */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInlineAddCategory}
                        className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        title="Create new category"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleInlineEditCategory}
                        disabled={!selectedCategory || selectedCategory.id === 'new'}
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Save updates to selected category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleInlineDeleteCategory}
                        disabled={!selectedCategory || selectedCategory.id === 'new'}
                        className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Delete selected category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Clean Position Ordering Settings & Placement Controls */}
                  <div className="pt-3 border-t border-slate-200/80">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                      <span>Position Ordering &amp; Placement Controls</span>
                      <span className="text-slate-400 font-normal">Controls top navigation sequence &amp; portal routing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
                      {/* Checkbox: Main Navigation Bar */}
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors shadow-2xs">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          checked={selectedCategory?.showInNav !== false}
                          onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, showInNav: e.target.checked } : null)}
                        />
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Main Navigation Bar</span>
                      </label>

                      {/* Checkbox: Job-Related Courses Hub */}
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors shadow-2xs">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          checked={!!selectedCategory?.isJobRelated}
                          onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, isJobRelated: e.target.checked } : null)}
                        />
                        <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Job-Related Hub</span>
                      </label>

                      {/* Position Ordering Settings with Arrow Controls */}
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-brand-600" /> Order:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          className="w-14 p-1 text-xs font-bold border border-slate-300 rounded-lg text-center"
                          value={selectedCategory?.position ?? (categoryList.length + 1)}
                          onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, position: parseInt(e.target.value) || 1 } : null)}
                        />
                        {selectedCategory && (
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={!selectedCategory || (selectedCategory.position || 1) <= 1}
                              onClick={() => handleMoveCategoryOrder(selectedCategory.id, 'up')}
                              className="p-1 rounded bg-slate-100 hover:bg-brand-100 text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Position Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={!selectedCategory || (selectedCategory.position || 1) >= categoryList.length}
                              onClick={() => handleMoveCategoryOrder(selectedCategory.id, 'down')}
                              className="p-1 rounded bg-slate-100 hover:bg-brand-100 text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Position Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Code Settings */}
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-brand-600" /> Code:
                        </span>
                        <input
                          type="text"
                          className="flex-1 p-1 text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider border border-slate-300 rounded-lg"
                          placeholder="CAT-101"
                          value={selectedCategory?.code || ''}
                          onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCode = generateUniqueCode('CAT', selectedCategory?.name || 'GEN');
                            setSelectedCategory(prev => prev ? { ...prev, code: newCode } : { id: 'new', name: '', code: newCode, subCategories: [], description: '' });
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer border border-indigo-200"
                          title="Auto-generate unique code"
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SUB-CATEGORY / PRODUCT NAME MANAGEMENT ROW & POSITION ORDERING CONTROLS */}
                <div className="bg-brand-50/30 p-5 sm:p-6 rounded-2xl border border-brand-200/80 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-200/70">
                    <div>
                      <label className="text-xs font-black text-brand-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Tag className="w-4 h-4 text-brand-600" />
                        2. Sub-Category / Course Name Management
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Configure specific course names (e.g. German Language, IELTS, TOEFL) and unique product codes. Displays under "Select Course" in the frontend.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-brand-700 bg-white px-2.5 py-1 rounded-full border border-brand-200 self-start sm:self-auto shrink-0 shadow-2xs">
                      {selectedCategory?.subCategories?.length || 0} Products Active
                    </span>
                  </div>

                  {/* Split-Width Inputs for Sub-Category / Product Name, Product Code & Positioning */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Column 1: Dropdown of Existing Sub-Categories / Products */}
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-brand-900">Select Existing Product / Template</label>
                      <select
                        className="w-full border border-brand-300 rounded-xl p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-brand-500 text-slate-800 cursor-pointer shadow-2xs"
                        value={wizardSubCategory}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWizardSubCategory(val);
                          handleSelectProductForEdit(val);
                        }}
                      >
                        <option value="">-- Choose Existing Product or Template --</option>
                        {selectedCategory?.subCategories && selectedCategory.subCategories.length > 0 && (
                          <optgroup label="📋 Active Category Products">
                            {selectedCategory.subCategories.map((sub, idx) => {
                              const code = selectedCategory?.subCategoryCodes?.[sub] || selectedCategory?.subCategoryProducts?.find(p => p.name === sub)?.code;
                              return (
                                <option key={idx} value={sub}>
                                  🏷️ #{idx + 1} {sub} {code ? `[${code}]` : ''}
                                </option>
                              );
                            })}
                          </optgroup>
                        )}
                        <optgroup label="✨ Curated Program Templates">
                          {getSubCategoryPresets(selectedCategory?.name || wizardCategory).map((preset, idx) => (
                            <option key={`preset-${idx}`} value={preset}>
                              ⚡ {preset}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Column 2: Sub-Category / Product Name Input */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-brand-900">Sub-Category / Product Name *</label>
                      <input
                        type="text"
                        className="w-full border border-brand-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                        placeholder="e.g. German Language, IELTS, TOEFL, PET, French, Spanish, Medical German & FSP"
                        value={newSubCategoryTag}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewSubCategoryTag(val);
                          if (!newProductCode) {
                            setNewProductCode(generateProductCode(selectedCategory?.name || wizardCategory, val));
                          }
                          if (newProductPosition === '') {
                            setNewProductPosition((selectedCategory?.subCategories?.length || 0) + 1);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOrUpdateProduct();
                          }
                        }}
                      />
                    </div>

                    {/* Column 3: Product Code Input with Auto-Gen Button */}
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-brand-900">Product Code *</label>
                        <button
                          type="button"
                          onClick={() => {
                            const code = generateProductCode(selectedCategory?.name || wizardCategory, newSubCategoryTag || 'PRD');
                            setNewProductCode(code);
                          }}
                          className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer flex items-center gap-0.5"
                          title="Generate Unique Product Code"
                        >
                          <Zap className="w-2.5 h-2.5" /> Auto-Gen
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full border border-brand-300 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-950 uppercase bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                          placeholder="e.g. PRD-LANG-GER01"
                          value={newProductCode}
                          onChange={(e) => setNewProductCode(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>

                    {/* Column 4: Display Order / Position */}
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-brand-900">Display Order</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        className="w-full border border-brand-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 text-center bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                        placeholder="1"
                        value={newProductPosition}
                        onChange={(e) => setNewProductPosition(e.target.value ? parseInt(e.target.value) : '')}
                      />
                    </div>
                  </div>

                  {/* Inline Action Controls Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-brand-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        setNewSubCategoryTag('');
                        setNewProductCode('');
                        setNewProductPosition('');
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Clear Inputs
                    </button>

                    <button
                      type="button"
                      onClick={handleAddOrUpdateProduct}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                      title="Add or update product"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{selectedCategory?.subCategories?.includes(newSubCategoryTag.trim()) ? 'Save Product Changes' : '+ Add Product'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!wizardSubCategory}
                      onClick={() => handleDeleteProduct(newSubCategoryTag || wizardSubCategory)}
                      className="py-2 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Delete selected product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Clean Position Ordering & Product Code Inventory Grid */}
                  <div className="pt-3 border-t border-brand-200/70">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-black uppercase tracking-wider text-brand-800 mb-2.5">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-brand-600" />
                        Sub-Category / Product Display Order &amp; Code Registry
                      </span>
                      <span className="text-slate-500 font-normal">
                        Order reflects dynamically across frontend navigation bars &amp; catalog blocks
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {selectedCategory?.subCategories?.map((tag, idx) => {
                        const isSelected = wizardSubCategory === tag;
                        const code = selectedCategory?.subCategoryCodes?.[tag] ||
                          selectedCategory?.subCategoryProducts?.find(p => p.name === tag)?.code ||
                          `PRD-${(selectedCategory?.code || 'CAT').substring(0, 4)}-${String(idx + 1).padStart(2, '0')}`;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectProductForEdit(tag)}
                            className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-2xs ${
                              isSelected
                                ? 'bg-gradient-to-br from-brand-600 to-indigo-700 text-white border-brand-700 ring-2 ring-brand-300 shadow-md scale-[1.01]'
                                : 'bg-white border-brand-200 text-slate-800 hover:bg-brand-50/70 hover:border-brand-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-800'
                              }`}>
                                Order #{idx + 1}
                              </span>

                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                                isSelected ? 'bg-white/25 text-amber-200' : 'bg-slate-100 text-indigo-700 border border-indigo-100'
                              }`}>
                                {code}
                              </span>
                            </div>

                            <div className="font-black text-sm tracking-tight line-clamp-1">
                              🏷️ {tag}
                            </div>

                            <div className="flex items-center justify-between pt-1.5 border-t border-current/15" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveSubCategoryOrder(idx, 'up')}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-25 transition-colors ${
                                    isSelected ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Move Display Order Up"
                                >
                                  ▲ Up
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (selectedCategory?.subCategories?.length || 1) - 1}
                                  onClick={() => handleMoveSubCategoryOrder(idx, 'down')}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-25 transition-colors ${
                                    isSelected ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Move Display Order Down"
                                >
                                  ▼ Down
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSelectProductForEdit(tag)}
                                  className={`p-1 rounded-lg cursor-pointer ${
                                    isSelected ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-slate-100'
                                  }`}
                                  title="Edit this product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(tag)}
                                  className={`p-1 rounded-lg cursor-pointer ${
                                    isSelected ? 'text-white hover:bg-red-500/40' : 'text-red-500 hover:bg-red-50'
                                  }`}
                                  title="Delete this product"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {(!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0) && (
                      <div className="text-xs text-slate-400 italic bg-white/60 p-4 rounded-xl border border-dashed border-brand-200 text-center">
                        No sub-category products added yet. Click a quick-add template above or type a name and click "+ Add Product".
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. SPECIALIZATION TRACK ROW & POSITION ORDERING CONTROLS */}
                <div className="bg-indigo-50/40 p-5 sm:p-6 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-200/70">
                    <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="w-4 h-4 text-indigo-600" />
                      3. Specialization Track Configuration
                    </label>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {selectedCategory?.specializations?.length || 0} Specializations Registered
                    </span>
                  </div>

                  {/* Split-Width Inputs with Inline Add/Edit/Delete Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Column 1: Dropdown Selector */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-indigo-900">Select Specialization Preset / Track</label>
                      <select
                        className="w-full border border-indigo-300 rounded-xl p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800 cursor-pointer shadow-2xs"
                        value={wizardSpecialization}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWizardSpecialization(val);
                          setNewSpecializationTag(val);
                        }}
                      >
                        <option value="">-- Choose Preset or Track --</option>
                        {[
                          'General / Standard',
                          'Healthcare / Doctors',
                          'Engineers',
                          'IT & Software',
                          'Business & Management',
                          'Finance & Accounting',
                          'Dentists & Clinical',
                          'Cloud & DevOps',
                          'Data Science & AI',
                          ...(selectedCategory?.specializations || [])
                        ].filter((v, i, a) => a.indexOf(v) === i).map((spec) => (
                          <option key={spec} value={spec}>
                            🎯 {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Column 2: Text Input for Specialization Name */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-indigo-900">Specialization Track Name *</label>
                      <input
                        type="text"
                        className="w-full border border-indigo-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                        placeholder="e.g. Healthcare / Doctors"
                        value={newSpecializationTag}
                        onChange={(e) => setNewSpecializationTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSpecializationTag();
                          }
                        }}
                      />
                    </div>

                    {/* Column 3: Inline Add / Edit / Delete Controls */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddSpecializationTag()}
                        className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        title="Add Specialization Track"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>

                      <button
                        type="button"
                        disabled={!wizardSpecialization || !selectedCategory?.specializations?.includes(wizardSpecialization)}
                        onClick={() => {
                          if (!wizardSpecialization || !newSpecializationTag.trim()) return;
                          const oldVal = wizardSpecialization;
                          const newVal = newSpecializationTag.trim();
                          setSelectedCategory((prev: GlobalCategory | null) => {
                            if (!prev || !prev.specializations) return prev;
                            const list = prev.specializations.map(s => s === oldVal ? newVal : s);
                            return { ...prev, specializations: list };
                          });
                          setWizardSpecialization(newVal);
                          alert(`Specialization updated to "${newVal}".`);
                        }}
                        className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Update selected specialization"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={!wizardSpecialization || !selectedCategory?.specializations?.includes(wizardSpecialization)}
                        onClick={() => {
                          if (!wizardSpecialization) return;
                          const idx = selectedCategory?.specializations?.indexOf(wizardSpecialization) ?? -1;
                          if (idx !== -1) {
                            handleRemoveSpecializationTag(idx);
                            setWizardSpecialization(selectedCategory?.specializations?.[0] || 'General / Standard');
                            setNewSpecializationTag('');
                          }
                        }}
                        className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Delete selected specialization"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Position Ordering Settings & 1-Click Presets */}
                  <div className="pt-3 border-t border-indigo-200/70 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-[10px] font-black uppercase tracking-wider text-indigo-800">
                        Configured Specialization Tracks &amp; Sequence
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500">1-Click Add:</span>
                        {[
                          'Healthcare / Doctors',
                          'Engineers',
                          'IT & Software',
                          'Business & Management'
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAddSpecializationTag(preset)}
                            className="text-[10px] font-bold bg-white text-indigo-800 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md cursor-pointer transition-all shadow-2xs"
                          >
                            + {preset.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Specialization Chips with Position Controls */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(selectedCategory?.specializations || [
                        'General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'
                      ]).map((spec, idx) => {
                        const isSelected = wizardSpecialization === spec;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setWizardSpecialization(spec);
                              setNewSpecializationTag(spec);
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400/30'
                                : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50'
                            }`}
                          >
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              #{idx + 1}
                            </span>
                            <span>🎯 {spec}</span>
                            <div className="flex items-center gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveSpecializationOrder(idx, 'up')}
                                className={`p-0.5 rounded cursor-pointer disabled:opacity-25 ${isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                title="Move Position Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === (selectedCategory?.specializations?.length || 1) - 1}
                                onClick={() => handleMoveSpecializationOrder(idx, 'down')}
                                className={`p-0.5 rounded cursor-pointer disabled:opacity-25 ${isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                title="Move Position Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecializationTag(idx)}
                                className={`p-0.5 rounded cursor-pointer ${isSelected ? 'text-white hover:text-red-200' : 'text-slate-400 hover:text-red-600'}`}
                                title="Remove specialization"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SERVICE TAB FORM (EDUCATION PATH & LEVEL PRICING MATRIX) */}
            {activeTab === 'SERVICE' && (
              <div className="space-y-6">

                {/* 1. TOP CASCADE CONTEXT SELECTORS (Main Category, Sub-Category & Specialization Track) */}
                <div className="bg-gradient-to-r from-slate-50 via-brand-50/40 to-indigo-50/40 p-5 rounded-2xl border border-brand-200/90 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-200/60 mb-3.5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Context Carried Forward from Stage 1 (Category, Track &amp; Specialization)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Auto-Synchronized
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 1. Main Category Selector */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <FolderPlus className="w-3.5 h-3.5 text-brand-600" />
                        1. Main Category *
                      </label>
                      <select
                        className="border-2 border-brand-200 rounded-xl p-2.5 text-xs bg-white font-bold text-slate-900 focus:ring-1 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        value={wizardCategory}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWizardCategory(val);
                          const matched = categoryList.find(c => c.name === val);
                          if (matched && matched.subCategories && matched.subCategories.length > 0) {
                            setWizardSubCategory(matched.subCategories[0]);
                          }
                          if (matched && matched.specializations && matched.specializations.length > 0) {
                            setWizardSpecialization(matched.specializations[0]);
                          }
                        }}
                      >
                        {categoryList.map(c => (
                          <option key={c.id} value={c.name}>
                            📁 {c.name} [{c.code || 'CAT'}]
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Sub-Category / Product Name Selector */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        2. Sub-Category / Product Name *
                      </label>
                      <select
                        className="border-2 border-indigo-200 rounded-xl p-2.5 text-xs bg-white font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                        value={wizardSubCategory}
                        onChange={(e) => setWizardSubCategory(e.target.value)}
                      >
                        {(() => {
                          const currentCat = categoryList.find(c => c.name === wizardCategory);
                          const products = currentCat?.subCategories || [wizardSubCategory].filter(Boolean);
                          if (products.length === 0) return <option value="">General Program</option>;
                          return products.map((t, idx) => {
                            const code = currentCat?.subCategoryCodes?.[t] || currentCat?.subCategoryProducts?.find(p => p.name === t)?.code;
                            return (
                              <option key={idx} value={t}>
                                🏷️ #{idx + 1} {t} {code ? `[${code}]` : ''}
                              </option>
                            );
                          });
                        })()}
                      </select>
                    </div>

                    {/* 3. Specialization Track Selector */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                        3. Specialization Track *
                      </label>
                      <select
                        className="border-2 border-purple-200 rounded-xl p-2.5 text-xs bg-white font-bold text-slate-900 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-2xs"
                        value={wizardSpecialization}
                        onChange={(e) => setWizardSpecialization(e.target.value)}
                      >
                        {(() => {
                          const currentCat = categoryList.find(c => c.name === wizardCategory);
                          const specs = currentCat?.specializations || [
                            'General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'
                          ];
                          return specs.map((s, idx) => (
                            <option key={idx} value={s}>
                              🎯 {s}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. UNIFIED EDUCATION PATH & TRAINING METHOD CONFIGURATION BLOCK */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div>
                      <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <Layers className="w-4 h-4 text-brand-600" />
                        Education Path &amp; Training Delivery Method
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Select a path preset or registered path from the dropdown, configure its delivery method and pricing. All updates synchronize with the frontend in real time.
                      </p>
                    </div>

                    {/* Mode Tag */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-800 px-3 py-1 rounded-full border border-brand-200 flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Real-Time Frontend Sync</span>
                      </span>
                    </div>
                  </div>

                  {/* 1. PRIMARY PATH SELECTION DROPDOWN (FIRST) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                        <span>Select Education Path / Preset *</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Choose from standard presets or existing registered paths
                      </span>
                    </label>

                    <select
                      className="w-full border-2 border-brand-200 rounded-xl p-3 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-xs"
                      value={selectedService?.id || (STANDARD_PATH_PRESETS.some(p => p.name === inlinePathName) ? `preset-${inlinePathName}` : (inlinePathName ? '__CUSTOM__' : ''))}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          setSelectedService(null);
                          setInlinePathName('');
                          setInlineTrainingMethod('');
                          return;
                        }
                        if (val.startsWith('preset-')) {
                          const pName = val.replace('preset-', '');
                          const preset = STANDARD_PATH_PRESETS.find(p => p.name === pName);
                          if (preset) {
                            setInlinePathName(preset.name);
                            setInlineTrainingMethod(preset.method);
                            setInlineNoBatchRequired(!!preset.noBatchRequired);
                            const defaultPricing = {
                              'A1': '$129', 'A2': '$149', 'B1': '$179', 'B2': '$219', 'C1': '$269', 'C2': '$319', 'A1-C2 Package': preset.fee || '$799'
                            };
                            const newPath: GlobalPath = {
                              id: `pth-${Math.random().toString(36).substring(2, 7)}`,
                              name: preset.name,
                              code: generateUniqueCode('PTH', preset.name),
                              methods: preset.method,
                              trainingMethods: [preset.method],
                              noBatchRequired: !!preset.noBatchRequired,
                              starting: new Date().toISOString().split('T')[0],
                              ending: '',
                              remarks: `Specialized ${wizardSpecialization} curriculum track delivered via ${preset.method}.`,
                              category: wizardCategory,
                              subCategory: wizardSubCategory,
                              specializations: [wizardSpecialization],
                              stages: Object.keys(defaultPricing),
                              stagePricing: defaultPricing,
                              fee: preset.fee
                            };
                            setSelectedService(newPath);
                            setWizardPathId(newPath.id);
                          }
                          return;
                        }
                        if (val === '__CUSTOM__') {
                          setInlinePathName('New Custom Path');
                          setInlineNoBatchRequired(false);
                          setSelectedService({
                            id: 'new',
                            name: 'New Custom Path',
                            code: generateUniqueCode('PTH', 'Custom'),
                            methods: inlineTrainingMethod || 'Live AI Adaptive',
                            trainingMethods: [inlineTrainingMethod || 'Live AI Adaptive'],
                            noBatchRequired: false,
                            starting: new Date().toISOString().split('T')[0],
                            ending: '',
                            remarks: `Specialized ${wizardSpecialization} custom track.`,
                            category: wizardCategory,
                            subCategory: wizardSubCategory,
                            specializations: [wizardSpecialization],
                            stages: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'A1-C2 Package'],
                            stagePricing: { 'A1': '$129', 'A2': '$149', 'B1': '$179', 'B2': '$219', 'C1': '$269', 'C2': '$319', 'A1-C2 Package': '$799' },
                            fee: '$799'
                          });
                          return;
                        }
                        // Existing path selection
                        const matched = serviceList.find(p => p.id === val);
                        if (matched) {
                          setSelectedService({ ...matched });
                          setInlinePathName(matched.name);
                          setInlineTrainingMethod(matched.methods);
                          setInlineNoBatchRequired(!!matched.noBatchRequired);
                          setWizardPathId(matched.id);
                          if (matched.category) setWizardCategory(matched.category);
                          if (matched.subCategory) setWizardSubCategory(matched.subCategory);
                        }
                      }}
                    >
                      <option value="">-- Choose Education Path Preset or Existing Path --</option>
                      
                      <optgroup label="✨ Quick Path Presets (Standard Curriculum)">
                        {STANDARD_PATH_PRESETS.map((p) => (
                          <option key={p.name} value={`preset-${p.name}`}>
                            ⚡ {p.name} — {p.method} ({p.fee})
                          </option>
                        ))}
                      </optgroup>

                      {serviceList.length > 0 && (
                        <optgroup label="📚 Registered Education Paths (System Database)">
                          {serviceList.map((p) => (
                            <option key={p.id} value={p.id}>
                              📁 {p.name} [{p.code || 'PTH'}] — {p.methods} ({p.fee || '$799'})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      <option value="__CUSTOM__">➕ + Create Custom Education Path Name...</option>
                    </select>
                  </div>

                  {/* 2. PATH NAME & CODE ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                    {/* Path Name Input */}
                    <div className="md:col-span-8 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Edit className="w-3.5 h-3.5 text-brand-600" />
                        Education Path Name *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                        placeholder="e.g. IntelliCoach AI Adaptive Path"
                        value={inlinePathName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInlinePathName(val);
                          setSelectedService(prev => prev ? { ...prev, name: val, code: prev.code || generateUniqueCode('PTH', val) } : null);
                        }}
                      />
                    </div>

                    {/* Path Code */}
                    <div className="md:col-span-4 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-700">Path Code</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-700 bg-slate-50 focus:bg-white"
                        placeholder="PTH-CODE"
                        value={selectedService?.code || ''}
                        onChange={(e) => setSelectedService(prev => prev ? { ...prev, code: e.target.value } : null)}
                      />
                    </div>
                  </div>

                  {/* 3. DEDICATED TRAINING METHOD INPUT DIRECTLY IN THIS SAME BLOCK */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Radio className="w-4 h-4 text-brand-600" />
                        Training Delivery Method (Delivery Modality) *
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Modality for this specific path (Live AI, 1-to-1, Cohorts, Mega-Camp, etc.)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      {/* Delivery Modality Quick Selector */}
                      <div className="md:col-span-6 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700">Choose Delivery Modality</label>
                        <select
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs cursor-pointer"
                          value={inlineTrainingMethod || selectedService?.methods || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInlineTrainingMethod(val);
                            setSelectedService(prev => prev ? { ...prev, methods: val, trainingMethods: [val] } : null);
                          }}
                        >
                          <option value="">-- Select Standard Modality --</option>
                          {[
                            'Live AI Adaptive',
                            'Interactive Video + AI Stream',
                            'Visual Knowledge Decks & AI Drills',
                            '1-to-1 Private Mentorship',
                            'Online Interactive Cohorts',
                            'Physical Immersion Mega-Camp',
                            'On-Site Campus & Corporate Delivery',
                            'Hybrid (Live + AI Adaptive)',
                            'Spot Problem-Solving Sprint'
                          ].map((m) => (
                            <option key={m} value={m}>
                              🎯 {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Editable Text Field */}
                      <div className="md:col-span-6 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700">Custom / Specific Method Name</label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                          placeholder="e.g. Live AI Adaptive"
                          value={inlineTrainingMethod || selectedService?.methods || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInlineTrainingMethod(val);
                            setSelectedService(prev => prev ? { ...prev, methods: val, trainingMethods: [val] } : null);
                          }}
                        />
                      </div>
                    </div>

                    {/* NO BATCH REQUIRED / SELF-PACED AI TOGGLE */}
                    <div className="pt-2 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 p-3 rounded-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <Zap className={`w-4 h-4 ${(selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired) ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                            No Batch Required (Self-Paced / 24/7 AI Access)
                          </span>
                          {(selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired) && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                              Active: 24/7 Continuous Access
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Enable for AI-driven self-paced paths (IntelliCoach AI, Video + AI, Slide + AI). When enabled, students get direct instant enrollment links without waiting for scheduled cohort batches.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired;
                          const nextVal = !currentVal;
                          setInlineNoBatchRequired(nextVal);
                          setSelectedService(prev => prev ? { ...prev, noBatchRequired: nextVal } : null);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all border shrink-0 ${
                          (selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired)
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {(selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired) ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-slate-950" />
                            <span>✓ No Batch Required (Ticked)</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-slate-400" />
                            <span>Requires Live Cohort Batch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 4. ACTIONS & REAL-TIME PREVIEW ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-slate-500 font-bold">Frontend Preview:</span>
                      <span className="font-black text-slate-900">{inlinePathName || selectedService?.name || 'Path Title'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-brand-700 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {inlineTrainingMethod || selectedService?.methods || 'Live AI Adaptive'}
                      </span>
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {selectedService?.stages?.length ? `${selectedService.stages.length} Levels Defined` : 'CEFR Levels Ready'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const pName = (inlinePathName || selectedService?.name || '').trim();
                          const pMethod = (inlineTrainingMethod || selectedService?.methods || 'Live AI Adaptive').trim();
                          if (!pName) {
                            alert("Please enter or select a Path Name.");
                            return;
                          }
                          const newCode = selectedService?.code?.trim() || generateUniqueCode('PTH', pName);
                          const isExisting = selectedService?.id && selectedService.id !== 'new';
                          const finalStages = selectedService?.stages && selectedService.stages.length > 0
                            ? selectedService.stages
                            : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'All Levels Combined'];

                          const isNoBatchChecked = selectedService?.noBatchRequired !== undefined ? selectedService.noBatchRequired : inlineNoBatchRequired;

                          const pathRecord: GlobalPath = {
                            ...(selectedService || {}),
                            id: isExisting ? selectedService.id : `pth-${Math.random().toString(36).substring(2, 7)}`,
                            name: pName,
                            code: newCode,
                            methods: pMethod,
                            trainingMethods: [pMethod],
                            noBatchRequired: isNoBatchChecked,
                            starting: selectedService?.starting || new Date().toISOString().split('T')[0],
                            ending: selectedService?.ending || '',
                            remarks: selectedService?.remarks || `Specialized ${wizardSpecialization} curriculum track delivered via ${pMethod}.`,
                            category: wizardCategory,
                            subCategory: wizardSubCategory,
                            specializations: [wizardSpecialization],
                            stages: finalStages,
                            stagePricing: selectedService?.stagePricing || {},
                            fee: selectedService?.fee || ''
                          };

                          let updated: GlobalPath[];
                          if (isExisting) {
                            updated = serviceList.map(s => s.id === pathRecord.id ? pathRecord : s);
                          } else {
                            updated = [...serviceList, pathRecord];
                          }
                          setServiceList(updated);
                          setGlobalPaths(updated);
                          setSelectedService(pathRecord);
                          setWizardPathId(pathRecord.id);
                          alert(isExisting ? `Path "${pathRecord.name}" updated successfully.` : `Path "${pathRecord.name}" added to system and synchronized.`);
                        }}
                        className="py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{selectedService?.id && selectedService.id !== 'new' ? 'Update Path' : '+ Save Path to Dropdown'}</span>
                      </button>

                      {selectedService?.id && selectedService.id !== 'new' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Delete path "${selectedService.name}"?`)) return;
                            const updated = serviceList.filter(s => s.id !== selectedService.id);
                            setServiceList(updated);
                            setGlobalPaths(updated);
                            setSelectedService(null);
                            setInlinePathName('');
                            setInlineTrainingMethod('');
                            alert("Path deleted.");
                          }}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. DYNAMIC 'ADD EDUCATION LEVEL' BUILDER */}
                <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white p-5 sm:p-6 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-200/80">
                    <div>
                      <label className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        Education Level Builder
                      </label>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Define academic education levels (A1, A2, B1, etc.) for this path. Pricing and batch allocation are configured in Stage 3.
                      </p>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Presets:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const langStages = ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'All Levels Combined'];
                          setSelectedService((prev: GlobalPath | null) => ({
                            ...(prev || {
                              id: 'new',
                              name: inlinePathName || 'IntelliCoach AI Path',
                              methods: inlineTrainingMethod || 'Live AI Adaptive',
                              starting: '',
                              ending: '',
                              remarks: '',
                              code: generateUniqueCode('PTH', 'Lang')
                            }),
                            stages: langStages
                          }));
                        }}
                        className="text-[10px] font-bold bg-white text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 cursor-pointer shadow-2xs transition-all"
                      >
                        Language CEFR (A1–C2)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const techStages = ['Foundation', 'Intermediate', 'Advanced', 'Full Track Package'];
                          setSelectedService((prev: GlobalPath | null) => ({
                            ...(prev || {
                              id: 'new',
                              name: inlinePathName || 'Full-Stack Track',
                              methods: inlineTrainingMethod || 'Live AI Adaptive',
                              starting: '',
                              ending: '',
                              remarks: '',
                              code: generateUniqueCode('PTH', 'Tech')
                            }),
                            stages: techStages
                          }));
                        }}
                        className="text-[10px] font-bold bg-white text-teal-800 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 cursor-pointer shadow-2xs transition-all"
                      >
                        Tech Track (Found–Adv)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedService((prev: GlobalPath | null) => prev ? { ...prev, stages: [] } : null);
                        }}
                        className="text-[10px] font-bold bg-white text-slate-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-slate-300 cursor-pointer transition-all"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Level Items List */}
                  <div className="space-y-2.5">
                    {(() => {
                      const activeStages = selectedService?.stages && selectedService.stages.length > 0
                        ? selectedService.stages
                        : (selectedService?.stagePricing && Object.keys(selectedService.stagePricing).length > 0
                            ? Object.keys(selectedService.stagePricing)
                            : ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)']);

                      return activeStages.map((stageName, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border bg-white border-emerald-200 hover:border-emerald-300 flex items-center justify-between gap-3 shadow-2xs transition-all"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 w-8 text-center">
                              #{idx + 1}
                            </span>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={stageName}
                                onChange={(e) => {
                                  const newName = e.target.value;
                                  setSelectedService((prev: GlobalPath | null) => {
                                    if (!prev) return prev;
                                    const updated = [...(prev.stages || activeStages)];
                                    updated[idx] = newName;
                                    return {
                                      ...prev,
                                      stages: updated
                                    };
                                  });
                                }}
                                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                                placeholder="e.g. A1, A2, Foundation"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedService((prev: GlobalPath | null) => {
                                if (!prev) return prev;
                                const updated = (prev.stages || activeStages).filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  stages: updated
                                };
                              });
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete this level"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Dynamic Add Level Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-200/80 bg-white/90 p-4 rounded-xl border border-emerald-200 shadow-2xs">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                        New Level Name (e.g. A1, A2, B1, Intermediate)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. A1 (Beginner)"
                        value={newLevelName}
                        onChange={(e) => setNewLevelName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const stageVal = newLevelName.trim();
                            if (!stageVal) return;
                            setSelectedService((prev: GlobalPath | null) => {
                              const currentStages = prev?.stages || ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)'];
                              return {
                                ...(prev || {
                                  id: 'new',
                                  name: inlinePathName || 'New Education Path',
                                  methods: inlineTrainingMethod || 'Live AI Adaptive',
                                  starting: '',
                                  ending: '',
                                  remarks: '',
                                  code: generateUniqueCode('PTH', 'Path'),
                                  category: wizardCategory,
                                  subCategory: wizardSubCategory,
                                  specializations: [wizardSpecialization]
                                }),
                                stages: [...currentStages, stageVal]
                              };
                            });
                            setNewLevelName('');
                          }
                        }}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="self-end">
                      <button
                        type="button"
                        onClick={() => {
                          const stageVal = newLevelName.trim() || `Level ${((selectedService?.stages?.length || 0) + 1)}`;
                          setSelectedService((prev: GlobalPath | null) => {
                            const currentStages = prev?.stages || ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)'];
                            return {
                              ...(prev || {
                                id: 'new',
                                name: inlinePathName || 'New Education Path',
                                methods: inlineTrainingMethod || 'Live AI Adaptive',
                                starting: '',
                                ending: '',
                                remarks: '',
                                code: generateUniqueCode('PTH', 'Path'),
                                category: wizardCategory,
                                subCategory: wizardSubCategory,
                                specializations: [wizardSpecialization]
                              }),
                              stages: [...currentStages, stageVal]
                            };
                          });
                          setNewLevelName('');
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Education Level</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: BATCH, SLOT & AI GENERATION HUB */}
            {activeTab === 'BATCH' && (() => {
              const activeCategoryObj = selectedCategory || categoryList.find(c => c.name === wizardCategory);

              const availableSubCats = activeCategoryObj?.subCategories && activeCategoryObj.subCategories.length > 0
                ? activeCategoryObj.subCategories
                : getSubCategoryPresets(wizardCategory);
              const finalSubCats = Array.from(new Set([...availableSubCats, ...(wizardSubCategory ? [wizardSubCategory] : [])]));

              const availableSpecs = activeCategoryObj?.specializations && activeCategoryObj.specializations.length > 0
                ? activeCategoryObj.specializations
                : ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'];
              const finalSpecs = Array.from(new Set([...availableSpecs, ...(wizardSpecialization ? [wizardSpecialization] : [])]));

              const activePathObj = serviceList.find(p => p.id === wizardPathId) || serviceList[0];
              const pathStages = activePathObj?.stages && activePathObj.stages.length > 0
                ? activePathObj.stages
                : activePathObj?.stagePricing && Object.keys(activePathObj.stagePricing).length > 0
                  ? Object.keys(activePathObj.stagePricing)
                  : (activeCategoryObj?.stages && activeCategoryObj.stages.length > 0
                    ? activeCategoryObj.stages
                    : ['Foundation', 'A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'All Stages Package']);
              const finalStages = Array.from(new Set([...pathStages, ...(wizardStage ? [wizardStage] : [])]));

              const studentAccessUrl = `${window.location.origin}/#education?category=${encodeURIComponent(wizardCategory || 'General')}&subCategory=${encodeURIComponent(wizardSubCategory || 'All')}&specialization=${encodeURIComponent(wizardSpecialization || 'General')}&stage=${encodeURIComponent(wizardStage || 'All')}`;

              return (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* 1. Interactive Pipeline Context Card with 5 Dropdowns */}
                  <div className="bg-gradient-to-r from-brand-50 via-indigo-50/60 to-purple-50/40 p-5 rounded-2xl border border-brand-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-brand-700 tracking-wider">
                            Curriculum Pipeline Selection (Stages 1, 2 &amp; 3)
                          </div>
                          <h4 className="text-sm font-black text-slate-900">
                            Select Category, Track, Specialization, Path &amp; Education Level
                          </h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Pipeline Reactive Synced
                      </span>
                    </div>

                    {/* The 5 Interactive Dropdowns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                      {/* Dropdown 1: Main Category */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>📁 Main Category *</span>
                        </label>
                        <select
                          value={wizardCategory}
                          onChange={(e) => {
                            const catName = e.target.value;
                            setWizardCategory(catName);
                            const matchedCat = categoryList.find(c => c.name === catName);
                            if (matchedCat) {
                              setSelectedCategory(matchedCat);
                              if (matchedCat.subCategories && matchedCat.subCategories.length > 0) {
                                setWizardSubCategory(matchedCat.subCategories[0]);
                              }
                              if (matchedCat.specializations && matchedCat.specializations.length > 0) {
                                setWizardSpecialization(matchedCat.specializations[0]);
                              }
                            }
                          }}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          {categoryList.map(cat => (
                            <option key={cat.id} value={cat.name}>📁 {cat.name}</option>
                          ))}
                          {wizardCategory && !categoryList.some(c => c.name === wizardCategory) && (
                            <option value={wizardCategory}>📁 {wizardCategory}</option>
                          )}
                        </select>
                      </div>

                      {/* Dropdown 2: Sub-Category / Product Name */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>🏷️ Sub-Category / Product *</span>
                        </label>
                        <select
                          value={wizardSubCategory}
                          onChange={(e) => setWizardSubCategory(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          {finalSubCats.map(sub => (
                            <option key={sub} value={sub}>🏷️ {sub}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dropdown 3: Specialization Track */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>🎯 Specialization Track *</span>
                        </label>
                        <select
                          value={wizardSpecialization}
                          onChange={(e) => setWizardSpecialization(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          {finalSpecs.map(spec => (
                            <option key={spec} value={spec}>🎯 {spec}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dropdown 4: Education Path */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>🛤️ Education Path *</span>
                        </label>
                        <select
                          value={wizardPathId}
                          onChange={(e) => {
                            const pId = e.target.value;
                            setWizardPathId(pId);
                            const matchedPath = serviceList.find(p => p.id === pId);
                            if (matchedPath) {
                              setSelectedService(matchedPath);
                              if (matchedPath.stages && matchedPath.stages.length > 0) {
                                setWizardStage(matchedPath.stages[0]);
                              }
                              const lowerMethod = (matchedPath.methods || '').toLowerCase();
                              if (lowerMethod.includes('ai adaptive') || lowerMethod.includes('intellicoach') || lowerMethod.includes('video + ai') || lowerMethod.includes('slide + ai') || lowerMethod.includes('self-paced')) {
                                setBatchNotApplicable(true);
                              }
                            }
                          }}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          <option value="">-- Choose Education Path --</option>
                          {serviceList.length > 0 ? (
                            serviceList.map(path => (
                              <option key={path.id} value={path.id}>
                                🛤️ {path.name} [{path.methods || 'Live Adaptive'}]
                              </option>
                            ))
                          ) : (
                            STANDARD_PATH_PRESETS.map((preset, idx) => (
                              <option key={idx} value={`preset-${idx}`}>
                                🛤️ {preset.name} [{preset.method}]
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Dropdown 5: Level of Education (Stage) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>🎓 Level of Education *</span>
                        </label>
                        <select
                          value={wizardStage}
                          onChange={(e) => setWizardStage(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          {finalStages.map(st => (
                            <option key={st} value={st}>🎓 {st}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. EXCEL-STYLE BATCH & PRICING MATRIX GENERATOR (MAIN CATEGORY & SUB-CATEGORY DRIVEN) */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-indigo-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                            Excel-Style Matrix Suite
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            Auto-Linked Student URLs
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          Product Batch &amp; Pricing Matrix Generator
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select a Category and Sub-Category (Product) below, then click <strong>"Generate Matrix List"</strong> to build an Excel-style line-by-line matrix of all Specializations, Paths &amp; Levels with direct Price &amp; Batch inputs and unique student enrollment links.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleGenerateMatrix(matrixCategory, matrixSubCategory)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-brand-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-md hover:shadow-indigo-500/25 transition-all shrink-0 self-start sm:self-auto"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>{isMatrixGenerated ? '⚡ Refresh Matrix List' : '⚡ Generate Matrix List'}</span>
                      </button>
                    </div>

                    {/* Product Selection Row for the Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="md:col-span-5 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <FolderPlus className="w-3.5 h-3.5 text-brand-600" />
                          Target Main Category
                        </label>
                        <select
                          value={matrixCategory}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMatrixCategory(val);
                            setWizardCategory(val);
                            const matched = categoryList.find(c => c.name === val);
                            if (matched && matched.subCategories && matched.subCategories.length > 0) {
                              setMatrixSubCategory(matched.subCategories[0]);
                              setWizardSubCategory(matched.subCategories[0]);
                            }
                          }}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                        >
                          {categoryList.map(cat => (
                            <option key={cat.id} value={cat.name}>📁 {cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-5 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-indigo-600" />
                          Target Sub-Category / Product Name
                        </label>
                        <select
                          value={matrixSubCategory}
                          onChange={(e) => {
                            setMatrixSubCategory(e.target.value);
                            setWizardSubCategory(e.target.value);
                          }}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                        >
                          {finalSubCats.map(sub => (
                            <option key={sub} value={sub}>🏷️ {sub}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => handleGenerateMatrix(matrixCategory, matrixSubCategory)}
                          className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </button>
                      </div>
                    </div>

                    {/* Matrix Toolbar & Excel Grid */}
                    {isMatrixGenerated && matrixRows.length > 0 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Quick Bulk Action & Filter Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs">
                          <div className="flex items-center gap-2 flex-wrap font-bold text-indigo-950">
                            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                              {matrixRows.length} Rows Generated
                            </span>
                            <span className="text-slate-500">for</span>
                            <span className="text-brand-900 font-black">{matrixCategory} &gt; {matrixSubCategory}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                              {matrixRows.filter(r => r.isSaved).length} / {matrixRows.length} Saved in System
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Quick Filter by Specialization */}
                            <select
                              value={matrixFilterSpec}
                              onChange={(e) => setMatrixFilterSpec(e.target.value)}
                              className="border border-indigo-200 rounded-lg p-1.5 text-[11px] font-bold text-slate-800 bg-white"
                            >
                              <option value="ALL">🔍 All Specializations</option>
                              {Array.from(new Set(matrixRows.map(r => r.specialization))).map(sp => (
                                <option key={sp} value={sp}>🎯 {sp}</option>
                              ))}
                            </select>

                            {/* Quick Filter by Path */}
                            <select
                              value={matrixFilterPath}
                              onChange={(e) => setMatrixFilterPath(e.target.value)}
                              className="border border-indigo-200 rounded-lg p-1.5 text-[11px] font-bold text-slate-800 bg-white"
                            >
                              <option value="ALL">🛤️ All Paths</option>
                              {Array.from(new Set(matrixRows.map(r => r.pathName))).map(pn => (
                                <option key={pn} value={pn}>🛤️ {pn}</option>
                              ))}
                            </select>

                            {/* Bulk Apply Default Price */}
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={bulkMatrixPrice}
                                onChange={(e) => setBulkMatrixPrice(e.target.value)}
                                className="w-20 border border-slate-300 rounded-lg p-1 text-[11px] font-black text-emerald-800 bg-white"
                                placeholder="$149"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setMatrixRows(prev => prev.map(r => ({ ...r, price: bulkMatrixPrice })));
                                }}
                                className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-2xs"
                              >
                                Apply Price
                              </button>
                            </div>

                            {/* Bulk Save All Button */}
                            <button
                              type="button"
                              onClick={handleBulkSaveMatrix}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save All Batches</span>
                            </button>
                          </div>
                        </div>

                        {/* Excel-Style Interactive Table */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-black">
                              <tr>
                                <th className="p-3 text-center w-10">#</th>
                                <th className="p-3 min-w-[150px]">Specialization Track</th>
                                <th className="p-3 min-w-[170px]">Education Path &amp; Modality</th>
                                <th className="p-3 min-w-[90px]">Level</th>
                                <th className="p-3 min-w-[120px]">Price ($ / ₹)</th>
                                <th className="p-3 min-w-[220px]">Batch Name &amp; Timing Slot</th>
                                <th className="p-3 min-w-[120px] text-center">Batch Action</th>
                                <th className="p-3 min-w-[260px]">Student Direct Access Link</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {matrixRows
                                .filter(r => (matrixFilterSpec === 'ALL' || r.specialization === matrixFilterSpec) && (matrixFilterPath === 'ALL' || r.pathName === matrixFilterPath))
                                .map((row, idx) => {
                                  const isCopied = copiedMatrixId === row.id;

                                  return (
                                    <tr
                                      key={row.id}
                                      className={`hover:bg-indigo-50/40 transition-colors ${
                                        row.isSaved ? 'bg-emerald-50/20' : ''
                                      }`}
                                    >
                                      <td className="p-3 text-center font-mono font-bold text-slate-400">
                                        {idx + 1}
                                      </td>

                                      <td className="p-3 font-bold text-slate-800">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                          <span>{row.specialization}</span>
                                        </div>
                                      </td>

                                      <td className="p-3">
                                        <div className="font-bold text-brand-900 flex items-center gap-1.5 flex-wrap">
                                          <span>{row.pathName}</span>
                                          {row.noBatchRequired ? (
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5">
                                              <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                                              No Batch Required
                                            </span>
                                          ) : (
                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-0.5">
                                              <Calendar className="w-2.5 h-2.5 text-blue-600" />
                                              Live Cohort
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-semibold">{row.pathMethod}</div>
                                      </td>

                                      <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-black text-xs border border-amber-200 inline-block">
                                          🎓 {row.level}
                                        </span>
                                      </td>

                                      {/* Price Input Field */}
                                      <td className="p-3">
                                        <input
                                          type="text"
                                          value={row.price}
                                          onChange={(e) => handleUpdateMatrixRow(row.id, 'price', e.target.value)}
                                          className="w-full border border-emerald-300 rounded-lg p-2 text-xs font-black text-emerald-800 bg-emerald-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                          placeholder="$149"
                                        />
                                      </td>

                                      {/* Batch Name & Timing Selector / No Batch AI Indicator */}
                                      <td className="p-3">
                                        {row.noBatchRequired ? (
                                          <div className="bg-amber-50/80 border border-amber-200/80 p-2 rounded-xl space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-950">
                                              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                                              <span>Continuous 24/7 AI Access</span>
                                            </div>
                                            <div className="text-[10px] text-amber-800 font-medium">
                                              No batch required. Direct enrollment link is live immediately on save.
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-1.5">
                                            <input
                                              type="text"
                                              value={row.batchName}
                                              onChange={(e) => handleUpdateMatrixRow(row.id, 'batchName', e.target.value)}
                                              className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500"
                                              placeholder="Batch Cohort Name"
                                            />
                                            <div className="flex items-center gap-1.5">
                                              <select
                                                value={row.timings[0] || '09:00 - 11:00'}
                                                onChange={(e) => handleUpdateMatrixRow(row.id, 'timings', [e.target.value])}
                                                className="w-full border border-slate-200 rounded-md p-1 text-[11px] font-semibold text-slate-700 bg-slate-50"
                                              >
                                                <option value="09:00 - 11:00">🌅 Morning (09:00 - 11:00)</option>
                                                <option value="14:00 - 16:00">☀️ Afternoon (14:00 - 16:00)</option>
                                                <option value="18:30 - 20:30">🌆 Evening (18:30 - 20:30)</option>
                                                <option value="10:00 - 14:00 (Sat-Sun)">🎯 Weekend Intensive</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                      </td>

                                      {/* Action Button */}
                                      <td className="p-3 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleSaveMatrixRow(row.id)}
                                          className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                                            row.isSaved
                                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                              : row.noBatchRequired
                                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                                                : 'bg-brand-600 hover:bg-brand-500 text-white'
                                          }`}
                                        >
                                          {row.isSaved ? (
                                            <Check className="w-3.5 h-3.5" />
                                          ) : row.noBatchRequired ? (
                                            <Zap className="w-3.5 h-3.5" />
                                          ) : (
                                            <Plus className="w-3.5 h-3.5" />
                                          )}
                                          <span>
                                            {row.isSaved
                                              ? 'Saved ✓'
                                              : row.noBatchRequired
                                                ? 'Save Access'
                                                : 'Save Batch'}
                                          </span>
                                        </button>
                                      </td>

                                      {/* Student Direct Access URL with Copy & Test */}
                                      <td className="p-3">
                                        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                                          <input
                                            type="text"
                                            readOnly
                                            value={row.studentAccessUrl}
                                            className="flex-1 bg-transparent text-[10px] font-mono text-slate-700 px-1.5 outline-none select-all truncate"
                                            title={row.studentAccessUrl}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              navigator.clipboard.writeText(row.studentAccessUrl);
                                              setCopiedMatrixId(row.id);
                                              setTimeout(() => setCopiedMatrixId(null), 2500);
                                            }}
                                            className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                                              isCopied
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-brand-600 hover:bg-brand-500 text-white'
                                            }`}
                                            title="Copy student link"
                                          >
                                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                          </button>
                                          <a
                                            href={row.studentAccessUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all shrink-0"
                                            title="Test link"
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. DEDICATED BYPASS BATCH BUTTON / CONTROLLER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-800/60">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-xs ${
                        batchNotApplicable ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                      }`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-200">Delivery Schedule Mode:</span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            batchNotApplicable ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-emerald-400 text-slate-950 shadow-xs'
                          }`}>
                            {batchNotApplicable ? '⚡ Bypass Batch (Self-Paced / AI Classes)' : '📅 Live Cohort Batches (Scheduled Mentorship)'}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                          {batchNotApplicable
                            ? 'Batch creation bypassed for 24/7 AI courses. A continuous composite student enrollment link is automatically generated below.'
                            : 'Live batch scheduling active. Set slot codes, start dates, and timings for human-led mentor cohorts below.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBatchNotApplicable(!batchNotApplicable)}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shrink-0 self-start sm:self-auto ${
                        batchNotApplicable
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300/60'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white ring-2 ring-emerald-400/60'
                      }`}
                    >
                      {batchNotApplicable ? <ToggleRight className="w-5 h-5 text-slate-950" /> : <ToggleLeft className="w-5 h-5 text-white" />}
                      <span>{batchNotApplicable ? 'Bypass Batch: ON (AI Classes)' : 'Bypass Batch: OFF (Enable Batch)'}</span>
                    </button>
                  </div>

                  {/* 3A. COMPOSITE COURSE ACCESS LINK CONTAINER (WHEN BATCH IS BYPASSED) */}
                  {batchNotApplicable ? (
                    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-7 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-5 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                            <Link2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                              Automated Product Enrollment • Direct Student Access
                            </div>
                            <h3 className="text-base font-black text-white">
                              Course Composite Access Link (Batch Bypassed)
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-black bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 self-start sm:self-auto">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Continuous 24/7 AI Access
                        </span>
                      </div>

                      {/* Full Hierarchy Breadcrumb Display */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-indigo-800/60 space-y-2">
                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                          Complete Course Access Hierarchy
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                          <span className="bg-brand-500/25 text-brand-200 px-3 py-1 rounded-xl border border-brand-400/30">
                            📁 Category: {wizardCategory || 'General'}
                          </span>
                          <span className="text-indigo-400">→</span>
                          <span className="bg-indigo-500/25 text-indigo-200 px-3 py-1 rounded-xl border border-indigo-400/30">
                            🏷️ Sub-Category: {wizardSubCategory || 'Product'}
                          </span>
                          <span className="text-indigo-400">→</span>
                          <span className="bg-purple-500/25 text-purple-200 px-3 py-1 rounded-xl border border-purple-400/30">
                            🎯 Specialization: {wizardSpecialization || 'General'}
                          </span>
                          <span className="text-indigo-400">→</span>
                          <span className="bg-emerald-500/25 text-emerald-200 px-3 py-1 rounded-xl border border-emerald-400/30">
                            🛤️ Path: {activePathObj?.name || 'Standard Path'} ({activePathObj?.methods || 'AI Adaptive'})
                          </span>
                          <span className="text-indigo-400">→</span>
                          <span className="bg-amber-500/25 text-amber-200 px-3 py-1 rounded-xl border border-amber-400/30">
                            🎓 Level: {wizardStage || 'All Stages'}
                          </span>
                        </div>
                      </div>

                      {/* Generated Direct Access URL Box with Copy Button */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-indigo-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-amber-300" />
                            Direct Student Access URL
                          </span>
                          <span className="text-[11px] font-normal text-slate-400">Share this link directly to enroll students</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-950 p-2.5 rounded-2xl border border-indigo-700">
                          <input
                            type="text"
                            readOnly
                            value={studentAccessUrl}
                            className="flex-1 bg-transparent text-xs font-mono text-amber-200 px-3 py-2 outline-none select-all overflow-x-auto"
                          />
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(studentAccessUrl);
                                setCopiedLink(true);
                                setTimeout(() => setCopiedLink(false), 2500);
                              }}
                              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                                copiedLink
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                              }`}
                            >
                              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              <span>{copiedLink ? 'Link Copied!' : 'Copy Student Access Link'}</span>
                            </button>
                            <a
                              href={studentAccessUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-indigo-700 hover:bg-indigo-600 text-white flex items-center gap-1.5 cursor-pointer transition-all"
                              title="Open and test student enrollment page"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline">Test Link</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Explanatory Banner */}
                      <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span>
                          <strong>AI Classes Mode:</strong> Batch scheduling is bypassed. Click <strong>"Save &amp; Generate Course with AI"</strong> below to persist this product and synchronize curriculum directly into the ILA AI Engine Hub.
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* 3B. BATCH CREATION: SPLIT INPUTS & AUTOMATED GENERATION (WHEN BATCH IS ON) */
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-brand-600" />
                            Live Cohort Batch &amp; Slot Configuration
                          </label>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Select a cohort template or enter custom batch details. Slot codes, dates, and timings are auto-generated.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {batchList.length} Batches Registered
                        </span>
                      </div>

                      {/* Split Batch Name Input: Dropdown + Text Input + Inline Actions */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-end">
                        {/* Column 1: Dropdown of Standard Batch Templates or Existing Batches */}
                        <div className="lg:col-span-4 flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-700">Choose Cohort Template / Batch</label>
                          <select
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-1 focus:ring-brand-500 cursor-pointer shadow-2xs"
                            value={selectedBatch?.id || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                setSelectedBatch(null);
                                return;
                              }
                              // Check if it matches an existing batch
                              const matched = batchList.find(b => b.id === val);
                              if (matched) {
                                setSelectedBatch({ ...matched });
                                setWizardBatchId(matched.id);
                                return;
                              }
                              // Otherwise it's a template
                              const templateMap: Record<string, { name: string; timings: string[]; codePrefix: string }> = {
                                'MORN': { name: 'Morning Cohort (09:00 AM – 11:00 AM IST)', timings: ['09:00 - 11:00'], codePrefix: 'BAT-MORN' },
                                'AFT': { name: 'Afternoon Fast-Track (02:00 PM – 04:00 PM IST)', timings: ['14:00 - 16:00'], codePrefix: 'BAT-AFT' },
                                'EVE': { name: 'Evening Professional (06:30 PM – 08:30 PM IST)', timings: ['18:30 - 20:30'], codePrefix: 'BAT-EVE' },
                                'WKND': { name: 'Weekend Intensive (10:00 AM – 02:00 PM IST)', timings: ['10:00 - 14:00'], codePrefix: 'BAT-WKND' }
                              };
                              const tmpl = templateMap[val];
                              if (tmpl) {
                                const newCode = generateUniqueCode('BAT', val);
                                setSelectedBatch({
                                  id: 'new',
                                  name: tmpl.name,
                                  code: newCode,
                                  timings: tmpl.timings,
                                  starting: new Date().toISOString().split('T')[0],
                                  remarks: 'Standard cohort batch open for enrollment',
                                  linkedPathId: wizardPathId
                                });
                              }
                            }}
                          >
                            <option value="">-- Choose Template or Existing Batch --</option>
                            <optgroup label="Standard Cohort Templates">
                              <option value="MORN">🌅 Morning Cohort (09:00 AM – 11:00 AM IST)</option>
                              <option value="AFT">☀️ Afternoon Fast-Track (02:00 PM – 04:00 PM IST)</option>
                              <option value="EVE">🌆 Evening Professional (06:30 PM – 08:30 PM IST)</option>
                              <option value="WKND">🎯 Weekend Intensive (10:00 AM – 02:00 PM IST)</option>
                            </optgroup>
                            {batchList.length > 0 && (
                              <optgroup label="Existing Active Batches">
                                {batchList.map(b => (
                                  <option key={b.id} value={b.id}>
                                    ⏰ #{b.code || 'BAT'} {b.name}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>

                        {/* Column 2: Text Input for Custom or Editable Batch Name */}
                        <div className="lg:col-span-4 flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Edit className="w-3.5 h-3.5 text-slate-500" /> Batch Name *
                          </label>
                          <input
                            type="text"
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-brand-500 shadow-2xs"
                            placeholder="e.g. Morning Cohort A1 / Weekend Fast-Track"
                            value={selectedBatch?.name || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedBatch((prev: GlobalBatch | null) => {
                                const current = prev || {
                                  id: 'new',
                                  name: '',
                                  timings: ['09:00 - 11:00'],
                                  starting: new Date().toISOString().split('T')[0],
                                  remarks: '',
                                  code: ''
                                };
                                return {
                                  ...current,
                                  name: val,
                                  code: current.code || generateUniqueCode('BAT', val)
                                };
                              });
                            }}
                          />
                        </div>

                        {/* Column 3: Dedicated Inline Action Controls */}
                        <div className="lg:col-span-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleInlineAddBatch}
                            className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                            title="Add new batch record"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleInlineEditBatch}
                            disabled={!selectedBatch || selectedBatch.id === 'new'}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Save batch updates"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleInlineDeleteBatch}
                            disabled={!selectedBatch || selectedBatch.id === 'new'}
                            className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete selected batch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Auto-Generated Slot Code & Start Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                        {/* Auto-Generated Batch Code */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5 text-brand-600" />
                              Batch Slot Code (Auto-Generated)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newCode = generateUniqueCode('BAT', selectedBatch?.name || 'COHORT');
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
                            onChange={(e) => setSelectedBatch(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                          />
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-600" /> Start Date
                          </label>
                          <input
                            type="date"
                            className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-bold text-slate-800 bg-white shadow-2xs"
                            value={selectedBatch?.starting || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedBatch(prev => prev ? { ...prev, starting: e.target.value } : null)}
                          />
                        </div>
                      </div>

                      {/* Interactive Timings Config */}
                      <div className="flex flex-col gap-2.5 bg-indigo-50/40 p-4 rounded-xl border border-indigo-200/70">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-indigo-600" /> Interactive Timings &amp; Slot Codes
                          </label>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500">Quick Timings:</span>
                            {[
                              { label: 'Morning (09–11)', val: '09:00 - 11:00' },
                              { label: 'Afternoon (14–16)', val: '14:00 - 16:00' },
                              { label: 'Evening (18:30–20:30)', val: '18:30 - 20:30' },
                              { label: 'Weekend (10–14)', val: '10:00 - 14:00' }
                            ].map(t => (
                              <button
                                key={t.label}
                                type="button"
                                onClick={() => {
                                  setSelectedBatch((prev: GlobalBatch | null) => {
                                    const current = prev || { id: 'new', name: '', timings: [], starting: '', remarks: '', code: '' };
                                    const updatedTimings = Array.from(new Set([...(current.timings || []), t.val]));
                                    return { ...current, timings: updatedTimings };
                                  });
                                }}
                                className="text-[10px] font-bold bg-white text-indigo-800 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded cursor-pointer shadow-2xs"
                              >
                                + {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Time Pickers */}
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="time"
                            id="startTimeInput"
                            defaultValue="09:00"
                            className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28 font-medium"
                            onChange={(e) => {
                              const endVal = (document.getElementById('endTimeInput') as HTMLInputElement)?.value || '11:00';
                              setNewTimeSlot(`${e.target.value} - ${endVal}`);
                            }}
                          />
                          <span className="font-bold text-slate-400 text-xs">TO</span>
                          <input
                            type="time"
                            id="endTimeInput"
                            defaultValue="11:00"
                            className="border border-slate-300 rounded-lg p-2 text-xs bg-white w-28 font-medium"
                            onChange={(e) => {
                              const startVal = (document.getElementById('startTimeInput') as HTMLInputElement)?.value || '09:00';
                              setNewTimeSlot(`${startVal} - ${e.target.value}`);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const startVal = (document.getElementById('startTimeInput') as HTMLInputElement)?.value || '09:00';
                              const endVal = (document.getElementById('endTimeInput') as HTMLInputElement)?.value || '11:00';
                              const slotStr = `${startVal} - ${endVal}`;
                              setSelectedBatch((prev: GlobalBatch | null) => {
                                const current = prev || { id: 'new', name: '', timings: [], starting: '', remarks: '', code: '' };
                                const updatedTimings = Array.from(new Set([...(current.timings || []), slotStr]));
                                return { ...current, timings: updatedTimings };
                              });
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-all"
                          >
                            + Add Time Slot
                          </button>
                        </div>

                        {/* Render Selected Slots */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedBatch?.timings?.map((time, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                              <span>⏰ {time}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTimeSlot(idx)}
                                className="text-slate-400 hover:text-red-600 cursor-pointer font-bold ml-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {(!selectedBatch?.timings || selectedBatch.timings.length === 0) && (
                            <span className="text-xs text-slate-400 italic">No timings added. Select presets or times above and click Add Time Slot.</span>
                          )}
                        </div>
                      </div>

                      {/* Remarks & Capacity */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700">Remarks &amp; Seat Capacity</label>
                        <input
                          type="text"
                          className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-brand-500 font-medium"
                          placeholder="e.g. Limited 15 seats, Intensive Morning Cohort, Fast Filling..."
                          value={selectedBatch?.remarks || ''}
                          onChange={(e) => setSelectedBatch((prev: GlobalBatch | null) => prev ? { ...prev, remarks: e.target.value } : null)}
                        />
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* Global Workflow Action Controls: Save & Next / Save & Generate Course with AI */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-200">
              <div className="text-xs text-slate-600 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {activeTab === 'CATEGORY' && 'Stage 1 of 3: Taxonomy & Categories Active'}
                  {activeTab === 'SERVICE' && 'Stage 2 of 3: Education Path & Method Active'}
                  {activeTab === 'BATCH' && 'Stage 3 of 3: Batch & AI Hub Ready'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Secondary Reset Form Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> RESET FORM
                </button>

                {/* Secondary Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={
                    (activeTab === 'CATEGORY' && !selectedCategory) ||
                    (activeTab === 'SERVICE' && !selectedService) ||
                    (activeTab === 'BATCH' && !selectedBatch)
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> DELETE
                </button>

                {/* PRIMARY STAGE-SPECIFIC PROGRESSION BUTTONS */}
                {activeTab === 'CATEGORY' && (
                  <button
                    type="button"
                    onClick={handleCategorySaveAndNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Save &amp; Next: Education Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {activeTab === 'SERVICE' && (
                  <button
                    type="button"
                    onClick={handleServiceSaveAndNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Save &amp; Next: Batches &amp; Slots</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {activeTab === 'BATCH' && (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* 1. Save & Generate Course with AI */}
                    <button
                      type="button"
                      onClick={handleSaveAndGenerateWithAi}
                      className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:via-indigo-500 hover:to-brand-500 text-white text-xs md:text-sm font-black rounded-xl shadow-md hover:shadow-indigo-500/25 ring-2 ring-indigo-400/40 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Save &amp; Generate Course with AI</span>
                      <ExternalLink className="w-4 h-4 text-white/90" />
                    </button>

                    {/* 2. Access to Library Button */}
                    <button
                      type="button"
                      onClick={() => setShowLibraryAccessModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl shadow-md border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                      title="Access external course library portal & configure student direct connection link"
                    >
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      <span>Access to Library</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Access to Library Modal */}
          {showLibraryAccessModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-900 text-white flex items-center justify-center shrink-0 shadow-md">
                      <BookOpen className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-brand-700 tracking-wider">
                        External Course Library &amp; LMS Portal Access
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        Access to Course Library
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLibraryAccessModal(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected Course / Path Overview */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Category &amp; Track:</span>
                    <span className="font-bold text-slate-900">{wizardCategory} &gt; {wizardSubCategory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Specialization:</span>
                    <span className="font-bold text-indigo-900">{wizardSpecialization}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Education Level:</span>
                    <span className="font-bold text-emerald-800">{wizardStage || 'All Levels'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Batch Allocation:</span>
                    <span className="font-bold text-purple-900">
                      {batchNotApplicable ? '⚡ No Batch Required (24/7 AI Continuous Access)' : (selectedBatch?.name || 'Selected Batch Slot')}
                    </span>
                  </div>
                </div>

                {/* Library Portal URL Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-brand-600" />
                      <span>Target Library / LMS Portal URL</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Connected to external course generator</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={libraryAccessUrl}
                      onChange={(e) => {
                        setLibraryAccessUrl(e.target.value);
                        localStorage.setItem('ilas_custom_library_url', e.target.value);
                      }}
                      className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-500"
                      placeholder="https://ila-ai-engine-hub091026.vercel.app/"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(libraryAccessUrl);
                        setCopiedLibraryLink(true);
                        setTimeout(() => setCopiedLibraryLink(false), 2500);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        copiedLibraryLink ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                      title="Copy Library URL"
                    >
                      {copiedLibraryLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLibraryLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Student Enrollment / Access Link */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Student Admission &amp; Course Link (Post-Payment)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    When a student registers on the frontend and completes payment, this verified link gives them instant entry to their course materials and AI classroom:
                  </p>
                  <div className="bg-white p-2 rounded-xl border border-amber-300 font-mono text-[10px] text-amber-950 break-all select-all">
                    {`${window.location.origin}/#education?category=${encodeURIComponent(wizardCategory)}&subCategory=${encodeURIComponent(wizardSubCategory)}&specialization=${encodeURIComponent(wizardSpecialization)}&stage=${encodeURIComponent(wizardStage || 'A1')}`}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowLibraryAccessModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  <a
                    href={libraryAccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <span>Open Library in New Tab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* AI Generation Hub Navigation Confirmation Modal */}
          {showAiGenerationModal && generatedCourseSummary && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full border border-indigo-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                        ILA AI Engine Hub • Course Ingestion
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        Course Generated &amp; Synced!
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAiGenerationModal(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Course Title:</span>
                    <span className="font-black text-slate-900">{generatedCourseSummary.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Category &amp; Track:</span>
                    <span className="font-bold text-indigo-900">{generatedCourseSummary.category} / {generatedCourseSummary.subCategory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Specialization:</span>
                    <span className="font-bold text-purple-900">{generatedCourseSummary.specialization}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Education Path:</span>
                    <span className="font-bold text-slate-900">{generatedCourseSummary.path} ({generatedCourseSummary.method})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Allocated Batch / Schedule:</span>
                    <span className="font-bold text-emerald-800">{generatedCourseSummary.batch}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-indigo-200/60">
                    <span className="text-slate-500 font-mono font-bold">Composite ID:</span>
                    <span className="font-mono font-bold text-indigo-800">{generatedCourseSummary.compositeId}</span>
                  </div>
                </div>

                {/* Direct Student Access Link in AI Generation Hub Modal */}
                {generatedCourseSummary.studentAccessUrl && (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-indigo-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-amber-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-300" />
                        Direct Student Access URL
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCourseSummary.studentAccessUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2500);
                        }}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                          copiedLink ? 'bg-emerald-500 text-white' : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        }`}
                      >
                        {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-amber-200 break-all select-all bg-slate-950/80 p-2.5 rounded-xl border border-indigo-900/80">
                      {generatedCourseSummary.studentAccessUrl}
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  The course parameters have been saved into the admin registry and the ILA AI Engine Hub has been launched in a new tab with curriculum synthesis pre-filled.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAiGenerationModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Dismiss &amp; Stay in Admin
                  </button>
                  <a
                    href={generatedAiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Launch AI Engine Hub</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Directory Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 overflow-hidden flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base md:text-lg font-black text-slate-900">
                {activeTab === 'CATEGORY' && 'Directory of Categories & Sub-Categories'}
                {activeTab === 'SERVICE' && 'Directory of Education Paths'}
                {activeTab === 'BATCH' && 'Directory of Batch Slots & Timings'}
              </h2>
              <div className="flex items-center gap-2">
                {activeTab === 'BATCH' && batchList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Are you sure you want to delete ALL ${batchList.length} registered batches? This will give you a completely clean, fresh slate.`)) {
                        return;
                      }
                      setBatchList([]);
                      setGlobalBatches([]);
                      setSelectedBatch(null);
                      alert("All batches have been cleared successfully. You can now create fresh batches!");
                    }}
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-3 py-1 rounded-xl border border-red-200 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title="Clear all batches in directory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All {batchList.length} Batches</span>
                  </button>
                )}
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Total {activeTab === 'CATEGORY' ? categoryList.length : activeTab === 'SERVICE' ? serviceList.length : batchList.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">

                {/* 1. Category Table */}
                {activeTab === 'CATEGORY' && (
                  <>
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-xs">
                      <tr>
                        <th className="px-3 py-3 rounded-tl-xl text-center w-16">Order</th>
                        <th className="px-4 py-3">Category Name &amp; Visibility</th>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Sub-Categories (Tracks)</th>
                        <th className="px-4 py-3">Specializations</th>
                        <th className="px-4 py-3">Target Stages</th>
                        <th className="px-4 py-3 rounded-tr-xl text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {categoryList.map((cat, idx) => {
                        const isSelected = selectedCategory?.id === cat.id;

                        return (
                          <tr
                            key={cat.id}
                            onClick={() => handleRowClick(cat)}
                            className={`cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-brand-50/80 ring-1 ring-brand-300 font-semibold' : ''
                              }`}
                          >
                            <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-mono font-bold text-slate-500 text-xs w-5">
                                  #{cat.position || idx + 1}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveCategoryOrder(cat.id, 'up')}
                                    className="p-0.5 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-20 cursor-pointer"
                                    title="Move Category Up in Navigation"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === categoryList.length - 1}
                                    onClick={() => handleMoveCategoryOrder(cat.id, 'down')}
                                    className="p-0.5 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-20 cursor-pointer"
                                    title="Move Category Down in Navigation"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-brand-900">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>📁 {cat.name}</span>
                                {cat.isJobRelated && (
                                  <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                                    Job-Related
                                  </span>
                                )}
                                {cat.showInNav !== false && (
                                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                    In Nav
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono text-[10px] font-bold border border-indigo-200">
                                {cat.code || generateUniqueCode('CAT', cat.name)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap max-w-xs">
                                {cat.subCategories?.map((sub, sIdx) => (
                                  <span key={sIdx} className="bg-brand-50 text-brand-800 text-[10px] px-2 py-0.5 rounded-md font-medium border border-brand-200/60">
                                    {sub}
                                  </span>
                                ))}
                                {(!cat.subCategories || cat.subCategories.length === 0) && (
                                  <span className="text-slate-400 italic text-[11px]">No sub-categories</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap max-w-xs">
                                {(cat.specializations || ['General / Standard', 'Healthcare', 'Engineers', 'IT', 'Business']).map((spec, sIdx) => (
                                  <span key={sIdx} className="bg-indigo-50 text-indigo-800 text-[10px] px-2 py-0.5 rounded-md font-medium border border-indigo-200/60">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap max-w-xs">
                                {(cat.stages || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Package']).map((stg, sIdx) => (
                                  <span key={sIdx} className="bg-emerald-50 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-emerald-200/60">
                                    {stg}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRowClick(cat)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[11px] font-bold transition-colors cursor-pointer border border-indigo-200"
                                  title="Edit this category"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategoryById(cat.id, cat.name)}
                                  className="p-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-[11px] font-bold transition-colors cursor-pointer border border-red-200"
                                  title="Delete this category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
                        <th className="px-3 py-3 rounded-tl-xl text-center w-12">Pos</th>
                        <th className="px-4 py-3">Path Name &amp; Code</th>
                        <th className="px-4 py-3">Category / Track</th>
                        <th className="px-4 py-3">Base Fee</th>
                        <th className="px-4 py-3">Stage-Level Pricing Matrix</th>
                        <th className="px-4 py-3">Specializations Supported</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3 rounded-tr-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {serviceList.map((item, idx) => (
                        <tr
                          key={item.id}
                          onClick={() => handleRowClick(item)}
                          className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedService?.id === item.id ? 'bg-brand-50 ring-1 ring-brand-200' : ''
                            }`}
                        >
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-500">
                            #{item.position || idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-brand-900">{item.name}</div>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800 font-mono text-[9px] font-bold border border-indigo-200">
                              {item.code || generateUniqueCode('PTH', item.name)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{item.category || 'General'}</div>
                            <div className="text-[10px] text-slate-500">{item.subCategory || '-'}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-700">
                            {item.fee || '$799'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap max-w-xs">
                              {item.stagePricing ? (
                                Object.entries(item.stagePricing).map(([stg, prc]) => (
                                  <span key={stg} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                    {stg}: {prc}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">Standard A1–C2 Breakdown</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap max-w-xs">
                              {(item.specializations || ['General / Standard']).map((sp, spIdx) => (
                                <span key={spIdx} className="bg-indigo-50 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                                  {sp}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-[11px]">{item.methods}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-600 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
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
                        <th className="px-4 py-3 rounded-tl-xl">Batch Name &amp; Code</th>
                        <th className="px-4 py-3">Category &amp; Product</th>
                        <th className="px-4 py-3">Specialization &amp; Level</th>
                        <th className="px-4 py-3">Price / Fee</th>
                        <th className="px-4 py-3">Allocated Timings</th>
                        <th className="px-4 py-3">Student Direct Access Link</th>
                        <th className="px-4 py-3 rounded-tr-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {batchList.map((item) => {
                        const fallbackUrl = `${window.location.origin}/#education?category=${encodeURIComponent(item.category || 'General')}&subCategory=${encodeURIComponent(item.subCategory || 'All')}&specialization=${encodeURIComponent(item.specialization || 'General')}&level=${encodeURIComponent(item.level || 'All')}&batch=${encodeURIComponent(item.code || item.id)}`;
                        const studentUrl = item.studentAccessUrl || fallbackUrl;
                        const isCopied = copiedMatrixId === item.id;

                        return (
                          <tr
                            key={item.id}
                            onClick={() => handleRowClick(item)}
                            className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                              selectedBatch?.id === item.id ? 'bg-brand-50 ring-1 ring-brand-200' : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="font-bold text-brand-900">{item.name}</div>
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono text-[10px] font-bold border border-indigo-200">
                                {item.code || generateUniqueCode('BAT', item.name)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-700">
                              <div className="font-semibold text-slate-900">{item.category || 'General'}</div>
                              <div className="text-[10px] text-slate-500">{item.subCategory || '-'}</div>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <div className="font-bold text-purple-900">{item.specialization || 'General'}</div>
                              {item.level && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                                  {item.level}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-black text-emerald-700">
                              {item.fee || '$149'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {item.timings?.map((t, idx) => (
                                  <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5 max-w-xs">
                                <input
                                  type="text"
                                  readOnly
                                  value={studentUrl}
                                  className="w-36 bg-slate-50 text-[10px] font-mono text-slate-600 px-2 py-1 rounded border border-slate-200 truncate outline-none select-all"
                                  title={studentUrl}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(studentUrl);
                                    setCopiedMatrixId(item.id);
                                    setTimeout(() => setCopiedMatrixId(null), 2500);
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                                    isCopied ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-500 text-white'
                                  }`}
                                  title="Copy student link"
                                >
                                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                                <a
                                  href={studentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                  title="Open student link"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!window.confirm(`Delete batch "${item.name}"?`)) return;
                                  const updated = batchList.filter(b => b.id !== item.id);
                                  setBatchList(updated);
                                  setGlobalBatches(updated);
                                  if (selectedBatch?.id === item.id) setSelectedBatch(null);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Delete Batch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {batchList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <span className="text-sm font-bold text-slate-600">No batches currently registered.</span>
                              <span className="text-xs text-slate-400">Use the Matrix Generator above or the Batch Form to create fresh batches with pricing and student links.</span>
                            </div>
                          </td>
                        </tr>
                      )}
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