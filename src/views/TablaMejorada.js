
const datosClientes = fs.readFileSync('src/views/tabla.json', 'utf-8');
let misDatos = JSON.parse(datosClientes);




var Tabulator = require('tabulator-tables');


function miTabla() {
    
    const { ipcRenderer } = require('electron');
    ipcRenderer.on('datosJson', (e, datos) => {
        misDatos =  datos
    });

    
    var table = new Tabulator("#tableClientes", {
        
        height:"400px",
        data:misDatos,
        clipboard:true,
        clipboardPasteAction:"replace",
        columns:[
            {title:"Nombre", field:"nombre", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Apellido", field:"apellido", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"DNI", field:"dni", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Domicilio", field:"dom", width:180, editor:"input",headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Telefono", field:"tel", width:180, editor:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Correo", field:"correo", width:180, editor:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Localidad", field:"localidad", width:180, editor:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Fecha de Pago", field:"fechadepago", editor:"input" , align:"center", sorter:"date", width:180, editor:dateEditor,headerFilter:"input",cssClass:"table-bordered",cssClass:"table-primary"},
            {title:"Pago", field:"pago", align:"pago", editor:true, formatter:"tickCross",headerFilter:"tickCross",  headerFilterParams:{"tristate":true},headerFilterEmptyCheck:function(value){return value === null},cssClass:"table-bordered",cssClass:"table-primary"},
        ],
    });
    
    
    document.querySelector("#guardarCambios").addEventListener('click', e => {
        var data = table.getData();
    
        var jsonCLientes = JSON.stringify(data);
    
        fs.writeFileSync('src/views/tabla.json', jsonCLientes, 'utf-8');
     
    });
 
    
}
document.querySelector("#boton").addEventListener('click', miTabla);
miTabla();




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

