import React, { useState, useEffect } from 'react';
import axios from 'axios';

const tabs = [
  { id: 'usuarios', name: 'Usuarios', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { id: 'roles', name: 'Roles y Permisos', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { id: 'empresa', name: 'Empresa', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { id: 'apariencia', name: 'Apariencia', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
  { id: 'migracion', name: 'Migración', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
];

export default function UserManagement({ darkMode, onToggleDarkMode, accentColor, onAccentColorChange }) {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [company, setCompany] = useState({ name: '', currency: '', document_footer: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: []
  });

  useEffect(() => {
    fetchData();
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
        const res = await axios.get('/api/companies');
        setCompany(res.data);
    } catch (e) { console.error(e); }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/companies', company);
        alert("Configuración de empresa guardada");
    } catch (e) { alert("Error al guardar"); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [usersRes, rolesRes] = await Promise.all([
            axios.get('/api/users'),
            axios.get('/api/roles')
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
    } catch (error) {
        console.error("Error fetching admin data", error);
    } finally {
        setLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    onToggleDarkMode();
  };

  const openUserModal = (user = null) => {
    if (user) {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles.map(r => r.id)
        });
    } else {
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', roles: [] });
    }
    setShowModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
        if (selectedUser) {
            await axios.put(`/api/users/${selectedUser.id}`, formData);
        } else {
            await axios.post('/api/users', formData);
        }
        setShowModal(false);
        fetchData();
    } catch (error) {
        alert("Error al guardar usuario");
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header General */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Administración</h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Gestión centralizada de usuarios, roles e identidad corporativa.</p>
      </div>

      {/* Tabs Navigation - Estilo Identico al modelo */}
      <div className="flex bg-slate-100 dark:bg-neutral-900 p-1 rounded-2xl w-fit mb-10 shadow-sm border border-slate-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-shadow)] scale-105' 
                : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content for "Usuarios" */}
      {activeTab === 'usuarios' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Gestión de Usuarios</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium mt-1 text-sm">Controla los accesos y niveles de permiso del personal.</p>
            </div>
            <button 
                onClick={() => openUserModal()}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[var(--accent-shadow)] transition-all flex items-center gap-2 active:scale-95"
            >
                <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Agregar Usuario
            </button>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden">
            {/* Table Header Section */}
            <div className="p-8 pb-4 flex justify-between items-center bg-[#fcfcfc] dark:bg-[#1f1f1f] border-b border-slate-50 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shadow-sm border border-[var(--accent-soft)]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h4 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">Directorio de Usuarios</h4>
                </div>
                <div className="relative">
                    <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Buscar usuario..." 
                        className="bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[var(--accent)] w-80 transition-all outline-none text-slate-700 dark:text-neutral-300 font-bold"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-32 text-center text-slate-400 font-black tracking-widest text-xs uppercase">Cargando directorio...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[#fcfcfc] dark:bg-[#1f1f1f] border-b border-slate-100 dark:border-neutral-800 text-slate-400 dark:text-neutral-500 text-[11px] font-black uppercase tracking-widest">
                            <th className="py-5 px-10">Usuario</th>
                            <th className="py-5 px-6 text-center">Rol</th>
                            <th className="py-5 px-6 text-center">Estado</th>
                            <th className="py-5 px-6 text-center">Fecha Registro</th>
                            <th className="py-5 px-10 text-right">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-neutral-800/50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                            <td className="py-7 px-10">
                                <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-xs font-black text-slate-500 dark:text-neutral-400 border border-slate-100 dark:border-neutral-700 shadow-sm">
                                    {(user.name || 'U').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[14px] font-black text-slate-800 dark:text-neutral-200 leading-none mb-1.5">{user.name}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-bold">{user.email}</p>
                                </div>
                                </div>
                            </td>
                            <td className="py-7 px-6">
                                <div className="flex flex-wrap gap-2 justify-center">
                                {user.roles.map((r) => (
                                    <span key={r.id} className="px-4 py-1.5 bg-white dark:bg-neutral-900/50 text-slate-500 dark:text-neutral-400 text-[9px] font-black rounded-full border border-slate-100 dark:border-neutral-800 flex items-center gap-2 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                        {r.name}
                                    </span>
                                ))}
                                </div>
                            </td>
                            <td className="py-7 px-6 text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-neutral-900/50 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-50 dark:border-emerald-900/20 shadow-sm">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                   Activo
                                </span>
                            </td>
                            <td className="py-7 px-6 text-center text-[11px] font-black text-slate-400 dark:text-neutral-500">
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 text-slate-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="py-7 px-10">
                                <div className="flex justify-end gap-3 text-slate-300 dark:text-neutral-600">
                                <button onClick={() => openUserModal(user)} className="p-3 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] rounded-2xl transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 rounded-2xl transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
      )}

      {/* Content for "Empresa" */}
      {activeTab === 'empresa' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Datos de la Empresa</h3>
              <div className="bg-white dark:bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-slate-200 dark:border-neutral-800 shadow-2xl shadow-slate-200/40 dark:shadow-none max-w-2xl transition-colors duration-300">
                  <form onSubmit={handleUpdateCompany} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">Nombre Comercial</label>
                              <input 
                                value={company.name}
                                onChange={e => setCompany({...company, name: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[var(--accent)] text-slate-700 dark:text-neutral-200 font-bold transition-all outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">Moneda (Símbolo)</label>
                              <input 
                                value={company.currency}
                                onChange={e => setCompany({...company, currency: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[var(--accent)] text-slate-700 dark:text-neutral-200 font-bold transition-all outline-none"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">Pie de Página (PDF)</label>
                          <textarea 
                            rows={3}
                            value={company.document_footer}
                            onChange={e => setCompany({...company, document_footer: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[var(--accent)] text-slate-700 dark:text-neutral-200 font-bold transition-all outline-none resize-none"
                          />
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="bg-[var(--accent)] text-white px-10 py-4 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[var(--accent-shadow)] hover:bg-[var(--accent-hover)] active:scale-95 transition-all">
                            Guardar Cambios
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      {/* Content for "Roles" */}
      {activeTab === 'roles' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Roles y Permisos</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Define qué acciones puede realizar cada grupo de usuarios.</p>
                </div>
                <button className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[var(--accent-shadow)] transition-all flex items-center gap-2 active:scale-95">
                    <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Nuevo Rol
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[var(--accent-soft)] text-[var(--accent)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-[var(--accent-soft)] rounded-lg text-slate-400 hover:text-[var(--accent)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                            </div>
                        </div>
                        <h4 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">{role.name}</h4>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 leading-relaxed font-medium">{role.description || 'Este rol define un nivel de acceso específico dentro del sistema.'}</p>
                        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Configuración</span>
                            <button className="text-[10px] font-black text-[var(--accent)] hover:text-[var(--accent-hover)] tracking-widest uppercase py-1 px-3 bg-[var(--accent-soft)] rounded-lg transition-colors">Permisos</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Content for "Apariencia" */}
      {activeTab === 'apariencia' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Personalización Visual</h3>
            <div className="bg-white dark:bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-slate-100 dark:border-neutral-800 shadow-2xl shadow-slate-200/40 dark:shadow-none max-w-2xl">
                <div className="flex items-center justify-between p-6 bg-slate-100/50 dark:bg-neutral-800/30 rounded-[1.5rem] border border-slate-200 dark:border-neutral-700/50 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${darkMode ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-inner' : 'bg-amber-50 text-amber-500 shadow-sm'}`}>
                            {darkMode ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                        </div>
                        <div>
                            <p className="font-black text-slate-800 dark:text-white text-base">Modo Oscuro</p>
                            <p className="text-xs text-slate-400 dark:text-neutral-500 font-bold mt-0.5">Alterna entre tema claro y oscuro.</p>
                        </div>
                    </div>
                    <button 
                        onClick={onToggleDarkMode}
                        className={`w-16 h-8 rounded-full relative transition-all duration-500 outline-none ${darkMode ? 'bg-[var(--accent)] shadow-lg shadow-[var(--accent-shadow)]' : 'bg-slate-300 shadow-inner'}`}
                    >
                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 ${darkMode ? 'translate-x-8' : ''}`} />
                    </button>
                </div>

                <div className="mt-10 p-6 bg-slate-100/50 dark:bg-neutral-800/30 rounded-[1.5rem] border border-slate-200 dark:border-neutral-700/50 transition-colors shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4">Color de Acento</p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => onAccentColorChange('blue')}
                            className={`w-10 h-10 rounded-xl bg-blue-600 transition-all active:scale-95 ${accentColor === 'blue' ? 'border-4 border-white dark:border-neutral-800 shadow-lg scale-110' : 'border-2 border-transparent opacity-60 hover:opacity-100'}`} 
                        />
                        <button 
                            onClick={() => onAccentColorChange('green')}
                            className={`w-10 h-10 rounded-xl bg-green-600 transition-all active:scale-95 ${accentColor === 'green' ? 'border-4 border-white dark:border-neutral-800 shadow-lg scale-110' : 'border-2 border-transparent opacity-60 hover:opacity-100'}`} 
                        />
                        <button 
                            onClick={() => onAccentColorChange('orange')}
                            className={`w-10 h-10 rounded-xl bg-orange-600 transition-all active:scale-95 ${accentColor === 'orange' ? 'border-4 border-white dark:border-neutral-800 shadow-lg scale-110' : 'border-2 border-transparent opacity-60 hover:opacity-100'}`} 
                        />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Modal Usuario */}
      {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  <form onSubmit={handleSubmitUser} className="p-8">
                      <h4 className="text-xl font-black text-slate-800 dark:text-white mb-6">
                          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                      </h4>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre</label>
                              <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--accent)]"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                              <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--accent)]"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contraseña {selectedUser && '(Opcional)'}</label>
                              <input 
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--accent)]"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Roles (Multiselección)</label>
                              <div className="flex flex-wrap gap-2">
                                  {roles.map(role => (
                                      <button
                                        type="button"
                                        key={role.id}
                                        onClick={() => {
                                            const current = formData.roles;
                                            if (current.includes(role.id)) {
                                                setFormData({...formData, roles: current.filter(id => id !== role.id)});
                                            } else {
                                                setFormData({...formData, roles: [...current, role.id]});
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                            formData.roles.includes(role.id)
                                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-md'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                                        }`}
                                      >
                                          {role.name}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                      <div className="mt-8 flex gap-3">
                          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">Cancelar</button>
                          <button type="submit" className="flex-1 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-xl shadow-lg shadow-[var(--accent-shadow)] hover:bg-[var(--accent-hover)] active:scale-95 transition-all">Guardar Cambios</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
