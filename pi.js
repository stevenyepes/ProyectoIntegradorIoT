var awsIot = require('aws-iot-device-sdk');

var myThingName = 'Prueba1';

var thingShadows = awsIot.thingShadow({
   keyPath: '../certs/private.pem.key',
  certPath: '../certs/certificate.pem.crt',
    caPath: '../certs/root-CA.crt',
  clientId: myThingName,
    region: 'us-west-2'
});

mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown",
      "mensaje":"Estoy bien!"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );

var distancia = 16 // htttp.get(blablabla)

if(distancia <= 15){ //cm
   mythingstate["state"]["reported"]["mensaje"] = "Alerta, Demasiado cerca"   
}
mythingstate["state"]["reported"]["ip"] = networkInterfaces['wlan0'][0]['address'];

thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName );

  // An update right away causes a timeout error, so we wait about 2 seconds
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 2500 );


  // Code below just logs messages for info/debugging
  thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

  thingShadows.on('update',
      function(thingName, stateObject) {
         console.log('received update '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('delta',
      function(thingName, stateObject) {
         console.log('received delta '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('timeout',
      function(thingName, clientToken) {
         console.log('received timeout for '+ clientToken)
      });

  thingShadows
    .on('close', function() {
      console.log('close');
    });
  thingShadows
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });

});
