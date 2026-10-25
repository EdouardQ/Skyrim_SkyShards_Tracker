import { useState } from 'react';
import { useLanguage } from '../lib/i18n';

interface ShardImageProps {
  alt: string;
  src: string;
}

export function ShardImage({ alt, src }: ShardImageProps) {
  const { t } = useLanguage();
  const [failedSrc, setFailedSrc] = useState<string>();

  if (failedSrc === src) {
    return <div className="image-fallback" role="img" aria-label={t.imageLabel(alt)}>{t.imageUnavailable}</div>;
  }

  return <img className="shard-photo" src={src} alt={alt} decoding="async" onError={() => setFailedSrc(src)} />;
}
