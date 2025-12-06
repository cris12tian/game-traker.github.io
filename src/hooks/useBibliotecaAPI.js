import { useState, useCallback } from 'react'

const API_URL = 'http://localhost:5000/api'

export function useBibliotecaAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const crearBiblioteca = useCallback(async (juegos, nombreBiblioteca = 'Mi Biblioteca') => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/biblioteca/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          juegos,
          nombreBiblioteca,
          descripcion: 'Mi colección personal de juegos'
        })
      })

      if (!response.ok) throw new Error('Error al crear biblioteca')
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const obtenerBiblioteca = useCallback(async (bibliotecaId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/biblioteca/${bibliotecaId}`)
      if (!response.ok) throw new Error('Biblioteca no encontrada')
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const actualizarBiblioteca = useCallback(async (bibliotecaId, juegos) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/biblioteca/${bibliotecaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ juegos })
      })

      if (!response.ok) throw new Error('Error al actualizar biblioteca')
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const agregarComentario = useCallback(async (bibliotecaId, juegoId, comentario) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_URL}/biblioteca/${bibliotecaId}/juego/${juegoId}/comentario`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comentario)
        }
      )

      if (!response.ok) throw new Error('Error al agregar comentario')
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const eliminarComentario = useCallback(async (bibliotecaId, juegoId, comentarioId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_URL}/biblioteca/${bibliotecaId}/juego/${juegoId}/comentario/${comentarioId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Error al eliminar comentario')
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    crearBiblioteca,
    obtenerBiblioteca,
    actualizarBiblioteca,
    agregarComentario,
    eliminarComentario
  }
}
