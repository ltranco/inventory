from django.http import JsonResponse

def items(request):
    data = {
        "items": [
            {"id": 1, "name": "Laptop"},
            {"id": 2, "name": "Phone"},
            {"id": 3, "name": "Headphones"},
            {"id": 4, "name": "Airpods"},
            {"id": 5, "name": "Fridge"},
        ]
    }
    return JsonResponse(data)