// The single PhishGuard application. One component, one piece of view
// state — rendered inside a small popup or a wider expanded window, but
// it's the exact same component either way. Nothing here opens a
// separate .html page during normal use.

import { useState } from "react";
import AppShell from "./layout/AppShell";
import { NAV_TABS } from "./layout/navTabs";
import DashboardView from "./views/DashboardView";
import HistoryView from "./views/HistoryView";
import HistoryDetailsView from "./views/HistoryDetailsView";
import SettingsView from "./views/SettingsView";
import { useTheme } from "../hooks/useTheme";

type ViewKey = "dashboard" | "history" | "history-details" | "settings";

interface PhishGuardAppProps {
  /** Only passed by the popup entrypoint — renders an Expand button in
   *  the header that opens the same app in a larger window. */
  onExpand?: () => void;
}

export default function PhishGuardApp({ onExpand }: PhishGuardAppProps) {
  const { theme, toggleTheme } = useTheme("dark");
  const [view, setView] = useState<ViewKey>("dashboard");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [protectionOn, setProtectionOn] = useState(true);
  const [notifyOn, setNotifyOn] = useState(true);

  // History Details isn't its own nav tab — it's a drill-down under
  // History, so the History tab stays highlighted while viewing it.
  const activeTab = view === "history-details" ? "history" : view;

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    setView("history-details");
  };

  return (
    <AppShell
      navTabs={NAV_TABS}
      activeTab={activeTab}
      onNavigate={(key) => setView(key as ViewKey)}
      isProtected={protectionOn}
      onExpand={onExpand}
    >
      <div key={view} className="pg-view-fade">
        {view === "dashboard" && <DashboardView />}
        {view === "history" && <HistoryView onSelectEntry={handleSelectEntry} />}
        {view === "history-details" && (
          <HistoryDetailsView entryId={selectedEntryId} onBack={() => setView("history")} />
        )}
        {view === "settings" && (
          <SettingsView
            theme={theme}
            onToggleTheme={toggleTheme}
            protectionOn={protectionOn}
            onToggleProtection={setProtectionOn}
            notifyOn={notifyOn}
            onToggleNotify={setNotifyOn}
          />
        )}
      </div>
    </AppShell>
  );
}
