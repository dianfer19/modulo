from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column

from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from django import forms
# from mapwidgets.widgets import GooglePointFieldWidget, GoogleStaticOverlayMapWidget


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('email', 'cellphone', 'address', 'reference','razon_social','identificacion')


class CustomUserForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['autocomplete'] = 'off'
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('email', css_class='form-group col-md-6 mb-0'),
                Column('identificacion', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('razon_social', css_class='form-group col-md-6 mb-0'),
                Column('tipo', css_class='form-group col-md-4 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('address', css_class='form-group col-md-4 mb-0'),
                Column('reference', css_class='form-group col-md-4 mb-0'),
                Column('cellphone', css_class='form-group col-md-2 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('password', css_class='form-group col-md-6 mb-0'),
                Column('groups', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'is_active'
        )

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
        model = CustomUser
        fields = ('email','identificacion','razon_social', 'cellphone', 'address', 'reference','tipo','password','is_active','groups',)
        exclude = [ 'last_login', 'date_joined', 'is_superuser', 'is_staff']



class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('cellphone', 'address', 'reference','razon_social','identificacion')
        # widgets = {
        #     'address': GooglePointFieldWidget,
        #     'reference': GoogleStaticOverlayMapWidget,
        # }

class ActualizacionForm(forms.ModelForm):


    class Meta:
        model = CustomUser
        fields = ('cellphone', 'address', 'reference','razon_social','identificacion')