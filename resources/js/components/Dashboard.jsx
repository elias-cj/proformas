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
      <div className="mb-10">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-slate-500 font-medium mt-1">Visión general del negocio y métricas clave</p>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            {/* Elemento decorativo superior */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                {metric.icon}
              </div>
              <span className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${
                metric.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {metric.isPositive ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                )}
                {metric.change}
              </span>
            </div>
            
            <div>
              <h3 className="text-slate-500 font-bold text-sm mb-1">{metric.title}</h3>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secciones Adicionales del Dashboard (Gráficos y Tablas recientes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico Simulado */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Ingresos vs Cotizaciones</h3>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer py-2 pl-4 pr-8">
                <option>Últimos 7 días</option>
                <option>Este Mes</option>
                <option>Este Año</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 relative pt-10">
            {/* Líneas horizontales decorativas (Eje Y Simulador) */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100" />
            <div className="absolute inset-x-0 bottom-1/4 h-px bg-slate-50" />
            <div className="absolute inset-x-0 bottom-2/4 h-px bg-slate-50" />
            <div className="absolute inset-x-0 bottom-3/4 h-px bg-slate-50" />
            <div className="absolute inset-x-0 top-10 h-px bg-slate-50" />

            {/* Barras del gráfico */}
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group z-10">
                {/* Tooltip escondido */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg absolute -top-2 scale-75 whitespace-nowrap">
                   Volumen: {height * 125}
                </div>
                {/* Barra */}
                <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all duration-300"
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
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Actividad Reciente</h3>
          
          <div className="space-y-6">
            {[
              { id: 1, action: 'Cotización Aprobada', desc: 'Proforma #502342 - Empresa Alpha S.A.', time: 'Hace 2 horas', color: 'emerald' },
              { id: 2, action: 'Nueva Orden', desc: 'Orden Técnica #104 asignada a Juan P.', time: 'Hace 4 horas', color: 'indigo' },
              { id: 3, action: 'Cierre de Caja', desc: 'Turno Mañana cerrado por $4,120.00', time: 'Hace 5 horas', color: 'purple' },
              { id: 4, action: 'Cotización Creada', desc: 'Proforma #502345 - Clínica del Sur', time: 'Ayer', color: 'sky' },
            ].map((item) => (
              <div key={item.id} className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500 ring-4 ring-${item.color}-50 mt-1.5 group-hover:scale-125 transition-transform`} />
                  <div className="w-px h-full bg-slate-100 mt-2" />
                </div>
                <div className="pb-1">
                  <p className="text-sm font-bold text-slate-700">{item.action}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
