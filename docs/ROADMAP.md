# Roadmap: portfólio v2.0

Este documento orienta a modernização do portfólio e registra o andamento. A **v2.0** traz uma identidade visual nova, conteúdo atualizado e uma forma de navegar entre versões do site. A **v1.0** (2023) fica preservada, sem alterações, como marco histórico da minha trajetória como Engenheiro de Software.

**Legenda:** ⬜ a fazer · 🟨 em andamento · ✅ concluído · 💬 a definir em conjunto

## Visão geral

| Fase | Tema | Status |
| --- | --- | --- |
| 0 | [Pré-desenvolvimento](#fase-0-pré-desenvolvimento) | ✅ |
| 1 | [Fundação de versões (v1 congelada + troca em runtime)](#fase-1-fundação-de-versões) | ✅ |
| 2 | [Design da v2](#fase-2-design-da-v2) | 🟨 |
| 3 | [Conteúdo da v2](#fase-3-conteúdo-da-v2) | ⬜ |
| 4 | [Efeito "volta no tempo"](#fase-4-efeito-volta-no-tempo) | ⬜ 💬 |
| 5 | [Seções em aberto](#fase-5-seções-em-aberto) (absorvida pela Fase 2) | ➡️ |
| 6 | [Release v2.0](#fase-6-release-v20) | ⬜ |

## Estado atual e próximo passo

_Atualizado em 2026-11-18._

- **Onde paramos:**
  - A [Fase 1](#fase-1-fundação-de-versões) está concluída. O site abre na v2, o card v1.0 leva a 2023 num iframe, o botão "Voltar para 2026" e o "Voltar" do navegador ([D10](#registro-de-decisões)) trazem de volta, e tudo isso está coberto pelo E2E.
  - A [Fase 2](#fase-2-design-da-v2) virou o **design novo da v2** ([D11](#registro-de-decisões)). A direção visual está decidida (D12 e D13), e o **protótipo está concluído** na versão 8, com os pontos em aberto fechados ([D14](#registro-de-decisões)).
  - No site, a v2 ainda tem o mesmo visual e conteúdo da v1.
- **Próximo passo:** começar a [implementação na v2](#23-implementação-na-v2), recriando o protótipo em React.
- **Ao mudar o visual da v2:** os testes do `e2e/smoke.spec.ts` rodam hoje nas duas páginas, porque elas ainda compartilham o layout. O layout novo não tem nav nem seções empilhadas, então esses testes precisam ser separados: os atuais ficam só para a v1, e a v2 ganha testes próprios.
- **Decisões pendentes:**
  - validar o hex `#D97757` com o ícone oficial do Claude (Fase 2);
  - se o guia `<p>` aparece no celular, e onde (Fase 2);
  - se a digitação do `<GAD />` aparece em toda visita ou só na primeira da sessão (Fase 2);
  - validar o rascunho do footer, que já aparece no protótipo (Fase 3);
  - definir o efeito da volta no tempo (Fase 4).
- **Ambiente:** Node 26 via fnm (`.node-version`). Dev server com `npm run dev` na porta 5173. Para assistir os testes: `SLOWMO=600 npx playwright test --headed --workers 1`.

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
| D8 | 2026-11-17 | O projeto passa a usar o **Node 26 LTS**, e o `@types/node` acompanha a mesma versão major. | O Node 24 entrou em Maintenance em 2026-10-20. O 26 é Active LTS até 2027-10, com suporte até 2029-04. |
| D9 | 2026-11-17 | O **Dependabot** checa npm e Actions **uma vez por mês**, com um PR agrupado por ecossistema. Os PRs são validados localmente antes do merge. | Evitar o atraso acumulado que a revisão encontrou: um Vite com falha crítica e Actions de 1 a 3 versões major atrás. |
| D10 | 2026-11-17 | O **"Voltar" do navegador desfaz uma ação por vez**: primeiro as seções visitadas na v1, depois a volta para 2026. O botão "Voltar para 2026" conta como uma ação nova, então o "Voltar" depois dele reabre 2023. | Comportamento previsível, igual ao de qualquer site com várias telas. Sem o marcador no histórico, o último "Voltar" sairia do site. |
| D11 | 2026-11-17 | A v2 ganha um **design novo**, e não só a troca de cor. A Fase 2 vira "Design da v2" (direção, protótipo e implementação) e absorve a Fase 5. | Só recolorir manteria o layout padrão da v1. A v2 precisa de identidade própria, e o contraste com 2023 reforça a viagem no tempo da Fase 4. |
| D12 | 2026-11-17 | **A paleta da v1 fica:** fundo `#444444` e texto `#dce6cf`. O laranja `#D97757` substitui o verde. Para texto pequeno, usa-se um tom mais claro, `#EDA48C`. O estilo é uma **base minimalista com detalhes técnicos**: sans no texto e JetBrains Mono nos detalhes (tags, rótulos, datas). | Continuidade com a v1 e com o banner do LinkedIn. O laranja tem contraste de 3.1:1 sobre `#444444`, bom para títulos, ícones e bordas, mas abaixo do mínimo de 4.5:1 para texto pequeno; o `#EDA48C` tem 4.8:1. O verde antigo também não passava (3.8:1). |
| D13 | 2026-11-17 | **Layout:** a coluna de identidade da v1 continua à esquerda, com nome, cargo, idiomas, tagline, contatos e footer. A nav e as seções empilhadas saem. No **centro da página** fica o componente **`<GAD />`** (as iniciais como um componente React), com um cursor piscando. Clicar nele abre as seções em órbita, como componentes-filhos (`<Sobre />`, `<Stacks />`…), e cada seção abre na área à direita. No celular, a órbita vira uma árvore de componentes (`├── <Sobre />`). | Uma marca de dev memorável, no lugar do layout padrão de portfólio, e coerente com a narrativa de desenvolvimento *AI-oriented*. |
| D14 | 2026-11-18 | **Movimento e guia da v2**, escolhidos num painel de testes do protótipo. **Entrada da seção:** a órbita se recolhe, o `<GAD />` vai para o canto e o título é digitado (a alternativa, a tag clicada voando até virar o título, foi descartada). **Ritmo:** as durações da versão 3, com a órbita em cerca de 0,8 s e a entrada da seção em cerca de 0,8 s. **Convite:** ao carregar, o cursor digita o `<GAD />`, e só depois aparecem o `// clique para explorar` e o guia. **Guia:** no vão da coluna de identidade, onde a v1 tinha a nav, um `<p>` digitado explica a seção apontada ou aberta. **Digitação:** cada uma no seu ritmo: `<GAD />` irregular (70 a 140 ms por letra), títulos a 45 ms por letra e guia a 2 letras a cada 16 ms. | A órbita sozinha não dizia o que cada seção tem, e o vão da coluna ficava vazio. Uma velocidade única de digitação foi testada e descartada: devagar, o guia demora demais; rápida, o `<GAD />` perde o efeito. |

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

Revisão de dependências na volta da pausa, em 2026-11-17:

- [x] Vite 8.3.8, que corrige a falha crítica [GHSA-p4f5-76q4-ffq7](https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7), além de plugin-react 6.3, oxlint 1.94 e Playwright 1.65 (`47dada6`)
- [x] Actions do deploy nos runtimes Node 24: checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5 e deploy-pages v5 (`7fe02ec`)
- [x] Node 26 LTS ([D8](#registro-de-decisões)) (`029b3d2`)
- [x] Dependabot mensal e agrupado ([D9](#registro-de-decisões)) (`2d68a4f`)
- Avaliados e descartados por ora: React Compiler (app pequeno, traria o Babel de volta ao build), lint com tipos via `oxlint-tsgolint` (pouco código assíncrono) e o formatador `oxfmt` (ainda na versão 0.x). Se um formatador entrar no futuro, ele deve ignorar `src/versions/v1/`.

## Fase 1: Fundação de versões

✅ Concluída em 2026-11-17. Objetivo: separar a v1 congelada da v2 e permitir trocar entre elas em runtime.

**Estrutura de pastas:**

- [x] Mover o código atual de `src/` para `src/versions/v1/`, sem alterações. Os assets vão junto, para que a v1 não dependa de mudanças futuras. Validado com o mesmo hash de bundle e screenshots idênticos pixel a pixel (desktop e mobile, PT e EN).
- [x] Criar `src/versions/v2/` partindo de uma cópia da v1. É nela que a v2 evolui.

**Build multi-página:**

- [x] Configurar o Vite com duas entradas: `index.html` → `src/versions/v2/main.tsx` (shell da v2) e `v1.html` → `src/versions/v1/main.tsx`, em `build.rolldownOptions.input` (`rollupOptions` está obsoleto no Vite 8). Enquanto o CSS e as imagens forem idênticos, o build os gera uma vez só, e o React fica num chunk compartilhado.

**Shell da v2:**

- [x] Guardar a versão ativa em estado (sem persistência, [D3](#registro-de-decisões)): `VersionProvider` e `useVersion()` em [`src/versions/v2/context/`](../src/versions/v2/context/VersionProvider.tsx), no mesmo molde do idioma.
- [x] Quando a v1 estiver ativa, renderizar `<iframe src="/v1.html?lang=…">` em tela cheia. A v2 continua montada atrás, preservando a rolagem, mas fica `inert` e sem barra de rolagem.
- [x] O card **v1.0** da seção Versões da v2 dispara a troca, com o botão "Voltar para 2023" / "Back to 2023". O card v2.0 passa a ser o atual; os textos finais ficam para a Fase 3.
- [x] Ouvir `message` do iframe e voltar para a v2 ao receber `{ type: "switch-version", version: "v2" }`. Só vale a mensagem com a mesma origem (`origin`) e vinda do próprio iframe (`source`).
- [x] Ao abrir a v1, empilhar um marcador no histórico (`history.pushState`) e tratar o `popstate`, para o "Voltar" do navegador seguir a [D10](#registro-de-decisões). O botão "Voltar para 2026" também entra no histórico como uma ação nova. Depois de aberta, a v1 é escondida (`visibility: hidden` e `inert`), nunca destruída: assim as entradas da nav dela continuam válidas e não há "Voltar morto". Se o idioma da v2 mudar entre duas visitas, a v1 recarrega no idioma novo.

**Exceções na v1** ([D4](#registro-de-decisões)):

- [x] O card **v2.0** da seção Versões vira um botão funcional, "Voltar para 2026" / "Back to 2026". Ele envia `postMessage` para a página-mãe. Se a v1 estiver aberta direto, sem página-mãe, o botão leva para `/`. O resto do card continua como está. O CSS do botão também muda, para ele parecer clicável.
- [x] O `LanguageProvider` da v1 lê o idioma inicial de `?lang=english|portuguese`. Sem o parâmetro, o padrão continua sendo português. Valores inválidos também caem no português.

**Testes E2E:**

- [x] Os testes atuais passam a cobrir a v2 como padrão e também rodam na v1 aberta direto (`e2e/smoke.spec.ts`). O que é compartilhado foi para `e2e/fixtures.ts`.
- [x] Testes da v1 dentro do iframe, via `frameLocator` (`e2e/versions.spec.ts`).
- [x] Troca v2 → v1 → v2, voltando ao mesmo ponto da v2, e "Voltar"/"Avançar" do navegador seguindo a D10.
- [x] Idioma preservado na ida para a v1, inclusive quando muda entre duas visitas.
- [x] `/v1.html` aberto direto funciona, com `?lang=` e o botão levando para `/`.
- [x] Segurança: a v2 só aceita mensagens do próprio iframe. Para conferir que os testes pegam defeitos reais, dois bugs foram introduzidos de propósito (aceitar mensagens de qualquer janela e destruir a v1 ao voltar), e cada um foi pego pelo teste certo.

**Referências:** o shell em [`VersionProvider.tsx`](../src/versions/v2/context/VersionProvider.tsx) e [`version.ts`](../src/versions/v2/context/version.ts), as exceções da v1 em [`LanguageProvider.tsx`](../src/versions/v1/context/LanguageProvider.tsx) e [`pages/versions/index.tsx`](../src/versions/v1/pages/versions/index.tsx), as duas entradas em [`vite.config.ts`](../vite.config.ts) e os testes em [`e2e/`](../e2e/).

## Fase 2: Design da v2

🟨 Objetivo: dar à v2 um design próprio ([D11](#registro-de-decisões)), com a paleta da v1, o laranja do Claude como destaque ([D5](#registro-de-decisões), [D12](#registro-de-decisões)) e o layout do `<GAD />` em órbita ([D13](#registro-de-decisões)). A fase tem três etapas: direção visual, protótipo e implementação.

### 2.1 Direção visual

✅ Decidida em 2026-11-17.

- [x] **Paleta:** a da v1 continua, com o laranja no lugar do verde ([D12](#registro-de-decisões)).
- [x] **Contraste** sobre `#444444`:

  | Cor | Uso | Contraste |
  | --- | --- | --- |
  | `#dce6cf` | texto | 7.5:1 |
  | `#b9c2ad` | texto secundário | 5.3:1 |
  | `#D97757` | títulos grandes, ícones, bordas e cursor | 3.1:1 |
  | `#EDA48C` | links e texto pequeno em laranja | 4.8:1 |

- [x] **Estilo:** base minimalista com detalhes técnicos ([D12](#registro-de-decisões)). Na comparação, o estilo editorial foi descartado, porque espalharia o laranja em áreas grandes, onde o contraste dele é fraco.
- [x] **Layout:** coluna de identidade + `<GAD />` em órbita ([D13](#registro-de-decisões)). O usuário trouxe a ideia do ícone central que abre as seções em volta, e o `<GAD />` foi escolhido entre `<GAD />`, `>_`, `{ G }` e um monograma.
- [ ] Validar o hex `#D97757` com o ícone oficial do Claude.

### 2.2 Protótipo interativo

✅ Concluído em 2026-11-18, na versão 8. A versão 3 foi aprovada em 2026-11-17. As versões 4 a 7 tiveram um painel de testes temporário para comparar a entrada da seção, o ritmo e o convite; as escolhas estão na [D14](#registro-de-decisões), e o painel saiu na versão 8.

- **Onde ver:** [artifact privado](https://claude.ai/artifact/9yt6MozuLrAMGrAq6QQeRE), na versão 8. O código fica guardado em [`docs/prototypes/v2-orbita.html`](prototypes/v2-orbita.html), num HTML único com os ícones embutidos. A pasta `docs/` fica fora do build e do deploy.
- **O que ele mostra:**
  - **Convite:** ao carregar, o cursor laranja pisca e digita o `<GAD />` no centro da página (só a tag, sem círculo nem moldura). Depois aparecem o `// clique para explorar` e o guia. Clicar durante a digitação completa a tag na hora e abre a órbita. Quem abre o site já num endereço de seção (`#projetos`) não vê a digitação.
  - **Guia:** no vão da coluna de identidade, um `<p>` digitado com uma apresentação no início, um texto sobre a órbita e a explicação da seção apontada (mouse ou Tab) ou aberta. Ao passar o mouse de uma seção para outra, ele não volta ao texto da órbita no meio do caminho. Ele tem altura reservada, então a página não pula, e a órbita não encosta nele. Os textos são provisórios ([Fase 3](#fase-3-conteúdo-da-v2)).
  - **Efeito 1, a órbita:** ao clicar, as cinco seções saem do centro uma a uma, como tags sem moldura, ligadas ao `<GAD />` por linhas finas. As linhas vão da borda de um texto à borda do outro. Ao passar o mouse, a seção e a linha dela acendem em laranja.
  - **Efeito 2, a seção:** a órbita se recolhe, o `<GAD />` encolhe para o canto superior da área de conteúdo e vira o botão de início, e a seção sobe com o título sendo "digitado".
  - **Navegação:** cada estado tem um endereço (`#explorar`, `#sobre`, `#projetos`…). O "Voltar" do navegador desfaz uma ação por vez, no espírito da [D10](#registro-de-decisões). Esc volta um nível.
  - **Posição:** o `<GAD />` fica no centro exato da página de 1280 px de largura para cima. A órbita usa o maior raio, até 280 px, que não encoste no texto e nos ícones da coluna de identidade. Em telas mais estreitas, ela desliza para a direita em vez de encolher.
  - **Celular** (até 820 px): a coluna de identidade vai para o topo, e a órbita vira uma árvore de componentes. O guia fica oculto, porque ali não existe o vão.
  - **Acessibilidade:** o `<GAD />` e as seções são botões navegáveis por Tab, com foco visível. Com `prefers-reduced-motion`, as animações são desligadas, e o `<GAD />` e o guia já aparecem prontos.
  - **Tempos:** todas as durações passam por um multiplicador, `--tempo: 1` no CSS e `TEMPO` no script. Foi ele que o painel de testes usou para comparar os ritmos.
- **Verificação da versão 8 no Chrome:** 1280, 1440 e 1920 px, celular e menos movimento, sem erros no console.

### 2.3 Implementação na v2

⬜ Recriar o protótipo em React, dentro de `src/versions/v2/`.

- [ ] Tokens de cor e de fonte num CSS global da v2 (`--bg`, `--fg`, `--fg-muted`, `--accent`, `--accent-text`, `--font-mono`…).
- [ ] Fonte JetBrains Mono. Decidir entre Google Fonts e hospedar o arquivo no próprio site.
- [ ] Coluna de identidade com o conteúdo novo da [Fase 3](#fase-3-conteúdo-da-v2) (cargo e canais oficiais). Os ícones usam `mask-image` com `background-color`, no lugar do `filter: hue-rotate(…)` calibrado para o verde.
- [ ] Componentes `<GAD />` e órbita, com o cálculo de raio e deslocamento do protótipo. No celular, a árvore.
- [ ] Seções no painel da direita, com o efeito de entrada da [D14](#registro-de-decisões).
- [ ] Digitação do `<GAD />` ao carregar e guia `<p>` na coluna de identidade, com os tempos da D14. Decidir se a digitação do `<GAD />` aparece em toda visita ou só na primeira da sessão, e se o guia aparece no celular.
- [ ] Textos do guia em português e inglês, revisados na [Fase 3](#fase-3-conteúdo-da-v2).
- [ ] Endereços por hash e histórico seguindo a D10. Conferir a convivência com o `pushState` do `VersionProvider`, que hoje marca a troca de versão.
- [ ] `<Versões />` mantém o botão "Voltar para 2023", que já funciona.
- [ ] Teclado (Tab e Esc), foco visível e `prefers-reduced-motion`.
- [ ] E2E: separar o `smoke.spec.ts` (os testes atuais ficam para a v1) e criar testes da v2 (órbita, seções, hash e "Voltar"). Os testes de troca de versão (`versions.spec.ts`) precisam abrir a órbita antes de chegar ao card v1.0.
- [ ] Remover da v2 o que deixou de ser usado: nav, seções empilhadas e o CSS global herdado da v1.

## Fase 3: Conteúdo da v2

⬜

### Coluna de identidade

Ajustes que alinham o site ao LinkedIn e ao GitHub (decididos em 2026-11-17):

- [ ] Cargo: "Desenvolvedor Web FullStack" vira **"Desenvolvedor Full Stack"** / "Full Stack Developer".
- [ ] Contatos: só os **canais oficiais**, GitHub, LinkedIn e e-mail. Instagram e Facebook saem.
- [ ] Revisar a tagline "Desenvolvo produtos web responsivos e multi-dispositivos".

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
  2. Import e export em [`centralIconsFile.ts`](../src/versions/v2/pages/stacks/centralIconsFile.ts).
  3. A entrada `{ img: claude, alt: "claude" }` vai em [`stacksData.ts`](../src/versions/v2/pages/stacks/stacksData.ts).

### Versões

- [ ] Dados da v2: **v1.0** com "2023 · Versão original", que dispara a volta no tempo, e **v2.0** com "2026 · Versão atual".

## Fase 4: Efeito "volta no tempo"

⬜ 💬 Objetivo: a transição de 2026 para 2023 ao abrir a v1, e o caminho inverso ao voltar. A ordem das fases foi mantida (decidido em 2026-11-17): esta vem depois do design e do conteúdo. O efeito deve usar a mesma linguagem de movimento da órbita do `<GAD />`, com a mesma curva e durações curtas.

Ideias para decidir juntos:

- Contador de ano rolando de 2026 até 2023.
- Filtro sépia, grão de filme ou glitch durante a transição.
- Animação inversa (2023 → 2026) ao voltar para a v2.
- A animação cobre o tempo de carregamento do iframe e só termina quando a v1 estiver pronta.
- Respeitar `prefers-reduced-motion`, com uma transição simples para quem prefere menos movimento.

**Decisão:** _a definir_

## Fase 5: Seções em aberto

➡️ **Absorvida pela [Fase 2](#fase-2-design-da-v2) em 2026-11-17** ([D11](#registro-de-decisões)). Com o layout novo, a disposição de cada seção faz parte do design da v2. O [protótipo](#22-protótipo-interativo) já traz uma primeira proposta: Stacks em grupos de chips, Projetos em lista e Contato em lista de canais. O registro abaixo descreve como as seções eram na v1.

**Achado na v1:** no mobile (390 px), a página tem rolagem horizontal, com 504 a 514 px de largura. O layout novo da v2 não herda esse problema, mas isso precisa ser conferido na implementação.

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

**Como funciona:** uma única SPA. Um `VersionProvider`, no mesmo molde do [`LanguageProvider`](../src/versions/v2/context/LanguageProvider.tsx), guarda a versão ativa. A raiz renderiza `<V1App />`, carregada sob demanda com `React.lazy`, ou `<V2App />`. O idioma é compartilhado por um único provider.

**O que muda:**

- O Vite injeta o CSS importado no `<head>` e não o remove. Depois de visitar a v1, os seletores globais dela (`nav`, `main`, `footer`, `:root { margin }`) vazariam para a v2.
- Para evitar isso, os ~12 `import "./x.css"` da v1 passam a `import css from "./x.css?inline"`, com um componente que injeta os estilos ao montar a v1 e os remove ao desmontar.
- A v2 é escrita toda em CSS Modules, sem seletores globais e sem reaproveitar classes da v1 como `.desktop` e `.mobile`.

**Custo:** a v1 deixa de estar intocada, porque muda a forma de carregar CSS (o visual continua igual), e o isolamento passa a depender de disciplina, não do navegador.

## Diário de progresso

| Data | Fase | O que mudou | Commit |
| --- | --- | --- | --- |
| 2026-10-19 | 0 | Redux → Context, Node 24, React 19, oxlint, Vite 8 + TS 7, remoção do gh-pages (0 vulnerabilidades, 244 → 29 pacotes) | `8c4635d` … `a7b327e` |
| 2026-10-19 | 0 | Correção da largura da nav, viewport com `useSyncExternalStore`, smoke tests E2E e README novo | `94fd0c0` … `0af8673` |
| 2026-10-19 | — | Roadmap da v2.0 criado, com decisões D1 a D7 e arquitetura iframe + `?lang` | `d9491e3` |
| 2026-10-31 | — | Pausa longa para colocar as matérias da UVV em dia | — |
| 2026-11-17 | 0 | Revisão de dependências: Vite com correção de segurança, plugin-react, oxlint, Playwright, Actions do deploy, Node 26 LTS e Dependabot (D8 e D9) | `47dada6` … `2d68a4f` |
| 2026-11-17 | 1 | v1 movida para `src/versions/v1/` só com renomeações: mesmo hash de bundle e screenshots idênticos. Achado para a Fase 5: no mobile (390 px), a v1 tem rolagem horizontal, com 504 a 514 px de largura | `338968a` |
| 2026-11-17 | 1 | v2 criada em `src/versions/v2/` como cópia da v1, ainda fora do build. No Git, só o `Jest JS.svg` difere: o `core.autocrlf` normalizou CRLF → LF, sem efeito visual | `7edede5` |
| 2026-11-17 | 1 | Build com duas páginas: `/` abre a v2 e `/v1.html` abre a v1. Screenshots de dev e produção idênticos à referência, com o `family_img.jpg` emitido uma vez só | `d8ff841` |
| 2026-11-17 | 1 | Shell da v2: o card v1.0 abre a v1 num iframe em tela cheia, com a v2 `inert` atrás. Verificado no Chrome em desktop e mobile, PT e EN. Decisão D10 sobre o "Voltar" do navegador | `914654b` |
| 2026-11-17 | 1 | Ciclo 2026 ⇄ 2023 completo: exceções da v1 (botão "Voltar para 2026" e `?lang=`) e, na v2, `postMessage` com origem validada e histórico seguindo a D10. A v1 passa a ser escondida, não destruída, o que elimina o "Voltar morto". 49 checks no Chrome; na v1 standalone, só a área do botão mudou | `c466c59`, `7d98b7c` |
| 2026-11-17 | 1 | **Fase 1 concluída.** E2E com 30 testes (antes eram 7): o smoke roda na v2 e na v1, e o `versions.spec.ts` cobre a troca, o idioma, a D10, a segurança e a v1 direta. Dois bugs introduzidos de propósito foram pegos | `54d38c1` |
| 2026-11-17 | 2 | Decisões D11 a D13: design novo da v2, paleta da v1 com o laranja, base minimalista com detalhes técnicos e o layout do `<GAD />` em órbita. A Fase 5 foi absorvida pela Fase 2 | — |
| 2026-11-17 | 2 | Protótipo interativo em 3 versões: (1) primeira proposta; (2) sem molduras, só as tags e o cursor; (3) o `<GAD />` no centro da página, com o raio da órbita se ajustando à coluna de identidade. A versão 3 foi aprovada e guardada em `docs/prototypes/` | `2b0d061` |
| 2026-11-18 | 2 | **Protótipo concluído na versão 8** (D14). As versões 4 a 7 tiveram um painel de testes (entrada da seção, ritmo, digitação do `<GAD />` e uma velocidade única de digitação, testada e descartada) e ganharam o guia `<p>` no vão da coluna de identidade. Na versão 8, o painel saiu e ficaram só as escolhas | `a3c9f36` |
