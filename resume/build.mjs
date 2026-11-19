// gera os currículos em PDF (PT e EN) em public/, com o Chrome do Playwright.
// Os PDFs vão para o repo já gerados, então o deploy não precisa do Chrome.
// Uso: npm run resume
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { CONTENT } from "./content.mjs";
import { render } from "./template.mjs";

// o mesmo Chrome dos testes E2E
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
let overflow = false;

for (const text of Object.values(CONTENT)) {
  await page.setContent(render(text));
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  await writeFile(fileURLToPath(new URL(`../public/${text.file}`, import.meta.url)), pdf);

  // o currículo cabe numa página; se um texto novo empurrar para a segunda, o comando avisa
  const pages = pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;
  console.log(`${text.file}: ${pages} ${pages === 1 ? "página" : "páginas"}`);
  if (pages !== 1) overflow = true;
}

await browser.close();
if (overflow) process.exitCode = 1;
