// index.js
"use strict";

// declare variables for easy access to often-used long-named variables
let Service, Characteristic;

module.exports = function (homebridge) {
    /*
        API.registerAccessory(PluginIdentifier,
            AccessoryName, AccessoryPluginConstructor)
    */
	Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
	
   homebridge.registerAccessory("homebridge-marax",
            "Mara X Temperature", temperature); 
};

function temperature(log, config, api) {
    this.log = log;
    this.config = config;
    this.homebridge = api;

    if (this.config.defaultTemp)
        this.defaultTemp = this.config.defaultTemp;
    else
        this.defaultTemp = 20;

    this.log('Temperature accessory is Created!');
    this.log('defaultTemp is ' + this.defaultTemp);
	
	this.tempSens = new Service.TemperatureSensor(this.config.name);
    // Set up Event Handler for Temperature Sensor
    this.tempSens.getCharacteristic(Characteristic.CurrentTemperature)
		.setProps({
			minValue: 0,
			maxValue: 200
		})
        .on("get", this.getTemperature.bind(this));
    
    this.log('all event handler was setup.')
};

temperature.prototype = {
    getServices: function() {
		if (!this.tempSens) return [];
        this.log('Homekit asked to report service');
        const infoService =  
            new Service.AccessoryInformation();
        infoService
            .setCharacteristic(Characteristic.Manufacturer,
                'Lelit')
        return [infoService, this.tempSens];
	},
	getTemperature: function(callback) {
        this.log('Homekit Asked Temperature');
		let temperature = 20;
        callback(null,temperature)
    }
}