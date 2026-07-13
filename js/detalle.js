document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idPelicula = params.get("id");

    const contenedorDetalle = document.getElementById("detalle-pelicula");
    const contenedorHorarios = document.getElementById("contenedor-horarios");

    if (!idPelicula) {
        window.location.href = "index.html";
        return;
    }

    async function cargarDetalles() {
        try {
            const respuesta = await fetch('/api/cartelera');
            const peliculas = await respuesta.json();

            const pelicula = peliculas.find(p => p.id === idPelicula);

            if (!pelicula) {
                contenedorDetalle.innerHTML = "<h2>Película no encontrada</h2>";
                return;
            }

            contenedorDetalle.innerHTML = `
                <div class="pelicula-info-bloque">
                    <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="poster-detalle-img">
                    <h2>${pelicula.titulo}</h2>
                    <p class="meta-info">${pelicula.genero} • ${pelicula.clasificacion}</p>
                    <p class="sinopsis-txt">${pelicula.sinopsis}</p>
                </div>
            `;

            contenedorHorarios.innerHTML = "";
            pelicula.funciones.forEach(funcion => {
                const boton = document.createElement("button");
                boton.className = "btn-horario";
                boton.textContent = funcion.hora;
                
                boton.addEventListener("click", () => {
                    window.location.href = `butaca.html?id=${pelicula.id}&hora=${encodeURIComponent(funcion.hora)}`;
                });
                
                contenedorHorarios.appendChild(boton);
            });

        } catch (error) {
            console.error("Error al cargar las funciones:", error);
            contenedorDetalle.innerHTML = "<p>Error al conectar con el servidor.</p>";
        }
    }

    cargarDetalles();
});