"""
Generación de PDF con reportlab.
El PDF contiene el resumen diagnóstico completo sin datos personales ni imagen.
"""

from __future__ import annotations
import io
from datetime import datetime
from typing import Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    ListFlowable,
    ListItem,
)
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER

from app.models.schemas import AnsweredQuestion, DiagnosisResult


def generate_pdf(
    result: DiagnosisResult,
    image_filename: Optional[str] = None,
    initial_impression: Optional[str] = None,
    answers: Optional[list[AnsweredQuestion]] = None,
) -> bytes:
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
    )

    styles = _build_styles()
    story = _build_story(
        result,
        styles,
        image_filename=image_filename,
        initial_impression=initial_impression,
        answers=answers,
    )

    doc.build(story)
    return buffer.getvalue()


def _build_styles() -> dict:
    return {
        "brand_name": ParagraphStyle(
            "brand_name",
            fontSize=22,
            leading=26,
            textColor=HexColor("#1a1a2e"),
            fontName="Helvetica-Bold",
            spaceAfter=0,
        ),
        "brand_subtitle": ParagraphStyle(
            "brand_subtitle",
            fontSize=8,
            leading=11,
            textColor=HexColor("#855300"),
            fontName="Helvetica-Bold",
            spaceAfter=2,
            letterSpacing=1.2,
        ),
        "case_label": ParagraphStyle(
            "case_label",
            fontSize=9,
            leading=13,
            textColor=HexColor("#555577"),
            fontName="Courier",
            spaceAfter=0,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontSize=8,
            leading=12,
            textColor=HexColor("#888888"),
            fontName="Courier",
        ),
        "title": ParagraphStyle(
            "title",
            fontSize=18,
            leading=22,
            textColor=HexColor("#1a1a2e"),
            fontName="Helvetica-Bold",
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            fontSize=11,
            leading=14,
            textColor=HexColor("#555577"),
            fontName="Helvetica",
            spaceAfter=2,
        ),
        "section_header": ParagraphStyle(
            "section_header",
            fontSize=9,
            leading=12,
            textColor=HexColor("#855300"),
            fontName="Helvetica-Bold",
            spaceBefore=14,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            fontSize=10,
            leading=15,
            textColor=HexColor("#222222"),
            fontName="Helvetica",
        ),
        "mono": ParagraphStyle(
            "mono",
            fontSize=9,
            leading=13,
            textColor=HexColor("#444466"),
            fontName="Courier",
        ),
        "warning": ParagraphStyle(
            "warning",
            fontSize=9,
            leading=13,
            textColor=HexColor("#7a3b3b"),
            fontName="Helvetica",
            spaceBefore=4,
        ),
        "confidence": ParagraphStyle(
            "confidence",
            fontSize=12,
            leading=16,
            fontName="Helvetica-Bold",
        ),
        "footer": ParagraphStyle(
            "footer",
            fontSize=8,
            textColor=HexColor("#888888"),
            fontName="Helvetica",
            alignment=TA_CENTER,
        ),
        "answer_section": ParagraphStyle(
            "answer_section",
            fontSize=9,
            leading=13,
            textColor=HexColor("#855300"),
            fontName="Helvetica-Bold",
            spaceBefore=10,
            spaceAfter=2,
        ),
        "answer_question": ParagraphStyle(
            "answer_question",
            fontSize=9.5,
            leading=13,
            textColor=HexColor("#222222"),
            fontName="Helvetica-Bold",
            spaceBefore=6,
        ),
        "answer_selected": ParagraphStyle(
            "answer_selected",
            fontSize=9,
            leading=13,
            textColor=HexColor("#444466"),
            fontName="Helvetica",
            leftIndent=10,
        ),
    }


def _confidence_color(level: str) -> str:
    return {
        "alto": "#006633",
        "moderado": "#855300",
        "bajo": "#990000",
        "indeterminado": "#666666",
    }.get(level, "#222222")


def _impression_matches(impression: str, main_pattern: str) -> bool:
    return impression.lower() in main_pattern.lower()


def _build_story(
    result: DiagnosisResult,
    styles: dict,
    image_filename: Optional[str] = None,
    initial_impression: Optional[str] = None,
    answers: Optional[list[AnsweredQuestion]] = None,
) -> list:
    story = []

    # ── Brand header ──────────────────────────────────────────────────────────
    story.append(Paragraph("ProfundaMente", styles["brand_name"]))
    story.append(Paragraph(
        "TUTOR DE PATRONES DE ADENOCARCINOMA DE PULMÓN",
        styles["brand_subtitle"],
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#cccccc")))
    story.append(Spacer(1, 8))

    # ── Case identification ───────────────────────────────────────────────────
    if image_filename:
        story.append(Paragraph(
            f"Caso: {image_filename}",
            styles["case_label"],
        ))
    story.append(Paragraph(
        f"Generado el {datetime.now().strftime('%d/%m/%Y a las %H:%M')} · Uso académico / investigativo",
        styles["meta"],
    ))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#e0e0e0")))
    story.append(Spacer(1, 10))

    # ── Main result ───────────────────────────────────────────────────────────
    story.append(Paragraph("Patrón principal", styles["section_header"]))
    story.append(Paragraph(result.main_pattern, styles["title"]))

    if result.secondary_patterns:
        story.append(Paragraph(
            f"Secundario: {', '.join(result.secondary_patterns)}",
            styles["subtitle"],
        ))

    confidence_color = _confidence_color(result.confidence)
    story.append(Paragraph(
        f'Nivel de confianza: <font color="{confidence_color}"><b>{result.confidence.upper()}</b></font>',
        styles["confidence"],
    ))
    story.append(Spacer(1, 8))

    # ── Initial gestalt impression vs. structured result ─────────────────────
    if initial_impression:
        matches = _impression_matches(initial_impression, result.main_pattern)
        match_color = "#006633" if matches else "#990000"
        match_label = "Coincide" if matches else "Difiere"
        story.append(Paragraph(
            f"Impresión diagnóstica inicial (antes del cuestionario): "
            f"<b>{initial_impression}</b> — "
            f'<font color="{match_color}"><b>{match_label}</b></font> del resultado sistemático',
            styles["mono"],
        ))
        story.append(Spacer(1, 8))

    # ── Narrative ─────────────────────────────────────────────────────────────
    if result.narrative:
        story.append(Paragraph("Razonamiento", styles["section_header"]))
        story.append(Paragraph(result.narrative, styles["body"]))

    # ── Findings ──────────────────────────────────────────────────────────────
    _add_findings_section(story, "Hallazgos arquitectónicos", result.architectural_findings, styles)
    _add_findings_section(story, "Hallazgos citológicos", result.cytological_findings, styles)
    _add_findings_section(story, "Hallazgos estromales y microambientales", result.stromal_findings, styles)
    _add_findings_section(story, "Características especiales", result.special_features, styles)

    # ── Differentials ─────────────────────────────────────────────────────────
    if result.differentials:
        story.append(Paragraph("Diagnósticos diferenciales", styles["section_header"]))
        story.append(Paragraph(", ".join(result.differentials), styles["body"]))

    # ── Contradictions ────────────────────────────────────────────────────────
    if result.contradictions:
        story.append(Paragraph("Contradicciones detectadas", styles["section_header"]))
        for c in result.contradictions:
            story.append(Paragraph(f"⚠ {c}", styles["warning"]))

    # ── Missing findings hint ─────────────────────────────────────────────────
    if result.missing_findings_hint:
        story.append(Paragraph("Hallazgo sugerido para confirmación", styles["section_header"]))
        story.append(Paragraph(result.missing_findings_hint, styles["body"]))

    # ── Warnings ──────────────────────────────────────────────────────────────
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#cccccc")))
    story.append(Spacer(1, 8))
    for w in result.warnings:
        story.append(Paragraph(f"⚠ {w}", styles["warning"]))

    # ── Respuestas del cuestionario (al final del reporte) ────────────────────
    if answers:
        story.append(Spacer(1, 14))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#cccccc")))
        story.append(Spacer(1, 8))
        story.append(Paragraph("Respuestas del cuestionario", styles["section_header"]))

        current_section = None
        for item in answers:
            if item.section_label != current_section:
                current_section = item.section_label
                story.append(Paragraph(current_section.upper(), styles["answer_section"]))
            story.append(Paragraph(
                f"<b>{item.question_id}.</b> {item.question_text}",
                styles["answer_question"],
            ))
            story.append(Paragraph(
                f"→ <b>{item.selected_letter})</b> {item.selected_text}",
                styles["answer_selected"],
            ))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Este documento es de uso exclusivamente académico e investigativo. "
        "No constituye un diagnóstico clínico definitivo y no sustituye la evaluación "
        "histopatológica completa por un patólogo calificado. "
        "ProfundaMente · Fundación Universitaria de Ciencias de la Salud (FUCS)",
        styles["footer"],
    ))

    return story


def _add_findings_section(story: list, title: str, items: list[str], styles: dict) -> None:
    if not items:
        return
    story.append(Paragraph(title, styles["section_header"]))
    list_items = [
        ListItem(Paragraph(item, styles["body"]), bulletColor=HexColor("#855300"))
        for item in items
    ]
    story.append(ListFlowable(list_items, bulletType="bullet", leftIndent=12, spaceBefore=0))
