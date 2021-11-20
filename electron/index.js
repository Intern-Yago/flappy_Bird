const {app, BrowserWindow, Menu,MenuItem, shell} = require("electron")

let win
function createWindow() {
    win = new BrowserWindow({
        icon: __dirname+"/assets/logo.jpg",
        width: 320,
        height:480,
        fullscreen: false,
        resizable: false,
    })
    win.setMenu(null)
    win.loadFile("index.html")
}

app.on("ready", function(){
    createWindow()
    const ctxMenu = new Menu()
    ctxMenu.append(new MenuItem({
        label: 'GitHub',
        click: function(){
            shell.openExternal("https://github.com/Intern-Yago/flappy_Bird")
        }
    }))
    ctxMenu.append(new MenuItem({
        label: 'Autor',
        click: function(){
            shell.openExternal("https://intern-yago.github.io/")
        }
    }))
    win.webContents.on('context-menu', function(e, params){
        ctxMenu.popup(e, params.x, params.y)
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})