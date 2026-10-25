import { useEffect, useMemo, useRef, useState } from 'react';
import { shards } from './data/shards';
import { ImportDialog } from './components/ImportDialog';
import { Sidebar } from './components/Sidebar';
import { SkyMap } from './components/SkyMap';
import {
  applyImportedProgress,
  createProgressExport,
  parseProgressImport,
  ProgressImportError,
  type ImportMode,
} from './lib/progress';
import { loadCachedProgress, saveCachedProgress } from './lib/progress-cache';
import { LanguageProvider, useLanguage } from './lib/i18n';

const shardIds = new Set(shards.map((shard) => shard.id));

export function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}

function AppContent() {
  const { t } = useLanguage();
  const [visitedShardIds, setVisitedShardIds] = useState<Set<string>>(
    () => loadCachedProgress(window.localStorage, shardIds),
  );
  const [selectedShardId, setSelectedShardId] = useState<string>();
  const [search, setSearch] = useState('');
  const [collapsedRegions, setCollapsedRegions] = useState<Set<string>>(new Set());
  const [pendingImport, setPendingImport] = useState<Set<string>>();
  const [importError, setImportError] = useState<'readError' | 'invalidJson' | 'invalidFormat'>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRegions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('fr');
    const grouped = new Map<string, typeof shards>();

    shards
      .filter((shard) => !normalizedSearch || shard.name.toLocaleLowerCase('fr').includes(normalizedSearch) || shard.region.toLocaleLowerCase('fr').includes(normalizedSearch))
      .forEach((shard) => {
        grouped.set(shard.region, [...(grouped.get(shard.region) ?? []), shard]);
      });

    return [...grouped.entries()];
  }, [search]);

  const selectedShard = shards.find((shard) => shard.id === selectedShardId);

  useEffect(() => {
    saveCachedProgress(window.localStorage, visitedShardIds);
  }, [visitedShardIds]);

  function toggleVisited(shardId: string) {
    setVisitedShardIds((current) => {
      const next = new Set(current);
      next.has(shardId) ? next.delete(shardId) : next.add(shardId);
      return next;
    });
  }

  function toggleRegion(region: string) {
    setCollapsedRegions((current) => {
      const next = new Set(current);
      next.has(region) ? next.delete(region) : next.add(region);
      return next;
    });
  }

  function exportProgress() {
    const payload = JSON.stringify(createProgressExport(visitedShardIds), null, 2);
    const href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'skyrim-skyshards-progress.json';
    anchor.click();
    URL.revokeObjectURL(href);
  }

  async function readImport(file: File | undefined) {
    if (!file) return;

    try {
      setImportError(undefined);
      setPendingImport(parseProgressImport(await file.text(), shardIds));
    } catch (error) {
      setImportError(error instanceof ProgressImportError ? error.code : 'readError');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function applyImport(mode: ImportMode) {
    if (!pendingImport) return;
    setVisitedShardIds((current) => applyImportedProgress(current, pendingImport, mode));
    setPendingImport(undefined);
  }

  function resetProgress() {
    if (visitedShardIds.size && window.confirm(t.resetConfirm)) {
      setVisitedShardIds(new Set());
    }
  }

  return (
    <main className="app-layout">
      <Sidebar
        collapsedRegions={collapsedRegions}
        onExport={exportProgress}
        onImport={() => fileInputRef.current?.click()}
        onReset={resetProgress}
        onSearchChange={setSearch}
        onSelect={setSelectedShardId}
        onToggleRegion={toggleRegion}
        onToggleVisited={toggleVisited}
        regions={filteredRegions}
        search={search}
        totalShardCount={shards.length}
        visitedShardIds={visitedShardIds}
      />
      <SkyMap
        selectedShard={selectedShard}
        shards={shards}
        visitedShardIds={visitedShardIds}
        onSelect={setSelectedShardId}
        onToggleVisited={toggleVisited}
      />
      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label={t.importFile}
        onChange={(event) => void readImport(event.target.files?.[0])}
      />
      {importError && <p className="import-error" role="alert">{t[importError]}</p>}
      {pendingImport && <ImportDialog importedCount={pendingImport.size} onCancel={() => setPendingImport(undefined)} onConfirm={applyImport} />}
    </main>
  );
}
