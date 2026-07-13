document.addEventListener("DOMContentLoaded", () => {
    const datosGuardados = localStorage.getItem("compra_actual");
    
    if (!datosGuardados) {
        window.location.href = "index.html";
        return;
    }

    const orden = JSON.parse(datosGuardados);

    // Referencias de visualización del formulario
    const txtTitulo = document.getElementById("resumen-pelicula-titulo");
    const txtHora = document.getElementById("resumen-hora");
    const txtAsientos = document.getElementById("resumen-asientos");
    const txtTotal = document.getElementById("resumen-total");

    // Elementos de secciones controladores del DOM
    const seccionFormulario = document.getElementById("seccion-formulario");
    const seccionConfirmacion = document.getElementById("seccion-ticket-confirmacion");
    const tituloFlujo = document.getElementById("titulo-flujo");
    const form = document.getElementById("form-registro-compra");

    // Cargar los textos descriptivos de la película de forma asíncrona mediante los datos
    async function rellenarResumen() {
        try {
            const respuesta = await fetch('/api/cartelera');
            const peliculas = await respuesta.json();
            const pelicula = peliculas.find(p => p.id === orden.id);

            txtTitulo.textContent = pelicula.titulo;
            txtHora.textContent = orden.hora;
            txtAsientos.textContent = orden.asientos.join(", ");
            txtTotal.textContent = `$${orden.total.toFixed(2)}`;

            // Dejar listos los campos del ticket virtual en segundo plano
            document.getElementById("ticket-pelicula").textContent = pelicula.titulo;
            document.getElementById("ticket-funcion").textContent = orden.hora;
            document.getElementById("ticket-asientos").textContent = orden.asientos.join(", ");
            document.getElementById("ticket-total").textContent = `$${orden.total.toFixed(2)}`;
        } catch (error) {
            console.error("Error al rellenar el resumen:", error);
        }
    }

    // Manejar el submit del formulario (Simulación y Validaciones)
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitamos que la página se recargue

        const nombre = document.getElementById("input-nombre").value.trim();
        const correo = document.getElementById("input-correo").value.trim();

        if (nombre === "" || correo === "") {
            alert("Por favor completa los campos requeridos.");
            return;
        }

        // Modificamos dinámicamente los contenedores para mostrar el ticket sin salir del archivo
        document.getElementById("mensaje-agradecimiento").textContent = `¡Gracias por tu compra, ${nombre}!`;

        // Alternamos estados de visibilidad nativos del navegador
        seccionFormulario.setAttribute("hidden", "true");
        seccionConfirmacion.removeAttribute("hidden");

        // Limpieza de almacenamiento preventivo
        localStorage.removeItem("compra_actual");
    });

    rellenarResumen();
});