
function submit_with_ajax(url, title, content, parameters, callback) {

Swal.fire({
  title: title,
  text: content,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si'
}).then((result) => {
  if (result.isConfirmed) {
        $.ajax({
            url: url, //window.location.pathname
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
  }
})
}
function alert_action(titulo, contenido, callback) {
Swal.fire({
  title: titulo,
  text: contenido,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si'
}).then((result) => {
  if (result.isConfirmed) {
       callback();
  }
})

}
function message_error(obj) {
    var html = '';
    if (typeof (obj) === 'object') {
        html = '<ul style="text-align: left;">';
        $.each(obj, function (key, value) {
            html += '<li>' + key + ': ' + value + '</li>';
        });
        html += '</ul>';
    } else {
        html = '<p>' + obj + '</p>';
    }
    Swal.fire({
        title: 'Error!',
        html: html,
        icon: 'error'
    });
}


function mensaje_informativo(titulo, contenido,) {
 Swal.fire({
  icon: 'error',
  title: titulo,
  text: contenido
})

}
