var tblServicio;
function getData(datos) {
tblServicio=$('#data').DataTable({
     language: {
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningún dato disponible en esta tabla",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sSearch":         "Buscar:",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad"
                }
        },
        responsive: true,
        autoWidth: false,
//        scrollX: true,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: datos,
            dataSrc: ""
        },

        columns: [
            {"data": "id"},
            {"data": "orden"},
            {"data": "fecha_registro"},
            {"data": "id_cliente.name"},
            {"data": "id_tecnico.name"},
            {"data": "id_tipo_fallo.name"},
            {"data": "id_modelo.name"},
            {"data": "costo"},
            {"data": "abono"},
            {"data": "saldo"},
            {"data": "chip"},
            {"data": "contrasena"},
            {"data": "accesorios"},
            {"data": "garantia"},
            {"data": "estado.name"},
            {"data": "serie"},
        ],
        createdRow: function( row, data, dataIndex ) {
             if (data.estado.id=='A'){
               $(row).addClass("bg-info");
            }
            if (data.estado.id=='E'){
               $(row).addClass("bg-success");
            }
            if (data.estado.id=='B'){
               $(row).addClass("bg-danger");
            }
            if (data.estado.id=='C'){
               $(row).addClass("bg-warning");
            }
            },
        columnDefs: [
              {
                targets: [-6],
                class: 'text-center',
                visible: false,
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                var html= '<div class="custom-control custom-switch">  <input disabled  type="checkbox" class="custom-control-input"  id="customSwitch1">  <label class="custom-control-label" for="customSwitch1">Inactivo</label></div>';
                if (row.chip){
                    html='<div class="custom-control custom-switch">  <input onclick="return false;"   type="checkbox" class="custom-control-input" id="customSwitch1" checked>  <label class="custom-control-label" for="customSwitch1">Activo</label></div>';
                }
                return html;
                }
            },
             {
                targets: [-5],
                class: 'text-center',
                visible: false,
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                var html= '<div class="custom-control custom-switch">  <input disabled  type="checkbox" class="custom-control-input"  id="customSwitch1">  <label class="custom-control-label" for="customSwitch1">Inactivo</label></div>';
                if (row.contrasena){
                    html='<div class="custom-control custom-switch">  <input onclick="return false;"   type="checkbox" class="custom-control-input" id="customSwitch1" checked>  <label class="custom-control-label" for="customSwitch1">Activo</label></div>';
                }
                return html;
                }
            },
              {
                targets: [-4],
                class: 'text-center',
                visible: false,
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                var html= '<div class="custom-control custom-switch">  <input disabled  type="checkbox" class="custom-control-input"  id="customSwitch1">  <label class="custom-control-label" for="customSwitch1">Inactivo</label></div>';
                if (row.accesorios){
                    html='<div class="custom-control custom-switch">  <input onclick="return false;"   type="checkbox" class="custom-control-input" id="customSwitch1" checked>  <label class="custom-control-label" for="customSwitch1">Activo</label></div>';
                }
                return html;
                }
            },
             {
                targets: [-3],
                class: 'text-center',
                visible: false,
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                var html= '<div class="custom-control custom-switch">  <input disabled  type="checkbox" class="custom-control-input"  id="customSwitch1">  <label class="custom-control-label" for="customSwitch1">Inactivo</label></div>';
                if (row.garantia){
                    html='<div class="custom-control custom-switch">  <input onclick="return false;"   type="checkbox" class="custom-control-input" id="customSwitch1" checked>  <label class="custom-control-label" for="customSwitch1">Activo</label></div>';
                }
                return html;
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                visible: false,
                searchable: false,
                orderable: false
            },
            {
                targets: [0],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons='<a href="/servicios/servicios_impresion/' + row.id + '" class="btn btn-primary border btn-xs btn-flat"><i class="fas fa-print"></i></a> ';
                    buttons += '<a href="/servicios/servicios_modificacion/' + row.id + '" class="btn btn-warning border btn-xs btn-flat"><i class="fas fa-edit"></i></a> ';
//                    buttons += '<a href="/servicios/servicios_eliminacion/' + row.id + '" type="button" class="btn border btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
}
$(function () {
//datatable
datos={'action': 'searchdata'};
getData(datos);

//Modal
$('#data tbody')
        .on('click', 'a[rel="ver"]', function () {
//            modal_title.find('span').html('Servicio Técnico');
//            modal_title.find('i').removeClass().addClass('fas fa-search');
            var tr = tblServicio.cell($(this).closest('td, li')).index();
            var data = tblServicio.row(tr.row).data();
            var parameters = data;
//             $('input[name="cliente"]').val(data.id_cliente.name);
//             $('input[name="tecnico"]').val(data.id_tecnico.name);
//             $('input[name="fallo"]').val(data.id_tipo_fallo.name);
//             $('input[name="fecha"]').val(data.fecha_registro);
//             $('input[name="marca"]').val(data.marca);
//             $('input[name="modelo"]').val(data.modelo);
//             $('input[name="estado"]').val(data.estado.name);
//             $('input[name="imei"]').val(data.imei);
//             $('input[name="costo"]').val(data.costo);
//             $('input[name="abono"]').val(data.abono);
//             $('input[name="saldo"]').val(data.saldo);
//             $('input[name="observacion"]').val(data.observacion);

        $.ajax({
            url: '/servicios/servicios_modificacion/'+data.id, //window.location.pathname
            type: 'POST',
            data: parameters,
            dataType: 'json',
            processData: false,
            contentType: false,
        }).done(function (data) {
            console.log(data);
            if (!data.hasOwnProperty('error')) {
                callback(data);
                return false;
            }
           message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: +textStatus + ': ' + errorThrown,

                })
        }).always(function (data) {

        });

        });

});
function filtro_estado(estados) {
var datos={ 'action': 'filtro', 'filtro': estados};
getData(datos);
}