import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ShardImage } from './ShardImage';

afterEach(cleanup);

describe('ShardImage', () => {
  it('shows the next image after a previous image failed to load', () => {
    const view = render(<ShardImage src="/missing.webp" alt="First shard" />);
    fireEvent.error(screen.getByRole('img', { name: 'First shard' }));
    expect(screen.getByRole('img', { name: 'Illustration indisponible pour First shard' })).toBeInTheDocument();

    view.rerender(<ShardImage src="/next.webp" alt="Next shard" />);
    expect(screen.getByRole('img', { name: 'Next shard' })).toHaveAttribute('src', '/next.webp');
  });
});
