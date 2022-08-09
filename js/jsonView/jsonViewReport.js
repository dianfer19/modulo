$('button[name="Consultar"]').click(function(e){
e.preventDefault();
let id = this.id;
let formData = $("#frm_consulta").serializeArray();
let fechaini;
let fechafin ;
let estado ;
let producto;
$.each( formData, function() {
    let name = this.name;  // the name property in the current iteration
    let value = this.value;  // the value property in the current iteration
    if (this.name === "fechaini" ) {
     fechaini=this.value;
    }
    if (this.name === "fechafin" ) {
     fechafin=this.value;
    }
    if (this.name === "estado" ) {
     estado=this.value;
    }
    if (this.name === "producto" ) {
     producto=this.value;
    }
});
console.log(fechaini, fechafin, producto)
  $.ajax({
	   type: "POST",
	   url: "",
	   data: {'producto': producto,'fechaini':fechaini,'fechafin':fechafin,'estado':estado, 'csrfmiddlewaretoken': CSRF_TOKEN},
	   dataType: "json",
	   success: function(response) {
			  /*location.reload();*/

              $(document).Toasts('create', {
                   class: 'bg-info',
                   title: 'ERP-Dbjsystem',
                   subtitle: 'Cerrar',
                   body: response.message
                });



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
})