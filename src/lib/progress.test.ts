import { describe, expect, it } from 'vitest';
import {
  applyImportedProgress,
  createProgressExport,
  parseProgressImport,
} from './progress';

describe('progress import and export', () => {
  const validIds = new Set(['eastmarch-abandoned-grotto', 'eastmarch-ansilvund']);

  it('exports a versioned, sorted snapshot of visited shards', () => {
    expect(createProgressExport(new Set(['eastmarch-ansilvund', 'eastmarch-abandoned-grotto']))).toEqual({
      version: 1,
      visitedShardIds: ['eastmarch-abandoned-grotto', 'eastmarch-ansilvund'],
    });
  });

  it('parses a valid snapshot and ignores shard identifiers absent from this map', () => {
    const imported = parseProgressImport(
      JSON.stringify({ version: 1, visitedShardIds: ['eastmarch-ansilvund', 'removed-shard'] }),
      validIds,
    );

    expect(imported).toEqual(new Set(['eastmarch-ansilvund']));
  });

  it('rejects an incompatible snapshot without producing a partial result', () => {
    expect(() => parseProgressImport('{"version":2,"visitedShardIds":[]}', validIds)).toThrow(
      'Format de sauvegarde incompatible.',
    );
  });

  it('merges or replaces the active progression according to the selected import mode', () => {
    const imported = new Set(['eastmarch-ansilvund']);

    expect(applyImportedProgress(new Set(['eastmarch-abandoned-grotto']), imported, 'merge')).toEqual(
      new Set(['eastmarch-abandoned-grotto', 'eastmarch-ansilvund']),
    );
    expect(applyImportedProgress(new Set(['eastmarch-abandoned-grotto']), imported, 'replace')).toEqual(
      new Set(['eastmarch-ansilvund']),
    );
  });
});
