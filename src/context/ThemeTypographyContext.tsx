import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  FontSettings, 
  ThemeProfile, 
  ColorThemeMode,
  SYSTEM_DEFAULT_THEME,
  DEFAULT_FONT_SETTINGS,
  getFontSettings,
  saveFontSettings,
  applyFontSettings,
  getThemeProfiles,
  getActiveThemeId,
  saveCustomThemeProfile,
  updateCustomThemeProfile,
  deleteCustomThemeProfile,
  activateThemeProfile,
  resetToSystemDefault,
  initFontSettings
} from '../lib/fontManager';

interface ThemeTypographyContextType {
  settings: FontSettings;
  profiles: ThemeProfile[];
  activeProfile: ThemeProfile;
  activeThemeId: string;
  isSettingsModified: boolean;
  setFontFamily: (fontFamily: string) => void;
  setFontSizeScale: (scale: number) => void;
  setFontWeightMode: (mode: FontSettings['fontWeightMode']) => void;
  setLetterSpacing: (spacing: FontSettings['letterSpacing']) => void;
  setLineHeightScale: (lh: FontSettings['lineHeightScale']) => void;
  setColorTheme: (theme: ColorThemeMode) => void;
  updateSetting: <K extends keyof FontSettings>(key: K, value: FontSettings[K]) => void;
  saveNewProfile: (name: string) => ThemeProfile;
  updateActiveProfile: () => ThemeProfile | null;
  deleteProfile: (id: string) => boolean;
  activateProfile: (id: string) => ThemeProfile;
  resetDefault: () => ThemeProfile;
  applyPreset: (presetSettings: FontSettings) => void;
}

const ThemeTypographyContext = createContext<ThemeTypographyContextType | undefined>(undefined);

export const ThemeTypographyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [profiles, setProfiles] = useState<ThemeProfile[]>([SYSTEM_DEFAULT_THEME]);
  const [activeThemeId, setActiveThemeIdState] = useState<string>('default');

  const syncFromStorage = useCallback(() => {
    const loadedSettings = getFontSettings();
    const loadedProfiles = getThemeProfiles();
    const loadedActiveId = getActiveThemeId();
    
    setSettings(loadedSettings);
    setProfiles(loadedProfiles);
    setActiveThemeIdState(loadedActiveId);
    applyFontSettings(loadedSettings);
  }, []);

  useEffect(() => {
    initFontSettings();
    syncFromStorage();

    const handleSettingsChange = () => syncFromStorage();
    const handleThemesChange = () => syncFromStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('ilas_')) {
        syncFromStorage();
      }
    };

    window.addEventListener('ilas-font-settings-changed', handleSettingsChange);
    window.addEventListener('ilas-themes-changed', handleThemesChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ilas-font-settings-changed', handleSettingsChange);
      window.removeEventListener('ilas-themes-changed', handleThemesChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncFromStorage]);

  const activeProfile = profiles.find(p => p.id === activeThemeId) || SYSTEM_DEFAULT_THEME;

  const isSettingsModified = 
    settings.fontFamily !== activeProfile.settings.fontFamily ||
    settings.fontSizeScale !== activeProfile.settings.fontSizeScale ||
    settings.fontWeightMode !== activeProfile.settings.fontWeightMode ||
    settings.letterSpacing !== activeProfile.settings.letterSpacing ||
    settings.lineHeightScale !== activeProfile.settings.lineHeightScale ||
    settings.colorTheme !== activeProfile.settings.colorTheme;

  const updateSetting = useCallback(<K extends keyof FontSettings>(key: K, value: FontSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      applyFontSettings(next);
      saveFontSettings(next);
      return next;
    });
  }, []);

  const setFontFamily = useCallback((fontFamily: string) => updateSetting('fontFamily', fontFamily), [updateSetting]);
  const setFontSizeScale = useCallback((scale: number) => updateSetting('fontSizeScale', scale), [updateSetting]);
  const setFontWeightMode = useCallback((mode: FontSettings['fontWeightMode']) => updateSetting('fontWeightMode', mode), [updateSetting]);
  const setLetterSpacing = useCallback((spacing: FontSettings['letterSpacing']) => updateSetting('letterSpacing', spacing), [updateSetting]);
  const setLineHeightScale = useCallback((lh: FontSettings['lineHeightScale']) => updateSetting('lineHeightScale', lh), [updateSetting]);
  const setColorTheme = useCallback((theme: ColorThemeMode) => updateSetting('colorTheme', theme), [updateSetting]);

  const saveNewProfile = useCallback((name: string) => {
    const created = saveCustomThemeProfile(name, settings);
    syncFromStorage();
    return created;
  }, [settings, syncFromStorage]);

  const updateActiveProfile = useCallback(() => {
    if (activeProfile.isSystemDefault) {
      return null;
    }
    const updated = updateCustomThemeProfile(activeProfile.id, { settings });
    syncFromStorage();
    return updated;
  }, [activeProfile, settings, syncFromStorage]);

  const deleteProfile = useCallback((id: string) => {
    const success = deleteCustomThemeProfile(id);
    if (success) {
      syncFromStorage();
    }
    return success;
  }, [syncFromStorage]);

  const activateProfile = useCallback((id: string) => {
    const activated = activateThemeProfile(id);
    syncFromStorage();
    return activated;
  }, [syncFromStorage]);

  const resetDefault = useCallback(() => {
    const def = resetToSystemDefault();
    syncFromStorage();
    return def;
  }, [syncFromStorage]);

  const applyPreset = useCallback((presetSettings: FontSettings) => {
    setSettings(presetSettings);
    applyFontSettings(presetSettings);
    saveFontSettings(presetSettings);
  }, []);

  return (
    <ThemeTypographyContext.Provider
      value={{
        settings,
        profiles,
        activeProfile,
        activeThemeId,
        isSettingsModified,
        setFontFamily,
        setFontSizeScale,
        setFontWeightMode,
        setLetterSpacing,
        setLineHeightScale,
        setColorTheme,
        updateSetting,
        saveNewProfile,
        updateActiveProfile,
        deleteProfile,
        activateProfile,
        resetDefault,
        applyPreset
      }}
    >
      {children}
    </ThemeTypographyContext.Provider>
  );
};

export const useThemeTypography = () => {
  const context = useContext(ThemeTypographyContext);
  if (!context) {
    throw new Error('useThemeTypography must be used within a ThemeTypographyProvider');
  }
  return context;
};
