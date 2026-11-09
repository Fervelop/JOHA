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

/* ---------- modo claro / oscuro (oscuro por defecto) ---------- */
let temaSync = () => {};
let temaElegido = false;
try { temaElegido = !!localStorage.getItem("joha-tema"); } catch (e) {}
(() => {
  const root = document.documentElement, btn = $("tema");
  const sys = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : sys.matches;
  const sync = () => btn.setAttribute("aria-label", isDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  btn.addEventListener("click", () => {
    const t = isDark() ? "light" : "dark";
    root.dataset.theme = t;
    try { localStorage.setItem("joha-tema", t); } catch (e) {}
    temaElegido = true;
    sync();
  });
  sys.addEventListener("change", sync);
  temaSync = sync;
  sync();
})();

$("yr").textContent = new Date().getFullYear();

/* ---------- ventana de pieza ---------- */
const lb = $("lb");
function verFoto(src, alt) {
  const u = imgUrl(src, 1100), main = $("lb-img");
  main.classList.add("swap");
  const pre = new Image();
  pre.onload = pre.onerror = () => { main.src = u; $("lb-fill").src = u; main.alt = alt; main.classList.remove("swap"); };
  pre.src = u;
}
function abrir(p) {
  const fotos = (p.fotos && p.fotos.length ? p.fotos : [p.foto]).filter(f => imgUrl(f, 10));
  const u = imgUrl(fotos[0], 1100);
  $("lb-img").src = u; $("lb-fill").src = u; $("lb-img").alt = p.nombre;
  const th = $("lb-thumbs");
  th.textContent = "";
  th.hidden = fotos.length < 2;
  if (fotos.length > 1) fotos.forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Foto ${i + 1} de ${fotos.length}`);
    b.setAttribute("aria-current", i === 0);
    b.innerHTML = `<img src="${esc(imgUrl(f, 160))}" alt="">`;
    b.addEventListener("click", () => {
      th.querySelectorAll("button").forEach(x => x.setAttribute("aria-current", x === b));
      verFoto(f, `${p.nombre}, foto ${i + 1}`);
    });
    th.appendChild(b);
  });
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
      <div class="tarjeta">${p.agotado ? '<span class="badge">Agotado</span>' : ""}${ph(p.foto, p.nombre + ", JOHA", 700, true)}${(p.fotos || []).length > 1 ? `<span class="mas-fotos">${p.fotos.length} fotos</span>` : ""}</div>
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
function pintarRuleta(productos, conf) {
  conf = conf || {};
  const disponibles = productos.filter(p => !p.agotado);
  let lista;
  const propias = (Array.isArray(conf.fotos) ? conf.fotos : [])
    .filter(f => f && imgUrl(f.foto, 10))
    .map(f => ({ nombre: f.descripcion || "Pieza JOHA", foto: f.foto }));
  if (conf.origen === "fotos" && propias.length) {
    lista = propias;
  } else {
    lista = disponibles.filter(p => p.destacado);
    if (lista.length < 3) lista = lista.concat(disponibles.filter(p => !p.destacado)).slice(0, Math.max(3, lista.length));
  }
  lista = lista.slice(0, 8);
  const ms = Math.min(10, Math.max(2, Number(conf.segundos) || 4)) * 1000;
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
  const play = () => { if (n > 1 && !timer && !reduce.matches && !document.hidden) timer = setInterval(next, ms); };
  const stop = () => { clearInterval(timer); timer = null; };
  box.addEventListener("mouseenter", stop);
  box.addEventListener("mouseleave", play);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : play());
  reduce.addEventListener("change", () => reduce.matches ? stop() : play());
  layout(); play();
}

/* ---------- ajustes generales ---------- */
function aplicarAjustes(a) {
  if (/^57\d{10}$/.test(a.whatsapp || "")) WHATSAPP = a.whatsapp;
  document.querySelectorAll(".wa").forEach(el => el.href = waLink(el.dataset.msg));
  const ig = $("ig"), user = String(a.instagram || "").replace(/^@/, "");
  if (/^[\w.]{1,30}$/.test(user)) ig.href = "https://instagram.com/" + user; else ig.remove();

  if (!temaElegido && a.tema_inicial === "claro") { document.documentElement.dataset.theme = "light"; temaSync(); }

  const sec = a.secciones || {};
  ["calidad", "cuidado", "esencia", "pedir"].forEach(k => {
    if (sec[k] === false) document.querySelectorAll(`[data-sec="${k}"]`).forEach(el => el.hidden = true);
  });
}

/* ---------- ventana de bienvenida ---------- */
function aplicarPromo(pr, ajustesViejos) {
  // compatibilidad con la versión anterior (promo dentro de ajustes)
  if (!pr || typeof pr !== "object") pr = {
    activa: ajustesViejos.promo_activa, titulo: ajustesViejos.promo_titulo, texto: ajustesViejos.promo_texto
  };
  if (pr.activa === false) return;
  if (pr.hasta) {
    const fin = new Date(pr.hasta + "T23:59:59");
    if (!isNaN(fin) && Date.now() > fin.getTime()) return;
  }
  const clave = "joha-promo-" + String((pr.titulo || "") + (pr.texto || "")).length + "-" + (pr.titulo || "").slice(0, 20);
  try {
    if (pr.frecuencia === "sesion" && sessionStorage.getItem(clave)) return;
    if (pr.frecuencia === "una_vez" && localStorage.getItem(clave)) return;
  } catch (e) {}

  const set = (id, v) => { if (typeof v === "string" && v.trim()) $(id).textContent = v; };
  set("promo-t", pr.titulo); set("promo-frase", pr.frase); set("promo-txt", pr.texto);
  set("promo-cat", pr.boton_catalogo); set("promo-wa-txt", pr.boton_whatsapp);
  if (pr.frase === "") $("promo-frase").hidden = true;
  const img = imgUrl(pr.imagen, 900);
  if (img) { $("promo-img").src = img; $("promo-img").alt = pr.titulo || ""; $("promo-img").hidden = false; $("promo-logo").style.display = "none"; }
  const wa = $("promo-wa");
  if (pr.mostrar_whatsapp === false) wa.remove();
  else if (pr.mensaje_whatsapp) wa.href = waLink(pr.mensaje_whatsapp);

  const promo = $("promo");
  const marcar = () => { try {
    if (pr.frecuencia === "sesion") sessionStorage.setItem(clave, "1");
    if (pr.frecuencia === "una_vez") localStorage.setItem(clave, "1");
  } catch (e) {} };
  promo.addEventListener("close", marcar);
  $("promo-x").addEventListener("click", () => promo.close());
  $("promo-cat").addEventListener("click", () => promo.close());
  promo.addEventListener("click", e => { if (e.target === promo) promo.close(); });
  const espera = Math.min(30, Math.max(0, Number(pr.segundos_espera ?? 1))) * 1000;
  setTimeout(() => { if (!document.querySelector("dialog[open]")) promo.showModal(); }, espera);
}

/* ---------- textos editables ---------- */
const negritas = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
function lista(id, items, icono) {
  const ul = $(id);
  if (!ul || !Array.isArray(items) || !items.length) return;
  const iconos = Array.isArray(icono) ? icono : null;
  ul.textContent = "";
  items.forEach((it, i) => {
    if (!it || !it.titulo) return;
    const li = document.createElement("li");
    const ic = iconos ? iconos[i % iconos.length] : icono;
    li.innerHTML = (ic ? `<svg aria-hidden="true"><use href="#${ic}"/></svg>` : "") +
      `<div><h3>${esc(it.titulo)}</h3><p>${esc(it.texto || "")}</p></div>`;
    ul.appendChild(li);
  });
}
function aplicarTextos(t) {
  if (!t || typeof t !== "object") return;
  document.querySelectorAll("[data-t]").forEach(el => {
    const v = el.dataset.t.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), t);
    if (typeof v !== "string" || !v.trim()) return;
    if ("md" in el.dataset) el.innerHTML = negritas(v); else el.textContent = v;
  });
  const c = t.calidad || {};
  lista("t-bene", c.beneficios, ["i-drop", "i-shield", "i-mirror"]);
  lista("t-tips", (t.cuidado || {}).consejos, "i-spark");
  lista("t-pasos", (t.pedir || {}).pasos, null);
  const u = imgUrl(c.foto, 900);
  if (u) { $("cal-img").src = u; $("cal-fill").src = u; }
}

/* ---------- arranque ---------- */
(async () => {
  document.querySelectorAll(".wa").forEach(el => el.href = waLink(el.dataset.msg));
  const [datos, ajustes, textos, portada, promo] = await Promise.all([
    cargar("data/productos.json", { productos: [] }),
    cargar("data/ajustes.json", {}),
    cargar("data/textos.json", {}),
    cargar("data/portada.json", {}),
    cargar("data/promo.json", null)
  ]);
  aplicarTextos(Object.assign({}, textos, { portada: Object.assign({}, (textos || {}).portada, portada) }));
  const productos = (Array.isArray(datos.productos) ? datos.productos : [])
    .filter(p => p && p.nombre && p.foto && CAT[p.tipo]);
  aplicarAjustes(ajustes || {});
  aplicarPromo(promo, ajustes || {});
  pintarCatalogo(productos);
  pintarRuleta(productos, (portada || {}).ruleta);
})();
