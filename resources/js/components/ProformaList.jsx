import React, { useState, useEffect } from 'react';

export default function ProformaList({ onNavigateToEditor }) {
  const [proformas, setProformas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProformas();
  }, []);

  const fetchProformas = () => {
    setLoading(true);
    axios.get("/api/proformas")
      .then((res) => {
        setProformas(res.data);
      })
      .catch((err) => console.error("Error loading proformas", err))
      .finally(() => setLoading(false));
  };

  const deleteProforma = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta proforma?")) {
      axios.delete(`/api/proformas/${id}`)
        .then(() => {
          setProformas(proformas.filter(p => p.id !== id));
        })
        .catch(err => console.error("Error deleting proforma", err));
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val || 0);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Historial de Proformas
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium mt-1">Gestión y seguimiento de cotizaciones de EMPROTEC.</p>
        </div>
        <button 
          onClick={onNavigateToEditor}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center text-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Proforma
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-all duration-300">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em]">Cargando Historial...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 text-xs uppercase tracking-widest font-bold">
                  <th className="py-5 px-6">Nº Cotización</th>
                  <th className="py-5 px-6">Cliente</th>
                  <th className="py-5 px-6">Fecha</th>
                  <th className="py-5 px-6">Total</th>
                  <th className="py-5 px-6 text-center">Estado</th>
                  <th className="py-5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {proformas.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 dark:text-white uppercase">#{p.number}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 dark:text-neutral-300 uppercase">
                      {p.customer?.name_reason_social || 'S/N'}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-neutral-500">{p.date}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{formatCurrency(p.total)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${
                        p.status === 'borrador' ? 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400' :
                        p.status === 'enviada' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' :
                        'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        {/* Ver PDF */}
                        <a 
                          href={`/api/proformas/${p.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 transition-colors" 
                          title="Ver PDF"
                        >
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>

                        {/* WhatsApp */}
                        <button 
                          onClick={() => {
                            axios.get(`/api/proformas/${p.id}/whatsapp`)
                              .then(res => window.open(res.data.url, '_blank'))
                              .catch(err => console.error(err));
                          }}
                          className="text-slate-400 hover:text-emerald-600 transition-colors" 
                          title="WhatsApp"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.721 7.454c-2.131 0-4.212-.572-6.03-1.655l-.432-.256-4.489 1.177 1.199-4.379-.281-.447c-1.189-1.89-1.816-4.085-1.816-6.333 0-6.685 5.437-12.122 12.122-12.122 3.24 0 6.287 1.261 8.578 3.553a12.046 12.046 0 0 1 3.553 8.578c0 6.685-5.437 12.122-12.122 12.122m8.578-20.701c-2.292-2.292-5.34-3.554-8.578-3.554C6.012 0 1.037 4.975 1.037 11.096c0 2.112.553 4.175 1.603 5.992l-1.704 6.223 6.368-1.669a11.026 11.026 0 0 0 5.792 1.611h.005c6.109 0 11.096-4.975 11.096-11.096 0-2.966-1.155-5.754-3.446-8.045z"/>
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button 
                          onClick={() => deleteProforma(p.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors" 
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
          )}
          
          {!loading && proformas.length === 0 && (
              <div className="p-12 text-center text-slate-400 dark:text-neutral-600 font-bold uppercase tracking-widest text-sm">
                  No hay proformas registradas todavía en el sistema.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

