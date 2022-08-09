$(function () {
 /*$("table.display").DataTable();*/
$("table.display").DataTable({
      "responsive": true,
      "lengthChange": true,
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todos"]],
      "autoWidth": false,
      /*"scrollX": true,
      "buttons": [
                    { extend: 'copy', className: 'btn btn-default bg-primary' },
                    { extend: 'excel', className: 'btn btn-default bg-primary' },
                    { extend: 'pdf', className: 'btn btn-default bg-primary' },
                    { extend: 'print', className: 'btn btn-default bg-primary' },
                    { extend: 'colvis', className: 'btn btn-default bg-primary' },
                 ],*/
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
        }
    }).buttons().container().appendTo('#tablaMant_wrapper .col-md-6:eq(0)');
  });