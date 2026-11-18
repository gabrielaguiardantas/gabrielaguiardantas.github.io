// geometria da órbita, sem DOM: recebe as medidas e devolve onde fica cada seção
// e cada linha. Tudo em px, relativo ao canto superior esquerdo do palco

export type Size = { width: number; height: number };
export type Box = { left: number; right: number; top: number; bottom: number };

export type OrbitInput = {
  stage: Size;
  core: Size; // o texto <GAD />
  satellites: Size[]; // as tags das seções
  obstacles: Box[]; // o que a órbita não pode cobrir (texto e ícones da coluna de identidade)
};

export type OrbitGeometry = {
  radius: number;
  shift: number; // quanto a órbita desliza para a direita do centro
  satellites: { x: number; y: number }[]; // relativo ao centro da órbita
  lines: { x1: number; y1: number; x2: number; y2: number; length: number }[];
};

const R_MIN = 130;
const R_COMFORT = 200;
const R_LIMIT = 280;
const STEP_R = 6;
const STEP_SHIFT = 8;
const EDGE = { right: 16, top: 8, bottom: 8 };
const GAP = { core: 14, satX: 8, satY: 6 };

// começa no topo e segue no sentido horário
const angle = (i: number, count: number) => ((-90 + i * (360 / count)) * Math.PI) / 180;

// distância do centro até a borda de uma elipse (meia-largura a, meia-altura b) na direção (c, s)
const edge = (c: number, s: number, a: number, b: number) => 1 / Math.hypot(c / a, s / b);

export function computeOrbit({ stage, core, satellites, obstacles }: OrbitInput): OrbitGeometry {
  const { width: w, height: h } = stage;
  const count = satellites.length;

  const fits = (radius: number, shift: number) =>
    satellites.every((sat, i) => {
      const cx = w / 2 + shift + Math.cos(angle(i, count)) * radius;
      const cy = h / 2 + Math.sin(angle(i, count)) * radius;
      const hw = sat.width / 2;
      const hh = sat.height / 2;
      if (cx + hw > w - EDGE.right || cy - hh < EDGE.top || cy + hh > h - EDGE.bottom) return false;
      return !obstacles.some((b) => cx - hw < b.right && cx + hw > b.left && cy - hh < b.bottom && cy + hh > b.top);
    });

  // prioridade: 1) centro da tela com órbita confortável; 2) desliza para a direita
  // mantendo o tamanho; 3) só então encolhe o raio
  const rMax = Math.max(R_COMFORT, Math.min(R_LIMIT, Math.min(w, h) * 0.36));
  const search = (): [number, number] => {
    for (let r = rMax; r >= R_COMFORT; r -= STEP_R) if (fits(r, 0)) return [r, 0];
    for (let sh = STEP_SHIFT; sh <= w / 2; sh += STEP_SHIFT) if (fits(R_COMFORT, sh)) return [R_COMFORT, sh];
    for (let r = R_COMFORT - STEP_R; r >= R_MIN; r -= STEP_R)
      for (let sh = 0; sh <= w / 2; sh += STEP_SHIFT) if (fits(r, sh)) return [r, sh];
    return [R_MIN, 0];
  };
  const [radius, shift] = search();

  // as linhas vão da borda do texto <GAD /> até a borda do texto de cada seção
  const ox = w / 2 + shift;
  const oy = h / 2;
  const coreA = core.width / 2 + GAP.core;
  const coreB = core.height / 2 + GAP.core;
  const placed = satellites.map((sat, i) => {
    const c = Math.cos(angle(i, count));
    const s = Math.sin(angle(i, count));
    const d1 = edge(c, s, coreA, coreB);
    const d2 = radius - edge(c, s, sat.width / 2 + GAP.satX, sat.height / 2 + GAP.satY);
    const line = { x1: ox + c * d1, y1: oy + s * d1, x2: ox + c * d2, y2: oy + s * d2 };
    return {
      satellite: { x: c * radius, y: s * radius },
      line: { ...line, length: Math.hypot(line.x2 - line.x1, line.y2 - line.y1) },
    };
  });

  return {
    radius,
    shift,
    satellites: placed.map((p) => p.satellite),
    lines: placed.map((p) => p.line),
  };
}
