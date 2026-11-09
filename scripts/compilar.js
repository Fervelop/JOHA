/* Une las fichas de content/productos/*.json en data/productos.json.
   Netlify lo ejecuta en cada publicación (ver netlify.toml). */
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "content", "productos");
const OUT = path.join(__dirname, "..", "data", "productos.json");
const TIPOS = new Set(["aretes", "sets", "collares"]);
const IMG = /^\/images\/[\w\-./]+\.(png|jpe?g|webp|avif|gif)$/i;

const okImg = s => typeof s === "string" && IMG.test(s) && !s.includes("..");
const productos = [];
let omitidos = 0;

for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".json")).sort()) {
  try {
    const p = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
    const nombre = String(p.nombre || "").trim().slice(0, 60);
    if (!nombre || !TIPOS.has(p.tipo) || !okImg(p.image)) throw new Error("faltan nombre, tipo o foto");
    const extra = (Array.isArray(p.galeria) ? p.galeria : [])
      .map(g => (g && typeof g === "object" ? g.foto : g))
      .filter(okImg);
    productos.push({
      nombre,
      tipo: p.tipo,
      foto: p.image,
      fotos: [p.image, ...extra].slice(0, 6),
      agotado: p.agotado === true,
      destacado: p.destacado === true,
      orden: Number.isFinite(Number(p.orden)) ? Number(p.orden) : 999
    });
  } catch (e) {
    omitidos++;
    console.warn(`Ficha omitida (${f}): ${e.message}`);
  }
}

productos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"));
productos.forEach(p => delete p.orden);
fs.writeFileSync(OUT, JSON.stringify({ productos }, null, 2) + "\n");
console.log(`Catálogo compilado: ${productos.length} productos${omitidos ? `, ${omitidos} omitidos` : ""}.`);
