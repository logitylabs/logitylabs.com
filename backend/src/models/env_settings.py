"""
Environment settings and configuration for the DESD Tool.
This module handles environment variables and sensitive tokens.
"""

from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import validator, Field, PostgresDsn, RedisDsn, HttpUrl
import os

# Get the absolute path to the backend/.env file
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
env_file_path = os.path.join(backend_dir, ".env")

class EnvSettings(BaseSettings):
    """
    Environment settings class that loads configuration from environment variables.
    This handles all environment variables defined in the .env file.
    
    Usage:
        from models.env_settings import env_settings
        
        # Access environment variables
        db_url = env_settings.DATABASE_URL
        jira_token = env_settings.JIRA_API_TOKEN
    """
    
    # API Configuration
    API_PORT: Optional[str] = Field(None, description="API port number")
    DEBUG: Optional[bool] = Field(None, description="Debug mode")
    
    # JIRA Configuration
    JIRA_URL: Optional[HttpUrl] = Field(None, description="JIRA base URL")
    JIRA_USERNAME: Optional[str] = Field(None, description="JIRA username or email")
    JIRA_API_TOKEN: Optional[str] = Field(None, description="JIRA Personal Access Token without 'Bearer' prefix")
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    class Config:
        """Configuration for the environment settings."""
        env_file = env_file_path  # Use the absolute path to the backend/.env file
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in the .env file

# Create a global environment settings instance
env_settings = EnvSettings() 