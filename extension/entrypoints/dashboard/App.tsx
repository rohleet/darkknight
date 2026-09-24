// This is the "expanded window" — same PhishGuardApp as the popup, just
// given more room via the pg-page-wide wrapper. No onExpand prop here,
// since there's nothing further to expand into.

import PhishGuardApp from "../../components/PhishGuardApp";

export default function App() {
  return (
    <div className="pg-page pg-page-wide">
      <PhishGuardApp />
    </div>
  );
}
