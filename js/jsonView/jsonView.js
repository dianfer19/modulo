$('button[name="agregar"]').click(function(e){
        e.preventDefault();
        $(this).prop("disabled", true);
        /*$('.modal').modal('show');*/
        let id = this.id;
        let $formElem = $(this).closest('form');
        let formData = $formElem.serializeArray();
        let producto_id;
        let nombre ;
        let cantidad;
        $.each( formData, function() {
            let name = this.name;  // the name property in the current iteration
            let value = this.value;  // the value property in the current iteration
            if (this.name === "producto_id" ) {
             producto_id=this.value;
            }
            if (this.name === "nombre" ) {
             nombre=this.value;
            }
            if (this.name === "cantidad" ) {
             cantidad=this.value;
            }
        });
            console.log(producto_id, nombre, cantidad)
        $.ajax({
	   type: "POST",
	   url: "orden/agregar/",
	   data: {'producto_id': producto_id,'nombre':nombre,'cantidad':cantidad, 'csrfmiddlewaretoken': CSRF_TOKEN},
	   dataType: "json",
	   success: function(response) {
			  /*location.reload();*/
			  let carrito=parseInt(document.getElementById('contador_carrito').innerHTML)
			  let cantidad =parseInt(response.noti);
              document.getElementById('contador_carrito').innerHTML = carrito+cantidad;
              $(document).Toasts('create', {
                   class: 'bg-info',
                   title: 'ERP-Dbjsystem',
                   subtitle: 'Cerrar',
                   body: response.message
                });
                /*$('#cargando').modal('hide');*/
		},
		error: function(rs, e) {
			   $(document).Toasts('create', {
                   class: 'bg-danger',
                   title: 'ERP-Dbjsystem',
                   subtitle: 'Cerrar',
                   body: rs.responseText
                });
                /*$('#cargando').modal('hide');*/
		}
  });
$(this).prop("disabled", false);
})