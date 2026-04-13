# Guía del panel de administración — asdspecials

Esta guía es para vos — quien se va a encargar de mantener la tienda. No hace falta que sepas nada de programación. Si sabés usar un correo web, vas a poder con esto.

**Índice**

1. [Bienvenida y primer ingreso](#1-bienvenida-y-primer-ingreso)
2. [Tour rápido del panel](#2-tour-rápido-del-panel)
3. [Mantener el catálogo](#3-mantener-el-catálogo)
4. [Editar el contenido de la home con Live Preview](#4-editar-el-contenido-de-la-home-con-live-preview)
5. [Buenas prácticas para fotos y precios](#5-buenas-prácticas-para-fotos-y-precios)
6. [Qué hacer cuando algo no sale como esperabas](#6-qué-hacer-cuando-algo-no-sale-como-esperabas)
7. [Glosario rápido](#7-glosario-rápido)

---

## 1. Bienvenida y primer ingreso

Tu tienda tiene dos partes:

- **La web pública** — la que ven tus clientes. Vive en `https://asdspecials.com` (o `http://localhost:3000` mientras estamos en desarrollo).
- **El panel de administración** — donde vos cargás y editás todo. Vive en la misma dirección pero agregándole `/admin` al final. Ejemplo: `http://localhost:3000/admin`.

**Para entrar al panel**:

1. Abrí el navegador y andá a **`/admin`**.
2. Poné tu mail y contraseña.
3. Listo — estás adentro.

> 💡 **Tip para tu celu**: en el navegador del celular entrá a `/admin`, tocá los tres puntitos del menú y elegí **"Agregar a pantalla de inicio"**. Te queda como si fuera una app y abrís el panel con un toque. Funciona en Android (Chrome) y iOS (Safari).

Si olvidaste la contraseña, hoy el panel manda los mails de recupero a la consola del servidor (porque todavía no conectamos un servicio de email). Pedile al equipo técnico que te la resetee. Cuando pongamos el sistema en producción, esto va a ser automático.

---

## 2. Tour rápido del panel

Cuando entrás al panel, a la izquierda vas a ver tres grupos:

### 🌿 Catálogo
Acá vive todo lo que está a la venta.

- **Categories** — Las categorías (Plantas, Macetas, Velas, etc.).
- **Products** — Los productos en sí.

### 📝 Contenido
Acá editás lo que aparece escrito en la web.

- **Media** — Todas las fotos que subís (se reutilizan entre productos, categorías y la home).
- **Contenido del sitio** — Los textos de la home: título del hero, frases del marquee, pilares, footer.

### ⚙️ Sistema
Administración del panel.

- **Users** — Quiénes pueden entrar al admin.

---

## 3. Mantener el catálogo

### 3.1. Crear una categoría

Las categorías son los grandes grupos bajo los que agrupás productos. Ejemplo: Plantas, Macetas, Velas.

1. Menú lateral → **Categories** → botón **"Create New"** (arriba a la derecha).
2. Completá:
   - **Nombre**: Cómo se llama. Ej: `Plantas`.
   - **Slug**: La versión "para URL" — minúsculas, sin espacios ni acentos. Ej: `plantas`. Si te equivocás, corregilo antes de guardar (después cambiarlo rompe los links).
   - **Descripción corta** (opcional): Una línea. Aparece debajo del título en la home. Ej: *"De interior, seleccionadas ejemplar por ejemplar."*
   - **Imagen de categoría** (opcional): La foto que aparece en el tile de la home para esa categoría. Si no subís nada, se usa una de fallback — pero siempre queda mejor si subís una.
3. Tocá **"Save"** (arriba a la derecha).

> ✅ **Después de crear una categoría, ya aparece en la home** en la sección "Tres categorías", y también como filtro en `/catalogo`.

### 3.2. Subir una foto al banco de imágenes (Media)

Antes de crear un producto con fotos, te conviene subir las fotos a Media. Así después las elegís de una lista y las podés reutilizar.

1. Menú lateral → **Media** → **"Create New"**.
2. Tocá donde dice **"Drop a file or browse"**. Se abre el explorador de archivos. En el celu, se abre la cámara / galería.
3. Elegí la foto.
4. **Texto alternativo** (obligatorio): Describí qué se ve en la foto, en pocas palabras. Ej: *"Monstera variegada en maceta plateada sobre mesa de madera"*. Esto es importante para:
   - **Accesibilidad**: gente con lectores de pantalla.
   - **SEO**: Google usa este texto para entender la foto.
5. **Save**.

Repetí por cada foto que quieras subir.

> 💡 **Buen flujo**: subí todas las fotos de un producto a Media *antes* de crear el producto. Después, al crear el producto, las enganchás todas juntas.

### 3.3. Crear un producto

1. Menú lateral → **Products** → **"Create New"**.
2. El formulario está dividido en **pestañas** (arriba del formulario). Andá completando de izquierda a derecha.

#### Pestaña "General"

- **Nombre**: El nombre que va a ver el cliente. Ej: `Monstera Deliciosa Variegada`.
- **Slug**: La versión URL. Ej: `monstera-deliciosa-variegada`. Todo minúsculas y separado con guiones, sin espacios ni acentos. Este slug se usa en la dirección del producto: `/producto/monstera-deliciosa-variegada`.
- **Categoría**: Elegí una de las que creaste antes. Si todavía no creaste la categoría, tocá el botoncito de "+" al lado del selector para crearla sin salir de acá.
- **Descripción corta**: Una o dos líneas. Aparece debajo del nombre en el catálogo y en el detalle.
- **Descripción larga**: Un editor con formato (negritas, itálicas, listas, etc.). Para más detalle — cuidados, origen del ejemplar, historia de la maceta. Podés dejar esto vacío si querés.
- **Destacado en la home**: Un checkbox. Si lo marcás, este producto va a aparecer en la sección **"Planta del mes"** de la home. **Solo uno debería estar destacado a la vez** — si marcás un segundo, el más reciente gana.

#### Pestaña "Precio y stock"

- **Precio (ARS)**: El precio actual en pesos. Solo el número: `8900`, no `$ 8.900`.
- **Precio tachado (opcional)**: Si ponés este campo, la web va a mostrar el "precio anterior" tachado al lado del precio real. Útil para promociones. Dejalo vacío si no hay descuento.
- **Stock disponible**: Cantidad que tenés. Actualizalo cuando vendas o te llegue mercadería nueva.
- **Estado**:
  - **Publicado**: Se ve en la web y se puede comprar.
  - **Borrador (no publicado)**: NO se ve en la web. Útil cuando lo estás cargando pero todavía no querés mostrarlo.
  - **Agotado — ocultar**: NO se ve en la web. Útil cuando se te agotó pero vas a reponerlo y no querés perder el registro.

#### Pestaña "Imágenes"

- Tocá **"Add Imagen"**. Se abre un selector donde podés:
  - **Elegir** una foto que ya subiste a Media (lo más común).
  - **Subir una nueva** desde acá mismo.
- La **primera imagen** es la que aparece en las cards del catálogo y como foto principal del detalle. Las demás se muestran como miniaturas en el detalle.
- Podés reordenar arrastrando las imágenes.

#### Pestaña "Plantas" (solo si el producto es una planta)

Completá solo si aplica, si no dejalo vacío.

- **Luz**: cuánta luz necesita la planta.
- **Riego**: con qué frecuencia regarla.
- **Tamaño aproximado**: ej `60–80 cm`.

Esta info aparece en el detalle del producto como especificaciones.

#### Pestaña "Macetas" (solo si el producto es una maceta)

- **Material**: por default `Aluminio cepillado`, cambialo si es otro.
- **Diámetro**: en cm, solo el número.
- **Altura**: en cm, solo el número.
- **Incluye base de hierro**: checkbox.

#### Guardar

Arriba a la derecha, **"Save"**. Listo. El producto ya está cargado.

### 3.4. Actualizar el stock de un producto (la tarea del día a día)

Esta es la tarea que vas a hacer más seguido. Desde el celu, tarda 20 segundos.

1. Menú lateral → **Products**.
2. En el listado, tocá el producto que vendiste.
3. Tocá la pestaña **"Precio y stock"**.
4. Cambiá el número en **"Stock disponible"**.
5. **Save**.

Si el stock llega a `0`, el producto sigue apareciendo en la web pero con un cartel de **"Agotado"** encima. El botón "Agregar al carrito" se deshabilita solo. No hace falta que cambies el estado a "Agotado — ocultar" *salvo* que quieras sacarlo temporalmente del catálogo.

### 3.5. Cambiar el precio

Mismo flujo que el stock — pestaña "Precio y stock", campo "Precio (ARS)", Save.

Si querés mostrar que tiene descuento, completá también **"Precio tachado"** con el valor anterior. La web lo va a mostrar tachado al lado del nuevo.

### 3.6. Despublicar / ocultar un producto temporalmente

1. Abrí el producto.
2. Pestaña **"Precio y stock"**.
3. Cambiá el **estado** a:
   - **Borrador** si estás revisándolo.
   - **Agotado — ocultar** si te quedaste sin stock y no querés que se vea hasta reponer.
4. Save.

### 3.7. Eliminar un producto

1. Abrí el producto.
2. Arriba a la derecha, tocá el menú **"⋮"** → **"Delete"**.
3. Confirmá.

> ⚠️ **Eliminar es definitivo**. Antes de borrar, pensá si en realidad no te conviene poner el estado en "Borrador" — así conservás los datos por si querés volver a publicarlo.

---

## 4. Editar el contenido de la home con Live Preview

Esta es la parte más "mágica" del panel. Vas a poder editar los textos de la home y verlos cambiar en vivo mientras tipeás, sin tener que refrescar nada.

### 4.1. Abrir el editor

1. Menú lateral → **Contenido del sitio**.
2. Arriba a la derecha vas a ver un **icono de ojo** (👁). Tocalo.
3. La pantalla se parte en dos:
   - **Izquierda**: el formulario con los campos.
   - **Derecha**: un iframe con la home, como la ve un cliente.
4. Arriba del iframe hay un selector **Móvil / Tablet / Desktop** — usalo para ver cómo queda en cada tamaño.

### 4.2. Cambiar el título del hero

1. Estando en el editor, pestaña **"Hero"**.
2. Campo **"Titular principal"**. Escribí lo que quieras — vas a ver el iframe actualizarse con cada tecla.

#### El truco de las itálicas

Si envolvés una palabra entre asteriscos, aparece en itálica verde musgo. Es el acento visual que tiene el diseño.

**Ejemplo**:

```
Plantas elegidas. Macetas que las *sostienen*.
```

Se ve así en la web:

> **Plantas elegidas. Macetas que las *sostienen*.**

La palabra `sostienen` queda en itálica color verde. Podés usarlo en cualquier palabra del titular.

Si querés un salto de línea, apretá Enter dentro del mismo campo.

### 4.3. Editar otros campos del Hero

- **Texto pequeño superior** (eyebrow): La pildorita arriba del título, típicamente algo como `Nueva entrada · Monstera Variegada`.
- **Subtítulo**: El párrafo debajo del título.
- **Botón principal**: Dos campos — **Label** (el texto del botón, ej "Ver plantas") y **Href** (a dónde te lleva, ej `/catalogo`).
- **Botón secundario**: Igual que el principal.

### 4.4. Pestaña "Marquee"

Esa tira con palabras que se mueve horizontalmente. Cada línea es un ítem.

- **Agregar**: Tocá **"Add Ítem del marquee"** al final y escribí el texto.
- **Reordenar**: Arrastrá los items usando el handle de la izquierda.
- **Eliminar**: El botón "×" a la derecha del ítem.

> 💡 **Tip**: mantené los textos cortos (3-5 palabras). Cosas como "Envío cuidado", "Series limitadas", "Próximamente · Mesas".

### 4.5. Pestaña "Pilares"

Los tres bloques "Cómo trabajamos". Van siempre de a 3, no más, no menos.

Cada pilar tiene:
- **Number**: `01`, `02`, `03`. Es el número grande italic.
- **Title**: Título corto, 2-4 palabras.
- **Body**: Un párrafo explicando el pilar. 2-3 líneas.

### 4.6. Pestaña "Footer"

- **Tagline**: El párrafo que describe la marca en el pie de página.
- **WhatsApp**: El número con código de país, sin `+` ni espacios. Ej `5491123456789`. (Por ahora no se usa en la web pero lo vamos a cablear en la próxima fase.)
- **Instagram**: El handle sin el `@`. Ej `asdspecials`. El link en el footer apunta automático a `instagram.com/asdspecials`.

### 4.7. Guardar

Cuando estés conforme con los cambios, tocá **"Save"** arriba a la derecha. Hasta que no toques Save, los cambios viven solo en el preview — si recargás la página, se pierden. Una vez que guardás, **pasan a estar en vivo para todo el público**.

---

## 5. Buenas prácticas para fotos y precios

### 5.1. Fotos

**Tamaño y aspecto**

- **Productos**: subí fotos en **formato vertical** (más alto que ancho), idealmente **4:5** o **3:4**. La web las recorta automáticamente al aspecto de las cards. Si subís una foto horizontal, se va a recortar por los costados.
- **Resolución**: entre **1200x1500 px** y **2000x2500 px**. Más grande está bueno para el zoom, pero no exageres — arriba de 3000 px empieza a pesar demasiado.
- **Formato**: JPG para fotos, PNG si tiene fondo transparente. WebP también funciona.
- **Peso**: idealmente bajo **500 KB por foto**. Si una foto pesa 5 MB, usá alguna herramienta online (tinypng.com, squoosh.app) para reducirla antes de subir.

**Estilo**

- **Fondo**: blanco o neutro clean. Mirá tu Instagram — ese es el estándar a seguir (blanco o gris claro, iluminación natural).
- **Luz**: natural siempre que se pueda. Evitá flash directo.
- **Composición**: la planta o maceta debe ocupar el 70-80% del encuadre, centrada.

**Cuántas fotos por producto**

- **Mínimo 1**, máximo 5 (las primeras 5 se muestran en la galería del detalle).
- **Ideal**: 3-4 por producto. La primera como "foto de portada" (la mejor), y 2-3 detalles (hoja, maceta, contexto).

### 5.2. Precios

- **Precio**: siempre en pesos argentinos, solo el número entero. `8900` no `8.900` ni `$8900`.
- **Precio tachado**: solo completalo si estás haciendo promoción. **No lo uses como "precio real"** — se ve tachado y confunde.
- **Cuotas**: no están configuradas como campo porque las maneja Mercado Pago al momento del pago. La web muestra automáticamente "hasta 6 cuotas sin interés" si Mercado Pago lo ofrece. Cuando conectemos el checkout te va a aparecer así.

### 5.3. Slugs

Los slugs son las URLs cortas. Se crean una sola vez y ya no los cambiás.

**Reglas**:
- Todo **minúsculas**.
- Palabras separadas por **guiones medios** (`-`), nunca espacios ni underscores.
- Sin acentos ni eñe: `monstera` no `móntera`, `pina` no `piña`.
- Cortos pero descriptivos: `monstera-variegada` sí, `la-hermosa-monstera-con-hojas-manchadas` no.

**Ejemplos buenos**:
- `monstera-deliciosa-variegada`
- `maceta-aluminio-22`
- `vela-musgo-200g`

---

## 6. Qué hacer cuando algo no sale como esperabas

### "Hice un cambio y no lo veo en la web"

1. **¿Tocaste "Save"?** Los cambios en el formulario no se guardan automático — hay que apretar Save.
2. **Refrescá la página pública** con `Ctrl + F5` (o `Cmd + Shift + R` en Mac). A veces el navegador cachea la versión vieja.
3. **¿El producto está en estado "Publicado"?** Si está en "Borrador" no se ve.
4. **¿El live preview mostraba bien el cambio?** Si sí → problema de caché (refrescar). Si no → el cambio no se aplicó.

### "Subí una foto pero en la web se ve otra"

La foto que vas a ver en la web es siempre **la primera del array de imágenes** del producto. Si querés otra foto como principal, abrí el producto → pestaña "Imágenes" → arrastrá la foto que querés al primer lugar → Save.

### "La foto se ve cortada en el catálogo"

Las cards del catálogo tienen un aspecto vertical (4:5). Si tu foto es horizontal, se va a recortar por los laterales. Tenés dos opciones:
- **Re-subir** la foto en formato vertical.
- **Mover el foco** editando la imagen en Media: al subir podés arrastrar el centro focal para indicar qué parte tiene que quedar siempre visible.

### "Me equivoqué y guardé. ¿Puedo deshacer?"

Payload guarda el historial de cambios. Abrí el documento y arriba, al lado de "Save", vas a ver un botón **"Versions"**. Ahí vas a ver cada save previo y podés **restaurar** una versión anterior con un click.

> ⚠️ Esta feature no viene activa por default — avísanos si querés que la activemos y lo hacemos al toque. Es muy útil como red de seguridad.

### "El panel no responde / se traba"

Cerrá la pestaña y volvé a entrar. Si el problema persiste, **no toques nada** y avisá al equipo técnico. No trates de "arreglar" tocando la base de datos u otros menús — los únicos que tenés que usar son **Products**, **Categories**, **Media**, **Contenido del sitio** y **Users**.

### "¿Cómo agrego otro usuario admin?"

1. Menú lateral → **Users** → **"Create New"**.
2. Completá mail, nombre, contraseña temporal.
3. **Save**.

Compartile la contraseña por un canal seguro (NO por mail público). La persona puede cambiarla después desde su perfil.

---

## 7. Glosario rápido

| Palabra | Qué significa |
|---|---|
| **Admin** o **Panel** | El lugar donde vos administrás todo. Vive en `/admin`. |
| **Catálogo** | La página donde el cliente ve todos los productos. Vive en `/catalogo`. |
| **Collection** | Una tabla del sistema. En nuestro caso: Products, Categories, Media, Users. |
| **Global** | Un "bloque" único de contenido (no una lista). En nuestro caso: Contenido del sitio. |
| **Slug** | La versión URL de un nombre. Ej: `Monstera Variegada` → `monstera-variegada`. |
| **Draft** | Borrador — guardado pero no publicado. No se ve en la web. |
| **Featured** | Destacado — ese producto aparece en "Planta del mes" en la home. |
| **Live Preview** | La vista en vivo mientras editás el contenido del sitio. |
| **Hero** | El bloque grande de arriba en la home — título principal, subtítulo, botones. |
| **Marquee** | La tira con palabras que se desliza horizontalmente. |
| **Pilares** | Los 3 bloques "Cómo trabajamos". |

---

## Última nota

Esta guía va a ir evolucionando. Cada vez que sumemos una feature nueva al admin (checkout, dashboard de órdenes, bot de WhatsApp, etc.) se agrega acá.

Si algo no está claro, o hay una tarea que hacés seguido y no la ves cubierta — avisame y la documento.
