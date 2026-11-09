# JOHA · Sitio web y panel de administración

Sitio: https://joha-jw.netlify.app  
Panel: https://joha-jw.netlify.app/admin

Página estática (sin compilación) publicada en Netlify. Los productos y ajustes
se editan desde el panel, que guarda los cambios en este repositorio; Netlify
publica cada cambio en uno o dos minutos.

## Estructura

| Ruta | Qué contiene |
| --- | --- |
| `index.html` | La página |
| `js/app.js` | Lógica: catálogo, ruleta, ventana de lanzamiento, WhatsApp |
| `js/tema.js` | Modo claro / oscuro |
| `data/productos.json` | Catálogo (lo edita el panel) |
| `data/ajustes.json` | WhatsApp, Instagram y ventana de lanzamiento (lo edita el panel) |
| `images/productos/` | Fotos de productos (las sube el panel) |
| `admin/` | Panel (Decap CMS 3.17.3, alojado aquí mismo) |
| `netlify.toml` | Cabeceras de seguridad y caché |

## Puesta en marcha (una sola vez)

### 1. Subir este repositorio a GitHub
Crear el repositorio `joha` en la cuenta **fervelop** y subir todo el contenido
de esta carpeta a la rama `main`.

### 2. Conectar Netlify al repositorio
Netlify → sitio **joha-jw** → *Project configuration* → *Build & deploy* →
*Continuous deployment* → **Link repository** → GitHub → `fervelop7/joha`.

- Branch: `main`
- Build command: *(vacío)*
- Publish directory: `.`

### 3. Crear la app OAuth en GitHub
GitHub (fervelop7) → *Settings* → *Developer settings* → *OAuth Apps* → **New OAuth App**

- Application name: `Panel JOHA`
- Homepage URL: `https://joha-jw.netlify.app`
- Authorization callback URL: `https://api.netlify.com/auth/done`

Guardar el **Client ID** y generar un **Client secret**.

### 4. Instalar el proveedor en Netlify
Netlify → sitio **joha-jw** → *Project configuration* → *Access & security* →
**OAuth** → *Install provider* → **GitHub** → pegar Client ID y Client secret.

### 5. Entrar al panel
Abrir https://joha-jw.netlify.app/admin → **Iniciar sesión con GitHub**.

## Seguridad

- Solo pueden entrar al panel las cuentas de GitHub con **permiso de escritura**
  en este repositorio. Nadie más puede editar, aunque conozca la dirección.
- Activar la **verificación en dos pasos** en la cuenta de GitHub
  (*Settings → Password and authentication*).
- El Client secret vive solo en Netlify; no está en este repositorio.
- El panel no aparece en buscadores (`noindex` y `robots.txt`).
- Cabeceras de seguridad en `netlify.toml`: HSTS, protección contra
  incrustación (clickjacking), `nosniff`, política de permisos y una política de
  contenido (CSP) para el panel. La página tiene su propia CSP.
- El panel se sirve desde el propio sitio, con versión fija; no depende de CDNs.
- La página solo muestra fotos alojadas en `images/` y escapa los textos, así que
  un dato mal escrito no puede inyectar código.
- Cada cambio queda registrado como commit: se puede ver quién cambió qué y
  revertirlo.

## Uso diario del panel

**Agregar producto:** Tienda → Catálogo de productos → *Añadir producto* →
nombre, tipo, foto → Publicar.

**Marcar agotado:** abrir el producto → activar *Agotado* → Publicar.

**Portada:** activar *Mostrar en la portada* en las piezas que quieras en la
ruleta. Las agotadas nunca se muestran ahí. Si hay menos de 3 marcadas, se
completan con otras disponibles.

**Orden:** arrastrar los productos en la lista; ese es el orden en la página.

**Ventana de lanzamiento:** Tienda → Ajustes generales → activar o desactivar
y cambiar título y texto.

Las fotos se optimizan solas al mostrarse (Netlify Image CDN), así que se pueden
subir tal cual salen de la edición (máximo 5 MB).
