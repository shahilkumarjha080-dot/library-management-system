# Library management frontend views
from django.contrib.auth.decorators import login_required

@login_required(login_url='/login')
def library_dashboard(request):
	return render(request, 'library/dashboard.html')

@login_required(login_url='/login')
def books_page(request):
	return render(request, 'library/books.html')

@login_required(login_url='/login')
def members_page(request):
	return render(request, 'library/members.html')

@login_required(login_url='/login')
def loans_page(request):
	return render(request, 'library/loans.html')
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
