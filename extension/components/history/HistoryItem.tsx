import Badge from "../common/Badge";
import type { Verdict } from "../../types/detection";

export interface HistoryEntry {
  id: string;
  domain: string;
  verdict: Verdict;
  score: number;
  timestamp: string;
}

interface HistoryItemProps {
  entry: HistoryEntry;
  onViewDetails?: (id: string) => void;
}

export default function HistoryItem({ entry, onViewDetails }: HistoryItemProps) {
  return (
    <div className="pg-history-item">
      <div className="pg-history-main">
        <span className="pg-history-domain">{entry.domain}</span>
        <Badge verdict={entry.verdict} />
      </div>
      <div className="pg-history-meta">
        <span className="pg-history-score">{entry.score}/100</span>
        <span className="pg-history-time">{entry.timestamp}</span>
      </div>
      <button
        type="button"
        className="pg-history-details-btn"
        onClick={() => onViewDetails?.(entry.id)}
      >
        Details
      </button>
    </div>
  );
}
