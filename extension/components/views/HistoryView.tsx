import HistoryList from "../history/HistoryList";
import type { HistoryEntry } from "../history/HistoryItem";

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "1", domain: "example.com", verdict: "safe", score: 3, timestamp: "Today" },
  { id: "2", domain: "suspicious.com", verdict: "suspicious", score: 61, timestamp: "Yesterday" },
  { id: "3", domain: "fake-bank.com", verdict: "phishing", score: 94, timestamp: "Sep 20" },
];

interface HistoryViewProps {
  onSelectEntry: (id: string) => void;
}

export default function HistoryView({ onSelectEntry }: HistoryViewProps) {
  return (
    <>
      <div className="pg-history-toolbar">
        <input type="text" className="pg-search-input" placeholder="Search websites..." />
        <button type="button" className="pg-filter-btn">
          Filter
        </button>
      </div>
      <HistoryList entries={MOCK_HISTORY} onViewDetails={onSelectEntry} />
    </>
  );
}
