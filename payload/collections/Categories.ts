import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    group: "Catálogo",
    defaultColumns: ["name", "slug"],
  },
  access: {
    read: () => true,
  },
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
      required: true,
      unique: true,
      admin: {
        description: "URL corta (ej: plantas, macetas, velas).",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción corta",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagen de categoría",
    },
  ],
}
