import React, { useState, useEffect } from "react";
import { SvgXml } from "react-native-svg";
import { Asset } from "expo-asset"; // Si usas Expo. Si usas CLI puro, se lee con react-native-fs o fetch

// 1. "Reflexión" automática: Mapeamos los IDs de los assets locales de la carpeta
const contextoSvg = require.context("../../assets/svgs/", false, /\.svg$/);

const MAPA_RUTAS_SVG = {};
contextoSvg.keys().forEach((key) => {
  const nombreLimpio = key.replace("./", "").replace(".svg", "");
  // Guardamos la referencia interna del módulo/asset
  MAPA_RUTAS_SVG[nombreLimpio] = contextoSvg(key);
});

// Cache interna en memoria para no volver a descargar/leer el XML del mismo SVG
const cacheXmls = {};

// Función auxiliar para cambiar el color (insensible a mayúsculas/minúsculas)
function coloredXml(svgString, color) {
  if (!color) return svgString;
  return svgString.replace(/#000000/gi, color);
}

export default function SvgIcon({
  width = 24,
  height = 24,
  color = "#000",
  nombre = "default",
}) {
  const [xmlContenido, setXmlContenido] = useState(null);

  useEffect(() => {
    async function cargarSvgAsTexto() {
      // 2. Elegimos el archivo dinámicamente por su nombre
      const idAsset = MAPA_RUTAS_SVG[nombre] || MAPA_RUTAS_SVG["default"];

      if (!idAsset) {
        console.warn(
          `No se encontró el SVG para el nombre "${nombre}". Usando "default".`,
        );
        setXmlContenido(null);
        return;
      }

      // Si ya lo leímos antes, lo sacamos de nuestra caché dinámica
      if (cacheXmls[nombre]) {
        setXmlContenido(cacheXmls[nombre]);
        return;
      }

      try {
        // 3. Descargamos/Leemos el contenido del archivo local en tiempo de ejecución
        const [{ localUri }] = await Asset.loadAsync(idAsset);
        const respuesta = await fetch(localUri);
        const textoXml = await respuesta.text();

        // Guardamos en caché para la próxima vez
        cacheXmls[nombre] = textoXml;
        setXmlContenido(textoXml);
      } catch (error) {
        console.error("Error al cargar el SVG dinámico:", error);
      }
    }

    cargarSvgAsTexto();
  }, [nombre]);

  // Mientras lee el archivo de los assets, no muestra nada (o un placeholder)
  if (!xmlContenido) return null;

  // 4. Inyectamos el color dinámico sobre el XML de la caché
  const finalXml = coloredXml(xmlContenido, color);

  return <SvgXml xml={finalXml} width={width} height={height} />;
}
