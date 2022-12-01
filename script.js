function renderBebidas (bebidasSA) {
    
    let misBebidaSinAlcohol = []
    misBebidaSinAlcohol = bebidasSA
    
    function renderBebidasConAlcohol (bebidasCA) {
        let misBebidaConAlcohol = []
        misBebidaConAlcohol = bebidasCA

        let totalMisBebidas = misBebidaSinAlcohol.concat(misBebidaConAlcohol)

        let consultaEdad = document.getElementById('mayorDeEdad')

        consultaEdad.innerHTML = `
        <h2>Bienvenido a nuestra tienda de bebidas!</h2>
        <p>Eres mayor de edad?</p>
        <button id="mayorEdad">Si</button>
        <button id="menorEdad">No</button>
        `
        let botonMayorEdad = document.getElementById('mayorEdad')
        let botonMenorEdad = document.getElementById('menorEdad')
        let contenedorBebidas = document.getElementById('contenedorBebidas')
        let displayCaja = document.getElementById('iconoCaja')
        let displayCarrito = document.getElementById('iconoCarrito')
        let displayVaciarCarrito = document.getElementById('iconoVaciarCarrito')


        for (const bebida of bebidasCA) {
            let tarjetaBebidaConAlcohol = document.createElement('div')
            tarjetaBebidaConAlcohol.className = 'bebidaConAlcohol'
            tarjetaBebidaConAlcohol.hidden = true
            tarjetaBebidaConAlcohol.innerHTML = `
                <h4>${bebida.bebida}</h4>
                <h5>$${bebida.precio}</h5>
                <img src=${bebida.imagen}>
                <button class="boton" id=${bebida.id}>Agregar al carro</button>
            `
            contenedorBebidas.append(tarjetaBebidaConAlcohol)
            }

        for (const bebida of bebidasSA) {
        let tarjetaBebidaSinAlcohol = document.createElement('div')
        tarjetaBebidaSinAlcohol.className = 'bebidaSinAlcohol'
        tarjetaBebidaSinAlcohol.innerHTML = `
            <h4>${bebida.bebida}</h4>
            <h5>$${bebida.precio}</h5>
            <img src=${bebida.imagen}>
            <button class="boton" id=${bebida.id}>Agregar al carro</button>
        `
        contenedorBebidas.append(tarjetaBebidaSinAlcohol)
        }

        let tarjetaBebidaConAlcohol = document.getElementsByClassName('bebidaConAlcohol')

        botonMayorEdad.onclick = () => {
        consultaEdad.hidden = true
        contenedorBebidas.hidden = false
        for (const bebidaAlcoholica of tarjetaBebidaConAlcohol) {
            bebidaAlcoholica.hidden = false
        }
        displayCaja.style.display = "flex"
        displayCarrito.style.display = "flex"
        displayVaciarCarrito.style.display = "flex"
        }
        
        botonMenorEdad.onclick = () => {
        consultaEdad.hidden = true
        contenedorBebidas.hidden = false
        displayCaja.style.display = "flex"
        displayCarrito.style.display = "flex"
        displayVaciarCarrito.style.display = "flex"
        }



        let botones = document.getElementsByClassName('boton')
        let carroCompras = document.getElementById('carro')
        let carroStorage = []

        if (localStorage.getItem('carro')) {
        carroStorage = JSON.parse(localStorage.getItem('carro'))
        }

        for (const boton of botones) {
            boton.onclick = (e) => {
                let bebidaBuscada = totalMisBebidas.find(bebida => bebida.id == e.target.id)
                console.log(bebidaBuscada)
            
                let posicionbebidaEnCarro = carroStorage.findIndex((bebida) => bebida.id == bebidaBuscada.id)
            
                if (posicionbebidaEnCarro != -1) {
                    carroStorage[posicionbebidaEnCarro].unidades++ 
                    carroStorage[posicionbebidaEnCarro].subtotal = carroStorage[posicionbebidaEnCarro].precioUnidad * carroStorage[posicionbebidaEnCarro].unidades
                } else {
                    carroStorage.push({ id: bebidaBuscada.id, precioUnidad: bebidaBuscada.precio, unidades: 1, subtotal: bebidaBuscada.precio, nombre: bebidaBuscada.bebida })
                }

                Toastify ( {
                    text: "Bebida añadida al carrito",
                    duration: 2000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "left",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(45deg, rgb(0, 0, 0), rgb(70, 70, 70))",
                    },
                    onClick: function () {},
                }).showToast()
            
                localStorage.setItem('carro', JSON.stringify(carroStorage))
                renderizarCarro()
            }
        }    

        function renderizarCarro () {
            carroCompras.innerHTML = `
            <div class="itemCarro">
                <p>Nombre</p>
                <p>Precio por unidad</p>
                <p>Unidades</p>
                <p>Subtotal</p>
            </div>
            `
            let total = 0
            for (const item of carroStorage) {
            total += item.subtotal
            carroCompras.innerHTML += `
                <div class="itemCarro">
                <p>${item.nombre}</p>
                <p>${item.precioUnidad}</p>
                <p>${item.unidades}</p>
                <p>${item.subtotal}</p>
                </div>
            `
            }
            carroCompras.innerHTML += `
            <div class="itemCarro">
                <h3>total: ${total}</h3>
            </div>
            `
        }

        renderizarCarro()

        let botonCarrito = document.getElementById('botonCarrito')

        botonCarrito.onclick = () => {
        if (carroCompras.hidden) {
            carroCompras.hidden = false
        } else {
            carroCompras.hidden = true
        }
        }

        let vaciarCarrito = document.getElementById('vaciarCarrito')

        vaciarCarrito.onclick = () => {
        localStorage.clear()
        carroCompras.innerHTML = ''
        carroStorage = []
        Toastify ( {
            text: "Carrito vaciado",
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(45deg, rgb(0, 0, 0), rgb(70, 70, 70))",
            },
            onClick: function () {},
        }).showToast()
        }

        let finCompra = document.getElementById('finCompra')

        finCompra.onclick = () => {
            localStorage.clear()
                carroCompras.innerHTML = ''
                carroStorage = []
                swal.fire (
                    "La compra se ha realizado con exito!",
                    "Esperamos verlo pronto",
                    "success"
                )    
        }
    }
    
    fetch ("./bebidasConAlcohol.json")
        .then ((res) => res.json())
        .then ((bebidasCA) => {
            renderBebidasConAlcohol (bebidasCA)
        })    
}

fetch ("./bebidasSinAlcohol.json")
    .then ((res) => res.json())
    .then ((bebidasSA) => {
        renderBebidas (bebidasSA)
    })