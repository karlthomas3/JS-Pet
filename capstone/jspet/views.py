from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db import IntegrityError
from django.http import JsonResponse
import json


from .models import User, Pet


# Create your views here.
def index(request):
    user = request.user
    pet = None
    if user.is_authenticated:
        try:
            pet = Pet.objects.get(user=request.user)
        except Pet.DoesNotExist:
            pass
        return render(request, "jspet/profile.html", {
            "pet": pet,
        })
    else:
        return render(request, "jspet/index.html")


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # if it works
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "jspet/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "jspet/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # check password matches
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "jspet/register.html", {"message": "Passwords must match."}
            )

        # try to make new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request, "jspet/register.html", {"message": "Username already taken."}
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "jspet/register.html")

@login_required
def create_pet(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    user = request.user
    pet = Pet(
        user=user,
        name=request.POST['new-pet-name'].capitalize(),
    )
    pet.save()

    return HttpResponseRedirect(reverse("index"))

@login_required
def pet_data(request):
    user = request.user

    # PUSH ROUTE
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            pet = Pet.objects.get(user=user)
            pet.thirst = data['thirst']
            pet.happiness = data['happiness']
            pet.hunger = data['hunger']
            pet.last_save = data['now']
            pet.save()

            return JsonResponse({
                "message": ("Save successful")
            },
            safe=False)
        
        except Pet.DoesNotExist:
            return JsonResponse({
                "error": "Pet not found"
            }, status=404)


    # GET ROUTE
    try:
        pet = Pet.objects.get(user=user).serialize()
    except Pet.DoesNotExist:
        pet = Pet(
        user=user,
        name='NOBODY',
        ).serialize()
    return JsonResponse({
        "pet": pet,
    },
    safe=False)