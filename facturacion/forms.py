from datetime import datetime
from crispy_forms.helper import FormHelper
from django import forms
from .models import *
from django.forms import ModelChoiceField, Select

class CombosModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return f' {obj.email} : {obj.razon_social} '


class FacturaForm(forms.ModelForm):
    id_cliente = CombosModelChoiceField(
        queryset=CustomUser.objects.filter(tipo='C').order_by('razon_social').only('email', 'razon_social'),
        to_field_name="email", label='Cliente',
        widget=Select(attrs={
            'class': 'form-control-sm select2bs4',
            'style': 'width: 100%'
        }))
    forma_pago = forms.ChoiceField(choices=FormaPago, required=True, widget=Select(attrs={
            'class': 'form-control-sm select2bs4',
            'style': 'width: 100%'
        }))
    tipo_venta = forms.ChoiceField(choices=TipoVenta, required=True, widget=Select(attrs={
        'class': 'form-control-sm select2bs4',
        'style': 'width: 100%'
    }))
    fecha = forms.CharField(label='Fecha',
        widget=forms.DateInput(attrs={
            'value': datetime.now().strftime('%Y-%m-%d'),
            'autocomplete': 'off',
            'class': 'form-control datetimepicker-input',
            'id': 'fecha',
            'data-target': '#fecha',
            'data-toggle': 'datetimepicker'
        }))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['autocomplete'] = 'off'

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

    class Meta:
        model = erp_factura
        fields = "__all__"
