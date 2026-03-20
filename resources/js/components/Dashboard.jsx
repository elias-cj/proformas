import React from 'react';

// Se simula datos para las métricas
const metrics = [
  { id: 1, title: 'Total Cotizado (Mes)', value: '$45,231.00', change: '+12.5%', isPositive: true, icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { id: 2, title: 'Proformas Aprobadas', value: '124', change: '+5.2%', isPositive: true, icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { id: 3, title: 'Órdenes Pendientes', value: '18', change: '-2.4%', isPositive: false, icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { id: 4, title: 'Nuevos Clientes', value: '32', change: '+18.1%', isPositive: true, icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  )},
];

export default function Dashboard() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Panel de Monitoreo
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium mt-1">Análisis visual del estado operativo de las plataformas</p>
        </div>
        <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[var(--accent-shadow)] transition-all flex items-center gap-2 active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Proforma
        </button>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white dark:bg-[#1a1a1a] rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-neutral-800 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[var(--accent-soft)] text-[var(--accent)] rounded-2xl">
                {metric.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                metric.isPositive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
              }`}>
                {metric.change}
              </span>
            </div>
            
            <div>
              <h3 className="text-slate-400 dark:text-neutral-500 font-bold text-xs mb-1 uppercase tracking-wider">{metric.title}</h3>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secciones Adicionales del Dashboard (Gráficos y Tablas recientes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico Simulado */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Ingresos vs Cotizaciones</h3>
            <select className="bg-slate-50 dark:bg-neutral-900 border-none rounded-xl text-sm font-bold text-slate-600 dark:text-neutral-400 focus:ring-0 cursor-pointer py-2 pl-4 pr-8">
                <option>Últimos 7 días</option>
                <option>Este Mes</option>
                <option>Este Año</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 relative pt-10">
            {/* Líneas horizontales decorativas (Eje Y Simulador) */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100 dark:bg-neutral-800" />
            <div className="absolute inset-x-0 bottom-1/4 h-px bg-slate-50 dark:bg-neutral-900/50" />
            <div className="absolute inset-x-0 bottom-2/4 h-px bg-slate-50 dark:bg-neutral-900/50" />
            <div className="absolute inset-x-0 bottom-3/4 h-px bg-slate-50 dark:bg-neutral-900/50" />
            <div className="absolute inset-x-0 top-10 h-px bg-slate-50 dark:bg-neutral-900/50" />

            {/* Barras del gráfico */}
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group z-10">
                {/* Tooltip escondido */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg absolute -top-2 scale-75 whitespace-nowrap">
                   Volumen: {height * 125}
                </div>
                {/* Barra */}
                <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-[var(--accent)] to-purple-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                    style={{ height: `${height}%` }}
                />
                <span className="text-[10px] font-bold text-slate-400 mt-2">
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Actividad Reciente</h3>
          
          <div className="space-y-6">
            {[
              { id: 1, action: 'Cotización Aprobada', desc: 'Proforma #502342 - Empresa Alpha S.A.', time: 'Hace 2 horas', color: 'emerald' },
              { id: 2, action: 'Nueva Orden', desc: 'Orden Técnica #104 asignada a Juan P.', time: 'Hace 4 horas', color: 'blue' },
              { id: 3, action: 'Cierre de Caja', desc: 'Turno Mañana cerrado por $4,120.00', time: 'Hace 5 horas', color: 'purple' },
              { id: 4, action: 'Cotización Creada', desc: 'Proforma #502345 - Clínica del Sur', time: 'Ayer', color: 'orange' },
            ].map((item) => (
              <div key={item.id} className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500 ring-4 ring-${item.color}-50 dark:ring-${item.color}-900/20 mt-1.5 group-hover:scale-125 transition-transform`} />
                  <div className="w-px h-full bg-slate-100 dark:bg-neutral-800 mt-2" />
                </div>
                <div className="pb-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-200">{item.action}</p>
                  <p className="text-xs text-slate-500 dark:text-neutral-500 line-clamp-1">{item.desc}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
