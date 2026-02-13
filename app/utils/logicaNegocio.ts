// Archivo: app/utils/logicaNegocio.ts

export const analizarRiesgo = (datos: any) => {
    let riesgo = "BAJO";
    let score = 0; // 0 a 100
    let alertas = [];
    let recomendaciones = [];
  
    // 1. Lógica de Producto Peligroso
    if (datos.esPeligroso === 'Si') {
      score += 40;
      alertas.push({ tipo: 'CRITICO', msg: 'Producto peligroso: Requiere MSDS y Hoja de Seguridad' });
      recomendaciones.push('Solicitar MSDS al exportador inmediatamente');
    }
  
    // 2. Lógica de Valor y Experiencia
    const valorFob = parseFloat(datos.fobEstimado || 0);
    if (valorFob > 10000 && datos.primerDespacho === 'Si') {
      score += 30;
      riesgo = "MEDIO";
      alertas.push({ tipo: 'SUGERENCIA', msg: 'Operación de alto valor para primer despacho' });
      recomendaciones.push('Considerar co-despacho con colega senior');
    }
  
    // 3. Lógica de NCM (Simulada para demo)
    // Si la NCM empieza con 38 (Químicos) suele requerir ANMAT/SEDRE
    if (datos.ncm && datos.ncm.startsWith('38')) {
      score += 20;
      alertas.push({ tipo: 'INFO', msg: 'Posible intervención de ANMAT/SEDRE' });
    }
  
    // Determinar Nivel Final
    if (score >= 60) riesgo = "ALTO";
    else if (score >= 30) riesgo = "MEDIO";
  
    return { riesgo, score, alertas, recomendaciones };
  };
  
  export const generarChecklistInicial = (datos: any, analisisRiesgo: any) => {
    // Tareas base
    const tareas = [
      { id: 1, etapa: 'Intake', tarea: 'Validar CUIT del cliente', completado: true },
      { id: 2, etapa: 'Intake', tarea: 'Firmar cotización', completado: false },
    ];
  
    // Tareas Dinámicas según Riesgo
    if (datos.esPeligroso === 'Si') {
      tareas.push({ 
        id: 3, 
        etapa: 'Pre-Despacho', 
        tarea: '❌ SUBIR MSDS (Crítico)', 
        completado: false 
      });
    }
  
    if (datos.tipo === 'Importación') {
      tareas.push({ id: 4, etapa: 'Oficialización', tarea: 'Verificar SIMI / SIRA / SEDI', completado: false });
      tareas.push({ id: 5, etapa: 'Arribo', tarea: 'Pago de Tasas de Puerto', completado: false });
    } else {
        tareas.push({ id: 4, etapa: 'Oficialización', tarea: 'Permiso de Embarque', completado: false });
    }
  
    return tareas;
  };