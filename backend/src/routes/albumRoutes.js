const express = require('express')
const router = express.Router()
const {
    createAlbum,
    getAllAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum
} = require("../controllers/albumController")

// 👉 Crear álbum
router.post('/', createAlbum)

// 👉 Obtener todos los álbumes 
router.get('/', getAllAlbums)

// 👉 Obtener un solo álbum
router.get('/:id', getAlbumById)

// 👉 Actualizar álbum
router.put('/:id', updateAlbum)

// 👉 Eliminar álbum
router.delete('/:id', deleteAlbum)

module.exports = router