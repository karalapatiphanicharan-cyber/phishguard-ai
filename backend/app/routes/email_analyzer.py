from fastapi import APIRouter, HTTPException
from ..models.schemas import EmailAnalysisRequest, EmailAnalysisResponse
from ..services import email_service

router = APIRouter()

@router.post("/analyze-email", response_model=EmailAnalysisResponse)
async def analyze_email(request: EmailAnalysisRequest):
    content = request.content.strip()

    if not content or len(content) < 10:
        raise HTTPException(status_code=400, detail="Email content is too short for analysis.")

    try:
        result = await email_service.analyze_email(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")
