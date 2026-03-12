import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children, currentView, setCurrentView }) {
  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Contenido principal scrolleable a la derecha */}
      <main className="flex-1 h-full overflow-y-auto w-full relative">
        {/* Cabecera genérica simple para otras secciones o se puede omitir si ProformaEditor tiene la suya */}
        <div className="absolute top-0 right-0 p-6 flex justify-end w-full pointer-events-none z-[100] no-print">
            {/* Espacio para notificaciones o profile */}
        </div>
        
        {children}
      </main>
    </div>
  );
}
