import mongoose from 'mongoose'

const comentarioSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  texto: String,
  puntuacion: Number,
  fecha: String,
  autor: String
})

const juegoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  imagen: String,
  resena: {
    type: Number,
    default: 5
  },
  tiempoJugado: {
    type: Number,
    default: 0
  },
  comentariosIniciales: [comentarioSchema]
})

const bibliotecaSchema = new mongoose.Schema(
  {
    bibliotecaId: {
      type: String,
      unique: true,
      required: true
    },
    nombreBiblioteca: {
      type: String,
      default: 'Mi Biblioteca'
    },
    descripcion: {
      type: String,
      default: ''
    },
    juegos: [juegoSchema],
    privada: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export default mongoose.model('Biblioteca', bibliotecaSchema)

