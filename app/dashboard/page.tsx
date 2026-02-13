'use client'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOperaciones: 0,
    totalClientes: 0,
    enProceso: 0
  })

  useEffect(() => {
    const operaciones = JSON.parse(localStorage.getItem('operaciones') || '[]')
    const clientesUnicos = new Set(operaciones.map((op: any) => op.cliente)).size

    setStats({
      totalOperaciones: operaciones.length,
      totalClientes: clientesUnicos,
      enProceso: operaciones.filter((op: any) => op.estado === 'En proceso' || op.estado === 'Pendiente').length
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-600 mt-1">Visión general de tus operaciones aduaneras.</p>
        </div>

        {/* Tarjeta de Bienvenida Elegante */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Hola, Majo 👋
            </h2>
            <p className="text-slate-700 text-lg">
              Tenés <strong className="text-purple-700">{stats.enProceso} operaciones activas</strong> que requieren seguimiento.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
                onClick={() => window.location.href = '/operaciones'}
                className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
                Ver Listado
            </button>
            <button 
                onClick={() => window.location.href = '/operaciones/nueva'}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
            >
                <span>+</span> Nueva Operación
            </button>
          </div>
        </div>

        {/* Métricas (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">Operaciones Totales</div>
            <div className="text-4xl font-bold text-slate-900">{stats.totalOperaciones}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">Cartera de Clientes</div>
            <div className="text-4xl font-bold text-slate-900">{stats.totalClientes}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-32 hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
            <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">Honorarios Estimados</div>
            <div className="text-4xl font-bold text-slate-900">
                U$S {(stats.totalOperaciones * 250).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sección de Novedades / Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                📢 Actualizaciones del Sistema
            </h3>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                    🤖
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">IA de Riesgo Activada</h4>
                    <p className="text-slate-700 text-sm mt-1">
                        El sistema ahora detecta automáticamente cargas peligrosas y sugiere la documentación MSDS obligatoria.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}