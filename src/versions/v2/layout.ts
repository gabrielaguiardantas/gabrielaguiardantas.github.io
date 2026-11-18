// a v2 vira uma coluna única (a órbita vira árvore) em telas estreitas, como o celular em pé,
// e em telas baixas, como o celular deitado, onde a órbita e a coluna de identidade não cabem.
// Os CSS da v2 repetem esta consulta nos @media, porque o CSS não lê constantes do script
export const SINGLE_COLUMN = "(max-width: 820px), (max-height: 520px)";
