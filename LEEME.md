# Castellano Katia — app para el móvil

Archivos (todos sueltos, sin carpetas):

- `index.html`: inicio con el repaso de hoy, la racha, los logros y la copia de seguridad
- `verbos.html`, `vocabulario.html`, `gramatica.html`: las tres partes
- `comun.js`: funciones compartidas (objetivo diario, logros, voz, copia de seguridad…)
- `config.js`: lo único que hace falta tocar (hoja de Google y tu WhatsApp)
- `manifest.webmanifest`, `sw.js` e iconos: lo que la hace instalable y que funcione sin conexión
- `plantilla-contenido.csv`: ejemplo de hoja para añadir palabras y frases

## Actualizar la app en GitHub (Castellano_Katia)

1. *Add file → Upload files* y arrastra **todos** los archivos. Los que ya existen se reemplazan.
2. *Commit changes* y espera el ✓ verde en *Actions*.
3. En `sw.js`, la línea `const VERSION='v7';` debe cambiar en cada actualización (v8, v9…).
   El móvil coge la versión nueva la segunda vez que se abre la app con conexión. El progreso no se pierde.

## Añadir palabras y frases desde una hoja de Google (opcional)

1. Crea una hoja de Google con tu cuenta personal e importa `plantilla-contenido.csv`
   (*Archivo → Importar → Subir*), o copia sus columnas.
2. Columnas:
   - **Palabras**: `tipo` = palabra · `tema` (el nombre de un tema de la app, por ejemplo «La cocina»; si no coincide, va a «Palabras nuevas») · `espanol` (con artículo si es un nombre) · `ucraniano` · `ejemplo` (opcional).
   - **Frases de verbos**: `tipo` = frase · `frase` (con ___ donde va el verbo) · `verbo` (en infinitivo y que esté en la app) · `tiempo` · `persona` (1 = yo, 2 = tú, 3 = él/ella, 4 = nosotros, 5 = vosotros, 6 = ellos).
   - Códigos de `tiempo`: pres, pret, impf, fut, cond, pc, pq, fp, cp, sp, si, spc, spq, imp, impn, gerundio.
3. *Archivo → Compartir → Publicar en la web* → elige la pestaña y «Valores separados por comas (.csv)» → *Publicar*. Copia la dirección.
4. Pégala en `config.js`, en `hojaCSV: '...'`, y sube `config.js` a GitHub (y sube la VERSION de `sw.js`).
5. A partir de ahí, cada vez que Katia abra la app con conexión se descargan los cambios de la hoja; se ven la siguiente vez que entre en Verbos o Vocabulario.

## Avisos de traducción por WhatsApp

En `config.js`, pon tu número en `whatsapp: '34600111222'` (con prefijo, sin «+» ni espacios).
Cuando Katia pulse «Esta traducción está mal», se abrirá WhatsApp con el mensaje preparado para ti.

## Copia de seguridad

En la pantalla de inicio, *Copia de seguridad del progreso*:
- **Guardar copia**: descarga un archivo con todo el progreso.
- **Enviar copia**: lo comparte (por ejemplo, por WhatsApp o a Drive).
- **Recuperar desde archivo**: en un móvil nuevo, elige ese archivo y vuelve todo.
