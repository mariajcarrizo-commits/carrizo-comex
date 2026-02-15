'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function CalculadoraPage() {
  const [valores, setValores] = useState({
    fob: '',
    flete: '',
    seguro: '',
    tc: '1045', // Tipo de cambio default
    derechos: '35', // % Derechos
    tasa: '3', // % Tasa Est.
    iva: '21' // % IVA
  })

  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    const fob = parseFloat(valores.fob) || 0
    const flete = parseFloat(valores.flete) || 0
    const seguro = parseFloat(valores.seguro) || 0
    const tc = parseFloat(valores.tc) || 1
    
    // Alícuotas
    const d = parseFloat(valores.derechos) / 100
    const t = parseFloat(valores.tasa) / 100
    const i = parseFloat(valores.iva) / 100
    
    // Cálculo
    const cif = fob + flete + seguro
    const montoDerechos = cif * d
    const montoTasa = cif * t
    const baseIva = cif + montoDerechos + montoTasa
    const montoIva = baseIva * i
    
    // Impuesto PAIS (7.5% sobre CIF)
    const impPais = cif * 0.075 
    // Percepción Ganancias/IVA Adic (estimado 20% sobre base IVA)
    const perc = baseIva * 0.20

    const totalImpuestos = montoDerechos + montoTasa + montoIva + impPais + perc
    const total = cif + totalImpuestos

    setResultado({
      cif,
      impuestos: totalImpuestos,
      totalUSD: total,
      totalPesos: total * tc
    })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Calculadora de Tributos Rápida</h1>
                <p className="text-slate-600">Cotizá estimaciones en segundos sin crear una operación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* FORMULARIO */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">Datos de la Carga</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Valor FOB (USD)</label>
                            <input type="number" value={valores.fob} onChange={e => setValores({...valores, fob: e.target.value})} 
                                className="w-full border-2 border-slate-300 p-3 rounded-lg font-bold text-slate-900 focus:border-purple-500 outline-none" placeholder="0.00"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Flete (USD)</label>
                                <input type="number" value={valores.flete} onChange={e => setValores({...valores, flete: e.target.value})} 
                                    className="w-full border border-slate-300 p-2 rounded font-medium text-slate-900"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Seguro (USD)</label>
                                <input type="number" value={valores.seguro} onChange={e => setValores({...valores, seguro: e.target.value})} 
                                    className="w-full border border-slate-300 p-2 rounded font-medium text-slate-900"/>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-xs text-purple-700 uppercase mb-3">Configuración de Impuestos (%)</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block">Derechos</label>
                                    <input type="number" value={valores.derechos} onChange={e => setValores({...valores, derechos: e.target.value})} className="w-full border p-1 rounded text-center font-bold text-slate-700"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block">Tasa Est.</label>
                                    <input type="number" value={valores.tasa} onChange={e => setValores({...valores, tasa: e.target.value})} className="w-full border p-1 rounded text-center font-bold text-slate-700"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block">IVA</label>
                                    <input type="number" value={valores.iva} onChange={e => setValores({...valores, iva: e.target.value})} className="w-full border p-1 rounded text-center font-bold text-slate-700"/>
                                </div>
                            </div>
                        </div>

                        <button onClick={calcular} className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md mt-4">
                            CALCULAR AHORA
                        </button>
                    </div>
                </div>

                {/* RESULTADOS */}
                <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    
                    {resultado ? (
                        <div className="relative z-10 space-y-6">
                            <div className="text-center">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Costo Total Estimado</p>
                                <p className="text-5xl font-bold mt-2 text-white">U$S {resultado.totalUSD.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-lg space-y-2 text-sm backdrop-blur-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-300">Valor CIF (Base):</span>
                                    <span className="font-bold">U$S {resultado.cif.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-300">Total Impuestos:</span>
                                    <span className="font-bold text-red-200">+ U$S {resultado.impuestos.toLocaleString('es-AR', {maximumFractionDigits: 2})}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-center text-slate-400 text-xs mb-1">Valor aproximado en pesos (TC: ${valores.tc})</p>
                                <p className="text-center text-3xl font-bold text-green-400">$ {resultado.totalPesos.toLocaleString('es-AR', {maximumFractionDigits: 0})}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-50">
                            <div className="text-6xl mb-4">👋</div>
                            <p>Ingresá los valores y dale a Calcular para ver el desglose.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </>
  )
}