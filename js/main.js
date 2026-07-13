document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-peliculas");

    async function obtenerCartelera() {
        try {
            const respuesta = await fetch('/api/cartelera');
            const peliculas = await respuesta.json();

            contenedor.innerHTML = "";

            peliculas.forEach(pelicula => {
                const tarjeta = `
                    <a href="detalle.html?id=${pelicula.id}" class="tarjeta-pelicula">
                        <div class="poster-contenedor">
                            <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="poster-img">
                        </div>
                        <div class="tarjeta-detalles">
                            <h3>${pelicula.titulo}</h3>
                            <p>${pelicula.genero} - ${pelicula.clasificacion}</p>
                        </div>
                    </a>
                `;
                contenedor.innerHTML += tarjeta;
            });

        } catch (error) {
            console.error("Error al conectar con la API de cartelera:", error);
            contenedor.innerHTML = "<p class='error-txt'>No se pudieron cargar las películas.</p>";
        }
    }

    obtenerCartelera();
});