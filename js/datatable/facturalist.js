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
            {"data": "id"},
            {"data": "fecha"},
            {"data": "razon_social"},
            {"data": "subtotal"},
            {"data": "iva_total"},
            {"data": "total"},
            {"data": "estado.name"},
        ],
        columnDefs: [
            {
                targets: [0],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons='<a href="/facturacion/factura_impresion/' + row.id + '" class="btn btn-primary btn-xs btn-flat"><i class="fas fa-print"></i></a> ';
//                    buttons += '<a href="/facturacion/gastos_varios_modificacion/' + row.id + '" class="btn btn-warning btn-xs btn-flat"><i class="fas fa-check-square"></i></a> ';
                    buttons += '<a href="/facturacion/factura_eliminaicon/' + row.id + '" type="button" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
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