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
          { letter: 'A', text: 'Revestimiento de septos alveolares preexistentes con preservación relativa de la arquitectura pulmonar' },
          { letter: 'B', text: 'Glándulas o acinos bien formados con lumen reconocible' },
          { letter: 'C', text: 'Proyecciones papilares verdaderas con eje fibrovascular central' },
          { letter: 'D', text: 'Pequeños grupos, penachos o agregados celulares sin eje fibrovascular, en espacios claros o alveolares' },
          { letter: 'E', text: 'Láminas sólidas, nidos compactos o crecimiento difuso sin formación glandular evidente' },
          { letter: 'F', text: 'Células mucinosas con patrón glandular, acinar, papilar o lepídico y abundante mucina intracitoplasmática' },
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
          { letter: 'A', text: 'Tienen eje fibrovascular central evidente' },
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
          { letter: 'A', text: 'Redondas u ovaladas, relativamente uniformes, con lumen bien definido' },
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
          { letter: 'A', text: 'Las células recubren septos alveolares preservados' },
          { letter: 'B', text: 'Las células destruyen e infiltran la arquitectura alveolar' },
          { letter: 'C', text: 'Hay combinación de revestimiento alveolar e invasión' },
          { letter: 'D', text: 'La arquitectura alveolar no es reconocible' },
          { letter: 'E', text: 'No aplica en esta imagen' },
        ],
      },
      {
        id: 'A5',
        text: '¿Cuál de los siguientes hallazgos arquitectónicos adicionales está presente?',
        options: [
          { letter: 'A', text: 'Espacios alveolares ocupados por penachos celulares sin estroma' },
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
          { letter: 'A', text: 'Células cúbicas o columnares no mucinosas' },
          { letter: 'B', text: 'Células columnares o caliciformes con abundante mucina intracitoplasmática' },
          { letter: 'C', text: 'Células con citoplasma claro o pálido' },
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
          { letter: 'C', text: 'Pobremente diferenciado' },
          { letter: 'D', text: 'Indiferenciado' },
          { letter: 'E', text: 'Mixto' },
        ],
      },
      {
        id: 'C3',
        text: '¿Cómo es el pleomorfismo nuclear?',
        options: [
          { letter: 'A', text: 'Leve' },
          { letter: 'B', text: 'Moderado' },
          { letter: 'C', text: 'Marcado' },
          { letter: 'D', text: 'Variable dentro de la imagen' },
        ],
      },
      {
        id: 'C4',
        text: '¿Cuál describe mejor las características nucleares predominantes?',
        options: [
          { letter: 'A', text: 'Núcleos redondos u ovales, relativamente uniformes, cromatina fina' },
          { letter: 'B', text: 'Núcleos agrandados con nucléolos visibles' },
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
          { letter: 'C', text: 'Abundante y mucinoso' },
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
          { letter: 'B', text: 'Fibroelástico o desmoplásico' },
          { letter: 'C', text: 'Mixoide' },
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
          { letter: 'A', text: 'No evidente' },
          { letter: 'B', text: 'Sí, focal o mínima' },
          { letter: 'C', text: 'Sí, franca' },
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
          { letter: 'E', text: 'Predominantemente linfocitario' },
          { letter: 'F', text: 'Predominantemente mixto' },
          { letter: 'G', text: 'Indeterminado / no valorable' },
        ],
      },
      {
        id: 'E4',
        text: '¿Se observa necrosis tumoral?',
        options: [
          { letter: 'A', text: 'No' },
          { letter: 'B', text: 'Sí, focal' },
          { letter: 'C', text: 'Sí, extensa' },
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
          { letter: 'B', text: 'Abundante mucina extracelular en lagos' },
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
          { letter: 'A', text: 'Sí, mucinoso invasivo' },
          { letter: 'B', text: 'Sí, coloide' },
          { letter: 'C', text: 'Sí, fetal' },
          { letter: 'D', text: 'Sí, entérico' },
          { letter: 'E', text: 'No' },
        ],
      },
      {
        id: 'CE3',
        text: '¿El patrón observado parece único o mixto?',
        options: [
          { letter: 'A', text: 'Patrón único y bien definido' },
          { letter: 'B', text: 'Predomina un patrón con componente secundario' },
          { letter: 'C', text: 'Hay mezcla importante de varios patrones' },
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
