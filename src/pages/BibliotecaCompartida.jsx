import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TarjetaJuego from '../components/TarjetaJuego'
import './BibliotecaCompartida.css'

function BibliotecaCompartida() {
  const { bibliotecaId } = useParams()
  const [biblioteca, setBiblioteca] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/biblioteca/${bibliotecaId}`)
        
        if (!response.ok) {
          throw new Error('Biblioteca no encontrada o privada')
        }
        
        const data = await response.json()
        setBiblioteca(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setBiblioteca(null)
      } finally {
        setLoading(false)
      }
    }

    if (bibliotecaId) {
      cargarBiblioteca()
    }
  }, [bibliotecaId])

  if (loading) {
    return (
      <div className="biblioteca-compartida-loading">
        <div className="spinner"></div>
        <p>Cargando biblioteca...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="biblioteca-compartida-error">
        <div className="error-contenido">
          <p className="error-emoji">❌</p>
          <h2>No se pudo cargar la biblioteca</h2>
          <p>{error}</p>
          <a href="/" className="btn-volver">
            ← Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="biblioteca-compartida">
      <div className="bg-gradient"></div>
      
      <header className="compartida-header">
        <div className="header-contenido">
          <h1>{biblioteca?.nombreBiblioteca || 'Biblioteca Compartida'}</h1>
          <p className="compartida-descripcion">
            {biblioteca?.descripcion || 'Una colección de juegos'}
          </p>
          <p className="compartida-juegos">
            📚 {biblioteca?.juegos?.length || 0} juego{biblioteca?.juegos?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="compartida-contenido">
        {biblioteca?.juegos && biblioteca.juegos.length > 0 ? (
          <div className="tarjetas-grid-compartida">
            {biblioteca.juegos.map(juego => (
              <div key={juego.id} className="tarjeta-contenedor-compartida">
                <TarjetaJuego {...juego} />
              </div>
            ))}
          </div>
        ) : (
          <div className="sin-juegos-compartida">
            <p className="sin-juegos-emoji">🎮</p>
            <h3>Sin juegos</h3>
            <p>Esta biblioteca no tiene juegos todavía</p>
          </div>
        )}
      </div>

      <footer className="compartida-footer">
        <p>Biblioteca compartida desde GameLib</p>
        <a href="/">Crear tu propia biblioteca</a>
      </footer>
    </div>
  )
}

export default BibliotecaCompartida
