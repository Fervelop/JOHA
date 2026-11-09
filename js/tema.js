/* Aplica el tema guardado antes de pintar la página, para evitar parpadeo */
try {
  var t = localStorage.getItem("joha-tema");
  if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
} catch (e) {}
