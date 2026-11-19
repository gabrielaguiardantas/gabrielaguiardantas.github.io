// os "//" dos rótulos e o "↗" dos links são decoração de código: na tela ficam iguais, mas
// o leitor de tela não os lê (o NVDA dizia "barra barra" e "seta para cima e para a direita")
export function Slashes() {
  return <span aria-hidden="true">// </span>;
}

export function Arrow() {
  return <span aria-hidden="true"> ↗</span>;
}
