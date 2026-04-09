import logoFucs from '@/assets/logo-fucs.png'

interface AboutPageProps {
  onClose: () => void
}

export default function AboutPage({ onClose }: AboutPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="glass-header flex-shrink-0 h-16 flex items-center justify-between px-8 shadow-deep">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-on-surface/50 hover:text-on-surface transition-colors text-sm font-body"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </button>
          <span className="text-on-surface/20 text-sm">|</span>
          <span className="text-sm font-mono text-on-surface/40 uppercase tracking-widest">Acerca de</span>
        </div>
        <img src={logoFucs} alt="Universidad FUCS" className="h-10 w-auto object-contain opacity-90" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-8 py-12 space-y-12">

          {/* Hero */}
          <div className="space-y-3">
            <div className="flex flex-col leading-none">
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">
                ProfundaMente
              </h1>
              <span className="text-xs font-bold text-primary uppercase tracking-widest font-label mt-1">
                Tutor de Patrones de Adenocarcinoma de Pulmón
              </span>
            </div>
            <p className="text-on-surface/40 font-mono text-[10px] uppercase tracking-wider">
              v0.1.0 · Adenocarcinoma Pulmonar Invasivo · OMS 2021
            </p>
          </div>

          <Divider />

          {/* Descripción general */}
          <Section id="descripcion" title="Descripción general">
            <Body>
              Este aplicativo corresponde a un prototipo de apoyo al razonamiento diagnóstico en
              histopatología pulmonar, enfocado en la clasificación morfológica del adenocarcinoma
              pulmonar invasivo, basado en los lineamientos establecidos por la Organización Mundial
              de la Salud (OMS, 2021).
            </Body>
            <Body>
              La herramienta ha sido desarrollada en el contexto académico de la Fundación
              Universitaria de Ciencias de la Salud (FUCS), como parte de iniciativas orientadas a
              la innovación en educación médica y al fortalecimiento del análisis estructurado en
              patología.
            </Body>
            <Body>
              Este desarrollo se deriva conceptualmente del <Strong>Programa GLORIA</Strong>{' '}
              (Telepatología y Patología Digital), cuyo propósito ha sido impulsar la transformación
              digital en el análisis histopatológico, promoviendo la integración de tecnologías
              informáticas, herramientas de visualización y metodologías sistemáticas de
              interpretación en la práctica académica y asistencial.
            </Body>
          </Section>

          <Divider />

          {/* Propósito */}
          <Section id="proposito" title="Propósito del aplicativo">
            <Body>
              El sistema ha sido diseñado con dos objetivos principales:
            </Body>
            <ol className="space-y-3 mt-2">
              <NumberedItem n={1}>
                Apoyar la <Strong>enseñanza guiada</Strong> en la interpretación morfológica de
                adenocarcinomas pulmonares.
              </NumberedItem>
              <NumberedItem n={2}>
                <Strong>Estandarizar el razonamiento diagnóstico</Strong>, mediante un enfoque
                estructurado basado en preguntas secuenciales.
              </NumberedItem>
            </ol>
            <Body>
              A diferencia de herramientas automatizadas de clasificación, este aplicativo no
              pretende sustituir el juicio del patólogo, sino hacer explícito el proceso cognitivo
              que conduce a una conclusión diagnóstica, favoreciendo la consistencia, la
              trazabilidad conceptual y la formación especializada.
            </Body>
          </Section>

          <Divider />

          {/* Fundamento metodológico */}
          <Section id="fundamento" title="Fundamento metodológico">
            <Body>
              El aplicativo se basa en un instrumento estructurado de evaluación morfológica,
              organizado en cuatro dominios principales:
            </Body>
            <ul className="space-y-2 mt-2">
              {[
                'Arquitectura tumoral',
                'Citología',
                'Estroma y microambiente',
                'Características especiales',
              ].map(item => (
                <BulletItem key={item}>{item}</BulletItem>
              ))}
            </ul>
            <Body>
              Cada dominio contiene un conjunto de preguntas obligatorias que el usuario debe
              responder de manera secuencial. Este enfoque garantiza que la interpretación no
              dependa de una impresión global inicial, sino de la integración sistemática de
              múltiples hallazgos histológicos.
            </Body>
          </Section>

          <Divider />

          {/* Instrumento diagnóstico — PDF embebido */}
          <Section id="instrumento" title="Instrumento diagnóstico y secuencia de decisión">
            <Body>
              El siguiente documento contiene el instrumento estructurado completo: las preguntas
              por dominio, las opciones de respuesta y la secuencia de toma de decisiones
              diagnósticas que fundamenta el motor de reglas del sistema.
            </Body>

            {/* Viewer + actions row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest">
                  algoritmo_adenocarcinoma.pdf · 8 páginas
                </span>
                <a
                  href="/algoritmo_adenocarcinoma.pdf"
                  download="algoritmo_adenocarcinoma.pdf"
                  className="flex items-center gap-1.5 text-xs font-mono text-primary/80 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Descargar PDF
                </a>
              </div>

              {/* Embedded PDF viewer */}
              <div className="rounded-xl overflow-hidden bg-surface-container-highest/40" style={{ height: '680px' }}>
                <iframe
                  src="/algoritmo_adenocarcinoma.pdf"
                  title="Instrumento diagnóstico — Algoritmo de adenocarcinoma pulmonar"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <p className="text-[10px] font-mono text-on-surface/25 text-center">
                Si el documento no se visualiza correctamente, use el enlace de descarga.
              </p>
            </div>
          </Section>

          <Divider />

          {/* Lógica diagnóstica */}
          <Section id="logica" title="Lógica de toma de decisiones diagnósticas">

            <SubSection n={1} title="Evaluación inicial: priorización de subtipos especiales">
              <Body>
                El proceso diagnóstico inicia con la identificación de subtipos especiales, los
                cuales tienen prioridad clasificatoria cuando sus características son dominantes.
                Estos incluyen:
              </Body>
              <ul className="space-y-2 mt-2">
                {[
                  'Adenocarcinoma mucinoso invasivo',
                  'Adenocarcinoma coloide',
                  'Adenocarcinoma fetal',
                  'Adenocarcinoma entérico',
                ].map(item => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </ul>
              <Body>
                La asignación a uno de estos subtipos se realiza cuando existe una combinación
                coherente de hallazgos arquitectónicos, características citológicas y rasgos
                especiales específicos. Cuando se cumplen estos criterios, el sistema asigna
                directamente el subtipo correspondiente, dado su peso diagnóstico.
              </Body>
            </SubSection>

            <SubSection n={2} title="Clasificación de patrones convencionales">
              <Body>
                Si no se identifica un subtipo especial dominante, el sistema procede a clasificar
                el tumor dentro de los patrones convencionales de adenocarcinoma pulmonar:
              </Body>
              <ul className="space-y-2 mt-2">
                {['Lepídico', 'Acinar', 'Papilar', 'Micropapilar', 'Sólido'].map(item => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </ul>
              <Body>
                Esta clasificación se basa principalmente en la arquitectura predominante, la
                relación con la estructura alveolar, la presencia o ausencia de formación glandular,
                y la evidencia de invasión estromal.
              </Body>
            </SubSection>

            <SubSection n={3} title="Integración de hallazgos citológicos y microambientales">
              <Body>
                Los hallazgos citológicos y del microambiente actúan como elementos de refuerzo o
                modulación del diagnóstico arquitectónico. Entre ellos se consideran: tipo celular
                predominante, grado de diferenciación, características nucleares, tipo de estroma,
                presencia de necrosis y evidencia de diseminación por espacios aéreos.
              </Body>
              <Body>
                Estos elementos contribuyen a aumentar la confianza diagnóstica, diferenciar entre
                patrones similares, y sugerir alternativas diagnósticas.
              </Body>
            </SubSection>

            <SubSection n={4} title="Reglas de desempate">
              <Body>
                Cuando existen características superpuestas entre patrones, el sistema aplica reglas
                específicas de desempate:
              </Body>
              <ul className="space-y-2 mt-2">
                {[
                  'Presencia de eje fibrovascular para diferenciar papilar de micropapilar',
                  'Tipo y localización de mucina para distinguir subtipos mucinosos',
                  'Morfología intestinal o fetal para subtipos especiales',
                  'Complejidad glandular para identificar patrones de alto grado',
                ].map(item => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </ul>
            </SubSection>

            <SubSection n={5} title="Manejo de patrones mixtos">
              <Body>
                En los casos en los que se identifican múltiples patrones, el sistema asigna un
                patrón principal basado en el hallazgo más representativo, y reporta patrones
                secundarios cuando corresponda. Esto es coherente con las recomendaciones actuales,
                que reconocen la heterogeneidad intratumoral en los adenocarcinomas pulmonares.
              </Body>
            </SubSection>

            <SubSection n={6} title="Evaluación de consistencia y limitaciones">
              <Body>
                El sistema incluye mecanismos para detectar contradicciones internas entre
                respuestas, identificar insuficiencia de información cuando predominan respuestas no
                valorables, y ajustar el nivel de certeza diagnóstica.
              </Body>
            </SubSection>

            <SubSection n={7} title="Nivel de confianza">
              <Body>
                El nivel de confianza (<Strong>alto</Strong>, <Strong>moderado</Strong> o{' '}
                <Strong>bajo</Strong>) se determina según la concordancia entre criterios mayores,
                la coherencia global de los hallazgos, la ausencia de contradicciones relevantes, y
                la completitud de la información evaluada.
              </Body>
            </SubSection>

            <SubSection n={8} title="Generación de la salida diagnóstica">
              <Body>El sistema genera un informe estructurado que incluye:</Body>
              <ul className="space-y-2 mt-2">
                {[
                  'Patrón más probable',
                  'Hallazgos clave por dominio',
                  'Características especiales relevantes',
                  'Diferenciales diagnósticos',
                  'Nivel de confianza',
                  'Narrativa explicativa del razonamiento seguido',
                ].map(item => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </ul>
            </SubSection>
          </Section>

          <Divider />

          {/* Alcance y limitaciones */}
          <Section id="alcance" title="Alcance y limitaciones">
            <div className="bg-surface-container-high/60 rounded-xl p-5 space-y-3">
              {[
                'La clasificación generada corresponde exclusivamente a la imagen analizada.',
                'El diagnóstico definitivo de un tumor requiere la evaluación integral de la lámina completa, así como la correlación clínica, radiológica e inmunohistoquímica cuando sea pertinente.',
                'El sistema no reemplaza el juicio del patólogo ni debe utilizarse como herramienta diagnóstica autónoma.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">
                    info
                  </span>
                  <p className="text-sm text-on-surface/80 font-body leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Contexto institucional */}
          <Section id="contexto" title="Contexto institucional">
            <Body>
              Este desarrollo se enmarca en las iniciativas de innovación educativa y tecnológica de
              la <Strong>Fundación Universitaria de Ciencias de la Salud (FUCS)</Strong>, orientadas
              a la formación avanzada en ciencias de la salud, la integración de herramientas
              digitales en la educación médica, y el fortalecimiento del análisis estructurado en
              disciplinas diagnósticas.
            </Body>
            <Body>
              Su relación con el <Strong>Programa GLORIA</Strong> refleja la continuidad en la
              exploración de soluciones en patología digital y telemedicina, orientadas a mejorar la
              calidad del análisis histopatológico y la formación de especialistas.
            </Body>

            {/* FUCS institutional card */}
            <div className="mt-6 flex items-center gap-5 bg-surface-container-high/40 rounded-2xl px-6 py-5">
              <img
                src={logoFucs}
                alt="Universidad FUCS"
                className="h-14 w-auto object-contain flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-on-surface font-headline">
                  Fundación Universitaria de Ciencias de la Salud
                </p>
                <p className="text-xs text-on-surface/50 font-mono mt-1">
                  Programa GLORIA · Telepatología y Patología Digital
                </p>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Créditos */}
          <Section id="creditos" title="Créditos">
            <div className="space-y-4">
              {/* Desarrollo */}
              <div className="flex items-start gap-4 bg-surface-container-high/40 rounded-xl px-5 py-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="material-symbols-outlined text-primary text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    code
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mb-1">
                    Desarrollo
                  </p>
                  <p className="text-sm font-bold text-on-surface font-headline">John Sprockel</p>
                  <p className="text-xs text-on-surface/55 font-body leading-relaxed mt-1">
                    Diseño, arquitectura e implementación del aplicativo, en el marco de iniciativas
                    académicas orientadas a la integración de tecnologías digitales en la educación médica.
                  </p>
                </div>
              </div>

              {/* Curaduría y revisión experta */}
              <div className="flex items-start gap-4 bg-surface-container-high/40 rounded-xl px-5 py-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="material-symbols-outlined text-primary text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    lab_research
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mb-1">
                    Curaduría y revisión experta
                  </p>
                  <p className="text-sm font-bold text-on-surface font-headline">
                    Dr. José Fernando Polo
                  </p>
                  <p className="text-xs text-on-surface/55 font-body leading-relaxed mt-1">
                    Médico patólogo con experiencia en patología pulmonar. Responsable de la curaduría
                    del contenido, la revisión del instrumento diagnóstico y la validación de su
                    coherencia con la práctica histopatológica, garantizando el rigor científico y la
                    validez conceptual del sistema.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}

// ─── Internal sub-components ──────────────────────────────────────────────────

function Divider() {
  return <div className="h-px bg-outline-variant/10" />
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-xl font-black font-headline text-on-surface">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SubSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold font-mono text-primary">
          {n}
        </span>
        <h3 className="text-sm font-bold font-headline text-on-surface">{title}</h3>
      </div>
      <div className="pl-9 space-y-3">{children}</div>
    </div>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-on-surface/75 font-body leading-relaxed">{children}</p>
  )
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="text-on-surface font-bold">{children}</span>
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-on-surface/70 font-body">
      <span className="text-primary flex-shrink-0 mt-1">·</span>
      {children}
    </li>
  )
}

function NumberedItem({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-on-surface/75 font-body leading-relaxed">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold font-mono text-primary mt-0.5">
        {n}
      </span>
      {children}
    </li>
  )
}
