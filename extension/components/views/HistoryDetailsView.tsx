import SiteRow from "../detection/SiteRow";
import ScoreCard from "../detection/ScoreCard";
import EvidenceList from "../detection/EvidenceList";
import type { DetectionResult } from "../../types/detection";

// Keyed by the same ids HistoryView's MOCK_HISTORY uses — swap for a real
// lookup (by id, against the actual history store) once that exists.
const MOCK_DETAILS: Record<string, DetectionResult> = {
  "1": {
    domain: "example.com",
    classification: "safe",
    risk_score: 3,
    confidence: 0.98,
    analyzed_at: "Today, 9:12 AM",
    engine_version: "0.1",
    evidence: [],
  },
  "2": {
    domain: "suspicious.com",
    classification: "suspicious",
    risk_score: 61,
    confidence: 0.84,
    analyzed_at: "Yesterday, 4:30 PM",
    engine_version: "0.1",
    evidence: [
      { id: "r1", source: "rule", message: "Suspicious URL structure with nested subdomains" },
      { id: "r2", source: "rule", message: "Domain was first observed less than 30 days ago" },
      {
        id: "m1",
        source: "model",
        message: "Page redirects through an unusual number of hops before loading",
        confidence: 0.84,
      },
    ],
  },
  "3": {
    domain: "fake-bank.com",
    classification: "phishing",
    risk_score: 94,
    confidence: 0.91,
    analyzed_at: "Sep 20, 11:02 AM",
    engine_version: "0.1",
    evidence: [
      { id: "r1", source: "rule", message: 'Domain mimics "securebank.com" using a lookalike spelling' },
      { id: "r2", source: "rule", message: "Login form submits to a different domain than the page URL" },
      {
        id: "m1",
        source: "model",
        message: "Page structure closely resembles known credential-harvesting templates",
        confidence: 0.91,
      },
    ],
  },
};

interface HistoryDetailsViewProps {
  entryId: string | null;
  onBack: () => void;
}

export default function HistoryDetailsView({ entryId, onBack }: HistoryDetailsViewProps) {
  const result = (entryId && MOCK_DETAILS[entryId]) || MOCK_DETAILS["2"];
  const ruleEvidence = result.evidence.filter((e) => e.source === "rule");
  const modelEvidence = result.evidence.filter((e) => e.source === "model");

  return (
    <>
      <button type="button" className="pg-back-btn" onClick={onBack}>
        ← Back to History
      </button>
      <SiteRow domain={result.domain} analyzedAt={result.analyzed_at} />
      <ScoreCard
        score={result.risk_score}
        verdict={result.classification}
        description="This is the saved detection record for this site."
      />
      <EvidenceList title="Rule-based signals" source="rule" items={ruleEvidence} />
      <EvidenceList title="Model signal" source="model" items={modelEvidence} />
      <div className="pg-detail-meta">
        <div className="pg-detail-meta-row">
          <span>Confidence</span>
          <span>{result.confidence.toFixed(2)}</span>
        </div>
        <div className="pg-detail-meta-row">
          <span>Engine version</span>
          <span>{result.engine_version}</span>
        </div>
      </div>
    </>
  );
}
