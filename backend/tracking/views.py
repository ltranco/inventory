import json, os
from django.http import JsonResponse
import logging
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests


logger = logging.getLogger(__name__)
storage_file = os.path.join(os.path.dirname(__file__), '..', 'storage.json')
storage_file = os.path.abspath(storage_file)



def parse_json_request(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return {}




@method_decorator(csrf_exempt, name="dispatch")
class ItemsView(View):
    def get(self, request, *args, **kwargs):
        if not os.path.exists(storage_file):
            return JsonResponse([])
        with open(storage_file, 'r') as f:
            data = json.load(f)
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        if not os.path.exists(storage_file):
            return JsonResponse([])
        
        payload = parse_json_request(request)
        logger.info(payload)
        with open(storage_file, 'r') as f:
            existing_items = json.load(f)
        existing_ids = set([item['id'] for item in existing_items])
        if payload['id'] in existing_ids:
            return JsonResponse({'error': 'ID already exists'}, status=requests.codes.bad_request)
        
        existing_items.append(payload)
        with open(storage_file, 'w') as f:
            json.dump(existing_items, f)
        return JsonResponse({'results': existing_items})
    
    def patch(self, request, *args, **kwargs):
        if not os.path.exists(storage_file):
            return JsonResponse([])
        
        payload = parse_json_request(request)
        logger.info(payload)
        with open(storage_file, 'r') as f:
            existing_items = json.load(f)

        incoming_id = payload.get('id')
        if incoming_id is None or not any(item['id'] == incoming_id for item in existing_items):
            return JsonResponse({'error': 'ID does not exist'}, status=requests.codes.bad_request)
        

        for item in existing_items:
            if item['id'] == payload['id']:
                item.update(payload)

        with open(storage_file, 'w') as f:
            json.dump(existing_items, f)
        return JsonResponse({'results': existing_items})
        
    def delete(self, request, *args, **kwargs):
        if not os.path.exists(storage_file):
            return JsonResponse([])
        
        payload = parse_json_request(request)
        logger.info(payload)
        with open(storage_file, 'r') as f:
            existing_items = json.load(f)
        
        incoming_id = payload.get('id')
        if incoming_id is None or not any(item['id'] == incoming_id for item in existing_items):
            return JsonResponse({'error': 'ID does not exist'}, status=requests.codes.bad_request)
        
        for item in existing_items:
            if item['id'] == payload['id']:
                existing_items.remove(item)

        with open(storage_file, 'w') as f:
            json.dump(existing_items, f)
            return JsonResponse({'results': existing_items})




    



#TODO: add delete method

