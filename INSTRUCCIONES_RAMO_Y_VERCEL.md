# 🌸 Guía para el Ramo de Flores de Sharon: Despliegue y Código QR

¡La tarjeta digital para Sharon está lista con todas sus animaciones, sobre 3D, música y la escena final de los 5 compañeros dibujados!

Aquí tienes la guía paso a paso para desplegarla en Vercel e imprimir la tarjeta física que acompañará al ramo de flores.

---

## 🌷 1. ¿Cómo funciona la experiencia para Sharon?

1. **El Ramo:** Sharon recibe el ramo de flores con una pequeña tarjeta física atada con un lazo.
2. **El Escaneo:** Abre la cámara de su celular y escanea el código QR.
3. **La Sorpresa:** El enlace se abre directamente en su teléfono móvil con una experiencia fluida:
   - Pantalla de bienvenida con pétalos cayendo: *“SHARON, TENEMOS UNA PEQUEÑA SORPRESA PARA TI 🌷”*.
   - El sobre 3D se abre con animación al tocarlo o pulsar *“ABRIR MI SORPRESA 💌”*.
   - Se revela la carta con su dedicatoria especial, marco floral y detalles dorados.
   - Melodía opcional de piano suave con el botón flotante *“Música 🎵”*.
   - Al pulsar *“GRACIAS POR TU SONRISA 🌷”*, llueve confeti pastel y se activa la **Escena Final**:
     - Los 5 compañeros de trabajo caminan hacia el centro.
     - Sharon recibe su hermoso ramo de flores.
     - El ramo florece con pétalos y corazones.
     - Los 6 saltan y celebran con el cartel: **“¡SHARON, ESTE DETALLE ES PARA TI! 💐”**.

---

## 🚀 2. Despliegue en Vercel (En 2 minutos)

Para que el código QR funcione en el teléfono de Sharon, el sitio debe estar en internet (no en `localhost`).

### Opción A: Desde GitHub (Recomendada)
1. Sube este proyecto a tu repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "Tarjeta digital sorpresa para Sharon"
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO>
   git push -u origin main
   ```
2. Entra en [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New Project"** e importa tu repositorio.
4. Vercel detectará automáticamente que es un proyecto **Vite**. Haz clic en **"Deploy"**.
5. En unos 40 segundos tendrás tu URL pública (ejemplo: `https://tarjeta-sharon.vercel.app`).

### Opción B: Con Vercel CLI (Directo desde la terminal)
1. Instala Vercel CLI si no lo tienes:
   ```bash
   npm i -g vercel
   ```
2. Ejecuta en esta carpeta:
   ```bash
   vercel
   ```
3. Sigue los pasos rápidos y obtendrás la URL pública definitiva.

---

## 🏷️ 3. Generar e Imprimir el Código QR para el Ramo

Una vez que tengas tu URL de Vercel:

1. Abre tu página en el navegador (o pulsa el botón **“Imprimir QR”** en la esquina superior derecha o en el pie de página).
2. Pega tu URL pública definitiva de Vercel en la casilla.
3. Tienes 3 opciones:
   - **🖨️ Imprimir Tarjeta para el Ramo:** Abre la ventana de impresión con un diseño floral ya formateado (tamaño tarjeta de regalo), listo para recortar y colocar con una cinta en las flores.
   - **📥 Descargar PNG (1024x1024):** Descarga la imagen del código QR en ultra alta resolución con márgenes y contraste óptimo para imprimirla en una imprenta o pegarla en una tarjeta personalizada.
   - **📐 Descargar SVG:** Código QR vectorial para diseño gráfico profesional.

---

## 🎵 4. Música de Piano Personalizada (Opcional)

El proyecto ya incluye un **sintetizador de piano acústico romántico en tiempo real** mediante la Web Audio API que suena suave y nunca falla ni da errores de red.

Si adicionalmente prefieren que suene una canción grabada específica (por ejemplo, una melodía en MP3 que les guste):
1. Coloca el archivo con el nombre `music.mp3` dentro de la carpeta `public/` (`public/music.mp3`).
2. El reproductor lo detectará automáticamente y lo reproducirá con prioridad cuando Sharon toque el botón de música.

---

## 📱 5. Compatibilidad Móvil Comprobada

El diseño está optimizado específicamente para celulares de todos los anchos (desde 320px hasta 430px+):
- iPhone SE (375px)
- iPhone 12 / 13 / 14 / 15 / 16 (390px)
- iPhone Plus / Pro Max (414px - 430px)
- Dispositivos Android estándar (360px - 412px)

¡Todo listo para darle a Sharon una sorpresa inolvidable! 🌸
