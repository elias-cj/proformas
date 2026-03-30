import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, product, service

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    type: 'product', 
    price: 0, 
    stock: 0, 
    unit: 'Unidad', 
    brand: '', 
    description: '', 
    category_id: '', 
    is_active: true 
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        category_id: item.category_id || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ 
        name: '', code: '', type: 'product', price: 0, stock: 0, 
        unit: 'Unidad', brand: '', description: '', category_id: '', is_active: true 
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
    setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await axios.put(`/api/items/${editingItem.id}`, formData);
        setItems(items.map(i => i.id === editingItem.id ? response.data : i));
      } else {
        const response = await axios.post('/api/items', formData);
        setItems([...items, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error al guardar el ítem");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este artículo?")) {
      try {
        await axios.delete(`/api/items/${id}`);
        setItems(items.filter(i => i.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error al eliminar el artículo");
      }
    }
  };

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/60 dark:border-neutral-800 transition-all duration-300 gap-6">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h2 className="text-4xl font-black bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent tracking-tight">
            Catálogo Unificado
          </h2>
          
          {/* Tabs Filter */}
          <div className="flex bg-slate-100 dark:bg-neutral-800/80 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-200/50 dark:border-neutral-700/50 backdrop-blur-sm">
            {['all', 'product', 'service'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${filterType === type ? 'bg-white dark:bg-neutral-700 text-[var(--accent)] shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300'}`}
              >
                {type === 'all' ? 'TODOS' : type === 'product' ? 'PRODUCTOS' : 'SERVICIOS'}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-4 rounded-2xl font-black tracking-wide shadow-lg shadow-[var(--accent-shadow)] transition-all active:scale-95 flex gap-3 items-center group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative z-10">NUEVO ARTÍCULO</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-neutral-900/30 border-b border-slate-200 dark:border-neutral-800/50 text-slate-400 dark:text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="py-6 px-8">Nombre / Identificación</th>
                <th className="py-6 px-6">Tipo</th>
                <th className="py-6 px-6">Categoría</th>
                <th className="py-6 px-6">Precio / Stock</th>
                <th className="py-6 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/20 transition-all group duration-300">
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 dark:text-neutral-100 group-hover:text-[var(--accent)] transition-colors">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">{item.code || 'SIN CÓDIGO'}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.type === 'product' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 shadow-sm' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500 shadow-sm'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'product' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                        {item.type === 'product' ? 'Producto' : 'Servicio'}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">
                        {item.category?.name || 'S/C'}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-emerald-500">${item.price}</span>
                        {item.type === 'product' && (
                            <span className={`text-[10px] font-bold ${item.stock <= 5 ? 'text-rose-500' : 'text-slate-400'}`}>Stock: {item.stock}</span>
                        )}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <button 
                         onClick={() => handleOpenModal(item)}
                         className="p-2.5 text-slate-400 hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-2xl transition-all" 
                         title="Editar"
                       >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all" 
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
              {filteredItems.length === 0 && !loading && (
                <tr>
                    <td colSpan="5" className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-12 h-12 text-slate-200 dark:text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay artículos en este catálogo</span>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#141414] rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 dark:border-neutral-800 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        {editingItem ? 'Editar Artículo' : 'Nuevo Artículo'}
                    </h3>
                    <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">Configuración de Catálogo</span>
                </div>
                <button onClick={handleCloseModal} className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-2xl transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all shadow-inner placeholder:font-bold" placeholder="Ej. Cámara de Seguridad UHD" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Tipo</label>
                            <select name="type" required value={formData.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all appearance-none cursor-pointer shadow-inner">
                                <option value="product">Producto</option>
                                <option value="service">Servicio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Código</label>
                            <input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all shadow-inner" placeholder="SKU-001" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Precio Unitario ($)</label>
                            <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl px-5 py-4 text-sm font-black text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-inner" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Stock Actual</label>
                            <input type="number" name="stock" disabled={formData.type === 'service'} value={formData.stock} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all disabled:opacity-30 shadow-inner" />
                        </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Categoría</label>
                      <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all shadow-inner">
                        <option value="">Sin Categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Unidad</label>
                            <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all shadow-inner" placeholder="Unidad" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Marca</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all shadow-inner" placeholder="Dahua / Hikvision" />
                        </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Descripción Detallada</label>
                      <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all resize-none shadow-inner" placeholder="Información técnica u observaciones"></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="item_active" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[var(--accent)] focus:ring-[var(--accent)] transition-all cursor-pointer" />
                        <label htmlFor="item_active" className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer">Artículo Activo</label>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={handleCloseModal} className="px-8 py-4 font-black text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors uppercase text-[11px] tracking-widest">
                            Cancelar
                        </button>
                        <button type="submit" className="px-10 py-4 font-black text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-xl shadow-[var(--accent-shadow)] rounded-2xl transition-all active:scale-95 uppercase text-[11px] tracking-[0.15em]">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
