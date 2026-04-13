/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config"
import "@payloadcms/next/css"
import type { ServerFunctionClient } from "payload"
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts"
import React from "react"

import { importMap } from "./admin/importMap.js"
import "./custom.scss"

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  "use server"
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

/**
 * Algunos filtros a nivel red / DNS / carrier inyectan atributos
 * `data-__host_prefix_*` en <html> antes de que llegue el HTML al browser.
 * Eso rompe la hidratación de React porque el DOM no coincide con lo que
 * el server renderizó. Este script corre antes de que React boote y
 * limpia cualquier atributo sospechoso, así la hidratación no falla.
 */
const scrubInjectedAttrs = `
(function () {
  try {
    var html = document.documentElement;
    if (!html || !html.attributes) return;
    for (var i = html.attributes.length - 1; i >= 0; i--) {
      var name = html.attributes[i].name;
      if (name.indexOf('data-__host_') === 0) {
        html.removeAttribute(name);
      }
    }
  } catch (e) {}
})();
`

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <script dangerouslySetInnerHTML={{ __html: scrubInjectedAttrs }} />
    {children}
  </RootLayout>
)

export default Layout
