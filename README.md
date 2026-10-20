# ballast

Vygeneruje testovací **PDF** nebo **černý obrázek** o přesné velikosti, na bajt. Hodí se třeba na testování limitů uploadu. Vše běží v prohlížeči, nic se neodesílá na server.

## Funkce

- **PDF s textem**: stránky A4 plné výplňového textu (výchozí `aaaa…`, lze změnit).
- **Černý obrázek**: PNG nebo JPEG s volitelnými rozměry.
- Velikost v **B / kB / MB** (desítkově, 1 MB = 1 000 000 B), max. 512 MB.
- Rychlé předvolby: 100 kB, 500 kB, 1 MB, 5 MB, 10 MB, 50 MB.

## Jak se trefí přesná velikost

- **PDF**: do souboru se vejde co nejvíc textu a zbylé bajty doplní PDF komentář. Odkazy uvnitř souboru (xref) zůstanou platné.
- **PNG**: přidá se vlastní blok dat, který prohlížeče a prohlížeče obrázků ignorují.
- **JPEG**: přidají se bloky s komentářem (`COM`).

Obrázek se tedy otevře normálně, jen je soubor „nafouknutý“ výplní.

## Spuštění

Potřebuješ Node 20+ a Yarn 4 (přes Corepack).

```bash
corepack enable
yarn install
yarn dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000).

| Příkaz | Co dělá |
| --- | --- |
| `yarn dev` | vývojový server |
| `yarn build` | produkční build |
| `yarn start` | spustí produkční build |
| `yarn lint` | ESLint |

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript

## Struktura

- `app/page.tsx`: stránka (layout, hlavička)
- `components/<Komponenta>/index.tsx`: každá komponenta ve vlastní složce, vedle ní případně `constants.ts`, `utils.ts` nebo hook
- `components/Generator/`: hlavní formulář + hook `useFileGenerator.ts` (generování a stažení)
- `lib/generators/`: generování na přesnou velikost (`pdf.ts`, `image.ts`, `crc32.ts`)
- `lib/units.ts`: jednotky a formátování velikostí
