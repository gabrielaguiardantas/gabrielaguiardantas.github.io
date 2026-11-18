import type { Language } from "./context/language";

// as seções da v2, na ordem da órbita (começa no topo, sentido horário).
// O id é também o endereço da seção (#about…), igual nos dois idiomas
export const SECTIONS = [
  { id: "about", label: { portuguese: "Sobre", english: "About" } },
  { id: "stacks", label: { portuguese: "Stacks", english: "Stacks" } },
  { id: "projects", label: { portuguese: "Projetos", english: "Projects" } },
  { id: "versions", label: { portuguese: "Versões", english: "Versions" } },
  { id: "contact", label: { portuguese: "Contato", english: "Contact" } },
] as const satisfies readonly { id: string; label: Record<Language, string> }[];

export type SectionId = (typeof SECTIONS)[number]["id"];

export const isSectionId = (value: string): value is SectionId => SECTIONS.some((section) => section.id === value);
