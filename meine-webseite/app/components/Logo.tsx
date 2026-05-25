export default function Logo({ size = "md", variant = "dark" }: { size?: "sm" | "md" | "lg"; variant?: "light" | "dark" }) {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.3 : 1;
  const nameColor = variant === "light" ? "#ffffff" : "#1d6fa8";
  const subtitleColor = variant === "light" ? "rgba(255,255,255,0.6)" : "#9ca3af";
  return (
    <svg
      width={Math.round(260 * scale)}
      height={Math.round(52 * scale)}
      viewBox="0 0 260 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SOROKIN Mobiler Schweissservice"
    >
      {/* Spark icon */}
      <g transform="translate(0, 4)">
        {/* Central spark burst */}
        <circle cx="20" cy="22" r="5" fill="#f97316" opacity="0.9" />
        {/* Spark rays */}
        <line x1="20" y1="4" x2="20" y2="12" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="32" x2="20" y2="40" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2" y1="22" x2="10" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="38" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="7" y1="7" x2="13" y2="13" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="27" y1="31" x2="33" y2="37" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="33" y1="7" x2="27" y2="13" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="7" y1="37" x2="13" y2="31" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Small spark dot */}
        <circle cx="36" cy="10" r="2" fill="#f97316" opacity="0.6" />
        <circle cx="10" cy="38" r="1.5" fill="#f97316" opacity="0.4" />
      </g>

      {/* SOROKIN text */}
      <text
        x="46"
        y="30"
        fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill={nameColor}
        letterSpacing="3"
      >
        SOROKIN
      </text>

      {/* Subtitle */}
      <text
        x="47"
        y="48"
        fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
        fontWeight="500"
        fontSize="10.5"
        fill={subtitleColor}
        letterSpacing="0.8"
      >
        MOBILER SCHWEISSSERVICE
      </text>
    </svg>
  );
}
