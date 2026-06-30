from rest_framework.response import Response
from rest_framework import status

def api_response(success=True, message="", data=None, errors=None, status_code=status.HTTP_200_OK):
    """
    Isang malinis at standardized JSON structure para sa buong application.
    """
    response_payload = {
        "success": success,
        "message": message,
        "data": data if data is not null else {},
        "errors": errors if errors is not null else {}
    }
    return Response(response_payload, status=status_code)