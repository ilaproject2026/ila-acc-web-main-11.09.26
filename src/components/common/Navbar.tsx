import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, ChevronRight, LogIn } from 'lucide-react'
import { navItems, NavItem, NavChildItem, NavSubItem } from '../../data/navigation'
import { getGlobalCategories } from '../../lib/db'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null)
  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>(navItems)
  const [scrolled, setScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeHash, setActiveHash] = useState(
    window.location.hash || '#home'
  )

  const navRef = useRef<HTMLElement>(null)

  // --------------------------------------------------
  // Sync All Courses categories dynamically with backend DB
  // --------------------------------------------------
  useEffect(() => {
    const syncCategoriesWithNav = () => {
      const dbCategories = getGlobalCategories()
      if (!dbCategories || dbCategories.length === 0) return

      const allCoursesChildren: NavChildItem[] = dbCategories
        .filter(c => c.showInNav !== false)
        .sort((a, b) => (a.position || 99) - (b.position || 99))
        .map(cat => ({
          label: cat.name,
          href: `#education?category=${encodeURIComponent(cat.name)}`,
          description: cat.description || `Explore ${cat.name} certifications and pathways`,
          subCategories: (cat.subCategories || []).map(sub => {
            const code = cat.subCategoryCodes?.[sub] || cat.subCategoryProducts?.find(p => p.name === sub)?.code;
            return {
              label: sub,
              href: `#education?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub)}`,
              description: code ? `[${code}] Specialized program` : `Specialized ${sub} track`
            };
          })
        }))

      setDynamicNavItems(prev => prev.map(item => {
        if (item.label === 'All Courses') {
          return {
            ...item,
            children: allCoursesChildren.length > 0 ? allCoursesChildren : item.children
          }
        }
        return item
      }))
    }

    syncCategoriesWithNav()
    window.addEventListener('ilas-categories-changed', syncCategoriesWithNav)
    window.addEventListener('ilas-courses-changed', syncCategoriesWithNav)
    return () => {
      window.removeEventListener('ilas-categories-changed', syncCategoriesWithNav)
      window.removeEventListener('ilas-courses-changed', syncCategoriesWithNav)
    }
  }, [])

  // --------------------------------------------------
  // Hash handling
  // --------------------------------------------------
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#home')
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // --------------------------------------------------
  // Scroll behavior
  // --------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setScrolled(currentScrollY > 20)

      // Hide navbar when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        if (showNavbar) {
          setShowNavbar(false)
          setOpenDropdown(null)
          document.body.classList.add('nav-hidden')
        }
      }

      // Show navbar when scrolling up
      if (currentScrollY < lastScrollY) {
        if (!showNavbar) {
          setShowNavbar(true)
          document.body.classList.remove('nav-hidden')
        }
      }

      // Always show at the very top
      if (currentScrollY <= 20) {
        setShowNavbar(true)
        document.body.classList.remove('nav-hidden')
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('nav-hidden')
    }
  }, [lastScrollY, showNavbar])

  // --------------------------------------------------
  // Close dropdown when clicking outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // --------------------------------------------------
  // Portal
  // --------------------------------------------------
  const openPortal = () => {
    setMobileOpen(false)
    setOpenDropdown(null)

    window.dispatchEvent(
      new CustomEvent('open-portal-login')
    )
  }

  // --------------------------------------------------
  // Navigation action
  // --------------------------------------------------
  const handleNavClick = (action?: string) => {
    setOpenDropdown(null)
    setMobileOpen(false)

    if (action) {
      window.dispatchEvent(new CustomEvent(action))
    }
  }

  // --------------------------------------------------
  // Active state helper
  // --------------------------------------------------
  const isItemActive = (item: {
    href?: string
    children?: NavChildItem[]
  }) => {
    if (!item) return false
    const currentHash = activeHash || '#home'
    const currentRoute = currentHash.replace(/^#/, '').split('#')[0]?.split('?')[0] || 'home'

    if (item.href) {
      const itemRoute = item.href.replace(/^#/, '').split('#')[0]?.split('?')[0] || ''
      if (itemRoute && currentRoute === itemRoute) {
        return true
      }
    }

    if (item.children && Array.isArray(item.children)) {
      return item.children.some((child) => {
        if (!child || !child.href) return false
        const childRoute = child.href.replace(/^#/, '').split('#')[0]?.split('?')[0] || ''
        return !!(childRoute && currentRoute === childRoute)
      })
    }

    return false
  }

  const isChildActive = (child: NavChildItem) => {
    if (!child || !child.href) return false
    const currentHash = activeHash || '#home'
    return currentHash === child.href || currentHash.startsWith(child.href + '#') || currentHash.startsWith(child.href + '?')
  }

  return (
    <header
      ref={navRef}
      className={`
        fixed top-0 inset-x-0 z-50
        transition-all duration-300 ease-in-out
        ${
          showNavbar
            ? 'translate-y-0'
            : '-translate-y-full'
        }
        ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
        }
      `}
    >
      {/* ==================================================
          NAVBAR CONTAINER
      ================================================== */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            flex items-center
            gap-3
            transition-all duration-300
            ${
              scrolled
                ? 'h-16'
                : 'h-[68px] lg:h-[72px]'
            }
          `}
        >
          {/* ==================================================
              LOGO
          ================================================== */}
          <a
            href="#home"
            className="
              flex flex-col
              shrink-0
              min-w-0
              group
              mr-2
            "
          >
            <span
              className="
                text-xl
                min-[1400px]:text-2xl
                font-bold
                text-brand-900
                leading-none
                tracking-tight
                whitespace-nowrap
                group-hover:opacity-90
                transition-opacity
              "
            >
              ILA Global
            </span>

            <span
              className="
                text-[8px]
                min-[1400px]:text-[10px]
                font-semibold
                text-brand-600
                tracking-[0.08em]
                mt-1
                whitespace-nowrap
              "
            >
              INTERNATIONAL LEARNING ALLIANCE
            </span>
          </a>

          {/* ==================================================
              DESKTOP NAVIGATION
              Visible from lg (1024px)
          ================================================== */}
          <nav
            className="
              hidden
              lg:flex
              items-center
              justify-center
              flex-1
              min-w-0
              gap-0.5
              xl:gap-1
            "
          >
            {dynamicNavItems.map((item) => {
              const isActive = isItemActive(item)

              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="
                      relative
                      group
                      shrink-0
                    "
                  >
                    {/* Parent navigation item */}
                    <div className="flex items-center">
                      <a
                        href={item.href || '#'}
                        className={`
                          relative
                          flex
                          items-center
                          justify-center
                          text-center
                          px-1.5
                          min-[1400px]:px-2.5
                          py-2
                          text-xs
                          min-[1400px]:text-[13px]
                          font-semibold
                          leading-tight
                          transition-colors
                          whitespace-nowrap
                          ${
                            isActive
                              ? 'text-brand-700 font-bold'
                              : 'text-slate-600 hover:text-brand-700'
                          }
                        `}
                      >
                        <span>{item.label}</span>

                        {isActive && (
                          <span
                            className="
                              absolute
                              bottom-0
                              left-1
                              right-1
                              h-[2px]
                              bg-brand-600
                              rounded-t-full
                            "
                          />
                        )}
                      </a>

                      {/* Dropdown button */}
                      <button
                        type="button"
                        aria-label={`Open ${item.label} submenu`}
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label
                              ? null
                              : item.label
                          )
                        }
                        className={`
                          shrink-0
                          p-1
                          transition-colors
                          ${
                            isActive
                              ? 'text-brand-700'
                              : 'text-slate-500 hover:text-brand-700'
                          }
                        `}
                      >
                        <ChevronDown
                          className={`
                            w-3
                            h-3
                            transition-transform
                            duration-200
                            ${
                              openDropdown === item.label
                                ? 'rotate-180'
                                : 'group-hover:rotate-180'
                            }
                          `}
                        />
                      </button>
                    </div>

                    {/* ==================================================
                        DESKTOP DROPDOWN WITH SUB-CATEGORY FLYOUTS
                    ================================================== */}
                    <div
                      className={`
                        absolute
                        top-full
                        left-0
                        pt-2
                        w-[290px]
                        transition-all
                        duration-200
                        z-[60]

                        ${
                          openDropdown === item.label
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
                        }
                      `}
                    >
                      <div
                        className="
                          bg-white
                          rounded-2xl
                          shadow-2xl
                          border
                          border-slate-100
                          overflow-visible
                          py-2
                        "
                      >
                        {item.children.map((child: NavChildItem) => {
                          const hasSubCategories = child.subCategories && child.subCategories.length > 0
                          const isSubOpen = openSubDropdown === child.label

                          return (
                            <div
                              key={child.label}
                              className="relative group/sub"
                              onMouseEnter={() => setOpenSubDropdown(child.label)}
                              onMouseLeave={() => setOpenSubDropdown(null)}
                            >
                              <a
                                href={child.href}
                                onClick={(event) => {
                                  if (child.action) {
                                    event.preventDefault()
                                    handleNavClick(child.action)
                                    return
                                  }

                                  setOpenDropdown(null)
                                  setOpenSubDropdown(null)
                                  setMobileOpen(false)

                                  if (window.location.hash === child.href) {
                                    window.dispatchEvent(new HashChangeEvent('hashchange'))
                                  }
                                }}
                                className={`
                                  flex items-center justify-between
                                  px-4 py-3
                                  transition-colors
                                  border-l-[3px]
                                  ${
                                    isChildActive(child)
                                      ? 'bg-brand-50 border-brand-600'
                                      : 'border-transparent hover:bg-slate-50 hover:border-brand-300'
                                  }
                                `}
                              >
                                <div className="min-w-0 pr-1">
                                  <span
                                    className={`
                                      block text-sm font-semibold truncate
                                      ${
                                        isChildActive(child)
                                          ? 'text-brand-700'
                                          : 'text-slate-800'
                                      }
                                    `}
                                  >
                                    {child.label}
                                  </span>

                                  {child.description && (
                                    <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                                      {child.description}
                                    </span>
                                  )}
                                </div>

                                {hasSubCategories && (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sub:text-brand-600 group-hover/sub:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                                )}
                              </a>

                              {/* Dynamic Sub-Category Flyout Menu */}
                              {hasSubCategories && (
                                <div
                                  className={`
                                    absolute left-full top-0 pl-2 w-[290px]
                                    transition-all duration-200 z-[70]
                                    ${
                                      isSubOpen
                                        ? 'opacity-100 visible translate-x-0'
                                        : 'opacity-0 invisible -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0'
                                    }
                                  `}
                                >
                                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2">
                                    <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1 bg-slate-50/80 flex items-center justify-between">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-700">
                                        Sub-Categories &amp; Products
                                      </span>
                                      <span className="text-[9px] font-bold bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded-full">
                                        {child.subCategories?.length}
                                      </span>
                                    </div>
                                    {child.subCategories?.map((sub: NavSubItem) => (
                                      <a
                                        key={sub.label}
                                        href={sub.href}
                                        onClick={() => {
                                          setOpenDropdown(null)
                                          setOpenSubDropdown(null)
                                          setMobileOpen(false)
                                          if (window.location.hash === sub.href) {
                                            window.dispatchEvent(new HashChangeEvent('hashchange'))
                                          }
                                        }}
                                        className="block px-3.5 py-2.5 hover:bg-brand-50/80 border-l-2 border-transparent hover:border-brand-600 transition-colors"
                                      >
                                        <span className="block text-xs font-bold text-slate-800 hover:text-brand-700 leading-tight">
                                          🏷️ {sub.label}
                                        </span>
                                        {sub.description && (
                                          <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                                            {sub.description}
                                          </span>
                                        )}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`
                    relative
                    flex
                    items-center
                    justify-center
                    px-1.5
                    min-[1400px]:px-2.5
                    py-2
                    text-xs
                    min-[1400px]:text-[13px]
                    font-semibold
                    leading-tight
                    text-center
                    transition-colors
                    whitespace-nowrap
                    shrink-0

                    ${
                      isActive
                        ? 'text-brand-700 font-bold'
                        : 'text-slate-600 hover:text-brand-700'
                    }
                  `}
                >
                  {item.label}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-2
                        right-2
                        h-[2px]
                        bg-brand-600
                        rounded-t-full
                      "
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* ==================================================
              DESKTOP ACTIONS
          ================================================== */}
          <div
            className="
              hidden
              lg:flex
              items-center
              gap-1.5
              shrink-0
              ml-1
            "
          >
            {/* ILA With You */}
            <a
              href="#ilas-with-you"
              aria-label="ILAs With You"
              className="
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-2.5
                min-[1400px]:px-3.5
                py-2
                min-[1400px]:py-2.5
                bg-gradient-to-r
                from-indigo-500
                to-purple-600
                text-white
                text-[11px]
                min-[1400px]:text-xs
                font-semibold
                rounded-lg
                hover:from-indigo-600
                hover:to-purple-700
                transition-all
                shadow-sm
                whitespace-nowrap
              "
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className="
                    animate-ping
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    bg-white
                    opacity-75
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    rounded-full
                    h-2.5
                    w-2.5
                    bg-white
                  "
                />
              </span>

              <span className="hidden min-[1400px]:inline">
                Ilas With You
              </span>

              <span className="inline min-[1400px]:hidden">
                ILA
              </span>
            </a>

            {/* Portal Login */}
            <button
              type="button"
              onClick={openPortal}
              aria-label="Portal Login"
              className="
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-2.5
                min-[1400px]:px-3.5
                py-2
                min-[1400px]:py-2.5
                bg-brand-700
                text-white
                text-[11px]
                min-[1400px]:text-xs
                font-semibold
                rounded-lg
                hover:bg-brand-800
                transition-colors
                shadow-sm
                whitespace-nowrap
                cursor-pointer
              "
            >
              <LogIn className="w-3.5 h-3.5" />

              <span className="hidden min-[1400px]:inline">
                Portal Login
              </span>

              <span className="inline min-[1400px]:hidden">
                Login
              </span>
            </button>
          </div>

          {/* ==================================================
              TABLET / MOBILE MENU BUTTON
              Below lg (1024px)
          ================================================== */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen)
              setOpenDropdown(null)
            }}
            className="
              lg:hidden
              ml-auto
              p-2.5
              rounded-lg
              text-slate-600
              hover:bg-slate-100
              hover:text-brand-700
              transition-colors
              cursor-pointer
              shrink-0
            "
            aria-label={
              mobileOpen ? 'Close menu' : 'Open menu'
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ==================================================
          MOBILE / TABLET MENU
      ================================================== */}
      {mobileOpen && (
        <div
          className="
            lg:hidden
            border-t
            border-slate-100
            bg-white
            shadow-xl
            max-h-[calc(100vh-68px)]
            overflow-y-auto
          "
        >
          <nav
            className="
              w-full
              max-w-[900px]
              mx-auto
              px-4
              sm:px-6
              py-4
            "
          >
            {dynamicNavItems.map((item) => {
              const isActive = isItemActive(item)

              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="mb-1"
                  >
                    <div
                      className={`
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        ${
                          isActive
                            ? 'bg-brand-50'
                            : ''
                        }
                      `}
                    >
                      <a
                        href={item.href || '#'}
                        onClick={() =>
                          setMobileOpen(false)
                        }
                        className={`
                          flex-1
                          px-3
                          py-3
                          text-sm
                          font-semibold
                          ${
                            isActive
                              ? 'text-brand-700'
                              : 'text-slate-700'
                          }
                        `}
                      >
                        {item.label}
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label
                              ? null
                              : item.label
                          )
                        }
                        className={`
                          p-3
                          ${
                            isActive
                              ? 'text-brand-700'
                              : 'text-slate-500'
                          }
                        `}
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        <ChevronDown
                          className={`
                            w-4
                            h-4
                            transition-transform
                            ${
                              openDropdown ===
                              item.label
                                ? 'rotate-180'
                                : ''
                            }
                          `}
                        />
                      </button>
                    </div>

                    {openDropdown === item.label && (
                      <div
                        className="
                          ml-3
                          pl-3
                          border-l
                          border-slate-200
                          py-1
                        "
                      >
                        {item.children.map(
                          (child: NavChildItem) => (
                            <div key={child.label} className="mb-1">
                              <a
                                href={child.href}
                                onClick={(event) => {
                                  if (child.action) {
                                    event.preventDefault()
                                    handleNavClick(
                                      child.action
                                    )
                                    return
                                  }

                                  setOpenDropdown(null)
                                  setMobileOpen(false)

                                  if (
                                    window.location.hash ===
                                    child.href
                                  ) {
                                    window.dispatchEvent(
                                      new HashChangeEvent(
                                        'hashchange'
                                      )
                                    )
                                  }
                                }}
                                className={`
                                  flex
                                  items-center
                                  justify-between
                                  px-3
                                  py-2.5
                                  rounded-lg
                                  text-sm
                                  ${
                                    isChildActive(child)
                                      ? 'text-brand-700 bg-brand-50 font-semibold'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'
                                  }
                                `}
                              >
                                <div>
                                  <span className="block font-medium">
                                    {child.label}
                                  </span>

                                  {child.description && (
                                    <span
                                      className="
                                        block
                                        text-xs
                                        text-slate-500
                                        mt-0.5
                                      "
                                    >
                                      {child.description}
                                    </span>
                                  )}
                                </div>

                                {child.subCategories && child.subCategories.length > 0 && (
                                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200 shrink-0 ml-2">
                                    {child.subCategories.length}
                                  </span>
                                )}
                              </a>

                              {/* Mobile Sub-categories indented */}
                              {child.subCategories && child.subCategories.length > 0 && (
                                <div className="ml-4 pl-3 border-l-2 border-brand-200/80 my-1 space-y-1">
                                  {child.subCategories.map((sub: NavSubItem) => (
                                    <a
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={() => {
                                        setOpenDropdown(null)
                                        setMobileOpen(false)
                                        if (window.location.hash === sub.href) {
                                          window.dispatchEvent(new HashChangeEvent('hashchange'))
                                        }
                                      }}
                                      className="block px-2.5 py-1 text-xs text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-md font-medium"
                                    >
                                      🏷️ {sub.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block
                    px-3
                    py-3
                    text-sm
                    font-semibold
                    rounded-lg
                    mb-1
                    ${
                      isActive
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-700'
                    }
                  `}
                >
                  {item.label}
                </a>
              )
            })}

            {/* ==================================================
                MOBILE CTA BUTTONS
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-2
                mt-3
                pt-3
                border-t
                border-slate-100
              "
            >
              <a
                href="#ilas-with-you"
                onClick={() => setMobileOpen(false)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-600
                  text-white
                  text-sm
                  font-semibold
                  rounded-lg
                  shadow-sm
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-white
                  "
                />

                Ilas With You
              </a>

              <button
                type="button"
                onClick={openPortal}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  bg-brand-700
                  text-white
                  text-sm
                  font-semibold
                  rounded-lg
                  cursor-pointer
                "
              >
                <LogIn className="w-4 h-4" />

                Portal Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}