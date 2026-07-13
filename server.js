const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de archivos estáticos: Como tus HTML están en la raíz, 
// le decimos a Express que sirva todo desde la carpeta principal (.)
app.use(express.static(__dirname));

// EL ENDPOINT DE TU API (Requerimiento obligatorio)
// Cuando el JS del frontend haga un fetch a /api/cartelera, ejecutará esto:
app.get('/api/cartelera', (req, res) => {
    // Leemos el archivo JSON de películas de forma asíncrona
    fs.readFile(path.join(__dirname, 'cartelera.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON:", err);
            return res.status(500).json({ error: 'No se pudo leer la cartelera de cine' });
        }
        // Enviamos los datos directamente al navegador en formato JSON parseado
        res.json(JSON.parse(data));
    });
});

// Encendemos el motor en el puerto 3000
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo con éxito en: http://localhost:${PORT}`);
});