var five = require("johnny-five");
var board = new five.Board();
var awsConnetion = require("./pi.js");
var ultraBaseline = 20;
var ultraThreshold = 3;
var led;


mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown",
      "distancia":0,
      "alerta":""
    }
  }
}

board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7,
    freq: 15000
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
           led.color("#FF0000");

	   mythingstate["state"]["reported"]["distancia"] = cm;
	   mythingstate["state"]["reported"]["alerta"] = "Fuera del rango permitido";
           awsConnetion.enviar(mythingstate);
  	

	}else {
	  led.color("#00FF00");
	  console.log("Estado normal")
	}

}

