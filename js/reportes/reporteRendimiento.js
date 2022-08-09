var date_range = null;
var date_now = new moment().format('YYYY-MM-DD');
var graphcolumn = Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Rendimiento'
                    },
                    subtitle: {
                        text: 'Sumatoria Ingresos y Egresos'
                    },
                    xAxis: {
                        categories: [
                            'Servicios',
                            'Ventas',
                            'Gastos Diarios',
                            'Pedidos GYE'
                        ],
                        crosshair: true
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} $</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    lang: {
                            downloadCSV:"Descarga CSV",
                            downloadXLS:"Descarga XLS",
                            viewFullscreen:"Ver en pantalla completa",
                            downloadPNG:"Descarga PNG",
                            downloadJPEG:"Descarga JPEG",
                            downloadPDF:"Descarga PDF",
                            downloadSVG:"Descarga SVG",
                        },
                });

function generate_report() {
    var parameters = {
        'action': 'get_performance',
        'start_date': date_now,
        'end_date': date_now,
    };
    var servicio=0;
    if (date_range !== null) {
        parameters['start_date'] = date_range.startDate.format('YYYY-MM-DD');
        parameters['end_date'] = date_range.endDate.format('YYYY-MM-DD');
    }

    $.ajax({
        url: window.location.pathname, //window.location.pathname
        type: 'POST',
        data: parameters,
        dataType: 'json',
    }).done(function(data) {
        if (!data.hasOwnProperty('error')) {
             var seriesLength = graphcolumn.series.length;
                for(var i = seriesLength - 1; i > -1; i--) {
                    graphcolumn.series[i].remove();
                }
             graphcolumn.redraw();
             graphcolumn.addSeries(data);
             console.log(data);
            return false;
        }
        message_error(data.error);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function(data) {

    });
}

$(function() {
    $('input[name="date_range"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: '<i class="fas fa-chart-pie"></i> Aplicar',
            cancelLabel: '<i class="fas fa-times"></i> Cancelar',
        }
    }).on('apply.daterangepicker', function(ev, picker) {
        date_range = picker;
        generate_report();
    }).on('cancel.daterangepicker', function(ev, picker) {
        $(this).data('daterangepicker').setStartDate(date_now);
        $(this).data('daterangepicker').setEndDate(date_now);
        date_range = picker;
        generate_report();
    });
generate_report();
});