import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaymentMethodList() {
  const [methods, setMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    status: 'Activo',
    installments: [100] // Default 1 payment of 100%
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/payment-methods');
      setMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        installments: item.installments || [100]
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', status: 'Activo', installments: [100] });
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

  const handleInstallmentChange = (index, value) => {
    const newInstallments = [...formData.installments];
    newInstallments[index] = parseFloat(value) || 0;
    setFormData({ ...formData, installments: newInstallments });
  };

  const addInstallment = () => {
    setFormData({ ...formData, installments: [...formData.installments, 0] });
  };

  const removeInstallment = (index) => {
    if (formData.installments.length > 1) {
      const newInstallments = formData.installments.filter((_, i) => i !== index);
      setFormData({ ...formData, installments: newInstallments });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const total = formData.installments.reduce((acc, curr) => acc + curr, 0);
    
    if (Math.round(total) !== 100) {
      alert(`La suma de los porcentajes debe ser exactamente 100%. Actual: ${total}%`);
      return;
    }

    try {
      if (editingItem) {
        const response = await axios.put(`/api/payment-methods/${editingItem.id}`, formData);
        setMethods(methods.map(m => m.id === editingItem.id ? response.data : m));
      } else {
        const response = await axios.post('/api/payment-methods', formData);
        setMethods([...methods, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving payment method:", error);
      const msg = error.response?.data?.message || "Error al guardar el método de pago";
      alert(msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este método de pago?")) {
      try {
        await axios.delete(`/api/payment-methods/${id}`);
        setMethods(methods.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting payment method:", error);
        alert("Error al eliminar el método de pago");
      }
    }
  };

  const totalPercentage = formData.installments.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60 dark:border-neutral-800 transition-colors duration-300">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Métodos de Pago
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Gestión de Cobranzas y Cuotas</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Método
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Nombre</th>
                <th className="py-5 px-6">Plan de Pagos</th>
                <th className="py-5 px-6 text-center">Estado</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {methods.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-black text-slate-700 dark:text-neutral-200">{m.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{m.description}</p>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex flex-wrap gap-1">
                      {m.installments && m.installments.map((pct, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px] font-bold text-slate-600 dark:text-neutral-400">
                          {pct}%
                          {idx < m.installments.length - 1 && <span className="ml-1 opacity-30">|</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      m.status === 'Activo' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-500'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleOpenModal(m)}
                         className="p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors" 
                         title="Editar"
                       >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)}
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
              {methods.length === 0 && !loading && (
                <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 font-bold">No hay métodos de pago registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editingItem ? 'Editar Método' : 'Nuevo Método'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Nombre del Método</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" placeholder="Ej. 50% Adelanto" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Descripción</label>
                      <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none resize-none transition-all" placeholder="Detalles del método"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Estado</label>
                      <select name="status" required value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer transition-all">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">Plan de Pagos (%)</label>
                        <button type="button" onClick={addInstallment} className="text-xs font-black text-[var(--accent)] hover:underline flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            AÑADIR PAGO
                        </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {formData.installments.map((pct, idx) => (
                            <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                                <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                                <div className="relative flex-1">
                                    <input 
                                        type="number" 
                                        min="1" max="100"
                                        required
                                        value={pct} 
                                        onChange={(e) => handleInstallmentChange(idx, e.target.value)}
                                        className="w-full bg-white dark:bg-neutral-800 border-none rounded-lg px-3 py-2 text-xs font-black text-slate-700 dark:text-white focus:ring-1 focus:ring-[var(--accent)] pr-8" 
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                                </div>
                                <button type="button" onClick={() => removeInstallment(idx)} className="text-rose-400 hover:text-rose-600 p-1 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-neutral-800 flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total:</span>
                        <span className={`text-sm font-black transition-colors ${Math.round(totalPercentage) === 100 ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`}>
                            {totalPercentage}%
                        </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-shadow)] rounded-xl transition-all active:scale-95">
                    Guardar Método
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
