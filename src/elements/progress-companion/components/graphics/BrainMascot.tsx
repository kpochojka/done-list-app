import type { ProgressCompanionSvgProps } from "./types";

export function BrainMascot({
  title = "Progress Companion brain mascot",
  size = 160,
  className,
  ...props
}: ProgressCompanionSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <rect width="320" height="320" rx="64" fill="#FFF8EC" />
      <ellipse cx="160" cy="250" rx="88" ry="18" fill="#E7DFD0" />
      <g transform="translate(52 42)">
        <path
          d="M99 35c-25-19-66-1-69 34-31 8-41 53-12 70-7 35 32 64 63 43 24 25 70 13 78-22 37-2 58-47 33-76 12-37-30-70-62-48-8-8-19-12-31-1Z"
          fill="#FFB7A8"
        />
        <path
          d="M64 67c-2-21 17-34 37-26M118 43c27-12 56 9 50 38M45 114c-23-11-20-43 6-51M75 176c-29 14-59-16-44-43M151 158c-6 31-45 43-68 19M174 97c26 23 5 61-27 59"
          stroke="#F28C82"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="80" cy="107" r="10" fill="#173226" />
        <circle cx="143" cy="107" r="10" fill="#173226" />
        <circle cx="77" cy="103" r="3" fill="#fff" />
        <circle cx="140" cy="103" r="3" fill="#fff" />
        <path d="M94 138c13 14 34 14 47 0" stroke="#173226" strokeWidth="8" strokeLinecap="round" />
        <path d="M21 128c-18 12-29 32-27 51M198 129c20 10 33 29 34 50" stroke="#173226" strokeWidth="8" strokeLinecap="round" />
        <path d="M76 196l-12 32M151 196l15 32" stroke="#173226" strokeWidth="8" strokeLinecap="round" />
      </g>
      <path d="M60 72l7-16 7 16 16 7-16 7-7 16-7-16-16-7 16-7Z" fill="#F6B84B" />
      <path d="M238 70l24-7M253 50l5 25" stroke="#A88AD8" strokeWidth="9" strokeLinecap="round" />
      <circle cx="245" cy="222" r="11" fill="#3F7D4A" />
    </svg>
  );
}
