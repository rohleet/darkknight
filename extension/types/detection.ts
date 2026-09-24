// Shared shape for a single-site detection result.
// The UI only ever consumes this — it doesn't know whether a signal
// came from the rule engine or the ML classifier beyond `source`.

export type Verdict = "safe" | "suspicious" | "high_risk" | "phishing";

export type EvidenceSource = "rule" | "model";

export interface EvidenceItem {
  id: string;
  source: EvidenceSource;
  message: string;
  /** 0–1, only present for model-sourced evidence */
  confidence?: number;
}

export interface DetectionResult {
  domain: string;
  classification: Verdict;
  /** 0–100, matches the SAFE/SUSPICIOUS/HIGH RISK/PHISHING buckets */
  risk_score: number;
  /** 0–1, overall model confidence */
  confidence: number;
  evidence: EvidenceItem[];
  analyzed_at: string;
  engine_version: string;
}
