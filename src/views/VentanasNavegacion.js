const remote = require('electron').remote

const index = remote.require('./index.js')


document.querySelector("#agregarCli").addEventListener('click', () =>{
  index.nuevoCli()
});


document.querySelector("#agregarProd").addEventListener('click', () =>{
  index.nuevoProd()
});