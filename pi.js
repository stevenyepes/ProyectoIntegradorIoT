

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

mythingstate["state"]["reported"]["ip"] = networkInterfaces['wlan0'][0]['address'];


module.export.thingShadows = thingShadows;
module.export.mythingstate = mythingstate;
module.export.myThingName = myThingName;
