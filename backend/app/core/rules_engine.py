"""
Motor de reglas diagnóstico para adenocarcinoma pulmonar invasivo.
Fuente: algoritmo_adenocarcinoma.docx

Principios de diseño:
- Funciones puras: entrada = dict de respuestas, salida = datos simples.
- Sin estado. Sin efectos secundarios. Testeable con dicts Python directos.
- Cada grupo de reglas está en su propia función nombrada.
- Los comentarios referencian el paso/regla del documento fuente.
"""

from __future__ import annotations
from typing import Optional
from app.models.schemas import DiagnosisResult, ConfidenceLevel


Answers = dict[str, str]  # {"A1": "B", "C1": "A", ...}


# ─── Entry point ──────────────────────────────────────────────────────────────

def evaluate(answers: Answers) -> DiagnosisResult:
    contradictions = detect_contradictions(answers)

    # Paso 1: subtipos especiales tienen prioridad
    special = evaluate_special_subtypes(answers)

    if special:
        main_pattern = special
        secondary_patterns = get_secondary_patterns(answers, main_pattern)
        confidence = calculate_confidence_special(answers, special, contradictions)
    else:
        # Paso 2: patrones convencionales
        scores = score_conventional_patterns(answers)
        main_pattern, secondary_patterns = resolve_conventional(scores, answers)
        confidence = calculate_confidence_conventional(answers, main_pattern, contradictions)

    architectural_findings = extract_architectural_findings(answers)
    cytological_findings = extract_cytological_findings(answers)
    stromal_findings = extract_stromal_findings(answers)
    special_features = extract_special_features(answers)
    differentials = get_differentials(main_pattern, answers)
    narrative = build_narrative(main_pattern, answers, contradictions)
    warnings = build_warnings(answers, secondary_patterns)
    missing_hint = suggest_missing_findings(answers, main_pattern)

    return DiagnosisResult(
        main_pattern=main_pattern,
        secondary_patterns=secondary_patterns,
        architectural_findings=architectural_findings,
        cytological_findings=cytological_findings,
        stromal_findings=stromal_findings,
        special_features=special_features,
        differentials=differentials,
        confidence=confidence,
        narrative=narrative,
        warnings=warnings,
        contradictions=contradictions,
        missing_findings_hint=missing_hint,
    )


# ─── Paso 1: Subtipos especiales ──────────────────────────────────────────────

def evaluate_special_subtypes(answers: Answers) -> Optional[str]:
    """
    Evalúa en orden: mucinoso invasivo, coloide, fetal, entérico.
    Retorna el nombre del subtipo si se cumplen los criterios, o None.
    Documento: Paso 1 (1A–1D).
    """
    if _is_mucinoso_invasivo(answers):
        return "Adenocarcinoma mucinoso invasivo"
    if _is_coloide(answers):
        return "Adenocarcinoma coloide"
    if _is_fetal(answers):
        return "Adenocarcinoma fetal"
    if _is_enterico(answers):
        return "Adenocarcinoma entérico"
    return None


def _is_mucinoso_invasivo(answers: Answers) -> bool:
    """Documento 1A."""
    # Criterio principal directo
    if answers.get("A1") == "F":
        return True
    # Criterio por CE2 explícito
    if answers.get("CE2") == "A":
        return True
    # Criterio combinado
    cel_mucinosa = answers.get("C1") == "B"
    cit_mucinoso = answers.get("C5") == "C"
    ce1_mucinosa = answers.get("CE1") == "A"
    if cel_mucinosa and cit_mucinoso and ce1_mucinosa:
        return True
    return False


def _is_coloide(answers: Answers) -> bool:
    """
    Documento 1B.
    Interpretación adoptada: Coloide si A1=G OR CE1=B OR CE2=B.
    (La segunda condición de la regla — grandes lagos con células flotando —
    es equivalente a A1=G y CE1=B, por lo que se evalúa así.)
    """
    if answers.get("A1") == "G":
        return True
    if answers.get("CE1") == "B":
        return True
    if answers.get("CE2") == "B":
        return True
    return False


def _is_fetal(answers: Answers) -> bool:
    """Documento 1C."""
    if answers.get("A1") == "H":
        return True
    if answers.get("CE1") in ("C", "E"):
        return True
    if answers.get("CE2") == "C":
        return True
    return False


def _is_enterico(answers: Answers) -> bool:
    """Documento 1D."""
    if answers.get("A1") == "I":
        return True
    if answers.get("CE2") == "D":
        return True
    ce1_enterico = answers.get("CE1") == "D"
    c1_enterico = answers.get("C1") == "D"
    c4_intestinal = answers.get("C4") == "E"
    if ce1_enterico and (c1_enterico or c4_intestinal):
        return True
    return False


# ─── Paso 2: Patrones convencionales ─────────────────────────────────────────

def score_conventional_patterns(answers: Answers) -> dict[str, int]:
    """
    Asigna puntajes a cada patrón convencional según criterios del documento.
    Criterios principales valen 2 puntos; criterios que favorecen valen 1 punto.
    Documento: Paso 2 (2A–2E).
    """
    scores: dict[str, int] = {
        "lepidico": 0,
        "acinar": 0,
        "papilar": 0,
        "micropapilar": 0,
        "solido": 0,
    }

    # 2A. Lepídico
    if answers.get("A1") == "A":
        scores["lepidico"] += 2
    if answers.get("A4") == "A":
        scores["lepidico"] += 2
    if answers.get("E2") in ("A", "B"):
        scores["lepidico"] += 2
    if answers.get("A2") == "E":
        scores["lepidico"] += 1
    if answers.get("A3") == "E":
        scores["lepidico"] += 1
    # Criterios que favorecen
    if answers.get("C1") == "A":
        scores["lepidico"] += 1
    if answers.get("C2") in ("A", "B"):
        scores["lepidico"] += 1
    if answers.get("E1") == "A":
        scores["lepidico"] += 1

    # 2B. Acinar
    if answers.get("A1") == "B":
        scores["acinar"] += 2
    if answers.get("A3") in ("A", "B"):
        scores["acinar"] += 2
    if answers.get("A4") in ("B", "C"):
        scores["acinar"] += 2
    if answers.get("E2") in ("B", "C"):
        scores["acinar"] += 2
    if answers.get("A2") == "E":
        scores["acinar"] += 1
    # Criterios que favorecen
    if answers.get("C1") == "A":
        scores["acinar"] += 1
    if answers.get("C2") in ("A", "B"):
        scores["acinar"] += 1
    if answers.get("E1") == "B":
        scores["acinar"] += 1

    # 2C. Papilar
    if answers.get("A1") == "C":
        scores["papilar"] += 2
    if answers.get("A2") == "A":
        scores["papilar"] += 2
    if answers.get("A5") == "C":
        scores["papilar"] += 2
    # Criterios que favorecen
    if answers.get("C1") == "A":
        scores["papilar"] += 1
    if answers.get("C2") == "B":
        scores["papilar"] += 1
    if answers.get("E2") in ("B", "C"):
        scores["papilar"] += 1

    # 2D. Micropapilar
    if answers.get("A1") == "D":
        scores["micropapilar"] += 2
    if answers.get("A2") == "B":
        scores["micropapilar"] += 2
    if answers.get("A5") == "A":
        scores["micropapilar"] += 2
    if answers.get("E5") in ("B", "D"):
        scores["micropapilar"] += 2
    # Criterios que favorecen
    if answers.get("C2") == "C":
        scores["micropapilar"] += 1
    if answers.get("C3") in ("B", "C"):
        scores["micropapilar"] += 1
    if answers.get("E4") in ("B", "C"):
        scores["micropapilar"] += 1

    # 2E. Sólido
    if answers.get("A1") == "E":
        scores["solido"] += 2
    if answers.get("A3") == "E":
        scores["solido"] += 2
    if answers.get("A4") == "D":
        scores["solido"] += 2
    if answers.get("E2") == "C":
        scores["solido"] += 2
    if answers.get("E1") == "B":
        scores["solido"] += 1
    # Criterios que favorecen
    if answers.get("C2") == "C":
        scores["solido"] += 1
    if answers.get("C3") in ("B", "C"):
        scores["solido"] += 1
    if answers.get("E4") in ("B", "C"):
        scores["solido"] += 1

    return scores


_PATTERN_LABELS = {
    "lepidico": "Adenocarcinoma con patrón lepídico",
    "acinar": "Adenocarcinoma con patrón acinar",
    "papilar": "Adenocarcinoma con patrón papilar",
    "micropapilar": "Adenocarcinoma con patrón micropapilar",
    "solido": "Adenocarcinoma con patrón sólido",
}


def resolve_conventional(scores: dict[str, int], answers: Answers) -> tuple[str, list[str]]:
    """
    Aplica reglas de desempate y determina patrón principal y secundarios.
    Documento: Reglas de desempate (Regla 1–5).
    """
    if all(v == 0 for v in scores.values()):
        return "Patrón no determinado", []

    sorted_patterns = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_key, top_score = sorted_patterns[0]
    second_key, second_score = sorted_patterns[1] if len(sorted_patterns) > 1 else ("", 0)

    # Regla 1: desempate por eje fibrovascular entre papilar y micropapilar
    if top_key in ("papilar", "micropapilar") and abs(top_score - second_score) <= 2:
        if answers.get("A2") == "A":
            top_key = "papilar"
        elif answers.get("A2") == "B":
            top_key = "micropapilar"

    main = _PATTERN_LABELS.get(top_key, top_key)

    # Regla 5: registrar secundarios si hay patrón mixto
    secondary_labels: list[str] = []
    is_mixed = answers.get("A1") == "J" or answers.get("CE3") in ("B", "C")
    if is_mixed and second_score > 0:
        secondary_labels.append(_PATTERN_LABELS.get(second_key, second_key))

    # Anotación especial por cribiforme (documento 2B nota)
    if answers.get("A3") == "C" and top_key == "acinar":
        main += " (componente glandular complejo/cribiforme de alto grado)"

    return main, secondary_labels


# ─── Patrones secundarios para subtipos especiales ───────────────────────────

def get_secondary_patterns(answers: Answers, main: str) -> list[str]:
    """Registra patrón secundario solo si CE3 indica mezcla."""
    if answers.get("CE3") not in ("B", "C"):
        return []
    # Para subtipos especiales mixtos, indicamos el patrón arquitectónico de base
    arch_map = {
        "A": "componente lepídico",
        "B": "componente acinar",
        "C": "componente papilar",
        "D": "componente micropapilar",
        "E": "componente sólido",
    }
    base = arch_map.get(answers.get("A1", ""), "")
    return [base] if base else []


# ─── Detección de contradicciones ────────────────────────────────────────────

def detect_contradictions(answers: Answers) -> list[str]:
    """
    Detecta inconsistencias internas entre respuestas.
    Retorna lista de mensajes descriptivos (vacía si no hay contradicciones).
    """
    issues: list[str] = []

    # Eje fibrovascular vs. patrón micropapilar
    if answers.get("A2") == "A" and answers.get("A1") == "D":
        issues.append(
            "A2=A (eje fibrovascular presente) contradice A1=D (micropapilar, sin eje fibrovascular)."
        )

    # Mucina extracelular vs. patrón lepídico puro
    if answers.get("CE1") == "B" and answers.get("A1") == "A" and answers.get("A4") == "A":
        issues.append(
            "CE1=B (mucina extracelular en lagos) es inconsistente con patrón lepídico puro (A1=A, A4=A)."
        )

    # Sin invasión + arquitectura alveolar no reconocible
    if answers.get("E2") == "A" and answers.get("A4") == "D":
        issues.append(
            "E2=A (sin invasión) pero A4=D (arquitectura alveolar no reconocible) es sospechoso: "
            "si no hay arquitectura alveolar visible, la ausencia de invasión es difícil de afirmar."
        )

    # Sólido puro + glándulas bien formadas
    if answers.get("A1") == "E" and answers.get("A3") in ("A", "B"):
        issues.append(
            "A1=E (patrón sólido) contradice A3∈{A,B} (glándulas identificables): "
            "el patrón sólido implica ausencia de formación glandular."
        )

    # Papilar verdadero + sin eje fibrovascular
    if answers.get("A1") == "C" and answers.get("A2") == "B":
        issues.append(
            "A1=C (proyecciones papilares verdaderas) contradice A2=B (sin eje fibrovascular): "
            "las papilas verdaderas requieren eje fibrovascular. Considerar micropapilar."
        )

    # Lepídico puro + invasión franca
    if answers.get("A1") == "A" and answers.get("E2") == "C":
        issues.append(
            "A1=A (patrón lepídico) con E2=C (invasión franca): "
            "si hay invasión franca, el componente lepídico coexiste con invasión. "
            "Considerar adenocarcinoma con componente lepídico más invasión."
        )

    # Subtipo especial explícito vs. CE2=E (sin subtipo especial)
    special_ce2 = answers.get("CE2") in ("A", "B", "C", "D")
    if special_ce2:
        ce2_label = {"A": "mucinoso", "B": "coloide", "C": "fetal", "D": "entérico"}.get(
            answers.get("CE2", ""), ""
        )
        # A1 debería ser congruente
        incompatible = {
            "A": {"A1_expected": "F"},
            "B": {"A1_expected": "G"},
            "C": {"A1_expected": "H"},
            "D": {"A1_expected": "I"},
        }
        expected_a1 = incompatible.get(answers.get("CE2", ""), {}).get("A1_expected", "")
        if expected_a1 and answers.get("A1") not in (expected_a1, "J", "K"):
            issues.append(
                f"CE2 indica subtipo {ce2_label}, pero A1 no corresponde al patrón esperado ({expected_a1}). "
                "Verifique la coherencia entre ambas respuestas."
            )

    return issues


# ─── Cálculo de confianza ─────────────────────────────────────────────────────

_INDETERMINATE_OPTIONS = {
    "A1": "K",
    "E1": "F",
    "E1_alt": "G",
    "E2": "E",
    "E2_alt": "F",
    "E3": "G",
}


def _count_indeterminate(answers: Answers) -> int:
    indeterminate_count = 0
    if answers.get("A1") == "K":
        indeterminate_count += 1
    if answers.get("E1") in ("F", "G"):
        indeterminate_count += 1
    if answers.get("E2") in ("E", "F"):
        indeterminate_count += 1
    if answers.get("E3") == "G":
        indeterminate_count += 1
    return indeterminate_count


def calculate_confidence_special(
    answers: Answers, special: str, contradictions: list[str]
) -> ConfidenceLevel:
    indeterminate = _count_indeterminate(answers)
    if indeterminate >= 3:
        return "indeterminado"
    if contradictions:
        return "bajo"
    # Verificar qué tan bien sustentado está el subtipo especial
    if special == "Adenocarcinoma mucinoso invasivo":
        strong = answers.get("A1") == "F" or (
            answers.get("C1") == "B" and answers.get("C5") == "C"
        )
        return "alto" if strong else "moderado"
    if special == "Adenocarcinoma coloide":
        strong = answers.get("A1") == "G" and answers.get("CE1") == "B"
        return "alto" if strong else "moderado"
    if special == "Adenocarcinoma fetal":
        strong = answers.get("A1") == "H" or answers.get("CE2") == "C"
        return "alto" if strong else "moderado"
    if special == "Adenocarcinoma entérico":
        strong = answers.get("A1") == "I" and answers.get("C4") == "E"
        return "alto" if strong else "moderado"
    return "moderado"


def calculate_confidence_conventional(
    answers: Answers, main_pattern: str, contradictions: list[str]
) -> ConfidenceLevel:
    indeterminate = _count_indeterminate(answers)
    if indeterminate >= 3:
        return "indeterminado"
    if main_pattern == "Patrón no determinado":
        return "indeterminado"
    if contradictions:
        return "bajo"
    if answers.get("A1") == "J" or answers.get("CE3") in ("B", "C", "D"):
        return "moderado"
    return "alto"


# ─── Extracción de hallazgos narrativos ──────────────────────────────────────

def extract_architectural_findings(answers: Answers) -> list[str]:
    findings = []
    a1_map = {
        "A": "Revestimiento lepídico de septos alveolares preservados",
        "B": "Glándulas o acinos bien formados con lumen reconocible",
        "C": "Proyecciones papilares verdaderas con eje fibrovascular",
        "D": "Penachos micropapilares sin eje fibrovascular",
        "E": "Crecimiento sólido sin formación glandular",
        "F": "Patrón glandular/lepídico con células mucinosas",
        "G": "Lagos de mucina extracelular con células tumorales flotantes",
        "H": "Glándulas complejas de aspecto fetal",
        "I": "Glándulas con morfología intestinal",
        "J": "Patrón arquitectónico mixto",
        "K": "Patrón arquitectónico no valorable",
    }
    if a1 := answers.get("A1"):
        if label := a1_map.get(a1):
            findings.append(label)

    a2_map = {
        "A": "Eje fibrovascular central evidente en estructuras papilares",
        "B": "Estructuras papilares sin eje fibrovascular (micropapilar)",
        "C": "Proyecciones papilares con eje fibrovascular incierto",
        "D": "Pseudopapilas por retracción artefactual",
    }
    if a2 := answers.get("A2"):
        if label := a2_map.get(a2):
            findings.append(label)

    a4_map = {
        "A": "Células recubriendo septos alveolares preservados",
        "B": "Destrucción e infiltración de la arquitectura alveolar",
        "C": "Combinación de revestimiento alveolar e invasión",
        "D": "Arquitectura alveolar no reconocible",
    }
    if a4 := answers.get("A4"):
        if label := a4_map.get(a4):
            findings.append(label)

    return findings


def extract_cytological_findings(answers: Answers) -> list[str]:
    findings = []
    c1_map = {
        "A": "Células cúbicas o columnares no mucinosas",
        "B": "Células columnares/caliciformes con mucina intracitoplasmática abundante",
        "C": "Células con citoplasma claro o pálido",
        "D": "Células con rasgos intestinales/entéricos",
        "E": "Células muy pleomórficas sin rasgos específicos",
        "F": "Población celular mixta",
    }
    if c1 := answers.get("C1"):
        if label := c1_map.get(c1):
            findings.append(label)

    c2_map = {
        "A": "Diferenciación morfológica bien conservada",
        "B": "Diferenciación moderada",
        "C": "Diferenciación pobre",
        "D": "Morfología indiferenciada",
    }
    if c2 := answers.get("C2"):
        if label := c2_map.get(c2):
            findings.append(label)

    c3_map = {
        "A": "Pleomorfismo nuclear leve",
        "B": "Pleomorfismo nuclear moderado",
        "C": "Pleomorfismo nuclear marcado",
        "D": "Pleomorfismo nuclear variable",
    }
    if c3 := answers.get("C3"):
        if label := c3_map.get(c3):
            findings.append(label)

    c4_map = {
        "A": "Núcleos redondos u ovales con cromatina fina",
        "B": "Núcleos agrandados con nucléolos visibles",
        "C": "Núcleos hipercromáticos e irregulares",
        "D": "Núcleos desplazados por mucina",
        "E": "Núcleos pseudoestratificados tipo intestinal",
        "F": "Núcleos claros o vesiculosos",
    }
    if c4 := answers.get("C4"):
        if label := c4_map.get(c4):
            findings.append(label)

    return findings


def extract_stromal_findings(answers: Answers) -> list[str]:
    findings = []
    e1_map = {
        "A": "Estroma escaso con mínima reacción",
        "B": "Estroma fibroelástico o desmoplásico",
        "C": "Estroma mixoide",
        "D": "Estroma con colágeno denso",
        "E": "Estroma desplazado por mucina extracelular abundante",
    }
    if e1 := answers.get("E1"):
        if label := e1_map.get(e1):
            findings.append(label)

    e2_map = {
        "A": "Sin evidencia de invasión estromal",
        "B": "Invasión estromal focal o mínima",
        "C": "Invasión estromal franca",
        "D": "Invasión estromal sospechosa pero no concluyente",
    }
    if e2 := answers.get("E2"):
        if label := e2_map.get(e2):
            findings.append(label)

    e4_map = {
        "B": "Necrosis tumoral focal",
        "C": "Necrosis tumoral extensa",
    }
    if e4 := answers.get("E4"):
        if label := e4_map.get(e4):
            findings.append(label)

    e5_map = {
        "B": "Penachos micropapilares en espacios aéreos (STAS)",
        "C": "Nidos sólidos en espacios aéreos (STAS)",
        "D": "Células discohesivas en espacios aéreos (STAS)",
    }
    if e5 := answers.get("E5"):
        if label := e5_map.get(e5):
            findings.append(label)

    return findings


def extract_special_features(answers: Answers) -> list[str]:
    features = []
    ce1_map = {
        "A": "Mucina intracitoplasmática abundante",
        "B": "Mucina extracelular en lagos",
        "C": "Morulas presentes",
        "D": "Morfología intestinal o entérica",
        "E": "Citoplasma claro con patrón fetal",
    }
    if ce1 := answers.get("CE1"):
        if label := ce1_map.get(ce1):
            features.append(label)
    return features


# ─── Diferenciales ───────────────────────────────────────────────────────────

_DIFFERENTIALS_MAP: dict[str, list[str]] = {
    "Adenocarcinoma mucinoso invasivo": [
        "Adenocarcinoma coloide",
        "Adenocarcinoma acinar con producción de mucina",
        "Metástasis de adenocarcinoma mucinoso de origen GI",
    ],
    "Adenocarcinoma coloide": [
        "Adenocarcinoma mucinoso invasivo",
        "Metástasis de carcinoma mucinoso (colon, mama, ovario)",
    ],
    "Adenocarcinoma fetal": [
        "Blastoma pleuropulmonar",
        "Carcinosarcoma",
        "Adenocarcinoma acinar de alto grado",
    ],
    "Adenocarcinoma entérico": [
        "Metástasis de adenocarcinoma colorrectal",
        "Adenocarcinoma acinar",
        "Tumor carcinoide con diferenciación glandular",
    ],
    "Adenocarcinoma con patrón lepídico": [
        "Hiperplasia adenomatosa atípica",
        "Adenocarcinoma in situ",
        "Adenocarcinoma mínimamente invasivo",
        "Adenocarcinoma lepídico con invasión focal",
    ],
    "Adenocarcinoma con patrón acinar": [
        "Adenocarcinoma papilar",
        "Carcinoide atípico glandular",
        "Metástasis de adenocarcinoma",
    ],
    "Adenocarcinoma con patrón papilar": [
        "Adenocarcinoma micropapilar",
        "Tumor carcinoide papilar",
        "Mesotelioma papilar",
    ],
    "Adenocarcinoma con patrón micropapilar": [
        "Adenocarcinoma papilar",
        "Carcinoma seroso de alto grado (metástasis)",
        "Adenocarcinoma acinar con papilas secundarias",
    ],
    "Adenocarcinoma con patrón sólido": [
        "Carcinoma de células grandes",
        "Carcinoma escamoso pobremente diferenciado",
        "Carcinoma neuroendocrino de células grandes",
        "Metástasis de carcinoma indiferenciado",
    ],
}


def get_differentials(main_pattern: str, _answers: Answers) -> list[str]:
    # Match by prefix if needed
    for key, diffs in _DIFFERENTIALS_MAP.items():
        if main_pattern.startswith(key) or key in main_pattern:
            return diffs
    return []


# ─── Narrativa ────────────────────────────────────────────────────────────────

def build_narrative(main_pattern: str, answers: Answers, contradictions: list[str]) -> str:
    parts = []

    # Hallazgo arquitectónico principal
    a1_narr = {
        "A": "El hallazgo arquitectónico dominante es el revestimiento lepídico de septos alveolares preservados",
        "B": "Se identifican glándulas o acinos bien formados como patrón predominante",
        "C": "Predominan proyecciones papilares con eje fibrovascular central",
        "D": "El patrón consiste en pequeños penachos o grupos celulares sin eje fibrovascular en espacios alveolares",
        "E": "El tumor crece en láminas sólidas sin formación glandular reconocible",
        "F": "El patrón predominante muestra células mucinosas con abundante mucina intracitoplasmática",
        "G": "Se observan grandes lagos de mucina extracelular con células tumorales flotantes",
        "H": "Las glándulas tienen morfología compleja de aspecto fetal o embrionario",
        "I": "Las glándulas muestran morfología intestinal o entérica",
        "J": "El patrón arquitectónico es mixto, sin un componente único predominante",
    }
    if narr := a1_narr.get(answers.get("A1", "")):
        parts.append(narr + ".")

    # Diferenciación
    c2_narr = {
        "A": "La diferenciación morfológica es bien conservada",
        "B": "El grado de diferenciación es moderado",
        "C": "La diferenciación es pobre",
        "D": "El tumor es indiferenciado morfológicamente",
    }
    if narr := c2_narr.get(answers.get("C2", "")):
        parts.append(narr + ".")

    # Invasión
    e2_narr = {
        "A": "No se evidencia invasión estromal en esta imagen",
        "B": "Existe invasión estromal focal o mínima",
        "C": "La invasión estromal es franca",
    }
    if narr := e2_narr.get(answers.get("E2", "")):
        parts.append(narr + ".")

    # Conclusión
    parts.append(
        f"Con base en el conjunto de hallazgos evaluados, el patrón más compatible es: {main_pattern}."
    )

    if contradictions:
        parts.append(
            "Se detectaron inconsistencias entre algunas respuestas que reducen la certeza del resultado."
        )

    return " ".join(parts)


# ─── Advertencias ────────────────────────────────────────────────────────────

_STANDARD_WARNING = (
    "La clasificación corresponde al patrón observado en esta imagen. "
    "El subtipo predominante del tumor completo puede requerir evaluación de toda la lámina o de la resección."
)

_ACADEMIC_WARNING = (
    "Este resultado es de uso académico e investigativo. "
    "No sustituye el juicio del patólogo ni la evaluación morfológica completa del caso."
)


def build_warnings(answers: Answers, secondary_patterns: list[str]) -> list[str]:
    warnings = [_STANDARD_WARNING, _ACADEMIC_WARNING]

    if answers.get("CE3") in ("B", "C"):
        warnings.append(
            "El tumor presenta patrón mixto. La OMS recomienda documentar el porcentaje de cada patrón "
            "en la resección para determinar el subtipo predominante definitivo."
        )

    if answers.get("E5") in ("B", "C", "D"):
        warnings.append(
            "Se identifican hallazgos compatibles con diseminación tumoral por espacios aéreos (STAS), "
            "factor pronóstico adverso reconocido por la OMS."
        )

    if answers.get("A1") in ("D", "E") or answers.get("C2") in ("C", "D"):
        warnings.append(
            "El patrón micropapilar y el sólido son reconocidos por la OMS entre los de peor pronóstico "
            "en adenocarcinoma invasivo no mucinoso."
        )

    return warnings


# ─── Sugerencia de hallazgo faltante ─────────────────────────────────────────

def suggest_missing_findings(answers: Answers, main_pattern: str) -> str | None:
    """
    Si el resultado es incierto o hay respuestas indeterminadas clave,
    sugiere qué hallazgo adicional ayudaría a confirmar el diagnóstico.
    """
    if "lepídico" in main_pattern and answers.get("E2") in ("D", "E", "F"):
        return (
            "Para confirmar patrón lepídico sin invasión, sería útil evaluar el borde tumoral "
            "y la integridad de la membrana basal alveolar."
        )
    if "papilar" in main_pattern and answers.get("A2") not in ("A",):
        return (
            "Para clasificar como papilar verdadero, confirme la presencia de eje fibrovascular central "
            "en las proyecciones papilares (A2=A)."
        )
    if "sólido" in main_pattern:
        return (
            "El diagnóstico de adenocarcinoma sólido requiere confirmación de diferenciación adenocarcinomatosa "
            "(morfológica, histoquímica o inmunohistoquímica) en el contexto clínico completo."
        )
    if "mucinoso" in main_pattern and answers.get("C1") != "B":
        return (
            "Para confirmar adenocarcinoma mucinoso invasivo, verifique que las células tumorales sean "
            "predominantemente columnares o caliciformes con mucina intracitoplasmática abundante (C1=B)."
        )
    return None
