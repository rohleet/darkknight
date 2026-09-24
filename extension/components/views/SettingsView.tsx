import Switch from "../common/Switch";
import type { Theme } from "../../hooks/useTheme";

interface SettingsViewProps {
  theme: Theme;
  onToggleTheme: () => void;
  protectionOn: boolean;
  onToggleProtection: (value: boolean) => void;
  notifyOn: boolean;
  onToggleNotify: (value: boolean) => void;
}

export default function SettingsView({
  theme,
  onToggleTheme,
  protectionOn,
  onToggleProtection,
  notifyOn,
  onToggleNotify,
}: SettingsViewProps) {
  return (
    <>
      <div className="pg-settings-group">
        <div className="pg-settings-heading">Protection</div>
        <Switch
          checked={protectionOn}
          onChange={onToggleProtection}
          label="Protection enabled"
          description="Scan pages as you browse"
        />
      </div>

      <div className="pg-settings-group">
        <div className="pg-settings-heading">Notifications</div>
        <Switch checked={notifyOn} onChange={onToggleNotify} label="Warn on high-risk sites" />
      </div>

      <div className="pg-settings-group">
        <div className="pg-settings-heading">Appearance</div>
        <Switch checked={theme === "light"} onChange={onToggleTheme} label="Light theme" />
      </div>
    </>
  );
}
