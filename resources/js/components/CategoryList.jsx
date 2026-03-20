import React, { useState } from 'react';

const mockCategories = [
  { id: 1, name: 'CCTV y Seguridad', description: 'Cámaras, DVRs, NVRs y accesorios.', color: 'indigo', status: 'Activo' },
  { id: 2, name: 'Redes y Conectividad', description: 'Routers, Switches, Cableado estructurado.', color: 'sky', status: 'Activo' },
  { id: 3, name: 'Soporte Técnico', description: 'Servicios de reparación y mantenimiento.', color: 'emerald', status: 'Activo' },
];

const colorOptions = [
    { label: 'Azul (Cielo)', value: 'sky' },
    { label: 'Morado (Indigo)', value: 'indigo' },
    { label: 'Verde (Esmeralda)', value: 'emerald' },
    { label: 'Rojo (Rosa)', value: 'rose' },
    { label: 'Naranja (Ambar)', value: 'amber' },
    { label: 'Gris (Pizarra)', value: 'slate' }
];

export default function CategoryList() {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', description: '', color: 'indigo', status: 'Activo' });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', color: 'indigo', status: 'Activo' });
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
      setCategories(categories.map(c => c.id === editingItem.id ? { ...formData, id: c.id } : c));
    } else {
      setCategories([...categories, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría? Se desvinculará de los productos asociados.")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60 dark:border-neutral-800 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Categorías
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium mt-1">Gestión de familias para productos y servicios</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6">Identificador (Tag)</th>
                <th className="py-5 px-6 w-1/3">Descripción</th>
                <th className="py-5 px-6 text-center">Estado</th>
                <th className="py-5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${c.color}-500 shadow hover:scale-125 transition-transform`} />
                    <p className={`font-black text-${c.color}-600 dark:text-${c.color}-400`}>{c.name}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-neutral-500 font-medium">{c.description}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      c.status === 'Activo' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-500'
                    }`}>
                      {c.status}
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
              {categories.length === 0 && (
                <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 font-bold">No hay categorías registradas.</td>
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
                  {editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Nombre de Etiqueta</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Descripción Breve</label>
                  <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none resize-none transition-all"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Color de Distintivo</label>
                    <select name="color" required value={formData.color} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer transition-all">
                      {colorOptions.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-1">Estado</label>
                    <select name="status" required value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none cursor-pointer transition-all">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 font-bold text-slate-500 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-shadow)] rounded-xl transition-all active:scale-95">
                    Guardar Etiqueta
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
