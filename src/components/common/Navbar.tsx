import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, LogIn } from 'lucide-react'
import { navItems } from '../../data/navigation'

interface NavChildItem {
  label: string
  href: string
  description?: string
  action?: string
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeHash, setActiveHash] = useState(
    window.location.hash || '#home'
  )

  const navRef = useRef<HTMLElement>(null)

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
            {navItems.map((item) => {
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
                        DESKTOP DROPDOWN
                    ================================================== */}
                    <div
                      className={`
                        absolute
                        top-full
                        left-0
                        pt-2
                        w-[280px]
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
                          rounded-xl
                          shadow-2xl
                          border
                          border-slate-100
                          overflow-hidden
                          py-2
                        "
                      >
                        {item.children.map(
                          (child: NavChildItem) => (
                            <a
                              key={child.label}
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
                                block
                                px-4
                                py-3
                                transition-colors
                                border-l-[3px]
                                ${
                                  isChildActive(child)
                                    ? 'bg-brand-50 border-brand-600'
                                    : 'border-transparent hover:bg-slate-50 hover:border-brand-300'
                                }
                              `}
                            >
                              <span
                                className={`
                                  block
                                  text-sm
                                  font-semibold
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
                                <span
                                  className="
                                    block
                                    text-xs
                                    text-slate-500
                                    mt-1
                                    leading-relaxed
                                  "
                                >
                                  {child.description}
                                </span>
                              )}
                            </a>
                          )
                        )}
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
            {navItems.map((item) => {
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
                            <a
                              key={child.label}
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
                                block
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
                              <span className="block">
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
                            </a>
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