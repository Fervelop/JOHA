# JOHA · Brilla con tu esencia

Sitio web y catálogo de **JOHA**, marca de accesorios y joyería femenina con baño de rodio.

| | |
| --- | --- |
| Sitio | https://joha-jw.netlify.app |
| Panel de administración | https://joha-jw.netlify.app/admin |
| Repositorio | https://github.com/Fervelop/JOHA |
| Pedidos | WhatsApp, a través de «Mi cotización» y los botones de cada pieza |

---

## 1. Lo que ya está hecho

### Identidad
- Logo JOHA recreado en vector (rosa, nombre, eslogan, corazón y líneas) con degradado dorado.
- Paleta de marca: rosa, rosa suave, rosa acento, dorado y vino. Tipografías: Bodoni Moda (títulos), Pinyon Script (frases manuscritas) y Jost (textos).
- Favicon (rosa dorada sobre vino), ícono para la pantalla de inicio del celular e imagen de vista previa al compartir el enlace (1200×630).

### Página
- **Portada** con el logo, frase, línea del rodio y tarjetas que giran como ruleta.
- **Catálogo** con filtros (Aretes, Sets, Collares y pulseras), etiqueta «Agotado» y vista ampliada de cada pieza con galería de varias fotos.
- **Calidad que perdura**: baño de rodio, no se oxida, no se mancha, acabado en espejo.
- **Cuida tus piezas**: guía de seis consejos.
- **Nuestra esencia** y **Cómo pedir** (tres pasos).
- **Ventana de bienvenida** configurable (por ahora: precios de lanzamiento).
- **Modo oscuro por defecto**, con botón para cambiar a claro (se recuerda la elección).
- Diseño adaptable a celular, tablet y computador; respeta la preferencia de «reducir movimiento».

### Mi cotización (carrito sin pagos)
- Botón **«Añadir a mi cotización»** en cada pieza y en su vista ampliada, con cantidad en el mismo lugar (máximo 5 por pieza; en 1 el «−» se vuelve basurita).
- Bolsa con contador arriba (computador) y **botón flotante** (celular y tablet).
- Carrito lateral con cantidades, basurita por pieza, nota opcional y sugerencias «Combina con tu cotización».
- **Enviar por WhatsApp** arma el mensaje con la lista y la nota; luego la cotización se vacía, con opción «Recuperar mi lista» durante 10 segundos.
- Las piezas agotadas no se pueden cotizar y salen solas de las listas guardadas.

### Panel de administración (Decap CMS)
- Inicio de sesión con GitHub; solo entran cuentas con permiso de escritura en el repositorio.
- **Productos** como fichas con miniatura, búsqueda, filtros (Disponibles, Agotados, En la portada) y grupos por tipo.
- Vista previa de la tarjeta, de la ventana de bienvenida y de la portada mientras se edita.
- **Página**: portada, ventana de bienvenida, textos de las secciones y ajustes generales (WhatsApp, Instagram, modo inicial, «Mi cotización» y secciones visibles).
- **Borradores y aprobación**: Guardar → Estado «Listo» → Publicar → Publicar ahora. En «En revisión» Netlify genera una vista previa del sitio.
- Apariencia JOHA y tipografía Atkinson Hyperlegible para facilitar la lectura.

### Seguridad y rendimiento
- Cabeceras de seguridad (HSTS, anti-incrustación, `nosniff`, política de permisos) y políticas de contenido (CSP) para la página y el panel.
- Panel alojado en el propio sitio con versión fija (Decap CMS 3.17.3), fuera de buscadores.
- La página solo muestra fotos alojadas en `images/` y trata como texto todo lo que se escribe en el panel.
- Fotos optimizadas automáticamente por Netlify Image CDN (WebP/AVIF y tamaño justo).
- Cada cambio queda registrado en GitHub y se puede revertir.

---

## 2. Cómo se usa el panel

1. Entrar a **/admin** → «Iniciar sesión con GitHub».
2. **Productos** → abrir una ficha o «+ producto».
3. Editar y pulsar **Guardar** (queda como borrador).
4. Cambiar el estado a **Listo** (o «En revisión» para ver la vista previa).
5. **Publicar → Publicar ahora**. La página se actualiza en uno o dos minutos.

Consejos:
- **Orden en el catálogo:** número menor aparece primero (10, 20, 30…; usa 15 para intercalar).
- **Portada:** activar «¿Mostrar en la portada?» en las piezas deseadas, o elegir fotos propias en Página → Portada.
- **Negrita en textos:** escribir la palabra entre `**asteriscos**`.
- **Fotos:** PNG, JPG o WebP de hasta 5 MB; se optimizan solas.

Para dar acceso a otra persona: GitHub → Fervelop/JOHA → Settings → Collaborators → Add people (permiso Write). Pedirle que active la verificación en dos pasos.

---

## 3. Lo que falta por hacer

### Contenido y marca
- [ ] **Logo oficial en vector** (si existe el archivo original del diseñador) para reemplazar la recreación.
- [ ] **Fotos con modelo** usando las piezas (aretes y collares puestos).
- [ ] **Manual de identidad visual**: uso del logo, colores, tipografías y ejemplos correctos e incorrectos.
- [ ] **Packaging**: bolsas, cajas, tarjetas y etiquetas con la nueva identidad.
- [ ] **Plantillas para redes** (1:1, 4:5 y 9:16) con el mismo estilo de la página.
- [ ] **Colecciones** con nombre propio, cuando se definan.

### Comercial
- [ ] **Precios**: decidir si se muestran en la página o se siguen dando por WhatsApp.
- [ ] **Información práctica**: envíos (ciudades y tiempos), formas de pago y cambios, en una sección de preguntas frecuentes.
- [ ] **Recomendaciones de cuidado** confirmadas por JOHA (las actuales son las habituales para baño de rodio).

### Técnico
- [ ] **Dominio propio** (por ejemplo joha.com.co) y actualizar enlaces, imagen para compartir y panel.
- [ ] **Google Search Console** y, si aplica, **perfil de Google Business**.
- [ ] Revisar la página con **Lighthouse** en celular y ajustar lo que salga.
- [ ] Mantener **Decap CMS** actualizado (cada pocos meses, revisar nuevas versiones).

---

## 4. Ideas de nuevas funcionalidades

**Ventas**
- **Enlace por pieza**: cada pieza con su propio enlace para compartirla; al abrirlo se ve ampliada.
- **Etiqueta «Nuevo»** y sección de novedades, controladas desde el panel.
- **Avísame cuando vuelva**: en piezas agotadas, un botón que envía por WhatsApp el interés en esa pieza.
- **Combos o sets sugeridos**: armar desde el panel combinaciones (aretes + collar) que se añaden a la cotización con un toque.
- **Fechas especiales**: ventana de bienvenida y portada programadas para Amor y Amistad, Día de la Madre o Navidad.
- **Datos de la clienta** (nombre y ciudad, opcionales) incluidos en el mensaje de la cotización.

**Conocer a las clientas**
- **Medición de visitas** con una herramienta sin cookies (por ejemplo GoatCounter): de dónde llegan y qué piezas se cotizan más. Revisar si se necesita aviso de privacidad (Ley 1581).
- **Registro de cotizaciones** en el panel (piezas y fecha) para ver lo más pedido, usando formularios de Netlify.

**Confianza y comunidad**
- **Opiniones de clientas** reales, con su permiso, editables desde el panel.
- **Galería de Instagram** o sección «Así las lucen» con fotos de clientas (con permiso).
- **Tarjeta de regalo** o mensaje para regalo dentro de la cotización.

**Experiencia**
- **Búsqueda** en el catálogo y orden por novedad.
- **Zoom** en las fotos de la vista ampliada.
- **Versión en inglés**, si se proyecta vender fuera de Colombia.

---

## 5. Estructura del proyecto

| Ruta | Contenido |
| --- | --- |
| `index.html` | La página (estructura y estilos) |
| `js/app.js` | Catálogo, ruleta, ventana de bienvenida, «Mi cotización», textos y ajustes |
| `js/tema.js` | Modo oscuro por defecto y elección guardada |
| `content/productos/*.json` | Una ficha por pieza (la edita el panel) |
| `scripts/compilar.js` | Une las fichas en `data/productos.json` en cada publicación |
| `data/productos.json` | Catálogo compilado (no editar a mano) |
| `data/portada.json` | Frase de la portada y tarjetas que giran |
| `data/promo.json` | Ventana de bienvenida |
| `data/textos.json` | Textos de las secciones |
| `data/ajustes.json` | WhatsApp, Instagram, modo inicial, cotización y secciones visibles |
| `images/productos/` | Fotos (las sube el panel) |
| `admin/` | Panel: configuración, vista previa, apariencia y Decap CMS |
| `netlify.toml` | Compilación, cabeceras de seguridad y caché |

### Configuración de Netlify y GitHub (ya hecha)
- Netlify sitio **joha-jw** conectado a `Fervelop/JOHA`, rama `main`, carpeta de publicación `.`; el comando de compilación lo define `netlify.toml`.
- App OAuth de GitHub «Panel JOHA» con callback `https://api.netlify.com/auth/done`, instalada en Netlify → Access & security → OAuth.

### Subir cambios hechos fuera del panel
```
git pull
# copiar o editar archivos
git add -A
git commit -m "Descripción del cambio"
git push
```
Antes de hacer cambios por código, conviene no publicar desde el panel hasta terminar el `git push`, para no pisar cambios.
