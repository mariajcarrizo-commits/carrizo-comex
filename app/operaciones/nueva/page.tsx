'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { ncmComunes } from '../../data/ncm'
import { analizarRiesgo, generarChecklistInicial } from '../../utils/logicaNegocio'

export default function NuevaOperacion() {
  const [paso, setPaso] = useState(1)
  
  const [formData, setFormData] = useState({
    tipo: '',
    clienteNombre: '',
    clienteCuit: '',
    productoDescripcion: '',
    pais: '',
    ncm: '',
    esPeligroso: 'No',
    primerDespacho: 'No',
    fobEstimado: ''
  })

  const [busquedaNcm, setBusquedaNcm] = useState('')
  const [mostrarSelectorNcm, setMostrarSelectorNcm] = useState(false)

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const seleccionarNcm = (codigo: string, descripcion: string) => {
    setFormData({ ...formData, ncm: codigo })
    setBusquedaNcm('')
    setMostrarSelectorNcm(false)
  }

  const ncmFiltrados = ncmComunes.filter(item => 
    item.codigo.includes(busquedaNcm.toUpperCase()) ||
    item.descripcion.toLowerCase().includes(busquedaNcm.toLowerCase())
  )

  const siguientePaso = () => { if (paso < 4) setPaso(paso + 1) }
  const anteriorPaso = () => { if (paso > 1) setPaso(paso - 1) }

  const guardarOperacion = () => {
    const analisis = analizarRiesgo(formData);
    const checklist = generarChecklistInicial(formData, analisis);

    const guardadas = localStorage.getItem('operaciones')
    const operaciones = guardadas ? JSON.parse(guardadas) : []
    
    const nuevaOperacion = {
      id: Date.now(),
      cliente: formData.clienteNombre,
      cuit: formData.clienteCuit,
      tipo: formData.tipo,
      pais: formData.pais,
      producto: formData.productoDescripcion,
      ncm: formData.ncm,
      estado: "Pendiente",
      fecha: new Date().toISOString().split('T')[0],
      riesgo: analisis,
      checklist: checklist,
      datosExtra: {
        esPeligroso: formData.esPeligroso,
        primerDespacho: formData.primerDespacho,
        fobEstimado: formData.fobEstimado
      }
    }
    
    operaciones.unshift(nuevaOperacion)
    localStorage.setItem('operaciones', JSON.stringify(operaciones))
    
    let mensaje = '¡Operación creada! 🎉';
    if (analisis.riesgo === 'ALTO') mensaje += '\n⚠️ ATENCIÓN: Se detectó RIESGO ALTO.';
    
    alert(mensaje);
    window.location.href = '/operaciones'
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Nueva Operación
            </h1>
            <p className="text-slate-800 font-medium">
              Completá los datos paso a paso
            </p>
          </div>

          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold border-2 ${
                  paso >= num 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-400 border-slate-300'
                }`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    paso > num ? 'bg-slate-900' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            
            {paso === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">
                  Tipo de Operación
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({...formData, tipo: 'Importación'})}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === 'Importación'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-300 hover:border-slate-500 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-2">📦</div>
                    <div className="font-bold text-xl text-black">Importación</div>
                    <div className="text-slate-700 font-medium mt-1">Ingreso de mercadería</div>
                  </button>

                  <button
                    onClick={() => setFormData({...formData, tipo: 'Exportación'})}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === 'Exportación'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-300 hover:border-slate-500 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-2">🚢</div>
                    <div className="font-bold text-xl text-black">Exportación</div>
                    <div className="text-slate-700 font-medium mt-1">Salida de mercadería</div>
                  </button>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Datos del Cliente</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Nombre / Razón Social</label>
                    <input
                      type="text"
                      name="clienteNombre"
                      value={formData.clienteNombre}
                      onChange={handleChange}
                      placeholder="Ej: PAVECO S.A."
                      className="w-full px-4 py-3 border border-slate-400 rounded-lg text-black font-medium focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">CUIT</label>
                    <input
                      type="text"
                      name="clienteCuit"
                      value={formData.clienteCuit}
                      onChange={handleChange}
                      placeholder="Ej: 30-12345678-9"
                      className="w-full px-4 py-3 border border-slate-400 rounded-lg text-black font-medium focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Producto y Riesgo</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Descripción del Producto</label>
                    <textarea
                      name="productoDescripcion"
                      value={formData.productoDescripcion}
                      onChange={handleChange}
                      placeholder="Ej: Aditivos biopolímeros..."
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-400 rounded-lg text-black font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">País Origen/Destino</label>
                      <select
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-400 rounded-lg text-black font-medium"
                      >
                        <option value="">Seleccioná un país</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-black mb-2">Valor FOB Est. (USD)</label>
                       <input
                         type="number"
                         name="fobEstimado"
                         value={formData.fobEstimado}
                         onChange={handleChange}
                         placeholder="Ej: 15000"
                         className="w-full px-4 py-3 border border-slate-400 rounded-lg text-black font-medium"
                       />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                    <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">⚠️ Factores de Riesgo</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-black font-bold">¿Es carga peligrosa (IMO)?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-black">
                                    <input type="radio" name="esPeligroso" value="Si" 
                                        checked={formData.esPeligroso === 'Si'} onChange={handleChange} 
                                        className="w-5 h-5 text-orange-600"/> Sí
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-black">
                                    <input type="radio" name="esPeligroso" value="No" 
                                        checked={formData.esPeligroso === 'No'} onChange={handleChange} 
                                        className="w-5 h-5 text-orange-600"/> No
                                </label>
                            </div>
                        </div>
                        <div className="border-t border-orange-200 pt-3 flex items-center justify-between">
                            <label className="text-black font-bold">¿Es la primera operación?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-black">
                                    <input type="radio" name="primerDespacho" value="Si" 
                                        checked={formData.primerDespacho === 'Si'} onChange={handleChange} 
                                        className="w-5 h-5 text-orange-600"/> Sí
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-black">
                                    <input type="radio" name="primerDespacho" value="No" 
                                        checked={formData.primerDespacho === 'No'} onChange={handleChange} 
                                        className="w-5 h-5 text-orange-600"/> No
                                </label>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Clasificación NCM</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Código NCM</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="ncm"
                        value={formData.ncm}
                        onChange={handleChange}
                        placeholder="Ej: 3824.99.90"
                        className="flex-1 px-4 py-3 border border-slate-400 rounded-lg text-black font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSelectorNcm(!mostrarSelectorNcm)}
                        className="px-6 py-3 bg-purple-100 text-purple-900 rounded-lg font-bold hover:bg-purple-200 transition-all border border-purple-300"
                      >
                        🔍 Buscar
                      </button>
                    </div>

                    {mostrarSelectorNcm && (
                      <div className="mt-4 border border-slate-300 rounded-lg p-4 bg-slate-50 shadow-md">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-black">Seleccionar NCM</h4>
                          <button type="button" onClick={() => setMostrarSelectorNcm(false)} className="text-black font-bold">✕</button>
                        </div>
                        <input
                          type="text"
                          value={busquedaNcm}
                          onChange={(e) => setBusquedaNcm(e.target.value)}
                          placeholder="Buscar por código o descripción..."
                          className="w-full px-4 py-2 border border-slate-400 rounded-lg mb-3 text-black"
                        />
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {ncmFiltrados.map((item) => (
                              <button key={item.codigo} type="button" onClick={() => seleccionarNcm(item.codigo, item.descripcion)}
                                className="w-full text-left p-3 rounded-lg hover:bg-white border border-transparent hover:border-slate-300 transition-all"
                              >
                                <div className="font-bold text-black">{item.codigo}</div>
                                <div className="text-sm text-slate-800">{item.descripcion}</div>
                              </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-black mb-4">📋 Resumen de la Operación</h3>
                    <div className="space-y-2 text-sm text-slate-800">
                      <div><span className="font-bold">Tipo:</span> {formData.tipo}</div>
                      <div><span className="font-bold">Cliente:</span> {formData.clienteNombre}</div>
                      <div><span className="font-bold">Producto:</span> {formData.productoDescripcion}</div>
                      <div><span className="font-bold">NCM:</span> {formData.ncm}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {paso > 1 ? (
                <button onClick={anteriorPaso} className="px-6 py-3 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">
                  ← Anterior
                </button>
              ) : <div />}

              {paso < 4 ? (
                <button
                  onClick={siguientePaso}
                  disabled={(paso === 1 && !formData.tipo) || (paso === 2 && !formData.clienteNombre)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={guardarOperacion}
                  disabled={!formData.ncm}
                  className="px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-all disabled:opacity-50"
                >
                  ✓ Crear Operación
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}