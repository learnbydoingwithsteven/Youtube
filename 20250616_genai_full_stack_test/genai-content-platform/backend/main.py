from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import time
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("genai-content-app")

# Create FastAPI app
app = FastAPI(
    title="GenAI Content Platform",
    description="A platform for generating and managing AI-powered content",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request/response models
class ContentGenerationRequest(BaseModel):
    prompt: str
    topic: Optional[str] = None
    tone: Optional[str] = None
    max_length: Optional[int] = 500
    temperature: Optional[float] = 0.7
    use_rag: Optional[bool] = False
    context_docs: Optional[List[str]] = None

class ContentResponse(BaseModel):
    content: str
    metadata: Dict[str, Any]
    created_at: datetime

# Middleware for request timing
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Request processed in {process_time:.4f} seconds")
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# API version endpoint
@app.get("/api/version")
async def api_version():
    return {"version": app.version}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the GenAI Content Platform API",
        "docs_url": "/docs",
        "version": app.version,
    }

# Import and include API routers
# We'll implement these in separate files
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
