// Basic Functions
function turnOff(ip) {
    
    let light = new wizlight(ip);
        light.turnOff();
    
}

function turnOn(ip, pilotBuilder) {
    
    let light = new wizlight(ip);
        light.turnOn(new PilotBuilder());
    
}


// UNIVERSAL FUNCTIONS
// BRIGHTNESS
function setBrightness(ip) {

    let brightness = parseInt(document.querySelector('#brightness input').value);

    let light = new wizlight(ip);
        light.turnOn(new PilotBuilder(undefined, undefined, undefined, undefined, undefined, brightness));
    
}
// BRIGHTNESS END
// UNIVERSAL FUNCTIONS END


// MODES
// SCENES
function setScene(ip) {
    
    let sceneSel = document.querySelector('#sceneSel');
    
    let sceneId = parseInt(sceneSel.value);

    if (sceneId === 0) return;
    
    let light = new wizlight(ip);
    light.turnOn(new PilotBuilder(undefined, undefined, undefined, sceneId));

    let indicator = document.querySelector('#toggle span');

    indicator.textContent = 'On';
    indicator.classList.remove('btn-danger');
    indicator.classList.add('btn-success')
    
}

function setSpeed(ip) {

    let speed = parseInt(document.querySelector('#speed input').value);

    let light = new wizlight(ip);
        light.turnOn(new PilotBuilder(undefined, undefined, speed));
}
// SCENES END

// COLORTEMP
function setTemp(ip) {

    let temp = parseInt(document.querySelector('#color-temp div input').value);

    let light = new wizlight(ip);
        light.turnOn(new PilotBuilder(undefined, undefined, undefined, undefined, undefined, undefined, temp));
    
}
// COLORTEMP END

// RGBCW
function setRGB(ip) {

    let red = parseInt(document.querySelector('#red input').value);
    let green = parseInt(document.querySelector('#green input').value);
    let blue = parseInt(document.querySelector('#blue input').value);
    let warm = parseInt(document.querySelector('#warm input').value);
    let cold = parseInt(document.querySelector('#cold input').value);

    let light = new wizlight(ip);
        light.turnOn(new PilotBuilder(warm, cold, undefined, undefined, [red, green, blue]));
    
}
// MODES END


module.exports = {
    turnOff: turnOff,
    turnOn: turnOn,
    setBrightness: setBrightness,
    setScene: setScene,
    setSpeed: setSpeed,
    setTemp: setTemp,
    setRGB: setRGB
}