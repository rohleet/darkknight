import HistoryItem, { type HistoryEntry } from "./HistoryItem";

interface HistoryListProps {
  entries: HistoryEntry[];
  onViewDetails?: (id: string) => void;
}

export default function HistoryList({ entries, onViewDetails }: HistoryListProps) {
  if (entries.length === 0) {
    return <p className="pg-history-empty">No detections yet.</p>;
  }

  return (
    <div className="pg-history-list">
      {entries.map((entry) => (
        <HistoryItem key={entry.id} entry={entry} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
