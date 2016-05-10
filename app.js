var five = require("johnny-five");
var awsConeccion = require("./pi.js")
var board = new five.Board();
var ultraBaseline = 20;
var ultraThreshold = 3;
var led;



board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7,
    freq: 60000
  });

   // Initialize the RGB LED
   led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });

  proximity.on("data", function() {
    console.log("Proximity: ");
    console.log("  cm  : ", this.cm);
    console.log("  in  : ", this.in);
    console.log("-----------------");
  });

  proximity.on("change", ultraChange);


});


function ultraChange(){


	var cm = this.cm;


	if(Math.abs(cm - ultraBaseline) > ultraThreshold){

           console.log("Alerta, la distancia cambió");
           // Turn it on and set the initial color
           led.on();
           led.color("#00FF00");
           awsConeccion.thingShadows.on('connect', function() {
             console.log("Connected...");
             console.log("Registering...");
             awsConeccion.thingShadows.register( awsConeccion.myThingName );

             // An update right away causes a timeout error, so we wait about 2 seconds
             setTimeout( function() {
               console.log("Updating my IP address...");
               clientTokenIP = awsConeccion.thingShadows.update(awsConeccion.myThingName, awsConeccion.mythingstate);
               console.log("Update:" + clientTokenIP);
             }, 2500 );


             // Code below just logs messages for info/debugging
             awsConeccion.thingShadows.on('status',
               function(thingName, stat, clientToken, stateObject) {
                  console.log('received '+stat+' on '+thingName+': '+
                              JSON.stringify(stateObject));
               });

             awsConeccion.thingShadows.on('update',
                 function(thingName, stateObject) {
                    console.log('received update '+' on '+thingName+': '+
                                JSON.stringify(stateObject));
                 });

             awsConeccion.thingShadows.on('delta',
                 function(thingName, stateObject) {
                    console.log('received delta '+' on '+thingName+': '+
                                JSON.stringify(stateObject));
                 });

             awsConeccion.thingShadows.on('timeout',
                 function(thingName, clientToken) {
                    console.log('received timeout for '+ clientToken)
                 });

             awsConeccion.thingShadows
               .on('close', function() {
                 console.log('close');
               });
             awsConeccion.thingShadows
               .on('reconnect', function() {
                 console.log('reconnect');
               });
             awsConeccion.thingShadows
               .on('offline', function() {
                 console.log('offline');
               });
             awsConeccion.thingShadows
               .on('error', function(error) {
                 console.log('error', error);
               });

           });


	}else {
	  led.color("#FF0000");
	  console.log("Todo normal")
	}

}
