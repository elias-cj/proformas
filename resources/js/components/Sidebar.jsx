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
];export default function Sidebar({ onNavigate, onBack, currentView, isCollapsed, onToggleIsCollapsed, darkMode, onToggleDarkMode }) {
  const [openMenus, setOpenMenus] = useState(['Proformas']);

  const toggleMenu = (name) => {
    if (isCollapsed) {
        onToggleIsCollapsed(); // Expand the sidebar if it was collapsed
        setOpenMenus([name]);
        return;
    }
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-[#141414] text-slate-600 dark:text-neutral-400 border-r border-slate-200 dark:border-neutral-800 shadow-sm overflow-y-auto no-print transition-all duration-300 whitespace-nowrap overflow-x-hidden ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header with Toggle / Back */}
      <div className={`relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} h-20 border-b border-slate-100 dark:border-neutral-800 shrink-0`}>
        <div className={`flex items-center gap-2 overflow-hidden ${isCollapsed ? 'ml-0' : ''}`}>
            {/* Back Button (Only in Editor) */}
            {!isCollapsed && currentView === 'editor' && (
                <button 
                    onClick={onBack}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors mr-1"
                    title="Volver"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-[var(--accent-shadow)] shrink-0 transition-colors`} style={{ backgroundColor: 'var(--accent)' }}>
            EM
            </div>
            {!isCollapsed && (
                <h1 className="text-sm font-black text-slate-800 dark:text-white tracking-tight uppercase truncate transition-all duration-300">EMPROTEC</h1>
            )}
        </div>

        {/* Action Controls */}
        <div className={`flex items-center gap-1 ${isCollapsed ? 'absolute -right-0' : ''}`}>
            <button 
                onClick={onToggleIsCollapsed}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors shrink-0"
                title={isCollapsed ? "Expandir" : "Contraer"}
            >
                {isCollapsed ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                ) : (
                    <svg className={`w-5 h-5 transition-transform duration-300 rotate-180`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
                    </svg>
                )}
            </button>
        </div>
      </div>
      
      <div className="p-3 flex-1">
        {!isCollapsed && (
            <div className="mb-4 px-4 text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">General</div>
        )}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isOpen = openMenus.includes(item.name);
            const hasSubs = item.subs && item.subs.length > 0;
            const isAnySubActive = hasSubs && item.subs.some(sub => sub.name.toLowerCase() === currentView);
            const isActive = item.name.toLowerCase() === currentView || (item.name === 'Proformas' && (currentView === 'editor' || currentView === 'proformas')) || isAnySubActive;

            return (
              <div key={item.name} className="relative group">
                <button
                  onClick={() => {
                    if (item.name === 'Proformas' || item.name === 'Dashboard') {
                        onNavigate(item.name.toLowerCase());
                    }
                    if (hasSubs) toggleMenu(item.name);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={{ 
                    color: isActive ? 'var(--accent)' : '',
                    backgroundColor: isActive ? 'var(--accent-soft)' : ''
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`transition-colors h-5 w-5 flex items-center justify-center`} style={{ color: isActive ? 'var(--accent)' : '' }}>{item.icon}</span>
                    {!isCollapsed && <span className="text-[14px] tracking-tight">{item.name}</span>}
                  </div>
                  {!isCollapsed && hasSubs && (
                     <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'text-slate-400'}`} style={{ color: isOpen ? 'var(--accent)' : 'inherit' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                  )}
                </button>
                
                {!isCollapsed && hasSubs && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="pl-12 pr-2 py-1 space-y-1">
                      {item.subs.map((sub) => {
                        const isSubActive = currentView === sub.name.toLowerCase();
                        return (
                          <button
                            key={sub.name}
                            onClick={() => onNavigate(sub.name.toLowerCase())}
                            className={`w-full text-left block px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                              isSubActive
                                ? 'font-bold'
                                : 'text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-800'
                            }`}
                            style={{ color: isSubActive ? 'var(--accent)' : '' }}
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
      
      <div className="p-3 border-t border-slate-100 dark:border-neutral-800 space-y-2 shrink-0">
        <button
            onClick={() => onNavigate('usuarios')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                currentView === 'usuarios' ? 'font-bold' : 'hover:bg-slate-50 dark:hover:bg-neutral-800/50'
            }`}
            style={{ 
                color: currentView === 'usuarios' ? 'var(--accent)' : '',
                backgroundColor: currentView === 'usuarios' ? 'var(--accent-soft)' : ''
            }}
        >
            <span className={`transition-colors h-5 w-5 flex items-center justify-center`} style={{ color: currentView === 'usuarios' ? 'var(--accent)' : '' }}>
                {icons.config}
            </span>
            {!isCollapsed && (
                <span className={`text-[14px] tracking-tight ${currentView === 'usuarios' ? '' : 'text-slate-600 dark:text-neutral-400 font-semibold'}`}>
                    Configuración
                </span>
            )}
        </button>

        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200/50 dark:border-neutral-800 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-colors" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
                <p className="text-[13px] font-bold text-slate-800 dark:text-neutral-200 truncate leading-none mb-1">admin@admin.com</p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-500 truncate">Superadministrador</p>
            </div>
          )}
        </div>

        <button 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all active:scale-95 group ${isCollapsed ? 'justify-center' : ''}`}
            onClick={() => {}}
        >
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 0 01-3-3V7a3 0 013-3h4a3 0 013 3v1" />
            </svg>
            {!isCollapsed && "Cerrar Sesión"}
        </button>
      </div>
    </div>
  );
}
