# Progress Companion — Next.js / TypeScript SVG assets

Zestaw grafik jako komponenty React dla Next.js.

## Instalacja

Skopiuj folder:

```txt
components/graphics
```

do projektu Next.js.

## Użycie

```tsx
import {
  BrainMascot,
  CategoryIcon,
  CelebrationOverlay,
  ProgressCompanionLogo,
  RewardTreeMap,
} from "@/components/graphics";

export default function Page() {
  return (
    <main>
      <ProgressCompanionLogo />
      <BrainMascot size={120} />
      <CategoryIcon variant="learning" title="Learning" />
      <RewardTreeMap />
      <CelebrationOverlay />
    </main>
  );
}
```

## Założenia wizualne

- Primary nie jest jaskrawozielony: `#3F7D4A`.
- Mózg nie jest zielony: ciepły koralowo-różowy.
- Kategorie mają osobne, spokojne kolory.
- Reward Tree zostaje w klimacie organicznym, ale bez dominacji zieleni.
- Komponenty nie używają zewnętrznych bibliotek.
