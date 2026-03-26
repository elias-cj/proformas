import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: '', duration: '', base_price: '', category_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/categories?type=service')
      ]);
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        base_price: item.base_price.toString().replace('$', ''),
        category_id: item.category_id || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', duration: '', base_price: '', category_id: '' });
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

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      base_price: parseFloat(formData.base_price.toString().replace('$', '')) || 0
    };

    try {
      if (editingItem) {
        const response = await axios.put(`/api/services/${editingItem.id}`, dataToSave);
        setServices(services.map(s => s.id === editingItem.id ? response.data : s));
      } else {
        const response = await axios.post('/api/services', dataToSave);
        setServices([...services, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error al guardar el servicio");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este servicio?")) {
      try {
        await axios.delete(`/api/services/${id}`);
        setServices(services.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error al eliminar el servicio");
      }
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60 dark:border-neutral-800 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Servicios
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium mt-1">Catálogo de prestaciones e instalaciones</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Servicio
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Servicio</th>
                <th className="py-5 px-6 text-center">Categoría</th>
                <th className="py-5 px-6 text-center">Duración Base</th>
                <th className="py-5 px-6 text-right">Precio Referencial</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 dark:text-white">{s.name}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {categories.find(cat => cat.id === s.category_id)?.name || 'Sin Categoría'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-500 dark:text-neutral-500">
                    {s.duration}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-800 dark:text-white">
                    ${parseFloat(s.base_price).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleOpenModal(s)}
                         className="p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors" 
                         title="Editar"
                       >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
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
              {services.length === 0 && (
                <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-bold">No hay servicios registrados.</td>
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
                  {editingItem ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Nombre del Servicio</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Categoría</label>
                    <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer transition-all">
                      <option value="">Seleccione una categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Precio Referencial</label>
                    <input type="text" name="base_price" placeholder="$0.00" required value={formData.base_price} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Duración Aproximada</label>
                  <input type="text" name="duration" placeholder="Ej: 4 Hrs, Variable, 2 Días" required value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-shadow)] rounded-xl transition-all active:scale-95">
                    Guardar Servicio
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
