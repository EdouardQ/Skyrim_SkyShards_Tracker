import { useEffect } from 'react';
import L from 'leaflet';
import { CircleMarker, ImageOverlay, MapContainer, useMap } from 'react-leaflet';
import type { Shard } from '../data/shards';
import { ShardImage } from './ShardImage';
import { useLanguage } from '../lib/i18n';

const mapBounds: L.LatLngBoundsExpression = [[0, 0], [4878, 6869]];

const regionColors: Record<string, string> = {
  Eastmarch: '#ed4d66',
  Falkreath: '#5fbd71',
  Haafingar: '#e7bc4b',
  Hjaalmarch: '#dd8248',
  'The Pale': '#a66ccf',
  'The Reach': '#54cbd0',
  'The Rift': '#dc6cc6',
  Whiterun: '#668fe1',
  Winterhold: '#72c7e1',
};

interface SelectedShardControllerProps {
  shard: Shard | undefined;
}

function SelectedShardController({ shard }: SelectedShardControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!shard) return;
    map.flyTo([shard.y, shard.x], map.getZoom(), { duration: 0.65 });
  }, [map, shard?.id]);

  return null;
}

interface SkyMapProps {
  selectedShard: Shard | undefined;
  shards: Shard[];
  visitedShardIds: ReadonlySet<string>;
  onSelect: (shardId: string) => void;
  onToggleVisited: (shardId: string) => void;
}

export function SkyMap({ selectedShard, shards, visitedShardIds, onSelect, onToggleVisited }: SkyMapProps) {
  const { t } = useLanguage();
  return (
    <section className="map-shell" aria-label={t.map}>
      <MapContainer
        className="map"
        crs={L.CRS.Simple}
        bounds={mapBounds}
        maxBounds={mapBounds}
        minZoom={-3}
        maxZoom={1}
        zoomSnap={0.25}
        scrollWheelZoom
        attributionControl={false}
      >
        <ImageOverlay url="/map/skyrim-map.webp" bounds={mapBounds} />
        <SelectedShardController shard={selectedShard} />
        {shards.map((shard) => {
          const visited = visitedShardIds.has(shard.id);
          const active = selectedShard?.id === shard.id;
          return (
            <CircleMarker
              key={shard.id}
              center={[shard.y, shard.x]}
              radius={active ? 10 : 7}
              pathOptions={{
                color: active ? '#fff5d6' : '#32231b',
                fillColor: regionColors[shard.region] ?? '#b7a892',
                fillOpacity: visited ? 0.24 : 0.95,
                weight: active ? 3 : 1.5,
              }}
              eventHandlers={{ click: () => onSelect(shard.id) }}
            />
          );
        })}
      </MapContainer>

      {selectedShard && (
        <article className="shard-card" aria-live="polite">
          <div className="shard-card-header">
            <div>
              <p className="eyebrow">{selectedShard.region}</p>
              <h2>{selectedShard.name}</h2>
            </div>
            <button type="button" className="icon-button" onClick={() => onSelect('')} aria-label={t.close}>×</button>
          </div>
          <ShardImage src={selectedShard.imageUrl} alt={selectedShard.name} />
          <div className="shard-card-actions">
            <label className="visit-toggle">
              <input
                type="checkbox"
                checked={visitedShardIds.has(selectedShard.id)}
                aria-label={t.markLabel(selectedShard.name)}
                onChange={() => onToggleVisited(selectedShard.id)}
              />
              <span>{visitedShardIds.has(selectedShard.id) ? t.found : t.markFound}</span>
            </label>
            <a href={selectedShard.infoUrl} target="_blank" rel="noreferrer">{t.source}</a>
          </div>
        </article>
      )}
    </section>
  );
}
