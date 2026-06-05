import fs from "node:fs/promises";

const target = "https://clovis-mariano-costa.github.io/nacoes-por-heranca/";
const files = [
  "index.html",
  "compromisso-social.html",
  "projetos.html",
  "instalar-app.html",
  "mvp-jurista.html",
  "fontes.html",
  "charlie-echo-social.html",
  "charlie-echo-social/index.html",
  "MAPA_LINKS_SEMANTICOS_JUS9_v1_5.md",
  "ORIENTACOES/PARCERIAS_SOCIAIS_NACOES_POR_HERANCA_IGREEN_2026_05_23.md",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of files) {
  const text = await fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");
  assert(text.includes(target), `${file}: link publico de Nacoes por Heranca ausente`);
}

const projetos = await fs.readFile(new URL("../projetos.html", import.meta.url), "utf8");
assert(projetos.includes('id="nacoes-por-heranca"'), "projetos.html: card Nacoes por Heranca ausente");
assert(projetos.includes('target="_blank" rel="noopener noreferrer"'), "projetos.html: link externo sem protecao");
assert(!projetos.includes("www.nacoesporheranca.gov.br"), "projetos.html: endereco .gov.br antigo ainda publicado");

const compromisso = await fs.readFile(new URL("../compromisso-social.html", import.meta.url), "utf8");
assert(!compromisso.includes("www.nacoesporheranca.gov.br"), "compromisso-social.html: endereco .gov.br antigo ainda publicado");

console.log("JUS9_VERDE_NACOES_LINK_OK card,semantica,orientacoes,link-externo");
