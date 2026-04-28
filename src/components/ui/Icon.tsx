import {
  Briefcase,
  BookOpen,
  Languages,
  Heart,
  Home,
  Sparkles,
  Sprout,
  PenLine,
  Coffee,
  Music,
  Dumbbell,
  Brush,
  Code,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'

/**
 * Maps category icon slugs (stored in the DB `categories.icon` column) to
 * lucide icon components. Default seeded categories use the slugs below.
 * User-created categories may store either a slug from this map OR a raw
 * emoji string — the latter is rendered as text by `<CategoryIcon />` for
 * backwards compatibility with data created before the redesign.
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  book: BookOpen,
  languages: Languages,
  heart: Heart,
  home: Home,
  sparkles: Sparkles,
  sprout: Sprout,
  pen: PenLine,
  coffee: Coffee,
  music: Music,
  dumbbell: Dumbbell,
  brush: Brush,
  code: Code,
}

interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  name: string
}

export function CategoryIcon({
  name,
  size = 18,
  strokeWidth = 1.75,
  ...rest
}: CategoryIconProps) {
  const Component = CATEGORY_ICON_MAP[name]
  if (Component) {
    return <Component size={size} strokeWidth={strokeWidth} {...rest} />
  }
  return (
    <span
      aria-hidden
      style={{
        fontSize: typeof size === 'number' ? size : 18,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {name}
    </span>
  )
}

export const KNOWN_CATEGORY_ICONS = Object.keys(CATEGORY_ICON_MAP)
