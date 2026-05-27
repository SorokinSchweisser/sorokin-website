type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const titleClass = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  return (
    <div className={`logo-root ${variant === "light" ? "logo-light" : "logo-dark"}`} aria-label="SOROKIN Mobiler Schweißservice">
      <span className={`${titleClass} font-bold tracking-wide text-white`}>SOROKIN</span>
      <span className="text-xs md:text-sm text-[#f97316] font-light tracking-wider">Mobiler Schweißservice</span>
    </div>
  );
}
