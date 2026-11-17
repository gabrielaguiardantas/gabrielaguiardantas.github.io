import type { Version } from "../../context/version";

export const versionsArray: {
  id: Version;
  version: string;
  year: { ptBr: string; eng: string };
  description: { ptBr: string; eng: string };
  current: boolean;
}[] = [
  {
    id: "v1",
    version: "v1.0",
    year: { ptBr: "2023", eng: "2023" },
    description: {
      ptBr: "Versão original — React + TypeScript + Vite",
      eng: "Original version — React + TypeScript + Vite",
    },
    current: false,
  },
  {
    id: "v2",
    version: "v2.0",
    year: { ptBr: "2026", eng: "2026" },
    description: {
      ptBr: "Versão atual (em construção)",
      eng: "Current version (under construction)",
    },
    current: true,
  },
];
