# INFELCOM UPTC - Platform Website

Plataforma web oficial del Grupo de Investigación en Informática, Electrónica y Telecomunicaciones (**INFELCOM**) de la Universidad Pedagógica y Tecnológica de Colombia (UPTC), Facultad Seccional Sogamoso.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js 16 (Pages Router) + React 19
* **Lenguaje:** TypeScript 5.x
* **UI & Styling:** Material UI (MUI v5, CSS variables), Emotion, CSS Modules
* **Editor WYSIWYG:** Tiptap v3 (noticias)
* **Base de datos & ODM:** MongoDB & Mongoose
* **Autenticación:** NextAuth.js (credenciales, sesión JWT)
* **Datos en el cliente:** SWR, Axios
* **Formularios:** react-hook-form

---

## 🚀 Ejecutar y probar

```bash
cp .env.example .env.local   # completar las variables (ver abajo)
npm install
npm run dev                  # http://localhost:3000
npm run lint
npm test                     # tests unitarios (node:test, sin dependencias extra)
npm run build && npm start   # producción
```

| Variable          | Uso                                                                 |
| :---------------- | :------------------------------------------------------------------ |
| `MONGO_URL`       | Cadena de conexión de MongoDB (incluye el nombre de la base).       |
| `NEXTAUTH_SECRET` | Firma de la sesión JWT. Obligatoria en producción.                  |
| `NEXTAUTH_URL`    | URL pública del sitio (p. ej. `https://infelcom.co`).               |
| `RESEND_API_KEY`  | Envío del formulario de contacto (Resend).                          |
| `GRUPLAC_URL`     | Valor inicial del enlace a GrupLAC (luego editable desde `/admin`). |

Sin `MONGO_URL` o con la base caída el sitio **sigue funcionando** con el contenido predeterminado (ver [Fallbacks](#fallbacks)).

---

## 🛡️ Administración (`/admin`)

### Entrar

1. Ir a `/admin` (o `/es/admin`). Sin sesión, el sitio redirige a `/auth/login`.
2. Ingresar con un usuario cuyo `role` sea `admin`. Un usuario con otro rol es redirigido al inicio.

No existe registro público. Para crear un administrador hay que insertarlo directamente en la colección `users` (contraseña con bcrypt):

```bash
MONGO_URL="mongodb://..." node -e "
const m=require('mongoose'),b=require('bcryptjs');
m.connect(process.env.MONGO_URL).then(()=>m.connection.db.collection('users').insertOne({
  nickname:'admin', email:'admin@infelcom.co', password:b.hashSync('CAMBIAR-ESTA-CLAVE'), role:'admin',
  createdAt:new Date(), updatedAt:new Date() })).then(()=>process.exit())"
```

### Qué se edita y dónde

| Pantalla                                      | Qué administra                                                                                                                                     |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin/content` · **Contenido del sitio**    | Organización (nombre, logo), portada del inicio (frase, botones, video, imagen), Nosotros (cifras), ¿Qué hacemos?, encabezado de semilleros, títulos de noticias, **contacto** (correo, teléfono, WhatsApp, dirección, ciudad, país, horario, GrupLAC), **redes sociales** y encabezados de las páginas internas. |
| `/admin` → Investigadores · `/admin/researchers/<id\|new>` | Personas del equipo: nombre, cargo (ES/EN), correo, CvLAC, foto, rol, categoría y visibilidad.                                         |
| `/admin` → Semilleros · `/admin/groups/<id\|new>`          | Código, nombre, descripción, objetivos, líneas e información adicional (ES/EN), URL amigable, logo, activo/inactivo, **director** e **integrantes** (elegidos entre los investigadores) y **proyectos asociados**. |
| `/admin` → Proyectos · `/admin/projects/<id\|new>`         | Título y resumen (ES/EN), imagen, URL, semillero (o ninguno) y categoría.                                                              |
| `/admin` → Noticias · `/admin/stories/<id\|new>`           | Título, resumen y contenido enriquecido (ES/EN), imagen.                                                                               |

En **Contenido del sitio** cada sección es un panel desplegable. Los textos tienen dos campos lado a lado, **ES** y **EN**; los datos neutros (teléfono, URLs, imágenes) tienen uno solo. Las imágenes aceptan una URL (`https://…`), una ruta de `public/` (`/logo.png`) o un archivo de hasta 300 KB. Las listas (cifras, áreas, semilleros, redes) permiten agregar, quitar y reordenar elementos. Al pulsar **Guardar** se valida, se guarda en la base de datos y el cambio se publica de inmediato.

Estados que muestra el panel: carga (skeletons), guardado exitoso, error al guardar, error de conexión, sesión expirada / sin permisos, campos obligatorios, datos inválidos (los paneles con errores se abren solos) y "cambios sin guardar".

---

## 🗄️ Base de datos

MongoDB, conexión en `src/database/db.ts` (`MONGO_URL`, timeout de 5 s para fallar rápido). Colecciones (nombre que crea Mongoose):

| Colección      | Modelo                       | Contenido                                                                                       |
| :------------- | :--------------------------- | :---------------------------------------------------------------------------------------------- |
| `sitecontents` | `src/models/siteContent.ts`  | **Un único documento** `{ key: 'site', data, updatedBy, createdAt, updatedAt }` con todo el contenido editable del sitio. |
| `groups`       | `src/models/group.ts`        | Un documento por semillero. `director` y `members` son referencias (ObjectId) a `researchers`. Inglés opcional en `en.*`. |
| `researchers`  | `src/models/researcher.ts`   | Un documento por investigador. Inglés opcional en `en.type`.                                    |
| `projects`     | `src/models/project.ts`      | Un documento por proyecto. `group` = código del semillero (`''` = sin semillero). Inglés opcional en `en.title`, `en.description`. |
| `stories`      | `src/models/story.ts`        | Un documento por noticia. Inglés opcional en `en.title`, `en.resume`, `en.content`.             |
| `users`        | `src/models/user.ts`         | Usuarios del panel (`email`, `password` bcrypt, `role`: `admin` \| `client`).                   |

### El documento `sitecontents`

`data` tiene exactamente la forma de `defaultContent` en **`src/content/siteContent.ts`**, que es la única fuente de verdad: de ahí salen el formulario del admin, la validación de la API y los valores por defecto. Cada clave de primer nivel es una sección de la página:

| Clave de `data`   | Se ve en                                                          |
| :---------------- | :---------------------------------------------------------------- |
| `site`            | Navbar (logo/nombre), footer, `<title>` y metadatos de todas las páginas |
| `hero`            | Portada del inicio                                                |
| `about`           | Inicio · "¿Por qué nuestro grupo?" (cifras)                       |
| `areas`           | Inicio · "¿Qué hacemos?"                                          |
| `groups`          | Inicio · encabezado de la sección Semilleros (las tarjetas salen de la colección `groups`) |
| `news`            | Inicio · encabezado de noticias                                   |
| `contact`         | Inicio · sección Contacto **y** footer (misma fuente, sin duplicar) |
| `social`          | Footer (solo se muestran las redes con URL)                       |
| `pages.*`         | Encabezados de `/researchers`, `/projects`, `/stories`            |

Un texto bilingüe se guarda como `{ "es": "…", "en": "…" }`; un dato neutro como string. Ejemplo:

```json
{ "key": "site", "data": { "hero": { "lead": { "es": "Investigamos para cambiar el mundo.", "en": "We do research to change the world." }, "primaryHref": "/projects" }, "contact": { "phone": "+57 3005600943" } } }
```

### Fallbacks

* **Base vacía** (nunca se ha guardado): se usa `defaultContent` completo; el admin muestra un aviso y el primer **Guardar** crea el documento (upsert).
* **Base caída**: `getSiteContent()` (`src/database/dbContent.ts`) captura el error, lo registra y devuelve `defaultContent`. La página nunca se rompe.
* **Campo vacío o faltante**: `conform()` lo completa — texto bilingüe vacío → el otro idioma → el valor predeterminado; string vacío → el valor predeterminado. Claves desconocidas se descartan.
* **Investigadores / proyectos / noticias sin inglés**: la página en inglés muestra el texto en español (`inLocale()` en `src/i18n/locale.ts`).

### Semilleros: relaciones

```text
Semillero (groups) ──director──▶ Investigador (researchers)
        │          ──members───▶ Investigadores (researchers)
        └──code◀── group ── Proyectos (projects)
```

* **Página pública:** `/groups/<slug>` (`/es/groups/<slug>`), por ejemplo `/es/groups/ciencias-computacionales`. Una sola página dinámica (`src/pages/groups/[slug].tsx`) para todos; los datos vienen de `GET /api/group?slug=…`, que resuelve director, integrantes (solo los visibles) y proyectos. Cada proyecto enlaza a su ficha `/projects/<id>`, que a su vez enlaza al semillero. `/projects` sigue listando todos los proyectos.
* **Inicio:** las tarjetas de semilleros vienen de `GET /api/groups` (solo los activos) y enlazan a su página. Un semillero inactivo no aparece en el inicio, pero su página sigue accesible con la etiqueta "Inactivo".
* **Personas sin duplicar:** director e integrantes son referencias a `researchers`; editar a un investigador cambia todas las páginas donde aparece. Al eliminarlo se quita de los semilleros (`$pull` / `director: null`).
* **Proyectos:** el proyecto guarda el **código** del semillero (`group: 'SCIECOM'`), por eso el código no se puede cambiar después de crear el semillero. En la edición del semillero, "Proyectos asociados" es la lista completa: agregar un proyecto lo mueve a este semillero; quitarlo deja `group: ''` **sin borrar el proyecto**. "Crear proyecto en este semillero" abre `/admin/projects/new?group=<código>` con el semillero preseleccionado. Eliminar un semillero desvincula sus proyectos y no toca a las personas.
* **Datos iniciales:** si la colección `groups` está vacía, se crean automáticamente SEMTEL, SCIECOM, SEMVR y SICTE (`src/database/dbGroups.ts`); los proyectos existentes quedan vinculados porque ya guardaban esos códigos.
* **Vista previa:** no hay borradores; "Ver página pública" abre la página del semillero con lo último guardado.

---

## 🌐 Idiomas (ES / EN)

* **Rutas:** i18n nativo de Next (`next.config.js`). Inglés es el idioma por defecto y usa URLs sin prefijo (`/projects`); español vive bajo `/es` (`/es/projects`).
* **Detección automática** (`src/proxy.ts` + `pickLocale()`): se usa el idioma preferido del navegador (cabecera `Accept-Language`, equivalente a `navigator.language`). Nunca geolocalización ni permisos de ubicación; el país se ignora.

  | Navegador        | Idioma                 |
  | :--------------- | :--------------------- |
  | `es-CO`, `es-ES` | Español                |
  | `en-US`, `en-GB` | English                |
  | `fr-FR`, otros   | English (fallback)     |

* **Cambio manual:** botón `ES`/`EN` del navbar. Guarda la cookie `NEXT_LOCALE` (1 año), que **tiene prioridad** sobre la detección en las siguientes visitas.
* **Textos de interfaz** (menú, botones, formularios, validaciones, errores, admin): `src/i18n/messages.ts`. El objeto `en` está tipado desde `es`, así que olvidar una traducción es un error de compilación. Uso: `const { t, locale } = useT(); t.nav.home`.
* **Contenido administrable:** se edita en ambos idiomas desde el mismo formulario y la página muestra el del idioma activo (`localize()`), sin traducción automática.

---

## 🌓 Temas (System / Light / Dark)

* Selector en el navbar con tres opciones: **System** sigue al sistema operativo (`prefers-color-scheme`), **Light** y **Dark** lo fuerzan.
* Implementación: `CssVarsProvider` de MUI (`src/pages/_app.tsx`) con las paletas clara y oscura de `src/themes/theme.ts`. La elección se guarda en `localStorage` (`mui-mode`) y `InitColorSchemeScript` (`_document.tsx`) la aplica antes del primer pintado (sin destello claro).
* El atributo `data-mui-color-scheme` en `<html>` cambia también los tokens CSS de `src/styles/globals.css` (`--surface`, `--text`, `--border`, `--accent`…), que usan los CSS Modules. **En estilos nuevos usar esos tokens o la paleta de MUI, no colores fijos**, salvo sobre superficies que son oscuras en ambos temas (portada, navbar, footer).
* Aplica igual al sitio público y al panel `/admin`.

---

## 🏗️ Arquitectura

```text
Usuario
   ↓
Página pública  (getStaticProps + ISR, src/content/getContentProps.ts)
   ↓
Contenido/API   (getSiteContent → localize → ContentContext → useContent();
                 /api/projects, /api/researchers, /api/stories vía SWR)
   ↓
Base de datos   (MongoDB)
```

```text
Administrador
   ↓
/admin                     (src/pages/admin/*)
   ↓
Autenticación              (NextAuth; src/proxy.ts redirige a /auth/login si no hay sesión o el rol no es admin)
   ↓
API/Backend                (src/pages/api/admin/*: requireAdmin() verifica la sesión en el servidor,
                            valida los datos y solo escribe campos permitidos)
   ↓
Base de datos              (sitecontents / groups / researchers / projects / stories)
   ↓
Página pública actualizada (res.revalidate() regenera /, /projects, /researchers, /stories en ES y EN;
                            además ISR cada 60 s)
```

**Qué pasa al guardar el contenido del sitio:** el formulario envía `PUT /api/admin/content` → el proxy rechaza con 401 si el token no es de admin → `requireAdmin()` lo vuelve a comprobar → `validateContent()` rechaza formatos inválidos o inseguros (p. ej. `javascript:` en enlaces) con 400 y la lista de campos → `conform()` normaliza → `saveSiteContent()` hace upsert del documento `key: 'site'` guardando `updatedBy` → se revalidan las páginas públicas → la respuesta devuelve el contenido guardado y la fecha.

**Seguridad:** la protección no depende de ocultar botones. Toda ruta `/api/admin/*` exige sesión con rol `admin` en el proxy **y** en el handler. Las APIs de entidades solo aceptan una lista blanca de campos (`code`, `_id` y fechas los controla el servidor) y ejecutan los validadores del esquema. Los investigadores ocultos no salen de la API pública. No hay credenciales en el código: todo va en variables de entorno.

### Mapa de archivos

```text
src/
├── content/        # siteContent.ts (forma, defaults, validación), getContentProps, ContentContext
├── i18n/           # messages.ts (textos ES/EN), locale.ts (detección), useT
├── proxy.ts        # idioma + protección de /admin y /api/admin
├── components/
│   ├── admin/      # ContentFields (formulario generado), EntityForm, useNotice
│   ├── landing/    # secciones del inicio (leen useContent())
│   └── ui/         # Navbar, Footer, Preferences (idioma/tema), ContactChannels
├── database/       # db.ts (conexión), dbContent.ts, dbUsers.ts
├── models/         # esquemas Mongoose (group, project, researcher, story, siteContent, user)
├── pages/          # páginas públicas, /admin, /api
├── themes/         # tema MUI claro/oscuro
└── utils/          # requireAdmin, roles, pick, formato
```

### Transferencia: tareas frecuentes

* **Agregar un campo editable:** añadirlo a `defaultContent` (`src/content/siteContent.ts`), su etiqueta ES/EN en `messages.ts → admin.fields`, y leerlo con `useContent()`. El formulario y la validación salen solos. `npm test` falla si falta la etiqueta.
* **Agregar un texto de interfaz:** añadirlo en `es` y `en` de `messages.ts` y usar `t.…`.
* **Agregar una página pública con contenido:** `export const getStaticProps = getContentProps;` y sumar la ruta a `PUBLIC_PATHS` en `src/pages/api/admin/content.ts`.
* **El tipo de validación de un campo** (correo, teléfono, URL, imagen) se deduce de su nombre en `fieldKind()`.

---

## 🔬 Líneas de Investigación y Semilleros

| Línea de Investigación | Semillero Asociado | Enfoque Principal |
| :--- | :--- | :--- |
| **Ciberseguridad** | `SICTE` | Seguridad de la información, auditoría de sistemas y redes seguras. |
| **Realidad Virtual** | `SEMVR` | Entornos inmersivos, realidad aumentada y simulaciones interactivas. |
| **Telecomunicaciones** | `SEMTEL` | Sistemas de comunicación, procesamiento de señales y datos satelitales. |
| **Ciencias Computacionales** | `SCIECOM` | Algoritmos avanzados, inteligencia artificial y estructuras de datos. |

---

## 📧 Información Institucional

* **Grupo:** Grupo de Investigación en Informática, Electrónica y Telecomunicaciones (INFELCOM)
* **Institución:** UPTC - Facultad Seccional Sogamoso
* **Director:** Jorge Enrique Espíndola Díaz, PhD.
* **Correo:** infelcom@uptc.edu.co
* **Web:** [https://infelcom.co/](https://infelcom.co/)
