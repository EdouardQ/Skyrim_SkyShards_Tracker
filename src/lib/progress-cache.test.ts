import { beforeEach, describe, expect, it } from 'vitest';
import { loadCachedProgress, saveCachedProgress } from './progress-cache';

describe('progress cache', () => {
  const validIds = new Set(['eastmarch-abandoned-grotto', 'eastmarch-ansilvund']);

  beforeEach(() => localStorage.clear());

  it('restores visited shards after a new app session', () => {
    saveCachedProgress(localStorage, new Set(['eastmarch-ansilvund']));

    expect(loadCachedProgress(localStorage, validIds)).toEqual(new Set(['eastmarch-ansilvund']));
  });

  it('recovers with an empty progression when the cache is malformed', () => {
    localStorage.setItem('skyrim-skyshards-progress-v1', '{not-json');

    expect(loadCachedProgress(localStorage, validIds)).toEqual(new Set());
  });
});
