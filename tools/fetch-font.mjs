// Télécharge les sous-ensembles latin + latin-ext (police variable) d'une famille Google Fonts dans charte/assets/fonts,
// et ajoute les @font-face à source/fonts.css.  Usage : node tools/fetch-font.mjs "Plus+Jakarta+Sans" "wght@300..800"
import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const [family = "Outfit", axes = "wght@300..700"] = process.argv.slice(2);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axes}&display=swap`, { headers: { "User-Agent": UA } })).text();
const name = family.replace(/\+/g, " ");
const file = family.replace(/\+/g, "");
mkdirSync(join(RACINE, "charte", "assets", "fonts"), { recursive: true });
let lignes = "";
for (const m of css.matchAll(/\/\* ([\w-]+) \*\/\s*@font-face\s*\{([^}]*)\}/g)) {
  const [, subset, body] = m;
  if (subset !== "latin" && subset !== "latin-ext") continue;
  const url = /url\((https:[^)]+\.woff2)\)/.exec(body)[1];
  const weight = /font-weight: ([^;]+)/.exec(body)[1];
  const range = /unicode-range: ([^;]+)/.exec(body)[1];
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const out = join(RACINE, "charte", "assets", "fonts", `${file}-${subset}.woff2`);
  writeFileSync(out, buf);
  console.log(`${file}-${subset}.woff2 ${buf.length} o (${weight})`);
  lignes += `@font-face { font-family: "${name}"; src: url("fonts/${file}-${subset}.woff2") format("woff2"); font-weight: ${weight}; font-style: normal; font-display: swap; unicode-range: ${range}; }\n`;
}
if (!lignes) { console.error("aucun sous-ensemble trouvé pour", family); process.exit(1); }
appendFileSync(join(RACINE, "source", "fonts.css"), lignes);
