import Navbar from './components/common/Navbar'
import Hero from './components/common/Hero'
import Footer from './components/common/Footer'
import PortalLogin from './components/common/PortalLogin'
import LanguageTrainer from './components/common/LanguageTrainer'
import LiveConsultant from './components/common/LiveConsultant'
import UnifiedIntakeForms from './components/common/UnifiedIntakeForms'

import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import GermanLanguagePage from './pages/GermanLanguagePage'
import { logVisitorActivity, getGlobalCourses } from './lib/db'
import StudentDashboard from './pages/StudentDashboard'
import AdminPortal from './pages/AdminPortal'
import CoursePage from './pages/CoursePage'
import JobsPage from './pages/JobsPage'
import VisaPage from './pages/VisaPage'
import WorkWhileYouStudyPage from './pages/WorkWhileYouStudyPage'
import RewardsPage from './pages/RewardsPage'
import AboutUsPage from './pages/AboutUsPage'
import IlasWithYouPage from './pages/IlasWithYouPage'
import FloatingContact from './components/common/FloatingContact'
import StudyAbroadPage from './pages/StudyAbroadPage'
import EducationPage from './pages/EducationPage'
import ApplicationPoolPage from './pages/ApplicationPoolPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import CookieBanner from './components/common/CookieBanner'
import { initFontSettings } from './lib/fontManager'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [activeCourseTitle, setActiveCourseTitle] = useState('')
  const [activeCourseCategory, setActiveCourseCategory] = useState('')

  // Universal Typography & Theme Persistence across all routes and module pages
  useEffect(() => {
    initFontSettings();
  }, [currentPage]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0) {
        const pageLabel = currentPage === 'course-page' ? activeCourseTitle || 'Course Page' : currentPage;
        logVisitorActivity(pageLabel, timeSpent);
      }
    };
  }, [currentPage, activeCourseTitle]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      
      if (hash === '#master-hub' || hash === '#department-hub') {
        setCurrentPage('master-hub')
        window.scrollTo(0, 0)
      } else if (hash === '#german-language' || hash === '#course-german-language') {
        setCurrentPage('course-page')
        setActiveCourseTitle('German Language A1–C2')
        setActiveCourseCategory('Language & Proficiency')
        window.scrollTo(0, 0)
      } else if (hash === '#course-ielts') {
        setCurrentPage('course-page')
        setActiveCourseTitle('IELTS / TOEFL / PTE')
        setActiveCourseCategory('English Proficiency')
        window.scrollTo(0, 0)
      } else if (hash === '#course-software-engineering') {
        setCurrentPage('course-page')
        setActiveCourseTitle('Software Engineering')
        setActiveCourseCategory('Full-Stack & Cloud Architecture')
        window.scrollTo(0, 0)
      } else if (hash.startsWith('#course-') || hash === '#course-page' || hash.startsWith('#course-page#')) {
        setCurrentPage('course-page')
        const courseIdOrSlug = hash.replace('#course-', '').replace('#course-page#', '').replace('#course-page', '')
        if (courseIdOrSlug) {
          const allCourses = getGlobalCourses();
          const match = allCourses.find(c => c.id === courseIdOrSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === courseIdOrSlug.toLowerCase() || c.name.toLowerCase() === courseIdOrSlug.toLowerCase());
          if (match) {
            setActiveCourseTitle(match.name);
            setActiveCourseCategory(match.category || match.top_title || 'Specialized Program');
          } else {
            setActiveCourseTitle(courseIdOrSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
            setActiveCourseCategory('Specialized Program');
          }
        }
        window.scrollTo(0, 0)
      } else if (hash === '#student-dashboard') {
        setCurrentPage('student-dashboard')
        window.scrollTo(0, 0)
      } else if (hash === '#admin-portal' || hash === '#admin-dashboard' || hash === '#erp-portal') {
        setCurrentPage('admin-portal')
        window.scrollTo(0, 0)
      } else if (hash === '#jobs-page') {
        setCurrentPage('jobs-page')
        window.scrollTo(0, 0)
      } else if (hash === '#visa-page' || hash.startsWith('#visa-page#')) {
        setCurrentPage('visa-page')
        if (hash === '#visa-page') window.scrollTo(0, 0)
      } else if (hash === '#work-while-you-study-page' || hash.startsWith('#work-while-you-study-page#')) {
        setCurrentPage('work-while-you-study-page')
        if (hash === '#work-while-you-study-page') window.scrollTo(0, 0)
      } else if (hash === '#rewards' || hash === '#rewards-page' || hash.startsWith('#rewards#') || hash.startsWith('#rewards?')) {
        setCurrentPage('rewards-page')
        if (hash === '#rewards' || hash === '#rewards-page') window.scrollTo(0, 0)
      } else if (hash === '#about') {
        setCurrentPage('about-us')
        window.scrollTo(0, 0)
      } else if (hash === '#ilas-with-you') {
        setCurrentPage('ilas-with-you')
        window.scrollTo(0, 0)
      } else if (hash.startsWith('#applications') || hash.startsWith('#apply')) {
        setCurrentPage('applications')
        window.scrollTo(0, 0)
      } else if (hash === '#privacy-policy') {
        setCurrentPage('privacy-policy')
        window.scrollTo(0, 0)
      } else if (hash === '#study-abroad' || hash.startsWith('#study-abroad#')) {
        setCurrentPage('study-abroad')
        if (hash === '#study-abroad') window.scrollTo(0, 0)
      } else if (hash === '#education' || hash.startsWith('#education#')) {
        setCurrentPage('education')
        if (hash === '#education') window.scrollTo(0, 0)
      } else {
        setCurrentPage('home')
        window.scrollTo(0, 0)
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isAdminPage = currentPage === 'admin-portal' || currentPage === 'master-hub'

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col relative">
      {!isAdminPage && <Navbar />}
      <main className="w-full flex-grow">
        {currentPage === 'master-hub' ? (
          <AdminPortal />
        ) : currentPage === 'german-language' ? (
          <GermanLanguagePage />
        ) : currentPage === 'course-page' ? (
          <CoursePage courseTitle={activeCourseTitle} category={activeCourseCategory} />
        ) : currentPage === 'student-dashboard' ? (
          <StudentDashboard />
        ) : currentPage === 'admin-portal' ? (
          <AdminPortal />
        ) : currentPage === 'jobs-page' ? (
          <JobsPage />
        ) : currentPage === 'visa-page' ? (
          <VisaPage />
        ) : currentPage === 'work-while-you-study-page' ? (
          <WorkWhileYouStudyPage />
        ) : currentPage === 'rewards-page' ? (
          <RewardsPage />
        ) : currentPage === 'about-us' ? (
          <AboutUsPage />
        ) : currentPage === 'ilas-with-you' ? (
          <IlasWithYouPage />
        ) : currentPage === 'study-abroad' ? (
          <StudyAbroadPage />
        ) : currentPage === 'education' ? (
          <EducationPage />
        ) : currentPage === 'applications' ? (
          <ApplicationPoolPage />
        ) : currentPage === 'privacy-policy' ? (
          <PrivacyPolicyPage />
        ) : (
          <HomePage />
        )}
      </main>
      {!isAdminPage && <Footer />}
      <PortalLogin />
      <UnifiedIntakeForms />
      {!isAdminPage && <LanguageTrainer />}
      {!isAdminPage && <LiveConsultant />}
      {!isAdminPage && <FloatingContact />}
      <CookieBanner />
    </div>
  )
}

export default App