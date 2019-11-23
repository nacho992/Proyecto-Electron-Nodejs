const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');
const fs = require('fs');

let mainWindow;
let newProductWindow;


// Reload in Development for Browser Windows
if(process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });
}


app.on('ready', () => {

  // The Main Window
  mainWindow = new BrowserWindow({width: 2048, height: 800, webPreferences: { nodeIntegration: true }});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }))

  // Menu
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  // Set The Menu to the Main Window
  Menu.setApplicationMenu(mainMenu);

  // If we close main Window the App quit
  mainWindow.on('closed', () => {
    app.quit();
  });

});



function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 500,
    height: 460,
    title: 'Add A New Product'
  ,webPreferences: { nodeIntegration: true }});
  newProductWindow.setMenu(null);

  newProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/new-product.html'),
    protocol: 'file',
    slashes: true
  }));
  newProductWindow.on('closed', () => {
    newProductWindow = null;
  });
}

// recibe el mensaje desde new-Product
ipcMain.on('product:new', (e, newProduct) => {

  console.log(newProduct);

  const datosProd = fs.readFileSync('src/views/tablaProd.json', 'utf-8'); //Leo Json

  const datosProdParse = JSON.parse(datosProd); //se pasan los datos leidos a tipo objeto

  datosProdParse.push(newProduct) //se almacenan los objetos nuevos con los viejos leidos anteriormente

  const jsonProd = JSON.stringify(datosProdParse); //se pasa todo a String

  fs.writeFileSync('src/views/tablaProd.json', jsonProd, 'utf-8');

  
  mainWindow.webContents.send('product:new', newProduct);

});

function crearCliente() {
  nuevaVentana = new BrowserWindow({
    width: 500,
    height: 430,
    title: 'Agregar un nuevo cliente'
  ,webPreferences: { nodeIntegration: true }});
  nuevaVentana.setMenu(null);

  nuevaVentana.loadURL(url.format({
    pathname: path.join(__dirname, 'views/new-cliente.html'),
    protocol: 'file',
    slashes: true
  }));
  nuevaVentana.on('closed', () => {
    nuevaVentana = null;
  });
}



// Ipc Renderer Events
ipcMain.on('cliente:new', (e, nuevoCliente) => {
  // recibe mensaje de new-ckiente
  console.log(nuevoCliente);

  const datosCliente = fs.readFileSync('src/views/tabla.json', 'utf-8'); //Leo Json

  const datosClientesParse = JSON.parse(datosCliente);

  datosClientesParse.push(nuevoCliente)

  const jsonCLientes = JSON.stringify(datosClientesParse);

  fs.writeFileSync('src/views/tabla.json', jsonCLientes, 'utf-8');

  
  mainWindow.webContents.send('cliente:new', nuevoCliente);
  //nuevaVentana.close();
});




// Menu Template
const templateMenu = [
  {
    label: 'Opciones',
    submenu: [
      {
        label: 'Nuevo Producto',
        accelerator: 'Ctrl+P',
        click() {
          createNewProductWindow();
        },
      },
      {
        label: 'Nuevo Cliente',
        accelerator: 'Ctrl+C',
        click() {
          crearCliente();
        }
      },
      {
        label: 'Salir',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];


ipcMain.on('datosJson', (e, datos) => {
  // send to the Main Window
  console.log(datos);
  mainWindow.webContents.send('datosJson', datos);
});



exports.nuevoCli = () => {
  
  nuevaVentana = new BrowserWindow({
    width: 500,
    height: 430,
    title: 'Agregar un nuevo cliente'
  ,webPreferences: { nodeIntegration: true }});
  nuevaVentana.setMenu(null);

  nuevaVentana.loadURL(url.format({
    pathname: path.join(__dirname, '/views/new-cliente.html'),
    protocol: 'file',
    slashes: true
  }));
  nuevaVentana.on('closed', () => {
    nuevaVentana = null;
  });
}


exports.nuevoProd = () => {

  newProductWindow = new BrowserWindow({
    width: 500,
    height: 460,
    title: ''
  ,webPreferences: { nodeIntegration: true }});
  newProductWindow.setMenu(null);

  newProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/new-product.html'),
    protocol: 'file',
    slashes: true
  }));
  newProductWindow.on('closed', () => {
    newProductWindow = null;
  });

}

// if you are in Mac, just add the Name of the App
if (process.platform === 'darwin') {
  templateMenu.unshift({
    label: app.getName(),
  });
};

// Developer Tools in Development Environment
if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Show/Hide Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
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
