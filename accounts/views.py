from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import logging
from django.contrib import messages
# Create your views here.
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# accounts/views.py
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django_currentuser.middleware import get_current_authenticated_user
from .mixins import *
from .forms import *


class SignUp(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/signup.html'


@login_required(login_url="login")
def perfil(request):
    try:
        logger = logging.getLogger(__name__)
        form_class = ActualizacionForm
        if request.method == "POST":
            vo = CustomUser.objects.get(email=get_current_authenticated_user().email)
            form = ActualizacionForm(request.POST, instance=vo, files=request.FILES)
            logger.debug('Editando usuario')
            if form.is_valid():
                form.save()
                messages.success(request, 'Actualización de Usuario con éxito')
                return redirect('perfil')
            else:
                for field, errors in form.errors.items():
                    print('Field: {} : {}'.format(field, ','.join(errors)))
                    error = 'Campo: {} : {}'.format(field, ','.join(errors))
                    messages.error(request, 'Error: ' + str(error))
                return redirect('perfil')

        else:
            return render(request, 'account/perfil.html', {'form':form_class})
    except Exception as e:
        print(e)
        return redirect('home')


class AccountListView(LoginRequiredMixin, ValidatePermissionRequiredMixin, ListView):
    permission_required = 'accounts.view_customuser'
    url_redirect = reverse_lazy('home')
    model = CustomUser
    template_name = 'account/usuario_lista.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in CustomUser.objects.all():
                    data.append(i.toJSON())
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
        # Add in a QuerySet of all the books
        # context['lista'] = CustomUser.objects.all()
        context['nuevo'] = reverse_lazy('usuario_agregar')
        # context['editar'] = reverse_lazy('usuario_editar')
        context['titulo'] = 'Listado de Usuarios'
        return context


class AccountCreateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, CreateView):
    model = CustomUser
    form_class = CustomUserForm
    template_name = 'account/formulario.html'
    success_url = reverse_lazy('usuario_lista')
    permission_required = 'accounts.add_customuser'
    url_redirect = success_url

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                form = self.get_form()
                data = form.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo'] = 'Creación de un Usuario'
        context['entity'] = 'Usuarios'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        return context


class AccountUpdateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, UpdateView):
    model = CustomUser
    form_class = CustomUserForm
    template_name = 'account/formulario.html'
    success_url = reverse_lazy('usuario_lista')
    permission_required = 'accounts.change_customuser'
    url_redirect = success_url

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                form = self.get_form()
                data = form.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo'] = 'Modificación de un Usuario'
        context['entity'] = 'Usuarios'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        return context


class AccountDeleteView(LoginRequiredMixin, ValidatePermissionRequiredMixin, DeleteView):
    model = CustomUser
    template_name = 'delete.html'
    success_url = reverse_lazy('usuario_lista')
    permission_required = 'accounts.delete_customuser'
    url_redirect = success_url

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            # self.object.delete() #para elimionar fisicamente
            eliminar = CustomUser()
            eliminar = CustomUser.objects.filter(id=self.object.id).first()
            eliminar.is_active = False
            eliminar.save()
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo'] = 'Eliminación de un Usuario'
        context['entity'] = 'Usuarios'
        context['list_url'] = self.success_url
        return context