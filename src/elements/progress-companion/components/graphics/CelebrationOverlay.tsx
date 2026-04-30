import type { ProgressCompanionSvgProps } from "./types";

export function CelebrationOverlay({
  title = "Celebration overlay",
  size,
  className,
  ...props
}: ProgressCompanionSvgProps) {
  return (
    <svg
      width={size ?? 280}
      height={size ? Number(size) * 0.75 : 210}
      viewBox="0 0 420 315"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <rect x="18" y="20" width="384" height="275" rx="36" fill="#FFFFFF" />
      <rect x="18" y="20" width="384" height="275" rx="36" stroke="#E6E1D8" strokeWidth="2" />
      <path d="M98 50l6 15 15 6-15 6-6 15-6-15-15-6 15-6 6-15Z" fill="#F6B84B" />
      <path d="M316 62l22-7M330 43l5 24" stroke="#A88AD8" strokeWidth="8" strokeLinecap="round" />
      <circle cx="92" cy="231" r="8" fill="#F97366" />
      <circle cx="331" cy="218" r="8" fill="#5D8CC1" />
      <rect x="180" y="54" width="60" height="60" rx="14" fill="#EAF4E6" />
      <path d="M186 78h48M210 54v60M180 78h60M191 64c-20-20-37 9-11 14M229 64c20-20 37 9 11 14" stroke="#3F7D4A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <text x="210" y="162" textAnchor="middle" fontFamily="Inter, Arial" fontSize="34" fontWeight="850" fill="#173226">Level Up!</text>
      <text x="210" y="197" textAnchor="middle" fontFamily="Inter, Arial" fontSize="18" fontWeight="600" fill="#66756A">You reached a new reward level.</text>
      <text x="210" y="229" textAnchor="middle" fontFamily="Inter, Arial" fontSize="18" fontWeight="600" fill="#66756A">Keep going, gently.</text>
    </svg>
  );
}
