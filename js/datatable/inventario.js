$(function () {
    $('#data').DataTable({
     "language": {
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
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "id_producto.name"},
            {"data": "metodo.name"},
            {"data": "cantidad_total"},
            {"data": "precio_actual"},
            {"data": "total"},
            {"data": "estado"},
            {"data": "id"},
        ],
        createdRow: function( row, data, dataIndex ) {
             if (data.cantidad_total <=20 && data.cantidad_total >=10){
               $(row).addClass("bg-warning");
            }
            if (data.cantidad_total <=10){
               $(row).addClass("bg-danger");
            }
            },
        columnDefs: [
         {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                var html= '<div class="custom-control custom-switch">  <input disabled  type="checkbox" class="custom-control-input"  id="customSwitch1">  <label class="custom-control-label" for="customSwitch1">Inactivo</label></div>';
                if (row.estado === 'Activo'){
                    html='<div class="custom-control custom-switch">  <input onclick="return false;"   type="checkbox" class="custom-control-input" id="customSwitch1" checked>  <label class="custom-control-label" for="customSwitch1">Activo</label></div>';
                }
                return html;
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a href="/inventario/inventario_detalle_registro_entrada/' + row.id + '" class="btn border btn-primary btn-xs btn-flat"><i class="fas fa-cart-plus "></i></a> ';
                    buttons += '<a href="/inventario/inventario_detalle_registro_salida/' + row.id + '" type="button" class=" btn btn-danger border btn-xs btn-flat"><i class="fas fa-cart-arrow-down"></i></a>';
                    buttons += '<a href="/inventario/inventario_detalle_lista/' + row.id + '" type="button" class=" btn btn-info border btn-xs btn-flat"><i class="fas fa-eye"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
});
