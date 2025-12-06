import './EstadisticasPersonales.css'

function EstadisticasPersonales({ juegos = [] }) {
  // Calcular estadísticas
  const totalJuegos = juegos.length
  const totalResenas = juegos.reduce((sum, juego) => sum + (juego.comentariosIniciales?.length || 0), 0)
  const totalHoras = juegos.reduce((sum, juego) => sum + (juego.tiempoJugado || 0), 0)
  const puntuacionPromedio = totalJuegos > 0 
    ? (juegos.reduce((sum, juego) => sum + (juego.resena || 0), 0) / totalJuegos).toFixed(1)
    : 0

  // Top 3 juegos por puntuación
  const top3Juegos = [...juegos]
    .sort((a, b) => (b.resena || 0) - (a.resena || 0))
    .slice(0, 3)

  // Top 3 juegos más jugados
  const top3MasJugados = [...juegos]
    .sort((a, b) => (b.tiempoJugado || 0) - (a.tiempoJugado || 0))
    .slice(0, 3)

  // Distribución de puntuaciones
  const distribucion = {
    '5 estrellas': juegos.filter(j => j.resena >= 4.5).length,
    '4 estrellas': juegos.filter(j => j.resena >= 3.5 && j.resena < 4.5).length,
    '3 estrellas': juegos.filter(j => j.resena >= 2.5 && j.resena < 3.5).length,
    '2 estrellas': juegos.filter(j => j.resena >= 1.5 && j.resena < 2.5).length,
    '1 estrella': juegos.filter(j => j.resena < 1.5).length
  }

  const renderStars = (puntos) => {
    return '★'.repeat(Math.floor(puntos)) + (puntos % 1 !== 0 ? '☆' : '')
  }

  return (
    <div className="estadisticas-personales">
      <div className="stats-header">
        <h2>📊 Mis Estadísticas</h2>
        <p>Un resumen de tu actividad en GameLib</p>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="stats-principales">
        <div className="stat-card">
          <div className="stat-icono">🎮</div>
          <div className="stat-contenido">
            <h3>{totalJuegos}</h3>
            <p>Juegos en Biblioteca</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">⏱️</div>
          <div className="stat-contenido">
            <h3>{totalHoras}</h3>
            <p>Horas Jugadas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">📝</div>
          <div className="stat-contenido">
            <h3>{totalResenas}</h3>
            <p>Reseñas Escritas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">⭐</div>
          <div className="stat-contenido">
            <h3>{puntuacionPromedio}</h3>
            <p>Puntuación Promedio</p>
          </div>
        </div>
      </div>

      {/* Sección de Gráficos */}
      <div className="stats-section">
        <h3>📈 Distribución de Puntuaciones</h3>
        <div className="distribucion-grid">
          {Object.entries(distribucion).map(([categoria, cantidad]) => (
            <div key={categoria} className="distribucion-item">
              <div className="distribucion-etiqueta">{categoria}</div>
              <div className="distribucion-barra">
                <div 
                  className="distribucion-fill"
                  style={{ 
                    width: `${totalJuegos > 0 ? (cantidad / totalJuegos) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="distribucion-numero">{cantidad}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Juegos */}
      <div className="stats-grid">
        <div className="stats-section">
          <h3>🏆 Top 3 Mejor Puntuados</h3>
          {top3Juegos.length === 0 ? (
            <p className="sin-datos">No hay datos disponibles</p>
          ) : (
            <div className="top-lista">
              {top3Juegos.map((juego, index) => (
                <div key={juego.id} className="top-item">
                  <div className="top-posicion">#{index + 1}</div>
                  <img src={juego.imagen} alt={juego.nombre} className="top-imagen" />
                  <div className="top-info">
                    <h4>{juego.nombre}</h4>
                    <div className="top-estrellas">
                      {renderStars(juego.resena)} {juego.resena}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-section">
          <h3>⏰ Top 3 Más Jugados</h3>
          {top3MasJugados.length === 0 ? (
            <p className="sin-datos">No hay datos disponibles</p>
          ) : (
            <div className="top-lista">
              {top3MasJugados.map((juego, index) => (
                <div key={juego.id} className="top-item">
                  <div className="top-posicion">#{index + 1}</div>
                  <img src={juego.imagen} alt={juego.nombre} className="top-imagen" />
                  <div className="top-info">
                    <h4>{juego.nombre}</h4>
                    <div className="top-horas">
                      ⏱️ {juego.tiempoJugado} horas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Información Adicional */}
      {totalJuegos === 0 && (
        <div className="sin-juegos-stats">
          <p className="sin-juegos-emoji">📚</p>
          <h3>Comienza a agregar juegos</h3>
          <p>Tus estadísticas aparecerán aquí una vez que agregues juegos a tu biblioteca</p>
        </div>
      )}
    </div>
  )
}

export default EstadisticasPersonales
