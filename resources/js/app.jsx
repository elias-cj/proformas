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
import UserManagement from './components/UserManagement';

const RootApp = () => {
    const [currentView, setCurrentView] = React.useState(() => {
        return localStorage.getItem('currentView') || 'dashboard';
    });
    const [darkMode, setDarkMode] = React.useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [accentColor, setAccentColor] = React.useState(() => {
        return localStorage.getItem('accent-color') || 'blue';
    });

    React.useEffect(() => {
        localStorage.setItem('currentView', currentView);
    }, [currentView]);

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    React.useEffect(() => {
        document.documentElement.setAttribute('data-accent', accentColor);
        localStorage.setItem('accent-color', accentColor);
    }, [accentColor]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <AppLayout 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
        >
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
            {currentView === 'usuarios' && (
                <UserManagement 
                    darkMode={darkMode} 
                    onToggleDarkMode={toggleDarkMode} 
                    accentColor={accentColor}
                    onAccentColorChange={setAccentColor}
                />
            )}
        </AppLayout>
    );
};

const rootElement = document.getElementById('proforma-editor');
if (rootElement) {
    if (!window._reactRoot) {
        window._reactRoot = createRoot(rootElement);
    }
    window._reactRoot.render(<RootApp />);
}
