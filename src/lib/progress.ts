export interface ProgressExport {
  version: 1;
  visitedShardIds: string[];
}

export type ImportMode = 'merge' | 'replace';

export class ProgressImportError extends Error {
  constructor(public readonly code: 'invalidJson' | 'invalidFormat') {
    super(code === 'invalidJson' ? 'Le fichier importé n’est pas un JSON valide.' : 'Format de sauvegarde incompatible.');
    this.name = 'ProgressImportError';
  }
}

export function createProgressExport(visitedShardIds: ReadonlySet<string>): ProgressExport {
  return {
    version: 1,
    visitedShardIds: [...visitedShardIds].sort(),
  };
}

export function parseProgressImport(source: string, validIds: ReadonlySet<string>): Set<string> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch {
    throw new ProgressImportError('invalidJson');
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    (parsed as { version?: unknown }).version !== 1 ||
    !Array.isArray((parsed as { visitedShardIds?: unknown }).visitedShardIds) ||
    !(parsed as { visitedShardIds: unknown[] }).visitedShardIds.every((id) => typeof id === 'string')
  ) {
    throw new ProgressImportError('invalidFormat');
  }

  return new Set(
    (parsed as ProgressExport).visitedShardIds.filter((id) => validIds.has(id)),
  );
}

export function applyImportedProgress(
  current: ReadonlySet<string>,
  imported: ReadonlySet<string>,
  mode: ImportMode,
): Set<string> {
  return mode === 'replace' ? new Set(imported) : new Set([...current, ...imported]);
}
