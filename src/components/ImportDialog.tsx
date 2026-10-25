import type { ImportMode } from '../lib/progress';
import { useLanguage } from '../lib/i18n';

interface ImportDialogProps {
  importedCount: number;
  onCancel: () => void;
  onConfirm: (mode: ImportMode) => void;
}

export function ImportDialog({ importedCount, onCancel, onConfirm }: ImportDialogProps) {
  const { t } = useLanguage();
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="import-dialog" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <p className="eyebrow">{t.importTitle}</p>
        <h2 id="import-title">{t.importedCount(importedCount)}</h2>
        <p>{t.importDescription}</p>
        <div className="dialog-actions">
          <button type="button" onClick={() => onConfirm('replace')}>{t.replace}</button>
          <button type="button" className="primary-button" onClick={() => onConfirm('merge')}>{t.merge}</button>
        </div>
        <button type="button" className="text-button" onClick={onCancel}>{t.cancel}</button>
      </section>
    </div>
  );
}
