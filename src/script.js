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
    renderizarCarrito(carrito);

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

principal(listaProductos);


// --------------------------- Funciones de storage
function finalizarCompra() {
    localStorage.removeItem("carrito");
    renderizarCarrito([]);
    let alertaCompra = document.getElementById("alertaCompra")
    alertaCompra.innerHTML = "";
    let mensaje = document.createElement("div");
    mensaje.className = "mensaje";
    mensaje.innerHTML = `
        <h3>Gracias por su compra!</h3>
        `;
    alertaCompra.appendChild(mensaje);
    setTimeout(() => {
        alertaCompra.innerHTML = "";
    }, 4000)
}

function obtenerCarrito() {
    let carrito = [];
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
    }
    return carrito;
}

function setearCarrito(carrito) {
    let carritoJSON = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoJSON);
}

// --------------------------- Funciones de muestreo
function verOcultar(e) {
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
    productos.forEach(producto => {
        if (!categorias.includes(producto.categoria)) {
            categorias.push(producto.categoria);

            let botonFiltro = document.createElement("button");
            botonFiltro.innerText = producto.categoria;
            botonFiltro.value = producto.categoria;
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
        renderizarCarrito(carrito);
        crearTarjetasProductos(productos);
        let alertaCarrito = document.getElementById("alertaCarrito")
        alertaCarrito.innerHTML = "";
        let mensajeCarrito = document.createElement("div");
        mensajeCarrito.className = "mensajeCarrito";
        mensajeCarrito.innerHTML = `
            <h4>Agregaste un producto al carrito!</h4>
            `;
        alertaCarrito.appendChild(mensajeCarrito);
        setTimeout(() => {
            alertaCarrito.innerHTML = "";
        }, 2000)
        console.log(productoBuscado)
    }
}

function renderizarCarrito(carrito) {
    let contenedorCarrito = document.getElementById("contenedorCarrito");
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
        contenedorCarrito.innerHTML += `
            <div class=tarjetaCarrito>
                <p>${producto.nombre}</p>
                <p>$ ${producto.precioUnitario}</p>
                <p>${producto.unidades} un.</p>
                <p>$ ${producto.subtotal}</p>
            </div>
        `;
    });
}