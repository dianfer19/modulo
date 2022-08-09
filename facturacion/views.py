from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.db.models import Count, Q, Exists
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView,TemplateView
from .forms import *
from accounts.mixins import *
from inventario.models import *
from decimal import Decimal
import json
# Create your views here.


class FacturaListView(LoginRequiredMixin, ValidatePermissionRequiredMixin, ListView):
    permission_required = 'facturacion.view_erp_factura'
    url_redirect = reverse_lazy('home')
    model = erp_factura
    template_name = 'adminConsola/facturacion/factura_lista.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in erp_factura.objects.all().order_by('-fecha_registro'):
                    data.append(i.toJson())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    # def get_queryset(self):
    #     return erp_cliente.objects.all()

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['nuevo'] = reverse_lazy('factura')
        # context['editar'] = reverse_lazy('usuario_editar')
        context['titulo'] = 'Listado de Factura'
        return context


class FacturaCreateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, CreateView):
    permission_required = 'facturacion.add_erp_factura'
    success_url = reverse_lazy('factura_lista')
    form_class = FacturaForm
    url_redirect = reverse_lazy('home')
    model = erp_factura
    template_name = 'adminConsola/facturacion/factura.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        bandera=1
        try:
            action = request.POST['action']
            if action == 'search_products':
                data = []
                prods = erp_producto.objects.filter(Q(nombre__icontains=request.POST['term']) | Q(descripcion__icontains=request.POST['term']))[0:10]
                for i in prods:
                    existe_inventario = erp_inventario.objects.filter(id_producto= i.id).first()
                    if existe_inventario.cantidad_total > 0:
                        item = i.toJson()
                        item['value'] = i.nombre + ' - '+i.descripcion
                        item['inventario'] = existe_inventario.cantidad_total
                        data.append(item)
            elif action == 'search_servicio':
                data = []
                serv = erp_servicio_tecnico.objects.filter(~Exists(erp_factura_detalle.objects.filter(id_servicio_id=request.POST['term'])), id__icontains=request.POST['term'],)[0:10]
                # ~Exists(erp_factura.objects.filter(id_servicio_id=request.POST['term']))
                prods = erp_producto.objects.filter(codigo='SERV01').first()
                for i in serv:
                    if i.repuesto_propio:
                        prods.precio=i.costo
                    else:
                        prods.precio = i.valor_neto
                    prods.id_tipo_producto.descripcion =i.id_modelo.id_marca.descripcion +'/'+ i.id_modelo.descripcion
                    item = prods.toJson()
                    item['value'] = str(i.id) + ' - ' + i.id_cliente.email + ' - ' + i.id_modelo.descripcion
                    item['servicio'] = i.id
                    item['inventario'] = 1
                    data.append(item)
            elif action == 'add':
                print("paso")
                with transaction.atomic():
                    vents = json.loads(request.POST['vents'])
                    factura = erp_factura()
                    factura.fecha = vents['fecha']
                    cliente=CustomUser.objects.filter(email=vents['cli']).first()
                    factura.id_cliente = cliente
                    factura.razon_social = cliente.razon_social
                    factura.address = cliente.address
                    factura.identificacion =cliente.identificacion
                    factura.cellphone = cliente.cellphone
                    factura.reference = cliente.reference
                    factura.observacion = vents['observacion']
                    factura.subtotal = float(vents['subtotal'])
                    factura.iva_total = float(vents['iva'])
                    factura.total = float(vents['total'])
                    factura.forma_pago = vents['forma_pago']
                    factura.tipo_venta = vents['tipo_venta']
                    factura.save()
                    for i in vents['products']:
                        det = erp_factura_detalle()
                        det.id_factura = factura
                        det.id_producto = erp_producto.objects.filter(id=i['id']).first()
                        if 'servicio' in i.keys():
                            det.id_servicio = erp_servicio_tecnico.objects.filter(id=i['servicio']).first()
                        det.cantidad = int(i['cant'])
                        det.iva = float(i['ivauni'])
                        det.precio = float(i['precio'])
                        det.subtotal = float(i['subtotal'])
                        det.total = det.subtotal + det.iva
                        det.save()
                    data['url']=factura.pk
                return JsonResponse(data, safe=False)
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)


    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        # total_precio["iva__sum"] if total_precio["iva__sum"] else 0
        # context['editar'] = reverse_lazy('usuario_editar')
        context['action'] = 'add'
        context['list_url'] = self.success_url
        context['titulo'] = 'Factura'
        return context


class FacturaDeleteView(LoginRequiredMixin, ValidatePermissionRequiredMixin, DeleteView):
    permission_required = 'compras.delete_erp_factura'
    url_redirect = reverse_lazy('home')
    model = erp_factura
    template_name = 'delete.html'
    success_url = reverse_lazy('factura_lista')

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            # self.object.delete()#para elimionar fisicamente
            eliminar = erp_factura()
            eliminar = erp_factura.objects.filter(id=self.object.id).first()
            eliminar.estado = 'B'
            eliminar.save()
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo'] = 'Eliminación de Factura'
        context['entity'] = 'Facturación'
        context['list_url'] = self.success_url
        return context


# Impresion
class FacturaImpresionListView(LoginRequiredMixin, ValidatePermissionRequiredMixin, TemplateView):
    permission_required = 'facturacion.view_erp_factura'
    template_name = 'adminConsola/facturacion/factura_impresion.html'


    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['form'] = erp_factura.objects.filter(id=kwargs['pk']).first()
        context['detalle'] = erp_factura_detalle.objects.filter(id_factura=kwargs['pk'])
        # Add in a QuerySet of all the books
        context['list_url'] = reverse_lazy('factura_lista')
        return context