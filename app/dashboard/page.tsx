'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOperaciones: 0,
    totalClientes: 0,
    enProceso: 0,
    pendientes: 0
  })

  useEffect(() => {
    // Evitamos errores si no hay datos en localStorage
    if (typeof window !== 'undefined') {
        const operaciones = JSON.parse(localStorage.getItem('operaciones') || '[]')
        const clientesUnicos = new Set(operaciones.map((op: any) => op.cliente)).size

        setStats({
          totalOperaciones: operaciones.length,
          totalClientes: clientesUnicos,
          enProceso: operaciones.filter((op: any) => op.estado === 'En proceso' || op.estado === 'Pendiente').length,
          pendientes: operaciones.filter((op: any) => op.estado === 'Pendiente').length
        })
    }
  }, [])

  return (
    <>
      <Navbar />
      
      {/* Padding responsivo: p-4 en móvil, p-8 en PC */}
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Encabezado */}
          <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Panel de Control</h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">Visión general de tus operaciones aduaneras.</p>
          </div>

          {/* Tarjeta de Bienvenida (Flex Col en móvil, Row en PC) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
                Hola, Majo 👋
              </h2>
              <p className="text-slate-700 text-sm md:text-lg">
                Tenés <strong className="text-purple-700">{stats.enProceso} operaciones activas</strong> hoy.
              </p>
            </div>
            
            {/* Botones: Full width en móvil, auto en PC */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button 
                  onClick={() => window.location.href = '/operaciones'}
                  className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all shadow-sm text-center"
              >
                  Ver Listado
              </button>
              <button 
                  onClick={() => window.location.href = '/operaciones/nueva'}
                  className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                  <span>+</span> Nueva Op.
              </button>
            </div>
          </div>

          {/* Métricas (KPIs) - Grid 1 en móvil, Grid 3 en PC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            
            {/* KPI 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start h-auto md:h-32">
              <div className="text-slate-500 font-medium text-xs md:text-sm uppercase tracking-wider">Operaciones</div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stats.totalOperaciones}</div>
              <div className="md:hidden text-2xl">📦</div> {/* Ícono solo móvil */}
            </div>
            
            {/* KPI 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start h-auto md:h-32">
              <div className="text-slate-500 font-medium text-xs md:text-sm uppercase tracking-wider">Clientes</div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stats.totalClientes}</div>
              <div className="md:hidden text-2xl">👥</div>
            </div>
            
            {/* KPI 3 (Con borde verde) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start h-auto md:h-32 relative overflow-hidden">
               <div className="absolute right-0 top-0 bottom-0 md:h-full w-1.5 md:w-1 bg-green-500"></div>
              <div className="text-slate-500 font-medium text-xs md:text-sm uppercase tracking-wider">Honorarios Est.</div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                  U$S {(stats.totalOperaciones * 250).toLocaleString()}
              </div>
              <div className="md:hidden text-2xl">💰</div>
            </div>
          </div>

          {/* Sección de Novedades */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                  📢 Novedades del Sistema
              </h3>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-full min-w-[40px] flex justify-center">
                      🤖
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-900 text-sm">IA de Riesgo Activada</h4>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          El sistema ahora detecta automáticamente cargas peligrosas (IMO) y sugiere documentación extra.
                      </p>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </>
  );
}