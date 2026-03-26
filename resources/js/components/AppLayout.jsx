import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children, currentView, setCurrentView, darkMode, onToggleDarkMode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0c0c0c] overflow-hidden transition-colors duration-300">
      {/* Sidebar con transiciones */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 opacity-100' : 'w-20 opacity-100'}`}>
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          onBack={() => setCurrentView('proformas')}
          isCollapsed={!isSidebarOpen}
          onToggleIsCollapsed={() => setIsSidebarOpen(!isSidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode} 
        />
      </div>
      
      {/* Contenido principal */}
      <main className="flex-1 h-full overflow-y-auto w-full relative transition-all duration-300">
        <div className="absolute top-0 right-0 p-6 flex justify-end w-full pointer-events-none z-[100] no-print">
            {/* Espacio para notificaciones o profile */}
        </div>
        
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
