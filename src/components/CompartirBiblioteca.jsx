import { useState } from 'react'
import './CompartirBiblioteca.css'

function CompartirBiblioteca({ bibliotecaId, onCompartir }) {
  const [copiado, setCopiado] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  const urlCompartible = `${window.location.origin}/biblioteca/${bibliotecaId}`

  const handleCopiar = () => {
    navigator.clipboard.writeText(urlCompartible)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <>
      <button
        className="btn-compartir"
        onClick={() => setMostrarModal(true)}
        title="Generar enlace compartible"
      >
        🔗 Compartir
      </button>

      {mostrarModal && (
        <div className="modal-overlay-compartir" onClick={() => setMostrarModal(false)}>
          <div className="modal-compartir" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-cerrar-compartir"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>

            <h2>📤 Compartir Biblioteca</h2>
            <p>Comparte tu biblioteca con amigos usando este enlace:</p>

            <div className="contenedor-url-compartir">
              <input
                type="text"
                value={urlCompartible}
                readOnly
                className="input-url-compartir"
              />
              <button
                className={`btn-copiar-url ${copiado ? 'copiado' : ''}`}
                onClick={handleCopiar}
              >
                {copiado ? '✓ Copiado' : '📋 Copiar'}
              </button>
            </div>

            <div className="info-compartir">
              <p>✅ Tu biblioteca es pública</p>
              <p>🔗 Cualquiera puede verla con el enlace</p>
              <p>📊 Las estadísticas se actualizan en tiempo real</p>
            </div>

            <button
              className="btn-cerrar-modal-compartir"
              onClick={() => setMostrarModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CompartirBiblioteca
