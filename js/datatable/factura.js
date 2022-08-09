var tblProducts;
var vents = {
    items: {
        cli: '',
        fecha: '',
        observacion: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        products: []
    },
    calculate_invoice: function () {
        var subtotal = 0.00;
        var iva = 0.00;
        $.each(this.items.products, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = dict.cant * parseFloat(dict.precio);
             if(dict.iva)
            {
              dict.ivauni= dict.subtotal * 0.12;
              console.log(dict.ivauni);
            }
            subtotal += dict.subtotal;
            iva += dict.ivauni;
        });
        this.items.subtotal = subtotal;
        this.items.iva = iva
        this.items.total = this.items.subtotal + this.items.iva;

        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="iva_total"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },
    add: function (item) {
         var bandera=true;
         $.each(this.items.products, function (pos, dict) {
         dict.pos = pos;
              if(dict.id == item.id )
                    bandera=false;
                });
        if(bandera){
            if($('select[name="tipo_venta"]').val() == 'B' ){
               item.precio=item.precio_tecnico;
            }
        console.log($('select[name="tipo_venta"]').val());
            this.items.products.push(item);
            this.list();
        }else{
            mensaje_informativo('Error','Producto ya en la factura');
        }

    },
    list: function () {
        this.calculate_invoice();
        tblProducts = $('#tblProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            data: this.items.products,
            columns: [
                {"data": "id"},
                {"data": "nombre"},
                {"data": "id_tipo_producto.descripcion"},
                {"data": "precio"},
                {"data": "ivauni"},
                {"data": "cant"},
                {"data": "subtotal"},
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-xs btn-flat" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                 {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" name="cant" class="form-control form-control-sm input-sm" autocomplete="off" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-right',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {

                $(row).find('input[name="cant"]').TouchSpin({
                    min: 1,
                    max: 1000000000,
                    step: 1
                });

            },
            initComplete: function (settings, json) {

            }
        });
    },
};

$(function () {

    $('.select2').select2()
    //Initialize Select2 Elements
    $('.select2bs4').select2({
      placeholder: "Seleccione una opción",
      theme: 'bootstrap4',
      language: 'es'
    })
    // search products
  $('input[name="search"]').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'term': request.term
                },
                dataType: 'json',
            }).done(function (data) {
                response(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //alert(textStatus + ': ' + errorThrown);
            }).always(function (data) {

            });
        },
        delay: 500,
        minLength: 1,
        select: function (event, ui) {
            event.preventDefault();
            console.clear();
            ui.item.cant = 1;
            ui.item.subtotal = 0.00;
            ui.item.ivauni = 0.00;
            console.log(vents.items);
            vents.add(ui.item);
            $(this).val('');
        }
    });
    // search servicios
  $('input[name="search_servicio"]').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_servicio',
                    'term': request.term
                },
                dataType: 'json',
            }).done(function (data) {
                response(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //alert(textStatus + ': ' + errorThrown);
            }).always(function (data) {

            });
        },
        delay: 500,
        minLength: 1,
        select: function (event, ui) {
            event.preventDefault();
            console.clear();
            ui.item.cant = 1;
            ui.item.subtotal = 0.00;
            ui.item.ivauni = 0.00;
            console.log(vents.items);
            vents.add(ui.item);
            $(this).val('');
        }
    });
//    boton remover todos
$('.btnRemoveAll').on('click', function () {
        if (vents.items.products.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            vents.items.products = [];
            vents.list();
        });
    });
//    boton borrar autocomplete
$('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
});

        // evento de cantidad
    $('#tblProducts tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?', function () {
                vents.items.products.splice(tr.row, 1);
                vents.list();
            });
        })
        .on('change', 'input[name="cant"]', function () {
            console.clear();
            var cant = parseInt($(this).val());
            var tr = tblProducts.cell($(this).closest('td, li')).index();

            if (vents.items.products[tr.row].inventario<cant){
                vents.items.products[tr.row].cant=vents.items.products[tr.row].inventario;
                vents.list();
                mensaje_informativo('Error','Cantidad mayor al inventario');
            }else{
            vents.items.products[tr.row].cant = cant;
            }
            vents.calculate_invoice();
            $('td:eq(6)', tblProducts.row(tr.row).node()).html('$' + vents.items.products[tr.row].subtotal.toFixed(2));
        });
//        Fecha
 $('#fecha').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es'
        //minDate: moment().format("YYYY-MM-DD")
    });
//IVA
    $("input[name='iva_total']").TouchSpin({
        min: 0,
        max: 100,
         theme: 'bootstrap4',
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
        postfix: '$'
    }).on('change', function () {
        vents.calculate_invoice();
    }).val(0.00);
    $("input[name='subtotal']").TouchSpin({
        min: 0,
        max: 100,
         theme: 'bootstrap4',
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
        postfix: '$'
    }).on('change', function () {
        vents.calculate_invoice();
    }).val(0.00);
 $("input[name='total']").TouchSpin({
        min: 0,
        max: 100,
         theme: 'bootstrap4',
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
        postfix: '$'
    }).on('change', function () {
        vents.calculate_invoice();
    }).val(0.00);

     // event submit
    $('form').on('submit', function (e) {
        e.preventDefault();

        if(vents.items.products.length === 0){
            message_error('Debe al menos tener un item en su detalle de venta');
            return false;
        }

        vents.items.fecha = $('input[name="fecha"]').val();
        vents.items.observacion = $('input[name="observacion"]').val();
        vents.items.cli = $('select[name="id_cliente"]').val();
        vents.items.forma_pago = $('select[name="forma_pago"]').val();
        vents.items.tipo_venta = $('select[name="tipo_venta"]').val();
        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('vents', JSON.stringify(vents.items));
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Guardar la siguiente factura?', parameters, function (data) {
           location.href = '/facturacion/factura_impresion/'+ data.url ;
        });
    });

});