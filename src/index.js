const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');

const url = require('url');
const path = require('path');
const fs = require('fs');

let mainWindow;
let newProductWindow;
let ventanaEditar;


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

  
  //mainWindow.webContents.send('product:new', newProduct);

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
  // recibe mensaje de new-cliente
  console.log(nuevoCliente);

  const datosCliente = fs.readFileSync('src/views/tabla.json', 'utf-8'); //Leo Json que contiene cantidad de cuotas y montos.
  const datosC = fs.readFileSync('src/views/MisClientes.json', 'utf-8');
  

  const datosClientesParse = JSON.parse(datosCliente);
  const datosCParse = JSON.parse(datosC);


  //se verifica por numero de cliente que no se repita
  var ok = true;
  for (let index = 0; index < datosCParse.length; index++) {
    if (datosCParse[index]["numCliente"] === nuevoCliente["numCliente"]) {
      dialog.showErrorBox('Cliente repetido','El numero de cliente ya existe');
      ok = false;
    }
  }
  if (ok) {
    datosClientesParse.push(nuevoCliente);
    datosCParse.push(nuevoCliente);
  }
  

  const jsonCLientes = JSON.stringify(datosClientesParse);
  const jsonC = JSON.stringify(datosCParse);

  fs.writeFileSync('src/views/tabla.json', jsonCLientes, 'utf-8');
  fs.writeFileSync('src/views/MisClientes.json', jsonC, 'utf-8');

  
});

function backup(){

    const datosCliente = fs.readFileSync('src/views/tabla.json', 'utf-8');
    const datosC = fs.readFileSync('src/views/MisClientes.json', 'utf-8');

    fs.appendFile('ClientesActivos.json',datosCliente ,'utf-8', (err) => {
      if (err) throw err;
      console.log('Archivo Creado Satisfactoriamente');
    });
    fs.appendFile('misClientes.json',datosC ,'utf-8', (err) => {
      if (err) throw err;
      console.log('Archivo Creado Satisfactoriamente');
    });
    const options = {
      type: 'info',
      buttons: ['Ok'],
      defaultId: 2,
      title: 'BackUp generado',
      message: 'Se guardó un backUp exitosamente',
      detail: 'toda la informacion se guardó correctamente',
    };
  
    dialog.showMessageBox(null, options);
  }
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
        label: 'BackUp',
        click() {
          backup();
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



exports.BuscarCliente = () => {

  nuevaVentana = new BrowserWindow({
    width: 500,
    height: 250,
    title: 'Buscar'
  ,webPreferences: { nodeIntegration: true }});
  //nuevaVentana.setMenu(null);

  nuevaVentana.loadURL(url.format({
    pathname: path.join(__dirname, '/views/agregarCLiente.html'),
    protocol: 'file',
    slashes: true
  }));
  nuevaVentana.on('closed', () => {
    nuevaVentana = null;
  });

}


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


ipcMain.on('cliente', (e, numero) => {
  // send to the Main Window
  console.log(numero);
  mainWindow.webContents.send('cliente', numero);
});


exports.editarCli = () => {
  
  ventanaEditar = new BrowserWindow({
    width: 500,
    height: 430,
    title: 'Editar cliente'
  ,webPreferences: { nodeIntegration: true }});
  //ventanaEditar.setMenu(null);

  ventanaEditar.loadURL(url.format({
    pathname: path.join(__dirname, '/views/editarCliente.html'),
    protocol: 'file',
    slashes: true
  }));
  ventanaEditar.on('closed', () => {
    ventanaEditar = null;
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
