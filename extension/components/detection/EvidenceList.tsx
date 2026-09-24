import type { EvidenceItem, EvidenceSource } from "../../types/detection";

interface EvidenceListProps {
  title: string;
  source: EvidenceSource;
  items: EvidenceItem[];
}

export default function EvidenceList({ title, source, items }: EvidenceListProps) {
  if (items.length === 0) return null;

  return (
    <div className="pg-evidence-group">
      <div className="pg-evidence-label">
        <span>{title}</span>
        <span className="pg-evidence-line" />
      </div>
      {items.map((item) => (
        <div key={item.id} className={`pg-evidence-item pg-evidence-item--${source}`}>
          <span className="pg-evidence-icon" aria-hidden="true" />
          <div className="pg-evidence-text">
            {item.message}
            {item.confidence !== undefined && (
              <span className="pg-evidence-conf">
                Confidence: {item.confidence.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
