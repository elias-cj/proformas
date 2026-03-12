import React, { useState, useEffect } from 'react';

// Se simula datos mientras se conecta el endpoint real del backend
const mockProformas = [
  { id: 1, number: '502342', client: 'Empresa Alpha S.A.', date: '25/03/2026', total: '$1,250.00', status: 'Borrador' },
  { id: 2, number: '502343', client: 'Industrial Beta SRL', date: '26/03/2026', total: '$3,400.00', status: 'Enviada' },
  { id: 3, number: '502344', client: 'Constructora Gamma', date: '01/04/2026', total: '$890.50', status: 'Aprobada' },
];

export default function ProformaList({ onNavigateToEditor }) {
  const [proformas, setProformas] = useState(mockProformas);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Proformas
          </h2>
          <p className="text-slate-500 font-medium mt-1">Historial y gestión de cotizaciones</p>
        </div>
        <button 
          onClick={onNavigateToEditor}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Proforma
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Nº Cotización</th>
                <th className="py-5 px-6">Cliente</th>
                <th className="py-5 px-6">Fecha</th>
                <th className="py-5 px-6">Total</th>
                <th className="py-5 px-6 text-center">Estado</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proformas.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800">#{p.number}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{p.client}</td>
                  <td className="py-4 px-6 text-slate-500">{p.date}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{p.total}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      p.status === 'Borrador' ? 'bg-slate-100 text-slate-600' :
                      p.status === 'Enviada' ? 'bg-sky-100 text-sky-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      {/* Ver Proforma */}
                      <button 
                        className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" 
                        title="Ver Proforma"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Editar */}
                      <button 
                        onClick={onNavigateToEditor}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      
                      {/* Generar/Descargar PDF */}
                      <button 
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" 
                        title="PDF"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      {/* Eliminar */}
                      <button 
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {proformas.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-bold">
                  No hay proformas registradas todavía.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
