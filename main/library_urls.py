from django.urls import path
from . import views

urlpatterns = [
    path('dashboard', views.library_dashboard, name='library_dashboard'),
    path('books', views.books_page, name='books_page'),
    path('members', views.members_page, name='members_page'),
    path('loans', views.loans_page, name='loans_page'),
]