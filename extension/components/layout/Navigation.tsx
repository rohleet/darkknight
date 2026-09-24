export interface NavTab {
  key: string;
  label: string;
}

interface NavigationProps {
  tabs: NavTab[];
  active: string;
  onNavigate: (key: string) => void;
}

export default function Navigation({ tabs, active, onNavigate }: NavigationProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === active)
  );

  return (
    <div className="pg-nav-wrap">
      <nav
        className="pg-nav"
        style={{ ["--pg-nav-index" as string]: activeIndex } as React.CSSProperties}
      >
        <span className="pg-nav-pill" />
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`pg-nav-link ${tab.key === active ? "pg-nav-link--active" : ""}`}
            onClick={() => onNavigate(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
