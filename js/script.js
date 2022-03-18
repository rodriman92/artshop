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



//-----------declaracion de variables----------------------------------
let formColecciones = document.getElementById("formColecciones");
let botonColeccion = document.getElementById("botonColeccion");
let inputImage = document.querySelector("#imagenColeccion");
let divColecciones = document.getElementById("divColecciones");
let botonColecciones = document.getElementById("botonColecciones");
let mensajeExiste = document.getElementById("mensajeExiste");
let tablaTopColecciones = document.getElementById("tablaTopColecciones")
let tableBody = document.getElementById("tbody");
let botonOrdenaPrecioAsc = document.getElementById("botonOrdenaPrecioAsc");
let botonOrdenaPrecioDesc = document.querySelector("#botonOrdenaPrecioDesc");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let botonAgregarCarrito = document.getElementById("botonAgregarCarrito");
let modalCarrito = document.querySelector(".modalCarrito");
let tfoot = document.querySelector(".cant--carrito");
let colecciones = [];
let valorEnDolares;
let moneda;
let imagen;



//------creo una funcion para obtener como molde de fetch
async function obtenerColecciones(){
    const response = await fetch('./json/colecciones.json');
    return await response.json();
}


//---------consulto si localstorage existe. Si existe traigo el array de colecciones. Si no existe, lo creo
if(localStorage.getItem('colecciones')){
    colecciones = JSON.parse(localStorage.getItem('colecciones'))
}
else{
    localStorage.setItem('colecciones', JSON.stringify(colecciones))
}

//--------funcion para seleccionar una imagen y asignarla 



let imgArr = ["alien.jpeg","burro-dientes-dorados.jpg", "gallo.jpg", "mono-3d.jpg", "mono-4d.jpg","mono-capitan.jpg", "mono-psico.jpg", "mono-casco.jpeg","mono-dientes-de-oro.png", "mono-armadura.jpeg", "cool-bird.png", "mono-karate.jpg"];
function imgRandom(imgArr) {
    return imgArr[Math.floor(Math.random() * imgArr.length)];
}




//---------evento para agregar coleccion al array

formColecciones.addEventListener('submit', (e) => {
    e.preventDefault();

    //-----defino las variables para almacenar los valores de los inputs
    let autorImagen = document.getElementById('autor').value;
    let descripcionImagen = document.getElementById('descripcion').value;
    let categoriaImagen = document.getElementById('categoria').value;
    let fechaPublicacion = document.getElementById('fecha').value;
    let tipoBlockchain = document.getElementById('tipoBlockchain').value;
    let precio = document.getElementById('precio').value;
    let cantidadDisponible = document.getElementById('disponibilidad').value;




    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


    //-------consulto si la coleccion que se va a cargar ya se encuentra en el array de colecciones. Si no se encuentra la agrego
    if (!colecciones.some(coleccionArray => coleccionArray.autorImagen == autorImagen && coleccionArray.descripcionImagen == descripcionImagen)) {
        const coleccion = new Coleccion(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible);

        //-------agrego el item al array de colecciones
        colecciones.push(coleccion);

        //----------actualizo el localstorage
        localStorage.setItem('colecciones', JSON.stringify(colecciones));

        //---------reseteo el formulario y pongo el foco en el input de Autor
        formColecciones.reset();

        mostrarMensajeSwalToast();

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

//-----------funcion para obtener precio de cripto actualizado mediante la API de criptoya



//-----------mostrar colecciones
const mostrarColecciones = () =>{
    divColecciones.innerHTML = "";
    //------defino una variable para buscar en el localstorage la informacion guardada
    let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
    //------recorro cada item del array y a partir de cada uno, creo una card mostrando los datos
    coleccionesStorage.forEach((coleccion, indice) =>{

        
        if(coleccion.tipoBlockchain === "ethereum"){
            imagen="https://img.icons8.com/cotton/30/000000/ethereum--v1.png";
            moneda = "eth";
            
            
        }
        else if(coleccion.tipoBlockchain === "bitcoin"){
            imagen="https://img.icons8.com/fluency/30/000000/bitcoin--v1.png";
            moneda = "btc";
            
        }
        else if(coleccion.tipoBlockchain === "usdt"){
            imagen="https://img.icons8.com/color/30/000000/tether--v2.png";
            moneda = "usdt"
            
        }

        divColecciones.innerHTML += `

            <div class="col-md-8 col-lg-2 cardContenedor">
                
                <div class="card-box" id="coleccion${indice}">
                    <div class="card-thumbnail">
                    <img src="./media/nfts/${imgRandom(imgArr)}" class="img-fluid imgCard" alt="${coleccion.descripcionImagen}">
                    </div>
                    <h3><a href="#" class="mt-2 h3">Autor: ${coleccion.autorImagen}</a></h3>
                    <p class="card-text descripcion">Descripcion: ${coleccion.descripcionImagen}</p>
                    <p class="card-text categoria">Categoría: ${coleccion.categoriaImagen}</p>
                    <p class="card-text fecha">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
                    <p class="card-text precio">Valor: <span>${coleccion.precio}</span> <img src="${imagen}" class="img-top imagenBlockchain" ></img> </p>
                    <p class="card-text precioDolares">US$: ${coleccion.precio}</p>
                    <p class="card-text disponibilidad">Disponibilidad: ${coleccion.cantidadDisponible}</p>
                    </br>
                <button class="btn-agregar btn btn-light" id="botonAgregarCarrito" data-id="${indice}">Agregar al carrito</button>
                </div>
            </div>
            `
    
    });
    const btnAgregar = document.querySelectorAll(".btn-agregar");
    btnAgregar.forEach((e) =>
    e.addEventListener("click", (e) => {
      let cardPadre = e.target.parentElement;

      agregarAlCarrito(cardPadre);
      mostrarMensajeSwalToast();
    })
  );
    
}


//---------------funcion para agregar al carrito

const agregarAlCarrito = (cardPadre) => {
    let coleccion = {
        imagenColeccion: cardPadre.querySelector('.imgCard').src,
        descripcionImagen: cardPadre.querySelector('.descripcion').textContent,
        cantidad: 1,
        precio: Number(cardPadre.querySelector(".precio span").textContent),
        indice: Number(cardPadre.querySelector("button").getAttribute("data-id"))
    };
    let coleccionEncontrada = carrito.find(
        (element) => element.indice === coleccion.indice
      );
    
      if (coleccionEncontrada) {
        coleccionEncontrada.cantidad++;
      } else {
        carrito.push(coleccion);
      }
      console.log(carrito);
      mostrarCarrito();
}



//-------------mostrar el carrito en el modal

const mostrarCarrito = () =>{
    tableBody.innerHTML = "";
    carrito.forEach((element) => {

        let {imagenColeccion, descripcionImagen, cantidad, precio, indice} = element;
        let tbody = document.createElement("tr");
            tbody.className = "tbody";
            tableBody.appendChild(tbody);

            
            tbody.innerHTML += `
            <tr>
                <td class="w-25"><img src="${imagenColeccion}" class="card-img-top img-fluid img-thumbnail" style="vertical-align: middle;"></td>
                <td> ${descripcionImagen}</td>
                <td>${cantidad}</td>
                <td>US$ ${precio}</td>
                <td>US$ ${precio * cantidad}</td>
                <td>
                <button class="btn-restar btn btn-light" data-id="${indice}">-</button>
                <button class="btn-borrar btn btn-light" data-id="${indice}">X</button>
                </td>
            </tr>
            `        

    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    aumentarNumeroCantidadCarrito();
    calcularTotal();

};



//-----------funcion para calcular el total de la compra

//--------funcion para escuchar el los eventos en los botones del modal

const escucharBotonesModalCarrito = () => {
    modalCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains("btn-restar")) {
            restarColeccion(e.target.getAttribute("data-id"));
        }
        if (e.target.classList.contains("btn-borrar")) {    
            borrarColeccion(e.target.getAttribute("data-id"));
        }
    })
}

//-----------funcion para restar la coleccion del carrito

const restarColeccion = (coleccionRestar) => {
    let coleccionEncontrada = carrito.find(
      (element) => element.indice === Number(coleccionRestar)
    );
    if (coleccionEncontrada) {
        coleccionEncontrada.cantidad--;
      if (coleccionEncontrada.cantidad === 0) {
        borrarColeccion(coleccionRestar);
      }
    }
    mostrarCarrito();
  };


 //------------funcion para borrar la coleccion del carrito
 
 const borrarColeccion = (coleccionBorrar) => {
    carrito = carrito.filter((element) => element.indice !== Number(coleccionBorrar));
    mostrarCarrito();
  };

//-----------funcion para aumentar el numero del carrito a medida que agrega productos

const aumentarNumeroCantidadCarrito = () => {
    let total = carrito.reduce((acc, ite) => acc + ite.cantidad, 0);
    document.querySelector(".spanCantidad").textContent = total || 0;
  };

//--------obtener colecciones en la tabla a partir del localstorage

const llenarTabla = () =>{
    //------------consulto al localstorage por los datos guardados en las colecciones y las muestro
    obtenerColecciones().then(colecciones => {
    colecciones.forEach((coleccion) =>{

        //---------seteo una imagen dependiendo el tipo de opcion seleccionada
        let imagen = ""
        
        //---------consulto por los tipos de blockchain para cada moneda y retorna un icono y una variable moneda que sera parametro de fetch
        if(coleccion.tipoBlockchain === "Ethereum"){
            imagen="https://img.icons8.com/cotton/30/000000/ethereum--v1.png";
            moneda = "eth";
            
        }
        else if(coleccion.tipoBlockchain === "Bitcoin"){
            imagen="https://img.icons8.com/color/30/000000/bitcoin--v1.png";
            moneda = "btc";
            
        }
        else{
            imagen="https://img.icons8.com/color/30/000000/tether--v2.png";
            moneda = "usdt";
            
        }

        //obtengo  los valores de las criptomonedas actualizados desde la API criptoya 
        //y paso el la variable "moneda" para buscar el precio por tipo de moneda en la API

        fetch("https://criptoya.com/api/bitex/"+ moneda +"/usd/1")
        .then(response => response.json())
        .then(data => {
            //desestructuro el array que obtengo de la API y tomo el valor ASK
            let {ask} = data;
            valorEnDolares = ask; //-------almaceno el valor obtenido en la variable ValorEnDolares

            
            //--------lleno la tabla con los datos obtenidos y los muesro en el DOM
            let tbody = document.createElement("tr");
            tbody.className = "tbody";
            tablaTopColecciones.appendChild(tbody);

            tbody.innerHTML += `
            <tr class="tr">
                <td class="td col-xs-2" style="width: 20%">${coleccion.descripcionImagen}</td>
                <td class="td col-xs-2" style="width: 25%">${coleccion.autorImagen}</td>
                <td class="td col-xs-2" style="width: 20%">${Math.round(valorEnDolares * coleccion.precio).toFixed(2)}</td>
                <td class="td col-xs-2" style="width: 15%">${coleccion.precio} </td>
                <td class="td col-xs-2" style="width: 10%"><img src="${imagen}" class="img-top imagenBlockchain"></img></td>
            </tr>
                
            `
        })
    })

        
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


 //-------implementacion de libreria sweet alert 2

const mostrarMensajeSwalToast = () =>{
    Swal.fire({
        toast: true,
        text: "Coleccion agregada",
        color: "#66f2ca",
        background: "#260259",
        showConfirmButton: false,
        position: "bottom-end",
        timer: 1400,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
    })
}

botonAgregarCarrito.addEventListener('click', ()=>{
    if (carrito.length === 0) {
        swal.fire("Carrito vacío", "🛒", "warning")
    }
    else{
        mostrarMensajeSwalToast();
    }
    
})


//-------calcular el total del carrito mediante reduce

const calcularTotal = () => {
    let total = carrito.reduce((acc, ite) => acc + (ite.precio) * ite.cantidad,0);

    //-------creo un div y le asigno una clase. Le paso el valor del total y lo agrego al modal de carrito
    let divTotal = document.createElement("tr");
    divTotal.className = "tr";
    divTotal.id = "total--compra";

    divTotal.innerHTML = `
        <th colspan="8" class="text-right thTotal">TOTAL DE LA COMPRA</th>
        <td colspan="2" class="td tdTotal"><span class="spanTotal">US$${Math.round(total).toFixed(2)}</span></td>
    `;
    tableBody.appendChild(divTotal);

}



//--------implementacion de libreria scroll reveal para que aparezcan los titulos de las secciones a medida que hago scroll en la pagina

ScrollReveal().reveal('.h1Custom');
ScrollReveal().reveal('#tituloTop', {delay: 300});
ScrollReveal().reveal('#tituloColecciones', {delay: 500});
ScrollReveal().reveal('#tituloRecursos', {delay: 500});
ScrollReveal().reveal('#tituloContacto', {delay: 500});


//-----------scroll hasta el top de la pagina

mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}

//-------inicio las funciones de mostrarCarrito y escucharBotones para realizar operaciones en el DOM
mostrarCarrito();
escucharBotonesModalCarrito();