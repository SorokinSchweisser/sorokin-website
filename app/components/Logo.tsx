type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  inline?: boolean;
  showSubtitle?: boolean;
};

export default function Logo({ size, variant, inline, showSubtitle = true }: LogoProps) {
  const titleClass = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  const titleColor = variant === "dark" ? "#1e3a8a" : "#ffffff"; // dark = scrolled
  const wrapperClass = inline ? "flex flex-row items-center gap-2 leading-tight" : "flex flex-col leading-tight gap-2";

  return (
    <div className={wrapperClass} aria-label="SOROKIN Mobiler Schweißservice">
      <span className={`${titleClass} font-bold tracking-widest`} style={{ color: titleColor }}>
        SOROKIN
      </span>
      {showSubtitle && (
        <span className="text-xs md:text-sm font-light tracking-wider" style={{ color: "#f97316" }}>
          Mobiler Schweißservice
        </span>
      )}
    </div>
  );
}
