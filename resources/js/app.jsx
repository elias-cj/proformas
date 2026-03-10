import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ProformaEditor from './components/ProformaEditor';

const rootElement = document.getElementById('proforma-editor');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<ProformaEditor />);
}
