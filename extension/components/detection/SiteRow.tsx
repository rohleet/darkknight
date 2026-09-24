interface SiteRowProps {
  domain: string;
  analyzedAt: string;
  onRescan?: () => void;
}

export default function SiteRow({ domain, analyzedAt, onRescan }: SiteRowProps) {
  const initials = domain.slice(0, 2).toUpperCase();

  return (
    <div className="pg-site-row">
      <div className="pg-site-id">
        <div className="pg-favicon" aria-hidden="true">
          {initials}
        </div>
        <div>
          <div className="pg-site-domain">{domain}</div>
          <div className="pg-site-meta">{analyzedAt}</div>
        </div>
      </div>
      {onRescan && (
        <button type="button" className="pg-rescan-btn" onClick={onRescan}>
          Rescan
        </button>
      )}
    </div>
  );
}
