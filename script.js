// --------------------------- Array

let listaProductos = [
    { id: 1001, nombre: "Cinta transparente 48mm x 100mts", linea: "orpack", categoria: "cinta", precio: 1500, stock: 7, rutaImagen: "Cinta transparente 48mm x 100mtr.jpg" },
    { id: 1002, nombre: "Cinta transparente 48mm x 1000mts", linea: "orpack", categoria: "cinta", precio: 1500, stock: 6, rutaImagen: "Cinta transparente 48mm x 1000mtr.jpg" },
    { id: 1003, nombre: "Cinta transparente de 24mm x 50mtr", linea: "orpack", categoria: "cinta", precio: 1000, stock: 9, rutaImagen: "Cinta transparente de 24mm x 50mtr.jpg" },
    { id: 1004, nombre: "Cinta transparente de 48mm x 50mtr", linea: "orpack", categoria: "cinta", precio: 1500, stock: 5, rutaImagen: "Cinta transparente de 48mm x 50mtr.jpg" },
    { id: 2001, nombre: "Film adherente 38mm x 120mtr", linea: "ormai", categoria: "filmAdherente", precio: 7500, stock: 8, rutaImagen: "Film adherente 38 x 120mtrjpg.jpg" },
    { id: 2002, nombre: "Film adherente 38mm x 300mtr", linea: "ormai", categoria: "filmAdherente", precio: 10300, stock: 45, rutaImagen: "Film adherente 38mm x 300mtr.jpg" },
    { id: 3001, nombre: "Film adherente para alimentos 38cm x1000mtr", linea: "orpack", categoria: "filmAlimentos", precio: 7000, stock: 11, rutaImagen: "Film adherente para alimento 38cm x1000mtr.jpg" },
    { id: 3002, nombre: "Film adherente para alimentos 45cm x 600mtr", linea: "orpack", categoria: "filmAlimentos", precio: 5000, stock: 16, rutaImagen: "Film adherente para alimento 45cm x 600mtr.jpg" },
    { id: 3003, nombre: "Film adherente para alimentos 45cm x 1000mtr", linea: "orpack", categoria: "filmAlimentos", precio: 9700, stock: 31, rutaImagen: "Film adherente para alimento 45cm x 1000mtr.jpg" },
    { id: 3004, nombre: "Film adherente para alimentos 38cm x 600mtr", linea: "orpack", categoria: "filmAlimentos", precio: 8100, stock: 27, rutaImagen: "Film adherente para alimentos 38cm x 600mtr.jpg" },
    { id: 4001, nombre: "Film streetch 10cm x 800gr", linea: "orpack", categoria: "filmStreetch", precio: 6300, stock: 4, rutaImagen: "Film streetch 10cm x 800gr.jpg" },
    { id: 4002, nombre: "Film Stretch 5cm x 500gr", linea: "orpack", categoria: "filmStreetch", precio: 4500, stock: 10, rutaImagen: "Film stretch 5cm x 500gr.jpg" },
    { id: 4003, nombre: "Film Stretch de 10cm x500gr", linea: "orpack", categoria: "filmStreetch", precio: 4500, stock: 7, rutaImagen: "Film stretch de 10cm x500gr.jpg" },
    { id: 4004, nombre: "Film Stretch industrial por 5k", linea: "orpack", categoria: "filmStreetch", precio: 21700, stock: 31, rutaImagen: "Film stretch industrial por 5k.jpg" },
    { id: 4005, nombre: "Film stretch manguito 50cm x 2,5k", linea: "orpack", categoria: "filmStreetch", precio: 7500, stock: 3, rutaImagen: "Film stretch manguito 50cm x 2,5k.jpg" },
    { id: 4006, nombre: "Film stretch negro industrial 5k", linea: "orpack", categoria: "filmStreetch", precio: 18400, stock: 34, rutaImagen: "Film stretch negro industrial 5k.jpg" },
    { id: 9001, nombre: "Paletizadora Manual", linea: "orpack", categoria: "herramienta", precio: 45000, stock: 1, rutaImagen: "Paletizadora Manual.jpg" },
]

// --------------------------- Funcion principal

function principal(productos) {
    crearTarjetasProductos(productos);
    crearFiltrosPorCategoria(productos);

    let carrito = obtenerCarrito();
    renderizarCarrito(carrito, productos);

    let input = document.getElementById("buscador");
    let botonBuscar = document.getElementById("buscar");

    botonBuscar.addEventListener("click", () => filtrarPorNombre(productos, input.value));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            filtrarPorNombre(productos, input.value);
        }
    });

    let botonVerCarrito = document.getElementById("verCarrito");
    botonVerCarrito.addEventListener("click", verOcultar);

    let botonComprar = document.getElementById("comprar");
    botonComprar.addEventListener("click", finalizarCompra);
}
let btnComprar = document.getElementById("comprar")
btnComprar.disable = true;

principal(listaProductos);


// --------------------------- Funciones de storage
function finalizarCompra() {
    let carrito = obtenerCarrito()
    if (carrito.length === 0){
        sweetAlert("CARRITO VACÍO", "¡ Porfavor agregue productos al carrito !", "error")
    } else{
        sweetAlert("GRACIAS POR SU COMPRA", "¡ Esperamos vuelva pronto !", "success")
        localStorage.removeItem("carrito");
        renderizarCarrito([]);
    }
}

function obtenerCarrito() {
    let carrito = [];
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
    }
    return carrito;
}

function setearCarrito(carrito, productos) {
    let carritoJSON = JSON.stringify(carrito, productos);
    localStorage.setItem("carrito", carritoJSON);
}

// --------------------------- Funciones de muestreo
function verOcultar() {
    let contenedorProductos = document.getElementById("paginaProductos");
    let contenedorCarrito = document.getElementById("paginaCarrito");
    let filtros = document.getElementById("filtros");

    contenedorCarrito.classList.toggle("oculto");
    contenedorProductos.classList.toggle("oculto");
    filtros.classList.toggle("oculto");
}

// --------------------------- Funciones de filtros
function filtrarPorNombre(productos, valorBusqueda) {
    let valorBusquedaLowerCase = valorBusqueda.toLowerCase();
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorBusquedaLowerCase));
    crearTarjetasProductos(productosFiltrados);
}

function crearFiltrosPorCategoria(productos) {
    let categorias = [];
    let contenedorFiltros = document.getElementById("filtros");
    productos.forEach(({categoria}) => {
        if (!categorias.includes(categoria)) {
            categorias.push(categoria);

            let botonFiltro = document.createElement("button");
            botonFiltro.innerText = categoria;
            botonFiltro.value = categoria;
            botonFiltro.classList.add('bg-blue-900', 'hover:bg-blue-700', 'border-2', 'border-white', 'p-1', 'pl-2', 'pr-2', 'rounded-lg', 'font-bebas', 'text-white', 'ml-2',)
            botonFiltro.addEventListener("click", (e) => filtrarPorCategoria(e, productos));

            contenedorFiltros.appendChild(botonFiltro);
        }
    });

    let botonTodos = document.getElementById("todos");
    botonTodos.addEventListener("click", (e) => filtrarPorCategoria(e, productos));
}

function filtrarPorCategoria(e, productos) {
    let productosFiltrados = productos.filter(producto => producto.categoria.includes(e.target.value));
    crearTarjetasProductos(productosFiltrados);
}

// --------------------------- Funcion para listar productos y crear card
function crearTarjetasProductos(productos) {
    let contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        let tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = "producto";
        tarjetaProducto.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img src="./assets/img/products/${producto.rutaImagen}">
        <p>$${producto.precio}</p>
        <p>Quedan ${producto.stock} unidades</p>
        <button id="add-${producto.id}" class="${producto.stock === 0 ? 'sinStock' : ''}" ${producto.stock === 0 ? 'disabled' : ''}>Añadir al carrito</button>
        `;
        contenedorProductos.appendChild(tarjetaProducto);

        if (producto.stock > 0) {
            let botonAgregarAlCarrito = document.getElementById(`add-${producto.id}`);
            botonAgregarAlCarrito.addEventListener("click", (e) => agregarAlCarrito(e, productos));
        }
    });
}

// --------------------------- Funciones carrito
function agregarAlCarrito(e, productos) {
    let carrito = obtenerCarrito();
    let idProducto = Number(e.target.id.split('-')[1]);
    let productoBuscado = productos.find(producto => producto.id === idProducto);
    let indiceProdCarrito = carrito.findIndex(producto => producto.id === idProducto);

    if (productoBuscado.stock > 0) {
        if (indiceProdCarrito != -1) {
            carrito[indiceProdCarrito].unidades++;
            carrito[indiceProdCarrito].subtotal = carrito[indiceProdCarrito].precioUnitario * carrito[indiceProdCarrito].unidades;
        } else {
            carrito.push({
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precioUnitario: productoBuscado.precio,
                unidades: 1,
                subtotal: productoBuscado.precio,
            });
        }
        productoBuscado.stock--;
        setearCarrito(carrito);
        renderizarCarrito(carrito, productos);
        crearTarjetasProductos(productos);
        tostada(`SE AGREGÓ ${productoBuscado.nombre} AL CARRITO`, "tostada");
}
}
function renderizarCarrito(carrito, productos) {
    let contenedorCarrito = document.getElementById("contenedorCarrito");
    contenedorCarrito.innerHTML = "";
    carrito.forEach(({nombre, precioUnitario, unidades, subtotal, id}) => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.id = "tc" + id
        tarjetaCarrito.innerHTML += `
                <p>${nombre}</p>
                <p>$ ${precioUnitario}</p>
                <p>${unidades} un.</p>
                <p>$ ${subtotal}</p>
                <div class="btnAccionCarrito">
                <button id=rs${id} class="btnResta">-</button>
                <button id=el${id} class="btnEliminar">ELIMINAR</button>
                <button id=sm${id} class="btnSuma">+</button></div>
        `;
        contenedorCarrito.appendChild(tarjetaCarrito)

        let btnEliminar = document.getElementById("el" + id)
        btnEliminar.addEventListener("click", (e) => eliminarProductoCarrito(e, productos))
        let btnSuma = document.getElementById("sm" + id);
        btnSuma.addEventListener("click", (e) => sumarUnidad(e, productos));
        let btnResta = document.getElementById("rs" + id)
        btnResta.addEventListener("click", (e) => restarUnidad(e, productos))
    });
}

function eliminarProductoCarrito(e, productos) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let disponibilidad = carrito.find(producto => producto.id === id)
    let prodOriginal = productos.find(producto => producto.id === id)
    carrito = carrito.filter(producto => producto.id !== id)
    setearCarrito(carrito);
    let eliminarTarjeta = document.getElementById("tc" + id)
    eliminarTarjeta.remove()
    prodOriginal.stock += disponibilidad.unidades
    crearTarjetasProductos(productos);
}

function sumarUnidad(e, productos) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let disponibilidad = carrito.find(producto => producto.id === id)
    let prodOriginal = productos.find(producto => producto.id === id)
    console.log(prodOriginal)
    console.log(disponibilidad)

    if (prodOriginal.stock > 0){
        disponibilidad.unidades++;
        disponibilidad.subtotal = disponibilidad.unidades * disponibilidad.precioUnitario;
        prodOriginal.stock--;
        setearCarrito(carrito);
        renderizarCarrito(carrito, productos);
        crearTarjetasProductos(productos);
        tostada(`SE SUMO UNA UNIDAD DE ${prodOriginal.nombre}`, "tostada")
    } else {
        tostada(`NO HAY MAS ${prodOriginal.nombre} EN STOCK`, "tostadaCarrito")
    }
}

function restarUnidad(e, productos) {
    let id = Number(e.target.id.substring(2));
    let carrito = obtenerCarrito();
    let disponibilidad = carrito.find(producto => producto.id === id);
    let prodOriginal = productos.find(producto => producto.id === id);

    if (disponibilidad.unidades > 1){
        disponibilidad.unidades--;
        disponibilidad.subtotal = disponibilidad.unidades * disponibilidad.precioUnitario;
        prodOriginal.stock++;
        setearCarrito(carrito);
        renderizarCarrito(carrito, productos);
        crearTarjetasProductos(productos);
        tostada(`SE RESTÓ UNA UNIDAD DE ${prodOriginal.nombre}`, "tostada")
    }
}

function tostada(text, className) {
    Toastify({
        text,
        className,
        duration: 1500,
        close: false,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        onClick: function(){verOcultar()} // Muestra y/o Oculta el Carrito
    }).showToast();
}

function sweetAlert(title, text, icon){
    Swal.fire({
        title,
        text,
        icon,
        imageUrl: "./assets/img/logotype/logoOrpack.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
        confirmButtonText: "Confirmar",
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btnSweet',  // Elijo la clase para el botón del alert
        }
    });
}