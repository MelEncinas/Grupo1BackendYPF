const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

//MIDDLEWARE
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const {
    readTrailerflix,
    getTrailerFind,
    getAllOrderByTitle,
    getTitles,
    getCategory,
} = require("./src/trailerflixController");
const PORT = process.env.PORT || 3000;
let DB = [];
app.use((req, res, next) => {
    DB = readTrailerflix();
    next();
});

// SERVIDOR WEB
// metodo get generico
app.get("/", (req, res) => {
    res.send(DB);
});

//PARA REALIZAR!!!

//  “/catalogo” ordenado por nombre
//ej --> http://localhost:3008/api/catalogo
app.get("/api/catalogo", (req, res) => {
    res.json(getAllOrderByTitle(DB));
});

//ej --> http://localhost:3008/api/titulo/guasón
//       http://localhost:3008/api/titulo/guas
app.get("/api/titulo/:title", (req, res) => {
    res.json(getTitles(req.params.title.toLowerCase()));
});

// Categorías
//Endpoint para listar el contenido según su categoría (serie o película)

// ejemplo: localhost:3008/api/categoria/serie
// ejemplo2: localhost:3008/api/categoria/pelicula

app.get("/api/categoria/:cat", (req, res) => {
    res.json(getCategory(req.params.cat.toLowerCase()));
});

//Endpoint para listar todo el contenido independientemente de su categoría
//ruta --> "api/categoría"
app.get("/api/categoria/", (req, res) => {
    res.json(DB);
});

// *** ENDPOINT 4 ***
// Ruta --> “/api/reparto/:act ”
// Crea un endpoint llamado /reparto/:act que liste el catálogo que incluya a la actriz o
//actor indicado por el nombre. (la búsqueda del nombre debe ser parcial)

// *** ENDPOINT 5 ***
// Ruta --> “/api/trailer/:id”
// Crea un endpoint llamado /trailer/:id que retorne la URL del trailer de la película o serie.
// Si ésta no posee video asociado, que retorne un mensaje en formato JSON notificando la no disponibilidad del mismo.

//ej --> http://localhost:3008/api/trailer/34
app.get("/api/trailer/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const trailer = getTrailerFind(id);
    res.send(trailer);
});

// Leer las recomendaciones de: https://github.com/mariaelisaaraya/tp1ObligatorioIngenias/blob/master/readme.md

// Mensaje de error pagina no encontrada
app.get("*", (req, res) => {
    res.status(404).send("Lo siento, la página que buscas no existe.");
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});
