import React, { useState } from 'react';

const icons = {
  dashboard: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  proforma: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  catalog: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  orders: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  finance: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  config: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> // Using simple menu icon for config as fallback, or simple cogs
};

const navigation = [
  { name: 'Dashboard', icon: icons.dashboard, current: false, subs: [] },
  {
    name: 'Proformas',
    icon: icons.proforma,
    current: true,
    subs: []
  },
  {
    name: 'Catálogos',
    icon: icons.catalog,
    current: false,
    subs: [
      { name: 'Clientes', href: '#' },
      { name: 'Categorías', href: '#' },
      { name: 'Productos', href: '#' },
      { name: 'Servicios', href: '#' }
    ]
  },
  {
    name: 'Órdenes de Trabajo',
    icon: icons.orders,
    current: false,
    subs: [
      { name: 'Historial y Asignar', href: '#' },
      { name: 'Técnicos', href: '#' }
    ]
  },
  {
    name: 'Caja y Financiero',
    icon: icons.finance,
    current: false,
    subs: [
      { name: 'Aperturas / Cierres', href: '#' },
      { name: 'Movimientos', href: '#' },
      { name: 'Reportes', href: '#' }
    ]
  }
];

export default function Sidebar({ onNavigate, currentView }) {
  const [openMenus, setOpenMenus] = useState(['Proformas']);

  const toggleMenu = (name) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-[#0f172a] text-slate-300 shadow-2xl overflow-y-auto no-print">
      <div className="flex items-center justify-center h-20 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-black text-white tracking-widest bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase">EMPROTEC</h1>
      </div>
      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isOpen = openMenus.includes(item.name);
            const hasSubs = item.subs && item.subs.length > 0;
            
            // Verificamos si algún hijo está activo para encender el padre
            const isAnySubActive = hasSubs && item.subs.some(sub => sub.name.toLowerCase() === currentView);
            
            // Evaluamos si el item actual coincide con la vista actual o derivadas
            const isActive = item.name.toLowerCase() === currentView || (item.name === 'Proformas' && currentView === 'editor') || isAnySubActive;

            return (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (item.name === 'Proformas') {
                        onNavigate('proformas');
                    }
                    if (item.name === 'Dashboard') {
                        onNavigate('dashboard');
                    }
                    if (hasSubs) toggleMenu(item.name);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white font-bold'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                    <span className="font-semibold text-[13px] tracking-wide">{item.name}</span>
                  </div>
                  {hasSubs && (
                     <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                  )}
                </button>
                
                {/* Submenus */}
                {hasSubs && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="pl-11 pr-2 py-1 space-y-1">
                      {item.subs.map((sub) => {
                        const isSubActive = currentView === sub.name.toLowerCase();
                        
                        return (
                          <button
                            key={sub.name}
                            onClick={() => onNavigate(sub.name.toLowerCase())}
                            className={`w-full text-left block px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                              isSubActive
                                ? 'bg-indigo-500/20 text-indigo-400 font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Sección inferior fija (Configuración, Perfil y Logout) */}
      <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
        
        {/* Opción de Configuración movida aquí */}
        <div className="mb-2">
            <button
                onClick={() => toggleMenu('Configuración')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:text-white group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">{icons.config}</span>
                    <span className="font-semibold text-[13px] tracking-wide">Configuración</span>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-300 ${openMenus.includes('Configuración') ? 'rotate-180 text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus.includes('Configuración') ? 'max-h-[200px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="pl-10 pr-2 py-1 space-y-1">
                    {[
                      { name: 'Usuarios', href: '#' },
                      { name: 'Roles y Permisos', href: '#' },
                      { name: 'Empresas', href: '#' }
                    ].map((sub) => (
                        <a
                            key={sub.name}
                            href={sub.href}
                            className="block px-3 py-2 rounded-lg text-[12px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {sub.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Perfil del Administrador */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-bold text-white truncate">Administrador</p>
            <p className="text-[10px] text-slate-400 truncate">admin@emprotec.com</p>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 rounded-lg text-[12px] font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all active:scale-95 border border-transparent hover:border-rose-500/30"
            onClick={() => {/* Lógica de logout futura */}}
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
