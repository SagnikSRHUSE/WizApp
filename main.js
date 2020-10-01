const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
// process.env.NODE_ENV = 'production';

const fixPath = require('fix-path');
fixPath();

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function() {

    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 800,
        height: 525,
    });

    // Load HTML file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './html/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    mainWindow.setMenu(mainMenu);

});


// Handle create add window
function createAddWindow() {

    // Create new window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Add device by IP'
    });

    // Load HTML file
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, './html/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    });

    // Build menu from template
    const addMenu = Menu.buildFromTemplate(addMenuTemplate);
    // Insert menu
    addWindow.setMenu(addMenu);
    
}


// Catch ip:add
ipcMain.on('ip:add', (e, item) => {
    mainWindow.webContents.send('ip:add', item);
    addWindow.close();
});


// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Bulb',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

const addMenuTemplate = [
    {
        label: 'Quit',
        click() {
            addWindow.close();
        }
    }
]

// If Mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'CmdOrCtrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
