import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ 
    name_reason_social: '', 
    document_number: '', 
    phone: '', 
    email: '', 
    document_type: 'Corporativo',
    address: '',
    is_active: true
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ 
        name_reason_social: '', 
        document_number: '', 
        phone: '', 
        email: '', 
        document_type: 'Corporativo',
        address: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await axios.put(`/api/customers/${editingItem.id}`, formData);
        setCustomers(customers.map(c => c.id === editingItem.id ? response.data : c));
      } else {
        const response = await axios.post('/api/customers', formData);
        setCustomers([...customers, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error al guardar el cliente. Verifique que el número de documento no esté duplicado.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`/api/customers/${id}`);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Error al eliminar el cliente");
      }
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60 dark:border-neutral-800 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Clientes
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium mt-1">Directorio y gestión de contactos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Cliente
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Cliente / Doc</th>
                <th className="py-5 px-6">Contacto</th>
                <th className="py-5 px-6 text-center">Tipo</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 dark:text-white">{c.name_reason_social}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">{c.document_number}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-700 dark:text-neutral-300">{c.phone}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-500">{c.email}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      c.document_type === 'Corporativo' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {c.document_type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(c)}
                        className="p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
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
              {customers.length === 0 && (
                <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 font-bold">No hay clientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editingItem ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Nombre / Razón Social</label>
                  <input type="text" name="name_reason_social" required value={formData.name_reason_social} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Documento (NIT/CI)</label>
                    <input type="text" name="document_number" required value={formData.document_number} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Tipo</label>
                    <select name="document_type" required value={formData.document_type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer">
                      <option value="Corporativo">Corporativo</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Teléfono</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-shadow)] rounded-xl transition-all active:scale-95">
                    Guardar Cliente
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
