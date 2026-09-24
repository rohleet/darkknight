// Standalone interstitial — no shell nav here on purpose, this isn't part
// of the tabbed app flow, it's a full-page block shown before a dangerous
// site loads.

import ScoreCard from "../../components/detection/ScoreCard";
import EvidenceList from "../../components/detection/EvidenceList";
import Button from "../../components/common/Button";
import { useTheme } from "../../hooks/useTheme";
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

export default function App() {
  useTheme("dark");
  const result = MOCK_RESULT;
  const ruleEvidence = result.evidence.filter((e) => e.source === "rule");
  const modelEvidence = result.evidence.filter((e) => e.source === "model");

  return (
    <div className="pg-page pg-page-wide">
      <div className="pg-popup">
        <div className="pg-warning-banner">
          <span className="pg-warning-icon" aria-hidden="true">
            !
          </span>
          <div>
            <div className="pg-warning-title">This site looks like phishing</div>
            <div className="pg-warning-domain">{result.domain}</div>
          </div>
        </div>

        <main className="pg-main">
          <ScoreCard
            score={result.risk_score}
            verdict={result.classification}
            description="Do not enter passwords, payment information, or other sensitive data on this page."
          />
          <EvidenceList title="Rule-based signals" source="rule" items={ruleEvidence} />
          <EvidenceList title="Model signal" source="model" items={modelEvidence} />
          <div className="pg-cta-row">
            <Button variant="secondary">Proceed anyway</Button>
            <Button variant="primary" className="pg-btn--danger">
              Leave this site
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
