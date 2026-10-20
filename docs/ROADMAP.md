# Roadmap: portfólio v2.0

Este documento orienta a modernização do portfólio e registra o andamento. A **v2.0** traz uma identidade visual nova, conteúdo atualizado e uma forma de navegar entre versões do site. A **v1.0** (2023) fica preservada, sem alterações, como marco histórico da minha trajetória como Engenheiro de Software.

**Legenda:** ⬜ a fazer · 🟨 em andamento · ✅ concluído · 💬 a definir em conjunto

## Visão geral

| Fase | Tema | Status |
| --- | --- | --- |
| 0 | [Pré-desenvolvimento](#fase-0-pré-desenvolvimento) | ✅ |
| 1 | [Fundação de versões (v1 congelada + troca em runtime)](#fase-1-fundação-de-versões) | ⬜ |
| 2 | [Identidade visual da v2](#fase-2-identidade-visual-da-v2) | ⬜ |
| 3 | [Conteúdo da v2](#fase-3-conteúdo-da-v2) | ⬜ |
| 4 | [Efeito "volta no tempo"](#fase-4-efeito-volta-no-tempo) | ⬜ 💬 |
| 5 | [Seções em aberto: Stacks, Projetos e Contato](#fase-5-seções-em-aberto) | 💬 |
| 6 | [Release v2.0](#fase-6-release-v20) | ⬜ |

## Princípios

- **A v1 é intocável.** As únicas exceções são as registradas em [D4](#registro-de-decisões).
- **Toda etapa termina validada:** `npx tsc -b`, `npm run lint`, `npm run test:e2e` e conferência visual em http://localhost:5173.
- **Commit só com autorização explícita**, depois dos testes.
- **Este documento é atualizado a cada etapa:** status das fases, checklists e [diário de progresso](#diário-de-progresso).

## Registro de decisões

| # | Data | Decisão | Motivo |
| --- | --- | --- | --- |
| D1 | 2026-10-19 | A **v1.0 fica congelada**, sem mudanças de conteúdo nem de visual. | É o marco histórico do início da carreira. |
| D2 | 2026-10-19 | O site **abre na v2.0**. Clicar na v1.0 dispara um efeito de **"volta no tempo" de 2026 para 2023**. | Mostrar a evolução de forma lúdica. |
| D3 | 2026-10-19 | **Sem persistência:** a versão escolhida vale só durante a visita, e um reload volta para a v2.0. | A v2.0 é a vitrine principal. |
| D4 | 2026-10-19 | **Arquitetura iframe + `?lang`:** a v1 é uma segunda entrada do Vite (`v1.html`), exibida num iframe em tela cheia. Duas exceções ao congelamento: o card **v2.0** da seção Versões da v1 vira um botão para voltar a 2026, e a v1 lê o idioma inicial de `?lang=`. | Isolamento total de CSS e estado garantido pelo navegador, com mudança mínima na v1. Alternativa em [Plano B](#plano-b-duas-árvores-react). |
| D5 | 2026-10-19 | A **cor de destaque nova** (laranja do Claude) vale para **todos os destaques da v2**, não só para Header, NavBar e Footer. | Consistência visual. |
| D6 | 2026-10-19 | O **E2E roda só localmente**, fora do workflow de deploy. | É um site de portfólio, e o deploy deve continuar simples. |
| D7 | 2026-10-19 | O `src/assets/family_img.jpg` **não será comprimido**. | Escolha do autor. |

## Fase 0: Pré-desenvolvimento

✅ Concluída em 2026-10-19.

- [x] Redux substituído por React Context para o idioma (`8c4635d`)
- [x] Node 24 fixado em `.node-version` e usado no CI (`ceea752`)
- [x] React 19 (`dba9a19`)
- [x] ESLint substituído por oxlint (`82f1cc4`)
- [x] Vite 8, plugin-react 6 e TypeScript 7 (`05b6b52`)
- [x] Remoção do `gh-pages`, chegando a 0 vulnerabilidades (`a7b327e`)
- [x] Largura real nos links da nav (`94fd0c0`)
- [x] Viewport via `useSyncExternalStore` (`3abaa34`)
- [x] Smoke tests E2E com Playwright (`f15910d`)
- [x] README descrevendo o projeto (`0af8673`)

## Fase 1: Fundação de versões

⬜ Objetivo: separar a v1 congelada da v2 e permitir trocar entre elas em runtime.

**Estrutura de pastas:**

- [ ] Mover o código atual de `src/` para `src/versions/v1/`, sem alterações. Os assets também são copiados, para que a v1 não dependa de mudanças futuras.
- [ ] Criar `src/versions/v2/` partindo de uma cópia da v1. É nela que a v2 evolui.

**Build multi-página:**

- [ ] Configurar o Vite com duas entradas: `index.html` → shell da v2 e `v1.html` → `src/versions/v1/main.tsx`. Confirmar na implementação qual opção de entradas o Vite 8 usa (`build.rolldownOptions.input` ou `build.rollupOptions.input`).

**Shell da v2:**

- [ ] Guardar a versão ativa em estado (sem persistência, [D3](#registro-de-decisões)).
- [ ] Quando a v1 estiver ativa, renderizar `<iframe src="/v1.html?lang=…">` em tela cheia.
- [ ] O card **v1.0** da seção Versões da v2 dispara a troca.
- [ ] Ouvir `message` do iframe e voltar para a v2 ao receber `{ type: "switch-version", version: "v2" }`, validando a origem.

**Exceções na v1** ([D4](#registro-de-decisões)):

- [ ] O card **v2.0** da seção Versões vira um botão funcional, "Voltar para 2026" / "Back to 2026". Ele envia `postMessage` para a página-mãe. Se a v1 estiver aberta direto, sem página-mãe, o botão leva para `/`. O resto do card continua como está.
- [ ] O `LanguageProvider` da v1 lê o idioma inicial de `?lang=english|portuguese`. Sem o parâmetro, o padrão continua sendo português.

**Testes E2E:**

- [ ] Os testes atuais passam a cobrir a v2 como padrão.
- [ ] Testes da v1 dentro do iframe, via `frameLocator`.
- [ ] Troca v2 → v1 → v2.
- [ ] Idioma preservado na ida para a v1.
- [ ] `/v1.html` aberto direto funciona.

**Referências:** o padrão de contexto em [`src/context/language.ts`](../src/context/language.ts) e [`LanguageProvider.tsx`](../src/context/LanguageProvider.tsx), e o ponto de troca em [`src/pages/versions/index.tsx`](../src/pages/versions/index.tsx), onde hoje o botão é `disabled`. Testes em [`e2e/smoke.spec.ts`](../e2e/smoke.spec.ts) e [`playwright.config.ts`](../playwright.config.ts).

## Fase 2: Identidade visual da v2

⬜ Objetivo: trocar o verde `#6eb40a` pela cor do Claude em todos os destaques da v2 ([D5](#registro-de-decisões)).

- [ ] Criar o token de cor `--accent` na v2, partindo do laranja do Claude: **`#D97757`** (hex a validar com o ícone oficial).
- [ ] Ajustar **NavBar**: hover e item ativo (`color` e `text-shadow`).
- [ ] Ajustar **Header**: hover dos ícones de contato e seleção do idioma.
- [ ] Ajustar **Footer**: hover dos links.
- [ ] Ajustar **Seções**: card da versão atual, badges de tecnologia dos projetos e envelope do contato.
- [ ] Os ícones SVG do header e os links do footer usam hoje um `filter: invert(…) hue-rotate(…)` calibrado para o verde. Trocá-lo por uma técnica que aceite `var(--accent)` diretamente, como `mask-image` com `background-color`.
- [ ] Conferir o contraste do laranja sobre o fundo `#444444`.

**Referências:** [`nav-bar.css`](../src/components/nav-bar/nav-bar.css), [`Header.module.css`](../src/components/header/Header.module.css), [`footer.css`](../src/components/footer/footer.css), [`versions.css`](../src/pages/versions/versions.css), [`projects.css`](../src/pages/projects/projects.css) e [`contact.css`](../src/pages/contact/contact.css). Os caminhos mudam para `src/versions/v2/` depois da Fase 1.

## Fase 3: Conteúdo da v2

⬜

### Sobre

- [ ] Usar os textos em português e inglês do commit `f082aaa` (`src/pages/about/index.tsx`), que tinham sido revertidos em `58dee92`. Eles cobrem a transição de carreira pela Trybe, a atuação como Full Stack numa Insurtech (Node.js, React, MariaDB), Ciência da Computação na UVV, Economia na UFES e a experiência no IBGE. Os links abrem em nova aba (`target="_blank"`).
- [ ] Manter o popup da foto da família no hover de "minha família".

Para recuperar o texto: `git show f082aaa:src/pages/about/index.tsx`

### Footer

- [ ] Citar o desenvolvimento *AI-oriented* com o Claude, atualizar o ano para 2026 e a versão para v2.0.

Rascunho para validar:

> **PT:** Desenvolvido por mim, de forma AI-oriented em parceria com o Claude, em TypeScript no Visual Studio Code, tendo como base React e Vite. © 2026 Gabriel A. Dantas - Todos os direitos reservados. v2.0
>
> **EN:** Developed by me, AI-oriented in partnership with Claude, in TypeScript on Visual Studio Code, built on React and Vite. © 2026 Gabriel A. Dantas - All rights reserved. v2.0

### Stacks

- [ ] Adicionar o **Claude** seguindo o padrão das demais stacks:
  1. O ícone oficial vai para `assets/` como `claude.svg`.
  2. Import e export em [`centralIconsFile.ts`](../src/pages/stacks/centralIconsFile.ts).
  3. A entrada `{ img: claude, alt: "claude" }` vai em [`stacksData.ts`](../src/pages/stacks/stacksData.ts).

### Versões

- [ ] Dados da v2: **v1.0** com "2023 · Versão original", que dispara a volta no tempo, e **v2.0** com "2026 · Versão atual".

## Fase 4: Efeito "volta no tempo"

⬜ 💬 Objetivo: a transição de 2026 para 2023 ao abrir a v1, e o caminho inverso ao voltar.

Ideias para decidir juntos:

- Contador de ano rolando de 2026 até 2023.
- Filtro sépia, grão de filme ou glitch durante a transição.
- Animação inversa (2023 → 2026) ao voltar para a v2.
- A animação cobre o tempo de carregamento do iframe e só termina quando a v1 estiver pronta.
- Respeitar `prefers-reduced-motion`, com uma transição simples para quem prefere menos movimento.

**Decisão:** _a definir_

## Fase 5: Seções em aberto

💬 Estas três seções serão pensadas em conjunto antes da implementação.

### Stacks: disposição dos elementos

- **Hoje:** grade de cards com ícone e nome; no mobile, só os ícones.
- **Ideias:** _a discutir_
- **Decisão:** _a definir_

### Projetos: disposição dos elementos

- **Hoje:** tabela com ano, nome, descrição, tecnologias e link. A responsividade ainda está marcada como "a analisar" em `App.css`.
- **Ideias:** _a discutir_
- **Decisão:** _a definir_

### Contato

- **Hoje:** envelope animado que abre um `mailto:` e um convite para as redes sociais.
- **Ideias:** _a discutir_
- **Decisão:** _a definir_

## Fase 6: Release v2.0

⬜

- [ ] Atualizar a versão no `package.json` para `2.0.0`.
- [ ] Atualizar o README com a arquitetura de versões (v1 congelada + iframe).
- [ ] Rodar o E2E completo (v2, v1 e troca entre elas) e fazer a revisão visual final.
- [ ] Fazer o push na `main` e acompanhar o deploy no GitHub Actions.

## Plano B: duas árvores React

> **Observação:** se a arquitetura de iframe ([D4](#registro-de-decisões)) não ficar boa, migramos para esta.

**Quando migrar:** se o iframe limitar demais a experiência. Por exemplo:

- a transição precisar transformar elementos de uma versão na outra, e não só cobrir a tela;
- o repasse de idioma via `?lang` não bastar;
- a navegação dentro do iframe ficar estranha;
- os testes ficarem frágeis.

**Como funciona:** uma única SPA. Um `VersionProvider`, no mesmo molde do [`LanguageProvider`](../src/context/LanguageProvider.tsx), guarda a versão ativa. A raiz renderiza `<V1App />`, carregada sob demanda com `React.lazy`, ou `<V2App />`. O idioma é compartilhado por um único provider.

**O que muda:**

- O Vite injeta o CSS importado no `<head>` e não o remove. Depois de visitar a v1, os seletores globais dela (`nav`, `main`, `footer`, `:root { margin }`) vazariam para a v2.
- Para evitar isso, os ~12 `import "./x.css"` da v1 passam a `import css from "./x.css?inline"`, com um componente que injeta os estilos ao montar a v1 e os remove ao desmontar.
- A v2 é escrita toda em CSS Modules, sem seletores globais e sem reaproveitar classes da v1 como `.desktop` e `.mobile`.

**Custo:** a v1 deixa de estar intocada, porque muda a forma de carregar CSS (o visual continua igual), e o isolamento passa a depender de disciplina, não do navegador.

## Diário de progresso

| Data | Fase | O que mudou | Commit |
| --- | --- | --- | --- |
| 2026-10-19 | 0 | Pré-desenvolvimento concluído: dependências, E2E, README e CSS da nav | `8c4635d` … `0af8673` |
| 2026-10-19 | — | Roadmap da v2.0 criado | _pendente_ |
