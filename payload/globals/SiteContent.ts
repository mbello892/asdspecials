import type { GlobalConfig } from "payload"

export const SiteContent: GlobalConfig = {
  slug: "site-content",
  label: "Contenido del sitio",
  admin: {
    group: "Contenido",
    description: "Textos editables de la home. Cambiá lo que quieras y se actualiza en el sitio.",
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
                  defaultValue: "Plantas elegidas. Macetas que las sostienen.",
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
          label: "Pilares",
          fields: [
            {
              name: "pillars",
              type: "array",
              label: "Cómo trabajamos",
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
