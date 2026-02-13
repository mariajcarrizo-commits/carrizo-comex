'use client'

import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* LOGO + MARCA */}
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700">
                <Image 
                    src="/logo.jpg" 
                    alt="Logo Carrizo" 
                    fill 
                    className="object-cover"
                />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              CARRIZO <span className="text-purple-400 font-light">Comex</span>
            </span>
            
            {/* ENLACES DEL MENÚ (Aquí estaba el error, ahora está limpio) */}
            <div className="hidden md:flex ml-8 gap-1">
              <a href="/dashboard" className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                Dashboard
              </a>
              <a href="/operaciones" className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                Operaciones
              </a>
              <a href="/nomenclador" className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                Nomenclador
              </a>
              <a href="/calculadora" className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                Calculadora
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">Majo Carrizo</p>
                <p className="text-xs text-slate-400">Despachante Principal</p>
             </div>
             <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-800">
                MC
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}