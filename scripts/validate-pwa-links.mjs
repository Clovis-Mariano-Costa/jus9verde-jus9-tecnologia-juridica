import fs from "node:fs/promises";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const installPage = await fs.readFile(new URL("../instalar-app.html", import.meta.url), "utf8");
const serviceWorker = await fs.readFile(new URL("../service-worker.js", import.meta.url), "utf8");

assert(installPage.includes("app-jus9-principal-card"), "card do App principal da Jus 9 ausente");
assert(installPage.includes("https://jus9tecnologia.com.br/instalar-app"), "link do App principal da Jus 9 ausente");
assert(installPage.includes("Adicionar à Tela de Início"), "orientacao de instalacao para iPhone e iPad ausente");
assert(installPage.includes("style.css?v=20260601-app-jus9-principal"), "pagina sem atualizacao imediata do estilo");
assert(serviceWorker.includes("jus9verde-pwa-v2-2026-06-05-nacoes-heranca"), "cache PWA da Jus 9 Verde desatualizado");
assert(serviceWorker.includes("'/instalar-app.html'"), "pagina de instalacao fora do cache PWA");
assert(serviceWorker.includes("if (!sameOrigin) return"), "service worker deve ignorar requisicoes externas");
assert(serviceWorker.includes("acceptsHtml ? caches.match('/index.html') : Response.error()"), "fallback offline nao distingue navegacao de arquivos estaticos");

console.log("JUS9_VERDE_PWA_LINKS_OK app-principal,ios,cache,offline");
