import type { GlobalConfig } from "payload"

export const SiteContent: GlobalConfig = {
  slug: "site-content",
  label: "Contenido del sitio",
  admin: {
    group: "Contenido",
    description:
      "Textos, fotos y números editables de la home. Usá el botón Live Preview arriba a la derecha para ver los cambios en tiempo real. Podés guardar como borrador cuantas veces quieras y solo al tocar Publicar los cambios pasan a la web.",
    livePreview: {
      // URL relativa — el iframe la resuelve contra el origen donde está
      // abierto el admin. Así funciona en localhost, LAN y producción sin
      // hardcodear ningún host.
      url: () => "/",
      breakpoints: [
        { label: "Móvil", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 820, height: 1180 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
    },
    max: 20,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Texto pequeño superior",
                  defaultValue: "Nueva entrada · Monstera Variegada",
                },
                {
                  name: "headline",
                  type: "text",
                  required: true,
                  label: "Titular principal",
                  defaultValue: "Plantas elegidas. Macetas que las *sostienen*.",
                  admin: {
                    description:
                      "La palabra entre *asteriscos* aparece en itálica verde musgo (ej: *sostienen*).",
                  },
                },
                {
                  name: "subheadline",
                  type: "textarea",
                  label: "Subtítulo",
                  defaultValue:
                    "Seleccionamos cada planta a mano — sanas, aclimatadas, listas para entrar a tu casa — y las presentamos en macetas de aluminio cepillado hechas para durar toda la vida.",
                },
                {
                  name: "primaryCta",
                  type: "group",
                  label: "Botón principal",
                  fields: [
                    { name: "label", type: "text", defaultValue: "Ver plantas" },
                    { name: "href", type: "text", defaultValue: "/catalogo" },
                  ],
                },
                {
                  name: "secondaryCta",
                  type: "group",
                  label: "Botón secundario",
                  fields: [
                    { name: "label", type: "text", defaultValue: "Explorar macetas" },
                    { name: "href", type: "text", defaultValue: "/catalogo?c=macetas" },
                  ],
                },
                {
                  name: "mainImage",
                  type: "upload",
                  relationTo: "media",
                  label: "Imagen principal (destacada)",
                  admin: {
                    description:
                      "La foto grande del hero. Recomendado: vertical 4:5, mínimo 1200×1500 px, fondo limpio.",
                  },
                },
                {
                  name: "mainImageCaption",
                  type: "text",
                  label: "Nombre bajo la imagen",
                  defaultValue: "Monstera Variegada",
                },
                {
                  name: "mainImageTag",
                  type: "text",
                  label: "Etiqueta bajo la imagen",
                  defaultValue: "Stock limitado",
                  admin: {
                    description:
                      "Texto corto en mayúsculas, tipo 'Stock limitado' o 'Edición 12/12'.",
                  },
                },
                {
                  name: "imageTextTone",
                  type: "select",
                  label: "Color del texto sobre la imagen",
                  defaultValue: "dark",
                  options: [
                    { label: "Oscuro — para imágenes claras", value: "dark" },
                    { label: "Claro — para imágenes oscuras", value: "light" },
                  ],
                  admin: {
                    description:
                      "Si el nombre y la etiqueta no se leen bien sobre la foto, cambiá al tono opuesto.",
                  },
                },
                {
                  name: "sideCard",
                  type: "group",
                  label: "Card flotante (esquina inferior izquierda)",
                  fields: [
                    {
                      name: "image",
                      type: "upload",
                      relationTo: "media",
                      label: "Imagen",
                    },
                    {
                      name: "label",
                      type: "text",
                      label: "Etiqueta",
                      defaultValue: "Maceta",
                    },
                    {
                      name: "value",
                      type: "text",
                      label: "Valor",
                      defaultValue: "Aluminio Ø22 cm",
                    },
                  ],
                },
                {
                  name: "stats",
                  type: "array",
                  label: "Stats (los 3 números bajo los botones)",
                  minRows: 3,
                  maxRows: 3,
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "value", type: "text", required: true },
                  ],
                  defaultValue: [
                    { label: "Plantas", value: "120+" },
                    { label: "Macetas", value: "6 medidas" },
                    { label: "Envío", value: "Todo el país" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Marquee",
          fields: [
            {
              name: "marquee",
              type: "array",
              label: "Ítems del marquee",
              minRows: 3,
              fields: [{ name: "label", type: "text", required: true }],
              defaultValue: [
                { label: "Monstera Variegada" },
                { label: "Aluminio cepillado" },
                { label: "Plantas sanas garantizadas" },
                { label: "Envíos a toda Argentina" },
                { label: "Series limitadas" },
                { label: "Próximamente · Mesas de living" },
              ],
            },
          ],
        },
        {
          label: "Colecciones",
          fields: [
            {
              name: "collectionsIntro",
              type: "group",
              label: "Introducción de la sección de categorías",
              fields: [
                {
                  name: "title",
                  type: "textarea",
                  label: "Título",
                  defaultValue:
                    "Tres categorías. *Una obsesión*:\nque la pieza viva mucho tiempo.",
                  admin: {
                    description:
                      "Usá *asteriscos* para itálica verde. Apretá Enter para saltar de línea.",
                  },
                },
              ],
            },
            {
              name: "categoryTextTones",
              type: "array",
              label: "Color del texto sobre cada categoría",
              labels: { singular: "Override", plural: "Overrides" },
              admin: {
                description:
                  "Por defecto el nombre de la categoría se muestra en tono claro. Si cargás una imagen clara, agregá una fila con el slug de la categoría (ej: 'velas-soja') y elegí 'Oscuro' para que el texto se lea. Solo necesitás entradas para las categorías que no contrastan.",
              },
              fields: [
                {
                  name: "slug",
                  type: "text",
                  required: true,
                  label: "Slug de la categoría",
                  admin: {
                    description:
                      "El slug tal como aparece en WooCommerce (ej: 'plantas', 'macetas', 'velas-soja'). Todo en minúsculas y con guiones.",
                  },
                },
                {
                  name: "tone",
                  type: "select",
                  required: true,
                  label: "Color del texto",
                  defaultValue: "dark",
                  options: [
                    { label: "Oscuro — para imágenes claras", value: "dark" },
                    { label: "Claro — para imágenes oscuras", value: "light" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Historia",
          fields: [
            {
              name: "storyIntro",
              type: "group",
              label: "Introducción",
              fields: [
                {
                  name: "title",
                  type: "textarea",
                  label: "Título",
                  defaultValue: "Una planta no es un *adorno*.\nEs un compromiso.",
                },
                {
                  name: "body",
                  type: "textarea",
                  label: "Párrafo",
                  defaultValue:
                    "Por eso nos tomamos en serio cada parte del proceso — desde qué ejemplar elegimos hasta cómo llega a tu casa. Hacemos series cortas porque preferimos conocer bien lo que vendemos antes que tener catálogo infinito.",
                },
              ],
            },
            {
              name: "pillars",
              type: "array",
              label: "Pilares (exactamente 3)",
              minRows: 3,
              maxRows: 3,
              fields: [
                { name: "number", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
              defaultValue: [
                {
                  number: "01",
                  title: "Selección honesta",
                  body: "Visitamos cada vivero y elegimos ejemplar por ejemplar. Si la planta no está sana, no va al catálogo.",
                },
                {
                  number: "02",
                  title: "Aluminio para siempre",
                  body: "Nuestras macetas se fabrican localmente en aluminio cepillado: no se oxida, no se rompe, no amarillea.",
                },
                {
                  number: "03",
                  title: "Envío cuidado",
                  body: "Embalaje diseñado planta por planta. Si algo no llega bien, lo reponemos sin discusión.",
                },
              ],
            },
          ],
        },
        {
          label: "Newsletter",
          fields: [
            {
              name: "newsletter",
              type: "group",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  defaultValue: "— Lista de aviso",
                },
                {
                  name: "title",
                  type: "textarea",
                  label: "Título",
                  defaultValue: "Las variegadas se van rápido.\n*Avisamos primero*.",
                },
                {
                  name: "body",
                  type: "textarea",
                  label: "Bajada",
                  defaultValue:
                    "Suscribite y recibí un mail cuando entra stock nuevo — plantas, macetas, velas y las mesas de aluminio cuando lleguen. Sin spam, sin relleno.",
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Texto del botón",
                  defaultValue: "Avisame",
                },
              ],
            },
          ],
        },
        {
          label: "Pago",
          description:
            "Datos que se muestran al cliente cuando elige pagar por transferencia. Al cliente le llegan también por mail en la confirmación del pedido.",
          fields: [
            {
              name: "bankTransfer",
              type: "group",
              label: "Transferencia bancaria",
              fields: [
                {
                  name: "bankName",
                  type: "text",
                  label: "Banco",
                  defaultValue: "Banco Galicia",
                },
                {
                  name: "accountHolder",
                  type: "text",
                  label: "Titular de la cuenta",
                  defaultValue: "asdspecials SA",
                },
                {
                  name: "cbu",
                  type: "text",
                  label: "CBU",
                  admin: { placeholder: "0070000000000000000000" },
                },
                {
                  name: "alias",
                  type: "text",
                  label: "Alias",
                  admin: { placeholder: "asdspecials.plantas" },
                },
                {
                  name: "cuit",
                  type: "text",
                  label: "CUIT",
                  admin: { placeholder: "30-00000000-0" },
                },
                {
                  name: "discountLabel",
                  type: "text",
                  label: "Etiqueta de descuento (opcional)",
                  admin: {
                    description:
                      "Texto corto tipo '10% OFF' que se muestra al lado del método. Dejá vacío si no aplica descuento.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "footer",
              type: "group",
              fields: [
                {
                  name: "tagline",
                  type: "textarea",
                  defaultValue:
                    "Plantas y macetas de aluminio cepillado. Seleccionamos y enviamos a toda Argentina (excepto Tierra del Fuego) con el mismo cuidado con el que las elegimos.",
                },
                {
                  name: "whatsapp",
                  type: "text",
                  label: "Número de WhatsApp (con código de país, sin + ni espacios)",
                  admin: { placeholder: "5491123456789" },
                },
                {
                  name: "instagram",
                  type: "text",
                  defaultValue: "asdspecials",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
