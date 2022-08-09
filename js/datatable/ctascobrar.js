var tblCtas;
function getData(datos) {
tblCtas=$('#data').DataTable({
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
            {"data": "id_cliente.name"},
            {"data": "id"},
            {"data": "cuotas"},
            {"data": "fecha"},
            {"data": "fecha_vencimiento"},
            {"data": "total"},
            {"data": "cubierto"},
            {"data": "saldo"},
            {"data": "estado.name"},
            {"data": "id"},
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
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons='<a href="/cta_cobrar/ctas_cobrar_modificacion/' + row.id + '" class="btn btn-warning  border btn-xs btn-flat"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a href="/cta_cobrar/ctas_cobrar_detalle_abonos/' + row.id + '" class="btn btn-primary border btn-xs btn-flat"><i class="fas fa-eye"></i></a> ';
                    buttons += '<a href="/cta_cobrar/servicios_eliminacion/' + row.id + '" type="button" class="btn border btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
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
});
function filtro_estado(estados) {
var datos={ 'action': 'filtro', 'filtro': estados};
getData(datos);
}