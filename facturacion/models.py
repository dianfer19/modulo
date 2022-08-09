from decimal import Decimal
from django.db import models
from django.forms import model_to_dict
from django_currentuser.middleware import get_current_authenticated_user
from accounts.models import CustomUser
from inventario.models import erp_producto, erp_inventario, erp_inventario_detalle
from servicio.models import erp_servicio_tecnico
from util.util import GenerarCuentaCobrar, GenerarAbono

Estados = [
    ('A', 'Generada'),
    ('B', 'Generada Pendiente de pago'),
    ('C', 'Eliminada'),
    ('D', 'Contabilizada'),
]
FormaPago = [
    ('A', 'Efectivo'),
    ('B', 'Transferencia'),
    ('C', 'Cuotas'),
]
TipoVenta = [
    ('A', 'Consumidor'),
    ('B', 'Mayorista'),
]

class erp_factura(models.Model):
    id_cliente = models.ForeignKey(CustomUser, to_field='email', verbose_name='Cliente', on_delete=models.DO_NOTHING, related_name='relacion_cliente_factura')
    id_orden = models.ForeignKey(CustomUser, to_field='id', null=True, blank=True, verbose_name='Orden', on_delete=models.DO_NOTHING, related_name='relacion_orden')
    razon_social = models.CharField(max_length=300, blank=True, null=True, verbose_name='Razón Social')
    identificacion = models.CharField(max_length=13, blank=True, null=True, verbose_name='Cédula o Ruc')
    cellphone = models.CharField(max_length=10, blank=True, null=True, verbose_name='Número Celular')
    address = models.CharField(max_length=320, blank=True, null=True, verbose_name='Dirección')
    reference = models.CharField(max_length=320, blank=True, null=True, verbose_name='Referencia de dirección')
    subtotal = models.DecimalField(max_digits=10, blank=True, null=True, decimal_places=2, default=0,verbose_name='Subtotal')
    iva_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0, verbose_name='Iva Total')
    ice_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0, verbose_name='Ice Total')
    descuento_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0, verbose_name='Descuento Total')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True, verbose_name='Total')
    fecha = models.DateTimeField( auto_now_add=True, blank=True, null=True)
    usuario_registro = models.CharField(max_length=50, editable=False)
    usuario_modificacion = models.CharField(max_length=50, blank=True, null=True, editable=False)
    fecha_registro = models.DateTimeField(editable=False, auto_now_add=True, blank=True, null=True)
    fecha_modificacion = models.DateTimeField(editable=False, auto_now_add=True, null=True)
    estado = models.CharField(max_length=2, blank=False, null=False, choices=Estados, default='A', verbose_name='Estado')
    forma_pago = models.CharField(max_length=2, blank=False, null=False, choices=FormaPago, default='A', verbose_name='Forma de Pago')
    tipo_venta = models.CharField(max_length=2, blank=False, null=False, choices=TipoVenta, default='A',verbose_name='Tipo de Venta')
    observacion = models.CharField(max_length=5000, blank=True, null=True, verbose_name='Observación')


    class Meta:
        verbose_name_plural = 'Facturas'
        db_table = 'erp_factura'
        verbose_name = 'Factura'

    def __str__(self):
        return str(self.pk)

    def save(self):
        if self.pk is None:
            self.usuario_registro = get_current_authenticated_user().email
            self.usuario_modificacion = get_current_authenticated_user().email
            super(erp_factura, self).save()
            if self.forma_pago == 'C':
                GenerarCuentaCobrar(self)

        else:
            if self.estado == 'B':
                detalle = erp_factura_detalle.objects.filter(id_factura=self.pk)
                for item in detalle:
                    item.estado = False
                    item.save()
            # self.fecha_modificacion = ahora()
            self.usuario_modificacion = get_current_authenticated_user().email
            super(erp_factura, self).save()

    def toJson(self):
        item= model_to_dict(self)
        item['fecha'] = self.fecha.strftime('%Y-%m-%d %H:%M')
        item['estado'] = {'id': self.estado, 'name': self.get_estado_display()}
        return item


class erp_factura_detalle(models.Model):
    id_factura = models.ForeignKey(erp_factura, to_field='id', verbose_name='Factura',on_delete=models.DO_NOTHING, related_name='relacion_factura_detalle')
    id_producto = models.ForeignKey(erp_producto, to_field='id', null=True, blank=True, verbose_name='Producto',  on_delete=models.DO_NOTHING, related_name='relacion_detall_producto')
    id_servicio = models.ForeignKey(erp_servicio_tecnico, to_field='id', null=True, blank=True, verbose_name='Servicio',on_delete=models.DO_NOTHING, related_name='relacion_servicio')
    cantidad = models.DecimalField(max_digits=10, blank=True, null=True, decimal_places=2, default=0, verbose_name='Cantidad')
    precio = models.DecimalField(max_digits=10, blank=True, null=True, decimal_places=2, default=0,verbose_name='Subtotal')
    subtotal = models.DecimalField(max_digits=10, blank=True, null=True, decimal_places=2, default=0, verbose_name='Subtotal')
    iva = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0,verbose_name='Iva')
    ice = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0,verbose_name='Ice')
    descuento = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0,verbose_name='Descuento')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True,verbose_name='Total')
    usuario_registro = models.CharField(max_length=50, editable=False)
    usuario_modificacion = models.CharField(max_length=50, blank=True, null=True, editable=False)
    fecha_registro = models.DateTimeField(editable=False, auto_now_add=True, blank=True, null=True)
    fecha_modificacion = models.DateTimeField(editable=False, auto_now_add=True, null=True)
    estado = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Detalle de Facturas'
        db_table = 'erp_factura_detalle'
        verbose_name = 'Detalle de Facturas'

    def save(self):
        if self.pk is None:
            self.usuario_registro = get_current_authenticated_user().email
            self.usuario_modificacion = get_current_authenticated_user().email
            super(erp_factura_detalle, self).save()
            existe_inventario = erp_inventario.objects.filter(id_producto=self.id_producto).first()
            nueva_salida = erp_inventario_detalle()
            nueva_salida.id_inventario = existe_inventario
            nueva_salida.descripcion = "Venta Factura# " + str(self.id_factura.id)
            nueva_salida.movimiento = 'S'
            nueva_salida.cantidadSalida = self.cantidad
            nueva_salida.costoSalida = Decimal(self.precio)
            nueva_salida.total = nueva_salida.cantidadSalida * nueva_salida.costoSalida
            nueva_salida.save()
            if self.id_producto.codigo == 'SERV01':
                print("holis")
                GenerarAbono(self.id_servicio,self.id_factura)
        else:
            if not self.estado:
                existe_inventario = erp_inventario.objects.filter(id_producto=self.id_producto).first()
                nueva_entrada = erp_inventario_detalle()
                nueva_entrada.id_inventario = existe_inventario
                nueva_entrada.descripcion = "Reverso Factura# " + str(self.id_factura.id)
                nueva_entrada.movimiento = 'E'
                nueva_entrada.cantidadEntrada = self.cantidad
                nueva_entrada.costoEntrada = Decimal(self.precio)
                nueva_entrada.total = nueva_entrada.cantidadSalida * nueva_entrada.costoSalida
                nueva_entrada.save()
            self.usuario_modificacion = get_current_authenticated_user().email
            super(erp_factura_detalle, self).save()

    def toJson(self):
        item = model_to_dict(self)
        return item