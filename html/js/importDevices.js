const fs = require('fs');
const storage = require('electron-json-storage');
 
const dataPath = storage.getDataPath();

function loadDevicesFromFile() {
    
    let rawdata = fs.readFileSync(dataPath + '/devices.json');
    let devices = JSON.parse(rawdata);
    
    devices.devices.forEach(device => {
    
        let ul = document.querySelector('#device-list');
        let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.setAttribute("onclick", "loadDevice(this.id)")
            li.setAttribute("id", "device-" + device.id)
        let text = document.createTextNode(device.ip);
    
        li.appendChild(text);
        ul.appendChild(li);
        
    });

}

module.exports.loadDevicesFromFile = loadDevicesFromFile;