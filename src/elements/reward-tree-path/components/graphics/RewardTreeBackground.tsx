import type { SVGProps } from "react";

export type RewardTreeBackgroundProps = SVGProps<SVGSVGElement> & {
  title?: string;
  width?: number | string;
  height?: number | string;
};

/**
 * Progress Companion Reward Tree background.
 *
 * Next.js / TypeScript ready.
 * - Transparent background
 * - No external dependencies
 * - Can be used as inline SVG background/illustration
 */
export function RewardTreeBackground({
  title = "Progress Companion reward tree background",
  width = "100%",
  height = "100%",
  className,
  ...props
}: RewardTreeBackgroundProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 390 760"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>

      <defs>
        <filter id="pcRewardTreeSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#2E3A2F" floodOpacity="0.14" />
        </filter>

        <filter id="pcRewardTreeNodeShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2E3A2F" floodOpacity="0.18" />
        </filter>

        <radialGradient id="pcRewardTreeCurrentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#BEE08E" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#BEE08E" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#BEE08E" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="pcRewardTreePathFill" x1="58" y1="56" x2="320" y2="720" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7E7BF" />
          <stop offset="0.55" stopColor="#F5DFAD" />
          <stop offset="1" stopColor="#EFCF8E" />
        </linearGradient>

        <linearGradient id="pcRewardTreeLeafGreen" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#AFCB7D" />
          <stop offset="1" stopColor="#7FA365" />
        </linearGradient>

        <linearGradient id="pcRewardTreeLeafDark" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8FB478" />
          <stop offset="1" stopColor="#577D53" />
        </linearGradient>
      </defs>

      <path
        d="M198 40C126 58 102 87 126 113C150 139 242 118 296 150C368 193 303 263 206 251C101 238 54 299 128 340C202 381 311 345 336 409C362 476 232 509 143 498C54 487 37 568 125 609C213 650 287 615 326 674C342 699 326 732 290 752"
        stroke="#FFFFFF"
        strokeWidth="104"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.96"
      />

      <path
        d="M198 40C126 58 102 87 126 113C150 139 242 118 296 150C368 193 303 263 206 251C101 238 54 299 128 340C202 381 311 345 336 409C362 476 232 509 143 498C54 487 37 568 125 609C213 650 287 615 326 674C342 699 326 732 290 752"
        stroke="#FFFFFF"
        strokeWidth="74"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M198 40C126 58 102 87 126 113C150 139 242 118 296 150C368 193 303 263 206 251C101 238 54 299 128 340C202 381 311 345 336 409C362 476 232 509 143 498C54 487 37 568 125 609C213 650 287 615 326 674C342 699 326 732 290 752"
        stroke="url(#pcRewardTreePathFill)"
        strokeWidth="52"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g opacity="0.96">
        <path d="M0 94C38 84 66 95 91 119C69 145 33 153 0 141V94Z" fill="#C9DA8E" />
        <path d="M390 109C354 112 326 128 305 157C330 176 363 176 390 164V109Z" fill="#C9DA8E" />
        <path d="M0 263C38 249 72 264 91 293C65 318 31 320 0 306V263Z" fill="#BFD18B" />
        <path d="M390 279C346 274 315 294 294 326C324 347 360 345 390 327V279Z" fill="#BFD18B" />
        <path d="M0 480C42 456 82 473 98 510C67 539 30 538 0 520V480Z" fill="#C7DA91" />
        <path d="M390 531C352 522 316 539 294 570C326 596 362 591 390 569V531Z" fill="#B8CE88" />
        <path d="M0 657C38 642 77 657 102 690C72 721 33 724 0 707V657Z" fill="#AFCB7D" />
        <path d="M390 643C337 636 295 657 270 706C312 744 355 738 390 716V643Z" fill="#AFCB7D" />
      </g>

      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(24 60)">
          <path d="M26 85V15" stroke="#8B6A3C" strokeWidth="5" />
          <path d="M26 41L9 27M26 55l18-18M26 69L7 56" stroke="#8B6A3C" strokeWidth="4" />
          <path d="M28 10C3-4-14 25 4 44C-17 64 6 94 32 76C52 99 84 70 64 47C83 24 52-5 28 10Z" fill="url(#pcRewardTreeLeafGreen)" opacity="0.95" />
        </g>

        <g transform="translate(318 75)">
          <path d="M28 83V14" stroke="#587E4C" strokeWidth="5" />
          <path d="M28 40L8 27M28 56l22-18M28 70L10 62" stroke="#587E4C" strokeWidth="4" />
          <path d="M27 12C6 5-7 28 7 42C-8 55 4 83 29 68C45 88 72 61 55 44C75 27 50 0 27 12Z" fill="url(#pcRewardTreeLeafDark)" opacity="0.9" />
        </g>

        <g transform="translate(24 206)">
          <path d="M3 62C20 27 47 23 69 54C44 54 24 58 3 62Z" fill="#779F65" />
          <path d="M55 66C69 32 97 31 116 62C91 61 73 63 55 66Z" fill="#9DBF7D" />
          <path d="M26 62C31 27 59 17 82 47C61 51 44 57 26 62Z" fill="#86AA72" />
          <circle cx="23" cy="25" r="10" fill="#F58D74" />
          <circle cx="38" cy="20" r="8" fill="#F6B84B" />
          <circle cx="34" cy="34" r="8" fill="#F4A36B" />
        </g>

        <g transform="translate(288 236)">
          <path d="M4 52C22 21 51 21 71 51C43 48 23 50 4 52Z" fill="#85AA76" />
          <path d="M52 53C68 26 94 25 111 49C86 50 69 52 52 53Z" fill="#9DBF7D" />
          <path d="M37 50C44 18 67 11 87 39C68 43 52 47 37 50Z" fill="#6F9B6D" />
          <circle cx="87" cy="16" r="9" fill="#F7CD65" />
          <path d="M87 26v28" stroke="#6F9B6D" strokeWidth="3" />
        </g>

        <g transform="translate(18 410)">
          <path d="M5 86C27 42 70 38 96 80C62 79 33 84 5 86Z" fill="#78A268" />
          <path d="M58 84C73 50 111 45 132 78C101 77 78 81 58 84Z" fill="#9ABD78" />
          <path d="M24 85C30 46 58 27 90 70C62 72 42 80 24 85Z" fill="#6E9A66" />
          <circle cx="20" cy="28" r="11" fill="#F58D74" />
          <circle cx="40" cy="24" r="10" fill="#F6B84B" />
          <circle cx="34" cy="44" r="11" fill="#F4A36B" />
          <circle cx="88" cy="20" r="9" fill="#F58D74" />
        </g>

        <g transform="translate(287 472)">
          <path d="M0 76C24 33 59 29 86 71C55 70 27 75 0 76Z" fill="#83A96F" />
          <path d="M52 76C71 38 112 40 132 72C99 71 75 74 52 76Z" fill="#9EBF7D" />
          <path d="M26 74C39 34 68 25 99 62C75 65 51 71 26 74Z" fill="#6D9664" />
          <circle cx="88" cy="25" r="9" fill="#F7CD65" />
          <circle cx="107" cy="45" r="8" fill="#F2AF5C" />
        </g>

        <g transform="translate(18 645)">
          <path d="M5 80C31 38 74 38 103 76C68 76 36 78 5 80Z" fill="#7BA66D" />
          <path d="M60 81C78 45 119 44 142 76C108 76 84 78 60 81Z" fill="#A0BF7C" />
          <path d="M29 78C42 38 68 28 102 66C80 70 53 75 29 78Z" fill="#638D5D" />
          <circle cx="25" cy="25" r="9" fill="#F58D74" />
          <circle cx="40" cy="16" r="8" fill="#F7CD65" />
        </g>

        <g transform="translate(277 632)">
          <path d="M2 91C40 24 99 23 136 85C89 84 43 91 2 91Z" fill="#648E5E" />
          <path d="M42 90C67 41 123 41 154 82C113 84 78 87 42 90Z" fill="#7FA365" />
          <path d="M88 87C113 41 164 48 181 80C143 82 116 85 88 87Z" fill="#9DBF7D" />
        </g>
      </g>

      <g>
        <circle cx="42" cy="362" r="4" fill="#F7CD65" />
        <circle cx="35" cy="355" r="4" fill="#F7CD65" />
        <circle cx="49" cy="354" r="4" fill="#F7CD65" />
        <circle cx="42" cy="348" r="4" fill="#F7CD65" />
        <circle cx="355" cy="382" r="4" fill="#F7CD65" />
        <circle cx="348" cy="375" r="4" fill="#F7CD65" />
        <circle cx="362" cy="375" r="4" fill="#F7CD65" />
        <circle cx="355" cy="369" r="4" fill="#F7CD65" />
        <circle cx="333" cy="607" r="4" fill="#F7CD65" />
        <circle cx="326" cy="600" r="4" fill="#F7CD65" />
        <circle cx="340" cy="600" r="4" fill="#F7CD65" />
        <circle cx="333" cy="594" r="4" fill="#F7CD65" />
        <ellipse cx="44" cy="575" rx="14" ry="8" fill="#BAC4AD" />
        <ellipse cx="344" cy="570" rx="12" ry="7" fill="#BAC4AD" />
        <ellipse cx="70" cy="710" rx="16" ry="8" fill="#AEB9A5" />
      </g>

      <g fontFamily="Inter, Arial, sans-serif" fontWeight="700" textAnchor="middle">
        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="178" y1="68" x2="178" y2="112" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="178" cy="54" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="178" y="64" fontSize="30" fill="#121212">10</text>
          <path d="M211 67v-9a8 8 0 0 0-16 0v9h16Zm-19 0h22v21h-22V67Z" fill="#6C6F70" />
          <circle cx="203" cy="77" r="2" fill="#fff" />
          <path d="M203 79v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="164" y1="157" x2="164" y2="204" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="164" cy="143" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="164" y="153" fontSize="30" fill="#121212">9</text>
          <path d="M197 158v-9a8 8 0 0 0-16 0v9h16Zm-19 0h22v21h-22v-21Z" fill="#6C6F70" />
          <circle cx="189" cy="168" r="2" fill="#fff" />
          <path d="M189 170v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="165" y1="257" x2="165" y2="304" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="165" cy="243" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="165" y="253" fontSize="30" fill="#121212">8</text>
          <path d="M198 258v-9a8 8 0 0 0-16 0v9h16Zm-19 0h22v21h-22v-21Z" fill="#6C6F70" />
          <circle cx="190" cy="268" r="2" fill="#fff" />
          <path d="M190 270v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="174" y1="357" x2="174" y2="404" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="174" cy="343" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="174" y="353" fontSize="30" fill="#121212">7</text>
          <circle cx="139" cy="363" r="14" fill="#3F7D4A" />
          <path d="M132 363l5 5 10-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="171" y1="447" x2="171" y2="494" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="171" cy="433" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="171" y="443" fontSize="30" fill="#121212">6</text>
          <circle cx="136" cy="453" r="14" fill="#3F7D4A" />
          <path d="M129 453l5 5 10-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g>
          <circle cx="164" cy="532" r="56" fill="url(#pcRewardTreeCurrentGlow)" />
          <circle cx="164" cy="532" r="36" fill="#3F7D4A" stroke="#F6B84B" strokeWidth="6" filter="url(#pcRewardTreeSoftShadow)" />
          <text x="164" y="544" fontSize="36" fill="#fff">5</text>
          <path d="M197 519c18-8 44-2 52 16 9 18-6 36-30 36h-46c-10 0-15-12-8-19l32-33Z" fill="#FFF8EC" stroke="#E9C980" strokeWidth="2" />
          <ellipse cx="218" cy="561" rx="30" ry="8" fill="#D8CBB7" opacity="0.7" />
          <path d="M198 526h38l-5 28c-2 10-9 15-19 15s-17-5-19-15l-5-28Z" fill="#F9E7C3" stroke="#C99C54" strokeWidth="2" />
          <ellipse cx="217" cy="526" rx="20" ry="7" fill="#4B2F18" />
          <path d="M214 520c-1-9 6-14 12-19M228 500c-8 0-15 4-16 11 8 1 15-3 16-11Z" stroke="#5A9A57" strokeWidth="3" strokeLinecap="round" />
          <path d="M235 532c20-5 21 23 0 22" stroke="#C99C54" strokeWidth="4" strokeLinecap="round" />
          <rect x="245" y="519" width="112" height="44" rx="22" fill="#FFF8EC" stroke="#E9C980" strokeWidth="2" />
          <text x="301" y="547" fontFamily="Inter, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#3F7D4A" textAnchor="middle">You are here!</text>
        </g>

        <g filter="url(#pcRewardTreeNodeShadow)">
          <line x1="171" y1="632" x2="171" y2="679" stroke="#D8CBB7" strokeWidth="5" />
          <circle cx="171" cy="618" r="30" fill="#F5EFE4" stroke="#D5C8B7" strokeWidth="2" />
          <text x="171" y="628" fontSize="30" fill="#121212">4</text>
          <circle cx="136" cy="638" r="14" fill="#3F7D4A" />
          <path d="M129 638l5 5 10-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
