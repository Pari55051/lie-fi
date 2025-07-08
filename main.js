const { app, BrowserWindow } = require("electron");
const path = require("path");


function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();
});

app.on('windows-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});