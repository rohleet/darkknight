import type { Verdict } from "../../types/detection";

interface BadgeProps {
  verdict: Verdict;
  children?: string;
}

const VERDICT_LABEL: Record<Verdict, string> = {
  safe: "Safe",
  suspicious: "Suspicious",
  high_risk: "High risk",
  phishing: "Phishing",
};

export default function Badge({ verdict, children }: BadgeProps) {
  return (
    <span className={`pg-badge pg-badge--${verdict}`}>
      {children ?? VERDICT_LABEL[verdict]}
    </span>
  );
}
