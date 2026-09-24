import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return <button className={`pg-btn pg-btn--${variant} ${className}`} {...rest} />;
}
