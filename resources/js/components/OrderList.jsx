import React, { useState } from 'react';

const mockOrders = [
  { id: 1, orderNumber: 'OT-10024', client: 'Empresa Alpha S.A.', priority: 'Alta', status: 'En Proceso', technician: 'Carlos Ruiz', date: '26/03/2026' },
  { id: 2, orderNumber: 'OT-10025', client: 'Juan Pérez', priority: 'Media', status: 'Pendiente', technician: 'Sin Asignar', date: '27/03/2026' },
  { id: 3, orderNumber: 'OT-10026', client: 'Constructora Gamma', priority: 'Urgente', status: 'Completada', technician: 'Ana Gómez', date: '25/03/2026' },
];

export default function OrderList() {
  const [orders, setOrders] = useState(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ orderNumber: '', client: '', priority: 'Media', status: 'Pendiente', technician: '', date: '' });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      const newOrderNumber = `OT-${10000 + orders.length + 1}`;
      const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setFormData({ orderNumber: newOrderNumber, client: '', priority: 'Media', status: 'Pendiente', technician: 'Sin Asignar', date: today });
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
      setOrders(orders.map(o => o.id === editingItem.id ? { ...formData, id: o.id } : o));
    } else {
      setOrders([...orders, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta orden de trabajo?")) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Órdenes de Trabajo
          </h2>
          <p className="text-slate-500 font-medium mt-1">Historial, seguimiento y asignaciones (OT)</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Orden (OT)
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Nº Orden / Fecha</th>
                <th className="py-5 px-6">Cliente</th>
                <th className="py-5 px-6 text-center">Prioridad</th>
                <th className="py-5 px-6">Técnico Asignado</th>
                <th className="py-5 px-6 text-center">Estado</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{o.orderNumber}</p>
                    <p className="text-xs text-slate-400 font-medium">{o.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-700">{o.client}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                       <div className={`w-2 h-2 rounded-full ${o.priority === 'Urgente' ? 'bg-rose-500 animate-pulse' : o.priority === 'Alta' ? 'bg-amber-500' : o.priority === 'Media' ? 'bg-sky-500' : 'bg-slate-400'}`}></div>
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{o.priority}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold ${o.technician === 'Sin Asignar' ? 'text-slate-400 italic' : 'text-[var(--accent)]'}`}>{o.technician}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full border ${
                      o.status === 'Pendiente' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                      o.status === 'En Proceso' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleOpenModal(o)}
                         className="p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors" 
                         title="Editar / Asignar"
                       >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(o.id)}
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
              {orders.length === 0 && (
                <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">No hay órdenes de trabajo activas.</td>
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
                  {editingItem ? 'Editar Orden' : 'Nueva Orden (OT)'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nº Orden</label>
                    <input type="text" name="orderNumber" readOnly value={formData.orderNumber} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha</label>
                    <input type="text" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent)] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cliente / Solicitante</label>
                  <input type="text" name="client" required value={formData.client} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent)] focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Prioridad</label>
                    <select name="priority" required value={formData.priority} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer">
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estado</label>
                    <select name="status" required value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer">
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Técnico Asignado</label>
                  <select name="technician" required value={formData.technician} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer">
                      <option value="Sin Asignar">-- Sin Asignar --</option>
                      <option value="Carlos Ruiz">Carlos Ruiz</option>
                      <option value="Ana Gómez">Ana Gómez</option>
                      <option value="Luis Martínez">Luis Martínez</option>
                  </select>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-shadow)] rounded-xl transition-all active:scale-95">
                    Guardar Orden
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
