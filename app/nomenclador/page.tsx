'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import { ncmComunes } from '../data/ncm'

export default function Nomenclador() {
  const [busqueda, setBusqueda] = useState('')

  // Lógica de filtrado
  const resultados = ncmComunes.filter(item => 
    item.codigo.includes(busqueda) || 
    item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Nomenclador Arancelario</h1>
            <p className="text-slate-600">
                Consulta posiciones NCM, aranceles e intervenciones oficiales.
            </p>
          </div>

          {/* BUSCADOR GRANDE */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8 max-w-3xl mx-auto">
            <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 text-xl">🔍</span>
                <input 
                    type="text" 
                    placeholder="Ingresá Código NCM (ej: 3824) o descripción (ej: tablet)..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg outline-none"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <div className="mt-3 text-xs text-slate-500 flex justify-between px-2">
                <span>Base actualizada: FEB-2026</span>
                <span>Fuente: SIM / Tarifa Oficial</span>
            </div>
          </div>

          {/* TABLA DE RESULTADOS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Resultados de la búsqueda</h2>
                <span className="text-sm text-slate-500">{resultados.length} posiciones encontradas</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold border-b">Posición NCM</th>
                            <th className="p-4 font-bold border-b w-1/3">Descripción</th>
                            <th className="p-4 font-bold border-b text-center">D.I.</th>
                            <th className="p-4 font-bold border-b text-center">IVA</th>
                            <th className="p-4 font-bold border-b text-center">Licencia</th>
                            <th className="p-4 font-bold border-b">Intervenciones</th>
                            <th className="p-4 font-bold border-b text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {resultados.length > 0 ? (
                            resultados.map((item, idx) => (
                                <tr key={idx} className="hover:bg-purple-50 transition-colors group">
                                    <td className="p-4 font-mono font-bold text-purple-700 text-base">
                                        {item.codigo}
                                    </td>
                                    <td className="p-4 text-slate-700 font-medium">
                                        {item.descripcion}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">{item.di}</span>
                                    </td>
                                    <td className="p-4 text-center text-slate-600">
                                        {item.iva}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            item.licencia === 'LNA' 
                                            ? 'bg-red-100 text-red-700' 
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                            {item.licencia}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {item.intervenciones?.map((inter, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] uppercase font-semibold">
                                                    {inter}
                                                </span>
                                            ))}
                                            {!item.intervenciones && <span className="text-slate-400">-</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => alert(`Simulación: Copiado NCM ${item.codigo}`)}
                                            className="text-purple-600 hover:text-purple-800 font-bold text-xs border border-purple-200 hover:bg-purple-100 px-3 py-1 rounded transition-all"
                                        >
                                            USAR
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-slate-400">
                                    <div className="text-4xl mb-2">🤔</div>
                                    <p>No encontramos resultados para "{busqueda}"</p>
                                    <p className="text-xs mt-2">Probá buscando por código (4 dígitos) o palabras clave.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}