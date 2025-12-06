import { useState } from 'react'
import TarjetaJuego from './TarjetaJuego'
import ListaResenas from './ListaResenas'
import EstadisticasPersonales from './EstadisticasPersonales'
import './BibliotecaJuegos.css'

function BibliotecaJuegos() {
  const [seccionActiva, setSeccionActiva] = useState('biblioteca') // 'biblioteca', 'galeria', 'resenas', 'estadisticas'
  const [juegos, setJuegos] = useState([
    {
      id: 1,
      nombre: "Elden Ring",
      imagen: "/imagenes/foto.jpg",
      resena: 4.5,
      tiempoJugado: 120,
      comentariosIniciales: [
        {
          id: 1,
          texto: "¡Increíble juego! Desafiante pero adictivo.",
          puntuacion: 5,
          fecha: "01/12/2024",
          autor: "Usuario1"
        }
      ]
    },
    {
      id: 2,
      nombre: "Minecraft",
      imagen: "/imagenes/foto3.jpg",
      resena: 4.9,
      tiempoJugado: 500,
      comentariosIniciales: []
    },
    {
      id: 3,
      nombre: "Call of Duty",
      imagen: "/imagenes/foto2.jpg",
      resena: 4.2,
      tiempoJugado: 200,
      comentariosIniciales: []
    },
    {
      id: 4,
      nombre: "Free Fire",
      imagen: "/imagenes/foto5.jpg",
      resena: 4.1,
      tiempoJugado: 150,
      comentariosIniciales: []
    },
    {
      id: 5,
      nombre: "Honor of Kings",
      imagen: "/imagenes/foto6.jpeg",
      resena: 3,
      tiempoJugado: 180,
      comentariosIniciales: []
    },
    {
      id: 6,
      nombre: "Blood Strike",
      imagen: "/imagenes/foto4.jpg",
      resena: 3.5,
      tiempoJugado: 90,
      comentariosIniciales: []
    }
  ])

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [juegoEditando, setJuegoEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [ordenar, setOrdenar] = useState('nombre')

  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    resena: 5,
    tiempoJugado: 0
  })

  const handleAbrirFormulario = () => {
    setFormData({ nombre: '', imagen: '', resena: 5, tiempoJugado: 0 })
    setJuegoEditando(null)
    setMostrarFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
    setJuegoEditando(null)
    setFormData({ nombre: '', imagen: '', resena: 5, tiempoJugado: 0 })
  }

  const handleGuardarJuego = (e) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      alert('Por favor ingresa el nombre del juego')
      return
    }

    if (juegoEditando) {
      setJuegos(juegos.map(j => 
        j.id === juegoEditando.id 
          ? { ...juegoEditando, ...formData }
          : j
      ))
    } else {
      const nuevoJuego = {
        id: Date.now(),
        ...formData,
        comentariosIniciales: []
      }
      setJuegos([...juegos, nuevoJuego])
    }

    handleCerrarFormulario()
  }

  const handleEditarJuego = (juego) => {
    setFormData({
      nombre: juego.nombre,
      imagen: juego.imagen,
      resena: juego.resena,
      tiempoJugado: juego.tiempoJugado
    })
    setJuegoEditando(juego)
    setMostrarFormulario(true)
  }

  const handleEliminarJuego = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      setJuegos(juegos.filter(j => j.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'resena' || name === 'tiempoJugado' ? Number(value) : value
    })
  }

  let juegosFiltrados = juegos.filter(juego =>
    juego.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (ordenar === 'nombre') {
    juegosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
  } else if (ordenar === 'resena') {
    juegosFiltrados.sort((a, b) => b.resena - a.resena)
  } else if (ordenar === 'tiempoJugado') {
    juegosFiltrados.sort((a, b) => b.tiempoJugado - a.tiempoJugado)
  }

  return (
    <div className="biblioteca-juegos">
      {/* Navegación */}
      <nav className="navegacion-principal">
        <div className="nav-contenedor">
          <h1 className="nav-logo">🎮 Game tracker</h1>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-boton ${seccionActiva === 'biblioteca' ? 'activo' : ''}`}
                onClick={() => setSeccionActiva('biblioteca')}
              >
                📚 Biblioteca
              </button>
            </li>
            <li>
              <button
                className={`nav-boton ${seccionActiva === 'galeria' ? 'activo' : ''}`}
                onClick={() => setSeccionActiva('galeria')}
              >
                🎴 Galería
              </button>
            </li>
            <li>
              <button
                className={`nav-boton ${seccionActiva === 'resenas' ? 'activo' : ''}`}
                onClick={() => setSeccionActiva('resenas')}
              >
                📝 Reseñas
              </button>
            </li>
            <li>
              <button
                className={`nav-boton ${seccionActiva === 'estadisticas' ? 'activo' : ''}`}
                onClick={() => setSeccionActiva('estadisticas')}
              >
                📊 Estadísticas
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* SECCIÓN BIBLIOTECA */}
      {seccionActiva === 'biblioteca' && (
        <div className="seccion-biblioteca">
          <header className="biblioteca-header">
            <div className="biblioteca-titulo">
              <h2>📚 Mi Biblioteca de Juegos</h2>
              <p className="contador-juegos">{juegos.length} juego{juegos.length !== 1 ? 's' : ''}</p>
            </div>

            <button 
              className="btn-agregar-juego"
              onClick={handleAbrirFormulario}
            >
              ➕ Agregar Juego
            </button>
          </header>

          <div className="biblioteca-controles">
            <div className="grupo-busqueda">
              <input
                type="text"
                placeholder="Buscar juego..."
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="icono-busqueda">🔍</span>
            </div>

            <div className="grupo-ordenar">
              <label htmlFor="ordenar">Ordenar por:</label>
              <select
                id="ordenar"
                className="select-ordenar"
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="resena">Puntuación</option>
                <option value="tiempoJugado">Tiempo Jugado</option>
              </select>
            </div>
          </div>

          <div className="biblioteca-lista">
            {juegos.length === 0 ? (
              <div className="sin-juegos-biblioteca">
                <p>No hay juegos en tu biblioteca</p>
                <button 
                  className="btn-agregar-primero"
                  onClick={handleAbrirFormulario}
                >
                  Crear Primer Juego
                </button>
              </div>
            ) : (
              <table className="tabla-juegos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Puntuación</th>
                    <th>Horas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {juegosFiltrados.map(juego => (
                    <tr key={juego.id}>
                      <td>
                        <div className="celda-nombre">
                          <img src={juego.imagen} alt={juego.nombre} className="minatura-juego" />
                          <span>{juego.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="celda-estrellas">
                          {'★'.repeat(Math.floor(juego.resena))} {juego.resena.toFixed(1)}
                        </div>
                      </td>
                      <td>{juego.tiempoJugado}h</td>
                      <td>
                        <div className="botones-tabla">
                          <button
                            className="btn-tabla btn-editar-tabla"
                            onClick={() => handleEditarJuego(juego)}
                            title="Editar"
                          >
                            ✎
                          </button>
                          <button
                            className="btn-tabla btn-eliminar-tabla"
                            onClick={() => handleEliminarJuego(juego.id)}
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN GALERÍA */}
      {seccionActiva === 'galeria' && (
        <div className="seccion-galeria">
          <header className="galeria-header">
            <h2>🎴 Galería de Juegos</h2>
            <p>{juegos.length} juego{juegos.length !== 1 ? 's' : ''} en tu colección</p>
          </header>

          <div className="galeria-controles">
            <div className="grupo-busqueda">
              <input
                type="text"
                placeholder="Buscar juego..."
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="icono-busqueda">🔍</span>
            </div>

            <div className="grupo-ordenar">
              <label htmlFor="ordenar-galeria">Ordenar por:</label>
              <select
                id="ordenar-galeria"
                className="select-ordenar"
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="resena">Puntuación</option>
                <option value="tiempoJugado">Tiempo Jugado</option>
              </select>
            </div>
          </div>

          <div className="galeria-contenido">
            {juegosFiltrados.length === 0 ? (
              <div className="sin-juegos">
                <p className="sin-juegos-emoji">🎮</p>
                <h3>Sin juegos para mostrar</h3>
                <p>
                  {busqueda 
                    ? `No encontramos juegos que coincidan con "${busqueda}"`
                    : 'Tu galería está vacía'}
                </p>
              </div>
            ) : (
              <div className="tarjetas-grid">
                {juegosFiltrados.map(juego => (
                  <div key={juego.id} className="tarjeta-contenedor">
                    <TarjetaJuego {...juego} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN RESEÑAS */}
      {seccionActiva === 'resenas' && (
        <ListaResenas juegos={juegos} onActualizarResenas={setJuegos} />
      )}

      {/* SECCIÓN ESTADÍSTICAS */}
      {seccionActiva === 'estadisticas' && (
        <EstadisticasPersonales juegos={juegos} />
      )}

      {/* Modal */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={handleCerrarFormulario}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{juegoEditando ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
              <button 
                className="btn-cerrar-modal"
                onClick={handleCerrarFormulario}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarJuego} className="formulario-juego">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Juego *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Elden Ring"
                  className="input-form"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagen">URL de la Imagen</label>
                <input
                  type="url"
                  id="imagen"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="input-form"
                />
                {formData.imagen && (
                  <div className="preview-imagen">
                    <img src={formData.imagen} alt="Vista previa" />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="resena">Puntuación</label>
                  <select
                    id="resena"
                    name="resena"
                    value={formData.resena}
                    onChange={handleInputChange}
                    className="select-form"
                  >
                    <option value={1}>⭐ 1.0 - Muy malo</option>
                    <option value={1.5}>⭐ 1.5</option>
                    <option value={2}>⭐⭐ 2.0 - Malo</option>
                    <option value={2.5}>⭐ 2.5</option>
                    <option value={3}>⭐⭐⭐ 3.0 - Regular</option>
                    <option value={3.5}>⭐ 3.5</option>
                    <option value={4}>⭐⭐⭐⭐ 4.0 - Bueno</option>
                    <option value={4.5}>⭐ 4.5</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5.0 - Excelente</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tiempoJugado">Horas Jugadas</label>
                  <input
                    type="number"
                    id="tiempoJugado"
                    name="tiempoJugado"
                    value={formData.tiempoJugado}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="input-form"
                  />
                </div>
              </div>

              <div className="form-acciones">
                <button 
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCerrarFormulario}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-guardar"
                >
                  {juegoEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BibliotecaJuegos
