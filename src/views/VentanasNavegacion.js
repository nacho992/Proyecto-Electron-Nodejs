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
          index.editarCli();
});