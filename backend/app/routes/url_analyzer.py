from fastapi import APIRouter, HTTPException
from ..models.schemas import URLAnalysisRequest, URLAnalysisResponse
from ..services import url_service
import validators

router = APIRouter()

@router.post("/analyze-url", response_model=URLAnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    url = request.url.strip()

    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    if not validators.url(url):
        raise HTTPException(status_code=400, detail="Invalid or malformed URL. Please include the protocol (e.g., https://)")

    try:
        result = await url_service.analyze_url_heuristics(url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")
