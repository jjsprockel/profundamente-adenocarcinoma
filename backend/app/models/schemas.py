from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel


# ─── Image ───────────────────────────────────────────────────────────────────

class ImageUploadResponse(BaseModel):
    session_id: str
    image_url: str


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


class PdfRequest(BaseModel):
    result: DiagnosisResult
    image_filename: Optional[str] = None
