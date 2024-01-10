const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
const { electron } = require('node:process')
const url = require('url')

//definir variables globales de las ventanas, no locales de sus funciones.
//importante hacerlo asi para luego gestionar las ventanas
let mainWindow;
let newProductWindow;

//funcion para recarga automatica de los componentes y del archivo principal sin tener que reinicar la aplicacion
if(process.env.NODE_ENV !== 'production'){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

//funcion que definira nuestra ventana
const createWindow = () => {
  //la funcion de la ventana en si
    mainWindow = new BrowserWindow({
      //especificaciones
      width: 800,
      height: 600,
      title:'Menu principal',
      //preload siempre tiene que llevarlo
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    //parte del menu
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu)
    
    //parte del frontend
    mainWindow.loadFile('views/index.html') 
  }

  //segunda ventana
  const createNewProductWindow = () => {
    newProductWindow = new BrowserWindow({
      width: 400,
      height: 330,
      title:'Menu principal',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    //para quitar el menu
    newProductWindow.setMenu(null);

    //parte del frontend
    newProductWindow.loadFile('views/new-product.html') 
  }

  //especificaciones de menu que luego podemos usar en un render
 const templateMenu = [{
    label: 'File',
    submenu: [{
      label: 'New Product',
      accelerator: 'Ctrl+N',
      click() {
        createNewProductWindow();
      }
    }]
  }]

  //funcion que se ejecuta cuando el programa esta listo
  app.whenReady().then(() => {
    createWindow()

    //funcion que se ejecuta cuando se cierra la ventana y que corta todos los procesos
    //tiene que ir dentro del ready
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit()
    });
  
    mainWindow.on('closed', () => {
      app.quit();
    });
  
  })