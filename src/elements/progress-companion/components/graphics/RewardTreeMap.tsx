import type { ProgressCompanionSvgProps } from "./types";

export function RewardTreeMap({
  title = "Reward tree path",
  size,
  className,
  ...props
}: ProgressCompanionSvgProps) {
  return (
    <svg
      width={size ?? 260}
      height={size ? Number(size) * 1.65 : 430}
      viewBox="0 0 390 645"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <rect width="390" height="645" rx="32" fill="#FFFDF8" />
      <path
        d="M210 54c-84 34-37 82 31 87 89 7 67 80-35 86-112 6-141 64-41 97 98 32 87 89-21 92-95 3-101 92 8 113 69 13 112 35 82 72"
        stroke="#EFE3BA"
        strokeWidth="42"
        strokeLinecap="round"
      />
      <path
        d="M210 54c-84 34-37 82 31 87 89 7 67 80-35 86-112 6-141 64-41 97 98 32 87 89-21 92-95 3-101 92 8 113 69 13 112 35 82 72"
        stroke="#BFD8B8"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="1 34"
      />
      <g fill="#BFD8B8">
        <path d="M36 210c21-28 51-27 67-3-26-5-47 4-63 25-3-7-4-14-4-22Z" />
        <path d="M292 325c21-28 51-27 67-3-26-5-47 4-63 25-3-7-4-14-4-22Z" />
        <path d="M41 505c21-28 51-27 67-3-26-5-47 4-63 25-3-7-4-14-4-22Z" />
      </g>
      {[10,9,8,7,6,5,4].map((level, index) => {
        const points = [
          [213, 68], [270, 152], [159, 234], [236, 321], [121, 410], [226, 493], [137, 570],
        ][index];
        const current = level === 5;
        const claimed = level < 8;
        return (
          <g key={level}>
            <circle cx={points[0]} cy={points[1]} r={current ? 33 : 26} fill={current ? "#3F7D4A" : "#FFF8EC"} stroke={current ? "#F6B84B" : "#D8D0C2"} strokeWidth={current ? 7 : 3} />
            <text x={points[0]} y={points[1] + 8} textAnchor="middle" fontFamily="Inter, Arial" fontSize={current ? 26 : 22} fontWeight="800" fill={current ? "#FFFFFF" : "#173226"}>{level}</text>
            {claimed && !current ? <circle cx={points[0] - 24} cy={points[1] + 23} r="12" fill="#3F7D4A" /> : null}
            {claimed && !current ? <path d={`M${points[0] - 30} ${points[1] + 23}l4 4 8-9`} stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
            {level > 7 ? <path d={`M${points[0] + 22} ${points[1] + 12}v-9a7 7 0 0 0-14 0v9h14Zm-17 0h20v18h-20V${points[1]+12}Z`} fill="#9A948A" /> : null}
          </g>
        );
      })}
      <text x="36" y="40" fontFamily="Inter, Arial" fontSize="22" fontWeight="800" fill="#173226">Reward Tree</text>
      <text x="248" y="496" fontFamily="Inter, Arial" fontSize="13" fontWeight="700" fill="#3F7D4A">You are here</text>
    </svg>
  );
}
