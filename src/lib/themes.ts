export const THEMES = [
  {
    id: 'purple',
    name: 'Purple Dream',
    primaryLight: '#7c3aed',
    primaryDark: '#8b5cf6',
    preview: '🟣',
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    primaryLight: '#0891b2',
    primaryDark: '#22d3ee',
    preview: '🔵',
  },
  {
    id: 'forest',
    name: 'Forest Focus',
    primaryLight: '#16a34a',
    primaryDark: '#4ade80',
    preview: '🟢',
  },
  {
    id: 'sunset',
    name: 'Sunset Energy',
    primaryLight: '#ea580c',
    primaryDark: '#fb923c',
    preview: '🟠',
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
