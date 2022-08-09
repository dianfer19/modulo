from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin,Group
from django.db import models
from django.forms import model_to_dict
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

#choices
TipoUsuario = [
    ('A', 'Administrador'),
    ('P', 'Proveedor'),
    ('C', 'Cliente'),
    ('D', 'Delivery'),
    ('T', 'Técnico'),
]


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('Correo'), unique=True)
    cellphone = models.CharField(max_length=10, blank=True, null=True, verbose_name='Número Celular')
    identificacion = models.CharField(max_length=13, blank=True, null=True, unique=True, verbose_name='Cédula o Ruc')
    razon_social = models.CharField(max_length=100, blank=True, null=True,  verbose_name='Nombre o Razon Social')
    address = models.CharField(max_length=200,blank=True, null=True)
    reference = models.CharField(max_length=100,blank=True, null=True, verbose_name='Referencia')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True,verbose_name='Estado')
    date_joined = models.DateTimeField(default=timezone.now)
    tipo = models.CharField(max_length=1, blank=False, null=False, choices=TipoUsuario, default='C', verbose_name='Tipo de Usuario')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def toJSON(self):
        item = model_to_dict(self, exclude=['password', 'groups', 'user_permissions', 'last_login'])
        item['tipo'] = {'id': self.tipo, 'name': self.get_tipo_display()}
        if self.last_login:
            item['last_login'] = self.last_login.strftime('%Y-%m-%d')
        item['date_joined'] = self.date_joined.strftime('%Y-%m-%d')
        item['estado'] = 'Activo' if self.is_active else 'Inactivo'
        return item

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.set_password(self.password)
        else:
            user = CustomUser.objects.get(pk=self.pk)
            if user.password != self.password:
                self.set_password(self.password)
        super().save(*args, **kwargs)

