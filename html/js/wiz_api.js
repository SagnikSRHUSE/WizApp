var udp = require('dgram');

// -------------------- udp client ----------------

// creating a client socket
var client = udp.createSocket('udp4');

class PilotBuilder {
    
    constructor(warm_white = undefined,
        cold_white = undefined,
        speed = undefined,
        scene = undefined,
        rgb = undefined,
        brightness = undefined,
        colortemp = undefined) {

        this.params = {"state": true}

        if (warm_white !== undefined) {
            this.setWarmWhite(warm_white);
        }

        if (cold_white !== undefined) {
            this.setColdWhite(cold_white);
        }

        if (speed !== undefined) {
            this.setSpeed(speed);
        }

        if (scene !== undefined) {
            this.setScene(scene);
        }

        if (rgb !== undefined) {
            this.setRgb(rgb);
        }

        if (brightness !== undefined) {
            this.setBrightness(brightness);
        }

        if (colortemp !== undefined) {
            this.setColortemp(colortemp);
        }

    }

    getPilotMessage() {

        return JSON.stringify({
            "method" : "setPilot",
            "params": this.params
        })

    }

    setWarmWhite(value) {
        // Set the value of Warm white to the params

        if (Number.isInteger(value) && value > 0 && value < 256) {
            this.params["w"] = value
        } else {
            let err = 'Error: Value must be between 1 and 255'
            throw err
        }
    }

    setColdWhite(value) {
        // Set the value of Cold white to the params

        if (Number.isInteger(value) && value > 0 && value < 256) {
            this.params["c"] = value
        } else {
            let err = 'Error: Value must be between 1 and 255'
            throw err
        }
    }

    setSpeed(value) {
        // Set the speed to the params

        if (Number.isInteger(value) && value > 0 && value < 201) {
            this.params["speed"] = value
        } else {
            let err = 'Error: Value must be between 1 and 200'
            throw err
        }
    }

    setScene(scene_id) {
        // Set the scene id to the params

        if (Number.isInteger(scene_id) && ((scene_id > 0 && scene_id < 33) || scene_id === 1000)) {
            this.params["sceneId"] = scene_id
        } else {
            let err = 'Error: Scene ID must be between 1 and 32'
            throw err
        }
    }

    setRgb(rgb) {
        // Set the value of R G B to the params

        if (!(rgb instanceof Array)) {
            let err = 'Error: Send a array of rgb (r, g, b)'
            throw err
        }

        rgb.forEach(value => {
            if (!Number.isInteger(value)) {
                let err = 'Error: Value must be between 1 and 255'
                throw err
            }
        });

        this.params["r"] = rgb[0]
        this.params["g"] = rgb[1]
        this.params["b"] = rgb[2]
    }

    setBrightness(value) {
        // Set the brightness to the params

        if (Number.isInteger(value) && value > 0 && value < 256) {

            let percent = this.hexToPercent(value)

            if (percent < 10) percent = 10

            this.params["dimming"] = Math.round(percent)

        } else {
            let err = 'Error: Value must be between 1 and 255'
            throw err
        }
    }

    setColortemp(kelvin) {
        // Set the color temp to the params

        if (typeof kelvin === 'number') {
            
            if (kelvin < 2200) kelvin = 2200

            if (kelvin > 6500) kelvin = 6500

            this.params['temp'] = kelvin

        } else {
            let err = 'Error: Value must be an integer'
            throw err
        }
    }    

    hexToPercent(hex) {
        // Converts hex to a percent value

        return ((hex / 255) * 100)
    }

}


class wizlight {

    // Creates an instance of the light bulb

    constructor(ip, port = 38899) {
        // Constructor setting IP and Port

        this.ip = ip
        this.port = port

    }

    turnOff(callback) {
        // Turns the light off

        this.sendUDPMessage('{"method":"setPilot","params":{"state":false}}', callback);
    }

    turnOn(pilotBuilder, callback) {
        // Turns the light On

        this.sendUDPMessage(pilotBuilder.getPilotMessage(), callback);
    }

    updateState(callback) {
        
        this.sendUDPMessage('{"method":"getPilot","params":{}}', callback);

    }

    sendUDPMessage(message, callback) {
        // Send the UDP message to the bulb

        console.log(message);

        var data = Buffer.from(message)

        client.send(data, 38899, this.ip, err => {

            // Data failed to send
            if (err) {

                this.logError(err);

                // Send the error
                if (typeof callback !== 'undefined') {
                    callback(err);
                }

            } else {

                // Data successfully sent
                // console.log('Data sent.');
        
                // Parse the data into object
                let parsedData = JSON.parse(data)
        
                // Split actions for set and get functions
                if (parsedData.method === 'setPilot') {

                    // For setPilot get the response
                    client.on('message', (msg, info) => {
        
                        // Parse the msg received        
                        let res = JSON.parse(msg);

                        // Check if there was any error
                        if (res.result != undefined) {

                            console.log('Success!');

                            if (typeof callback !== 'undefined') {
                                callback(res);
                            }

                        } else {

                            // If any error log the error in console
                            console.log(res.error);

                            if (typeof callback !== 'undefined') {
                                callback(res);
                            }
                        }
            
                    });
        
                } else {

                    // For getPilot send the response back
                    client.on('message', (msg, info) => {
        
                        // Parse the msg received        
                        let res = JSON.parse(msg);

                        // Save the info
                        this.info = res;
                        console.log('Finished!');

                        if (typeof callback !== 'undefined') {
                            callback(this.info);
                        }
            
                    });
        
                }
        
            }

        });

        
    }

}

module.exports.wizlight = wizlight;
module.exports.PilotBuilder = PilotBuilder;