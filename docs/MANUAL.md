# Manual de entrega y uso — Sitio web INFELCOM

Versión: 4 de octubre de 2026

## 1. Introducción

Este manual entrega el sitio web oficial de INFELCOM (Grupo de Investigación en Informática, Electrónica y Telecomunicaciones, UPTC Seccional Sogamoso) y explica cómo instalarlo, publicarlo, usarlo y administrarlo.

El sitio tiene dos partes:

- **Sitio público** (https://infelcom.co): inicio, investigadores, semilleros, proyectos, noticias y contacto, en español e inglés, con tema claro u oscuro.
- **Panel de administración** (`/admin`): permite a los administradores editar todo el contenido sin tocar código. Los cambios se publican de inmediato.

Dirigido a: el equipo técnico que recibe el código (secciones 2 y 5) y los administradores de contenido (secciones 3 y 4).

## 2. Entrega técnica

Se entrega el repositorio `infelcom-uptc-sogamoso/infelcom-website` (GitHub), una aplicación Next.js que necesita Node.js y una base de datos MongoDB.

### 2.1 Qué se entrega

- Código fuente completo y documentación técnica en `README.md`.
- Sitio público bilingüe (ES/EN) con tema claro/oscuro.
- Panel `/admin` para contenido del sitio, investigadores, semilleros, proyectos y noticias.
- Formulario de contacto que envía correos a infelcom@infelcom.co mediante Resend.
- Pruebas unitarias (`npm test`).

### 2.2 Tecnologías

| Componente | Tecnología |
| --- | --- |
| Framework | Next.js 16 (Pages Router) + React 19 |
| Lenguaje | TypeScript 5 |
| Interfaz | Material UI 5, CSS Modules |
| Editor de noticias | Tiptap 3 |
| Base de datos | MongoDB + Mongoose 8 |
| Autenticación | NextAuth 4 (correo y contraseña, sesión de 30 días) |
| Correo | Resend |

### 2.3 Requisitos

- Node.js 20 o superior (probado con 24).
- Una base MongoDB accesible (por ejemplo MongoDB Atlas).
- Una cuenta de Resend con el dominio `infelcom.co` verificado, para el formulario de contacto.
- Un servidor o servicio que ejecute Node.js (por ejemplo Vercel o un VPS).

### 2.4 Variables de entorno

Copiar `.env.example` a `.env.local` (o configurarlas en el servicio de hosting):

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `MONGO_URL` | Sí | Cadena de conexión de MongoDB, con el nombre de la base. |
| `NEXTAUTH_SECRET` | Sí | Clave para firmar las sesiones. Generar con `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Sí | URL pública, p. ej. `https://infelcom.co`. |
| `RESEND_API_KEY` | Para contacto | Envío del formulario de contacto. |
| `GRUPLAC_URL` | No | Enlace inicial a GrupLAC; después se edita desde `/admin`. |

`JWT_SECRET` aparece en `.env.example` pero el código no la usa; puede dejarse vacía.

### 2.5 Instalación local

1. `git clone https://github.com/infelcom-uptc-sogamoso/infelcom-website.git`
2. `cd infelcom-website && npm install`
3. `cp .env.example .env.local` y completar las variables.
4. `npm run dev` y abrir http://localhost:3000.
5. Verificar: `npm run lint` y `npm test`.

### 2.6 Despliegue en producción

1. Configurar las variables de entorno en el servidor.
2. `npm ci && npm run build`.
3. `npm start` (puerto 3000 por defecto; usar `PORT=` para cambiarlo) detrás de un proxy con HTTPS.
4. Apuntar el dominio `infelcom.co` al servidor.

En Vercel basta con importar el repositorio y cargar las variables; cada push a `main` despliega.

### 2.7 Primer administrador

No existe registro público. El primer administrador se crea directamente en la base de datos (contraseña cifrada con bcrypt):

```bash
MONGO_URL="mongodb://..." node -e "
const m=require('mongoose'),b=require('bcryptjs');
m.connect(process.env.MONGO_URL).then(()=>m.connection.db.collection('users').insertOne({
  nickname:'admin', email:'admin@infelcom.co', password:b.hashSync('CAMBIAR-ESTA-CLAVE'), role:'admin',
  createdAt:new Date(), updatedAt:new Date() })).then(()=>process.exit())"
```

Ejecutarlo desde la carpeta del proyecto (usa sus dependencias) y entregar la clave al administrador por un canal privado.

### 2.8 Lista de verificación de entrega

- [ ] Acceso al repositorio de GitHub transferido al responsable de la UPTC
- [ ] Base MongoDB creada y `MONGO_URL` configurada
- [ ] `NEXTAUTH_SECRET` nueva y única para producción
- [ ] Dominio y API key de Resend configurados; formulario de contacto probado
- [ ] Primer administrador creado e ingreso a `/admin` verificado
- [ ] Contenido revisado en español e inglés

## 3. Uso del sitio público

Cualquier visitante navega el sitio sin registrarse; el menú superior lleva a cada sección.

### 3.1 Páginas

| Menú | Dirección | Contenido |
| --- | --- | --- |
| Inicio | `/` | Portada, ¿Por qué nuestro grupo? (cifras), ¿Qué hacemos?, semilleros, noticias recientes y contacto. |
| Nosotros | `/researchers` | Investigadores visibles con foto, cargo, correo y enlace a CvLAC. |
| Proyectos | `/projects` | Todos los proyectos; cada uno abre su ficha `/projects/<id>` con enlace a su semillero. |
| Noticias | `/stories` | Noticias; cada una abre su página completa `/stories/<id>`. |
| Contacto | `/#contact` | Datos de contacto y formulario. |
| (desde el inicio) | `/groups/<slug>` | Página de cada semillero: descripción, objetivos, líneas, director, integrantes y proyectos. |

Un semillero inactivo no aparece en el inicio, pero su página sigue disponible con la etiqueta "Inactivo".

### 3.2 Idioma (ES / EN)

- El sitio elige el idioma del navegador: español para navegadores en español, inglés para todos los demás.
- El botón **ES / EN** del menú cambia el idioma y lo recuerda durante un año.
- Las direcciones en español llevan el prefijo `/es` (por ejemplo `/es/projects`); las de inglés no llevan prefijo.
- Si un investigador, proyecto o noticia no tiene texto en inglés, se muestra el español.

### 3.3 Tema (Sistema / Claro / Oscuro)

El selector de tema del menú ofrece **Sistema** (sigue la configuración del dispositivo), **Claro** y **Oscuro**. La elección se recuerda en el navegador.

### 3.4 Formulario de contacto

1. Ir a **Contacto** en el menú.
2. Completar nombre, apellido, teléfono, correo, institución y mensaje (todos obligatorios).
3. Pulsar **Enviar**. El mensaje llega a infelcom@infelcom.co; responder al correo contesta directamente al remitente.

## 4. Uso del panel de administración

Todo el contenido del sitio se edita desde `/admin`; al pulsar **Guardar**, el cambio aparece en la página pública de inmediato (en ambos idiomas).

### 4.1 Ingresar y salir

1. Abrir https://infelcom.co/admin. Sin sesión, el sitio lleva a la página de ingreso.
2. Escribir correo y contraseña de un usuario administrador y pulsar **Ingresar**.
3. Para salir, abrir el menú lateral y elegir **Salir**. La sesión dura 30 días si no se cierra.

Un usuario sin rol de administrador es enviado al inicio. No hay registro público ni recuperación de contraseña: las cuentas las crea el equipo técnico (sección 2.7).

### 4.2 Pantalla principal

El **Módulo de administración** muestra una tarjeta **Editar contenido del sitio** y cuatro tablas: Investigadores, Semilleros, Proyectos y Noticias. En cada tabla:

- **Nuevo …** crea un registro.
- El lápiz edita un registro.
- La papelera lo elimina, previa confirmación. **La eliminación no se puede deshacer.**
- Las tablas permiten ordenar, filtrar y buscar.

### 4.3 Contenido del sitio

En **Editar contenido del sitio** cada sección de la página es un panel desplegable:

| Panel | Qué se edita |
| --- | --- |
| Organización | Nombre y logo (menú, pie de página y título de las pestañas). |
| Portada | Frase principal, botones, video e imagen del inicio. |
| Nosotros | Cifras de "¿Por qué nuestro grupo?". |
| ¿Qué hacemos? | Áreas de trabajo. |
| Semilleros / Noticias | Encabezados de esas secciones del inicio. |
| Contacto | Correo, teléfono, WhatsApp, dirección, ciudad, país, horario y enlace a GrupLAC (se ven en Contacto y en el pie de página). |
| Redes sociales | Enlaces del pie de página; solo aparecen las redes con URL. |
| Páginas | Encabezados de Nosotros, Proyectos y Noticias. |

Cómo llenar los campos:

- Los textos tienen dos casillas lado a lado, **ES** y **EN**. Si una queda vacía, se usa la otra.
- Las imágenes aceptan una URL (`https://…`), una ruta del sitio (`/logo.png`) o un archivo de hasta 300 KB.
- Las listas (cifras, áreas, redes) permiten agregar, quitar y reordenar elementos.
- Si hay errores, los paneles afectados se abren solos y marcan el campo. El aviso "cambios sin guardar" indica que falta pulsar **Guardar**.

### 4.4 Investigadores

Campos: nombre, apellido, cargo (ES/EN), correo, URL de CvLAC, foto, rol y categoría. Marcar **Ocultar en la página pública** retira a la persona del sitio sin borrarla. Un investigador aparece en todos los semilleros donde esté asignado; editarlo una vez actualiza todas esas páginas. Al eliminarlo, sale automáticamente de sus semilleros.

### 4.5 Semilleros

Campos: código (p. ej. `SCIECOM`), nombre, descripción, objetivos, líneas e información adicional (ES/EN), URL amigable, logo, activo/inactivo, director, integrantes y proyectos asociados.

- **El código no se puede cambiar después de crear el semillero**, porque los proyectos se vinculan por él.
- Director e integrantes se eligen entre los investigadores ya creados.
- En **Proyectos asociados**, agregar un proyecto lo mueve a este semillero; quitarlo lo deja sin semillero, sin borrarlo.
- **Crear proyecto en este semillero** abre un proyecto nuevo con el semillero ya elegido.
- **Ver página pública** muestra la página del semillero con lo último guardado (no hay borradores).
- Eliminar un semillero desvincula sus proyectos; no borra proyectos ni personas.

### 4.6 Proyectos

Campos: título y resumen (ES; EN opcional), imagen, URL de demostración, semillero (o **Sin semillero**) y categoría.

### 4.7 Noticias

Campos: título, resumen e imagen, y el contenido con el editor de texto (títulos, negrita, listas, alineación y color). La versión en inglés es opcional; si falta, se muestra la española.

### 4.8 Mensajes del panel

| Mensaje | Qué hacer |
| --- | --- |
| Cambios guardados | Nada; ya está publicado. |
| Hay campos con datos no válidos | Corregir los campos marcados en rojo. |
| Tu sesión expiró o no tienes permisos | Ingresar de nuevo. |
| Error de conexión | Revisar internet y volver a guardar; los cambios siguen en pantalla. |
| Ya existe un semillero con ese código o esa URL | Usar otro código o URL amigable. |

## 5. Mantenimiento, seguridad y solución de problemas

El mantenimiento clave es respaldar MongoDB y mantener en secreto las variables de entorno; el resto del contenido se gestiona desde el panel.

### 5.1 Base de datos

| Colección | Contenido |
| --- | --- |
| `sitecontents` | Un único documento con todo el contenido editable del sitio. |
| `groups` | Semilleros (director e integrantes enlazan a `researchers`). |
| `researchers` | Investigadores. |
| `projects` | Proyectos (`group` = código del semillero). |
| `stories` | Noticias. |
| `users` | Usuarios del panel (contraseña cifrada, rol `admin` o `client`). |

Respaldo: `mongodump --uri="$MONGO_URL" --out=respaldo-AAAA-MM-DD`. Restaurar: `mongorestore --uri="$MONGO_URL" respaldo-AAAA-MM-DD`. Se recomienda un respaldo semanal y antes de cada cambio grande (en Atlas, activar los respaldos automáticos).

Si la colección `groups` está vacía, el sitio crea automáticamente SEMTEL, SCIECOM, SEMVR y SICTE.

### 5.2 Seguridad

- Todas las rutas `/admin` y `/api/admin` exigen sesión con rol administrador, verificada en el servidor.
- No hay credenciales en el código; `.env.local` no se sube a GitHub.
- Usar contraseñas fuertes y una cuenta por persona.
- Cambiar `NEXTAUTH_SECRET` cierra todas las sesiones abiertas (útil si se sospecha un acceso indebido).
- Para quitar el acceso a una persona, borrar su usuario o cambiar su `role` en la colección `users`.
- Cambiar una contraseña: actualizar `password` con `bcryptjs.hashSync('nueva-clave')`, igual que en la sección 2.7.

### 5.3 Actualizar el código

1. Trabajar en una rama y abrir un pull request hacia `main`.
2. Antes de fusionar: `npm run lint`, `npm test` y `npm run build`.
3. Desplegar (`npm run build && npm start`, o automático en Vercel).

Tareas frecuentes de desarrollo (agregar campos editables, textos de interfaz o páginas) están en la sección "Transferencia" del `README.md`.

### 5.4 Solución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| El sitio muestra textos por defecto y no los editados | MongoDB caída o `MONGO_URL` incorrecta | Revisar la conexión y los logs; el sitio sigue funcionando mientras tanto. |
| No se puede ingresar a `/admin` | Usuario sin rol `admin`, clave errónea o `NEXTAUTH_SECRET`/`NEXTAUTH_URL` mal configuradas | Revisar el usuario en `users` y las variables. |
| El formulario de contacto falla | `RESEND_API_KEY` inválida o dominio sin verificar en Resend | Revisar la cuenta de Resend y los logs ("Revisar logs del servidor"). |
| Un cambio no aparece en la página | Caché del navegador o de la página | Recargar; las páginas se regeneran al guardar y cada 60 segundos. |
| La página en inglés muestra español | Falta la traducción de ese registro | Completar los campos EN en el panel. |
| "Ya existe un semillero con ese código o esa URL" | Código o URL amigable repetidos | Elegir otros valores. |

### 5.5 Contacto institucional

Grupo INFELCOM, UPTC Facultad Seccional Sogamoso. Director: Jorge Enrique Espíndola Díaz, PhD. Correo: infelcom@uptc.edu.co.
