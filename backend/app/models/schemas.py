from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel


# ─── Image ───────────────────────────────────────────────────────────────────

ImageKind = Literal["dzi", "simple"]


class ImageUploadResponse(BaseModel):
    session_id: str
    kind: ImageKind
    # "simple": image servible directamente (JPEG/PNG/SVG/TIFF plano/DICOM convertido)
    image_url: str
    # "dzi": descriptor Deep Zoom para diapositivas piramidales grandes (SVS/NDPI/TIFF piramidal)
    dzi_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None


# ─── Diagnosis ────────────────────────────────────────────────────────────────

ConfidenceLevel = Literal["alto", "moderado", "bajo", "indeterminado"]


class DiagnosisRequest(BaseModel):
    session_id: str
    # Keys are question IDs (e.g. "A1"), values are option letters (e.g. "B")
    answers: dict[str, str]


class DiagnosisResult(BaseModel):
    main_pattern: str
    secondary_patterns: list[str]
    architectural_findings: list[str]
    cytological_findings: list[str]
    stromal_findings: list[str]
    special_features: list[str]
    differentials: list[str]
    confidence: ConfidenceLevel
    narrative: str
    warnings: list[str]
    contradictions: list[str]
    missing_findings_hint: Optional[str]


class AnsweredQuestion(BaseModel):
    """Una respuesta del cuestionario, enriquecida con el texto de la
    pregunta y de la opción elegida (no solo IDs/letras), tal como la arma el
    frontend a partir de SECTIONS + AnswerMap. Solo se usa para listar las
    respuestas de la sesión al final del reporte — el backend no mantiene una
    copia propia del contenido del cuestionario."""

    section_label: str
    question_id: str
    question_text: str
    selected_letter: str
    selected_text: str


class PdfRequest(BaseModel):
    result: DiagnosisResult
    image_filename: Optional[str] = None
    # Impresión diagnóstica inicial (gestalt) capturada antes del cuestionario
    # estructurado. No participa del motor de reglas — solo se incluye en el
    # reporte para comparar contra el resultado sistemático.
    initial_impression: Optional[str] = None
    # Respuestas dadas durante la sesión, listadas al final del reporte.
    answers: list[AnsweredQuestion] = []
