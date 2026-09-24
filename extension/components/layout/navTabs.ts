import type { NavTab } from "./Navigation";

// The 3 primary views inside the single PhishGuard app. History Details
// isn't a tab — it's a drill-down reached by clicking a History row, with
// its own Back control.
export const NAV_TABS: NavTab[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "history", label: "History" },
  { key: "settings", label: "Settings" },
];
