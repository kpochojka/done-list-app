import type { CategoryIconProps } from "./types";

const variants = {
  work: { bg: "#FFE3BF", fg: "#B96218", symbol: "briefcase" },
  learning: { bg: "#DCEBFA", fg: "#356C9F", symbol: "book" },
  spanish: { bg: "#FFE0DC", fg: "#D94D42", symbol: "chat" },
  health: { bg: "#E8DDF7", fg: "#7655A8", symbol: "heart" },
  home: { bg: "#FFE6C8", fg: "#C96D20", symbol: "home" },
} as const;

function Symbol({ type, color }: { type: string; color: string }) {
  if (type === "briefcase") {
    return <path d="M18 26h28v22H18V26Zm8 0v-6h12v6M18 34h28" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (type === "book") {
    return <path d="M18 18h19a7 7 0 0 1 7 7v25H25a7 7 0 0 0-7 7V18Zm0 0v39M26 28h10M26 38h10" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (type === "chat") {
    return <path d="M16 24a10 10 0 0 1 10-10h18a10 10 0 0 1 10 10v8a10 10 0 0 1-10 10H30l-11 8 3-10a10 10 0 0 1-6-9v-7Zm12 5h.1M35 29h.1M42 29h.1" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (type === "heart") {
    return <path d="M35 49S17 38 17 26a9 9 0 0 1 16-6 9 9 0 0 1 16 6c0 12-14 21-14 23Z" fill={color} />;
  }
  return <path d="M18 34 35 19l17 15M23 32v21h24V32M31 53V41h8v12" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
}

export function CategoryIcon({
  title,
  size = 64,
  variant = "work",
  className,
  ...props
}: CategoryIconProps) {
  const item = variants[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      role={title ? "img" : "presentation"}
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <rect x="5" y="5" width="60" height="60" rx="18" fill={item.bg} />
      <Symbol type={item.symbol} color={item.fg} />
    </svg>
  );
}
