import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'fr_fr' | 'en_us';
const storageKey = 'skyrim-skyshards-locale';
const fr = {
  modded: 'Skyrim moddé', search: 'Rechercher une shard', searchPlaceholder: 'Rechercher un lieu…',
  progress: 'Progression', export: 'Exporter', import: 'Importer', reset: 'Réinitialiser',
  regions: 'Liste des shards par région', empty: 'Aucune shard ne correspond à cette recherche.',
  map: 'Carte des Skyshards de Skyrim', close: 'Fermer la fiche', found: 'Trouvée',
  markFound: 'Marquer comme trouvée', source: 'Voir la source ↗',
  markLabel: (name: string) => `Marquer ${name} comme trouvée`,
  imageUnavailable: 'Illustration indisponible',
  imageLabel: (name: string) => `Illustration indisponible pour ${name}`,
  importTitle: 'Import de progression',
  importedCount: (count: number) => `${count} shard${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`,
  importDescription: 'Choisissez la manière d’appliquer cette sauvegarde à votre progression en cours.',
  replace: 'Remplacer', merge: 'Fusionner', cancel: 'Annuler', importFile: 'Importer un fichier de progression',
  resetConfirm: 'Réinitialiser toutes les shards trouvées de cette session ?',
  readError: 'Impossible de lire ce fichier.', invalidJson: 'Le fichier importé n’est pas un JSON valide.',
  invalidFormat: 'Format de sauvegarde incompatible.', switchLanguage: 'Switch to English',
};
const en: typeof fr = {
  modded: 'Modded Skyrim', search: 'Search for a shard', searchPlaceholder: 'Search for a location…',
  progress: 'Progress', export: 'Export', import: 'Import', reset: 'Reset',
  regions: 'Shards by region', empty: 'No shards match your search.',
  map: 'Skyrim Skyshards map', close: 'Close details', found: 'Found',
  markFound: 'Mark as found', source: 'View source ↗', markLabel: (name) => `Mark ${name} as found`,
  imageUnavailable: 'Image unavailable', imageLabel: (name) => `Image unavailable for ${name}`,
  importTitle: 'Import progress', importedCount: (count) => `${count} shard${count === 1 ? '' : 's'} found`,
  importDescription: 'Choose how to apply this save to your current progress.',
  replace: 'Replace', merge: 'Merge', cancel: 'Cancel', importFile: 'Import a progress file',
  resetConfirm: 'Reset all shards found in this session?', readError: 'Unable to read this file.',
  invalidJson: 'The imported file is not valid JSON.', invalidFormat: 'Incompatible save format.',
  switchLanguage: 'Passer en français',
};
const LanguageContext = createContext({ locale: 'fr_fr' as Locale, t: fr, toggleLanguage: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try { return localStorage.getItem(storageKey) === 'en_us' ? 'en_us' : 'fr_fr'; }
    catch { return 'fr_fr'; }
  });
  useEffect(() => {
    document.documentElement.lang = locale === 'fr_fr' ? 'fr-FR' : 'en-US';
    try { localStorage.setItem(storageKey, locale); } catch { /* Retain the choice for this session. */ }
  }, [locale]);
  return (
    <LanguageContext.Provider value={{ locale, t: locale === 'fr_fr' ? fr : en,
      toggleLanguage: () => setLocale((current) => current === 'fr_fr' ? 'en_us' : 'fr_fr') }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
