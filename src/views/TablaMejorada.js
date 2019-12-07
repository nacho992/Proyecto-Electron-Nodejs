//se levanta los datos del archivo

let datosClientes
let datosJson = []

let datosCli 
let MisClientes

if(fs.existsSync("tabla.json")){

        datosClientes = fs.readFileSync('tabla.json', 'utf-8');
        if (datosClientes !== '') {
            datosJson = JSON.parse(datosClientes);
        }
        
}else{

    datosJson = []
    fs.appendFile('tabla.json', datosJson, (err) => {
        if (err) throw err;});
        fs.writeFileSync('tabla.json', datosJson, 'utf-8');
}

if(fs.existsSync("MisClientes.json")){

    datosCli = fs.readFileSync('MisClientes.json', 'utf-8');
    if (datosCli !== '') {
        MisClientes = JSON.parse(datosCli);
    }
    

}else{
    MisClientes = []
    fs.appendFile('MisClientes.json', [], (err) => {
    if (err) throw err;});
    fs.writeFileSync('MisClientes.json',MisClientes, 'utf-8');
}

//se generan las tablas

var Tabulator = require('tabulator-tables');


function miTabla(misDatos) {
    document.getElementById("actualizarMontoTotal").disabled = false
    document.getElementById("agregar").disabled = false

    var dateEditor = function(cell, onRendered, success, cancel){
        //cell - the cell component for the editable cell
        //onRendered - function to call when the editor has been rendered
        //success - function to call to pass the successfuly updated value to Tabulator
        //cancel - function to call to abort the edit and return to a normal cell
    
        //create and style input
        var moment = require('moment');
        var cellValue = moment(cell.getValue(), "DD/MM/YYYY").format("YYYY-MM-DD"),
        input = document.createElement("input");
    
        input.setAttribute("type", "date");
    
        input.style.padding = "4px";
        input.style.width = "100%";
        input.style.boxSizing = "border-box";
    
        input.value = cellValue;
    
        onRendered(function(){
            input.focus();
            input.style.height = "100%";
        });
    
        function onChange(){
            if(input.value != cellValue){
                success(moment(input.value, "YYYY-MM-DD").format("DD/MM/YYYY"));
            }else{
                cancel();
            }
        }
    
        //submit new value on blur or change
        input.addEventListener("blur", onChange);
    
        //submit new value on enter
        input.addEventListener("keydown", function(e){
            if(e.keyCode == 13){
                onChange();
            }
    
            if(e.keyCode == 27){
                cancel();
            }
        });
    
        return input;
    };
    

    var table = new Tabulator("#tableClientes", {

        selectable:true,
        printConfig:{
            columnGroups:false, //do not include column groups in column headers for HTML table
            rowGroups:false, //do not include row groups in HTML table
            columnCalcs:false, //do not include column calcs in HTML table
        },
        printAsHtml:true,
        printVisibleRows:false,
        footerElement:"<button type=button class=btn btn-primary id=imprimir>Imprimir</button>",
        height:"500px",
        data:misDatos,
        clipboard:true,
        clipboardPasteAction:"replace",
        columns:[
            {formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false,print:false},
            {title:"Nombre", field:"nombre", width:180,bottomCalc:"count",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Codigo", field:"cod", editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Zona", field:"zona", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Dirección", field:"dom",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Telefono", field:"tel", width:180,cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Cantidad de cuotas", field:"cantidadCuotas", editor:"number",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Monto", field:"montoCuota", editor:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Monto Total", field:"montoTotal",bottomCalc:"sum",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Fecha de Pago", field:"fechadepago", editor:dateEditor, headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
        ],
    });



    document.querySelector("#agregar").addEventListener('click', () => {

        var cliAgregado;

        //index.BuscarCliente();

        const { ipcRenderer } = require('electron');
        ipcRenderer.on('cliente',(e,numero) => {
                
            const numCli = numero;
            for (let index = 0; index < MisClientes.length; index++) {
                if (MisClientes[index]["numCliente"] === numCli) {
                    cliAgregado = MisClientes[index];
                }
            }
            table.addRow(cliAgregado);
            
        });
    });


    

    
    document.querySelector("#actualizarMontoTotal").addEventListener('click',e => {
        //se actualiza Monto total
        misDatos['montoTotal'] = table.getData().cantidadCuotas * table.getData().montoCuota
    
        for (let index = 0; index < misDatos.length; index++) {
           misDatos[index]["montoTotal"] = misDatos[index]["cantidadCuotas"]*misDatos[index]["montoCuota"];

        }

        //se guardan los datos actulizados de la tabla en el archivo
        var data = table.getData();
        
        var jsonCLientes = JSON.stringify(data);
    
        fs.writeFileSync('tabla.json', jsonCLientes, 'utf-8');

        window.location.reload(true);
    
    });


    //Eliminar seleccionados.
    document.querySelector("#borrarfila").addEventListener('click', e => {
        var selectedRows = table.getSelectedRows ();
        for (let index = 0; index < selectedRows.length; index++) {
            selectedRows[index].delete();
        }
        
    })
        

   

    document.querySelector("#guardarCambios").addEventListener('click', e => {

        //se actualiza Monto total
        misDatos['montoTotal'] = table.getData().cantidadCuotas * table.getData().montoCuota
    
        for (let index = 0; index < misDatos.length; index++) {
           misDatos[index]["montoTotal"] = misDatos[index]["cantidadCuotas"]*misDatos[index]["montoCuota"];

        }


        //se guardan los datos actulizados de la tabla en el archivo
        var data = table.getData();
        
        var jsonCLientes = JSON.stringify(data);
    
        fs.writeFileSync('tabla.json', jsonCLientes, 'utf-8');

        window.location.reload(true);
    });
 
    document.querySelector("#imprimir").addEventListener('click',e => {table.print(false,true)})
}



function tablaMisClientes(misDatos) {

    document.getElementById("actualizarMontoTotal").disabled = true
    document.getElementById("agregar").disabled = true
    

    var table = new Tabulator("#tableClientes", {
        printConfig:{
            columnGroups:false, //do not include column groups in column headers for HTML table
            rowGroups:false, //do not include row groups in HTML table
            columnCalcs:false, //do not include column calcs in HTML table
        },
        height:"500px",
        data:misDatos,
        clipboard:true,
        clipboardPasteAction:"replace",
        columns:[
            {formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false},
            {title:"Nombre", field:"nombre", width:180,bottomCalc:"count",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Apellido", field:"apellido", width:180,headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Dirección", field:"dom", width:180,headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Teléfono", field:"tel", width:180,cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Reputación", field:"reputacion", width:180, editor:"select", editorParams:{values:{Mala:"Mala",Regular:"Regular",Buena:"Buena",Excelente:"Exelente"}},cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Numero de Cliente", field:"numCliente", width:180,cssClass:"table-bordered",cssClass:"table-primary"}
        ],
    });
    

    //Eliminar seleccionados.
    document.querySelector("#borrarfila").addEventListener('click', e => {
        var selectedRows = table.getSelectedRows ();
        for (let index = 0; index < selectedRows.length; index++) {
            selectedRows[index].delete();
            
        }
   
    })

   

    document.querySelector("#guardarCambios").addEventListener('click', e => {


        //se guardan los datos actulizados de la tabla en el archivo
        var data = table.getData();
        
        var jsonCLientes = JSON.stringify(data);
    
        fs.writeFileSync('MisClientes.json', jsonCLientes, 'utf-8');

        window.location.reload(true);
    });
}


//se genera nueva estructura para aquello objetos con solo la fecha actual
let datosEnfecha = [];
var moment = require('moment');

//se lee fecha actual
var fechaHoy = moment().format("DD/MM/YYYY");

//se recorre los archivos que se lvantaron buscando solo los que coinciden con la fecha actual.

if (datosJson.length != 0 ) {
    
    for (let index = 0; index < datosJson.length; index++) {
       
        if (fechaHoy == datosJson[index]["fechadepago"]) {
        
           datosEnfecha.push(datosJson[index]);
           
        }
         
     }
}



//se inician las tablas
//Indicadores de seguimiento para las tablas, cada tabla mostrata un titulo que referencia que tipo de tabla es.
document.querySelector("#fechaHoy").addEventListener('click', () => { miTabla(datosEnfecha),
            document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
            <div class="alert alert-dismissible alert-info">
            <strong>Clientes para pagar en el dia de la fecha ${fechaHoy}</strong>
            </div></div>`
        });

document.querySelector("#clientesActivos").addEventListener('click', () => { 
            miTabla(datosJson)
            document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
            <div class="alert alert-dismissible alert-info">
            <strong>   Todos los clientes activos  </strong>
            </div></div>`


        });

document.querySelector("#misClientes").addEventListener('click', () => { tablaMisClientes(MisClientes)
            document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
            <div class="alert alert-dismissible alert-info">
            <strong>Mis Clientes</strong>
            </div></div>`});



//si en la estructura datosEnFecha esta vacia se informa en pantalla. Caso contrario se se cargan los clientes con la fecha actual.            
if (datosEnfecha.length === 0 ) {
    
    document.getElementById("#alert").innerHTML = `<div class="alert alert-dismissible alert-success">
    <strong>Sin clientes.</strong> No hay Clientes que deban pagar en el dia de la fecha ${fechaHoy}.
  </div>`
   
}else {
    miTabla(datosEnfecha);
    document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
    <div class="alert alert-dismissible alert-info">
    <strong>Clientes para pagar en el dia de la fecha ${fechaHoy}</strong>
    </div></div>`

}

