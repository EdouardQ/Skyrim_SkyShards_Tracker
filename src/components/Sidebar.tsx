import type { Shard } from '../data/shards';
import { useLanguage } from '../lib/i18n';

interface SidebarProps {
  collapsedRegions: ReadonlySet<string>;
  onSelect: (shardId: string) => void;
  onToggleRegion: (region: string) => void;
  onToggleVisited: (shardId: string) => void;
  onSearchChange: (search: string) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  regions: Array<[string, Shard[]]>;
  search: string;
  totalShardCount: number;
  visitedShardIds: ReadonlySet<string>;
}

export function Sidebar({
  collapsedRegions,
  onExport,
  onImport,
  onReset,
  onSearchChange,
  onSelect,
  onToggleRegion,
  onToggleVisited,
  regions,
  search,
  totalShardCount,
  visitedShardIds,
}: SidebarProps) {
  const { locale, t, toggleLanguage } = useLanguage();
  const resultCount = regions.flatMap(([, shards]) => shards).length;

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <p>{t.modded}</p>
        <h1>Skyshards</h1>
        <button type="button" className="language-toggle" onClick={toggleLanguage}
          aria-label={t.switchLanguage} title={t.switchLanguage}>
          {locale === 'fr_fr' ? 'FR → EN' : 'EN → FR'}
        </button>
      </div>

      <label className="search-field">
        <span className="sr-only">{t.search}</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t.searchPlaceholder}
        />
      </label>

      <div className="progress-summary">
        <span>{t.progress}</span>
        <strong>{visitedShardIds.size} <small>/ {totalShardCount}</small></strong>
      </div>

      <div className="sidebar-actions">
        <button type="button" onClick={onExport}>{t.export}</button>
        <button type="button" onClick={onImport}>{t.import}</button>
        <button type="button" className="reset-button" onClick={onReset}>{t.reset}</button>
      </div>

      <div className="region-list" aria-label={t.regions}>
        {regions.map(([region, shards]) => {
          const isCollapsed = collapsedRegions.has(region);
          const visitedInRegion = shards.filter((shard) => visitedShardIds.has(shard.id)).length;
          return (
            <section className="region-section" key={region}>
              <button
                className="region-title"
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => onToggleRegion(region)}
              >
                <span>{region}</span>
                <small>{visitedInRegion}/{shards.length} {isCollapsed ? '▸' : '▾'}</small>
              </button>
              {!isCollapsed && (
                <ul>
                  {shards.map((shard) => (
                    <li key={shard.id} className={`shard-list-item${visitedShardIds.has(shard.id) ? ' visited' : ''}`}>
                      <button type="button" className="shard-row" onClick={() => onSelect(shard.id)}>
                        <span>{shard.name}</span>
                      </button>
                      <input
                        className="shard-check"
                        type="checkbox"
                        checked={visitedShardIds.has(shard.id)}
                        aria-label={t.markLabel(shard.name)}
                        onChange={() => onToggleVisited(shard.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
        {resultCount === 0 && <p className="empty-state">{t.empty}</p>}
      </div>
    </aside>
  );
}
