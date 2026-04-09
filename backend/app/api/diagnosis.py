from fastapi import APIRouter, HTTPException
from app.models.schemas import DiagnosisRequest, DiagnosisResult
from app.core import rules_engine

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])

# All question IDs from the instrument
_EXPECTED_QUESTION_IDS = {
    "A1", "A2", "A3", "A4", "A5",
    "C1", "C2", "C3", "C4", "C5",
    "E1", "E2", "E3", "E4", "E5",
    "CE1", "CE2", "CE3",
}


@router.post("/evaluate", response_model=DiagnosisResult)
async def evaluate(request: DiagnosisRequest) -> DiagnosisResult:
    missing = _EXPECTED_QUESTION_IDS - set(request.answers.keys())
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Faltan respuestas para: {sorted(missing)}",
        )

    return rules_engine.evaluate(request.answers)
