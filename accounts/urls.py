# accounts/urls.py
from django.urls import path

from .views import *

urlpatterns = [
    path('signup/', SignUp.as_view(), name='signup'),
    path('perfil/', perfil, name='perfil'),
    path('usuario_lista/', AccountListView.as_view(), name='usuario_lista'),
    path('usuario_agregar/', AccountCreateView.as_view(), name='usuario_agregar'),
    path('usuario_editar/<int:pk>', AccountUpdateView.as_view(), name="usuario_editar"),
    path('usuario_eliminar/<int:pk>', AccountDeleteView.as_view(), name="usuario_eliminar"),

]