type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const titleClass = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  const titleColor = variant === "dark" ? "#1e3a8a" : "#ffffff";
  return (
    <div className={`logo-root ${variant === "light" ? "logo-light" : "logo-dark"}`} aria-label="SOROKIN Mobiler Schweißservice">
      <div className="flex flex-col leading-tight gap-2">
        <span className={`${titleClass} font-bold tracking-widest`} style={{ color: titleColor }}>
          SOROKIN
        </span>
        <span className="text-xs md:text-sm font-light tracking-wider" style={{ color: "#f97316" }}>
          Mobiler Schweißservice
        </span>
      </div>
    </div>
  );
}
