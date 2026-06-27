from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="ReciPeci")
    app_env: str = Field(default="development")
    app_debug: bool = Field(default=False)
    api_v1_prefix: str = Field(default="/api/v1")
    backend_cors_origins: str = Field(default="http://localhost:5173")
    gemini_api_key: str | None = Field(default=None)
    gemini_model: str = Field(default="gemini-2.5-flash")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8080)

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
