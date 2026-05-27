import Image from "next/image";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

const logoDimensions = {
  sm: { width: 72, height: 48 },
  md: { width: 84, height: 56 },
  lg: { width: 102, height: 68 },
};

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const dimensions = logoDimensions[size] ?? logoDimensions.md;

  return (
    <div className={`logo-root ${variant === "light" ? "logo-light" : "logo-dark"}`}>
      <Image
        src="/logo.png"
        alt="SOROKIN Mobiler Schweißservice"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="logo-image"
      />
    </div>
  );
}