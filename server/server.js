import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI // pon aquí tu connection string en .env

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export async function connectMongo() {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('✅ MongoDB (native driver) conectado correctamente')
    return client
  } catch (err) {
    console.error('❌ Error conectando MongoDB (native):', err)
    throw err
  }
}

export function getMongoClient() {
  return client
}

export function getDb(dbName = 'gamelib') {
  return client.db(dbName)
}// server/server.js (parte superior)
import { connectMongo } from './config/mongoClient.js'

await connectMongo() // si no usas top-level await, envuelve en async init()import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import bibliotecaRoutes from './routes/biblioteca.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/biblioteca', bibliotecaRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Servidor funcionando' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
})
