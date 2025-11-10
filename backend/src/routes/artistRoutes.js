const express = require('express')
const router = express.Router()
const { createArtist,
    getAllArtists,
    getArtistById,
    updateArtist,
    deleteArtist} = require("../controllers/artistController")

// 👉 Crear artista
router.post('/', createArtist)

// 👉 Obtener todos los artistas
router.get('/', getAllArtists)

// 👉 Obtener un solo artista
router.get('/:id', getArtistById)

// 👉 Actualizar artista
router.put('/:id', updateArtist)

// 👉 Eliminar artista
router.delete('/:id', deleteArtist)

module.exports = router