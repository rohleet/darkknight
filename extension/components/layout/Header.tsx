interface HeaderProps {
  isProtected?: boolean;
  /** Only passed in the popup — omit it in the expanded window so there's
   *  no "expand the expanded view" button. */
  onExpand?: () => void;
}

export default function Header({ isProtected = true, onExpand }: HeaderProps) {
  return (
    <header className="pg-header">
      <div className="pg-brand">
        <div className="pg-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L4 5.5V11C4 16.2 7.4 20.7 12 22C16.6 20.7 20 16.2 20 11V5.5L12 2Z"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 11.7L11 13.7L15 9.5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="pg-brand-name">Dark Knight</span>
      </div>

      <div className="pg-header-actions">
        <div className={`pg-status-chip ${isProtected ? "" : "pg-status-chip--off"}`}>
          <span className="pg-status-dot" />
          {isProtected ? "Protected" : "Paused"}
        </div>

        {onExpand && (
          <button
            type="button"
            className="pg-expand-btn"
            onClick={onExpand}
            aria-label="Expand Dark Knight into a window"
            title="Expand"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 4H4V9M15 20H20V15M20 4L13 11M4 20L11 13"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
