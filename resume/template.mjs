import { readFileSync } from "node:fs";
import { CONTACT } from "./content.mjs";

const escape = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const rich = (text) => escape(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const bare = (url) => url.replace(/^https:\/\/(www\.)?/, "");

// a Lato vem do pacote, embutida no HTML: a geração não depende do Google nem da rede.
// O subconjunto latin já cobre os acentos do português e os travessões
const FONTS = [
  [400, "normal"],
  [400, "italic"],
  [700, "normal"],
]
  .map(([weight, style]) => {
    const file = new URL(`../node_modules/@fontsource/lato/files/lato-latin-${weight}-${style}.woff2`, import.meta.url);
    const data = readFileSync(file).toString("base64");
    return `@font-face { font-family: "Lato"; font-weight: ${weight}; font-style: ${style}; src: url(data:font/woff2;base64,${data}) format("woff2"); }`;
  })
  .join("\n");

// uma coluna e texto de verdade, para o ATS ler na ordem certa. Sem kerning e sem ligaduras:
// com eles, o texto extraído do PDF perdia espaços ("T OEIC(Listening &Reading)")
const CSS = `
${FONTS}
@page { size: A4; margin: 12mm 16mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "Lato", sans-serif; font-size: 10pt; line-height: 1.38;
  font-kerning: none; font-variant-ligatures: none; color: #222; }
a { color: #1f4e79; text-decoration: none; }
header { text-align: center; margin-bottom: 6pt; }
h1 { margin: 0; font-size: 22pt; line-height: 1.15; color: #1a1a1a; }
.headline { margin: 2pt 0 3pt; font-size: 11.5pt; font-weight: 700; color: #1f4e79; }
.contact { font-size: 9.6pt; color: #555; }
.sep { padding: 0 5pt; color: #999; }
h2 { margin: 8pt 0 4pt; padding-bottom: 1.5pt; border-bottom: 1px solid #1f4e79;
  font-size: 11pt; text-transform: uppercase; color: #1f4e79; break-after: avoid; }
p { margin: 0; }
.job { margin-bottom: 5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 12pt; }
.row > :last-child { flex: none; color: #555; }
.role { font-weight: 700; }
.detail { font-style: italic; color: #555; }
ul { margin: 2pt 0 0; padding-left: 13pt; }
li::marker { color: #1f4e79; }
.entries .row { margin-bottom: 1.5pt; }
`;

export function render(text) {
  const contactLines = [
    [escape(text.location), escape(text.phone), `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`],
    CONTACT.links.map((url) => `<a href="${url}">${bare(url)}</a>`),
  ];
  const entries = (list) =>
    `<div class="entries">${list
      .map(([what, when]) => `<div class="row"><span>${rich(what)}</span><span>${when}</span></div>`)
      .join("")}</div>`;

  return `<!doctype html>
<html lang="${text.lang}">
<head>
<meta charset="utf-8">
<title>${escape(text.title)}</title>
<style>${CSS}</style>
</head>
<body>
<header>
  <h1>${escape(text.name)}</h1>
  <p class="headline">${escape(text.headline)}</p>
  ${contactLines.map((line) => `<p class="contact">${line.join('<span class="sep">|</span>')}</p>`).join("\n  ")}
</header>
<h2>${text.sections.summary}</h2>
<p>${rich(text.summary)}</p>
<h2>${text.sections.skills}</h2>
${text.skills.map(([group, items]) => `<p><strong>${group}:</strong> ${escape(items)}</p>`).join("\n")}
<h2>${text.sections.experience}</h2>
${text.jobs
  .map(
    (job) => `<div class="job">
  <div class="row"><span class="role">${escape(job.role)} — ${escape(job.org)}</span><span>${job.period}</span></div>
  <div class="row detail"><span>${escape(job.detail)}</span><span>${escape(job.place)}</span></div>
  <ul>${job.bullets.map((bullet) => `<li>${rich(bullet)}</li>`).join("")}</ul>
</div>`,
  )
  .join("\n")}
<h2>${text.sections.education}</h2>
${entries(text.education)}
<h2>${text.sections.courses}</h2>
${entries(text.courses)}
<h2>${text.sections.languages}</h2>
<p>${text.languages.map(([name, level]) => `<strong>${name}:</strong> ${level}`).join('<span class="sep">|</span>')}</p>
</body>
</html>`;
}
