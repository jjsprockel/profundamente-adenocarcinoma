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

No se requiere base de datos ni conexión a internet para operar.

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

- Carga de imagen (JPEG, PNG) con soporte de arrastrar y soltar
- Visor central con zoom, paneo y reinicio de vista (`react-zoom-pan-pinch`)
- Cuestionario estructurado en 4 secciones (18 preguntas totales, transcripción fiel del instrumento diagnóstico)
- Navegación controlada: respuesta obligatoria para avanzar, retroceso libre con edición de respuestas previas
- Barra de progreso inferior por dominios (5 nodos: Arquitectura, Citología, Estroma, Características Especiales, Integración)
- Motor de decisión basado en reglas explícitas y determinístico
- Modal final con resultado diagnóstico completo
- Exportación a PDF identificado con el nombre del archivo de imagen
- Página "Acerca de" con información metodológica e institucional

### Restricciones del MVP

- Opera solo en local, sin autenticación ni base de datos
- La imagen se almacena en memoria temporal del servidor; se descarta al reiniciar
- No conserva casos entre sesiones
- No usa inteligencia artificial ni inferencia probabilística; toda la lógica es por reglas explícitas

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
| `POST` | `/api/image/upload` | Sube imagen (JPEG/PNG); devuelve `session_id` e `image_url` |
| `GET` | `/api/image/{session_id}` | Sirve la imagen temporal de la sesión |
| `POST` | `/api/diagnosis/evaluate` | Recibe `session_id` + `answers`; devuelve resultado diagnóstico |
| `POST` | `/api/export/pdf` | Recibe resultado + nombre de archivo; devuelve PDF |

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

```
Navegador (localhost:5173)
    │
    │  HTTP / REST
    ▼
Vite dev server  ──proxy /api──►  FastAPI (localhost:8000)
                                       │
                                       ├── /api/image      → almacenamiento temporal en memoria
                                       ├── /api/diagnosis  → rules_engine.py (lógica pura)
                                       └── /api/export     → pdf_service.py (reportlab)
```

### Stack tecnológico

**Frontend**

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| TypeScript | 5.8 | Tipado estricto |
| Vite | 6 | Bundler y dev server |
| Tailwind CSS | 3.4 | Estilos (sistema de diseño "Digital Curator") |
| react-zoom-pan-pinch | 3.6 | Visor de imagen |

**Backend**

| Tecnología | Versión | Uso |
|---|---|---|
| FastAPI | 0.115 | Framework REST |
| uvicorn | 0.34 | Servidor ASGI |
| python-multipart | 0.0.20 | Carga de archivos |
| reportlab | 4.4 | Generación de PDF |
| Pillow | 11.2 | Validación de imágenes |

---

## Estructura del proyecto

```
pulmopath-tutor/
│
├── start.sh                          # Script de arranque único
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts            # Tokens de diseño completos
│   ├── vite.config.ts                # Proxy /api → :8000
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx                   # Estado global de la sesión
│       ├── main.tsx
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
│           │   ├── ImageDropZone.tsx # Drag & drop + botón explorar
│           │   └── ImageViewer.tsx   # Zoom / paneo / reset
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
        │   ├── image.py              # POST /image/upload · GET /image/{id}
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
            └── pdf_service.py        # Generación PDF con reportlab
```

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
