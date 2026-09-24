interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export default function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <label className="pg-switch-row">
      <span className="pg-switch-text">
        <span className="pg-switch-label">{label}</span>
        {description && <span className="pg-switch-desc">{description}</span>}
      </span>
      <span className={`pg-switch ${checked ? "pg-switch--on" : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="pg-switch-input"
        />
        <span className="pg-switch-thumb" />
      </span>
    </label>
  );
}
