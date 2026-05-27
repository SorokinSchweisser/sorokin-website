type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size, variant }: LogoProps) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-2xl md:text-3xl font-bold tracking-wide text-white">
        SOROKIN
      </span>
      <span className="text-xs md:text-sm text-white/80 font-light tracking-wider">
        Mobiler Schweißservice
      </span>
    </div>
  );
}
