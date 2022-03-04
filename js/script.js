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
}

let formColecciones = document.getElementById("formColecciones");
let botonColeccion = document.getElementById("botonColeccion");
let divColecciones = document.getElementById("divColecciones");
let botonColecciones = document.getElementById("botonColecciones");
let mensajeExiste = document.getElementById("mensajeExiste");
let tablaTopColecciones = document.getElementById("tablaTopColecciones")

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

    let imagenColeccion = document.getElementById('imagenColeccion').value;
    let autorImagen = document.getElementById('autor').value;
    let descripcionImagen = document.getElementById('descripcion').value;
    let categoriaImagen = document.getElementById('categoria').value;
    let fechaPublicacion = document.getElementById('fecha').value;
    let tipoBlockchain = document.getElementById('tipoBlockchain').value;
    let precio = document.getElementById('precio').value;
    let cantidadDisponible = document.getElementById('disponibilidad').value;
    
    let datForm = new FormData(e.target);

    console.log(datForm.get('autor'));
    console.log(datForm.get('descripcion'));
    console.log(datForm.get('categoria'));
    console.log(datForm.get('fecha'));
    console.log(datForm.get('tipoBlockchain'));
    console.log(datForm.get('precio'));
    console.log(datForm.get('disponibilidad'));


    if (!colecciones.some(coleccionArray => coleccionArray.autorImagen == autorImagen && coleccionArray.descripcionImagen == descripcionImagen)) {
        const coleccion = new Coleccion(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible);

        colecciones.push(coleccion);

        localStorage.setItem('colecciones', JSON.stringify(colecciones));

        formColecciones.reset();

        mensajeExiste.innerHTML = "";

        document.getElementById('autor').focus();
    }
    else{
        mensajeExiste.innerHTML += `
        <div class="alert alert-warning" role="alert">
            La colección ya existe. Reintente
        </div>`;
    }
});

//evento para mostrar las colecciones agregadas en la card de colecciones

botonColecciones.addEventListener('click', () =>{
    divColecciones.innerHTML = "";
        let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
        coleccionesStorage.forEach((coleccion, indice) =>{
            divColecciones.innerHTML += `
            <div class="card" id="coleccion${indice}">
            <div class="card-body">
                <img src="https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" class="card-img-top imgCard" alt="${coleccion.descripcionImagen}">
                <h5 class="card-title">Autor: ${coleccion.autorImagen}</h5>
                <p class="card-text">Descripcion: ${coleccion.descripcionImagen}</p>
                <p class="card-text">Categoría: ${coleccion.categoriaImagen}</p>
                <p class="card-text">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
                <p class="card-text">Precio: ${coleccion.precio} ${coleccion.tipoBlockchain}</p>
                <p class="card-text">Disponibilidad: ${coleccion.cantidadDisponible}</p>
                </br>
                <button class="btn btn-primary" id="botonAgregarCarrito">Agregar 🛒</button>
                <button class="btn btn-danger" id="botonEliminarDelCarrito">Eliminar</button>
            </div>
            </div>
            `
        })
});

//-----------mostrar colecciones
const mostrarColecciones = () =>{
    divColecciones.innerHTML = "";
        let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
        coleccionesStorage.forEach((coleccion, indice) =>{
            divColecciones.innerHTML += `
            <div class="card" id="coleccion${indice}">
            <div class="card-body">
                <img src="https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" class="card-img-top imgCard" alt="${coleccion.descripcionImagen}">
                <h5 class="card-title">Autor: ${coleccion.autorImagen}</h5>
                <p class="card-text">Descripcion: ${coleccion.descripcionImagen}</p>
                <p class="card-text">Categoría: ${coleccion.categoriaImagen}</p>
                <p class="card-text">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
                <p class="card-text">Precio: ${coleccion.precio} ${coleccion.tipoBlockchain}</p>
                <p class="card-text">Disponibilidad: ${coleccion.cantidadDisponible}</p>
                </br>
                <button class="btn btn-primary" id="botonAgregarCarrito">Agregar 🛒</button>
                <button class="btn btn-danger" id="botonEliminarDelCarrito">Eliminar</button>
            </div>
            </div>
            `
        })
}

//--------obtener colecciones en la tabla



//-----------dark mode

function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");

 }

 mostrarColecciones();