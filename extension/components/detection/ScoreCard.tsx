import type { CSSProperties } from "react";
import Badge from "../common/Badge";
import type { Verdict } from "../../types/detection";

interface ScoreCardProps {
  score: number; // 0–100
  verdict: Verdict;
  description: string;
}

const VERDICT_COLOR_VAR: Record<Verdict, string> = {
  safe: "var(--pg-safe)",
  suspicious: "var(--pg-suspicious)",
  high_risk: "var(--pg-highrisk)",
  phishing: "var(--pg-phishing)",
};

export default function ScoreCard({ score, verdict, description }: ScoreCardProps) {
  const ringDeg = (Math.max(0, Math.min(100, score)) / 100) * 360;

  // --pg-ring-target is the final sweep angle; animations.css animates
  // the actual --pg-ring-deg custom property from 0deg up to this value.
  const ringStyle = {
    ["--pg-ring-target" as string]: `${ringDeg}deg`,
    ["--pg-ring-color" as string]: VERDICT_COLOR_VAR[verdict],
  } as CSSProperties;

  return (
    <div className="pg-score-card">
      <div className="pg-score-ring" style={ringStyle}>
        <span className="pg-score-num">{Math.round(score)}</span>
      </div>
      <div className="pg-score-info">
        <Badge verdict={verdict} />
        <p className="pg-score-desc">{description}</p>
      </div>
    </div>
  );
}
