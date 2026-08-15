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
          { letter: 'G', text: 'Grandes lagos de mucina extracelular con células tumorales flotando o dispersas' },
          { letter: 'H', text: 'Glándulas complejas de aspecto fetal o embrionario' },
          { letter: 'I', text: 'Glándulas con morfología intestinal o entérica' },
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
          { letter: 'B', text: 'No tienen eje fibrovascular central' },
          { letter: 'C', text: 'Forman proyecciones hacia espacios alveolares, pero no es claro si hay eje fibrovascular' },
          { letter: 'D', text: 'Parecen pseudopapilas por retracción artefactual' },
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
          { letter: 'B', text: 'Irregulares, anguladas o complejas' },
          { letter: 'C', text: 'Con morfología cribiforme o glandular compleja' },
          { letter: 'D', text: 'Dilatadas y llenas de mucina' },
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
          { letter: 'B', text: 'Las células destruyen e infiltran la arquitectura alveolar' },
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
          { letter: 'D', text: 'La arquitectura alveolar no es reconocible' },
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
          { letter: 'B', text: 'Acinos infiltrativos con estroma fibroelástico' },
          { letter: 'C', text: 'Papilas ramificadas verdaderas' },
          { letter: 'D', text: 'Lagos de mucina extracelular extensos' },
          { letter: 'E', text: 'Morulas o estructuras seudoglandulares fetales' },
          { letter: 'F', text: 'Glándulas tipo intestinal' },
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
          { letter: 'D', text: 'Células con rasgos intestinales/entéricos' },
          { letter: 'E', text: 'Células muy pleomórficas sin rasgos específicos' },
          { letter: 'F', text: 'Población mixta' },
        ],
      },
      {
        id: 'C2',
        text: '¿Cuál es el grado de diferenciación morfológica aparente?',
        options: [
          { letter: 'A', text: 'Bien diferenciado' },
          { letter: 'B', text: 'Moderadamente diferenciado' },
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
          { letter: 'D', text: 'Indiferenciado' },
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
          { letter: 'A', text: 'Núcleos redondos u ovales, relativamente uniformes, cromatina fina' },
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
          { letter: 'C', text: 'Núcleos hipercromáticos e irregulares' },
          { letter: 'D', text: 'Núcleos desplazados por mucina' },
          { letter: 'E', text: 'Núcleos pseudoestratificados tipo intestinal' },
          { letter: 'F', text: 'Núcleos claros o vesiculosos' },
        ],
      },
      {
        id: 'C5',
        text: '¿Cómo es el citoplasma predominante?',
        options: [
          { letter: 'A', text: 'Escaso y no mucinoso' },
          { letter: 'B', text: 'Moderado, eosinofílico o neutro' },
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
          { letter: 'D', text: 'Claro o pálido' },
          { letter: 'E', text: 'Vacuolado' },
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
          { letter: 'A', text: 'Escaso, con mínima reacción' },
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
          { letter: 'D', text: 'Colágeno denso' },
          { letter: 'E', text: 'Estroma poco representado por abundante mucina extracelular' },
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
          { letter: 'F', text: 'Predominantemente mixto' },
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
          { letter: 'D', text: 'Solo detritos celulares dudosos' },
        ],
      },
      {
        id: 'E5',
        text: '¿Se reconocen hallazgos de diseminación por espacios aéreos o estructuras relacionadas?',
        options: [
          { letter: 'A', text: 'No' },
          { letter: 'B', text: 'Sí, penachos micropapilares en espacios aéreos' },
          { letter: 'C', text: 'Sí, nidos sólidos en espacios aéreos' },
          { letter: 'D', text: 'Sí, células discohesivas en espacios aéreos' },
          { letter: 'E', text: 'Dudoso / artefacto posible' },
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
          { letter: 'A', text: 'Abundante mucina intracitoplasmática en células tumorales' },
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
          { letter: 'C', text: 'Morulas' },
          { letter: 'D', text: 'Morfología intestinal o entérica' },
          { letter: 'E', text: 'Citoplasma claro con patrón fetal' },
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
          { letter: 'A', text: 'Patrón único y bien definido' },
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
