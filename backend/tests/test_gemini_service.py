from backend.services.gemini_service import GeminiService, GeminiServiceError


def test_parse_json_text_accepts_strict_json():
    service = GeminiService(api_key="test-key")
    payload = service.parse_json_text('{"breakfast": [], "completion_message": ""}')
    assert payload["breakfast"] == []


def test_parse_json_text_extracts_embedded_json():
    service = GeminiService(api_key="test-key")
    payload = service.parse_json_text('noise {"breakfast": [], "completion_message": ""} trailing')
    assert payload["completion_message"] == ""


def test_parse_json_text_rejects_malformed_payload():
    service = GeminiService(api_key="test-key")
    try:
        service.parse_json_text("not-json-at-all")
    except GeminiServiceError as exc:
        assert "malformed JSON" in str(exc)
    else:
        raise AssertionError("Expected GeminiServiceError for malformed payload")
