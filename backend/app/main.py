from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import url_analyzer

app = FastAPI(title="PhishGuard AI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(url_analyzer.router, prefix="/api", tags=["URL Analysis"])

@app.get("/")
async def root():
    return {"message": "PhishGuard AI API is running"}
