'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Operaciones() {
  const [operaciones, setOperaciones] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroPais, setFiltroPais] = useState('Todos')

  // Función para borrar operación
  const borrarOperacion = (id: number) => {
    if (confirm('¿Estás segura que querés eliminar esta operación?')) {
      const nuevasOperaciones = operaciones.filter(op => op.id !== id)
      setOperaciones(nuevasOperaciones)
      localStorage.setItem('operaciones', JSON.stringify(nuevasOperaciones))
    }
  }

  // Función para cambiar estado
  const cambiarEstado = (id: number) => {
    const operacion = operaciones.find(op => op.id === id)
    if (!operacion) return
    
    let nuevoEstado = ''
    if (operacion.estado === 'Pendiente') nuevoEstado = 'En proceso'
    else if (operacion.estado === 'En proceso') nuevoEstado = 'Completada'
    else nuevoEstado = 'Pendiente'
    
    const nuevasOperaciones = operaciones.map(op => 
      op.id === id ? { ...op, estado: nuevoEstado } : op
    )
    
    setOperaciones(nuevasOperaciones)
    localStorage.setItem('operaciones', JSON.stringify(nuevasOperaciones))
  }

  // Cargar operaciones del localStorage al inicio
  useEffect(() => {
    const guardadas = localStorage.getItem('operaciones')
    if (guardadas) {
      setOperaciones(JSON.parse(guardadas))
    } else {
      const ejemplos = [
        {
          id: 1,
          cliente: "PAVECO S.A.",
          tipo: "Importación",
          pais: "Bolivia",
          producto: "Aditivos biopolímeros",
          ncm: "3824.99.90",
          estado: "En proceso",
          fecha: "2025-02-01"
        },
        {
          id: 2,
          cliente: "Industrial Tech",
          tipo: "Exportación",
          pais: "Chile",
          producto: "Maquinaria agrícola",
          ncm: "8432.80.00",
          estado: "Completada",
          fecha: "2025-01-28"
        },
        {
          id: 3,
          cliente: "Alimentos del Sur",
          tipo: "Importación",
          pais: "Brasil",
          producto: "Productos alimenticios",
          ncm: "2106.90.90",
          estado: "Pendiente",
          fecha: "2025-02-05"
        }
      ]
      setOperaciones(ejemplos)
      localStorage.setItem('operaciones', JSON.stringify(ejemplos))
    }
  }, [])

  // Filtrar operaciones
  const operacionesFiltradas = operaciones.filter(op => {
    const matchBusqueda = op.cliente.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = filtroTipo === 'Todos' || op.tipo === filtroTipo
    const matchEstado = filtroEstado === 'Todos' || op.estado === filtroEstado
    const matchPais = filtroPais === 'Todos' || op.pais === filtroPais
    
    return matchBusqueda && matchTipo && matchEstado && matchPais
  })

  // Lista única de países
  const paisesUnicos = ['Todos', ...Array.from(new Set(operaciones.map(op => op.pais)))]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Operaciones
              </h1>
              <p className="text-gray-600">
                Gestiona tus operaciones aduaneras
              </p>
            </div>
            
            <button 
              onClick={() => window.location.href = '/operaciones/nueva'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              + Nueva Operación
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm mb-1">Total</div>
              <div className="text-3xl font-bold text-purple-600">{operaciones.length}</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm mb-1">En Proceso</div>
              <div className="text-3xl font-bold text-orange-600">
                {operaciones.filter(op => op.estado === "En proceso").length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm mb-1">Completadas</div>
              <div className="text-3xl font-bold text-green-600">
                {operaciones.filter(op => op.estado === "Completada").length}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Filtros</h3>
            
            <div className="grid grid-cols-4 gap-4">
              {/* Buscador */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar Cliente
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: PAVECO"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Filtro Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                >
                  <option value="Todos">Todos</option>
                  <option value="Importación">Importación</option>
                  <option value="Exportación">Exportación</option>
                </select>
              </div>

              {/* Filtro Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                >
                  <option value="Todos">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              {/* Filtro País */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  País
                </label>
                <select
                  value={filtroPais}
                  onChange={(e) => setFiltroPais(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                >
                  {paisesUnicos.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {(busqueda || filtroTipo !== 'Todos' || filtroEstado !== 'Todos' || filtroPais !== 'Todos') && (
              <button
                onClick={() => {
                  setBusqueda('')
                  setFiltroTipo('Todos')
                  setFiltroEstado('Todos')
                  setFiltroPais('Todos')
                }}
                className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-semibold"
              >
                ✕ Limpiar todos los filtros
              </button>
            )}

            {/* Contador de resultados */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {operacionesFiltradas.length} de {operaciones.length} operaciones
            </div>
          </div>

          {/* Tabla de operaciones */}
          {operacionesFiltradas.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Cliente</th>
                    <th className="px-6 py-4 text-left font-semibold">Tipo</th>
                    <th className="px-6 py-4 text-left font-semibold">País</th>
                    <th className="px-6 py-4 text-left font-semibold">Producto</th>
                    <th className="px-6 py-4 text-left font-semibold">NCM</th>
                    <th className="px-6 py-4 text-left font-semibold">Estado</th>
                    <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                    <th className="px-6 py-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {operacionesFiltradas.map((op, index) => (
                    <tr 
                      key={op.id}
                      onClick={() => window.location.href = `/operaciones/${op.id}`}
                      className={`border-b hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <tr 
  key={op.id}
  onClick={() => window.location.href = `/operaciones/${op.id}`}
  className={`border-b hover:bg-purple-50 transition-colors cursor-pointer ${
    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
  }`}
></tr>
                      <td className="px-6 py-4 font-semibold text-gray-800">{op.cliente}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          op.tipo === "Importación" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {op.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{op.pais}</td>
                      <td className="px-6 py-4 text-gray-700">{op.producto}</td>
                      <td className="px-6 py-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {op.ncm}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            cambiarEstado(op.id)
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            op.estado === "Completada" 
                              ? "bg-green-100 text-green-700"
                              : op.estado === "En proceso"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {op.estado}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{op.fecha}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            borrarOperacion(op.id)
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-3 py-1 rounded transition-all"
                        >
                          🗑️ Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay operaciones que coincidan con los filtros
              </h3>
              <p className="text-gray-500 mb-6">
                Intentá con otros criterios de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}