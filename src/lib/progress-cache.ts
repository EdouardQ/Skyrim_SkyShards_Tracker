import { createProgressExport, parseProgressImport } from './progress';

export const progressCacheKey = 'skyrim-skyshards-progress-v1';

export function loadCachedProgress(storage: Storage, validIds: ReadonlySet<string>): Set<string> {
  const cached = storage.getItem(progressCacheKey);
  if (!cached) return new Set();

  try {
    return parseProgressImport(cached, validIds);
  } catch {
    return new Set();
  }
}

export function saveCachedProgress(storage: Storage, visitedShardIds: ReadonlySet<string>): void {
  storage.setItem(progressCacheKey, JSON.stringify(createProgressExport(visitedShardIds)));
}
