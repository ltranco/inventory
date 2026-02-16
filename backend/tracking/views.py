# after moving all the frontend/backend traffic to views
import json
import os
import logging
from django.http import HttpResponseBadRequest
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Item

logger = logging.getLogger(__name__)


def parse_json_request(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return {}



@method_decorator(csrf_exempt, name="dispatch")
class ItemsView(View):
    def get(self, request, *args, **kwargs):
        items = Item.objects.all().values("id", "name", "count")
        return JsonResponse(list(items), safe=False)

    def post(self, request, *args, **kwargs):
        payload = parse_json_request(request)
        name = payload.get("name", "").strip()
        
        if not name:
            return JsonResponse(
                {"error": "Name is required"},
                status=400,
            )

        if Item.objects.filter(name__iexact=name).exists(): # __iexact is just a case insensitive checker
            return JsonResponse(
                {"error": "Item with this name already exists"},
                status=400,
            )
        
        item = Item.objects.create(name=name) # the ORM call, defaults the id and count

        item.save() # save the item to the database

        return JsonResponse({ # manually building json
            "id": item.id,
            "name": item.name,
            "count": item.count,
        }, status=200)


    def patch(self, request, *args, **kwargs):
        payload = parse_json_request(request)
        item_id = payload.get("id")
        new_count = payload.get("count")

        if (item_id is None or not isinstance(new_count, int) or new_count < 0):
            return JsonResponse(
                {"error": "Invalid ID or count"},
                status=400,
            )
        
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return JsonResponse(
                {"error": "ID does not exist"},
                status=400
            )

        item.count = new_count
        item.save()

        return JsonResponse(
        {
            "id": item.id,
            "name": item.name,
            "count": item.count,
        })




    def delete(self, request, *args, **kwargs):
        payload = parse_json_request(request)
        item_id = payload.get("id")

        if item_id is None:
            return JsonResponse(
                {"error": "ID is required"},
                status=400,
            )

        try: 
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return JsonResponse(
                {"error": "ID does not exist"},
                status=400,
            )

        item.delete()
        

        return JsonResponse({"Deleted": True})
    

# plan to rewrite views.py without rest framework

# understand the connection without rest framework one step at a time
# understand how the backend works with js without the json
# slowly implement views.py without rest framework

# figure out a way to test it as well (w/o rest framework)
# answer: had to fix the urls.py to not use the rest framework.

# write down questions to ask chu long and any problems that faced and dont understand why
# i did instance, A happened when i thought B would happen but i dont understand why



#Questions:
# I deleted an object with .delete() and it immediately disappeared, 
# but I thought I needed to call .save() afterward. 
# Can you explain why i didnt need it but did before?

# I’m still parsing request.body into a payload even though I’m using the ORM, 
# and I thought the ORM would handle request data for me. 
# So is the json parsing just a way of communicating from the frontend requests to the backend?









# learn about query parameters and pagination

# working on serializations this week
# same functionality, use DRF serialization and deseralization
# get chat gpt to summarize article chu long sent, and tell it to explain the high level concepts that are important and needed
# interact with it to understand said concepts and how to implement them
# Understand the modelseralizer the most

# implement more git commits to see history

