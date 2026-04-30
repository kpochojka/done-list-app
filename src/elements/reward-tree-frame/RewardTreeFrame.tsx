import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  title?: string;
};

export function RewardTreeFrame({
  title = "Reward tree frame",
  className,
  ...props
}: Props) {
  return (
    <svg
      viewBox="0 0 390 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <title>{title}</title>

      <defs>
        <linearGradient id="leaf1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#AFCB7D" />
          <stop offset="1" stopColor="#7FA365" />
        </linearGradient>

        <linearGradient id="leaf2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8FB478" />
          <stop offset="1" stopColor="#577D53" />
        </linearGradient>
      </defs>

      {/* LEFT SIDE */}
      <g opacity="0.95">
        <path d="M0 120C40 90 80 110 100 150C60 170 30 170 0 150Z" fill="#C9DA8E"/>
        <path d="M0 300C50 260 90 280 110 330C70 350 30 350 0 330Z" fill="#BFD18B"/>
        <path d="M0 520C50 480 100 500 120 550C70 580 30 580 0 560Z" fill="#C7DA91"/>
        <path d="M0 700C50 670 90 690 120 730C70 750 30 750 0 730Z" fill="#AFCB7D"/>
      </g>

      {/* RIGHT SIDE */}
      <g opacity="0.95">
        <path d="M390 140C350 110 310 130 290 170C330 190 360 190 390 170Z" fill="#C9DA8E"/>
        <path d="M390 320C340 280 300 300 280 350C320 370 360 370 390 350Z" fill="#BFD18B"/>
        <path d="M390 550C340 510 300 530 270 580C320 610 360 600 390 580Z" fill="#B8CE88"/>
        <path d="M390 710C340 680 300 700 260 740C320 770 360 760 390 740Z" fill="#AFCB7D"/>
      </g>

      {/* PLANTS LEFT */}
      <g transform="translate(20 80)">
        <path d="M30 80V10" stroke="#8B6A3C" strokeWidth="5"/>
        <path d="M30 40L10 20M30 55l20-20M30 70L10 55" stroke="#8B6A3C" strokeWidth="4"/>
        <path d="M30 10C0-5-20 25 5 45C-10 65 10 95 35 80C55 100 85 70 65 45C85 20 55-5 30 10Z" fill="url(#leaf1)"/>
      </g>

      {/* PLANTS RIGHT */}
      <g transform="translate(300 120)">
        <path d="M30 80V10" stroke="#587E4C" strokeWidth="5"/>
        <path d="M30 40L10 20M30 55l20-20M30 70L10 55" stroke="#587E4C" strokeWidth="4"/>
        <path d="M30 10C0-5-20 25 5 45C-10 65 10 95 35 80C55 100 85 70 65 45C85 20 55-5 30 10Z" fill="url(#leaf2)"/>
      </g>

      {/* FLOWERS */}
      <g>
        <circle cx="50" cy="350" r="6" fill="#F7CD65"/>
        <circle cx="70" cy="340" r="6" fill="#F58D74"/>
        <circle cx="330" cy="370" r="6" fill="#F7CD65"/>
        <circle cx="310" cy="360" r="6" fill="#F4A36B"/>
        <circle cx="60" cy="600" r="6" fill="#F7CD65"/>
        <circle cx="320" cy="610" r="6" fill="#F58D74"/>
      </g>

    </svg>
  );
}