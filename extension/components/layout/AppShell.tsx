import type { ReactNode } from "react";
import Header from "./Header";
import Navigation, { type NavTab } from "./Navigation";

interface AppShellProps {
  children: ReactNode;
  navTabs: NavTab[];
  activeTab: string;
  onNavigate: (key: string) => void;
  isProtected?: boolean;
  onExpand?: () => void;
}

// Shared shell for the single PhishGuard app: Header + segmented Navigation
// + a rounded container around whichever view is currently active.
export default function AppShell({
  children,
  navTabs,
  activeTab,
  onNavigate,
  isProtected,
  onExpand,
}: AppShellProps) {
  return (
    <div className="pg-popup">
      <Header isProtected={isProtected} onExpand={onExpand} />
      <Navigation tabs={navTabs} active={activeTab} onNavigate={onNavigate} />
      <main className="pg-main">{children}</main>
    </div>
  );
}
