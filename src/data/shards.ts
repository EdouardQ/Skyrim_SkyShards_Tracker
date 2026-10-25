import sourceSnapshot from './source-snapshot.json';

export interface SourceShard {
  nom: string;
  region: string;
  x: string | number;
  y: string | number;
  image: string;
  lien: string;
}

export interface Shard {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  imageUrl: string;
  infoUrl: string;
}

export function createShardId(region: string, name: string): string {
  return `${region}-${name}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function normalizeShard(source: SourceShard): Shard {
  const id = createShardId(source.region, source.nom);

  return {
    id,
    name: source.nom,
    region: source.region,
    x: Number(source.x),
    y: Number(source.y),
    imageUrl: `/shards/${id}.webp`,
    infoUrl: source.lien,
  };
}

export const shards = (sourceSnapshot as SourceShard[]).map(normalizeShard);
