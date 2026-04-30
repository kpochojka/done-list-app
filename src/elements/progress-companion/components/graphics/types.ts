import type { SVGProps } from "react";

export type ProgressCompanionSvgProps = SVGProps<SVGSVGElement> & {
  title?: string;
  size?: number | string;
};

export type CategoryIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
  size?: number | string;
  variant?: "work" | "learning" | "spanish" | "health" | "home";
};
