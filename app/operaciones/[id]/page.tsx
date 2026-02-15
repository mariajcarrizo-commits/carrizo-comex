'use client'

import { useState, useEffect, useRef } from 'react' // <--- Agregamos useRef
import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function DetalleOperacion() {
  const params: any = useParams()
  const [operacion, setOperacion] = useState<any>(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formEdit, setFormEdit] = useState<any>({})
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false)
  const [mostrarPresupuesto, setMostrarPresupuesto] = useState(false)
  
  // Estados Calculadora
  const [valoresCalc, setValoresCalc] = useState({ 
    fob: '', flete: '', seguro: '',
    porcentajeDerechos: '35', porcentajeTasa: '3', porcentajeIva: '21', tipoCambio: '1045'
  })
  const [resultadoCalc, setResultadoCalc] = useState<any>(null)

  // --- NUEVO: ESTADOS PARA SUBIDA REAL ---
  const fileInputRef = useRef<HTMLInputElement>(null) // Referencia al selector de archivos
  const [tipoDocActual, setTipoDocActual] = useState('') // Para saber qué botón tocaste
  const [subiendo, setSubiendo] = useState(false)
  const [progresoCarga, setProgresoCarga] = useState(0)

  useEffect(() => {
    try {
      const guardadas = localStorage.getItem('operaciones')
      if (guardadas) {
        const operaciones = JSON.parse(guardadas)
        const op = operaciones.find((o: any) => o.id?.toString() === params.id)
        if (op) {
          if (!op.documentos) op.documentos = []
          if (!op.checklist) op.checklist = []
          setOperacion(op)
          setFormEdit(op)
          if (op.tributos) {
              setResultadoCalc(op.tributos)
              setValoresCalc({
                  fob: op.tributos.fob || '',
                  flete: op.tributos.flete || '',
                  seguro: op.tributos.seguro || '',
                  porcentajeDerechos: op.tributos.pctDerechos?.toString() || '35',
                  porcentajeTasa: op.tributos.pctTasa?.toString() || '3',
                  porcentajeIva: op.tributos.pctIva?.toString() || '21',
                  tipoCambio: op.tributos.tipoCambio?.toString() || '1045'
              })
          }
        }
      }
    } catch (err) { console.error(err) }
  }, [params?.id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormEdit((prev: any) => ({ ...prev, [name]: value }))
  }

  const guardarCambios = () => {
    const guardadas = localStorage.getItem('operaciones')
    if (guardadas) {
      const ops = JSON.parse(guardadas)
      const nuevasOps = ops.map((op: any) => op.id.toString() === params.id ? { ...op, ...formEdit } : op)
      localStorage.setItem('operaciones', JSON.stringify(nuevasOps))
      setOperacion({ ...operacion, ...formEdit })
      setModoEdicion(false)
    }
  }

  // --- NUEVA FUNCIÓN: INICIAR CARGA REAL ---
  const abrirSelectorArchivos = (tipo: string) => {
      setTipoDocActual(tipo)
      // Esto hace "clic" automáticamente en el input oculto
      if (fileInputRef.current) {
          fileInputRef.current.click()
      }
  }

  // --- NUEVA FUNCIÓN: PROCESAR EL ARCHIVO SELECCIONADO ---
  const procesarArchivoReal = (event: any) => {
      const archivo = event.target.files[0]
      if (!archivo) return

      setSubiendo(true)
      setProgresoCarga(0)

      // Simulamos visualmente la carga, pero usamos el NOMBRE REAL del archivo
      const intervalo = setInterval(() => {
          setProgresoCarga((prev) => {
              if (prev >= 100) {
                  clearInterval(intervalo)
                  return 100
              }
              return prev + 25
          })
      }, 100)

      setTimeout(() => {
          const nuevoDoc = {
              id: Date.now(),
              nombre: archivo.name, // <--- AQUÍ GUARDAMOS EL NOMBRE REAL (ej: factura_paveco.pdf)
              tipo: tipoDocActual,
              fecha: new Date().toLocaleDateString(),
              usuario: 'Majo'
          }
          
          const nuevosDocs = [...(operacion.documentos || []), nuevoDoc]
          const opActualizada = { ...operacion, documentos: nuevosDocs }
          
          const ops = JSON.parse(localStorage.getItem('operaciones') || '[]')
          const index = ops.findIndex((o:any) => o.id.toString() === params.id)
          if (index >= 0) {
              ops[index] = opActualizada
              localStorage.setItem('operaciones', JSON.stringify(ops))
          }
          
          setOperacion(opActualizada)
          setSubiendo(false)
          // Limpiamos el input para poder subir el mismo archivo si es necesario
          if (fileInputRef.current) fileInputRef.current.value = ''
      }, 1000)
  }

  const eliminarDoc = (docId: number) => {
      if(!confirm('¿Borrar documento?')) return
      const nuevosDocs = operacion.documentos.filter((d:any) => d.id !== docId)
      const opActualizada = { ...operacion, documentos: nuevosDocs }
      setOperacion(opActualizada)
      const ops = JSON.parse(localStorage.getItem('operaciones') || '[]')
      const index = ops.findIndex((o:any) => o.id.toString() === params.id)
      if (index >= 0) { ops[index] = opActualizada; localStorage.setItem('operaciones', JSON.stringify(ops)) }
  }

  const calcularTributos = () => {
    const fob = parseFloat(valoresCalc.fob) || 0
    const flete = parseFloat(valoresCalc.flete) || 0
    const seguro = parseFloat(valoresCalc.seguro) || 0
    const tc = parseFloat(valoresCalc.tipoCambio) || 1
    const pctDerechos = parseFloat(valoresCalc.porcentajeDerechos) / 100
    const pctTasa = parseFloat(valoresCalc.porcentajeTasa) / 100
    const pctIva = parseFloat(valoresCalc.porcentajeIva) / 100 
    const pctIvaAdic = 0.20 
    const pctPais = 0.075

    const cif = fob + flete + seguro
    const arancel = cif * pctDerechos
    const tasaEstadistica = cif * pctTasa
    const baseIva = cif + arancel + tasaEstadistica
    const iva = baseIva * pctIva
    const percepcionGanancias = baseIva * pctIvaAdic
    const impuestoPais = cif * pctPais
    const totalTributos = arancel + tasaEstadistica + iva + percepcionGanancias + impuestoPais
    const totalAPagar = cif + totalTributos

    setResultadoCalc({
      fob, flete, seguro, cif, arancel, tasaEstadistica, iva, impuestoPais, percepcionGanancias,
      totalTributos, totalAPagar, enPesos: totalAPagar * tc,
      pctDerechos: valoresCalc.porcentajeDerechos, pctTasa: valoresCalc.porcentajeTasa, pctIva: valoresCalc.porcentajeIva, tipoCambio: valoresCalc.tipoCambio
    })
  }

  const guardarTributos = () => {
    if (!resultadoCalc) return
    const nuevasOps = JSON.parse(localStorage.getItem('operaciones') || '[]').map((op: any) =>
      op.id.toString() === params.id ? { ...op, tributos: resultadoCalc } : op
    )
    localStorage.setItem('operaciones', JSON.stringify(nuevasOps))
    setOperacion({ ...operacion, tributos: resultadoCalc })
    setMostrarCalculadora(false)
  }

  const toggleTarea = (idx: number) => {
    if (!operacion.checklist) return;
    const nuevoChecklist = [...operacion.checklist];
    nuevoChecklist[idx].completado = !nuevoChecklist[idx].completado;
    const opActualizada = { ...operacion, checklist: nuevoChecklist };
    setOperacion(opActualizada);
    const ops = JSON.parse(localStorage.getItem('operaciones') || '[]');
    const index = ops.findIndex((o:any) => o.id.toString() === params.id);
    if (index >= 0) { ops[index] = opActualizada; localStorage.setItem('operaciones', JSON.stringify(ops)); }
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(num || 0)

  if (!operacion) return <div className="p-12 text-center text-black font-bold">Cargando operación...</div>

  // VISTA PRESUPUESTO
  if (mostrarPresupuesto) {
    return (
        <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
            <div className="bg-white shadow-2xl w-full max-w-[21cm] min-h-[29.7cm] p-12 relative print:shadow-none print:w-full print:max-w-none print:p-0">
                <div className="absolute top-4 right-[-140px] flex flex-col gap-2 print:hidden">
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded font-bold">🖨️ Imprimir</button>
                    <button onClick={() => setMostrarPresupuesto(false)} className="bg-gray-500 text-white px-4 py-2 rounded font-bold">↩ Volver</button>
                </div>
                <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">CARRIZO <span className="text-purple-600">Comex</span></h1>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500 text-sm font-bold">PRESUPUESTO N°</div>
                        <div className="text-xl font-bold text-black">#{operacion.id.toString().slice(-6)}</div>
                    </div>
                </div>
                {/* ... (Resto del presupuesto igual) ... */}
                <div className="mb-10 bg-slate-50 p-6 rounded border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cliente</h3>
                    <div className="text-2xl font-bold text-black">{operacion.cliente}</div>
                    <div className="text-slate-800 font-medium">CUIT: {operacion.cuit || 'No informado'}</div>
                </div>
                {operacion.tributos && (
                    <div className="mb-12">
                        <h3 className="font-bold text-black border-b border-slate-300 pb-2 mb-4">LIQUIDACIÓN DE COSTOS</h3>
                        <table className="w-full text-sm text-black">
                            <thead className="bg-slate-200">
                                <tr><th className="text-left p-3 font-bold">Concepto</th><th className="text-right p-3 font-bold">Importe (USD)</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr><td className="p-3">Valor CIF</td><td className="text-right p-3 font-bold">{formatNumber(operacion.tributos.cif)}</td></tr>
                                <tr><td className="p-3">Derechos</td><td className="text-right p-3 font-bold">{formatNumber(operacion.tributos.arancel)}</td></tr>
                                <tr><td className="p-3">Total Tributos</td><td className="text-right p-3 font-bold">{formatNumber(operacion.tributos.totalTributos)}</td></tr>
                                <tr className="bg-slate-100 font-bold text-lg"><td className="p-3">TOTAL ESTIMADO</td><td className="text-right p-3">{formatNumber(operacion.tributos.totalAPagar)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-auto pt-8 border-t border-slate-200 text-sm text-center text-black font-bold">CARRIZO COMEX</div>
            </div>
        </div>
    )
  }

  // VISTA NORMAL
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-8 print:hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => window.location.href = '/operaciones'} className="text-slate-800 font-bold hover:underline">← Volver al listado</button>
            <div className="flex gap-2">
                <button onClick={() => setMostrarPresupuesto(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold shadow hover:shadow-lg transition-all flex items-center gap-2">
                    💰 Generar Presupuesto
                </button>
                {!modoEdicion ? (
                    <button onClick={() => setModoEdicion(true)} className="px-4 py-2 bg-white border-2 border-slate-300 text-black rounded-lg font-bold">✏️ Editar</button>
                ) : (
                    <button onClick={guardarCambios} className="px-4 py-2 bg-green-700 text-white rounded-lg font-bold">💾 Guardar</button>
                )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-black">
                    {modoEdicion ? <input name="cliente" value={formEdit.cliente} onChange={handleChange} className="border p-1 text-black" /> : operacion.cliente}
                </h1>
                <p className="text-slate-600 font-medium">Operación #{operacion.id}</p>
              </div>
              <div className="text-right">
                  <div className="text-black font-bold bg-slate-100 px-3 py-1 rounded">{operacion.tipo.toUpperCase()}</div>
              </div>
            </div>

            {operacion.riesgo && (
              <div className={`mb-8 p-6 rounded-xl border-l-8 shadow-sm ${
                operacion.riesgo.riesgo === 'ALTO' ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-600'
              }`}>
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                   Riesgo: {operacion.riesgo.riesgo}
                </h3>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 h-fit">
                    <h3 className="font-bold text-black mb-4 border-b border-slate-300 pb-2">📦 Detalle Carga</h3>
                    <div className="space-y-3 text-sm text-black">
                        <div><span className="text-slate-500 block text-xs uppercase font-bold">Producto</span><span className="font-bold text-base">{operacion.producto}</span></div>
                        <div><span className="text-slate-500 block text-xs uppercase font-bold">Posición NCM</span><code className="bg-white px-2 py-1 rounded border border-slate-300 font-mono font-bold text-black">{operacion.ncm}</code></div>
                    </div>
                </div>

                <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-6 h-fit">
                    <h3 className="font-bold text-black mb-4">📂 Documentación</h3>
                    
                    {/* INPUT OCULTO PARA CARGA REAL */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={procesarArchivoReal} 
                        className="hidden" 
                    />

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {['Factura', 'Packing', 'Origen', 'B/L'].map((doc) => (
                            <button key={doc} disabled={subiendo} onClick={() => abrirSelectorArchivos(doc)} 
                                className="text-xs bg-slate-100 text-black py-2 rounded border border-slate-300 font-bold hover:bg-slate-200 hover:border-slate-400 transition-all">
                                + {doc}
                            </button>
                        ))}
                    </div>

                    {subiendo && (
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-black font-bold mb-1">
                                <span>Subiendo...</span>
                                <span>{progresoCarga}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: `${progresoCarga}%`}}></div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {operacion.documentos?.map((doc: any) => (
                            <div key={doc.id} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 text-xs text-black font-medium rounded hover:border-purple-300 transition-colors">
                                <div className="truncate flex-1 flex items-center gap-2">
                                    <span className="text-lg">📄</span>
                                    <div className="flex flex-col truncate">
                                        <span className="truncate" title={doc.nombre}>{doc.nombre}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">{doc.tipo}</span>
                                    </div>
                                </div>
                                <button onClick={() => eliminarDoc(doc.id)} className="text-red-500 hover:bg-red-50 p-1 rounded font-bold">✕</button>
                            </div>
                        ))}
                        {(!operacion.documentos || operacion.documentos.length === 0) && (
                            <div className="text-center py-4 text-slate-400 text-xs italic">
                                Sin documentos adjuntos
                            </div>
                        )}
                    </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <h3 className="font-bold text-black mb-2">✅ Checklist</h3>
                    {operacion.checklist?.map((tarea: any, idx: number) => (
                        <label key={idx} className="flex items-start gap-2 p-2 hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" checked={tarea.completado} onChange={() => toggleTarea(idx)} />
                            <div className={`text-sm font-bold ${tarea.completado ? 'line-through text-slate-400' : 'text-black'}`}>{tarea.tarea}</div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-6 bg-slate-100 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-black text-lg">💰 Costos y Tributos</h3>
                    {operacion.tributos && <p className="text-black font-medium">Total: <span className="font-bold text-xl">{formatNumber(operacion.tributos.totalAPagar)}</span></p>}
                </div>
                <button onClick={() => setMostrarCalculadora(true)} className="px-6 py-3 bg-white border-2 border-slate-300 rounded-lg font-bold text-black hover:bg-slate-200">
                    {operacion.tributos ? '🧮 Recalcular' : '➕ Abrir Calculadora'}
                </button>
            </div>
          </div>
        </div>
        
        {/* MODAL CALCULADORA (Igual que antes) */}
        {mostrarCalculadora && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-300">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                    <h2 className="text-xl font-bold text-black">Calculadora de Costos</h2>
                    <button onClick={() => setMostrarCalculadora(false)} className="text-black font-bold text-2xl">×</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-xs text-purple-800 uppercase border-b border-purple-200 pb-1">Valores (USD)</h3>
                        <div>
                            <label className="text-xs font-bold text-black mb-1 block">FOB</label>
                            <input type="number" value={valoresCalc.fob} onChange={(e) => setValoresCalc({...valoresCalc, fob: e.target.value})} 
                                className="w-full border-2 border-slate-400 p-2.5 rounded text-black font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-black mb-1 block">Flete</label>
                            <input type="number" value={valoresCalc.flete} onChange={(e) => setValoresCalc({...valoresCalc, flete: e.target.value})} 
                                className="w-full border-2 border-slate-400 p-2.5 rounded text-black font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-black mb-1 block">Seguro</label>
                            <input type="number" value={valoresCalc.seguro} onChange={(e) => setValoresCalc({...valoresCalc, seguro: e.target.value})} 
                                className="w-full border-2 border-slate-400 p-2.5 rounded text-black font-bold" />
                        </div>
                        <div>
                             <label className="text-xs font-bold text-black mb-1 block">Tipo Cambio ($)</label>
                             <input type="number" value={valoresCalc.tipoCambio} onChange={(e) => setValoresCalc({...valoresCalc, tipoCambio: e.target.value})} 
                                 className="w-full border-2 border-yellow-400 bg-yellow-50 p-2.5 rounded text-black font-bold" />
                         </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-xs text-purple-800 uppercase border-b border-purple-200 pb-1">Tasas (%)</h3>
                        <div>
                            <label className="text-xs font-bold text-black mb-1 block">Derechos Import.</label>
                            <input type="number" value={valoresCalc.porcentajeDerechos} onChange={(e) => setValoresCalc({...valoresCalc, porcentajeDerechos: e.target.value})} 
                                className="w-full border-2 border-slate-400 p-2.5 rounded text-black font-bold text-right" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-black mb-1 block">IVA</label>
                            <input type="number" value={valoresCalc.porcentajeIva} onChange={(e) => setValoresCalc({...valoresCalc, porcentajeIva: e.target.value})} 
                                className="w-full border-2 border-slate-400 p-2.5 rounded text-black font-bold text-right" />
                        </div>
                    </div>
                </div>

                <button onClick={calcularTributos} className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 mb-4">
                    🧮 Calcular Costos
                </button>

                {resultadoCalc && (
                    <div className="bg-slate-100 p-5 rounded-xl border border-slate-300">
                        <div className="flex justify-between items-end font-bold text-xl text-black mb-1">
                            <span>Total USD:</span><span>{formatNumber(resultadoCalc.totalAPagar)}</span>
                        </div>
                        <div className="text-right text-xs text-slate-500 mb-3">Est. en Pesos: $ {resultadoCalc.enPesos?.toLocaleString('es-AR')}</div>
                        <button onClick={guardarTributos} className="w-full mt-2 bg-green-700 text-white py-3 rounded-lg font-bold">
                            ✓ Confirmar y Guardar
                        </button>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}