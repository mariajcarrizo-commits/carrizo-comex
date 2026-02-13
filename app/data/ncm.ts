// app/data/ncm.ts

export interface NCM {
    codigo: string;
    descripcion: string;
    di: string;       // Derecho de Importación
    iva: string;      // Alícuota IVA
    te: string;       // Tasa Estadística
    licencia: string; // LNA (No Automática) o LA (Automática)
    intervenciones?: string[]; // Ej: Seguridad Eléctrica, ANMAT
  }
  
  export const ncmComunes: NCM[] = [
    // --- CAPÍTULO 84: MAQUINARIA Y TECNOLOGÍA ---
    { 
      codigo: "8471.30.12", 
      descripcion: "Tabletas (Tablets) de peso inferior a 1 kg", 
      di: "0%", iva: "10.5%", te: "3%", licencia: "LA",
      intervenciones: ["Seguridad Eléctrica"]
    },
    { 
      codigo: "8471.30.19", 
      descripcion: "Las demás máquinas automáticas para procesamiento de datos, portátiles", 
      di: "0%", iva: "10.5%", te: "3%", licencia: "LNA",
      intervenciones: ["Seguridad Eléctrica"]
    },
    { 
      codigo: "8517.13.00", 
      descripcion: "Teléfonos inteligentes (Smartphones)", 
      di: "16%", iva: "21%", te: "3%", licencia: "LNA",
      intervenciones: ["ENACOM", "Seguridad Eléctrica"]
    },
  
    // --- CAPÍTULO 38: PRODUCTOS QUÍMICOS ---
    { 
      codigo: "3824.99.90", 
      descripcion: "Productos químicos y preparaciones de la industria química (Aditivos)", 
      di: "14%", iva: "21%", te: "3%", licencia: "LA",
      intervenciones: ["SEDRONAR", "ANMAT"] 
    },
    { 
      codigo: "3004.90.99", 
      descripcion: "Medicamentos constituidos por productos mezclados o sin mezclar", 
      di: "0%", iva: "21%", te: "0%", licencia: "LA",
      intervenciones: ["ANMAT"] 
    },
  
    // --- CAPÍTULO 61: TEXTILES (ALTO RIESGO) ---
    { 
      codigo: "6109.10.00", 
      descripcion: "T-shirts y camisetas, de punto, de algodón", 
      di: "35%", iva: "21%", te: "3%", licencia: "LNA",
      intervenciones: ["DJCP (Declaración Jurada Composición de Producto)"] 
    },
  
    // --- CAPÍTULO 95: JUGUETES ---
    { 
      codigo: "9503.00.10", 
      descripcion: "Triciclos, patinetes, coches de pedal y juguetes similares con ruedas", 
      di: "35%", iva: "21%", te: "3%", licencia: "LNA",
      intervenciones: ["Seguridad Juguetes (Certificación)"] 
    },
    { 
        codigo: "9503.00.22", 
        descripcion: "Juguetes rellenos (Peluches)", 
        di: "35%", iva: "21%", te: "3%", licencia: "LNA",
        intervenciones: ["Seguridad Juguetes"] 
      },
  
    // --- VARIOS ---
    { 
      codigo: "0901.21.00", 
      descripcion: "Café tostado sin descafeinar", 
      di: "10%", iva: "21%", te: "3%", licencia: "LA",
      intervenciones: ["INAL"] 
    },
    { 
        codigo: "2204.21.00", 
        descripcion: "Vinos en recipientes con capacidad <= 2 litros", 
        di: "20%", iva: "21%", te: "3%", licencia: "LA",
        intervenciones: ["INV"] 
      }
  ];