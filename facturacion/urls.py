from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from .views import *

urlpatterns = [
    path('factura_lista/', FacturaListView.as_view(), name="factura_lista"),
    path('factura/', FacturaCreateView.as_view(), name="factura"),
    # path('servicios_registro/', ServicioCreateView.as_view(), name="servicios_registro"),
    # path('servicios_modificacion/<int:pk>', ServicioUpdateView.as_view(), name="servicios_modificacion"),
    path('factura_eliminaicon/<int:pk>', FacturaDeleteView.as_view(), name="factura_eliminaicon"),
    path('factura_impresion/<int:pk>', FacturaImpresionListView.as_view(), name="factura_impresion"),
]
