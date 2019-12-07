const fs = require('fs');


let datosProd
let misDatosProd

if(fs.existsSync("tablaProd.json")){

    datosProd = fs.readFileSync('tablaProd.json', 'utf-8');
    if (datosProd !== '') {
        misDatosProd = JSON.parse(datosProd);
    }
    
}else{

    misDatosProd = []
    fs.appendFile('tablaProd.json', misDatosProd, (err) => {
        if (err) throw err;});
    fs.writeFileSync('tablaProd.json',misDatosProd, 'utf-8');
}


var Tabulator = require('tabulator-tables');


function miTablaProd(datos) {
    document.getElementById("actualizarMontoTotal").disabled = true
    document.getElementById("agregar").disabled = true
    
    var table = new Tabulator("#tableClientes", {
        
        height:"500px",
        data:datos,
        clipboard:true,
        clipboardPasteAction:"replace",
        columns:[
            {formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false,print:false},
            {title:"Nombre", field:"name", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Precio unitario", field:"price", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Roto", field:"roto", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Usado", field:"usado", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Codigo", field:"codigo", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Cantidad Disponible", field:"cantidad", width:180, editor:"number",cssClass:"table-bordered",cssClass:"table-primary"}
        ],
    });

    document.querySelector("#borrarfila").addEventListener('click', e => {
        var selectedRows = table.getSelectedRows ();
        for (let index = 0; index < selectedRows.length; index++) {
            selectedRows[index].delete();
            
        }
   
    })
    
    
    document.querySelector("#guardarCambios").addEventListener('click', e => {
        var dataTable = table.getData();
    
        var jsonProd = JSON.stringify(dataTable);
    
        fs.writeFileSync('tablaProd.json', jsonProd, 'utf-8');

        window.location.reload(true);
     
    });
 
    
}

document.querySelector("#stock").addEventListener('click', () => { miTablaProd(misDatosProd),
    document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
    <div class="alert alert-dismissible alert-info">
    <strong>Stock Productos</strong>
    </div></div>`
});