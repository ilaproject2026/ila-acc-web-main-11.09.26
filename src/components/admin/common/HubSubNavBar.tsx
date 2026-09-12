import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, List, LucideIcon } from 'lucide-react';

export interface HubNavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    badge?: string | number;
}

interface HubSubNavBarProps {
    items: HubNavItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    activeColorClass?: string;
}

export const HubSubNavBar: React.FC<HubSubNavBarProps> = ({
    items,
    activeTab,
    onTabChange,
    activeColorClass = 'bg-brand-600'
}) => {
    const [isWrapMode, setIsWrapMode] = useState<boolean>(false);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

    const navContainerRef = useRef<HTMLDivElement>(null);

    // Check scroll boundaries
    const updateScrollButtons = () => {
        if (navContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = navContainerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener('resize', updateScrollButtons);
        return () => window.removeEventListener('resize', updateScrollButtons);
    }, []);

    // Auto-scroll active tab into view
    useEffect(() => {
        const activeBtn = document.getElementById(`nav-tab-${activeTab.replace(/\s+/g, '-')}`);
        if (activeBtn && navContainerRef.current && !isWrapMode) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        setTimeout(updateScrollButtons, 300);
    }, [activeTab, isWrapMode]);

    // Smooth scroll left / right
    const scrollNav = (direction: 'left' | 'right') => {
        if (navContainerRef.current) {
            const scrollAmount = direction === 'left' ? -260 : 260;
            navContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(updateScrollButtons, 350);
        }
    };

    // Handle wheel horizontal scrolling
    const handleNavWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (navContainerRef.current && !isWrapMode && e.deltaY !== 0) {
            e.preventDefault();
            navContainerRef.current.scrollLeft += e.deltaY * 0.8;
            updateScrollButtons();
        }
    };

    return (
        <div className="bg-slate-900 border-b border-slate-800/90 sticky top-0 z-30 shadow-md">
            <div className="flex items-center justify-between px-2 py-1.5 md:px-3 md:py-2 gap-2 relative">

                {/* Left Scroll Arrow Button */}
                {!isWrapMode && (
                    <button
                        type="button"
                        onClick={() => scrollNav('left')}
                        disabled={!canScrollLeft}
                        className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer hidden sm:flex items-center justify-center ${!canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 shadow-xs bg-slate-800/80'
                            }`}
                        title="Scroll Menu Left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                {/* Navigation Items Container (Scrollable or Wrapped) */}
                <div
                    ref={navContainerRef}
                    onScroll={updateScrollButtons}
                    onWheel={handleNavWheel}
                    className={`w-full flex items-center gap-1.5 py-0.5 transition-all ${isWrapMode
                            ? 'flex-wrap overflow-visible'
                            : 'overflow-x-auto scroll-smooth no-scrollbar'
                        }`}
                >
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const tabDomId = `nav-tab-${item.id.replace(/\s+/g, '-')}`;

                        return (
                            <button
                                type="button"
                                id={tabDomId}
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 cursor-pointer ${isActive
                                        ? `${activeColorClass} text-white shadow-xs font-black ring-1 ring-white/30`
                                        : 'text-slate-300 hover:text-white hover:bg-white/10 bg-slate-800/40'
                                    }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                                <span className="uppercase tracking-wider text-[11px] font-black">{item.label}</span>
                                {item.badge !== undefined && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700/80 text-slate-300'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Scroll Arrow Button */}
                {!isWrapMode && (
                    <button
                        type="button"
                        onClick={() => scrollNav('right')}
                        disabled={!canScrollRight}
                        className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer hidden sm:flex items-center justify-center ${!canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 shadow-xs bg-slate-800/80'
                            }`}
                        title="Scroll Menu Right to View All Tabs"
                    >
                        <ChevronRight className="w-4 h-4 text-amber-300 animate-pulse" />
                    </button>
                )}

                {/* Wrap / Expand All Tabs Toggle Button */}
                <button
                    type="button"
                    onClick={() => setIsWrapMode(!isWrapMode)}
                    className={`p-1.5 px-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${isWrapMode
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                            : 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700 hover:bg-slate-700'
                        }`}
                    title={isWrapMode ? 'Switch to Single-Row Slider' : `Expand All ${items.length} Tabs`}
                >
                    {isWrapMode ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />}
                    <span className="text-[10px] hidden md:inline">{isWrapMode ? 'Compact' : 'All Tabs'}</span>
                </button>

            </div>
        </div>
    );
};

export default HubSubNavBar;
