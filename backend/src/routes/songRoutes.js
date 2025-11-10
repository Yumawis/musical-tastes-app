const express = require('express')
const router = express.Router()
const {
    createSong,
    getAllSong,
    getSongById,
    updateSong,
    deleteSong
} = require("../controllers/songController")

// 👉 Crear canción
router.post('/', createSong)

// 👉 Obtener todas las canciones 
router.get('/', getAllSong)

// 👉 Obtener una sola canción
router.get('/:id', getSongById)

// 👉 Actualizar canción
router.put('/:id', updateSong)

// 👉 Eliminar canción
router.delete('/:id', deleteSong)

module.exports = router