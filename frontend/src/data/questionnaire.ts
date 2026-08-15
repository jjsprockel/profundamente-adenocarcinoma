import type { Section } from '@/types'

// Fuente: algoritmo_adenocarcinoma.docx
// Todas las preguntas y opciones son transcripción fiel del documento original.

export const SECTIONS: Section[] = [
  {
    id: 'arquitectura',
    label: 'Arquitectura',
    questions: [
      {
        id: 'A1',
        text: '¿Cuál es el patrón arquitectónico predominante en la imagen?',
        options: [
          {
            letter: 'A',
            text: 'Revestimiento de septos alveolares preexistentes con preservación relativa de la arquitectura pulmonar',
            help: {
              title: 'Patrón Lepídico',
              body: 'Las células neoplásicas crecen sobre la superficie del alvéolo preexistente sin destruirlo. El septo alveolar actúa como andamiaje. No hay invasión del estroma ni colapso parenquimatoso.',
              examples: [
                'Células cúbicas o columnares alineadas sobre el septo',
                'Septo de grosor normal o ligeramente engrosado',
                'Sin desmoplasia ni inflamación reactiva importante',
                'Sin necrosis intraluminal',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Glándulas o acinos bien formados con lumen reconocible',
            help: {
              title: 'Patrón Acinar',
              body: 'Estructuras glandulares con luz central visible. Las células rodean una luz que puede contener mucina o detritus. Implica invasión del estroma.',
              examples: [
                'Luz glandular central identificable en H&E',
                'Puede haber mucina intraluminal',
                'Rodeado de estroma desmoplásico',
                'Células con núcleo basal y citoplasma apical',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Proyecciones papilares verdaderas con eje fibrovascular central',
            help: {
              title: 'Patrón Papilar',
              body: 'Proyecciones digitiformes con EJE FIBROVASCULAR central (estroma + vasos). Este eje es el criterio definitorio que lo diferencia del micropapilar.',
              examples: [
                'Core central de tejido conectivo visible en H&E',
                'Vasos sanguíneos dentro del eje',
                'Células neoplásicas en la periferia del eje',
                'Puede tener ramificaciones secundarias',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Pequeños grupos, penachos o agregados celulares sin eje fibrovascular, en espacios claros o alveolares',
            help: {
              title: 'Patrón Micropapilar',
              body: 'Pequeños racimos o rosetas de células tumorales flotando en espacios claros, SIN eje fibrovascular central. Asociado con comportamiento agresivo y metástasis linfática temprana.',
              examples: [
                'Racimos celulares sin estroma central',
                'Espacios claros artifactuales alrededor',
                'Polaridad celular invertida (hacia afuera)',
                'Frecuente invasión linfovascular asociada',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Láminas sólidas, nidos compactos o crecimiento difuso sin formación glandular evidente',
            help: {
              title: 'Patrón Sólido',
              body: 'Nidos compactos de células sin formación de glándulas, papilas ni crecimiento lepídico. Diagnóstico de exclusión: requiere confirmar ausencia de moco o diferenciación con IHQ.',
              examples: [
                'Sin luces glandulares identificables',
                'Nidos sólidos separados por estroma fino',
                'Descartar carcinoma escamoso y células grandes',
                'TTF-1 o NapsinA positivos confirman origen adenocarcinomatoso',
              ],
            },
          },
          {
            letter: 'F',
            text: 'Células mucinosas con patrón glandular, acinar, papilar o lepídico y abundante mucina intracitoplasmática',
            help: {
              title: 'Adenocarcinoma Mucinoso Invasivo',
              body: 'Células columnares altas con citoplasma apical cargado de mucina y núcleos basales desplazados. Puede mostrar crecimiento lepídico extenso con mucina intra-alveolar.',
              examples: [
                'Citoplasma apical pálido y amplio con mucina',
                'Núcleos basales pequeños y regulares',
                'Mucina intra-alveolar abundante',
                'KRAS mutado frecuentemente, TTF-1 variable',
              ],
            },
          },
          {
            letter: 'G',
            text: 'Grandes lagos de mucina extracelular con células tumorales flotando o dispersas',
            help: {
              title: 'Adenocarcinoma Coloide',
              body: 'Grandes lagos de mucina extracelular ocupan los espacios alveolares, con nidos o hileras de células tumorales flotando en su interior más que revistiendo estructuras glandulares. Corresponde al subtipo especial coloide, distinto del mucinoso invasivo convencional.',
              examples: [
                'Lagos de mucina basofílica extensa en H&E',
                'Escasas células tumorales por volumen de mucina',
                'Puede acompañarse de componente lepídico mucinoso',
                'Diferencial con metástasis mucinosa de origen digestivo',
              ],
            },
          },
          {
            letter: 'H',
            text: 'Glándulas complejas de aspecto fetal o embrionario',
            help: {
              title: 'Adenocarcinoma Fetal',
              body: 'Recapitula el pulmón fetal en fase pseudoglandular: glándulas tubulares complejas revestidas por células con citoplasma rico en glucógeno subnuclear y supranuclear. Subtipo especial poco frecuente, generalmente de bajo grado en pacientes jóvenes.',
              examples: [
                'Glándulas tubulares ramificadas con luz estrecha',
                'Morulas escamoides intraglandulares',
                'Estroma celular tipo mesénquima fetal',
                'Beta-catenina nuclear frecuentemente positiva',
              ],
            },
          },
          {
            letter: 'I',
            text: 'Glándulas con morfología intestinal o entérica',
            help: {
              title: 'Adenocarcinoma Entérico',
              body: "Muestra diferenciación morfológica e inmunohistoquímica similar al adenocarcinoma colorrectal, con glándulas tubulares complejas y necrosis luminal tipo 'suciedad'. Requiere descartar metástasis digestiva antes de confirmarlo como primario pulmonar.",
              examples: [
                'Al menos 50% del tumor con morfología entérica',
                "Necrosis luminal tipo 'suciedad' (dirty necrosis)",
                'Células columnares pseudoestratificadas',
                'Panel IHQ obligatorio: TTF-1, NapsinA, CDX2, CK20',
              ],
            },
          },
          { letter: 'J', text: 'Patrón mixto sin predominio claro' },
          { letter: 'K', text: 'Indeterminado / no valorable' },
        ],
      },
      {
        id: 'A2',
        text: 'Si se reconocen estructuras papiliformes, ¿cuál es su característica principal?',
        options: [
          {
            letter: 'A',
            text: 'Tienen eje fibrovascular central evidente',
            help: {
              title: 'Eje Fibrovascular',
              body: 'Core central de tejido conectivo con vasos sanguíneos dentro de proyecciones papilares. Su presencia es CRITERIO DEFINITORIO del patrón papilar y excluye el micropapilar.',
              examples: [
                'Visible en H&E como banda rosada central',
                'Contiene capilares o arteriolas pequeñas',
                'Puede tener células mesoteliales o macrófagos',
                'Proyecciones de tamaño variable pero siempre con core',
              ],
            },
          },
          {
            letter: 'B',
            text: 'No tienen eje fibrovascular central',
            help: {
              title: 'Ausencia de Eje Fibrovascular',
              body: 'La ausencia de un core fibrovascular central en las proyecciones celulares es el criterio que define el patrón micropapilar frente al papilar. Sin este eje, las estructuras corresponden a racimos celulares flotantes, no a papilas verdaderas.',
              examples: [
                'Proyecciones sin banda central de tejido conectivo ni vasos',
                'Frecuentemente rodeadas de espacios claros artefactuales',
                'Reclasificar como patrón micropapilar, no papilar',
                'Verificar en varios niveles antes de concluir su ausencia',
              ],
            },
          },
          { letter: 'C', text: 'Forman proyecciones hacia espacios alveolares, pero no es claro si hay eje fibrovascular' },
          {
            letter: 'D',
            text: 'Parecen pseudopapilas por retracción artefactual',
            help: {
              title: 'Pseudopapilas Artefactuales',
              body: 'La retracción tisular durante el procesamiento puede crear espacios artificiales que simulan papilas o estructuras micropapilares sin serlo. Es un pitfall diagnóstico frecuente que puede sobreestimar patrones de mal pronóstico.',
              examples: [
                'Espacios de retracción de bordes lisos y regulares',
                'Ausencia de núcleos celulares dentro del espacio (a diferencia de STAS)',
                'Distribución periférica uniforme alrededor de nidos tumorales',
                'No debe contarse como micropapilar ni como STAS',
              ],
            },
          },
          { letter: 'E', text: 'No hay estructuras papiliformes' },
        ],
      },
      {
        id: 'A3',
        text: 'Si se identifican glándulas, ¿cómo son predominantemente?',
        options: [
          {
            letter: 'A',
            text: 'Redondas u ovaladas, relativamente uniformes, con lumen bien definido',
            help: {
              title: 'Glándulas Bien Definidas',
              body: 'Estructuras tubulares o acinares con luz central claramente delimitada por una capa de células neoplásicas. Contorno regular y reconocible a bajo aumento.',
              examples: [
                'Luz central con bordes nítidos',
                'Una o dos capas celulares alrededor',
                'Puede contener secreción eosinofílica o mucina',
                'Estroma desmoplásico circundante frecuente',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Irregulares, anguladas o complejas',
            help: {
              title: 'Glándulas Irregulares o Complejas',
              body: 'Glándulas de contorno angulado, ramificado o de tamaño variable, que reflejan un patrón acinar de mayor complejidad arquitectónica. Puede acompañarse de fusión glandular incipiente, un hallazgo relevante para el patrón cribiforme.',
              examples: [
                'Contornos angulados en lugar de redondeados',
                'Variación marcada de tamaño entre glándulas vecinas',
                'Puede progresar a fusión glandular (cribiforme)',
                'Se asocia con mayor grado histológico',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Con morfología cribiforme o glandular compleja',
            help: {
              title: 'Patrón Cribiforme',
              body: "Glándulas fusionadas sin estroma interpuesto, con múltiples luces pequeñas dentro de una misma estructura ('en criba'). La OMS 2021 lo reconoce como patrón de alto grado, con pronóstico similar al sólido y micropapilar.",
              examples: [
                'Múltiples luces glandulares sin estroma entre ellas',
                "Aspecto de 'queso suizo' a bajo aumento",
                'Se reporta dentro del componente acinar pero como hallazgo de alto grado',
                'Asociado con mayor riesgo de recurrencia',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Dilatadas y llenas de mucina',
            help: {
              title: 'Glándulas Dilatadas con Mucina',
              body: 'Estructuras glandulares distendidas por acumulación de mucina intraluminal, revestidas por células generalmente bajas o aplanadas. Sugiere diferenciación mucinosa y orienta hacia el diagnóstico de adenocarcinoma mucinoso.',
              examples: [
                'Luz glandular amplia llena de material basofílico o pálido',
                'Epitelio de revestimiento aplanado por la distensión',
                'PAS y Azul Alcián positivos en el contenido luminal',
                'Correlacionar con hallazgos citológicos de C1/C5',
              ],
            },
          },
          { letter: 'E', text: 'No hay glándulas identificables' },
        ],
      },
      {
        id: 'A4',
        text: '¿Cómo es la relación del tumor con la arquitectura alveolar preexistente?',
        options: [
          {
            letter: 'A',
            text: 'Las células recubren septos alveolares preservados',
            help: {
              title: 'Septo Alveolar Conservado',
              body: 'La arquitectura alveolar subyacente permanece intacta. Las células crecen sobre el septo sin destruirlo. Es el hallazgo clave del patrón lepídico no invasivo.',
              examples: [
                'Fibras elásticas del septo visibles (Elástica-VVG)',
                'Grosor septal uniforme sin colapso',
                'Sin fibroblastos activados intraseptales',
                'Macrófagos alveolares pueden estar presentes',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Las células destruyen e infiltran la arquitectura alveolar',
            help: {
              title: 'Destrucción e Infiltración de la Arquitectura Alveolar',
              body: 'Las células tumorales reemplazan por completo la arquitectura alveolar preexistente, sin septos reconocibles como andamiaje. Indica un patrón netamente invasivo (acinar, papilar, micropapilar o sólido), no lepídico.',
              examples: [
                'Ausencia de septos alveolares residuales',
                'Fibras elásticas fragmentadas o ausentes (Elástica-VVG)',
                'Reemplazo del parénquima por nidos o glándulas tumorales',
                'Contraste directo con el patrón lepídico (A4-A)',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Hay combinación de revestimiento alveolar e invasión',
            help: {
              title: 'Colapso Alveolar Parcial',
              body: 'Pérdida progresiva de la arquitectura alveolar abierta. Indica zona de transición entre patrón lepídico y uno invasivo (acinar o sólido). Puede corresponder a una cicatriz elástica central.',
              examples: [
                'Alvéolos comprimidos con septo engrosado',
                'Células tumorales sobre septo colapsado',
                'Diferencial con cicatriz fibroelástica benigna',
                'Buscar foco invasivo en el centro de la lesión',
              ],
            },
          },
          {
            letter: 'D',
            text: 'La arquitectura alveolar no es reconocible',
            help: {
              title: 'Arquitectura Alveolar No Reconocible',
              body: 'El parénquima pulmonar subyacente ya no es identificable, típicamente por reemplazo extenso por tumor sólido o por fibrosis densa. Dificulta evaluar la relación del tumor con la arquitectura preexistente en esa región.',
              examples: [
                'Pérdida completa del patrón alveolar de referencia',
                'Frecuente en áreas de patrón sólido extenso',
                'Puede requerir tinción de fibras elásticas para orientar',
                'Correlacionar con hallazgos en otras áreas de la lámina',
              ],
            },
          },
          { letter: 'E', text: 'No aplica en esta imagen' },
        ],
      },
      {
        id: 'A5',
        text: '¿Cuál de los siguientes hallazgos arquitectónicos adicionales está presente?',
        options: [
          {
            letter: 'A',
            text: 'Espacios alveolares ocupados por penachos celulares sin estroma',
            help: {
              title: 'Proyecciones sin Eje (Micropapilar)',
              body: 'Pequeños grupos celulares que parecen flotar en espacios vacíos sin soporte estromal. Patrón de alto riesgo asociado con invasión angiolinfática y mal pronóstico incluso cuando es minoritario.',
              examples: [
                'Grupos de 3–20 células sin estroma central',
                'Espacios claros alrededor (artifacto de fijación)',
                'Bordes celulares externos prominentes',
                'Con frecuencia coexiste con otros patrones',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Acinos infiltrativos con estroma fibroelástico',
            help: {
              title: 'Acinos Infiltrativos',
              body: 'Glándulas de patrón acinar rodeadas por estroma fibroelástico reactivo, hallazgo que confirma la naturaleza invasiva del componente glandular. Complementa la evaluación del patrón acinar descrita en A1-B.',
              examples: [
                'Glándulas infiltrando el estroma circundante',
                'Estroma fibroelástico o desmoplásico peritumoral',
                'Confirma invasión, a diferencia del componente lepídico',
                'Frecuente coexistencia con patrón lepídico adyacente',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Papilas ramificadas verdaderas',
            help: {
              title: 'Papilas Ramificadas Verdaderas',
              body: 'Proyecciones papilares con ramificaciones secundarias y terciarias, cada una con su propio eje fibrovascular. Refuerza la identificación del patrón papilar cuando se observa como hallazgo adicional en la imagen.',
              examples: [
                'Ramificación jerárquica de las proyecciones',
                'Cada rama conserva su core fibrovascular',
                'Complejidad arquitectónica creciente hacia la periferia',
                'Diferenciar de pseudopapilas artefactuales (ver A2-D)',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Lagos de mucina extracelular extensos',
            help: {
              title: 'Lagos de Mucina Extensos',
              body: 'Acúmulos amplios de mucina extracelular que distienden los espacios alveolares, con escasas células tumorales flotantes. Su extensión (>50% del tumor) orienta hacia el subtipo especial coloide (ver A1-G, CE1-B, CE2-B).',
              examples: [
                'Mucina basofílica o pálida ocupando espacios alveolares',
                'Células tumorales dispersas y escasas en relación al volumen mucinoso',
                'Puede romper septos alveolares por presión mecánica',
                'Correlacionar con CE2 para confirmar subtipo coloide',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Morulas o estructuras seudoglandulares fetales',
            help: {
              title: 'Morulas Fetales',
              body: 'Nidos sólidos redondeados de células escamoides sin nucléolo prominente, ubicados dentro de la luz de glándulas tubulares. Hallazgo característico del adenocarcinoma fetal (ver A1-H, CE2-C).',
              examples: [
                'Nidos celulares compactos intraglandulares',
                'Ausencia de queratinización franca (no confundir con escamoso)',
                'Puede asociarse a expresión nuclear de beta-catenina',
                'Marcador de subtipo fetal, especialmente en pacientes jóvenes',
              ],
            },
          },
          {
            letter: 'F',
            text: 'Glándulas tipo intestinal',
            help: {
              title: 'Glándulas Tipo Intestinal',
              body: "Glándulas con revestimiento columnar pseudoestratificado y necrosis luminal, morfológicamente indistinguibles de un adenocarcinoma colorrectal. Hallazgo clave del subtipo entérico (ver A1-I, CE2-D).",
              examples: [
                'Pseudoestratificación nuclear columnar',
                "Necrosis luminal tipo 'suciedad'",
                'Puede coexistir con componentes convencionales (acinar, lepídico)',
                'Panel IHQ necesario para descartar metástasis colónica',
              ],
            },
          },
          { letter: 'G', text: 'Ninguno de los anteriores' },
        ],
      },
    ],
  },
  {
    id: 'citologia',
    label: 'Citología',
    questions: [
      {
        id: 'C1',
        text: '¿Cuál es el tipo celular predominante?',
        options: [
          {
            letter: 'A',
            text: 'Células cúbicas o columnares no mucinosas',
            help: {
              title: 'Neumocito Tipo II',
              body: 'Célula epitelial alveolar cúbica con nucléolo prominente, citoplasma denso y núcleo redondo. Es la célula de origen más común del adenocarcinoma pulmonar no mucinoso.',
              examples: [
                'Forma cúbica a poligonal',
                'Nucléolo eosinofílico visible en H&E 20x',
                'Citoplasma anfofílico (ni muy pálido ni muy oscuro)',
                'TTF-1 y NapsinA positivos',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Células columnares o caliciformes con abundante mucina intracitoplasmática',
            help: {
              title: 'Célula Columnar Mucinosa',
              body: 'Célula alta con citoplasma apical pálido lleno de mucina que desplaza el núcleo hacia la base. Característica del adenocarcinoma mucinoso invasivo.',
              examples: [
                'Forma columnar alta (altura > anchura)',
                'Citoplasma apical claro o ligeramente basofílico',
                'Núcleo basal pequeño, regular, sin atipias marcadas',
                'PAS y Azul Alcián positivos en el citoplasma apical',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Células con citoplasma claro o pálido',
            help: {
              title: 'Células con Citoplasma Claro',
              body: 'Citoplasma ópticamente vacío por glucógeno o lípidos. Requiere descartar metástasis de carcinoma de células claras renal o tiroideo antes de asumir origen pulmonar.',
              examples: [
                'Citoplasma amplio y pálido en H&E',
                'PAS positivo (glucógeno) o negativo (lípidos)',
                'Diferencial: carcinoma renal (PAX8+, TTF-1−)',
                'En ACA pulmonar: TTF-1 generalmente positivo',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Células con rasgos intestinales/entéricos',
            help: {
              title: 'Células de Tipo Entérico',
              body: 'Células columnares altas, pseudoestratificadas, con núcleos elongados y citoplasma eosinofílico, morfológicamente idénticas a las del epitelio colónico neoplásico. Su predominio orienta al subtipo entérico.',
              examples: [
                'Pseudoestratificación nuclear marcada',
                'Citoplasma eosinofílico, no claramente mucinoso',
                'Bordes celulares poco definidos entre células vecinas',
                'CDX2 y CK20 pueden ser positivos; TTF-1 puede persistir',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Células muy pleomórficas sin rasgos específicos',
            help: {
              title: 'Células Pleomórficas Inespecíficas',
              body: 'Células de gran variabilidad en tamaño y forma, sin rasgos citológicos que orienten hacia un tipo celular concreto. Sugiere alto grado histológico y obliga a considerar diferenciación pobre o carcinoma pleomórfico.',
              examples: [
                'Anisocitosis y anisonucleosis marcadas',
                'Pérdida de polaridad celular',
                'Puede acompañarse de células gigantes multinucleadas',
                'Requiere panel IHQ amplio para confirmar linaje adenocarcinomatoso',
              ],
            },
          },
          { letter: 'F', text: 'Población mixta' },
        ],
      },
      {
        id: 'C2',
        text: '¿Cuál es el grado de diferenciación morfológica aparente?',
        options: [
          {
            letter: 'A',
            text: 'Bien diferenciado',
            help: {
              title: 'Grado Bien Diferenciado',
              body: 'El tumor conserva formación glandular o lepídica clara, con atipia citológica leve y actividad mitótica baja. Se correlaciona típicamente con patrones lepídico y acinar bien formado, y con mejor pronóstico relativo.',
              examples: [
                'Arquitectura glandular o lepídica fácilmente reconocible',
                'Núcleos relativamente uniformes, cromatina fina',
                'Mitosis escasas (menos de 2 por campo de alto aumento)',
                'Predomina en patrones lepídico y acinar clásico',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Moderadamente diferenciado',
            help: {
              title: 'Grado Moderadamente Diferenciado',
              body: 'Categoría intermedia con formación glandular parcial, atipia citológica moderada y actividad mitótica intermedia. Es la categoría más frecuente en la práctica diaria y suele corresponder a patrones acinares o papilares.',
              examples: [
                'Formación glandular reconocible pero menos regular',
                'Pleomorfismo nuclear moderado',
                'Actividad mitótica intermedia',
                'Frecuente en patrones acinar y papilar',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Pobremente diferenciado',
            help: {
              title: 'Mitosis Frecuentes',
              body: 'Figuras mitóticas visibles en múltiples campos de alto aumento. Indica alta proliferación. Su cantidad apoya patrón sólido o micropapilar de alto grado.',
              examples: [
                'Visibles como figuras estrelladas o en plato metafásico',
                'Contar en campos de 2 mm² (objetivo 40x)',
                '>2 mitosis por campo de alto aumento = frecuente',
                'Mitosis atípicas (asimétricas) son más específicas de malignidad',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Indiferenciado',
            help: {
              title: 'Grado Indiferenciado',
              body: 'Ausencia total de diferenciación glandular, papilar o lepídica reconocible, con células que crecen en láminas o nidos sin organización. Se correlaciona con patrón sólido y requiere IHQ para confirmar el origen adenocarcinomatoso.',
              examples: [
                'Sin luces glandulares en ningún campo evaluado',
                'Alto pleomorfismo y mitosis frecuentes',
                'TTF-1/NapsinA imprescindibles para confirmar linaje',
                'Peor pronóstico relativo dentro del espectro del ACA',
              ],
            },
          },
          { letter: 'E', text: 'Mixto' },
        ],
      },
      {
        id: 'C3',
        text: '¿Cómo es el pleomorfismo nuclear?',
        options: [
          { letter: 'A', text: 'Leve' },
          {
            letter: 'B',
            text: 'Moderado',
            help: {
              title: 'Pleomorfismo Nuclear',
              body: 'Variación en tamaño, forma y tinción de los núcleos entre células del mismo tumor. Grado moderado es frecuente en ACA. Marcado sugiere patrón de alto grado o carcinoma pleomórfico.',
              examples: [
                'Variación de tamaño >2:1 entre núcleos vecinos',
                'Contornos nucleares irregulares o angulados',
                'Hipercromasia variable entre células',
                'Mitosis atípicas asociadas en casos de alto grado',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Marcado',
            help: {
              title: 'Pleomorfismo Nuclear',
              body: 'Variación en tamaño, forma y tinción de los núcleos entre células del mismo tumor. Grado moderado es frecuente en ACA. Marcado sugiere patrón de alto grado o carcinoma pleomórfico.',
              examples: [
                'Variación de tamaño >2:1 entre núcleos vecinos',
                'Contornos nucleares irregulares o angulados',
                'Hipercromasia variable entre células',
                'Mitosis atípicas asociadas en casos de alto grado',
              ],
            },
          },
          { letter: 'D', text: 'Variable dentro de la imagen' },
        ],
      },
      {
        id: 'C4',
        text: '¿Cuál describe mejor las características nucleares predominantes?',
        options: [
          {
            letter: 'A',
            text: 'Núcleos redondos u ovales, relativamente uniformes, cromatina fina',
            help: {
              title: 'Núcleos Uniformes de Bajo Grado',
              body: 'Núcleos redondos u ovales de tamaño relativamente constante entre células, con cromatina finamente dispersa y nucléolo poco prominente. Patrón típico de tumores bien diferenciados, especialmente lepídicos y acinares bajos.',
              examples: [
                'Tamaño nuclear homogéneo entre células vecinas',
                'Cromatina fina, sin grumos gruesos',
                'Nucléolo pequeño o ausente',
                'Se asocia con bajo grado histológico',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Núcleos agrandados con nucléolos visibles',
            help: {
              title: 'Nucléolos Prominentes',
              body: 'Nucléolo visible fácilmente a 20x–40x, eosinofílico, de tamaño ≥5 μm. Indica actividad transcripcional elevada, típico de adenocarcinoma y de reactivación neumocitaria reactiva.',
              examples: [
                'Visible sin oil immersion (objetivo 20x)',
                'Color rosado intenso en H&E',
                'Puede ser único o múltiple por célula',
                'Diferencia de células reactivas benignas (nucléolo más pequeño e irregular)',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Núcleos hipercromáticos e irregulares',
            help: {
              title: 'Núcleos Hipercromáticos e Irregulares',
              body: 'Núcleos con contornos angulados o muescados y tinción intensamente basofílica por condensación de cromatina. Hallazgo de alto grado, frecuente en patrones sólido y micropapilar.',
              examples: [
                "Contornos nucleares angulados o en 'grano de café'",
                'Hipercromasia marcada y difusa',
                'Frecuentemente acompañado de pleomorfismo marcado',
                'Se asocia con mayor actividad mitótica',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Núcleos desplazados por mucina',
            help: {
              title: 'Núcleos Desplazados por Mucina',
              body: "El acúmulo de mucina intracitoplasmática empuja al núcleo hacia la periferia celular, generando una imagen en 'anillo de sello' o similar. Hallazgo típico de diferenciación mucinosa.",
              examples: [
                'Núcleo aplanado contra la membrana celular',
                'Citoplasma amplio y pálido que ocupa la mayor parte de la célula',
                'Puede simular un carcinoma de células en anillo de sello',
                'Correlaciona con patrón mucinoso invasivo o coloide',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Núcleos pseudoestratificados tipo intestinal',
            help: {
              title: 'Núcleos Pseudoestratificados',
              body: 'Núcleos elongados dispuestos en distintos niveles dentro del epitelio columnar, sin verdadera estratificación en capas. Hallazgo característico del subtipo entérico, análogo al epitelio colónico.',
              examples: [
                "Núcleos alargados 'en cigarro' a distintas alturas",
                'Patrón similar al epitelio de adenoma/adenocarcinoma colónico',
                "Se acompaña de necrosis luminal tipo 'suciedad'",
                'Apoya el diagnóstico de subtipo entérico',
              ],
            },
          },
          {
            letter: 'F',
            text: 'Núcleos claros o vesiculosos',
            help: {
              title: 'Núcleos Claros o Vesiculosos',
              body: "Núcleos con cromatina laxa y aspecto ópticamente vacío o 'en vidrio esmerilado', a menudo con membrana nuclear bien definida. Puede observarse en patrón fetal y en algunas variantes de células claras.",
              examples: [
                'Cromatina laxa, poco condensada',
                "Aspecto vesiculoso o 'vacío' del núcleo",
                'Frecuente en adenocarcinoma fetal de bajo grado',
                'Diferenciar de cambios degenerativos o autolíticos',
              ],
            },
          },
        ],
      },
      {
        id: 'C5',
        text: '¿Cómo es el citoplasma predominante?',
        options: [
          {
            letter: 'A',
            text: 'Escaso y no mucinoso',
            help: {
              title: 'Citoplasma Escaso No Mucinoso',
              body: 'Relación núcleo-citoplasma alta, con un reborde citoplasmático delgado y sin evidencia de mucina. Puede observarse en patrones de alto grado o en células poco diferenciadas.',
              examples: [
                'Citoplasma reducido a un borde delgado periférico',
                'Sin vacuolas ni contenido mucinoso visible',
                'Relación núcleo-citoplasma elevada',
                'Frecuente en patrón sólido o pobremente diferenciado',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Moderado, eosinofílico o neutro',
            help: {
              title: 'Citoplasma Eosinofílico Moderado',
              body: 'Cantidad intermedia de citoplasma con tinción rosada (eosinofílica) o neutra, sin rasgos mucinosos ni claros específicos. Es el patrón citoplasmático más frecuente en el adenocarcinoma convencional no mucinoso.',
              examples: [
                'Tinción rosada uniforme en H&E',
                'Bordes celulares bien definidos',
                'Sin vacuolas mucinosas ni contenido claro',
                'Típico de patrones acinar y papilar convencionales',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Abundante y mucinoso',
            help: {
              title: 'Mucina Intracitoplasmática Predominante',
              body: 'La mayor parte del citoplasma celular está ocupado por mucina visible en H&E. Criterio clave para el diagnóstico de adenocarcinoma mucinoso invasivo. Diferente de la mucina extracelular en lagos.',
              examples: [
                'Citoplasma pálido y amplio que desplaza el núcleo',
                'PAS diastasa-resistente positivo',
                'Azul Alcián pH 2.5 positivo',
                'Contrasta con la mucina extracelular (ver CE1)',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Claro o pálido',
            help: {
              title: 'Citoplasma Claro',
              body: 'Citoplasma ópticamente vacío o pálido por acúmulo de glucógeno o lípidos, sin relación con mucina verdadera. Obliga a considerar diagnóstico diferencial con metástasis de células claras de origen renal o tiroideo.',
              examples: [
                'Citoplasma amplio y translúcido en H&E',
                'PAS positivo si el contenido es glucógeno',
                'Diferencial obligado: carcinoma renal de células claras',
                'TTF-1 positivo favorece origen pulmonar primario',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Vacuolado',
            help: {
              title: 'Citoplasma Vacuolado',
              body: 'Presencia de vacuolas citoplasmáticas de tamaño variable, que pueden contener mucina, lípidos o representar degeneración. Su distribución y contenido ayudan a orientar el diagnóstico diferencial.',
              examples: [
                'Vacuolas únicas o múltiples de tamaño variable',
                'Puede desplazar el núcleo si son de gran tamaño (anillo de sello)',
                'PAS y Azul Alcián ayudan a confirmar contenido mucinoso',
                'Diferenciar de cambio hidrópico degenerativo',
              ],
            },
          },
          { letter: 'F', text: 'Mixto' },
        ],
      },
    ],
  },
  {
    id: 'estroma',
    label: 'Estroma y Microambiente',
    questions: [
      {
        id: 'E1',
        text: '¿Cómo es el estroma asociado al tumor?',
        options: [
          {
            letter: 'A',
            text: 'Escaso, con mínima reacción',
            help: {
              title: 'Estroma Escaso',
              body: 'El tumor invade con mínima o nula reacción estromal reactiva, lo que puede dificultar reconocer la invasión a bajo aumento. Frecuente en tumores predominantemente lepídicos o con invasión mínima.',
              examples: [
                'Ausencia de desmoplasia significativa',
                'Estroma preexistente sin alteración importante',
                'Correlacionar cuidadosamente con evidencia de invasión (E2)',
                "No confundir 'estroma escaso' con 'ausencia de invasión'",
              ],
            },
          },
          {
            letter: 'B',
            text: 'Fibroelástico o desmoplásico',
            help: {
              title: 'Desmoplasia',
              body: 'Reacción fibroblástica del estroma en respuesta a la invasión tumoral. Miofibroblastos producen colágeno denso. Es un marcador de invasión real, no un artefacto.',
              examples: [
                'Estroma de color rosado denso en H&E',
                'Fibroblastos fusiformes activados visibles',
                'Rodea glándulas infiltrativas',
                'Diferente del estroma elástico del septo alveolar normal',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Mixoide',
            help: {
              title: 'Estroma Mixoide',
              body: 'Estroma con abundante matriz extracelular laxa, de aspecto azulado o grisáceo en H&E. Puede verse en ACA acinares y en variantes especiales como el entérico.',
              examples: [
                'Color gris-azulado en H&E (basofílico)',
                'Aspecto laxo entre las glándulas tumorales',
                'Azul Alcián positivo en el estroma',
                'No confundir con mucina extracelular tumoral intraluminal',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Colágeno denso',
            help: {
              title: 'Estroma de Colágeno Denso',
              body: 'Bandas gruesas de colágeno hialinizado, más compacto y menos celular que la desmoplasia activa. Puede representar una cicatriz previa o un componente fibrótico establecido dentro o alrededor del tumor.',
              examples: [
                'Colágeno eosinofílico denso y homogéneo',
                'Escasa celularidad fibroblástica en comparación con desmoplasia',
                'Diferencial con cicatriz fibroelástica preexistente',
                'Puede corresponder a fibrosis cicatricial central',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Estroma poco representado por abundante mucina extracelular',
            help: {
              title: 'Estroma Reemplazado por Mucina',
              body: 'El estroma convencional está escasamente representado porque el espacio está ocupado predominantemente por mucina extracelular. Hallazgo característico de los subtipos mucinoso invasivo extenso y coloide.',
              examples: [
                'Predominio de mucina sobre el componente estromal fibroso',
                'Compresión o desplazamiento del estroma residual',
                'Correlacionar con CE1/CE2 para subtipo mucinoso o coloide',
                'Puede acompañarse de inflamación reactiva perilesional',
              ],
            },
          },
          { letter: 'F', text: 'No valorable' },
          { letter: 'G', text: 'Indeterminado' },
        ],
      },
      {
        id: 'E2',
        text: '¿Existe evidencia de invasión estromal?',
        options: [
          {
            letter: 'A',
            text: 'No evidente',
            help: {
              title: 'Sin Invasión Estromal (In Situ)',
              body: 'Las células neoplásicas están confinadas sobre el septo alveolar sin penetrar el intersticio. Corresponde al componente in situ (lepídico puro). Tamaño ≤3 cm sin invasión = adenocarcinoma in situ (AIS).',
              examples: [
                'Sin desmoplasia',
                'Sin células tumorales sueltas en el estroma',
                'Septo alveolar como único soporte',
                'Equivale a pT1mi si hay foco invasivo ≤5mm (MIA)',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Sí, focal o mínima',
            help: {
              title: 'Invasión Focal (Microinvasión)',
              body: 'Uno o más focos de invasión del estroma de ≤5 mm cada uno, en un tumor predominantemente lepídico. Corresponde a adenocarcinoma mínimamente invasivo (MIA) si cumple todos los criterios OMS 2021.',
              examples: [
                'Foco(s) invasivo(s) ≤5 mm en su dimensión mayor',
                'Arquitectura acinar o papilar en el foco invasivo',
                'Sin invasión vascular, pleural ni perineural en MIA',
                'Sin patrón sólido ni micropapilar en MIA',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Sí, franca',
            help: {
              title: 'Invasión Angiolinfática (IAL)',
              body: 'Células tumorales dentro de la luz de vasos sanguíneos o linfáticos. Factor pronóstico independiente de metástasis. Se distingue del artefacto de retracción por la presencia de células endoteliales.',
              examples: [
                'Células tumorales en vasos revestidos de endotelio',
                'Confirmar con IHQ: D2-40 (linfáticos), CD31/CD34 (vasculares)',
                'Diferenciar de espacios de retracción artefactuales (sin endotelio)',
                'Asociado fuertemente con patrón micropapilar',
              ],
            },
          },
          { letter: 'D', text: 'Sospechosa pero no concluyente' },
          { letter: 'E', text: 'No valorable en esta imagen' },
          { letter: 'F', text: 'Indeterminado' },
        ],
      },
      {
        id: 'E3',
        text: '¿Hay infiltrado inflamatorio asociado?',
        options: [
          { letter: 'A', text: 'Ausente o mínimo' },
          { letter: 'B', text: 'Leve' },
          { letter: 'C', text: 'Moderado' },
          { letter: 'D', text: 'Marcado' },
          {
            letter: 'E',
            text: 'Predominantemente linfocitario',
            help: {
              title: 'Infiltrado Linfoide Tumoral (TILs)',
              body: 'Linfocitos T y B en el estroma peritumoral o intratumoral. Puede reflejar respuesta inmune antitumoral. Se asocia con mayor expresión de PD-L1 y potencial respuesta a inmunoterapia.',
              examples: [
                'Linfocitos pequeños con núcleo oscuro y escaso citoplasma',
                'Pueden formar folículos linfoides secundarios',
                'Distribución peritumoral o intratumoral',
                'Evaluar densidad: escaso / moderado / abundante',
              ],
            },
          },
          {
            letter: 'F',
            text: 'Predominantemente mixto',
            help: {
              title: 'Infiltrado Inflamatorio Mixto',
              body: 'Combinación de linfocitos, células plasmáticas, neutrófilos y/o eosinófilos en el estroma peritumoral, sin predominio claro de un solo tipo celular. Su composición puede orientar hacia procesos reactivos, necrosis asociada o respuesta inmune variable.',
              examples: [
                'Presencia simultánea de varias líneas celulares inflamatorias',
                'Neutrófilos sugieren necrosis o sobreinfección asociada',
                'Eosinófilos pueden reflejar respuesta inmune particular',
                'Distinto del infiltrado predominantemente linfocitario (TILs, ver E3-E)',
              ],
            },
          },
          { letter: 'G', text: 'Indeterminado / no valorable' },
        ],
      },
      {
        id: 'E4',
        text: '¿Se observa necrosis tumoral?',
        options: [
          { letter: 'A', text: 'No' },
          {
            letter: 'B',
            text: 'Sí, focal',
            help: {
              title: 'Necrosis Tumoral',
              body: 'Muerte celular coagulativa dentro del tumor. En ACA pulmonar puede verse en tumores de alto grado. Su presencia en un patrón lepídico obliga a buscar foco invasivo subyacente.',
              examples: [
                'Detritus eosinofílicos con sombras nucleares ("fantasmas")',
                'Puede ser geográfica (extensa) o puntiforme',
                'Necrosis comedónica: característica del patrón sólido de alto grado',
                'Diferencial: infarto pulmonar, neumonía organizativa',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Sí, extensa',
            help: {
              title: 'Necrosis Tumoral',
              body: 'Muerte celular coagulativa dentro del tumor. En ACA pulmonar puede verse en tumores de alto grado. Su presencia en un patrón lepídico obliga a buscar foco invasivo subyacente.',
              examples: [
                'Detritus eosinofílicos con sombras nucleares ("fantasmas")',
                'Puede ser geográfica (extensa) o puntiforme',
                'Necrosis comedónica: característica del patrón sólido de alto grado',
                'Diferencial: infarto pulmonar, neumonía organizativa',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Solo detritos celulares dudosos',
            help: {
              title: 'Detritos Celulares Dudosos',
              body: 'Material eosinofílico o basofílico de aspecto incierto, sin los criterios morfológicos claros de necrosis coagulativa franca (sombras nucleares, patrón geográfico). Requiere correlación con niveles adicionales antes de clasificarlo como necrosis verdadera.',
              examples: [
                "Ausencia de sombras nucleares claras ('fantasmas')",
                'Puede corresponder a artefacto de aplastamiento o fijación',
                'Diferenciar de detritos inflamatorios o mucina degenerada',
                'Ante la duda, no clasificar como necrosis franca',
              ],
            },
          },
        ],
      },
      {
        id: 'E5',
        text: '¿Se reconocen hallazgos de diseminación por espacios aéreos o estructuras relacionadas?',
        options: [
          { letter: 'A', text: 'No' },
          {
            letter: 'B',
            text: 'Sí, penachos micropapilares en espacios aéreos',
            help: {
              title: 'STAS — Penachos Micropapilares',
              body: 'Diseminación tumoral por espacios aéreos (STAS) en forma de pequeños racimos de células sin eje fibrovascular, localizados en los espacios alveolares más allá del borde tumoral. Es el patrón de STAS más frecuente y se asocia con mayor riesgo de recurrencia local.',
              examples: [
                'Racimos celulares flotando en alvéolos alejados del tumor principal',
                'Morfología idéntica al patrón micropapilar (sin eje fibrovascular)',
                'Debe documentarse la distancia al borde tumoral',
                'Relevante para decisiones de resección sublobar',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Sí, nidos sólidos en espacios aéreos',
            help: {
              title: 'STAS — Nidos Sólidos',
              body: 'Diseminación por espacios aéreos en forma de nidos sólidos compactos de células tumorales dentro de alvéolos distantes del tumor principal. Segundo patrón más frecuente de STAS, con implicaciones pronósticas similares al micropapilar.',
              examples: [
                'Agregados celulares compactos sin luz central',
                'Localizados en espacios aéreos alejados del borde tumoral',
                'Diferenciar de extensión contigua directa del tumor',
                'Se asocia con mayor riesgo de recurrencia tras resección limitada',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Sí, células discohesivas en espacios aéreos',
            help: {
              title: 'STAS — Células Discohesivas',
              body: 'Células tumorales aisladas, sin cohesión entre sí, dispersas dentro de espacios aéreos alejados del tumor principal. Patrón de STAS menos frecuente pero igualmente significativo para la estadificación y el riesgo de recurrencia.',
              examples: [
                'Células únicas dispersas sin formar grupos cohesivos',
                'Ausencia de arquitectura organizada',
                'Puede ser más difícil de reconocer a bajo aumento',
                'Confirmar que no correspondan a macrófagos o células reactivas',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Dudoso / artefacto posible',
            help: {
              title: 'STAS vs. Artefacto de Flotación',
              body: 'Uno de los principales retos diagnósticos en patología pulmonar moderna: distinguir STAS verdadero de artefacto de arrastre (células desprendidas mecánicamente durante el corte con cuchilla, que "flotan" en espacios aéreos distantes sin relación biológica real).',
              examples: [
                "Artefacto: células en el borde del corte, patrón lineal o en 'estela'",
                'STAS verdadero: células dentro de espacios aéreos alveolares intactos',
                'Revisar bordes de la sección y comparar con cortes profundos si hay duda',
                'La sobreestimación de STAS puede alterar decisiones quirúrgicas',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'especiales',
    label: 'Características Especiales',
    questions: [
      {
        id: 'CE1',
        text: '¿Cuál de las siguientes características especiales está presente?',
        options: [
          {
            letter: 'A',
            text: 'Abundante mucina intracitoplasmática en células tumorales',
            help: {
              title: 'Mucina Intracitoplasmática',
              body: 'Célula tumoral con citoplasma predominantemente ocupado por mucina, hallazgo que orienta hacia el subtipo mucinoso invasivo cuando es extenso y consistente en la mayoría de las células tumorales.',
              examples: [
                'Citoplasma amplio, pálido, con núcleo basal desplazado',
                'PAS diastasa-resistente y Azul Alcián positivos',
                'Debe ser el hallazgo predominante, no focal, para definir subtipo',
                'Correlacionar con CE2-A (adenocarcinoma mucinoso invasivo)',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Abundante mucina extracelular en lagos',
            help: {
              title: 'Mucina Extracelular en Lagos (Patrón Coloide)',
              body: 'Grandes acúmulos de mucina extracelular ("lagos de mucina") con grupos de células tumorales flotando en su interior. Criterio diagnóstico del adenocarcinoma coloide (mucinoso).',
              examples: [
                'Lagos de mucina basofílica amplia en H&E',
                'Células tumorales en anillo de sello o columnares flotando',
                'PAS y Azul Alcián positivos en la mucina extracelular',
                'Pronóstico relativamente favorable comparado con ACA convencional',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Morulas',
            help: {
              title: 'Morulas',
              body: 'Nidos sólidos redondeados de células escamoides, sin queratinización franca ni nucléolo prominente, ubicados dentro de glándulas tubulares. Hallazgo distintivo que orienta al subtipo fetal cuando es prominente.',
              examples: [
                'Nidos celulares compactos intraglandulares',
                'Aspecto escamoide sin queratinización verdadera',
                'Frecuente expresión nuclear de beta-catenina',
                'Correlacionar con CE2-C (adenocarcinoma fetal)',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Morfología intestinal o entérica',
            help: {
              title: 'Morfología Intestinal o Entérica',
              body: 'Glándulas con revestimiento columnar pseudoestratificado y necrosis luminal, morfológicamente indistinguibles de un adenocarcinoma colorrectal. Hallazgo clave del subtipo entérico, presente aquí como característica especial adicional.',
              examples: [
                "Necrosis luminal tipo 'suciedad'",
                'Pseudoestratificación nuclear columnar',
                'Puede coexistir con componentes convencionales (acinar, lepídico)',
                'Correlacionar con CE2-D para confirmar subtipo entérico',
              ],
            },
          },
          {
            letter: 'E',
            text: 'Citoplasma claro con patrón fetal',
            help: {
              title: 'Citoplasma Claro con Patrón Fetal',
              body: 'Células con citoplasma rico en glucógeno, dispuestas en glándulas tubulares que recapitulan el pulmón fetal en desarrollo. Hallazgo característico y necesario para considerar el subtipo fetal.',
              examples: [
                'Citoplasma subnuclear y supranuclear rico en glucógeno',
                'Patrón glandular tipo endometrio proliferativo',
                'Frecuentemente asociado a morulas (ver CE1-C)',
                'Correlacionar con CE2-C para confirmar subtipo',
              ],
            },
          },
          { letter: 'F', text: 'Ninguna de las anteriores' },
        ],
      },
      {
        id: 'CE2',
        text: '¿Hay alguna característica que obligue a considerar un subtipo especial por encima de los patrones convencionales?',
        options: [
          {
            letter: 'A',
            text: 'Sí, mucinoso invasivo',
            help: {
              title: 'Adenocarcinoma Mucinoso Invasivo',
              body: 'Antes llamado "carcinoma bronquioloalveolar mucinoso". Células columnares altas con mucina intracitoplasmática, crecimiento lepídico extenso y mucina intra-alveolar. KRAS mutado en >80%. TTF-1 variable.',
              examples: [
                'Células columnares con mucina apical',
                'Crecimiento lepídico con consolidación mucinosa',
                'Puede ser multifocal o bilateral ("neumónico")',
                'CK7+, CK20 variable, CDX2 variable, TTF-1 variable',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Sí, coloide',
            help: {
              title: 'Adenocarcinoma Coloide (Mucinoso)',
              body: 'Lagos de mucina extracelular que ocupan los espacios alveolares, con escasas células tumorales flotantes. Puede parecerse a carcinoma mucinoso de colon o mama metastásico.',
              examples: [
                '>50% del tumor compuesto por mucina extracelular',
                'Células en anillo de sello o columnares flotando',
                'Diferencial: metástasis de colon (CK20+, CDX2+, TTF-1−)',
                'CK7+, TTF-1 generalmente positivo en primario pulmonar',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Sí, fetal',
            help: {
              title: 'Adenocarcinoma Fetal',
              body: 'Imita el pulmón fetal en estadio pseudoglandular. Glándulas tubulares con células de glucógeno (morulares) y patrón endometrioide. Bajo grado: buen pronóstico. Alto grado: CTNNB1 mutado frecuente.',
              examples: [
                'Glándulas tubulares con secreción supranuclear de glucógeno',
                'Morulas (nidos sólidos de células sin nucléolo prominente)',
                'Patrón similar a endometrio proliferativo',
                'Beta-catenina nuclear positiva en bajo grado',
              ],
            },
          },
          {
            letter: 'D',
            text: 'Sí, entérico',
            help: {
              title: 'Adenocarcinoma de Tipo Entérico',
              body: 'Morfología similar al adenocarcinoma colorrectal: glándulas tubulares con necrosis luminal ("suciedad"), células columnares con pseudoestratificación. Requiere descartar metástasis de colon con panel IHQ.',
              examples: [
                'Necrosis luminal tipo "suciedad" en H&E',
                'Células columnares pseudoestratificadas',
                'CK20 y CDX2 pueden ser positivos',
                'TTF-1 y NapsinA pueden ser positivos (diferencia con metástasis colónica)',
              ],
            },
          },
          { letter: 'E', text: 'No' },
        ],
      },
      {
        id: 'CE3',
        text: '¿El patrón observado parece único o mixto?',
        options: [
          {
            letter: 'A',
            text: 'Patrón único y bien definido',
            help: {
              title: 'Patrón Único (Puro)',
              body: 'Un solo patrón arquitectónico representa la práctica totalidad del tumor (convencionalmente ≥90-95%), sin componentes secundarios significativos. Simplifica la clasificación pero sigue requiriendo documentar el porcentaje estimado según la OMS 2021.',
              examples: [
                'Un solo patrón predominante sin mezcla relevante',
                'Aun así, reportar el porcentaje aproximado (p.ej. ~95-100%)',
                'Revisar múltiples campos para descartar componentes minoritarios',
                'Menos frecuente en la práctica que los patrones mixtos',
              ],
            },
          },
          {
            letter: 'B',
            text: 'Predomina un patrón con componente secundario',
            help: {
              title: 'Adenocarcinoma Mixto',
              body: 'La OMS 2021 requiere reportar TODOS los patrones presentes con su porcentaje estimado en incrementos del 5%. El patrón predominante (>50%) define la categoría principal. Los patrones secundarios influyen en el pronóstico.',
              examples: [
                'Reportar: p.ej. 60% lepídico + 30% acinar + 10% papilar',
                'El patrón de mayor grado determina el comportamiento clínico',
                'Cualquier componente micropapilar o sólido debe mencionarse aunque sea minoritario',
                'Mapear en el informe qué zona corresponde a cada patrón',
              ],
            },
          },
          {
            letter: 'C',
            text: 'Hay mezcla importante de varios patrones',
            help: {
              title: 'Adenocarcinoma Mixto',
              body: 'La OMS 2021 requiere reportar TODOS los patrones presentes con su porcentaje estimado en incrementos del 5%. El patrón predominante (>50%) define la categoría principal. Los patrones secundarios influyen en el pronóstico.',
              examples: [
                'Reportar: p.ej. 60% lepídico + 30% acinar + 10% papilar',
                'El patrón de mayor grado determina el comportamiento clínico',
                'Cualquier componente micropapilar o sólido debe mencionarse aunque sea minoritario',
                'Mapear en el informe qué zona corresponde a cada patrón',
              ],
            },
          },
          { letter: 'D', text: 'No es posible determinarlo' },
        ],
      },
    ],
  },
]

// Flat list of all question IDs in order, for navigation
export const ALL_QUESTION_IDS = SECTIONS.flatMap(s => s.questions.map(q => q.id))

// Section ID for a given question ID
export function getSectionForQuestion(questionId: string): string {
  for (const section of SECTIONS) {
    if (section.questions.some(q => q.id === questionId)) {
      return section.id
    }
  }
  return ''
}
