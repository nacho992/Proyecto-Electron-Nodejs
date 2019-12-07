const fs = require('fs');


let datosProd
let misDatosProd

if(fs.existsSync("src/views/tablaProd.json")){

    datosProd = fs.readFileSync('src/views/tablaProd.json', 'utf-8');
    if (datosProd !== '') {
        misDatosProd = JSON.parse(datosProd);
    }
    
}else{

    misDatosProd = []
    fs.appendFile('src/views/tablaProd.json', misDatosProd, (err) => {
        if (err) throw err;});
}


var Tabulator = require('tabulator-tables');


function miTablaProd(datos) {
    document.getElementById("actualizarMontoTotal").disabled = true
    document.getElementById("agregar").disabled = true
    
    var table = new Tabulator("#tableClientes", {
        
        height:"550px",
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
    
        fs.writeFileSync('src/views/tablaProd.json', jsonProd, 'utf-8');
     
    });
 
    
}

document.querySelector("#stock").addEventListener('click', () => { miTablaProd(misDatosProd),
    document.getElementById("tipoTabla").innerHTML = `<div class="bs-component">
    <div class="alert alert-dismissible alert-info">
    <strong>Stock Productos</strong>
    </div></div>`
});


//Create Date Editor
var dateEditor = function(cell, onRendered, success, cancel){
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass the successfuly updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
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