import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Shard } from '../data/shards';
import { SkyMap } from './SkyMap';

vi.mock('react-leaflet', () => ({
  CircleMarker: () => null,
  ImageOverlay: () => null,
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useMap: () => ({ flyTo: vi.fn(), getZoom: () => -1 }),
}));

describe('SkyMap details card', () => {
  const shard: Shard = {
    id: 'eastmarch-abandoned-grotto',
    name: 'Abandoned Grotto',
    region: 'Eastmarch',
    x: 4513,
    y: 1761,
    imageUrl: 'https://example.test/shard.jpg',
    infoUrl: 'https://example.test/shard',
  };

  it('gives the detail-card checkbox an explicit accessible label', () => {
    render(
      <SkyMap
        selectedShard={shard}
        shards={[shard]}
        visitedShardIds={new Set()}
        onSelect={vi.fn()}
        onToggleVisited={vi.fn()}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Marquer Abandoned Grotto comme trouvée' })).toBeInTheDocument();
  });
});
