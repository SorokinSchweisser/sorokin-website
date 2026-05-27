type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  return (
    <div className={`logo-root logo-${size} ${variant === "light" ? "logo-light" : "logo-dark"}`}>
      <div className="logo-brand" aria-label="SOROKIN Mobiler Schweißservice">
        <span className="logo-brand-title">
          <span className="logo-title-white">SOR</span>
          <span className="logo-title-orange">OKIN</span>
          <span className="logo-title-dot" aria-hidden="true">.</span>
        </span>
        <span className="logo-brand-subtitle">Mobiler Schweißservice</span>
      </div>
    </div>
  );
}