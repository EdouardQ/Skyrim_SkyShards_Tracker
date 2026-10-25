import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { shards } from './shards';

it('has a local optimized image for every shard and the full map', () => {
  const missing = shards.filter((shard) => !existsSync(resolve('public', shard.imageUrl.slice(1))));
  expect(missing.map((shard) => shard.id)).toEqual([]);
  expect(existsSync(resolve('public/map/skyrim-map.webp'))).toBe(true);
});
