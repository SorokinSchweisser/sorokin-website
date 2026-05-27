type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size, variant }: LogoProps) {
  const titleClass = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  return (
    <div className="flex flex-col leading-tight" aria-label="SOROKIN Mobiler Schweißservice">
      <span className={`${titleClass} font-bold tracking-wide text-white`}>
        SOROKIN
      </span>
      <span className="text-xs md:text-sm text-[#f97316] font-light tracking-wider">
        Mobiler Schweißservice
      </span>
    </div>
  );
}
