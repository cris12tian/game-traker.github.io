import { useState } from 'react'
import './ListaResenas.css'

function ListaResenas({ juegos = [], onActualizarResenas = null }) {
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroOrdenacion, setFiltroOrdenacion] = useState('reciente')
  const [mostrarFormularioNueva, setMostrarFormularioNueva] = useState(false)
  const [formNuevaResena, setFormNuevaResena] = useState({
    juegoId: '',
    autor: '',
    texto: '',
    puntuacion: 5
  })

  const todasLasResenas = juegos.flatMap(juego =>
    (juego.comentariosIniciales || []).map(resena => ({
      ...resena,
      juegoNombre: juego.nombre,
      juegoImagen: juego.imagen,
      juegoId: juego.id
    }))
  )

  const handleAgregarResena = (e) => {
    e.preventDefault()

    if (!formNuevaResena.juegoId || !formNuevaResena.autor.trim() || !formNuevaResena.texto.trim()) {
      alert('Por favor completa todos los campos')
      return
    }

    const hoy = new Date()
    const fecha = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`

    const nuevaResena = {
      id: Date.now(),
      autor: formNuevaResena.autor,
      texto: formNuevaResena.texto,
      puntuacion: parseFloat(formNuevaResena.puntuacion),
      fecha: fecha
    }

    const juegosActualizados = juegos.map(juego => {
      if (juego.id === parseInt(formNuevaResena.juegoId)) {
        return {
          ...juego,
          comentariosIniciales: [...(juego.comentariosIniciales || []), nuevaResena]
        }
      }
      return juego
    })

    if (onActualizarResenas) {
      onActualizarResenas(juegosActualizados)
    }

    setFormNuevaResena({ juegoId: '', autor: '', texto: '', puntuacion: 5 })
    setMostrarFormularioNueva(false)
  }

  const handleEliminarResena = (juegoId, resenaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      const juegosActualizados = juegos.map(juego => {
        if (juego.id === juegoId) {
          return {
            ...juego,
            comentariosIniciales: (juego.comentariosIniciales || []).filter(r => r.id !== resenaId)
          }
        }
        return juego
      })

      if (onActualizarResenas) {
        onActualizarResenas(juegosActualizados)
      }

      setResenaSeleccionada(null)
    }
  }

  let resenasFiltradas = todasLasResenas.filter(resena =>
    resena.juegoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    resena.texto.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (filtroOrdenacion === 'reciente') {
    resenasFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  } else if (filtroOrdenacion === 'puntuacion') {
    resenasFiltradas.sort((a, b) => b.puntuacion - a.puntuacion)
  } else if (filtroOrdenacion === 'antiguos') {
    resenasFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  }

  const renderStars = (puntos) => {
    return '★'.repeat(Math.floor(puntos)) + (puntos % 1 !== 0 ? '☆' : '')
  }

  return (
    <div className="lista-resenas">
      <div className="resenas-header">
        <h2>📝 Todas mis Reseñas</h2>
        <p>{resenasFiltradas.length} reseña{resenasFiltradas.length !== 1 ? 's' : ''}</p>
        <button
          className="btn-agregar-resena"
          onClick={() => setMostrarFormularioNueva(!mostrarFormularioNueva)}
        >
          {mostrarFormularioNueva ? '✕ Cancelar' : '+ Agregar Reseña'}
        </button>
      </div>

      {/* Formulario Nueva Reseña */}
      {mostrarFormularioNueva && (
        <form className="formulario-nueva-resena" onSubmit={handleAgregarResena}>
          <div className="form-grupo-resena">
            <label htmlFor="juego-select">Selecciona un juego:</label>
            <select
              id="juego-select"
              value={formNuevaResena.juegoId}
              onChange={(e) => setFormNuevaResena({ ...formNuevaResena, juegoId: e.target.value })}
              className="input-resena"
            >
              <option value="">-- Seleccionar juego --</option>
              {juegos.map(juego => (
                <option key={juego.id} value={juego.id}>{juego.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-grupo-resena">
            <label htmlFor="autor-input">Tu nombre:</label>
            <input
              id="autor-input"
              type="text"
              placeholder="Escribe tu nombre"
              value={formNuevaResena.autor}
              onChange={(e) => setFormNuevaResena({ ...formNuevaResena, autor: e.target.value })}
              className="input-resena"
            />
          </div>

          <div className="form-grupo-resena">
            <label htmlFor="puntuacion-input">Puntuación:</label>
            <select
              id="puntuacion-input"
              value={formNuevaResena.puntuacion}
              onChange={(e) => setFormNuevaResena({ ...formNuevaResena, puntuacion: e.target.value })}
              className="input-resena"
            >
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Excelente</option>
            </select>
          </div>

          <div className="form-grupo-resena">
            <label htmlFor="texto-input">Tu reseña:</label>
            <textarea
              id="texto-input"
              placeholder="Escribe tu reseña aquí..."
              value={formNuevaResena.texto}
              onChange={(e) => setFormNuevaResena({ ...formNuevaResena, texto: e.target.value })}
              className="input-resena textarea-resena"
              rows="4"
            ></textarea>
          </div>

          <div className="form-botones-resena">
            <button type="submit" className="btn-guardar-resena">Guardar Reseña</button>
            <button
              type="button"
              className="btn-cancelar-resena"
              onClick={() => {
                setMostrarFormularioNueva(false)
                setFormNuevaResena({ juegoId: '', autor: '', texto: '', puntuacion: 5 })
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="resenas-controles">
        <div className="grupo-busqueda">
          <input
            type="text"
            placeholder="Buscar en reseñas..."
            className="input-busqueda-resenas"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="icono-busqueda">🔍</span>
        </div>

        <div className="grupo-ordenar-resenas">
          <label htmlFor="ordenar-resenas">Ordenar:</label>
          <select
            id="ordenar-resenas"
            className="select-ordenar-resenas"
            value={filtroOrdenacion}
            onChange={(e) => setFiltroOrdenacion(e.target.value)}
          >
            <option value="reciente">Más Recientes</option>
            <option value="puntuacion">Mayor Puntuación</option>
            <option value="antiguos">Más Antiguos</option>
          </select>
        </div>
      </div>

      {resenasFiltradas.length === 0 ? (
        <div className="sin-resenas">
          <p className="sin-resenas-emoji">📭</p>
          <h3>Sin reseñas aún</h3>
          <p>Comienza escribiendo tu primera reseña en la Galería</p>
        </div>
      ) : (
        <div className="resenas-contenedor">
          {resenasFiltradas.map((resena, index) => (
            <div key={`${resena.juegoId}-${resena.id}`} className="resena-card">
              <div className="resena-header">
                <div className="juego-info">
                  <img src={resena.juegoImagen} alt={resena.juegoNombre} className="juego-thumb" />
                  <div className="juego-datos">
                    <h4>{resena.juegoNombre}</h4>
                    <p className="resena-autor">{resena.autor}</p>
                  </div>
                </div>
                <div className="resena-puntuacion">
                  <div className="estrellas-resena">
                    {renderStars(resena.puntuacion)}
                  </div>
                  <span className="numero-puntuacion">{resena.puntuacion}/5</span>
                </div>
              </div>

              <div className="resena-fecha">
                📅 {resena.fecha}
              </div>

              <p className="resena-texto">{resena.texto}</p>

              <div className="resena-botones">
                <button
                  className="btn-leer-mas"
                  onClick={() => setResenaSeleccionada(resena)}
                >
                  Leer más →
                </button>
                <button
                  className="btn-eliminar-resena"
                  onClick={() => handleEliminarResena(resena.juegoId, resena.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Reseña Detallada */}
      {resenaSeleccionada && (
        <div className="modal-overlay-resena" onClick={() => setResenaSeleccionada(null)}>
          <div className="modal-resena" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-cerrar-resena"
              onClick={() => setResenaSeleccionada(null)}
            >
              ✕
            </button>

            <div className="modal-resena-header">
              <img src={resenaSeleccionada.juegoImagen} alt={resenaSeleccionada.juegoNombre} />
              <div>
                <h3>{resenaSeleccionada.juegoNombre}</h3>
                <div className="estrellas-modal">
                  {renderStars(resenaSeleccionada.puntuacion)} {resenaSeleccionada.puntuacion}/5
                </div>
              </div>
            </div>

            <div className="modal-resena-info">
              <p><strong>Autor:</strong> {resenaSeleccionada.autor}</p>
              <p><strong>Fecha:</strong> {resenaSeleccionada.fecha}</p>
            </div>

            <div className="modal-resena-contenido">
              <p>{resenaSeleccionada.texto}</p>
            </div>

            <div className="modal-resena-botones">
              <button
                className="btn-cerrar-modal-resena"
                onClick={() => setResenaSeleccionada(null)}
              >
                Cerrar
              </button>
              <button
                className="btn-eliminar-modal-resena"
                onClick={() => handleEliminarResena(resenaSeleccionada.juegoId, resenaSeleccionada.id)}
              >
                🗑️ Eliminar Reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaResenas
