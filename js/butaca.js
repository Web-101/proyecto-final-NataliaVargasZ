document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idPelicula = params.get("id");
    const horaFuncion = params.get("hora");

    if (!idPelicula || !horaFuncion) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("btn-volver").addEventListener("click", () => {
        window.location.href = `detalle.html?id=${idPelicula}`;
    });

    const mapaSala = document.getElementById("mapa-sala");
    const txtAsientos = document.getElementById("txt-asientos-seleccionados");
    const txtTotal = document.getElementById("txt-total-pagar");
    const btnContinuar = document.getElementById("btn-continuar-compra");

    const FILAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; 
    const COLUMNAS = 8; 
    const PRECIO_ASIENTO = 75.00; 
    let seleccionados = [];

    async function inicializarSala() {
        try {
            const respuesta = await fetch('/api/cartelera');
            const peliculas = await respuesta.json();
            const pelicula = peliculas.find(p => p.id === idPelicula);
            const funcion = pelicula.funciones.find(f => f.hora === horaFuncion);

            document.getElementById("titulo-funcion").textContent = `${pelicula.titulo} - ${funcion.hora}`;

            mapaSala.innerHTML = "";

            FILAS.forEach(fila => {
                for (let col = 1; col <= COLUMNAS; col++) {
                    const codigoAsiento = `${fila}${col}`;
                    const asientoElemento = document.createElement("div");
                    asientoElemento.className = "asiento-butaca";
                    asientoElemento.textContent = codigoAsiento;

                    if (funcion.asientosOcupados.includes(codigoAsiento)) {
                        asientoElemento.classList.add("ocupado");
                    } else {
                        asientoElemento.classList.add("disponible");
                        
                        asientoElemento.addEventListener("click", () => {
                            if (asientoElemento.classList.contains("seleccionado")) {
                                asientoElemento.classList.remove("seleccionado");
                                seleccionados = seleccionados.filter(a => a !== codigoAsiento);
                            } else {
                                asientoElemento.classList.add("seleccionado");
                                seleccionados.push(codigoAsiento);
                            }
                            actualizarResumen();
                        });
                    }
                    mapaSala.appendChild(asientoElemento);
                }
            });

        } catch (error) {
            console.error("Error al cargar la sala virtual:", error);
        }
    }

    function actualizarResumen() {
        if (seleccionados.length > 0) {
            txtAsientos.textContent = seleccionados.join(", ");
            const total = seleccionados.length * PRECIO_ASIENTO;
            txtTotal.textContent = `$${total.toFixed(2)}`;
            btnContinuar.removeAttribute("disabled");
        } else {
            txtAsientos.textContent = "-";
            txtTotal.textContent = "$0.00";
            btnContinuar.setAttribute("disabled", "true");
        }
    }

    btnContinuar.addEventListener("click", () => {
        const datosOrden = {
            id: idPelicula,
            hora: horaFuncion,
            asientos: seleccionados,
            total: seleccionados.length * PRECIO_ASIENTO
        };
        localStorage.setItem("compra_actual", JSON.stringify(datosOrden));
        window.location.href = "compra.html";
    });

    inicializarSala();
});