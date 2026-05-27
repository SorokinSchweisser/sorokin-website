type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  return (
    <div className={`logo-root logo-${size} ${variant === "light" ? "logo-light" : "logo-dark"}`}>
      <span className="logo-accent" aria-hidden="true" />
      <div className="logo-brand" aria-label="SOROKIN Mobiler Schweißservice">
        <span className="logo-brand-title">SOROKIN</span>
        <span className="logo-brand-subtitle">Mobiler Schweißservice</span>
      </div>
    </div>
  );
}