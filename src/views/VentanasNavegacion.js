const remote = require('electron').remote

const index = remote.require('./index.js')


document.querySelector("#agregarCli").addEventListener('click', () =>{
  index.nuevoCli()
});


document.querySelector("#agregarProd").addEventListener('click', () =>{
  index.nuevoProd()
});

document.querySelector("#agregar").addEventListener('click', () => {
  index.BuscarCliente()
});


document.querySelector("#editar").addEventListener('click', () => {
  index.BuscarCliente()
  const { ipcRenderer, dialog } = require('electron');

  var numCliente; 
  ipcRenderer.on('cliente',(e,numero) => {

    numCliente = numero; 
    
    
      const datosClientes = fs.readFileSync('src/views/tabla.json', 'utf-8');
      let datosJson = JSON.parse(datosClientes);
    
      const datosCli = fs.readFileSync('src/views/MisClientes.json', 'utf-8');
      let MisClientes = JSON.parse(datosCli);
    
      ok = true
      if (ok) {
        
          for (let index = 0; index < datosJson.length; index++) {
            if(datosJson[index]["numCliente"] === numCliente){
                datosJson[index]["nombre"] = datosJson[index]["nombre"] + "*";
                
            }
          };

          for (let index = 0; index < MisClientes.length; index++) {
            if(MisClientes[index]["numCliente"] === numCliente){
              MisClientes[index]["nombre"] = MisClientes[index]["nombre"] + "*";
              
            }
          };
          const jsonProd = JSON.stringify(datosJson);
          const MisClientesSt = JSON.stringify(MisClientes);

          fs.writeFileSync('src/views/tabla.json', jsonProd, 'utf-8');
          fs.writeFileSync('src/views/MisClientes.json', MisClientesSt, 'utf-8');
        
          index.editarCli();
      }else{
        dialog.showErrorBox('Cliente repetido','El numero de cliente ya existe');
      }

    });

});