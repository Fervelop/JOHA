/* JOHA · catálogo
   Los productos y ajustes se editan desde el panel /admin
   (archivos data/productos.json y data/ajustes.json). */
"use strict";

const CAT = { aretes: "Aretes", sets: "Set de collar y aretes", collares: "Collares y pulseras" };
const MSG = "Hola JOHA, me interesa saber más sobre tus accesorios 🌷";
let WHATSAPP = "573183623168";

/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = msg => `https://wa.me/${WHATSAPP}?text=` + encodeURIComponent(msg);

/* Rutas de imagen: solo se aceptan archivos propios del sitio.
   En Netlify se sirven optimizadas (WebP/AVIF y tamaño justo) con su Image CDN. */
const ON_NETLIFY = location.protocol === "https:" && !/^(localhost|127\.)/.test(location.hostname) && !/claude/.test(location.hostname);
function imgUrl(src, w) {
  src = String(src || "");
  if (!/^\/?images\/[\w\-./]+\.(png|jpe?g|webp|avif|gif)$/i.test(src) || src.includes("..")) return "";
  const path = src.startsWith("/") ? src : "/" + src;
  return ON_NETLIFY ? `/.netlify/images?url=${encodeURIComponent(path)}&w=${w}&q=80` : path.slice(1);
}
const ph = (src, alt, w, lazy) => {
  const u = esc(imgUrl(src, w)), l = lazy ? ' loading="lazy" decoding="async"' : "";
  return `<div class="ph"><img class="fill" src="${u}" alt="" aria-hidden="true"${l}><img class="main" src="${u}" alt="${esc(alt)}"${l}></div>`;
};

async function cargar(ruta, porDefecto) {
  try {
    const r = await fetch(ruta, { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    console.warn("No se pudo cargar", ruta, e);
    return porDefecto;
  }
}

/* ---------- modo claro / oscuro ---------- */
(() => {
  const root = document.documentElement, btn = $("tema");
  const sys = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : sys.matches;
  const sync = () => btn.setAttribute("aria-label", isDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  btn.addEventListener("click", () => {
    const t = isDark() ? "light" : "dark";
    root.dataset.theme = t;
    try { localStorage.setItem("joha-tema", t); } catch (e) {}
    sync();
  });
  sys.addEventListener("change", sync);
  sync();
})();

$("yr").textContent = new Date().getFullYear();

/* ---------- ventana de pieza ---------- */
const lb = $("lb");
function abrir(p) {
  const u = imgUrl(p.foto, 1100);
  $("lb-img").src = u; $("lb-fill").src = u; $("lb-img").alt = p.nombre;
  $("lb-t").textContent = p.nombre;
  $("lb-c").textContent = CAT[p.tipo] || "";
  lb.querySelector(".lb").classList.toggle("agotado", !!p.agotado);
  $("lb-n").textContent = p.agotado
    ? "Esta pieza está agotada por ahora. Escríbenos y te avisamos cuando vuelva."
    : "Escríbenos y te confirmamos precio y disponibilidad de esta pieza.";
  $("lb-wa").href = waLink(`${MSG}\nPieza: ${p.nombre}`);
  lb.showModal();
}
$("lb-x").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });

/* ---------- catálogo ---------- */
function pintarCatalogo(productos) {
  const grid = $("grid");
  grid.textContent = "";
  if (!productos.length) {
    grid.innerHTML = `<li class="vacio">Estamos actualizando el catálogo. Escríbenos por WhatsApp y te mostramos las piezas disponibles.</li>`;
    return;
  }
  productos.forEach(p => {
    const li = document.createElement("li");
    li.className = "item" + (p.agotado ? " agotado" : "");
    li.dataset.c = p.tipo;
    li.innerHTML = `<button type="button" aria-label="Ver ${esc(p.nombre)}${p.agotado ? ", agotado" : ""}">
      <div class="tarjeta">${p.agotado ? '<span class="badge">Agotado</span>' : ""}${ph(p.foto, p.nombre + ", JOHA", 700, true)}</div>
      <h3>${esc(p.nombre)}</h3><span class="cat">${esc(CAT[p.tipo] || "")}</span></button>`;
    li.querySelector("button").addEventListener("click", () => abrir(p));
    grid.appendChild(li);
  });
}
document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filters button").forEach(x => x.setAttribute("aria-pressed", x === b));
  const f = b.dataset.f;
  $("grid").querySelectorAll(".item").forEach(li => li.hidden = !(f === "todo" || li.dataset.c === f));
}));

/* ---------- ruleta de la portada ---------- */
function pintarRuleta(productos) {
  const disponibles = productos.filter(p => !p.agotado);
  let lista = disponibles.filter(p => p.destacado);
  if (lista.length < 3) lista = lista.concat(disponibles.filter(p => !p.destacado)).slice(0, Math.max(3, lista.length));
  lista = lista.slice(0, 8);
  const box = $("ruleta");
  if (!lista.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const cards = lista.map(p => {
    const d = document.createElement("div");
    d.className = "tarjeta rc";
    d.innerHTML = ph(p.foto, p.nombre, 900, false);
    box.insertBefore(d, box.firstChild);
    return d;
  });
  const n = cards.length;
  let cur = 0, timer = null;
  function layout() {
    cards.forEach((c, k) => {
      const off = (k - cur + n) % n;            // 0 centro, 1 derecha, n-1 izquierda, resto escondidas
      const pos = off === 0 ? "center" : (off === 1 && n > 1) ? "right" : (off === n - 1 && n > 2) ? "left" : "hidden";
      c.dataset.pos = pos;
      c.setAttribute("aria-hidden", pos !== "center");
    });
  }
  const next = () => { cur = (cur + 1) % n; layout(); };
  const play = () => { if (n > 1 && !timer && !reduce.matches && !document.hidden) timer = setInterval(next, 3800); };
  const stop = () => { clearInterval(timer); timer = null; };
  box.addEventListener("mouseenter", stop);
  box.addEventListener("mouseleave", play);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : play());
  reduce.addEventListener("change", () => reduce.matches ? stop() : play());
  layout(); play();
}

/* ---------- ajustes: WhatsApp, Instagram, promo ---------- */
function aplicarAjustes(a) {
  if (/^57\d{10}$/.test(a.whatsapp || "")) WHATSAPP = a.whatsapp;
  document.querySelectorAll(".wa").forEach(el => el.href = waLink(el.dataset.msg));
  const ig = $("ig"), user = String(a.instagram || "").replace(/^@/, "");
  if (/^[\w.]{1,30}$/.test(user)) ig.href = "https://instagram.com/" + user; else ig.remove();

  const promo = $("promo");
  if (a.promo_activa === false) return;
  if (a.promo_titulo) $("promo-t").textContent = a.promo_titulo;
  if (a.promo_texto) $("promo-txt").textContent = a.promo_texto;
  $("promo-x").addEventListener("click", () => promo.close());
  $("promo-cat").addEventListener("click", () => promo.close());
  promo.addEventListener("click", e => { if (e.target === promo) promo.close(); });
  setTimeout(() => { if (!document.querySelector("dialog[open]")) promo.showModal(); }, 700);
}

/* ---------- arranque ---------- */
(async () => {
  document.querySelectorAll(".wa").forEach(el => el.href = waLink(el.dataset.msg));
  const [datos, ajustes] = await Promise.all([
    cargar("data/productos.json", { productos: [] }),
    cargar("data/ajustes.json", {})
  ]);
  const productos = (Array.isArray(datos.productos) ? datos.productos : [])
    .filter(p => p && p.nombre && p.foto && CAT[p.tipo]);
  aplicarAjustes(ajustes || {});
  pintarCatalogo(productos);
  pintarRuleta(productos);
})();
