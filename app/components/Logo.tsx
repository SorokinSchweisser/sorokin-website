type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size, variant }: LogoProps) {
  return (
    <a href="#" className="flex items-center">
      <img
        src="/logo.png"
        alt="SOROKIN Mobiler Schweißservice"
        className="h-12 md:h-16 w-auto object-contain"
      />
    </a>
  );
}
