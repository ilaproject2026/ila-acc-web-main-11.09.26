export type ColorThemeMode = 'standard-light' | 'dark' | 'warm-paper' | 'high-contrast' | 'nordic-slate';

export interface ColorThemeOption {
  id: ColorThemeMode;
  name: string;
  description: string;
  badgeClass: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: 'standard-light',
    name: 'Standard Light',
    description: 'Crisp enterprise daylight palette with high clarity',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Deep navy/slate dark mode for low-light environments',
    badgeClass: 'bg-slate-900 text-slate-100 border-slate-700'
  },
  {
    id: 'warm-paper',
    name: 'Warm Paper (Comfort)',
    description: 'Soft sepia tone designed to eliminate eye fatigue',
    badgeClass: 'bg-[#f4efe6] text-amber-900 border-[#e7e0d4]'
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast borders and stark black-on-white text',
    badgeClass: 'bg-black text-white border-black'
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    description: 'Executive cool slate palette with crisp typography',
    badgeClass: 'bg-[#e2e8f0] text-slate-900 border-[#cbd5e1]'
  }
];

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: string;
  description: string;
  cssValue: string;
  recommendedFor: string;
}

export interface FontSettings {
  fontFamily: string;
  fontSizeScale: number; // 85 to 125, percentage of default base size
  fontWeightMode: 'light' | 'normal' | 'medium' | 'bold';
  letterSpacing: 'tight' | 'normal' | 'wide';
  lineHeightScale: 'compact' | 'comfortable' | 'relaxed';
  colorTheme: ColorThemeMode;
}

export interface ThemeProfile {
  id: string;
  name: string;
  isSystemDefault: boolean;
  description?: string;
  createdAt: string;
  settings: FontSettings;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'Inter',
    name: 'Inter',
    family: 'Inter',
    category: 'Sans-Serif (Modern)',
    description: 'Crisp, perfectly balanced neo-grotesque optimized for computer screens and admin interfaces.',
    cssValue: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    recommendedFor: 'Default enterprise standard'
  },
  {
    id: 'Roboto',
    name: 'Roboto',
    family: 'Roboto',
    category: 'Neo-Grotesque',
    description: 'Clean geometric forms with open curves, ensuring effortless legibility in dense data tables.',
    cssValue: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    recommendedFor: 'Numerical data, metrics & fast scanning'
  },
  {
    id: 'Open Sans',
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'Humanist Sans',
    description: 'Warm, upright stress and open letterforms designed to minimize eye fatigue during extended reading.',
    cssValue: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    recommendedFor: 'Maximum prolonged reading comfort'
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    family: 'Plus Jakarta Sans',
    category: 'Contemporary Sans',
    description: 'Refined modern geometry with elegant proportions and crisp terminal details.',
    cssValue: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    recommendedFor: 'High-end executive dashboards'
  },
  {
    id: 'Poppins',
    name: 'Poppins',
    family: 'Poppins',
    category: 'Geometric Sans',
    description: 'Harmonious geometric letterforms that bring clarity, warmth, and modern structure to headings and cards.',
    cssValue: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    recommendedFor: 'Clean modern aesthetic'
  },
  {
    id: 'Outfit',
    name: 'Outfit',
    family: 'Outfit',
    category: 'Modern Commercial',
    description: 'Contemporary, tech-forward, high-contrast type design crafted for brand and UI clarity.',
    cssValue: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    recommendedFor: 'Modern operations & counseling intake'
  },
  {
    id: 'Lexend',
    name: 'Lexend',
    family: 'Lexend',
    category: 'Reading Enhanced',
    description: 'Scientifically engineered to reduce visual stress, prevent letter crowding, and enhance reading speed.',
    cssValue: "'Lexend', -apple-system, BlinkMacSystemFont, sans-serif",
    recommendedFor: 'Accessibility, clarity & focus'
  },
  {
    id: 'Montserrat',
    name: 'Montserrat',
    family: 'Montserrat',
    category: 'Geometric Sans',
    description: 'Classic poster-inspired geometry with distinct capitals and sturdy characters.',
    cssValue: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    recommendedFor: 'Bold authority & clean headers'
  },
  {
    id: 'System',
    name: 'System UI (Native)',
    family: 'system-ui',
    category: 'Operating System Default',
    description: 'Instant loading using your native operating system font (SF Pro, Segoe UI, Roboto).',
    cssValue: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    recommendedFor: 'Zero network overhead & native look'
  }
];

export const FONT_PRESETS: { name: string; description: string; settings: FontSettings }[] = [
  {
    name: 'Default Clean',
    description: 'Standard Light theme with Inter typography and balanced scaling',
    settings: {
      fontFamily: 'Inter',
      fontSizeScale: 100,
      fontWeightMode: 'normal',
      letterSpacing: 'normal',
      lineHeightScale: 'comfortable',
      colorTheme: 'standard-light'
    }
  },
  {
    name: 'Comfort Reading (Large)',
    description: 'Open Sans scaled to 105% with medium clarity for relaxed review',
    settings: {
      fontFamily: 'Open Sans',
      fontSizeScale: 105,
      fontWeightMode: 'medium',
      letterSpacing: 'wide',
      lineHeightScale: 'relaxed',
      colorTheme: 'standard-light'
    }
  },
  {
    name: 'Dense Data Table Focus',
    description: 'Roboto at 95% with compact spacing for maximum record density',
    settings: {
      fontFamily: 'Roboto',
      fontSizeScale: 95,
      fontWeightMode: 'normal',
      letterSpacing: 'tight',
      lineHeightScale: 'compact',
      colorTheme: 'standard-light'
    }
  },
  {
    name: 'Midnight Studio',
    description: 'Midnight dark theme with Outfit typography at 102% scale',
    settings: {
      fontFamily: 'Outfit',
      fontSizeScale: 102,
      fontWeightMode: 'normal',
      letterSpacing: 'normal',
      lineHeightScale: 'comfortable',
      colorTheme: 'dark'
    }
  },
  {
    name: 'High-Focus Accessibility',
    description: 'Lexend with enhanced weight and 108% scale to reduce fatigue',
    settings: {
      fontFamily: 'Lexend',
      fontSizeScale: 108,
      fontWeightMode: 'medium',
      letterSpacing: 'wide',
      lineHeightScale: 'relaxed',
      colorTheme: 'warm-paper'
    }
  }
];

/**
 * PROTECTED SYSTEM DEFAULT THEME
 * Locked base settings that can NEVER be overwritten or deleted.
 */
export const SYSTEM_DEFAULT_THEME: ThemeProfile = {
  id: 'default',
  name: 'Default (Standard Light)',
  isSystemDefault: true,
  description: 'Factory Standard (Locked) — Standard Light theme with Inter 100% typography',
  createdAt: 'System Base',
  settings: {
    fontFamily: 'Inter',
    fontSizeScale: 100,
    fontWeightMode: 'normal',
    letterSpacing: 'normal',
    lineHeightScale: 'comfortable',
    colorTheme: 'standard-light'
  }
};

export const DEFAULT_FONT_SETTINGS: FontSettings = { ...SYSTEM_DEFAULT_THEME.settings };

const STORAGE_SETTINGS_KEY = 'ilas_font_settings';
const STORAGE_THEMES_KEY = 'ilas_custom_theme_profiles';
const STORAGE_ACTIVE_THEME_KEY = 'ilas_active_theme_id';

/**
 * Retrieve saved font and theme settings from localStorage or fallback to default
 */
export function getFontSettings(): FontSettings {
  if (typeof window === 'undefined') return DEFAULT_FONT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return DEFAULT_FONT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_FONT_SETTINGS,
      ...parsed,
      colorTheme: parsed.colorTheme || 'standard-light'
    };
  } catch (err) {
    console.error('Failed to parse saved font settings', err);
    return DEFAULT_FONT_SETTINGS;
  }
}

/**
 * Apply font and color theme settings immediately to the HTML/DOM document across all modules
 */
export function applyFontSettings(settings: FontSettings): void {
  if (typeof document === 'undefined') return;

  const fontOption = AVAILABLE_FONTS.find(f => f.id === settings.fontFamily) || AVAILABLE_FONTS[0];
  const root = document.documentElement;
  const body = document.body;

  // 1. Apply global font family CSS variables and inline fallbacks
  root.style.setProperty('--app-font-family', fontOption.cssValue);
  root.style.setProperty('--font-sans', fontOption.cssValue);
  body.style.fontFamily = fontOption.cssValue;

  // 2. TRUE TYPOGRAPHY SCALING (NO GENERIC BROWSER ZOOM)
  // Clear root html inline font-size to preserve standard base rem for containers
  root.style.fontSize = '';
  const scalePercent = Math.min(Math.max(settings.fontSizeScale || 100, 80), 130);
  const scaleFactor = scalePercent / 100;
  root.style.setProperty('--app-font-scale', `${scaleFactor}`);
  root.style.setProperty('--app-font-scale-percent', `${scalePercent}%`);
  
  // Set root typography scale tokens for CSS consumers
  root.style.setProperty('--font-size-base', `calc(1rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-xs', `calc(0.75rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-sm', `calc(0.875rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-md', `calc(1rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-lg', `calc(1.125rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-xl', `calc(1.25rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-2xl', `calc(1.5rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-3xl', `calc(1.875rem * ${scaleFactor})`);
  root.style.setProperty('--font-size-4xl', `calc(2.25rem * ${scaleFactor})`);

  // 3. Apply letter spacing
  let letterSpacingValue = 'normal';
  if (settings.letterSpacing === 'tight') letterSpacingValue = '-0.015em';
  if (settings.letterSpacing === 'wide') letterSpacingValue = '0.025em';
  root.style.setProperty('--app-letter-spacing', letterSpacingValue);
  body.style.letterSpacing = letterSpacingValue;

  // 4. Apply line height scale
  let lineHeightValue = '1.5';
  if (settings.lineHeightScale === 'compact') lineHeightValue = '1.35';
  if (settings.lineHeightScale === 'relaxed') lineHeightValue = '1.7';
  root.style.setProperty('--app-line-height-scale', lineHeightValue);

  // 5. Apply font weight class modifiers on body
  body.classList.remove('font-weight-light', 'font-weight-normal', 'font-weight-medium', 'font-weight-bold');
  body.classList.add(`font-weight-${settings.fontWeightMode || 'normal'}`);

  let baseWeight = '400';
  let boldWeight = '700';
  switch (settings.fontWeightMode) {
    case 'light':
      baseWeight = '300';
      boldWeight = '600';
      break;
    case 'normal':
      baseWeight = '400';
      boldWeight = '700';
      break;
    case 'medium':
      baseWeight = '500';
      boldWeight = '700';
      break;
    case 'bold':
      baseWeight = '600';
      boldWeight = '800';
      break;
  }
  root.style.setProperty('--app-base-font-weight', baseWeight);
  root.style.setProperty('--app-bold-font-weight', boldWeight);

  // 6. UNIVERSAL COLOR THEME PROPAGATION ACROSS ALL ENGINES & CONTAINERS
  const colorTheme = settings.colorTheme || 'standard-light';
  root.setAttribute('data-theme', colorTheme);
  body.setAttribute('data-theme', colorTheme);

  // Synchronize Tailwind dark mode class
  if (colorTheme === 'dark') {
    root.classList.add('dark');
    body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
  }
}

/**
 * Save font settings to localStorage and trigger global application & event broadcast
 */
export function saveFontSettings(settings: FontSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    applyFontSettings(settings);
    window.dispatchEvent(new CustomEvent('ilas-font-settings-changed', { detail: settings }));
    window.dispatchEvent(new CustomEvent('ilas-theme-changed', { detail: { colorTheme: settings.colorTheme } }));
  } catch (err) {
    console.error('Failed to save font settings', err);
  }
}

/**
 * Get all theme profiles, guaranteeing the locked System Default is always present and unmutated
 */
export function getThemeProfiles(): ThemeProfile[] {
  if (typeof window === 'undefined') return [SYSTEM_DEFAULT_THEME];
  try {
    const raw = localStorage.getItem(STORAGE_THEMES_KEY);
    const customList: ThemeProfile[] = raw ? JSON.parse(raw) : [];
    // Ensure system default is always clean and non-deletable
    const filtered = customList.filter(t => t.id !== 'default');
    return [SYSTEM_DEFAULT_THEME, ...filtered];
  } catch (err) {
    console.error('Failed to read theme profiles', err);
    return [SYSTEM_DEFAULT_THEME];
  }
}

/**
 * Get active theme ID
 */
export function getActiveThemeId(): string {
  if (typeof window === 'undefined') return 'default';
  try {
    return localStorage.getItem(STORAGE_ACTIVE_THEME_KEY) || 'default';
  } catch {
    return 'default';
  }
}

/**
 * Save a new Custom Theme Profile (e.g. Theme 1, Theme 2)
 */
export function saveCustomThemeProfile(name: string, settings: FontSettings): ThemeProfile {
  const existingProfiles = getThemeProfiles();
  const customOnly = existingProfiles.filter(p => !p.isSystemDefault);

  // Auto-generate name like "Theme 1", "Theme 2" if name is empty
  const themeNumber = customOnly.length + 1;
  const finalName = name.trim() || `Theme ${themeNumber}`;

  const newProfile: ThemeProfile = {
    id: `theme-${Date.now()}`,
    name: finalName,
    isSystemDefault: false,
    description: `Custom profile (${settings.fontFamily}, ${settings.fontSizeScale}%, ${settings.colorTheme || 'standard-light'})`,
    createdAt: new Date().toLocaleDateString(),
    settings: { ...settings }
  };

  const updatedCustom = [...customOnly, newProfile];
  localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updatedCustom));
  localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, newProfile.id);

  // Save and apply settings
  saveFontSettings(settings);
  window.dispatchEvent(new CustomEvent('ilas-themes-changed', { detail: { activeId: newProfile.id, profiles: [SYSTEM_DEFAULT_THEME, ...updatedCustom] } }));

  return newProfile;
}

/**
 * Update an existing custom theme profile (SYSTEM DEFAULT IS PROTECTED)
 */
export function updateCustomThemeProfile(id: string, updates: { name?: string; settings?: FontSettings }): ThemeProfile | null {
  if (id === 'default') {
    console.warn('Cannot overwrite locked System Default theme');
    return SYSTEM_DEFAULT_THEME;
  }

  const existingProfiles = getThemeProfiles();
  const targetIndex = existingProfiles.findIndex(p => p.id === id);
  if (targetIndex === -1) return null;

  const target = existingProfiles[targetIndex];
  const updated: ThemeProfile = {
    ...target,
    name: updates.name ? updates.name.trim() : target.name,
    settings: updates.settings ? { ...updates.settings } : target.settings
  };

  const customOnly = existingProfiles.filter(p => !p.isSystemDefault && p.id !== id);
  customOnly.push(updated);
  localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(customOnly));

  if (updates.settings) {
    saveFontSettings(updates.settings);
  }

  window.dispatchEvent(new CustomEvent('ilas-themes-changed', { detail: { activeId: id, profiles: [SYSTEM_DEFAULT_THEME, ...customOnly] } }));
  return updated;
}

/**
 * Delete a custom theme profile (SYSTEM DEFAULT CANNOT BE DELETED)
 */
export function deleteCustomThemeProfile(id: string): boolean {
  if (id === 'default') {
    // Protected! System default cannot be deleted
    return false;
  }

  const existingProfiles = getThemeProfiles();
  const customOnly = existingProfiles.filter(p => !p.isSystemDefault && p.id !== id);
  localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(customOnly));

  const activeId = getActiveThemeId();
  if (activeId === id) {
    // If the deleted theme was active, automatically revert to the locked System Default
    resetToSystemDefault();
  } else {
    window.dispatchEvent(new CustomEvent('ilas-themes-changed', { detail: { activeId, profiles: [SYSTEM_DEFAULT_THEME, ...customOnly] } }));
  }

  return true;
}

/**
 * Switch / Activate a Theme Profile
 */
export function activateThemeProfile(id: string): ThemeProfile {
  const profiles = getThemeProfiles();
  const selected = profiles.find(p => p.id === id) || SYSTEM_DEFAULT_THEME;

  localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, selected.id);
  saveFontSettings(selected.settings);
  window.dispatchEvent(new CustomEvent('ilas-themes-changed', { detail: { activeId: selected.id, profiles } }));

  return selected;
}

/**
 * Reset to System Default theme (Protected factory state)
 */
export function resetToSystemDefault(): ThemeProfile {
  localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, 'default');
  saveFontSettings(SYSTEM_DEFAULT_THEME.settings);
  window.dispatchEvent(new CustomEvent('ilas-themes-changed', { detail: { activeId: 'default', profiles: getThemeProfiles() } }));
  return SYSTEM_DEFAULT_THEME;
}

let hasRegisteredGlobalListeners = false;

/**
 * Initialize font and theme settings on startup with universal persistence across modules
 */
export function initFontSettings(): FontSettings {
  const current = getFontSettings();
  applyFontSettings(current);

  if (typeof window !== 'undefined' && !hasRegisteredGlobalListeners) {
    hasRegisteredGlobalListeners = true;

    // Universal Synchronization across tabs, iframes, or local modules
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === STORAGE_SETTINGS_KEY || e.key === STORAGE_ACTIVE_THEME_KEY || e.key === STORAGE_THEMES_KEY) {
        const updated = getFontSettings();
        applyFontSettings(updated);
        window.dispatchEvent(new CustomEvent('ilas-font-settings-changed', { detail: updated }));
      }
    });

    // Ensure settings remain active on focus / route transitions
    window.addEventListener('focus', () => {
      const updated = getFontSettings();
      applyFontSettings(updated);
    });
  }

  return current;
}
