import { type FocusEvent, type KeyboardEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import familyPhoto from "../../assets/family_img.jpg";
import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// os mesmos links do README do GitHub, para os canais contarem a mesma história
const PLACES = {
  UFES: "https://www.ufes.br/",
  IBGE: "https://www.ibge.gov.br/",
  Trybe: "https://www.betrybe.com/",
  Fitinsur: "https://www.fitinsur.com.br/",
  UVV: "https://www.uvv.br/",
};

type Place = keyof typeof PLACES;

// abertura e conquistas do Sobre do LinkedIn, trajetória da base comum aos canais
// e, no fim, como tudo começou (Fase 3)
const TEXT = {
  portuguese: {
    intro:
      "Sou Desenvolvedor Full Stack com quase 3 anos de experiência em uma Insurtech, na sustentação e evolução de uma plataforma de seguros em produção (Node.js, React e MariaDB) utilizada por três grandes seguradoras.",
    recent: "// experiência recente",
    achievements: [
      "Mais de 150 tickets entregues entre novas funcionalidades e correções de bugs, em um sistema legado com regras de negócio críticas do setor de seguros.",
      "Participação, em time, na entrega de funcionalidades centrais da plataforma, como o módulo de administração e a seção de grupo econômico nas análises de crédito.",
      "Queries SQL e scripts em Node.js para gerar relatórios de dados operacionais utilizados pelo time financeiro e pelos corretores.",
      "Nos 4 meses finais na Fitinsur, desenvolvimento AI-oriented conduzido com o Claude.",
    ],
    education:
      "Minha trajetória une visão de negócio e rigor técnico: sou graduado em Ciências Econômicas (UFES) e graduando em Ciência da Computação (UVV). A vivência no IBGE consolidou habilidades de comunicação, empatia e resolução de problemas.",
    practice:
      "Na Fitinsur, pude aplicar todo esse ferramental de estudo em situações práticas: as regras de negócio do seguro, as dores do dia a dia de quem usa o sistema e problemas reais que precisavam de solução em produção.",
    journey: "// trajetória",
    timeline: [
      { period: "2007 – 2012", place: "UFES", role: "Ciências Econômicas" },
      { period: "03/2017 – 03/2020", place: "IBGE", role: "Agente de Pesquisa e Mapeamento" },
      { period: "08/2022 – 09/2023", place: "Trybe", role: "Desenvolvimento Web Full Stack" },
      { period: "01/2024 – 10/2026", place: "Fitinsur", role: "Desenvolvedor Full Stack Júnior" },
      { period: "07/2026 – hoje", place: "UVV", role: "Ciência da Computação" },
    ] satisfies { period: string; place: Place; role: string }[],
    start: "// como comecei",
    story: (family: ReactNode) => (
      <>
        Em 2021, ao saber da gravidez da minha então namorada (hoje esposa), decidi correr atrás da paixão por
        tecnologia que me acompanha desde a infância. Encontrei na Trybe uma formação intensa, com professores
        dedicados, e, com o apoio incondicional da {family}, concluí o curso de Desenvolvimento Web Full Stack em
        setembro de 2023.
      </>
    ),
    family: { label: "minha família", photo: "Foto da minha família", close: "Fechar a foto" },
  },
  english: {
    intro:
      "I'm a Full Stack Developer with almost 3 years of experience at an Insurtech, maintaining and evolving an insurance platform in production (Node.js, React and MariaDB) used by three major insurers.",
    recent: "// recent experience",
    achievements: [
      "150+ tickets delivered, including new features and bug fixes, in a legacy system with critical insurance business rules.",
      "Worked as part of the team delivering core platform features, such as the admin module and the corporate group section in credit analyses.",
      "SQL queries and Node.js scripts generating operational data reports used by the finance team and by brokers.",
      "In my last 4 months at Fitinsur, AI-oriented development conducted with Claude.",
    ],
    education:
      "My path combines business insight and technical rigor: I hold a degree in Economics (UFES) and I'm studying Computer Science (UVV). My time at IBGE strengthened my communication, empathy and problem-solving skills.",
    practice:
      "At Fitinsur, I put all those studies into practice: insurance business rules, the everyday pain points of the people using the system, and real problems that needed solving in production.",
    journey: "// journey",
    timeline: [
      { period: "2007 – 2012", place: "UFES", role: "Economics" },
      { period: "03/2017 – 03/2020", place: "IBGE", role: "Research and Mapping Agent" },
      { period: "08/2022 – 09/2023", place: "Trybe", role: "Full Stack Web Development" },
      { period: "01/2024 – 10/2026", place: "Fitinsur", role: "Junior Full Stack Developer" },
      { period: "07/2026 – present", place: "UVV", role: "Computer Science" },
    ] satisfies { period: string; place: Place; role: string }[],
    start: "// how I started",
    story: (family: ReactNode) => (
      <>
        In 2021, when I learned my then-girlfriend (now wife) was pregnant, I decided to pursue the passion for
        technology I'd had since childhood. At Trybe I found an intense program with dedicated teachers and, with the
        unconditional support of {family}, I completed the Full Stack Web Development course in September 2023.
      </>
    ),
    family: { label: "my family", photo: "Photo of my family", close: "Close the photo" },
  },
};

type FamilyText = { label: string; photo: string; close: string };

// a mesma margem lateral da página no celular
const POPOVER_GUTTER = 16;

// a miniatura nasce centralizada na palavra; se assim ela sairia da tela (a palavra no
// começo ou no fim da linha), é empurrada para dentro, até a margem da página
function keepInsideViewport(anchor: HTMLElement, popover: HTMLElement) {
  const { left, width } = anchor.getBoundingClientRect();
  const popoverWidth = popover.offsetWidth;
  const centered = left + width / 2 - popoverWidth / 2;
  const max = Math.max(POPOVER_GUTTER, document.documentElement.clientWidth - POPOVER_GUTTER - popoverWidth);
  const inside = Math.min(Math.max(centered, POPOVER_GUTTER), max);
  popover.style.setProperty("--shift", `${inside - centered}px`);
}

// "minha família": a miniatura da foto aparece com o mouse em cima ou com o foco do teclado,
// e some ao sair. No toque não existe "em cima", então um toque mostra a miniatura e outro a
// esconde. Clicar (ou Enter, ou tocar na miniatura) amplia a foto até o tamanho original,
// limitado à tela, na mesma moldura. O Esc fecha a foto sem fechar a seção
function FamilyPhoto({ text }: { text: FamilyText }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [lastPointer, setLastPointer] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLSpanElement>(null);

  // antes da pintura, para a miniatura não aparecer cortada nem por um quadro
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const popover = popoverRef.current;
    if (!anchor || !popover) return;
    const place = () => keepInsideViewport(anchor, popover);
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, zoomed]);

  const zoom = () => {
    setZoomed(true);
    // o <dialog> nativo prende o foco, escurece o fundo e devolve o foco ao fechar
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const onKeyDown = (event: KeyboardEvent) => {
    // com a foto aberta, o Esc fecha só ela e não chega ao palco, que fecharia a seção.
    // O <dialog> é consultado direto: ele fecha na hora, e o React só fica sabendo depois
    const enlarged = dialogRef.current?.open ?? false;
    if (event.key !== "Escape" || (!open && !enlarged)) return;
    event.nativeEvent.stopPropagation();
    if (!enlarged) setOpen(false);
  };
  const onBlur = (event: FocusEvent) => {
    if (zoomed || event.currentTarget.contains(event.relatedTarget)) return;
    setOpen(false);
    setLastPointer(null);
  };

  return (
    <span
      ref={anchorRef}
      className={styles.family}
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={styles.familyButton}
        aria-expanded={open}
        aria-haspopup="dialog"
        onPointerDown={(event) => setLastPointer(event.pointerType)}
        // no toque, o primeiro toque só mostra a miniatura; com mouse e teclado, o clique amplia
        onClick={() => (lastPointer === "touch" || lastPointer === "pen" ? setOpen((current) => !current) : zoom())}
        onFocus={(event) => event.currentTarget.matches(":focus-visible") && setOpen(true)}
      >
        {text.label}
      </button>
      {/* com a foto ampliada, a miniatura sai de trás do fundo escurecido */}
      {open && !zoomed && (
        <span ref={popoverRef} className={styles.familyPopover}>
          {/* a miniatura também amplia; quem usa teclado já tem o Enter no botão acima */}
          <button type="button" className={styles.familyFrame} tabIndex={-1} aria-hidden="true" onClick={zoom}>
            <img src={familyPhoto} alt="" width={2048} height={1365} />
          </button>
        </span>
      )}
      {zoomed &&
        createPortal(
          <dialog
            ref={dialogRef}
            className={styles.lightbox}
            aria-label={text.photo}
            onClick={() => dialogRef.current?.close()}
            onKeyDown={(event) => event.key === "Escape" && event.nativeEvent.stopPropagation()}
            onClose={() => setZoomed(false)}
          >
            <img src={familyPhoto} alt={text.photo} width={2048} height={1365} />
            <button type="button" className={styles.lightboxClose} aria-label={text.close}>
              ×
            </button>
          </dialog>,
          document.body,
        )}
    </span>
  );
}

function About() {
  const text = TEXT[useLanguage().language];
  return (
    <>
      <p>{text.intro}</p>
      <p className={styles.eyebrow}>{text.recent}</p>
      <ul className={styles.achievements}>
        {text.achievements.map((achievement) => (
          <li key={achievement}>{achievement}</li>
        ))}
      </ul>
      <p>{text.education}</p>
      <p>{text.practice}</p>
      <p className={styles.eyebrow}>{text.journey}</p>
      <ol className={styles.timeline}>
        {text.timeline.map(({ period, place, role }) => (
          <li key={place}>
            <time>{period}</time>
            <span>
              <a href={PLACES[place]} target="_blank" rel="noopener noreferrer">
                {place}
              </a>{" "}
              · {role}
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.eyebrow}>{text.start}</p>
      <p>{text.story(<FamilyPhoto text={text.family} />)}</p>
    </>
  );
}

export default About;
