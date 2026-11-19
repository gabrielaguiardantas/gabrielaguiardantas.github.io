# Roadmap: portfólio v2.0

Este documento orienta a modernização do portfólio e registra o andamento. A **v2.0** traz uma identidade visual nova, conteúdo atualizado e uma forma de navegar entre versões do site. A **v1.0** (2023) fica preservada, sem alterações, como marco histórico da minha trajetória como Engenheiro de Software.

**Legenda:** ⬜ a fazer · 🟨 em andamento · ✅ concluído · 💬 a definir em conjunto

## Visão geral

| Fase | Tema | Status |
| --- | --- | --- |
| 0 | [Pré-desenvolvimento](#fase-0-pré-desenvolvimento) | ✅ |
| 1 | [Fundação de versões (v1 congelada + troca em runtime)](#fase-1-fundação-de-versões) | ✅ |
| 2 | [Design da v2](#fase-2-design-da-v2) | ✅ |
| 3 | [Conteúdo da v2](#fase-3-conteúdo-da-v2) | ✅ |
| 4 | [Efeito "volta no tempo"](#fase-4-efeito-volta-no-tempo) | ✅ |
| 5 | [Seções em aberto](#fase-5-seções-em-aberto) (absorvida pela Fase 2) | ➡️ |
| 6 | [Release v2.0](#fase-6-release-v20) | ✅ |
| 7 | [v2.1.0: correções e currículo em PDF](#fase-7-v210) | ✅ |

## Estado atual e próximo passo

_Atualizado em 2026-11-19._

- **Onde paramos:**
  - A [Fase 1](#fase-1-fundação-de-versões) está concluída. O site abre na v2, o card v1.0 leva a 2023 num iframe, o botão "Voltar para 2026" e o "Voltar" do navegador ([D10](#registro-de-decisões)) trazem de volta, e tudo isso está coberto pelo E2E.
  - A [Fase 2](#fase-2-design-da-v2) virou o **design novo da v2** ([D11](#registro-de-decisões)). A direção visual está decidida (D12 e D13), e o **protótipo está concluído** na versão 8, com os pontos em aberto fechados ([D14](#registro-de-decisões)).
  - A [implementação na v2](#23-implementação-na-v2) está **concluída** e no ar.
  - A [Fase 3](#fase-3-conteúdo-da-v2) está **concluída**: todo o conteúdo da v2 foi revisado e alinhado ao LinkedIn e ao GitHub ([D17](#registro-de-decisões)).
  - A [Fase 4](#fase-4-efeito-volta-no-tempo) está **concluída**: toda troca de versão passa pela volta no tempo ([D18](#registro-de-decisões)).
  - A [Fase 6](#fase-6-release-v20) está **concluída**: a v2.0 foi lançada, com a tag `v2.0.0`.
  - A [Fase 7](#fase-7-v210) está **concluída**: a v2.1.0 traz as correções pós-lançamento, o currículo em PDF (PT e EN) com o botão na coluna de identidade e a abertura no idioma do navegador ([D19](#registro-de-decisões)), com a tag `v2.1.0`.
- **Próximo passo:** o push da `main` e da tag `v2.1.0` e o deploy, feitos pelo usuário. Depois disso, nenhuma fase fica aberta.
- **Decisões pendentes:** nenhuma.
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
| D15 | 2026-11-18 | **Endereços e fonte da v2.** Os endereços ficam em **inglês fixo**, iguais nos dois idiomas: `/` para o início, `#explore` para a órbita e `#about`, `#stacks`, `#projects`, `#versions` e `#contact` para as seções. A **JetBrains Mono** é servida pelo próprio site, pelo pacote `@fontsource-variable/jetbrains-mono`. Com a v1 aberta, a barra de endereço continua mostrando o endereço da v2: a nav da v1 muda só o endereço do iframe. | Trocar o idioma não muda o endereço, e um link compartilhado vale nos dois idiomas. A fonte não depende do Google nem da rede, e é atualizada pelo Dependabot. Espelhar o endereço da v1 na barra faria `#stacks` abrir a seção da v2, e um reload teria que reabrir 2023, contra a [D3](#registro-de-decisões). |
| D16 | 2026-11-18 | **Convite, guia e telas baixas.** A digitação do `<GAD />` acontece em **toda visita** que abre no início. O guia `<p>` fica **oculto no celular**. Telas de até 760 px de altura, como a maioria dos notebooks, recebem uma **coluna de identidade compacta**; telas de até 520 px, como o celular deitado, recebem a **coluna única** do celular, com a árvore. | A digitação a cada visita é a opção mais simples e segue a D3, sem nada guardado entre visitas. No celular não existe o vão nem o "apontar" com o mouse. Um notebook de 1366×768 deixa só uns 650 px úteis no navegador, e a coluna precisava de 620 a 720 px; deitado, o celular cortava a órbita. |
| D17 | 2026-11-18 | **Conteúdo da v2**, alinhado ao LinkedIn e ao GitHub. **Sobre:** a abertura e as conquistas do Sobre do LinkedIn, a formação, um parágrafo sobre a prática na Fitinsur, a trajetória com links e, no fim, como tudo começou, com a foto da família (miniatura ao passar o mouse, ampliada ao clicar). **Stacks:** os grupos das Hard skills do LinkedIn, mais o que os projetos mostram, com o Claude num grupo próprio e todos os chips iguais. **Projetos:** os 6 fixados no GitHub, com os textos do README, uma observação sobre o código privado da Fitinsur e a seleção, e um link para todos os repositórios. **Mantidos:** a tagline em português, o "Vamos conversar?" do Contato e o card "Em breve" da v2.0 dentro da v1. | Os três canais contam a mesma história. Um chip destacado parecia um item selecionado. Um link "no ar" para o próprio site não leva a lugar nenhum. A v1 é a cápsula do tempo de 2023 ([D1](#registro-de-decisões)), quando a v2 era mesmo "em breve". |
| D18 | 2026-11-18 | **Efeito da volta no tempo:** o **contador** com o `<GAD />`, escolhido num protótipo entre quatro efeitos (terminal, contador, filme antigo e rebobinar) e cinco formas de contador. A página escurece, `<GAD year={2026} />` aparece grande e o último dígito rola 6 → 5 → 4 → 3, com `// voltando no tempo` embaixo; depois a v1 aparece. Na volta, o mesmo efeito rola de 2023 a 2026, com `// de volta ao presente`. O efeito roda em toda troca de versão (card, botão "Voltar para 2026" e "Voltar"/"Avançar" do navegador), dura cerca de 1,7 s e, na primeira visita, espera a v1 carregar, parado em 2023 com `// carregando 2023…`. Com "menos movimento", vira uma troca suave de 0,3 s. | O `<GAD />` é o centro da navegação da v2, então vê-lo "mudar de ano" liga o efeito à identidade do site. A forma é curta o bastante para ficar grande na tela e ser lida em menos de 2 segundos. O efeito cobre o carregamento do iframe, que antes aparecia de repente. |
| D19 | 2026-11-19 | **Idioma inicial:** a v2 abre no **idioma preferido do navegador**: português (pt-BR, pt-PT…) em PT e qualquer outro em inglês. A bandeira troca o idioma só durante a visita, **sem guardar a escolha** (nada de `localStorage`). O currículo em PDF segue o idioma ativo. | A primeira visita é a que mais importa, e um recrutador de fora já chega em inglês, o que guardar a escolha não resolveria. Fica no espírito da [D3](#registro-de-decisões): nada guardado entre visitas. Efeitos aceitos: um navegador brasileiro configurado em inglês abre em inglês, e o robô do Google indexa o texto das seções em inglês (o título e a descrição continuam fixos em PT no HTML). |

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
- [x] Hex `#D97757` validado (2026-11-18): é a cor oficial do Claude no catálogo Simple Icons, que cita o claude.ai como fonte.

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

✅ Concluída em 2026-11-18. O protótipo foi recriado em React, dentro de `src/versions/v2/`, em 8 passos: (0) testes, (1) tokens e coluna de identidade, (2) endereços, `<GAD />` e órbita, (3) seções, (4) digitação e guia, (5) celular, (6) acessibilidade e E2E, (7) limpeza.

- [x] Tokens de cor e de fonte em [`index.css`](../src/versions/v2/index.css) (`--bg`, `--fg`, `--fg-muted`, `--accent`, `--accent-text`, `--font-mono`…).
- [x] Fonte JetBrains Mono servida pelo próprio site ([D15](#registro-de-decisões)).
- [x] Coluna de identidade em [`components/identity/`](../src/versions/v2/components/identity/index.tsx), com o cargo e os canais oficiais da [Fase 3](#fase-3-conteúdo-da-v2). Os ícones usam `mask-image` com `background-color`, no lugar do `filter: hue-rotate(…)`. O footer de 2026 linka Claude, TypeScript, Visual Studio Code, React e Vite. O `lang` da página segue o idioma.
- [x] Componentes `<GAD />` e órbita em [`components/stage/`](../src/versions/v2/components/stage/index.tsx). O cálculo de raio e deslocamento do protótipo virou uma função sem DOM ([`orbitLayout.ts`](../src/versions/v2/components/stage/orbitLayout.ts)), e a coluna de identidade marca o que a órbita não pode cobrir com `data-orbit-avoid`. No celular, a árvore (adiantada do passo 5).
- [x] Seções no painel da direita, em [`components/sections/`](../src/versions/v2/components/sections/index.tsx), com o efeito de entrada da [D14](#registro-de-decisões): o `<GAD />` vai para o canto e o título é digitado. O conteúdo é o provisório do protótipo, em português e inglês.
- [x] Digitação do `<GAD />` ao carregar ([`useIntro.ts`](../src/versions/v2/components/stage/useIntro.ts)) e guia `<p>` na coluna de identidade ([`components/guide/`](../src/versions/v2/components/guide/index.tsx)), com os tempos da D14 e as escolhas da [D16](#registro-de-decisões): digitação em toda visita e guia oculto no celular.
- [x] Textos do guia em português e inglês. A revisão fica para a [Fase 3](#fase-3-conteúdo-da-v2).
- [x] Celular e telas baixas ([D16](#registro-de-decisões)): coluna compacta até 760 px de altura e coluna única até 520 px. A consulta fica em [`layout.ts`](../src/versions/v2/layout.ts). No toque, o hover não "gruda" mais no último elemento tocado.
- [x] Endereços por hash ([D15](#registro-de-decisões)) e histórico seguindo a D10, em [`context/route.ts`](../src/versions/v2/context/route.ts). O endereço é a fonte da verdade; o `VersionProvider` guarda a versão no `state` da entrada, sem mudar o endereço, então os dois convivem no mesmo histórico.
- [x] `<Versões />` mantém o botão "Voltar para 2023", e a volta de 2023 retorna à mesma seção.
- [x] Teclado (Tab e Esc), foco visível e `prefers-reduced-motion`. O foco acompanha a navegação: vai para o título da seção aberta e, ao voltar, para a seção de onde se veio ou para o `<GAD />`. Ele também entra na v1 e volta ao botão que a abriu. O título da aba diz a seção aberta. Conferido na árvore de acessibilidade do Chrome e, na [Fase 7](#fase-7-v210), com o NVDA.
- [x] E2E: o smoke virou [`e2e/v1.spec.ts`](../e2e/v1.spec.ts), só para a v1, e a v2 ganhou o [`e2e/v2.spec.ts`](../e2e/v2.spec.ts): coluna de identidade, navegação, layout da órbita em 6 tamanhos de tela e no celular deitado, seções, convite, guia, teclado e foco. O `versions.spec.ts` chega ao card v1.0 pela órbita. São 96 testes no total, estáveis em 3 repetições.
- [x] Remover da v2 o que deixou de ser usado: a nav, as seções empilhadas, o CSS global herdado da v1, o popup e 30 ícones antigos. O `family_img.jpg` ficou para a decisão do Sobre na Fase 3; sem import, ele não entra no build da v2.
- [x] Build de produção conferido no Chrome (desktop e celular): fonte servida pelo próprio site, nenhuma requisição externa e nenhum erro no console.

## Fase 3: Conteúdo da v2

✅ Concluída em 2026-11-18 ([D17](#registro-de-decisões)). O conteúdo segue a base comum aos três canais: o Sobre do LinkedIn, a linha do tempo canônica e os projetos fixados no GitHub. Os textos estão nos próprios componentes de [`components/sections/`](../src/versions/v2/components/sections/about.tsx), de [`components/guide/`](../src/versions/v2/components/guide/index.tsx) e de [`components/identity/`](../src/versions/v2/components/identity/index.tsx), em português e inglês.

### Coluna de identidade

- [x] Cargo "Desenvolvedor Full Stack" / "Full Stack Developer".
- [x] Só os **canais oficiais**: GitHub, LinkedIn e e-mail.
- [x] Tagline revisada: o português fica, e o inglês passa a "I build responsive, multi‑device web products".
- [x] Footer validado, com o desenvolvimento *AI-oriented* com o Claude, 2026, v2.0 e os links de Claude, TypeScript, Visual Studio Code, React e Vite.

### Sobre

- [x] Estrutura escolhida: a abertura e as conquistas do Sobre do LinkedIn, a formação, a prática na Fitinsur, a trajetória e o `// como comecei`. O texto longo do `f082aaa` virou só esse parágrafo final.
- [x] Ajustes do usuário, levados também ao LinkedIn e ao `linkedin-sobre.txt`: "três grandes seguradoras", "utilizados", o desenvolvimento *AI-oriented* com o Claude nos 4 meses finais e o parágrafo da Fitinsur.
- [x] Links da trajetória (UFES, IBGE, Trybe, Fitinsur e UVV), os mesmos do README do GitHub.
- [x] A foto da família em "minha família": miniatura com o mouse, o foco ou um toque, e ampliada até o tamanho original, limitada à tela, num `<dialog>` nativo.

### Stacks

- [x] Os grupos das Hard skills do LinkedIn: `frontEnd`, `backEnd`, `dados`, `testes`, `devOps`, `práticas` e `ia`. Ficam também MongoDB, Cypress, Pytest, Playwright e Sinon, que os projetos mostram. O VS Code sai.
- [x] O Claude tem um grupo próprio, e todos os chips são iguais: o chip destacado parecia selecionado.

### Projetos

- [x] Os 6 projetos fixados no GitHub, com as descrições e as stacks do README do perfil. O texto do portfólio já diz que a v2 está no ar.
- [x] Observação sobre o código privado da Fitinsur e a seleção, e o link `// todos os repositórios no GitHub ↗` no fim da lista.
- [x] Sem o link "no ar" no portfólio: quem lê já está nele.
- [ ] Lembrete fora deste repo: o README do perfil no GitHub ainda diz "em evolução para a v2.0".

### Versões e Contato

- [x] Dados da v2: **v1.0** com "2023 · Versão original", que abre a v1, e **v2.0** com "2026 · Versão atual".
- [x] O card "Em breve" da v2.0, dentro da v1, fica como está ([D17](#registro-de-decisões)).
- [x] O Contato mantém "Vamos conversar?" ("Shall we talk?" em inglês), e o LinkedIn passa a usar o mesmo final.

### Guia e inglês

- [x] Os 7 textos do guia revisados; o do Stacks passou a cobrir dos testes ao deploy.
- [x] Revisão do inglês: "including" no lugar de "between", "Worked as part of the team", "corporate group" para "grupo econômico" e as vírgulas do footer.

## Fase 4: Efeito "volta no tempo"

✅ Concluída em 2026-11-18. A transição de 2026 para 2023 ao abrir a v1, e o caminho inverso ao voltar, na mesma linguagem de movimento da órbita do `<GAD />` ([D18](#registro-de-decisões)).

### 4.1 Protótipo

✅ Concluído em 2026-11-18. O protótipo fica em [`docs/prototypes/v2-volta-no-tempo.html`](prototypes/v2-volta-no-tempo.html) ([artifact privado](https://claude.ai/artifact/WbQPBTdYN1WgyB5smvgH6u)), com capturas reais da v2 e da v1.

- Quatro efeitos comparados: **terminal** (`git checkout v1.0` digitado), **contador** (o ano rolando), **filme antigo** (sépia, grão e vinheta) e **rebobinar** (linhas de VHS, tremor e `◀◀`).
- Cinco formas para o contador: `<2026 />`, `<time datetime="2026">`, `<data value="2026">`, `<GAD year={2026} />` e `<Site version="2.0" year={2026} />`. O usuário escolheu o contador com `<GAD year={2026} />`.
- O painel também testa as duas direções, a primeira visita (a v1 ainda carregando) e o "menos movimento".

### 4.2 Implementação

✅ Concluída em 2026-11-18, em [`components/time-travel/`](../src/versions/v2/components/time-travel/index.tsx) e no [`VersionProvider.tsx`](../src/versions/v2/context/VersionProvider.tsx).

- [x] O `VersionProvider` separa a versão **pedida** da versão **na tela**: uma troca de versão dispara o efeito, e a versão na tela muda por trás da camada.
- [x] A camada do efeito fica acima do iframe, então cobre a v2 na ida e a v1 na volta.
- [x] Na ida, o efeito espera o `load` do iframe da v1; se demorar, mostra `// carregando 2023…`.
- [x] Uma troca no meio do efeito ("Voltar" rápido) recomeça na direção nova.
- [x] Textos em português e inglês; com "menos movimento", uma troca suave sem o contador.
- [x] O foco e o histórico continuam seguindo a [D10](#registro-de-decisões) e o passo 6 da 2.3.
- [x] E2E: ida e volta, espera pela v1 (com a resposta atrasada de propósito), "Voltar" no meio, idioma e menos movimento. Medido no Chrome: a v1 aparece em cerca de 1,6 s, a v2 volta em cerca de 1,8 s, e com "menos movimento" a troca leva menos de 1 s.

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

✅ Concluída em 2026-11-18, com a tag `v2.0.0`.

- [x] Versão `2.0.0` no `package.json`.
- [x] README com a seção "How the versions work": a v1 congelada no iframe, a troca com a volta no tempo, o histórico e a versão que nunca fica guardada.
- [x] Prévia de compartilhamento (incluída nesta fase): descrição e meta tags Open Graph no `index.html`, com a bio curta da base comum aos canais, e a imagem `public/og-image-v2.png`, de 2400×1260, no estilo do site. O nome tem versão porque o LinkedIn guarda a imagem pela URL.
- [x] Revisão final: E2E completo três vezes (345 execuções), build de produção conferido no Chrome (desktop, celular, inglês e a volta no tempo, sem erros nem requisições externas) e varredura de acessibilidade com o axe (WCAG 2.2 AA) em 16 estados. A varredura pediu um sublinhado nos links do footer, que só se distinguiam pela cor.
- [x] Push na `main` e deploy no GitHub Actions, feitos pelo usuário depois do commit do lançamento.

## Fase 7: v2.1.0

✅ Concluída em 2026-11-19, com a tag `v2.1.0`. As correções encontradas depois do lançamento e o botão do currículo saem juntos numa única versão, a **v2.1.0**, por decisão do usuário: sem um patch 2.0.1 só para as correções.

- [x] **Miniatura da foto no celular:** centralizada sobre "minha família", ela saía cortada pela borda quando a palavra caía no começo ou no fim da linha (relatado num Redmi Note 11S: 393 px, com a Roboto). Agora ela é empurrada para dentro da margem de 16 px, e "minha família" não quebra mais a linha. O E2E abre a miniatura em larguras de 340 a 430 px.
- [x] **Miniatura da foto no computador:** o painel da seção tem rolagem própria e corta o que passa da borda dele. Em inglês, "my family" começa a linha, e a miniatura saía cortada pela esquerda em todas as larguras. Ela agora fica na faixa visível: a largura da tela recortada pelos contêineres que cortam (o painel no computador, a tela no celular). O E2E confere os dois idiomas em quatro larguras.
- [x] **Conferência com um leitor de tela**, pendente desde a Fase 6. Feita com o NVDA 2026.3 portátil, pilotado pelo Guidepup a partir do Playwright, com o registro em texto de tudo o que ele falou. Os ajustes, sem mudar nada na tela (as capturas antes e depois são idênticas):
  - o `//` dos rótulos e o `↗` dos links ficam com `aria-hidden`: o NVDA lia "barra barra trajetória" e "seta para cima e para a direita";
  - o texto do guia para o leitor diz "GAD", e não "menor GAD barra maior";
  - os chips de Stacks e Projetos viraram itens de lista: antes eram lidos colados ("HTMLCSS", "POOSOLID");
  - as bandeiras de idioma ficaram decorativas, com o nome no botão, sem o "gráfico";
  - uma região `role="status"`, fora do `#root`, anuncia a chegada à v1 e a volta à v2. O NVDA não anuncia o foco no iframe, e a viagem no tempo ficava em silêncio.
  - O Esc na foto ampliada está certo: o foco volta ao botão, que o NVDA anuncia logo depois de dizer o título da página.
  - Na v1, os ícones duplicados e a tabela de 35 links "git Hub Icon" ficam como estão, porque ela é a cápsula do tempo de 2023 ([D1](#registro-de-decisões)).
- [x] O `public/vite.svg`, sobra do template do Vite, foi removido: nada o usava.
- [x] **Currículo em PDF**, alinhado à base comum do LinkedIn, do GitHub e do site, em PT e EN, com 1 página A4. O PDF anterior vinha de um script Python (ReportLab) que não ficou salvo, então o layout foi refeito em HTML em [`resume/`](../resume/): os textos em `content.mjs`, o modelo em `template.mjs` e o `npm run resume`, que gera os dois PDFs em `public/` com o Chrome instalado e falha se algum passar de 1 página. A Lato vem do pacote `@fontsource/lato`, embutida no HTML, como a fonte do site ([D15](#registro-de-decisões)). Os PDFs ficam no repo já gerados, e o deploy não precisa do Chrome. Para o ATS: uma coluna, texto de verdade e sem kerning nem ligaduras, que faziam o texto extraído perder espaços ("T OEIC(Listening &Reading)").
- [x] **Botão do currículo** na coluna de identidade, depois de GitHub, LinkedIn e E-mail: ícone de PDF com `mask-image` (o `filetype-pdf` do Bootstrap Icons, o mesmo conjunto do ícone do GitHub; escolhido entre dez opções), o PDF do idioma ativo ("Currículo em PDF" ou "Resume (PDF)") numa aba nova. O E2E confere o endereço nos dois idiomas e que os dois PDFs são servidos como `application/pdf`.
- [x] **Idioma do navegador** ([D19](#registro-de-decisões)): o site abre em português num navegador em português e em inglês em qualquer outro. O E2E fixa o navegador em `pt-BR` e confere pt-PT, en-US e es-ES, e que a escolha da bandeira não sobrevive a um reload. Com o site forçado a abrir sempre em PT, os três testes de inglês falharam, como deveriam.
- [x] **Release:** `package.json` em 2.1.0, e os rótulos "v2.0" do site passam a "v2.1": o footer, o card da versão atual na seção Versões e o aviso de volta para o leitor de tela. O card "v2.0 · Em breve" dentro da v1 continua como está, porque ela é a cápsula do tempo de 2023 ([D17](#registro-de-decisões)). E2E completo, build de produção com os dois PDFs no `dist/` e a tag anotada `v2.1.0`.
- [ ] Push na `main` e deploy no GitHub Actions, feitos pelo usuário depois do commit da release.

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
| 2026-11-18 | 2 | 2.3, passos 0 e 1: o smoke virou `e2e/v1.spec.ts`; o fixture ignora o que o navegador cancela ao trocar de página; tokens, JetBrains Mono (D15) e a coluna de identidade nova | `7d1319c`, `f506455`, `5120bf6` |
| 2026-11-18 | 2 | 2.3, passo 2: endereços em inglês fixo (D15) e histórico da D10, `<GAD />`, órbita com o cálculo do protótipo e árvore no celular. O `versions.spec.ts` passa pela órbita | `39b8f45` |
| 2026-11-18 | 2 | 2.3, passo 3: seções no visual novo, com o título digitado. 61 testes E2E, estáveis em 3 repetições | `7950d19` |
| 2026-11-18 | 2 | 2.3, passo 4: digitação do `<GAD />` em toda visita e guia `<p>`, oculto no celular (D16) | `fc464f4` |
| 2026-11-18 | 2 | 2.3, passo 5: coluna compacta em telas de até 760 px de altura e coluna única no celular deitado (D16); hover só com mouse | `ca7b5d8` |
| 2026-11-18 | 2 | 2.3, passo 6: o foco acompanha a navegação (seções e v1), o título da aba diz a seção, e todos os controles têm contorno de foco | `0ce5c26` |
| 2026-11-18 | 2 | **2.3 e Fase 2 concluídas.** Passo 7: limpeza (30 ícones antigos e um token sem uso) e build de produção conferido. 96 testes E2E | `40f502a` |
| 2026-11-18 | 3 | **Fase 3 concluída** (D17). Sobre com a base do LinkedIn e a foto da família ampliável; Stacks nos grupos do LinkedIn; Projetos com os textos do README e o link para todos os repositórios; Contato, tagline, footer e guia revisados; revisão do inglês | `a5e502a` … `61695e0` |
| 2026-11-18 | 4 | Protótipo da volta no tempo, com quatro efeitos e cinco formas de contador; escolhido o contador com `<GAD year={2026} />` (D18) | `f01ed89` |
| 2026-11-18 | 4 | **Fase 4 concluída.** A volta no tempo em toda troca de versão, esperando a v1 carregar e invertendo no meio do caminho; 113 testes E2E | `7bc49a1` |
| 2026-11-18 | 6 | **v2.0 lançada.** Prévia de compartilhamento, sublinhado nos links do footer (axe), README com as versões, `package.json` em 2.0.0 e o hex do Claude validado | `fe9190f`, `d460d88`, tag `v2.0.0` |
| 2026-11-18 | 6 | Prévia ajustada pelo Post Inspector do LinkedIn: "Portfólio" no título e na imagem, que ganhou outro nome para escapar do cache | `9bdee3d`, `11d1320` |
| 2026-11-19 | 7 | A miniatura da foto da família fica dentro da tela no celular (Redmi Note 11S) | `2c57103` |
| 2026-11-19 | 7 | Conferência com o NVDA: o leitor ouve palavras, sem a decoração de código, e a viagem no tempo é anunciada; `vite.svg` removido. 119 testes E2E | `f4ce5be`, `5241100` |
| 2026-11-19 | 7 | A miniatura da foto da família fica dentro do painel da seção no computador (em inglês, ela saía cortada pela esquerda). 240 execuções E2E sem falha, em duas rodadas | `2812a08` |
| 2026-11-19 | 7 | Currículo em PDF (PT e EN, 1 página, gerado por `npm run resume`) e o botão dele na coluna de identidade, com o ícone de PDF escolhido entre dez opções. O site abre no idioma do navegador (D19). 130 testes E2E | `9125b28`, `83e34c9` |
| 2026-11-19 | 7 | **v2.1.0 lançada.** `package.json` em 2.1.0 e os rótulos do site em "v2.1" (footer, seção Versões e o aviso do leitor de tela), com o card da v1 intacto (D17) | tag `v2.1.0` |
