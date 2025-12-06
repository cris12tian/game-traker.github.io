import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import Biblioteca from '../models/Biblioteca.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const biblioteca = await Biblioteca.findOne({ bibliotecaId: req.params.id })
    
    if (!biblioteca) {
      return res.status(404).json({ error: 'Biblioteca no encontrada' })
    }
    
    if (biblioteca.privada) {
      return res.status(403).json({ error: 'Esta biblioteca es privada' })
    }
    
    res.json(biblioteca)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener biblioteca', message: error.message })
  }
})

// POST - Crear nueva biblioteca
router.post('/crear', async (req, res) => {
  try {
    const { juegos, nombreBiblioteca, descripcion } = req.body
    const bibliotecaId = uuidv4().slice(0, 8)
    
    const nuevaBiblioteca = new Biblioteca({
      bibliotecaId,
      nombreBiblioteca: nombreBiblioteca || 'Mi Biblioteca',
      descripcion: descripcion || '',
      juegos: juegos || [],
      privada: false
    })
    
    await nuevaBiblioteca.save()
    
    res.status(201).json({
      bibliotecaId,
      urlCompartible: `${process.env.FRONTEND_URL}/biblioteca/${bibliotecaId}`,
      biblioteca: nuevaBiblioteca
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear biblioteca', message: error.message })
  }
})

// PUT - Actualizar biblioteca
router.put('/:id', async (req, res) => {
  try {
    const { juegos, nombreBiblioteca, descripcion } = req.body
    
    const biblioteca = await Biblioteca.findOneAndUpdate(
      { bibliotecaId: req.params.id },
      {
        juegos,
        nombreBiblioteca,
        descripcion,
        updatedAt: new Date()
      },
      { new: true }
    )
    
    if (!biblioteca) {
      return res.status(404).json({ error: 'Biblioteca no encontrada' })
    }
    
    res.json(biblioteca)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar biblioteca', message: error.message })
  }
})

// DELETE - Eliminar biblioteca
router.delete('/:id', async (req, res) => {
  try {
    const biblioteca = await Biblioteca.findOneAndDelete({ bibliotecaId: req.params.id })
    
    if (!biblioteca) {
      return res.status(404).json({ error: 'Biblioteca no encontrada' })
    }
    
    res.json({ message: 'Biblioteca eliminada', bibliotecaId: req.params.id })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar biblioteca', message: error.message })
  }
})

// POST - Agregar comentario a juego
router.post('/:id/juego/:juegoId/comentario', async (req, res) => {
  try {
    const { texto, puntuacion, fecha, autor } = req.body
    
    const biblioteca = await Biblioteca.findOne({ bibliotecaId: req.params.id })
    if (!biblioteca) {
      return res.status(404).json({ error: 'Biblioteca no encontrada' })
    }
    
    const juego = biblioteca.juegos.find(j => j.id === parseInt(req.params.juegoId))
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    
    const nuevoComentario = {
      id: Date.now(),
      texto,
      puntuacion,
      fecha,
      autor
    }
    
    juego.comentariosIniciales.push(nuevoComentario)
    await biblioteca.save()
    
    res.status(201).json(nuevoComentario)
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar comentario', message: error.message })
  }
})

// DELETE - Eliminar comentario de juego
router.delete('/:id/juego/:juegoId/comentario/:comentarioId', async (req, res) => {
  try {
    const biblioteca = await Biblioteca.findOne({ bibliotecaId: req.params.id })
    if (!biblioteca) {
      return res.status(404).json({ error: 'Biblioteca no encontrada' })
    }
    
    const juego = biblioteca.juegos.find(j => j.id === parseInt(req.params.juegoId))
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    
    juego.comentariosIniciales = juego.comentariosIniciales.filter(
      c => c.id !== parseInt(req.params.comentarioId)
    )
    
    await biblioteca.save()
    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comentario', message: error.message })
  }
})

export default router
