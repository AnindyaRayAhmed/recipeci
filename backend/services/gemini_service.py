import json
import logging
from json import JSONDecodeError
from typing import Any

from pydantic import BaseModel

from backend.core.config import get_settings


logger = logging.getLogger(__name__)


class GeminiServiceError(RuntimeError):
    """Raised when Gemini generation or parsing fails."""


class GeminiService:
    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.gemini_api_key
        self.model = model if model is not None else settings.gemini_model

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def generate_structured_json(
        self,
        *,
        system_instruction: str,
        user_prompt: str,
        response_schema: type[BaseModel],
    ) -> dict[str, Any]:
        if not self.is_configured():
            raise GeminiServiceError("Gemini API key is not configured.")

        client = self._build_client()

        try:
            response = client.models.generate_content(
                model=self.model,
                contents=user_prompt,
                config=self._build_generation_config(system_instruction, response_schema),
            )
        except Exception as exc:
            logger.exception("Gemini request failed.")
            raise GeminiServiceError("Gemini request failed.") from exc

        parsed = getattr(response, "parsed", None)
        if isinstance(parsed, BaseModel):
            return parsed.model_dump()
        if isinstance(parsed, dict):
            return parsed

        return self.parse_json_text(self._extract_response_text(response))

    def parse_json_text(self, payload: str) -> dict[str, Any]:
        normalized = payload.strip()
        if not normalized:
            raise GeminiServiceError("Gemini returned an empty response.")

        try:
            parsed = json.loads(normalized)
        except JSONDecodeError:
            extracted = self._extract_json_object(normalized)
            if extracted is None:
                raise GeminiServiceError("Gemini returned malformed JSON.") from None
            try:
                parsed = json.loads(extracted)
            except JSONDecodeError as exc:
                raise GeminiServiceError("Gemini returned malformed JSON.") from exc

        if not isinstance(parsed, dict):
            raise GeminiServiceError("Gemini returned an unexpected payload shape.")

        return parsed

    def _build_client(self) -> Any:
        try:
            from google import genai
        except ImportError as exc:
            raise GeminiServiceError("Gemini SDK is not installed.") from exc

        return genai.Client(api_key=self.api_key)

    def _build_generation_config(self, system_instruction: str, response_schema: type[BaseModel]) -> Any:
        try:
            from google.genai import types
        except ImportError as exc:
            raise GeminiServiceError("Gemini SDK is not installed.") from exc

        return types.GenerateContentConfig(
            temperature=0.4,
            response_mime_type="application/json",
            response_schema=response_schema,
            system_instruction=system_instruction,
        )

    def _extract_response_text(self, response: Any) -> str:
        text = getattr(response, "text", "")
        if text:
            return text

        candidates = []
        for candidate in getattr(response, "candidates", []) or []:
            content = getattr(candidate, "content", None)
            if content is None:
                continue
            for part in getattr(content, "parts", []) or []:
                part_text = getattr(part, "text", "")
                if part_text:
                    candidates.append(part_text)

        return "".join(candidates)

    def _extract_json_object(self, payload: str) -> str | None:
        start = payload.find("{")
        end = payload.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None
        return payload[start : end + 1]
