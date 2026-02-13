'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Calculadora() {
  const [valores, setValores] = useState({
    fob: '',
    flete: '',
    seguro: '',
    ncm: '',
    tipoOperacion: 'Importación'
  })

  const [resultado, setResultado] = useState<any>(null)

  const handleChange = (e: any) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value
    })
  }

  const calcular = () => {
    const fob = parseFloat(valores.fob) || 0
    const flete = parseFloat(valores.flete) || 0
    const seguro = parseFloat(valores.seguro) || 0

    // CIF = FOB + Flete + Seguro
    const cif = fob + flete + seguro

    // Tributos Argentina (aproximados)
    // Estos son valores genéricos, deberían consultarse según NCM
    const arancel = cif * 0.35 // 35% promedio
    const tasaEstadistica = cif * 0.03 // 3%
    const iva = (cif + arancel) * 0.21 // 21%
    const impuestoPais = cif * 0.30 // 30% (IMPUESTO PAIS)
    const percepcionGanancias = cif * 0.30 // 30% (Percepción)

    const totalTributos = arancel + tasaEstadistica + iva + impuestoPais + percepcionGanancias
    const totalAPagar = cif + totalTributos

    setResultado({
      fob,
      flete,
      seguro,
      cif,
      arancel,
      tasaEstadistica,
      iva,
      impuestoPais,
      percepcionGanancias,
      totalTributos,
      totalAPagar
    })
  }

  const limpiar = () => {
    setValores({
      fob: '',
      flete: '',
      seguro: '',
      ncm: '',
      tipoOperacion: 'Importación'
    })
    setResultado(null)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Calculadora de Tributos
            </h1>
            <p className="text-gray-600">
              Calculá el costo total de tu operación de importación
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            
            {/* Panel de entrada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                💰 Datos de la Operación
              </h2>

              <div className="space-y-4">
                {/* Tipo de operación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Operación
                  </label>
                  <select
                    name="tipoOperacion"
                    value={valores.tipoOperacion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                  >
                    <option value="Importación">Importación</option>
                    <option value="Exportación">Exportación</option>
                  </select>
                </div>

                {/* FOB */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    FOB (USD)
                  </label>
                  <input
                    type="number"
                    name="fob"
                    value={valores.fob}
                    onChange={handleChange}
                    placeholder="10000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valor de la mercadería
                  </p>
                </div>

                {/* Flete */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Flete (USD)
                  </label>
                  <input
                    type="number"
                    name="flete"
                    value={valores.flete}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Costo del transporte
                  </p>
                </div>

                {/* Seguro */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seguro (USD)
                  </label>
                  <input
                    type="number"
                    name="seguro"
                    value={valores.seguro}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Costo del seguro
                  </p>
                </div>

                {/* NCM */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código NCM (opcional)
                  </label>
                  <input
                    type="text"
                    name="ncm"
                    value={valores.ncm}
                    onChange={handleChange}
                    placeholder="3824.99.90"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para tributos específicos
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={calcular}
                  disabled={!valores.fob}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🧮 Calcular
                </button>
                <button
                  onClick={limpiar}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  🔄 Limpiar
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ Los tributos son aproximados. Consultá con tu despachante para valores exactos según tu NCM específico.
                </p>
              </div>
            </div>

            {/* Panel de resultados */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                📊 Resultados
              </h2>

              {resultado ? (
                <div className="space-y-4">
                  {/* CIF */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Valor CIF</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {formatNumber(resultado.cif)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      FOB + Flete + Seguro
                    </div>
                  </div>

                  {/* Desglose de tributos */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Tributos a pagar:
                    </h3>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Derecho de Importación (35%)</span>
                      <span className="font-semibold">{formatNumber(resultado.arancel)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tasa Estadística (3%)</span>
                      <span className="font-semibold">{formatNumber(resultado.tasaEstadistica)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (21%)</span>
                      <span className="font-semibold">{formatNumber(resultado.iva)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impuesto PAIS (30%)</span>
                      <span className="font-semibold">{formatNumber(resultado.impuestoPais)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percepción Ganancias (30%)</span>
                      <span className="font-semibold">{formatNumber(resultado.percepcionGanancias)}</span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-semibold">Total Tributos</span>
                        <span className="font-bold text-orange-600">
                          {formatNumber(resultado.totalTributos)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total a pagar */}
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-sm text-gray-600 mb-1">💵 Total a pagar</div>
                    <div className="text-3xl font-bold text-green-700">
                      {formatNumber(resultado.totalAPagar)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      CIF + Tributos
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">
                      📝 Resumen:
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Valor FOB: {formatNumber(resultado.fob)}</div>
                      <div>• Flete: {formatNumber(resultado.flete)}</div>
                      <div>• Seguro: {formatNumber(resultado.seguro)}</div>
                      <div className="font-semibold pt-1 border-t">
                        • Valor CIF: {formatNumber(resultado.cif)}
                      </div>
                      <div>• Tributos: {formatNumber(resultado.totalTributos)}</div>
                      <div className="font-bold pt-1 border-t text-purple-700">
                        • TOTAL: {formatNumber(resultado.totalAPagar)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧮</div>
                    <p className="text-sm">Completá los datos y hacé click en "Calcular"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}