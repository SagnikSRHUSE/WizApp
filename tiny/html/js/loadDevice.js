const {wizlight, PilotBuilder} = require('./js/wiz_api.js');
const {turnOff, turnOn, setBrightness, setScene, setSpeed, setTemp, setRGB} = require('./js/lightFunctions.js')
const fs = require('fs');

function loadDevice(idOfEle) {

    let opened = document.querySelector('main')

    if (document.querySelector(`#${idOfEle}`).textContent == opened.getAttribute('data-ip')) return;
    
    // Hide the placeholder text
    let placeholder = document.querySelector("main p");
    placeholder.setAttribute('hidden', '');
    
    // Unhide the functions
    let functions = document.querySelector("#functions");
    functions.removeAttribute('hidden');
    
    // Get the IP
    let li = document.querySelector(`#${idOfEle}`);
    let ip = li.textContent;
    
    opened.setAttribute('data-ip', ip);    
    
    // Set the current stuff
    fetchCurrent(ip);    
    
    // Basic Functions
    // Toggle Switch
    let toggleBtn = document.querySelector('#toggle');
    toggleBtn.setAttribute('onclick', `toggle('${ip}')`);
    
    // Universal Functions
    // Brightness
    let brightnessSlider = document.querySelector('#brightness input');
    brightnessSlider.setAttribute('onchange', `setBrightness('${ip}')`)
    
    
    // Modes
    // Scenes
    let sceneSel = document.getElementById('sceneSel');
    sceneSel.setAttribute("onchange", `setScene('${ip}')`);
    
    let speedSlider = document.querySelector('#speed input');
    speedSlider.setAttribute('onchange', `setSpeed('${ip}')`);

    // Color Temp
    let tempSlider = document.querySelector('#color-temp div input');
    tempSlider.setAttribute('onchange', `setTemp('${ip}')`);

    //RGBCW
    initRGBCW(ip);
}

function fetchCurrent(ip) {
    
    let light = new wizlight(ip);
    updateSwitch(ip);

    light.updateState(info => {

        if (info.method === "setPilot") return;
        console.log('test');

        console.log(info);

        let brightnessSlider = document.querySelector('#brightness input');
        let speedSlider = document.querySelector('#speed input');
        let tempSlider = document.querySelector('#color-temp div input');

        let modeSel = document.querySelector('#modes');
        
        // Get the current stuff
        let currentSpeed = info.result.speed;
        let currentBrightness = convertPercentToHex(info.result.dimming);
        let colortemp = info.result.temp;
        let scene = info.result.sceneId;
        let r = info.result.r;
        let g = info.result.g;
        let b = info.result.b;
        let w = info.result.w;
        let c = info.result.c;

        if (colortemp !== undefined) {

            modeSel.selectedIndex = 2;
            loadMode();

            tempSlider.value = colortemp;
            document.querySelector('#color-temp div span').textContent = colortemp + 'K';

        } else if (scene !== undefined && scene !== 0) {

            modeSel.selectedIndex = 1;
            loadMode();

            let sceneSel = document.querySelector('#sceneSel');
            sceneSel.selectedIndex = scene;
            speedSlider.value = currentSpeed;
            document.querySelector('#speed span').textContent = currentSpeed + '%';

        } else if (r !== undefined) {

            modeSel.selectedIndex = 0;
            loadMode();

            document.querySelector('#red input').value = r;
            document.querySelector('#green input').value = g;
            document.querySelector('#blue input').value = b;
            document.querySelector('#warm input').value = c;
            document.querySelector('#cold input').value = w;

            let values = [r, g, b, c, w];

            let slidersSpans = document.getElementsByClassName('rgbcw-span');
            Array.from(slidersSpans).forEach((sliderSpan, index) => {
                sliderSpan.textContent = values[index];
            });

        }

        brightnessSlider.value = currentBrightness;
        let percent = (currentBrightness / 255) * 100;
        document.querySelector('#brightness span').textContent = Math.round(percent) + '%';
    });

}

function toggle(ip) {

    let light = new wizlight(ip);

    light.updateState(info => {
        
        if (info.method === 'setPilot') return;
            
        let state = info.result.state;
        let indicator = document.querySelector('#toggle span');
        if (state === true) {

            turnOff(ip);
            indicator.textContent = 'Off';
            indicator.classList.remove('btn-success');
            indicator.classList.add('btn-danger')

        } else {

            turnOn(ip);
            indicator.textContent = 'On';
            indicator.classList.remove('btn-danger');
            indicator.classList.add('btn-success')

        }

    });
    
}

function updateSwitch(ip) {

    let light = new wizlight(ip);

    light.updateState(info => {
        
        if (info.method === 'getPilot'){
            
            let state = info.result.state
            let indicator = document.querySelector('#toggle span')

            if (state === true) {
    
                indicator.textContent = 'On';
                indicator.classList.remove('btn-danger');
                indicator.classList.add('btn-success')
    
            } else {
    
                indicator.textContent = 'Off';
                indicator.classList.remove('btn-success');
                indicator.classList.add('btn-danger')
    
            }
        }
    });
    
}

function loadMode() {

    let modeSel = document.querySelector('#modes');

    const modes = ['rgb', 'scene', 'color-temp'];

    modes.forEach(mode => {

        let ele = document.getElementById(mode);

        if (mode === modeSel.value) {
            ele.removeAttribute('hidden');
        } else {
            ele.setAttribute('hidden', '');
        }
        
    });
}

function initScenes() {

    let sceneSel = document.getElementById('sceneSel');
    let scenes = {
        "scenes": [
            {
                "id": 1,
                "name": "Ocean"
            },
            {
                "id": 2,
                "name": "Romance"
            },
            {
                "id": 3,
                "name": "Sunset"
            },
            {
                "id": 4,
                "name": "Party"
            },
            {
                "id": 5,
                "name": "Fireplace"
            },
            {
                "id": 6,
                "name": "Cozy"
            },
            {
                "id": 7,
                "name": "Forest"
            },
            {
                "id": 8,
                "name": "Pastel Colors"
            },
            {
                "id": 9,
                "name": "Wake-Up"
            },
            {
                "id": 10,
                "name": "Bedtime"
            },
            {
                "id": 11,
                "name": "Warm White"
            },
            {
                "id": 12,
                "name": "Daylight"
            },
            {
                "id": 13,
                "name": "Cool White"
            },
            {
                "id": 14,
                "name": "Night Light"
            },
            {
                "id": 15,
                "name": "Focus"
            },
            {
                "id": 16,
                "name": "Relax"
            },
            {
                "id": 17,
                "name": "True Colors"
            },
            {
                "id": 18,
                "name": "TV Time"
            },
            {
                "id": 19,
                "name": "Plant Growth"
            },
            {
                "id": 20,
                "name": "Spring"
            },
            {
                "id": 21,
                "name": "Summer"
            },
            {
                "id": 22,
                "name": "Fall"
            },
            {
                "id": 23,
                "name": "Deep Dive"
            },
            {
                "id": 24,
                "name": "Jungle"
            },
            {
                "id": 25,
                "name": "Mojito"
            },
            {
                "id": 26,
                "name": "Club"
            },
            {
                "id": 27,
                "name": "Christmas"
            },
            {
                "id": 28,
                "name": "Halloween"
            },
            {
                "id": 29,
                "name": "Candlelight"
            },
            {
                "id": 30,
                "name": "Golden White"
            },
            {
                "id": 31,
                "name": "Pulse"
            },
            {
                "id": 32,
                "name": "Steampunk"
            }
        ]
    }

    scenes.scenes.forEach(scene => {
        
        let option = document.createElement('option');
            option.setAttribute('value', scene.id);
        let textNode = document.createTextNode(scene.name);

        option.appendChild(textNode);

        sceneSel.appendChild(option);
        
    });
    
}

initScenes()

function initRGBCW(ip) {

    let sliders = document.getElementsByClassName('rgbcw');

    Array.from(sliders).forEach(slider => {
        slider.setAttribute('onchange', `setRGB('${ip}')`);
    });
    
}


function convertPercentToHex(percent) {

    return Math.round((percent / 100) * 255);
    
}

module.exports = {
    updateSwitch: updateSwitch
}