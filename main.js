const electron = require("electron");
const url = require("url");
const path = require("path");
const settings = require('electron-settings');

const {app, BrowserWindow, Menu} = electron;

let CalendarWindow;
let SettingsWindow;

process.env.NODE_ENV = "production";

// Listen for app ready
app.on("ready", function() {
    // Create new window
    CalendarWindow = new BrowserWindow({
        width: 500,
        height: 500,
        icon: "assets/icons/win/icon.ico",   
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false
    });

    // Load html file
    CalendarWindow.loadURL(url.format({
        pathname: path.join(__dirname, "CalendarWindow.html"),
        protocol: "file:",
        slashes: true
    }));

    // Build Menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // No Menu
    Menu.setApplicationMenu(null);
});

// Catch settings


const menuTemplate = [
    {
        label: "File",
        submenu: []
    }
];

// If mac add empty obj to menu
if(process.platform =="darwin") {
    menuTemplate.unshift({});
}

// Add developer tools if not production mode
if(process.env.NODE_ENV !== "production") {
    menuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator: "CmdOrCtrl+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }
        ]
    })
}