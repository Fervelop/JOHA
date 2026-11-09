/* Vista previa del panel: muestra cada producto como se verá en la página. */
(function () {
  if (!window.CMS || !window.h || !window.createClass) return;
  var CAT = { aretes: "Aretes", sets: "Set de collar y aretes", collares: "Collares y pulseras" };

  var Producto = createClass({
    asset: function (p) { return p ? String(this.props.getAsset(p)) : ""; },
    render: function () {
      var e = this.props.entry;
      var d = function (k) { return e.getIn(["data", k]); };
      var self = this;
      var img = this.asset(d("image"));
      var gal = d("galeria");
      var extras = gal && gal.toJS ? gal.toJS().map(function (g) { return self.asset(g && g.foto); }).filter(Boolean) : [];
      var fotos = (img ? [img] : []).concat(extras);
      var agotado = d("agotado") === true, destacado = d("destacado") === true;
      var nombre = d("nombre") || "Nombre de la pieza";

      var foto = function (src, cls) {
        return src
          ? h("div", { className: "ph " + (cls || "") },
              h("img", { className: "fill", src: src, alt: "" }),
              h("img", { className: "main", src: src, alt: "" }))
          : h("div", { className: "ph vacio" }, "Sube la foto principal");
      };

      return h("div", { className: "pv" },
        h("p", { className: "rot" }, "Así se verá en el catálogo"),
        h("div", { className: "card" },
          h("div", { className: "tarjeta" },
            agotado ? h("span", { className: "badge" }, "Agotado") : null,
            foto(img, agotado ? "gris" : ""),
            fotos.length > 1 ? h("span", { className: "mas" }, fotos.length + " fotos") : null),
          h("h3", null, nombre),
          h("span", { className: "cat" }, CAT[d("tipo")] || "Elige el tipo")),
        h("ul", { className: "estado" },
          h("li", { className: agotado ? "no" : "si" }, agotado ? "Agotado: se muestra con etiqueta y no sale en la portada" : "Disponible"),
          h("li", { className: destacado && !agotado ? "si" : "off" },
            destacado ? (agotado ? "Marcado para la portada, pero no saldrá porque está agotado" : "Sale en la ruleta de la portada") : "No sale en la portada"),
          h("li", { className: "off" }, "Posición en el catálogo: " + (d("orden") != null ? d("orden") : "100"))),
        fotos.length > 1
          ? h("div", null,
              h("p", { className: "rot" }, "Fotos al abrir la pieza"),
              h("div", { className: "galeria" }, fotos.map(function (f, i) {
                return h("div", { key: i, className: "mini" }, h("img", { src: f, alt: "" }));
              })))
          : null
      );
    }
  });

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("productos", Producto);
})();
