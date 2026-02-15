'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function ListaOperaciones() {
  const [operaciones, setOperaciones] = useState([])

  useEffect(() => {
    // Cargar datos del navegador
    const guardadas = JSON.parse(localStorage.getItem('operaciones') || '[]')
    setOperaciones(guardadas)
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Mis Operaciones</h1>
                <p className="text-slate-600">Gestioná tus despachos en curso e históricos.</p>
            </div>
            <a href="/operaciones/nueva" className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all text-center flex justify-center items-center gap-2">
                <span>+</span> Nueva Operación
            </a>
          </div>

          {operaciones.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-slate-900">Aún no hay operaciones</h3>
                <p className="text-slate-500 mb-6">Comenzá cargando tu primer despacho.</p>
            </div>
          ) : (
            <>
                {/* --- VISTA MÓVIL (TARJETAS) --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {operaciones.map((op: any) => (
                        <div key={op.id} onClick={() => window.location.href = `/operaciones/${op.id}`} 
                             className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-transform cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{op.cliente}</h3>
                                    <p className="text-xs text-slate-500 font-mono">#{op.id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    op.tipo === 'Importación' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                }`}>
                                    {op.tipo.substring(0,3).toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <p className="text-sm text-slate-700 truncate">📦 {op.producto}</p>
                                <p className="text-sm text-slate-500">🌍 {op.pais}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                <span className="text-xs font-bold text-slate-400">{op.fecha}</span>
                                <span className="text-purple-600 font-bold text-sm flex items-center gap-1">
                                    Ver Detalle →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- VISTA PC (TABLA) --- */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-bold">ID</th>
                                <th className="p-4 font-bold">Cliente</th>
                                <th className="p-4 font-bold">Tipo</th>
                                <th className="p-4 font-bold">Producto</th>
                                <th className="p-4 font-bold">Origen/Destino</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {operaciones.map((op: any) => (
                                <tr key={op.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 font-mono text-slate-400">#{op.id.toString().slice(-4)}</td>
                                    <td className="p-4 font-bold text-slate-900">{op.cliente}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            op.tipo === 'Importación' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'
                                        }`}>
                                            {op.tipo}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 max-w-[200px] truncate">{op.producto}</td>
                                    <td className="p-4 text-slate-600">{op.pais}</td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                            <span className="text-slate-700 font-medium">En Curso</span>
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <a href={`/operaciones/${op.id}`} className="text-purple-600 font-bold hover:text-purple-800 hover:underline">
                                            Gestionar
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}