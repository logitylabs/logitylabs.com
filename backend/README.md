# 🔧 Logity Backend API

FastAPI-based backend service providing AI-powered automotive log analysis, fault detection, and plain-language explanations.

## 🚀 Quick Start

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## 🛠️ Tech Stack

- **FastAPI**: High-performance web framework for APIs
- **Python 3.9+**: Modern Python with type hints
- **Pydantic**: Data validation and serialization
- **Apache Arrow**: In-memory data processing for large log files
- **PostgreSQL**: Configuration and user data storage
- **FAISS**: Vector database for similarity search
- **OpenAI API**: Large language models for AI analysis
- **Uvicorn**: ASGI server for production deployment

## 📦 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/         # API route handlers
│   │   │   ├── analysis.py    # Log analysis endpoints
│   │   │   ├── upload.py      # File upload handling
│   │   │   └── health.py      # Health check endpoints
│   │   └── dependencies.py    # Dependency injection
│   ├── core/
│   │   ├── config.py          # Application configuration
│   │   ├── security.py        # Authentication & authorization
│   │   └── database.py        # Database connection
│   ├── models/
│   │   ├── analysis.py        # Analysis data models
│   │   ├── user.py           # User data models
│   │   └── log.py            # Log file models
│   ├── services/
│   │   ├── ai_service.py      # AI/LLM integration
│   │   ├── parser_service.py  # Log parsing service
│   │   └── analysis_service.py # Analysis orchestration
│   └── utils/
│       ├── file_handler.py    # File processing utilities
│       └── validators.py      # Data validation helpers
├── tests/                     # Test suite
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── main.py                   # Application entry point
```

## 🔌 API Endpoints

### Health & Status

```http
GET /health              # Health check
GET /status              # System status and metrics
```

### File Upload & Management

```http
POST /upload             # Upload log files
GET /files               # List uploaded files
GET /files/{file_id}     # Get file details
DELETE /files/{file_id}  # Delete file
```

### Log Analysis

```http
POST /analyze            # Start log analysis
GET /analysis/{id}       # Get analysis results
GET /analysis/{id}/report # Get formatted report
POST /analyze/batch      # Batch analysis
```

### AI-Powered Features

```http
POST /ai/explain         # Get plain-language explanation
POST /ai/recommend       # Get fix recommendations
POST /ai/similar         # Find similar issues
```

## 🔧 Development Setup

### 1. Environment Configuration

Create `.env` file from template:

```powershell
Copy-Item .env.example .env
```

Configure environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/logity
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# Security
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB

# Development
DEBUG=True
LOG_LEVEL=INFO
```

### 2. Database Setup

```powershell
# Install PostgreSQL (if not already installed)
# Create database
createdb logity

# Run migrations (when available)
alembic upgrade head
```

### 3. Development Server

```powershell
# Development with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or use the main.py script
python main.py
```

## 📊 Supported Log Formats

### CAN Bus Logs

```python
# Example CAN message processing
{
    "timestamp": "2024-01-15T10:30:00Z",
    "id": "0x123",
    "data": [0x01, 0x02, 0x03, 0x04],
    "dlc": 4,
    "channel": "CAN1"
}
```

### DoIP (Diagnostics over IP)

```python
# Example DoIP message
{
    "timestamp": "2024-01-15T10:30:00Z",
    "source_address": "0x1234",
    "target_address": "0x5678",
    "payload_type": "diagnostic_request",
    "data": "22F190"  # Read DID request
}
```

### DLT (Diagnostic Log and Trace)

```python
# Example DLT message
{
    "timestamp": "2024-01-15T10:30:00Z",
    "app_id": "APP1",
    "context_id": "CTX1",
    "log_level": "INFO",
    "message": "System initialization complete"
}
```

## 🤖 AI Analysis Features

### Fault Detection

```python
POST /analyze
{
    "file_id": "uuid-here",
    "analysis_type": "fault_detection",
    "options": {
        "include_recommendations": true,
        "severity_threshold": "medium",
        "time_range": {
            "start": "2024-01-15T10:00:00Z",
            "end": "2024-01-15T11:00:00Z"
        }
    }
}
```

### Plain-Language Explanations

```python
POST /ai/explain
{
    "fault_code": "P0301",
    "context": {
        "vehicle_make": "BMW",
        "model": "X5",
        "year": 2023,
        "engine": "B58"
    }
}

# Response
{
    "explanation": "Cylinder 1 misfire detected. This typically indicates...",
    "severity": "high",
    "recommended_actions": [
        "Check spark plug condition",
        "Inspect ignition coil",
        "Verify fuel injector operation"
    ]
}
```

## 🔒 Security Features

### Authentication

- JWT token-based authentication
- Role-based access control (RBAC)
- API key authentication for service-to-service calls

### Data Protection

- File upload validation and sanitization
- SQL injection prevention
- Rate limiting on API endpoints
- Secure file storage with access controls

## 📈 Performance Optimization

### Large File Handling

- Streaming file uploads
- Chunked processing for large log files
- Background task processing with Celery
- Caching with Redis

### Database Optimization

- Connection pooling
- Query optimization
- Indexed searches
- Batch operations for bulk data

## 🧪 Testing

```powershell
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_analysis.py

# Run integration tests
pytest tests/integration/
```

### Test Categories

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Authentication and authorization

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Build image
docker build -t logity-backend .

# Run container
docker run -p 8000:8000 logity-backend
```

### Production Configuration

```powershell
# Production server with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# With environment variables
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Environment Variables (Production)

```env
DEBUG=False
LOG_LEVEL=WARNING
DATABASE_URL=postgresql://prod_user:password@db:5432/logity
REDIS_URL=redis://redis:6379
SECRET_KEY=production_secret_key
```

## 📊 Monitoring & Logging

### Application Metrics

- Request/response times
- Error rates and types
- File processing statistics
- AI analysis performance

### Health Checks

```http
GET /health
{
    "status": "healthy",
    "database": "connected",
    "redis": "connected",
    "ai_service": "available",
    "uptime": "2h 30m 15s"
}
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**

```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Test connection
psql -h localhost -U username -d logity
```

**AI Service Errors:**

```powershell
# Check OpenAI API key
echo $env:OPENAI_API_KEY

# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

**File Upload Issues:**

```powershell
# Check upload directory permissions
Get-Acl ./uploads

# Check disk space
Get-WmiObject -Class Win32_LogicalDisk
```

## 🤝 Contributing

1. **Set up development environment** following the setup guide
2. **Create feature branch** from main
3. **Write tests** for new functionality
4. **Follow code style** guidelines (Black, isort, flake8)
5. **Update documentation** for API changes
6. **Submit pull request** with detailed description

### Code Style

```powershell
# Format code
black app/
isort app/

# Lint code
flake8 app/
mypy app/
```

## 📚 Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [Apache Arrow Documentation](https://arrow.apache.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

---

**Part of the Logity monorepo** - See [main README](../README.md) for project overview.
