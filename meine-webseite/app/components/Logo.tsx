type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  inline?: boolean;
  showSubtitle?: boolean;
};

export default function Logo({ size = "md", variant = "dark", inline, showSubtitle = true }: LogoProps) {
  const titleClass = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  const titleColor = variant === "dark" ? "#1e3a8a" : "#ffffff";
  const wrapperClass = inline ? "flex flex-row items-center gap-2 leading-tight" : "flex flex-col leading-tight gap-2";
  const dividerClass = "hidden md:inline-flex w-px h-4 bg-[#f97316] opacity-40 mx-2";
  const subtitleClass = "hidden md:inline-flex text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase";

  return (
    <div className={`logo-root ${variant === "light" ? "logo-light" : "logo-dark"}`} aria-label="SOROKIN">
      <div className={wrapperClass}>
        <span className={`${titleClass} font-bold tracking-widest`} style={{ color: titleColor }}>
          SOROKIN
        </span>
        {showSubtitle && (
          <>
            {inline && <span className={dividerClass} aria-hidden="true" />}
            <span className={subtitleClass} style={{ color: "#f97316" }}>
              Mobiler Schweißservice
            </span>
          </>
        )}
      </div>
    </div>
  );
}
