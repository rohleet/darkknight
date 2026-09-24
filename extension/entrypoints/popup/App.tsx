import { browser } from "wxt/browser";
import PhishGuardApp from "../../components/PhishGuardApp";

function openExpanded() {
  // Reuses dashboard.html purely as WXT's required separate entrypoint
  // for a full-tab window — it renders the exact same PhishGuardApp,
  // not a different implementation.
  const url = browser.runtime.getURL("/dashboard.html");
  browser.tabs.create({ url });
}

export default function App() {
  return <PhishGuardApp onExpand={openExpanded} />;
}
