'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import { ncmComunes } from '../data/ncm'

export default function Nomenclador() {
  const [busqueda, setBusqueda] = useState('')

  // Lógica de filtrado interno
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
                Acceso directo a las bases oficiales y privadas de clasificación.
            </p>
          </div>

          {/* --- SECCIÓN 1: ACCESOS DIRECTOS (GRID 2x2) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              
              {/* TARJETA 1: SIM / ARANCEL INTEGRADO (AFIP) */}
              <a 
                href="https://serviciosweb.afip.gob.ar/aduana/arancelintegrado/default.asp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all group"
              >
                  <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏛️</div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">SISTEMA MALVINA</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700">Consulta Arancel Integrado</h3>
                  <p className="text-sm text-slate-500 mt-2">
                      Base oficial de AFIP. Consultá Derechos de Importación, Tasas, IVA y Reintegros vigentes hoy.
                  </p>
                  <div className="mt-4 text-sm font-bold text-blue-600 flex items-center gap-1">
                      Entrar al SIM Online →
                  </div>
              </a>

              {/* TARJETA 2: TARIFAR (La Clave) */}
              <a 
                href="https://www.tarifar.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-red-500 transition-all group"
              >
                  <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📕</div>
                      <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded">PRIVADO / LÍDER</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-red-700">TARIFAR</h3>
                  <p className="text-sm text-slate-500 mt-2">
                      El buscador más potente del mercado. Normativa, jurisprudencia y clasificación inteligente.
                  </p>
                  <div className="mt-4 text-sm font-bold text-red-600 flex items-center gap-1">
                      Ir a Tarifar →
                  </div>
              </a>

              {/* TARJETA 3: MERCOSUR (Estructura) */}
              <a 
                href="https://www.mercosur.int/politica-comercial/nomenclatura-comun-ncm-y-arancel-externo-comun-aec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-green-500 transition-all group"
              >
                  <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">🌍</div>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">NCM / AEC</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-green-700">Nomenclatura Mercosur</h3>
                  <p className="text-sm text-slate-500 mt-2">
                      Visualizá el árbol completo, notas de sección y Arancel Externo Común.
                  </p>
                  <div className="mt-4 text-sm font-bold text-green-600 flex items-center gap-1">
                      Ver Árbol Mercosur →
                  </div>
              </a>

              {/* TARJETA 4: VUCE (Intervenciones) */}
              <a 
                href="https://www.vuce.gob.ar/central-informacion-cice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-orange-400 transition-all group"
              >
                  <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🚧</div>
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded">VUCE / CICE</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-orange-700">Central de Prohibiciones</h3>
                  <p className="text-sm text-slate-500 mt-2">
                      Chequeá intervenciones de terceros organismos (ANMAT, Seguridad Eléctrica, SENASA).
                  </p>
                  <div className="mt-4 text-sm font-bold text-orange-600 flex items-center gap-1">
                      Consultar VUCE →
                  </div>
              </a>
          </div>

          {/* --- SECCIÓN 2: TUS APUNTES INTERNOS (Sigue igual) --- */}
          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">📂 Mis Clasificaciones Guardadas</h2>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-300 mb-6 max-w-2xl">
                <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar en mis productos frecuentes (ej: tablet)..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:ring-0 text-slate-900 outline-none"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold border-b">NCM</th>
                            <th className="p-4 font-bold border-b w-1/3">Descripción</th>
                            <th className="p-4 font-bold border-b text-center">D.I.</th>
                            <th className="p-4 font-bold border-b text-center">IVA</th>
                            <th className="p-4 font-bold border-b text-center">Intervenciones</th>
                            <th className="p-4 font-bold border-b text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {resultados.length > 0 ? (
                            resultados.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-purple-700">{item.codigo}</td>
                                    <td className="p-4 text-slate-800 font-medium">{item.descripcion}</td>
                                    <td className="p-4 text-center font-bold">{item.di}</td>
                                    <td className="p-4 text-center text-slate-600">{item.iva}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {item.intervenciones?.map((inter, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-800 border border-orange-200 rounded text-[10px] uppercase font-bold">
                                                    {inter}
                                                </span>
                                            ))}
                                            {!item.intervenciones && <span className="text-slate-300">-</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => alert(`NCM ${item.codigo} copiado`)} className="text-slate-500 hover:text-purple-600 font-bold text-xs">
                                            COPIAR
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">Sin resultados internos. Usá los botones de arriba 👆</td></tr>
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