function traerDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', 'tabla.json', true);

    xhttp.send();

    xhttp.onreadystatechange = function() {

        if(this.readyState == 4 && this.status == 200){

            
            let datos = JSON.parse(this.responseText);
           

            //envio datos a tabla
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('datosJson',datos);

            let res = document.querySelector('#res');
            //res.innerHTML = '';
            //for(let item of datos){
                //res.innerHTML += `
                //<tr class= 'table-info'>
                    //<td>${item.nombre}</td>
                    //<td>${item.Apellido}</td>
                    //<td>${item.dni}</td>
                    //<td>${item.telefono}</td>
                    //<td>${item.direccion}</td>
                //</tr>
                //`
           //}
        }


    }

}

document.querySelector("#boton").addEventListener('click', traerDatos);