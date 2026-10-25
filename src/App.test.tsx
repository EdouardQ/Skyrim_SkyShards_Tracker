import type { ReactNode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('react-leaflet', () => ({
  CircleMarker: () => null,
  ImageOverlay: () => null,
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useMap: () => ({ flyTo: vi.fn(), getZoom: () => -1 }),
}));

describe('App language switch', () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  it('switches both ways, preserves search and progress, and restores the saved language', () => {
    const view = render(<App />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Abandoned Grotto' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Marquer Abandoned Grotto comme trouvée' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));

    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('Abandoned Grotto');
    expect(screen.getByRole('checkbox', { name: 'Mark Abandoned Grotto as found' })).toBeChecked();
    expect(document.documentElement.lang).toBe('en-US');
    expect(localStorage.getItem('skyrim-skyshards-locale')).toBe('en_us');

    view.unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Passer en français' }));
    expect(screen.getByRole('button', { name: 'Exporter' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr-FR');
    expect(localStorage.getItem('skyrim-skyshards-locale')).toBe('fr_fr');
  });

  it('translates an already displayed import error when the language changes', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Importer un fichier de progression'), {
      target: { files: [{ text: async () => '{invalid' }] },
    });
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Le fichier importé n’est pas un JSON valide.'));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('alert')).toHaveTextContent('The imported file is not valid JSON.');
  });

  it('falls back to French for an unsupported saved locale', () => {
    localStorage.setItem('skyrim-skyshards-locale', 'other');
    render(<App />);
    expect(screen.getByRole('button', { name: 'Switch to English' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr-FR');
  });
});
