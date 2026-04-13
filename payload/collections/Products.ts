import type { CollectionConfig } from "payload"
import { slugify } from "../../lib/slugify.ts"

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    group: "Catálogo",
    defaultColumns: ["name", "category", "price", "stock", "featured"],
    description: "Plantas, macetas, velas y mesas en venta.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && typeof data.name === "string" && data.name.trim()) {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Nombre",
            },
            {
              name: "slug",
              type: "text",
              unique: true,
              admin: {
                description:
                  "URL del producto. Se genera solo desde el nombre si lo dejás vacío (ej: 'Monstera Variegada' → 'monstera-variegada').",
              },
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              label: "Categoría",
            },
            {
              name: "shortDescription",
              type: "textarea",
              label: "Descripción corta",
              admin: {
                description: "Una o dos líneas que aparecen en las cards del catálogo.",
              },
            },
            {
              name: "description",
              type: "richText",
              label: "Descripción larga",
            },
            {
              name: "featured",
              type: "checkbox",
              label: "Destacado en la home",
              defaultValue: false,
            },
          ],
        },
        {
          label: "Precio y stock",
          fields: [
            {
              name: "price",
              type: "number",
              required: true,
              min: 0,
              label: "Precio (ARS)",
              admin: {
                step: 100,
              },
            },
            {
              name: "compareAtPrice",
              type: "number",
              min: 0,
              label: "Precio tachado (opcional)",
              admin: {
                description: "Si lo completás, se muestra el precio anterior tachado para indicar descuento.",
              },
            },
            {
              name: "stock",
              type: "number",
              required: true,
              defaultValue: 0,
              min: 0,
              label: "Stock disponible",
            },
            {
              name: "status",
              type: "select",
              required: true,
              defaultValue: "active",
              options: [
                { label: "Publicado", value: "active" },
                { label: "Borrador (no publicado)", value: "draft" },
                { label: "Agotado — ocultar", value: "hidden" },
              ],
            },
          ],
        },
        {
          label: "Imágenes",
          fields: [
            {
              name: "images",
              type: "array",
              minRows: 1,
              required: true,
              label: "Galería",
              labels: { singular: "Imagen", plural: "Imágenes" },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Plantas",
          description: "Completar solo si el producto es una planta.",
          fields: [
            {
              name: "plantCare",
              type: "group",
              label: "Cuidados",
              fields: [
                {
                  name: "light",
                  type: "select",
                  label: "Luz",
                  options: [
                    { label: "Luz directa", value: "direct" },
                    { label: "Luz indirecta abundante", value: "bright-indirect" },
                    { label: "Media sombra", value: "medium" },
                    { label: "Poca luz", value: "low" },
                  ],
                },
                {
                  name: "water",
                  type: "select",
                  label: "Riego",
                  options: [
                    { label: "Poco", value: "low" },
                    { label: "Moderado", value: "medium" },
                    { label: "Frecuente", value: "high" },
                  ],
                },
                {
                  name: "size",
                  type: "text",
                  label: "Tamaño aproximado",
                  admin: { description: "ej: 60–80 cm" },
                },
              ],
            },
          ],
        },
        {
          label: "Macetas",
          description: "Completar solo si el producto es una maceta.",
          fields: [
            {
              name: "potSpecs",
              type: "group",
              label: "Especificaciones",
              fields: [
                {
                  name: "material",
                  type: "text",
                  defaultValue: "Aluminio cepillado",
                },
                {
                  name: "diameter",
                  type: "number",
                  label: "Diámetro (cm)",
                },
                {
                  name: "height",
                  type: "number",
                  label: "Altura (cm)",
                },
                {
                  name: "withStand",
                  type: "checkbox",
                  label: "Incluye base de hierro",
                  defaultValue: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
