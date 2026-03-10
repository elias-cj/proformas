import React, { useState, useEffect } from 'react';

const WorkOrdersView = ({ userId, userRole }) => {
    const [workOrders, setWorkOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // En un entorno real, la API filtraría por técnico si el rol es 'Técnico'
        fetch('/api/work-orders')
            .then(res => res.json())
            .then(data => {
                // Filtro básico en frontend para demostración
                let filteredData = data;
                if (userRole === 'técnico') {
                    filteredData = data.filter(wo => wo.technician?.user_id === userId);
                }
                setWorkOrders(filteredData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId, userRole]);

    const handleStatusChange = async (woId, newStatus) => {
        try {
            const res = await fetch(`/api/work-orders/${woId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, note: 'Cambio desde UI' })
            });
            
            if (res.ok) {
                const updatedWo = await res.json();
                setWorkOrders(workOrders.map(wo => wo.id === woId ? updatedWo : wo));
            } else {
                const data = await res.json();
                alert(data.message || 'Error al actualizar estado');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'en_espera': 'bg-yellow-100 text-yellow-800',
            'en_ejecucion': 'bg-blue-100 text-blue-800',
            'listo': 'bg-green-100 text-green-800',
        };
        const colorClass = colors[status] || 'bg-gray-100 text-gray-800';
        
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Panel Operativo: Órdenes de Trabajo</h2>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="all">Todos los estados</option>
                    <option value="en_espera">En Espera</option>
                    <option value="en_ejecucion">En Ejecución</option>
                    <option value="listo">Listos</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4">Cargando órdenes...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OT Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente / Proforma</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico Asignado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {workOrders
                                .filter(wo => filterStatus === 'all' || wo.status === filterStatus)
                                .map(wo => (
                                <tr key={wo.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{wo.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Proforma #{wo.proforma?.number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {wo.technician ? `Tech ID: ${wo.technician.id}` : <span className="text-red-500 font-semibold">Sin asignar</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={wo.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        
                                        {(userRole === 'operador' || userRole === 'admin') && wo.status === 'en_espera' && !wo.technician && (
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                Asignar Técnico
                                            </button>
                                        )}

                                        {wo.status === 'en_espera' && (
                                            <button 
                                                onClick={() => handleStatusChange(wo.id, 'en_ejecucion')}
                                                className="text-blue-600 hover:text-blue-900 mr-3">
                                                Iniciar
                                            </button>
                                        )}
                                        
                                        {wo.status === 'en_ejecucion' && (
                                            <button 
                                                onClick={() => handleStatusChange(wo.id, 'listo')}
                                                className="text-green-600 hover:text-green-900">
                                                Finalizar (Req. Justif)
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {workOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No se encontraron órdenes de trabajo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WorkOrdersView;
