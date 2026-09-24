// The complete Dashboard content — same as before, just no longer wrapped
// in its own AppShell/page. PhishGuardApp provides the shell now.

import SiteRow from "../detection/SiteRow";
import ScoreCard from "../detection/ScoreCard";
import EvidenceList from "../detection/EvidenceList";
import type { DetectionResult } from "../../types/detection";

const MOCK_RESULT: DetectionResult = {
  domain: "fake-bank-secure.com",
  classification: "phishing",
  risk_score: 94,
  confidence: 0.91,
  analyzed_at: "Analyzed just now",
  engine_version: "0.1",
  evidence: [
    {
      id: "r1",
      source: "rule",
      message: 'Domain mimics "securebank.com" using a lookalike spelling',
    },
    {
      id: "r2",
      source: "rule",
      message: "Login form submits to a different domain than the page URL",
    },
    {
      id: "m1",
      source: "model",
      message: "Page structure closely resembles known credential-harvesting templates",
      confidence: 0.91,
    },
  ],
};

export default function DashboardView() {
  const result = MOCK_RESULT;
  const ruleEvidence = result.evidence.filter((e) => e.source === "rule");
  const modelEvidence = result.evidence.filter((e) => e.source === "model");

  return (
    <>
      <SiteRow domain={result.domain} analyzedAt={result.analyzed_at} onRescan={() => {}} />
      <ScoreCard
        score={result.risk_score}
        verdict={result.classification}
        description="This site has characteristics strongly associated with credential-theft pages. Avoid entering passwords or payment details."
      />
      <EvidenceList title="Rule-based signals" source="rule" items={ruleEvidence} />
      <EvidenceList title="Model signal" source="model" items={modelEvidence} />
    </>
  );
}
