import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Shard } from '../data/shards';
import { Sidebar } from './Sidebar';

describe('Sidebar shard rows', () => {
  const shard: Shard = {
    id: 'eastmarch-abandoned-grotto',
    name: 'Abandoned Grotto',
    region: 'Eastmarch',
    x: 4513,
    y: 1761,
    imageUrl: 'https://example.test/shard.jpg',
    infoUrl: 'https://example.test/shard',
  };

  it('keeps the selection button and progress checkbox as separate interactive controls', () => {
    render(
      <Sidebar
        collapsedRegions={new Set()}
        onExport={vi.fn()}
        onImport={vi.fn()}
        onReset={vi.fn()}
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        onToggleRegion={vi.fn()}
        onToggleVisited={vi.fn()}
        regions={[[shard.region, [shard]]]}
        search=""
        totalShardCount={1}
        visitedShardIds={new Set()}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Marquer Abandoned Grotto comme trouvée' });
    const selection = screen.getByRole('button', { name: 'Abandoned Grotto' });
    expect(selection).not.toContainElement(checkbox);
  });
});
