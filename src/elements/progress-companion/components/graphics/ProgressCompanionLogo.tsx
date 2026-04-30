import type { ProgressCompanionSvgProps } from "./types";

export function ProgressCompanionLogo({
  title = "Progress Companion logo",
  size,
  className,
  ...props
}: ProgressCompanionSvgProps) {
  return (
    <svg
      width={size ?? 360}
      height={size ? Number(size) * 0.31 : 112}
      viewBox="0 0 720 220"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <rect width="720" height="220" rx="36" fill="#FFF8EC" />
      <g transform="translate(44 34)">
        <ellipse cx="76" cy="130" rx="58" ry="13" fill="#E9E2D5" />
        <path d="M69 35c-19-12-45 0-47 24-22 5-28 36-8 48-4 24 23 43 44 29 17 17 48 9 53-15 25-1 40-32 23-51 8-25-20-48-42-33-5-5-13-8-23-2Z" fill="#FFB7A8" />
        <path d="M46 59c-2-14 11-23 24-18M82 43c18-8 38 6 34 25M33 91c-14-7-13-29 4-34M55 132c-19 9-39-10-30-29M106 119c-4 20-30 28-45 13M123 80c17 15 3 40-18 39" stroke="#F28C82" strokeWidth="7" strokeLinecap="round" />
        <circle cx="57" cy="83" r="7" fill="#173226" />
        <circle cx="101" cy="83" r="7" fill="#173226" />
        <circle cx="55" cy="80" r="2.5" fill="white" />
        <circle cx="99" cy="80" r="2.5" fill="white" />
        <path d="M68 104c9 10 21 10 30 0" stroke="#173226" strokeWidth="5" strokeLinecap="round" />
        <path d="M22 100c-12 8-20 21-18 34M132 101c14 7 22 19 22 33" stroke="#173226" strokeWidth="5" strokeLinecap="round" />
        <path d="M48 143l-8 18M103 143l10 18" stroke="#173226" strokeWidth="5" strokeLinecap="round" />
        <path d="M143 17l5-12 5 12 12 5-12 5-5 12-5-12-12-5 12-5Z" fill="#F6B84B" />
      </g>
      <g transform="translate(240 58)">
        <text x="0" y="48" fontFamily="Inter, Arial, sans-serif" fontSize="48" fontWeight="800" fill="#173226">Progress</text>
        <text x="0" y="100" fontFamily="Inter, Arial, sans-serif" fontSize="48" fontWeight="800" fill="#173226">Companion</text>
        <text x="0" y="142" fontFamily="Inter, Arial, sans-serif" fontSize="20" fontWeight="500" fill="#66756A">Small steps. Calm progress.</text>
        <path d="M365 26c14-13 34-10 45 2-18 4-31 15-38 33-5-11-7-23-7-35Z" fill="#3F7D4A" />
      </g>
    </svg>
  );
}
