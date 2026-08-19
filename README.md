# ProfundaMente
## Tutor de Patrones de Adenocarcinoma de Pulmón

Prototipo (MVP) de aplicación web local para apoyar el razonamiento diagnóstico en histopatología, específicamente en la clasificación morfológica del **adenocarcinoma pulmonar invasivo**, siguiendo los lineamientos de la **OMS 2021**.

El sistema carga una imagen histológica estática y guía al usuario mediante un cuestionario estructurado con el objetivo de estandarizar el análisis morfológico, favorecer el aprendizaje estructurado en patología y hacer explícito el proceso de toma de decisiones diagnósticas.

---

## Propósito

El aplicativo tiene dos objetivos principales:

1. **Enseñanza guiada** para residentes de patología y patólogos generales
2. **Estandarización del razonamiento diagnóstico** mediante un enfoque sistemático

Este sistema **no reemplaza el juicio del patólogo**, sino que estructura y hace explícito el proceso interpretativo.

---

## Contexto institucional

Este desarrollo ha sido concebido en el entorno académico de la:

**Fundación Universitaria de Ciencias de la Salud (FUCS)**

y se deriva conceptualmente del:

**Programa GLORIA (Telepatología y Patología Digital)**

El proyecto se enmarca en iniciativas orientadas a innovación en educación médica, integración de tecnologías digitales en patología, y fortalecimiento del análisis estructurado.

---

## Requisitos del sistema

| Componente | Versión mínima |
|---|---|
| Node.js | 20.x |
| npm | 9.x |
| Python | 3.10 |

No se requiere base de datos ni conexión a internet para operar. No hay dependencias de librerías de sistema — solo paquetes Python instalables con `pip` — por lo que el backend corre igual en local, en Render, o como función serverless en Vercel.

---

## Instalación y arranque

### Opción 1 — Script único (recomendada)

```bash
cd pulmopath-tutor
chmod +x start.sh
./start.sh
```

El script crea automáticamente el entorno virtual Python, instala todas las dependencias e inicia ambos servidores.

### Opción 2 — Manual (dos terminales)

**Terminal 1 — Backend:**

```bash
cd pulmopath-tutor/backend
python3 -m venv .venv
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**

```bash
cd pulmopath-tutor/frontend
npm install
npm run dev
```

### URLs de acceso

| Servicio | URL |
|---|---|
| Aplicación | http://localhost:5173 |
| API backend | http://localhost:8000 |
| Documentación API (Swagger) | http://localhost:8000/docs |
| Health check | http://localhost:8000/api/health |

### Detener los servidores

```bash
kill $(lsof -ti:8000) $(lsof -ti:5173)
```

---

## Características del MVP

### Funcionalidades implementadas

- Carga de imagen con soporte de arrastrar y soltar en múltiples formatos: **JPEG, PNG, SVG, TIFF/TIF plano y DICOM (.dcm)**, hasta 3 MB por archivo
- Visor central con zoom y paneo basado en **OpenSeadragon**
- Impresión diagnóstica inicial (selección única entre todos los patrones posibles) antes de iniciar el cuestionario, comparada luego contra el resultado sistemático
- Cuestionario estructurado en 4 secciones (18 preguntas totales, transcripción fiel del instrumento diagnóstico)
- Ayuda contextual por opción (popup con título, explicación y hallazgos observables) en las opciones más representativas del instrumento
- Navegación controlada: respuesta obligatoria para avanzar, retroceso libre con edición de respuestas previas
- Barra de progreso inferior por dominios (5 nodos: Arquitectura, Citología, Estroma, Características Especiales, Integración)
- Motor de decisión basado en reglas explícitas y determinístico
- Modal final con resultado diagnóstico completo, con la impresión inicial comparada contra el resultado
- Exportación a PDF identificado con el nombre del archivo de imagen, con las respuestas de la sesión al final del reporte
- Página "Acerca de" con información metodológica e institucional

### Restricciones del MVP

- Sin autenticación ni base de datos
- La imagen no se almacena en el servidor ni siquiera temporalmente: se procesa y se devuelve en la misma respuesta de subida (ver [Formatos de imagen soportados](#formatos-de-imagen-soportados))
- No conserva casos entre sesiones
- No usa inteligencia artificial ni inferencia probabilística; toda la lógica es por reglas explícitas
- No soporta diapositivas completas (whole-slide images) piramidales grandes tipo SVS/NDPI — ver más abajo

---

## Formatos de imagen soportados

El backend detecta el tipo de archivo y decide cómo procesarlo (`app/services/slide_service.py`), y devuelve la imagen ya lista **en la misma respuesta de subida** (como un data URI en base64) — no hay un segundo endpoint que la sirva ni estado que mantener entre peticiones, para que el backend pueda correr como función serverless (ver [Despliegue](#despliegue)):

| Formato | Manejo |
|---|---|
| SVG | Se sirve tal cual (vectorial, no requiere conversión) |
| TIFF/TIF plano (no piramidal), BMP, WebP | Se convierte a PNG con Pillow |
| JPEG, PNG | Se sirven directamente |
| DICOM (.dcm) | Se extrae el pixel array con `pydicom` (primer frame si es multi-frame), se normaliza el contraste y se convierte a PNG |

**Tamaño máximo por archivo: 3 MB** (deja margen bajo el límite de ~4.5 MB de una función de Vercel, incluso después de la inflación ~33% del base64 en la respuesta).

> **No incluido:** diapositivas piramidales grandes (whole-slide images: SVS, NDPI, TIFF multi-resolución con tiles) — requieren **OpenSlide**, una librería nativa de sistema que no puede instalarse en un runtime serverless, y una sesión de servidor persistente para servir tiles bajo demanda; ninguna de las dos encaja con un despliegue stateless. El soporte de DICOM cubre imágenes de captura secundaria de un solo frame o representativo, no el estándar completo de WSI DICOM multi-frame piramidal.

---

## Fundamento metodológico

El sistema implementa un instrumento estructurado de evaluación morfológica organizado en cuatro dominios:

| Dominio | Código | Preguntas |
|---|---|---|
| Arquitectura | A1–A5 | 5 |
| Citología | C1–C5 | 5 |
| Estroma y microambiente | E1–E5 | 5 |
| Características especiales | CE1–CE3 | 3 |

Cada dominio contiene preguntas obligatorias que garantizan un análisis sistemático antes de producir una conclusión diagnóstica.

---

## Motor de reglas diagnóstico

El motor vive en `backend/app/core/rules_engine.py` como funciones puras sin estado, completamente desacoplado del resto de la aplicación. Es testeable directamente con diccionarios Python.

### Paso 1 — Priorización de subtipos especiales

Se evalúan primero los subtipos especiales; si se cumplen sus criterios, tienen prioridad clasificatoria sobre los patrones convencionales:

| Subtipo | Criterios principales |
|---|---|
| Mucinoso invasivo | `A1=F` ó `C1=B + C5=C + CE1=A` ó `CE2=A` |
| Coloide | `A1=G` ó `CE1=B` ó `CE2=B` |
| Fetal | `A1=H` ó `CE1∈{C,E}` ó `CE2=C` |
| Entérico | `A1=I` ó `CE2=D` ó `CE1=D + (C1=D ó C4=E)` |

### Paso 2 — Patrones convencionales

Si no hay subtipo especial dominante, se evalúan los patrones mediante un sistema de puntaje ponderado (criterios principales = 2 pts, criterios de apoyo = 1 pt):

| Patrón | Criterios principales |
|---|---|
| Lepídico | `A1=A`, `A4=A`, `E2∈{A,B}` |
| Acinar | `A1=B`, `A3∈{A,B}`, `A4∈{B,C}`, `E2∈{B,C}` |
| Papilar | `A1=C`, `A2=A`, `A5=C` |
| Micropapilar | `A1=D`, `A2=B`, `A5=A`, `E5∈{B,D}` |
| Sólido | `A1=E`, `A3=E`, `A4=D`, `E2=C` |

### Reglas de desempate

- **Eje fibrovascular:** `A2=A` → papilar; `A2=B` → micropapilar
- **Mucina intracitoplasmática predominante** → mucinoso invasivo
- **Mucina extracelular en lagos** → coloide
- **Morfología intestinal:** `A1=I` ó `CE1=D` → entérico
- **Morulogénesis / patrón fetal:** `CE1∈{C,E}` → fetal
- **Patrón mixto:** `A1=J` ó `CE3∈{B,C}` → asigna patrón principal y registra secundarios

### Detección de contradicciones

El motor detecta inconsistencias internas, por ejemplo:

- `A2=A` (eje fibrovascular presente) + `A1=D` (micropapilar) → contradicción
- `A1=E` (sólido) + `A3∈{A,B}` (glándulas presentes) → contradicción
- `A1=C` (papilar) + `A2=B` (sin eje fibrovascular) → contradicción
- `E2=A` (sin invasión) + `A4=D` (arquitectura alveolar no reconocible) → sospechoso

### Nivel de confianza

| Nivel | Condición |
|---|---|
| `alto` | Criterios mayores consistentes, sin contradicciones, sin respuestas indeterminadas |
| `moderado` | Patrón mixto o subtipo especial parcialmente sustentado |
| `bajo` | Contradicciones detectadas |
| `indeterminado` | ≥ 3 respuestas en categorías no valorables |

### Salida diagnóstica

El sistema genera un resultado estructurado con:

- Patrón más probable
- Patrones secundarios (si aplica)
- Hallazgos arquitectónicos, citológicos y estromales clave
- Características especiales relevantes
- Diferenciales diagnósticos
- Nivel de confianza
- Narrativa explicativa del razonamiento
- Advertencias estándar (imagen parcial, uso académico)
- Contradicciones detectadas
- Sugerencia de hallazgo faltante (si aplica)

---

## API REST

El backend expone los siguientes endpoints:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servicio |
| `POST` | `/api/image/upload` | Sube imagen (JPEG/PNG/SVG/TIFF/DICOM, máx. 3 MB); devuelve `session_id`, `kind` (siempre `"simple"`), `image_url` (data URI con la imagen ya procesada) y `dzi_url` (siempre `null`) |
| `POST` | `/api/diagnosis/evaluate` | Recibe `session_id` + `answers`; devuelve resultado diagnóstico |
| `POST` | `/api/export/pdf` | Recibe resultado + nombre de archivo + impresión inicial + respuestas de la sesión; devuelve PDF |

No hay endpoint para volver a solicitar la imagen: al no mantenerse ningún estado entre peticiones, `image_url` ya trae la imagen lista para mostrar. Los campos `kind`/`dzi_url` se conservan en la respuesta por compatibilidad con el frontend, pero siempre valen `"simple"`/`null` (ver [Formatos de imagen soportados](#formatos-de-imagen-soportados)).

La documentación interactiva completa está disponible en `http://localhost:8000/docs`.

### Esquema de respuesta diagnóstica

```json
{
  "main_pattern": "Adenocarcinoma con patrón lepídico",
  "secondary_patterns": [],
  "architectural_findings": ["..."],
  "cytological_findings": ["..."],
  "stromal_findings": ["..."],
  "special_features": [],
  "differentials": ["..."],
  "confidence": "alto",
  "narrative": "...",
  "warnings": ["..."],
  "contradictions": [],
  "missing_findings_hint": null
}
```

---

## Arquitectura técnica

El backend es **sin estado**: cada petición se resuelve por completo en sí misma, sin sesiones ni archivos que persistan entre peticiones. Esto es lo que permite desplegarlo igual como proceso persistente (Render, `start.sh` local) o como función serverless (Vercel) sin cambiar una línea de código de la aplicación — ver [Despliegue](#despliegue).

```
Navegador
    │
    │  HTTP / REST (rutas relativas /api/...)
    ▼
FastAPI (app/main.py)
    │
    ├── /api/image      → slide_service.py (conversión Pillow / pydicom, sin estado)
    ├── /api/diagnosis  → rules_engine.py (lógica pura)
    └── /api/export     → pdf_service.py (reportlab)
```

En desarrollo local, el servidor de Vite (`localhost:5173`) hace de proxy de `/api` hacia FastAPI (`localhost:8000`). En producción, frontend y backend se sirven desde el mismo origen (ver [Despliegue](#despliegue)), así que no hace falta CORS ni proxy.

### Stack tecnológico

**Frontend**

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| TypeScript | 5.8 | Tipado estricto |
| Vite | 6 | Bundler y dev server |
| Tailwind CSS | 3.4 | Estilos (sistema de diseño "Digital Curator") |
| OpenSeadragon | 4.x | Visor de imagen (zoom, paneo, pantalla completa) |
| lucide-react | — | Iconos SVG empaquetados localmente |

**Backend**

| Tecnología | Versión | Uso |
|---|---|---|
| FastAPI | 0.115 | Framework REST |
| uvicorn | 0.34 | Servidor ASGI (local / Render; no se usa en Vercel) |
| python-multipart | 0.0.20 | Carga de archivos |
| reportlab | 4.4 | Generación de PDF |
| Pillow | 11.2 | Validación y conversión de imágenes |
| pydicom | 3.0 | Lectura de archivos DICOM (.dcm) |
| numpy | 2.2 | Normalización de contraste para la conversión DICOM → PNG |

---

## Funcionamiento offline

La aplicación no requiere acceso a internet durante su ejecución.

Todos los recursos de interfaz están incluidos localmente:

- fuentes (Inter, Space Grotesk, JetBrains Mono, vía `@fontsource`, subconjuntos latin/latin-ext);
- iconos (SVG empaquetados con `lucide-react`, sin fuentes de icono remotas);
- logotipos (`logo-fucs.png`, empaquetado por Vite);
- estilos (Tailwind CSS compilado localmente);
- scripts y librerías del frontend (todas instaladas vía npm, sin CDN en tiempo de ejecución).

El frontend únicamente se comunica con el backend FastAPI del mismo despliegue (rutas relativas `/api/...`). La exportación de PDF se genera en el backend con `reportlab` usando únicamente fuentes base del propio motor (Helvetica/Courier), sin fuentes ni imágenes remotas.

Para verificarlo:

```bash
cd frontend
npm run check:offline
npm run build
```

`npm run check:offline` (que también corre automáticamente como parte de `npm run build`) escanea `src/`, `index.html`, `vite.config.ts` y `public/` en busca de referencias `http(s)://` a hosts distintos de `localhost`/`127.0.0.1`, y falla el build si encuentra alguna. El script vive en `scripts/check-offline-assets.mjs` y solo permite excepciones explícitas y documentadas (namespaces XML/SVG, que no son solicitudes de red).

> La instalación (`npm install`, `pip install`) sí requiere conexión a internet la primera vez. Lo que no requiere internet es la **ejecución** posterior de la aplicación ya instalada.

### Prueba de funcionamiento sin conexión

**Automatizada (Playwright):**

```bash
cd frontend
npm run test:offline
```

Esto construye el frontend, levanta el backend y sirve el build de producción (`vite preview`), y ejecuta `tests/offline.spec.ts`, que:

1. intercepta toda solicitud de red del navegador y aborta cualquiera que no vaya a `localhost`/`127.0.0.1` (simulando ausencia de internet);
2. recarga la página, sube una imagen, usa los controles de zoom, completa las 18 preguntas del cuestionario, visualiza el resultado, exporta el PDF e inicia un nuevo caso;
3. falla si en algún momento del recorrido se intentó contactar un host remoto (Google Fonts, CDNs, analítica, etc).

**Manual:**

1. `cd frontend && npm run build && npm run preview` (sirve el build de producción en `http://localhost:4173`).
2. En otra terminal, iniciar el backend: `cd backend && ./.venv/bin/uvicorn app.main:app --port 8000`.
3. Abrir `http://localhost:4173` en el navegador con las herramientas de desarrollador abiertas (pestaña Network).
4. Activar "Offline" en la pestaña Network (o desconectar la red de la máquina) y recargar la página.
5. Confirmar que la interfaz carga con sus fuentes e iconos correctos (sin texto literal como `zoom_in` y sin recuadros de fuente faltante).
6. Cargar una imagen, usar los controles de zoom/pan, completar el cuestionario, ver el resultado, exportar el PDF e iniciar un nuevo caso — todo debe funcionar sin errores de red en la consola.

---

## Estructura del proyecto

```
pulmopath-tutor/
│
├── vercel.json                       # Build + rewrite /api/* → función serverless (ver Despliegue)
├── api/
│   ├── index.py                      # Entry point de Vercel: expone app/main.py como función única
│   └── requirements.txt              # Espejo de backend/requirements.txt (Vercel lo busca aquí)
│
├── start.sh                          # Script de arranque único (local)
├── render.yaml                       # Config de despliegue en Render (proceso persistente)
├── scripts/
│   └── check-offline-assets.mjs      # Falla el build si hay referencias remotas en el frontend
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts            # Tokens de diseño completos
│   ├── vite.config.ts                # Proxy /api → :8000 (dev y preview)
│   ├── playwright.config.ts          # Config de la prueba automatizada offline
│   ├── tsconfig.json
│   ├── tests/
│   │   └── offline.spec.ts           # Prueba: flujo completo sin acceso a internet
│   └── src/
│       ├── App.tsx                   # Estado global de la sesión
│       ├── main.tsx                  # Importa las fuentes locales (@fontsource)
│       ├── index.css                 # Estilos globales + Tailwind
│       ├── vite-env.d.ts
│       │
│       ├── assets/
│       │   └── logo-fucs.png
│       │
│       ├── types/
│       │   └── index.ts              # Tipos TypeScript (AppPhase, DiagnosisResult, …)
│       │
│       ├── data/
│       │   └── questionnaire.ts      # 18 preguntas del instrumento (transcripción fiel)
│       │
│       ├── hooks/
│       │   └── useQuestionnaire.ts   # Navegación entre secciones y preguntas
│       │
│       ├── api/
│       │   └── client.ts             # Fetch hacia endpoints del backend
│       │
│       └── components/
│           ├── layout/
│           │   ├── Header.tsx        # Barra superior con brand y logo FUCS
│           │   ├── ProgressBar.tsx   # Barra inferior con 5 nodos de dominio
│           │   ├── AcademicBanner.tsx
│           │   └── AboutPage.tsx     # Página "Acerca de" completa
│           │
│           ├── viewer/
│           │   ├── ImageDropZone.tsx # Drag & drop + botón explorar (JPEG/PNG/SVG/TIFF/DICOM)
│           │   └── ImageViewer.tsx   # Visor OpenSeadragon (zoom, paneo, pantalla completa)
│           │
│           ├── questionnaire/
│           │   ├── QuestionPanel.tsx # Orquestador del cuestionario
│           │   ├── QuestionCard.tsx  # Pregunta + lista de opciones
│           │   ├── OptionButton.tsx  # Botón letra + texto
│           │   └── SectionHeader.tsx # Título de sección + barra de progreso interna
│           │
│           └── results/
│               └── ResultModal.tsx  # Modal de resultado diagnóstico + export PDF
│
└── backend/
    ├── requirements.txt
    └── app/
        ├── main.py                   # App FastAPI + CORS
        │
        ├── api/
        │   ├── image.py              # POST /image/upload (sin estado, devuelve data URI)
        │   ├── diagnosis.py          # POST /diagnosis/evaluate
        │   └── export.py             # POST /export/pdf
        │
        ├── core/
        │   └── rules_engine.py       # Motor de reglas (funciones puras, sin estado)
        │
        ├── models/
        │   └── schemas.py            # Pydantic: DiagnosisRequest, DiagnosisResult, PdfRequest
        │
        └── services/
            ├── slide_service.py      # Detección de formato y conversión (Pillow / pydicom)
            └── pdf_service.py        # Generación PDF con reportlab
```

---

## Despliegue

El backend no guarda estado entre peticiones (ver [Arquitectura técnica](#arquitectura-técnica)), así que el mismo código soporta dos formas de desplegarlo. Elige una:

### Opción A — Vercel (todo en un solo proyecto)

Un único proyecto de Vercel sirve el frontend como sitio estático desde su CDN y el backend como una función serverless de Python, ambos bajo el mismo dominio (sin CORS, sin configuración cruzada):

1. Importar el repositorio en [vercel.com](https://vercel.com/new) (o `vercel --prod` con la CLI ya logueada). Vercel detecta `vercel.json` automáticamente.
2. `vercel.json` en la raíz define:
   - `buildCommand`: compila el frontend (`cd frontend && npm install && npm run build`)
   - `outputDirectory`: `frontend/dist`, servido directamente por el CDN de Vercel
   - `rewrites`: todo lo que llegue a `/api/*` se enruta a la función `api/index.py`
3. `api/index.py` expone la misma app de FastAPI (`backend/app/main.py`) como función ASGI única — Vercel la detecta automáticamente. `api/requirements.txt` (espejo de `backend/requirements.txt`) es lo que Vercel instala para esa función.
4. No hace falta configurar variables de entorno (`CORS_ORIGINS` no aplica: mismo origen).

**Limitación asumida:** el backend en Vercel solo sirve imágenes simples (ver [Formatos de imagen soportados](#formatos-de-imagen-soportados)), no diapositivas piramidales grandes — eso requeriría OpenSlide (librería nativa) y una sesión de servidor persistente, incompatibles con un runtime serverless.

### Opción B — Render (proceso persistente)

`render.yaml` en la raíz configura un único servicio Python que compila el frontend y lo copia a `backend/frontend_dist/`, sirviéndolo desde el mismo proceso FastAPI (`uvicorn`) vía `main.py`. Ver el archivo para el detalle del build/start command. Esta opción no tiene el límite de 3 MB por archivo que impone el body-size de las funciones de Vercel, aunque el backend actual tampoco usa esa holgura (el límite de 3 MB en `image.py` es el mismo en ambos despliegues, para no mantener dos rutas de código distintas).

---

## Diseño visual

El sistema implementa el design system **"The Digital Curator"**, definido en `stitch/DESIGN.md`:

| Token | Valor | Uso |
|---|---|---|
| Background | `#0b1326` | Fondo principal (Deep Navy) |
| Primary | `#ffc174` | Acento FUCS Amber |
| Surface Container High | `#222a3d` | Cards y paneles |
| On-Surface | `#dae2fd` | Texto principal (Slate-White) |
| Tipografía UI | Inter | Headlines y body |
| Tipografía técnica | JetBrains Mono | Labels, datos, metadatos |

Regla principal: sin líneas divisorias de 1px; la profundidad se logra por cambios de fondo (tonal layering) y glassmorphism (`backdrop-blur`).

---

## Alcance y limitaciones

- La interpretación generada corresponde exclusivamente a **la imagen analizada**, no al tumor completo
- El diagnóstico definitivo requiere evaluación integral de la lámina, correlación clínica, radiológica e inmunohistoquímica
- El sistema no es una herramienta diagnóstica autónoma
- No almacena datos entre sesiones
- No requiere ni usa conexión a internet

---

## Créditos

| Rol | Persona |
|---|---|
| **Desarrollo** | John Sprockel |
| **Curaduría y revisión experta** | Dr. José Fernando Polo |

**John Sprockel** diseñó, arquitectó e implementó el aplicativo en el marco de iniciativas académicas orientadas a la integración de tecnologías digitales en la educación médica.

**Dr. José Fernando Polo**, médico patólogo con experiencia en patología pulmonar, estuvo a cargo de la curaduría del contenido, la revisión del instrumento diagnóstico y la validación de su coherencia con la práctica histopatológica, garantizando el rigor científico y la validez conceptual del sistema.

---

## Uso académico / investigativo

> Este sistema es de uso exclusivamente académico e investigativo. No constituye un diagnóstico clínico definitivo y no sustituye la evaluación histopatológica completa por un patólogo calificado.

**ProfundaMente · Fundación Universitaria de Ciencias de la Salud (FUCS)**
Programa GLORIA · Telepatología y Patología Digital
