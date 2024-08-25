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

//---------------------------- BD Productos

async function consultarBD() {
    try {
        const response = await fetch("./listaProductos.json")
        const productos = await response.json()
        principal(productos)
    } catch (error) {
        sweetAlert("ALGO SALIÓ MAL!", "Se produjo un error al intentar cargar la lista de productos. Comuníquese con Soporte", "error")
    }
}
consultarBD()

// --------------------------- Funciones de storage
function finalizarCompra() {
    let carrito = obtenerCarrito()
    if (carrito.length === 0){
        sweetAlert("CARRITO VACÍO", "¡ Porfavor agregue productos al carrito !", "warning")
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
                rutaImagen: productoBuscado.rutaImagen
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
    carrito.forEach(({nombre, precioUnitario, unidades, subtotal, id, rutaImagen}) => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.id = "tc" + id
        tarjetaCarrito.innerHTML += `
                <img class="imgCarrito" src="./assets/img/products/${rutaImagen}">
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

// --------------------------- Funciones de alertas
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