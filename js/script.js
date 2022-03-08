class Coleccion{
    constructor(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible){
        this.autorImagen = autorImagen,
        this.descripcionImagen = descripcionImagen,
        this.categoriaImagen = categoriaImagen,
        this.fechaPublicacion = fechaPublicacion,
        this.tipoBlockchain = tipoBlockchain,
        this.precio = precio,
        this.cantidadDisponible = cantidadDisponible
    }

    EthADolar(){
        this.precio * eth;
    }
    BtcADolar(){
        this.precio * btc;
    }
    DogeADolar(){
        this.precio * doge;
    }
}
//----------constate de valor en dolares de las blockchain

const eth = 2673.91;
const btc = 40768.60;
const doge = 0.13;
let formColecciones = document.getElementById("formColecciones");
let botonColeccion = document.getElementById("botonColeccion");
let divColecciones = document.getElementById("divColecciones");
let botonColecciones = document.getElementById("botonColecciones");
let mensajeExiste = document.getElementById("mensajeExiste");
let tablaTopColecciones = document.getElementById("tablaTopColecciones")
let modalBody = document.querySelector(".modalBody");
let botonOrdenaPrecioAsc = document.getElementById("botonOrdenaPrecioAsc");
let botonOrdenaPrecioDesc = document.querySelector("#botonOrdenaPrecioDesc");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let colecciones = [];


//---------consulto si localstorage existe. Si existe traigo el array de colecciones. Si no existe, lo creo
if(localStorage.getItem('colecciones')){
    colecciones = JSON.parse(localStorage.getItem('colecciones'))
}
else{
    localStorage.setItem('colecciones', JSON.stringify(colecciones))
}

//---------evento para agregar coleccion al array

formColecciones.addEventListener('submit', (e) => {
    e.preventDefault();

    //-----defino las variables para almacenar los valores de los inputs
    let imagenColeccion = document.getElementById('imagenColeccion').value;
    let autorImagen = document.getElementById('autor').value;
    let descripcionImagen = document.getElementById('descripcion').value;
    let categoriaImagen = document.getElementById('categoria').value;
    let fechaPublicacion = document.getElementById('fecha').value;
    let tipoBlockchain = document.getElementById('tipoBlockchain').value;
    let precio = document.getElementById('precio').value;
    let cantidadDisponible = document.getElementById('disponibilidad').value;



    //-------consulto si la coleccion que se va a cargar ya se encuentra en el array de colecciones. Si no se encuentra la agrego
    if (!colecciones.some(coleccionArray => coleccionArray.autorImagen == autorImagen && coleccionArray.descripcionImagen == descripcionImagen)) {
        const coleccion = new Coleccion(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible);

        //-------agrego el item al array de colecciones
        colecciones.push(coleccion);

        //----------actualizo el localstorage
        localStorage.setItem('colecciones', JSON.stringify(colecciones));

        //---------reseteo el formulario y pongo el foco en el input de Autor
        formColecciones.reset();

        mensajeExiste.innerHTML = "";

        document.getElementById('autor').focus();
    }
    //--------si el autor o la coleccion ya existen, muestro un alert con un mensaje de que ya existe.
    else{
        mensajeExiste.innerHTML += `
        <div class="alert alert-warning" role="alert">
            La colección ya existe. Reintente
        </div>`;
    }
    mostrarColecciones();
});

//-----------funcion


//-----------mostrar colecciones
const mostrarColecciones = () =>{
    divColecciones.innerHTML = "";
    //------defino una variable para buscar en el localstorage la informacion guardada
    let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
    //------recorro cada item del array y a partir de cada uno, creo una card mostrando los datos
    coleccionesStorage.forEach((coleccion, indice) =>{

        divColecciones.innerHTML += `
        <div class="card" id="coleccion${indice}">
        <div class="card-body">
            <img src="https://pbs.twimg.com/profile_images/1484354582582947841/XHOnlBj-_400x400.png" class="card-img-top imgCard" alt="${coleccion.descripcionImagen}">
            <h5 class="card-title autor">Autor: ${coleccion.autorImagen}</h5>
            <p class="card-text descripcion">Descripcion: ${coleccion.descripcionImagen}</p>
            <p class="card-text categoria">Categoría: ${coleccion.categoriaImagen}</p>
            <p class="card-text fecha">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
            <p class="card-text precio">Precio: ${coleccion.precio} ${coleccion.tipoBlockchain}</p>
            <p class="card-text disponibilidad">Disponibilidad: ${coleccion.cantidadDisponible}</p>
            </br>
            <button class="btn-agregar btn btn-dark" id="botonAgregarCarrito" data-id="${indice}">Agregar 🛒</button>
        </div>
        </div>
        `
    })
}

//--------obtener colecciones en la tabla a partir del localstorage

const llenarTabla = () =>{
    
    let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
    coleccionesStorage.forEach((coleccion) =>{

        //---------seteo una imagen dependiendo el tipo de opcion seleccionada
        let imagen = ""
        
        if(coleccion.tipoBlockchain === "ethereum"){
            imagen="https://img.icons8.com/cotton/30/000000/ethereum--v1.png";
            valorDolar = eth;
        }
        else if(coleccion.tipoBlockchain === "bitcoin"){
            imagen="https://img.icons8.com/color/30/000000/bitcoin--v1.png";
            valorDolar = btc;
        }
        else{
            imagen="https://img.icons8.com/fluency/30/000000/doge.png";
            valorDolar = doge;
        }

        //--------lleno la tabla con los datos obtenidos y los muesro en el DOM
        let tbody = document.createElement("tr");
            tbody.className = "tbody";
            tablaTopColecciones.appendChild(tbody);

            tbody.innerHTML += `
            <tr class="tr">
                <td class="td">${coleccion.descripcionImagen}</td>
                <td class="td">${coleccion.autorImagen}</td>
                <td class="td">${coleccion.precio * valorDolar}</td>
                <td class="td">${coleccion.precio} <img src="${imagen}" class="img-top imagenBlockchain" ></img></td>
            </tr>
                
            `
        
    })

    //----llamo a la funcion mostrarColecciones para mostrar las cards actualizadas
    mostrarColecciones();
}

//--------llamo al evento click del boton OrdenaPrecioAsc y realizo la operacion de orden

botonOrdenaPrecioAsc.addEventListener('click', (e) => {

        //----------------calcular el indice de la columna para ordenar y el numero de fila a aplicar el orden

        let table, rows, ordenando, i, a, b, cambiaOrden;
        //-------obtengo el id de la tabla creada en el html y la almaceno en la variable table
        table = document.getElementById("tablaTopColecciones");
        //-------creo un boolean y lo inicio como true
        ordenando = true;
        
        while (ordenando) {
            ordenando = false;
            rows = table.rows;
            
            for (i = 1; i < (rows.length - 1); i++) {

            cambiaOrden = false;
            a = rows[i].getElementsByTagName("TD")[2];
            b = rows[i + 1].getElementsByTagName("TD")[2];
           
            //-------comparo la info de las filas de la tabla y si es menor la fila a a la fila b, realizo el cambio de orden
            if (Number(a.innerHTML) < Number(b.innerHTML)) {
                cambiaOrden = true;
                break;
            }
            }
            if (cambiaOrden) {
            //-----------si el valor de a es mayor al de b, inserto el resultado de a antes de b y reordeno
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            ordenando = true;
            }
        }

})

//--------llamo al evento click del boton OrdenaPrecioDesc y realizo la operacion de orden

botonOrdenaPrecioDesc.addEventListener('click', (e) => {
    //----------------calcular el indice de la columna para ordenar y el numero de fila a aplicar el orden

    let table, rows, ordenando, i, a, b, cambiaOrden;
    table = document.getElementById("tablaTopColecciones");
    ordenando = true;
    
    while (ordenando) {
        ordenando = false;
        rows = table.rows;
        
        for (i = 1; i < (rows.length - 1); i++) {

        cambiaOrden = false;
        a = rows[i].getElementsByTagName("TD")[2];
        b = rows[i + 1].getElementsByTagName("TD")[2];
       
        if (Number(a.innerHTML) > Number(b.innerHTML)) {
            cambiaOrden = true;
            break;
        }
        }
        if (cambiaOrden) {
        
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        ordenando = true;
        }
    }
})

//----------- implementa dark mode

function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");

 }

 mostrarColecciones();
 llenarTabla();
