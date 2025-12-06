import { useState } from 'react'
import './TarjetaJuego.css'

function TarjetaJuego({ 
  id = 1,
  nombre = "Elden Ring",
  imagen = "/imagenes/foto.jpg",
  resena = 4.5,
  tiempoJugado = 45,
  comentariosIniciales = []
}) {
  const [comentarios, setComentarios] = useState(comentariosIniciales)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [puntuacion, setPuntuacion] = useState(5)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const handleAnadirComentario = (e) => {
    e.preventDefault()
    
    if (nuevoComentario.trim() === '') return

    const comentario = {
      id: Date.now(),
      texto: nuevoComentario,
      puntuacion: puntuacion,
      fecha: new Date().toLocaleDateString('es-ES'),
      autor: 'Usuario'
    }

    setComentarios([comentario, ...comentarios])
    setNuevoComentario('')
    setPuntuacion(5)
    setMostrarFormulario(false)
  }

  const handleEliminarComentario = (idComentario) => {
    setComentarios(comentarios.filter(c => c.id !== idComentario))
  }

  const renderStars = (puntos) => {
    return '★'.repeat(Math.floor(puntos)) + (puntos % 1 !== 0 ? '☆' : '')
  }

  return (
    <div className="tarjeta-juego">
      <div className="tarjeta-imagen">
        <img src={imagen} alt={nombre} />
        <div className="tarjeta-badge">
          <span className="tiempo-jugado">
            ⏱️ {tiempoJugado}h
          </span>
        </div>
      </div>

      <div className="tarjeta-contenido">
        <h2 className="tarjeta-titulo">{nombre}</h2>

        <div className="tarjeta-resena">
          <div className="estrellas">
            {renderStars(resena)}
          </div>
          <span className="puntuacion-texto">{resena.toFixed(1)}/5</span>
        </div>

        <div className="tarjeta-stats">
          <div className="stat">
            <span className="stat-label">Tiempo jugado:</span>
            <span className="stat-valor">{tiempoJugado} horas</span>
          </div>
          <div className="stat">
            <span className="stat-label">Comentarios:</span>
            <span className="stat-valor">{comentarios.length}</span>
          </div>
        </div>

        <div className="comentarios-seccion">
          <h3 className="comentarios-titulo">
            Reseñas y Comentarios
            <button 
              className="btn-anadir"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              {mostrarFormulario ? '✕' : '+ Añadir'}
            </button>
          </h3>

          {mostrarFormulario && (
            <form className="formulario-comentario" onSubmit={handleAnadirComentario}>
              <div className="form-group">
                <label htmlFor="puntuacion">Puntuación:</label>
                <select 
                  id="puntuacion"
                  value={puntuacion} 
                  onChange={(e) => setPuntuacion(Number(e.target.value))}
                  className="select-puntuacion"
                >
                  <option value={1}>⭐ 1 - Muy malo</option>
                  <option value={2}>⭐⭐ 2 - Malo</option>
                  <option value={3}>⭐⭐⭐ 3 - Regular</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Bueno</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Excelente</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comentario">Tu comentario:</label>
                <textarea
                  id="comentario"
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder="Comparte tu experiencia con este juego..."
                  className="textarea-comentario"
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-enviar">
                Enviar Reseña
              </button>
            </form>
          )}

          <div className="lista-comentarios">
            {comentarios.length === 0 ? (
              <p className="sin-comentarios">Sin reseñas aún. ¡Sé el primero!</p>
            ) : (
              comentarios.map((comentario) => (
                <div key={comentario.id} className="comentario-item">
                  <div className="comentario-header">
                    <div className="comentario-info">
                      <strong className="comentario-autor">{comentario.autor}</strong>
                      <span className="comentario-fecha">{comentario.fecha}</span>
                    </div>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminarComentario(comentario.id)}
                      title="Eliminar comentario"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="comentario-puntuacion">
                    {renderStars(comentario.puntuacion)} {comentario.puntuacion}/5
                  </div>
                  <p className="comentario-texto">{comentario.texto}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TarjetaJuego
