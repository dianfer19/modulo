 // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCsGy2AN7yE8EZvcr_6eVQJbzpTzKiYbYU",
    authDomain: "erp-dbjsystem-a5e83.firebaseapp.com",
    projectId: "erp-dbjsystem-a5e83",
    storageBucket: "erp-dbjsystem-a5e83.appspot.com",
    messagingSenderId: "588923284608",
    appId: "1:588923284608:web:ca50ecbe090433305f8a65"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let messaging = firebase.messaging();
   //enlazar servirworker
  navigator.serviceWorker
  .register('./serviceworker.js')
  .then(function (register)  {
    messaging.useServiceWorker(register);
    //soliucitamos permiso para actibvar notificaciones al usuario
    messaging.requestPermission()
    .then(function(){
        console.log("El usuario acepto")
        return messaging.getToken()
    })
    .then(function(token){
        console.log(token);
        fetch('guardar_token/',{
            method:'post',
            headers:{
                'Content-Type':'aplication-json',
                'Accept':'aplication-json'
            },
            body:JSON.stringify({
                'token':token
            })
        })
        .then(function(resultado){
            console.log('Se ha guardo el token')
        })
        .catch(function(e){
            console.log('Error no se ha guardado el token')
        })
    })
    .catch(function(e){
        console.log("El usuario No acepto")
    })

  })

  //Recepcion de las notificaciones
  messaging.onMessage(function(payload){

  let titulo=payload.notification.title
  let opciones = {
        body:payload.notification.body,
        icono:payload.notification.icono
    }
    let mensaje= new Notification(titulo,opciones);

  })