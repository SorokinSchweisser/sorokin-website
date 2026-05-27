import Image from "next/image";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

export default function Logo({ size, variant }: LogoProps) {
  return (
    <a href="#" className="flex items-center">
      <Image
        src="/logo.png"
        alt="SOROKIN Mobiler Schweißservice"
        width={200}
        height={80}
        priority
        className="h-12 md:h-16 w-auto object-contain"
      />
    </a>
  );
}
