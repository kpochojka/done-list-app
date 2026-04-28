export const THEMES = [
  {
    id: 'purple',
    name: 'Purple Dream',
    primaryLight: '#7c3aed',
    primaryDark: '#8b5cf6',
    swatch: '#f8f7ff',
    swatchInk: '#7c3aed',
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    primaryLight: '#0891b2',
    primaryDark: '#22d3ee',
    swatch: '#f0fbff',
    swatchInk: '#0891b2',
  },
  {
    id: 'forest',
    name: 'Forest Focus',
    primaryLight: '#16a34a',
    primaryDark: '#4ade80',
    swatch: '#f3faf2',
    swatchInk: '#16a34a',
  },
  {
    id: 'sunset',
    name: 'Sunset Energy',
    primaryLight: '#ea580c',
    primaryDark: '#fb923c',
    swatch: '#fff5ec',
    swatchInk: '#ea580c',
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
