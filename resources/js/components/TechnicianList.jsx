import React, { useState } from 'react';

const mockTechnicians = [
  { id: 1, name: 'Carlos Ruiz', doc: 'CI: 9812456', phone: '+591 78901234', specialty: 'CCTV y Redes', status: 'Disponible', ordersAssigned: 1 },
  { id: 2, name: 'Ana Gómez', doc: 'CI: 6543210', phone: '+591 67890123', specialty: 'Servidores', status: 'En Ruta', ordersAssigned: 2 },
  { id: 3, name: 'Luis Martínez', doc: 'CI: 4567891', phone: '+591 75012345', specialty: 'Soporte General', status: 'Inactivo', ordersAssigned: 0 },
];

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState(mockTechnicians);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', doc: '', phone: '', specialty: '', status: 'Disponible' });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', doc: '', phone: '', specialty: '', status: 'Disponible' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setTechnicians(technicians.map(t => t.id === editingItem.id ? { ...formData, id: t.id, ordersAssigned: t.ordersAssigned } : t));
    } else {
      setTechnicians([...technicians, { ...formData, id: Date.now(), ordersAssigned: 0 }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas dar de baja a este técnico?")) {
      setTechnicians(technicians.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Técnicos
          </h2>
          <p className="text-slate-500 font-medium mt-1">Directorio y disponibilidad del equipo operativo</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Técnico
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Técnico / Doc</th>
                <th className="py-5 px-6">Contacto</th>
                <th className="py-5 px-6">Especialidad principal</th>
                <th className="py-5 px-6 text-center">Estado Operativo</th>
                <th className="py-5 px-6 text-center">OT Asignadas</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {technicians.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm shrink-0">
                      {t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{t.doc}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-700">{t.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-600">{t.specialty}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                       <span className={`relative flex h-3 w-3`}>
                          {t.status === 'Disponible' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${t.status === 'Disponible' ? 'bg-emerald-500' : t.status === 'En Ruta' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                       </span>
                       <span className="text-xs font-bold text-slate-600">{t.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-black ${t.ordersAssigned > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {t.ordersAssigned}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleOpenModal(t)}
                         className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" 
                         title="Editar"
                       >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
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
              {technicians.length === 0 && (
                <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">No hay técnicos en el sistema.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800">
                  {editingItem ? 'Editar Técnico' : 'Nuevo Técnico'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre Completo</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Documento (CI)</label>
                    <input type="text" name="doc" required value={formData.doc} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Teléfono Móvil</label>
                     <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Especialidad Principal</label>
                  <input type="text" name="specialty" placeholder="Ej: Redes, CCTV, Eléctrico" required value={formData.specialty} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estado Operativo</label>
                    <select name="status" required value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                      <option value="Disponible">Disponible (En base)</option>
                      <option value="En Ruta">En Ruta / Trabajando</option>
                      <option value="Inactivo">Inactivo / Fuera de Servicio</option>
                    </select>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 rounded-xl transition-all active:scale-95">
                    Guardar Ficha
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
