# from django.shortcuts import render, redirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

def login_view(request):
	return render(request, 'login.html')

@login_required(login_url='/login')
def dashboard_view(request):
	return render(request, 'dashboard.html')
from django.shortcuts import render

# Create your views here.
