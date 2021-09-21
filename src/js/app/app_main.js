const { ipcMain } = require("electron");

ipcMain.on('updateTextSize', (data) => {
    console.log(data)
})