import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import ProformaList from './components/ProformaList';
import ProformaEditor from './components/ProformaEditor';
import CustomerList from './components/CustomerList';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import ServiceList from './components/ServiceList';
import OrderList from './components/OrderList';
import TechnicianList from './components/TechnicianList';

const RootApp = () => {
    const [currentView, setCurrentView] = React.useState('dashboard');
    
    return (
        <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'proformas' && (
                <ProformaList onNavigateToEditor={() => setCurrentView('editor')} />
            )}
            {currentView === 'editor' && (
                <ProformaEditor onBack={() => setCurrentView('proformas')} />
            )}
            {currentView === 'clientes' && <CustomerList />}
            {currentView === 'categorías' && <CategoryList />}
            {currentView === 'productos' && <ProductList />}
            {currentView === 'servicios' && <ServiceList />}
            {currentView === 'historial y asignar' && <OrderList />}
            {currentView === 'técnicos' && <TechnicianList />}
        </AppLayout>
    );
};

const rootElement = document.getElementById('proforma-editor');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<RootApp />);
}
