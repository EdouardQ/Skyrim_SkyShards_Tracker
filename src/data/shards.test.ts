import { describe, expect, it } from 'vitest';
import { createShardId, normalizeShard, shards } from './shards';

describe('shard data normalization', () => {
  it('creates a stable identifier from a region and canonical location name', () => {
    expect(createShardId('The Pale', 'Mammoth Graveyard')).toBe('the-pale-mammoth-graveyard');
  });

  it('normalizes the reference fields into a typed map marker', () => {
    expect(normalizeShard({
      nom: 'Ansilvund',
      region: 'Eastmarch',
      x: '6066.00',
      y: '1738.00',
      image: 'https://i.imgur.com/tJMa5VO.jpeg',
      lien: 'https://imgur.com/tJMa5VO',
    })).toEqual({
      id: 'eastmarch-ansilvund',
      name: 'Ansilvund',
      region: 'Eastmarch',
      x: 6066,
      y: 1738,
      imageUrl: '/shards/eastmarch-ansilvund.webp',
      infoUrl: 'https://imgur.com/tJMa5VO',
    });
  });

  it('exposes a complete snapshot with unique stable identifiers', () => {
    expect(shards.length).toBeGreaterThan(100);
    expect(new Set(shards.map((shard) => shard.id)).size).toBe(shards.length);
    expect(shards.every((shard) => Number.isFinite(shard.x) && Number.isFinite(shard.y))).toBe(true);
  });

});
