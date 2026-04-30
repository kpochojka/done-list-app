# Progress Companion — Reward Tree Background

Komponent SVG dla Next.js + TypeScript.

## Pliki

```txt
components/graphics/RewardTreeBackground.tsx
components/graphics/index.ts
```

## Użycie

```tsx
import { RewardTreeBackground } from "@/components/graphics";

export function RewardTreeSection() {
  return (
    <div className="relative h-[760px] w-full overflow-hidden rounded-3xl bg-white">
      <RewardTreeBackground className="absolute inset-0 h-full w-full" />
    </div>
  );
}
```

## Uwagi

- SVG jest bez tła, ale zawiera białą ścieżkę i jasne elementy, więc najlepiej wygląda na białym lub bardzo jasnym tle.
- Komponent nie wymaga żadnych bibliotek.
- `width`, `height`, `className` i standardowe propsy SVG można przekazywać normalnie.
