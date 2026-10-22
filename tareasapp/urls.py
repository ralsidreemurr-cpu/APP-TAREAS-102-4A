from django.urls import path
from . import views


urlpatterns = [
    #RUTA PAGINA DE LOGIN
    path('', views.login_pagina, name= 'login_pagina'),
    #RUTA TAREAS-POST LOGIN EXITOSO
    path('tareas/', views.inicio, name='inicio'),

    path('crear/', views.crear_tarea, name= "crear_tarea"),
    path('detalle/<int:id>/', views.detalle_tarea, name='detalle_tarea'),
    path('editar/<int:id>', views.editar_tarea, name='editar_tarea'), 
    path('eliminar/<int:id>/', views.eliminar_tarea, name='eliminar_tarea'),

    #API REST para autenticacion
    path('api/login/', views.LoginApiView.as_view(), name='login_api'),

    #API GET Listar Tareas

    path('api/tareas/', views.TareasApiView.as_view(), name="api_tareas"),
]


