import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

/**
 * ProformaEditor - Premium Edition
 * Features: Glassmorphism, Dynamic Gradients, Interactive Rows, Live Math, Custom Letterhead.
 */
const ProformaEditor = () => {
    const [paperSize, setPaperSize] = useState("A4");
    const [margins, setMargins] = useState({ top: 5.0, bottom: 5.0, left: 2.0, right: 2.0 });
    const [globalFont, setGlobalFont] = useState("Inter");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [customerDoc, setCustomerDoc] = useState("");
    const [focusedElement, setFocusedElement] = useState(null); // { id, type }

    // Initial empty row
    const emptyRow = () => ({
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        quantity: "",
        unit_price: "",
        total: 0,
        style: {
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            align: "left",
            fontSize: "14px",
            font: globalFont, // Usa la global como base inicial
            color: "#1e293b",
            lineHeight: "1.5"
        }
    });
    const [details, setDetails] = useState([emptyRow()]);

    // Fetch templates
    useEffect(() => {
        axios.get("/api/templates")
            .then((res) => setTemplates(res.data))
            .catch((err) => console.error("Error loading templates", err));
    }, []);

    // Derived totals
    const subtotal = useMemo(() => {
        return details.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    }, [details]);

    const total = useMemo(() => {
        return Math.max(0, subtotal - parseFloat(discount || 0));
    }, [subtotal, discount]);

    const handleTemplateChange = (tplId) => {
        setSelectedTemplate(tplId);
        if (tplId) {
            const tpl = templates.find((t) => t.id == tplId || t.name == tplId);
            if (tpl && tpl.file_path) {
                const cleanPath = tpl.file_path.startsWith('/') ? tpl.file_path : `/${tpl.file_path}`;
                setBackgroundUrl(`/storage${cleanPath}`);
            }
        } else {
            setBackgroundUrl("");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewFile(file);
    };

    const applyMembrete = async () => {
        if (!previewFile) {
            alert("Por favor, selecciona un archivo primero.");
            return;
        }

        const formData = new FormData();
        formData.append("file", previewFile);
        formData.append("name", previewFile.name);

        try {
            const res = await axios.post("/api/membrete", formData);
            if (res.data.path) {
                const cleanPath = res.data.path.startsWith('/') ? res.data.path : `/${res.data.path}`;
                setBackgroundUrl(`/storage${cleanPath}`);
                alert("✅ Membrete aplicado correctamente.");
            }
        } catch (error) {
            console.error("Upload failed", error);
            const errorMsg = error.response?.data?.messages 
                ? Object.values(error.response.data.messages).flat().join("\n")
                : "Error desconocido al subir el archivo.";
            alert(`❌ Error al subir el membrete:\n${errorMsg}`);
        }
    };

    const handleDetailChange = (id, field, value) => {
        const newDetails = details.map((row) => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field === "quantity" || field === "unit_price") {
                    const q = parseFloat(updatedRow.quantity) || 0;
                    const p = parseFloat(updatedRow.unit_price) || 0;
                    updatedRow.total = (q * p).toFixed(2);
                }
                return updatedRow;
            }
            return row;
        });

        // Auto add row logic
        const lastRow = newDetails[newDetails.length - 1];
        if (lastRow.description.trim() !== "" && lastRow.id === id) {
            newDetails.push(emptyRow());
        }

        setDetails(newDetails);
    };

    const removeRow = (id) => {
        if (details.length > 1) {
            setDetails(details.filter((r) => r.id !== id));
        }
    };

    const paperStyle = {
        width: paperSize === "A4" ? "210mm" : "8.5in",
        minHeight: paperSize === "A4" ? "297mm" : "11in",
        backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : "none",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: `'${globalFont}', sans-serif`,
    };

    const updateItemStyle = (id, styleKey, value) => {
        setDetails(details.map(row => {
            if (row.id === id) {
                // Aseguramos que el objeto style exista para filas viejas
                const currentStyle = row.style || emptyRow().style;
                return { ...row, style: { ...currentStyle, [styleKey]: value } };
            }
            return row;
        }));
    };

    const FloatingToolbar = () => {
        if (!focusedElement) return null;
        const row = details.find(r => r.id === focusedElement.id);
        if (!row) return null;

        return (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-4 duration-500">
                <select 
                    value={row.style.fontSize} 
                    onChange={e => updateItemStyle(row.id, 'fontSize', e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer"
                >
                    {['10px', '12px', '14px', '16px', '18px', '20px'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <select 
                    value={row.style?.font || globalFont} 
                    onChange={e => updateItemStyle(row.id, 'font', e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer max-w-[120px] overflow-hidden text-ellipsis"
                    style={{ fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : 'inherit' }}
                >
                    {[
                        'Arial', 'Arial Black', 'Times New Roman',
                        'Inter', 'Montserrat', 'Roboto', 'Open Sans', 'Poppins', 
                        'Playfair Display', 'Lora', 'Oswald', 
                        'Dancing Script', 'Pacifico'
                    ].map(f => (
                        <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>
                    ))}
                </select>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button onClick={() => updateItemStyle(row.id, 'bold', !row.style.bold)} className={`p-2 rounded-lg transition-all ${row.style.bold ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}><b>B</b></button>
                <button onClick={() => updateItemStyle(row.id, 'italic', !row.style.italic)} className={`p-2 rounded-lg transition-all ${row.style.italic ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}><i>I</i></button>
                <button onClick={() => updateItemStyle(row.id, 'underline', !row.style.underline)} className={`p-2 rounded-lg transition-all ${row.style.underline ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}><u>U</u></button>
                <button onClick={() => updateItemStyle(row.id, 'strike', !row.style.strike)} className={`p-2 rounded-lg transition-all ${row.style.strike ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}><s>S</s></button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button onClick={() => updateItemStyle(row.id, 'align', 'left')} className={`p-2 rounded-lg ${row.style.align === 'left' ? 'bg-indigo-100' : ''}`}>⇤</button>
                <button onClick={() => updateItemStyle(row.id, 'align', 'center')} className={`p-2 rounded-lg ${row.style.align === 'center' ? 'bg-indigo-100' : ''}`}>↔</button>
                <button onClick={() => updateItemStyle(row.id, 'align', 'right')} className={`p-2 rounded-lg ${row.style.align === 'right' ? 'bg-indigo-100' : ''}`}>⇥</button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <select 
                    value={row.style.lineHeight} 
                    onChange={e => updateItemStyle(row.id, 'lineHeight', e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer"
                >
                    {['1.0', '1.2', '1.5', '2.0'].map(lh => <option key={lh} value={lh}>{lh}</option>)}
                </select>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <input type="color" value={row.style.color} onChange={e => updateItemStyle(row.id, 'color', e.target.value)} className="w-6 h-6 border-none bg-transparent cursor-pointer rounded-full overflow-hidden" />
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 p-4 lg:p-8 gap-8">
            {/* Canva Style Toolbar */}
            <FloatingToolbar />

            {/* Control Panel (Glassmorphism) */}
            <aside className="w-full lg:w-96 flex flex-col gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] p-8 sticky top-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Diseño Premium
                    </h2>

                    <div className="space-y-5">
                        <section>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Formato</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                {["A4", "Carta"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPaperSize(size === "Carta" ? "Letter" : "A4")}
                                        className={`py-2 text-sm font-bold rounded-lg transition-all ${
                                            (paperSize === "A4" && size === "A4") || (paperSize === "Letter" && size === "Carta")
                                                ? "bg-white text-indigo-600 shadow-sm scale-[1.02]"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Membrete</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="">Original (Limpio)</option>
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <div className="mt-3 space-y-3">
                                <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all active:scale-[0.98] bg-white group">
                                    <span className={`text-[10px] font-black tracking-widest uppercase text-center px-4 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${previewFile ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                        {previewFile ? `✅ SELECCIONADO: ${previewFile.name}` : "👉 CLIC AQUÍ PARA SELECCIONAR"}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>

                                <button 
                                    onClick={applyMembrete}
                                    disabled={!previewFile}
                                    className={`w-full text-[11px] font-black py-4 rounded-xl transition-all shadow-xl active:scale-95 ${
                                        previewFile 
                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 cursor-pointer" 
                                        : "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed border border-gray-200"
                                    }`}
                                >
                                    APLICAR COMO MEMBRETE
                                </button>
                            </div>
                        </section>

                        <section className="bg-white/50 rounded-2xl p-5 border border-white/50">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Márgenes y Diseño</label>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Superior (cm)</label>
                                    <input 
                                        type="number" step="0.1" min="0" max="15" 
                                        value={margins.top === 0 ? "" : margins.top} 
                                        onChange={e => setMargins({...margins, top: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
                                        placeholder="0"
                                        className="w-full bg-white border-none rounded-lg py-1 px-2 text-[11px] font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 hover:bg-gray-50 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Inferior (cm)</label>
                                    <input 
                                        type="number" step="0.1" min="0" max="15" 
                                        value={margins.bottom === 0 ? "" : margins.bottom} 
                                        onChange={e => setMargins({...margins, bottom: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
                                        placeholder="0"
                                        className="w-full bg-white border-none rounded-lg py-1 px-2 text-[11px] font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 hover:bg-gray-50 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Izquierdo (cm)</label>
                                    <input 
                                        type="number" step="0.1" min="0" max="10" 
                                        value={margins.left === 0 ? "" : margins.left} 
                                        onChange={e => setMargins({...margins, left: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
                                        placeholder="0"
                                        className="w-full bg-white border-none rounded-lg py-1 px-2 text-[11px] font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 hover:bg-gray-50 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Derecho (cm)</label>
                                    <input 
                                        type="number" step="0.1" min="0" max="10" 
                                        value={margins.right === 0 ? "" : margins.right} 
                                        onChange={e => setMargins({...margins, right: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
                                        placeholder="0"
                                        className="w-full bg-white border-none rounded-lg py-1 px-2 text-[11px] font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 hover:bg-gray-50 transition-colors" 
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-[10px] text-gray-400 font-medium italic">Selecciona un elemento para cambiar su fuente individualmente.</p>
                            </div>
                        </section>

                        <section className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
                            <h3 className="text-sm font-bold text-indigo-900 mb-4">Métricas Financieras</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-600/70 font-medium">Subtotal</span>
                                    <span className="text-indigo-900 font-bold">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-indigo-600/70 font-medium">Descuento</span>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className="w-20 bg-white border-indigo-200 rounded-lg text-right py-1 px-2 text-indigo-900 font-bold focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="h-px bg-indigo-200/50 my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase text-indigo-400">Total Final</span>
                                    <span className="text-3xl font-black text-indigo-600">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <span>REGISTRAR PROFORMA</span>
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                <span>IMPRIMIR</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Canvas Area */}
            <main className="flex-1 overflow-visible flex justify-center py-10 px-4">
                <div 
                    style={paperStyle}
                    className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden relative transition-all duration-700 hover:shadow-[0_60px_150px_rgba(0,0,0,0.2)] rotate-0 hover:-rotate-[0.1deg]"
                >
                    {/* Glass Overlay Contenido */}
                    <div 
                        className="relative z-10 w-full min-h-full flex flex-col"
                        style={{ 
                            paddingTop: `${margins.top}cm`, 
                            paddingBottom: `${margins.bottom}cm`, 
                            paddingLeft: `${margins.left}cm`, 
                            paddingRight: `${margins.right}cm` 
                        }}
                    >
                        {/* Header Info */}
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase block mb-2">Documento No Vinculante</span>
                                <h1 className="text-6xl font-black text-slate-800 leading-none tracking-tighter">COTIZACIÓN</h1>
                                <p className="text-xs text-slate-400 mt-2 font-medium tracking-widest">EXP 2026 / AUTO-GENERATED</p>
                            </div>
                            <div className="text-right flex flex-col gap-1">
                                <input 
                                    className="text-xl font-black text-slate-800 text-right bg-transparent border-none placeholder:text-slate-300 focus:ring-0 w-full" 
                                    placeholder="NOMBRE DEL CLIENTE"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                />
                                <input 
                                    className="text-xs font-bold text-slate-400 text-right bg-transparent border-none placeholder:text-slate-300 focus:ring-0 uppercase tracking-widest" 
                                    placeholder="NIT / DNI"
                                    value={customerDoc}
                                    onChange={e => setCustomerDoc(e.target.value)}
                                />
                                <div className="mt-4 text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block self-end">FECHA: {new Date().toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="flex-1">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b-2 border-slate-100">
                                        <th className="pb-4 text-center w-12">#</th>
                                        <th className="pb-4 text-left">Concepto del Servicio/Producto</th>
                                        <th className="pb-4 text-right w-24">Unitario</th>
                                        <th className="pb-4 text-right w-24">Cant.</th>
                                        <th className="pb-4 text-right w-32">Total Linea</th>
                                        <th className="pb-4 w-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {details.map((row, idx) => (
                                        <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 text-center text-[10px] font-black text-slate-300">{idx + 1}</td>
                                            <td className="py-5">
                                                <input 
                                                    className="w-full bg-transparent border-none focus:ring-0 px-0 placeholder:text-slate-300 placeholder:italic transition-all"
                                                    style={{
                                                        fontWeight: row.style?.bold ? '900' : 'bold',
                                                        fontStyle: row.style?.italic ? 'italic' : 'normal',
                                                        textDecoration: `${row.style?.underline ? 'underline' : ''} ${row.style?.strike ? 'line-through' : ''}`.trim(),
                                                        textAlign: row.style?.align || 'left',
                                                        fontSize: row.style?.fontSize || '14px',
                                                        fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                        color: row.style?.color || '#1e293b',
                                                        lineHeight: row.style?.lineHeight || '1.5'
                                                    }}
                                                    placeholder="Ej. Mantenimiento preventivo de motores..."
                                                    value={row.description}
                                                    onFocus={() => setFocusedElement({ id: row.id, type: 'item' })}
                                                    onChange={e => handleDetailChange(row.id, "description", e.target.value)}
                                                />
                                            </td>
                                            <td className="py-5">
                                                <input 
                                                    type="number"
                                                    className="w-full bg-transparent border-none text-right text-slate-700 font-bold focus:ring-0 px-0"
                                                    value={row.unit_price}
                                                    onChange={e => handleDetailChange(row.id, "unit_price", e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-5 text-right font-black text-lg text-indigo-500">
                                                <input 
                                                    type="number"
                                                    className="w-full bg-transparent border-none text-right font-black text-slate-700 focus:ring-0 px-0"
                                                    value={row.quantity}
                                                    onChange={e => handleDetailChange(row.id, "quantity", e.target.value)}
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="py-5 text-right font-black text-slate-800">
                                                ${parseFloat(row.total || 0).toLocaleString()}
                                            </td>
                                            <td className="py-5 text-right">
                                                {details.length > 1 && (
                                                    <button onClick={() => removeRow(row.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all scale-125">×</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Totals */}
                        <footer className="mt-20 flex justify-between items-start pt-10 border-t-4 border-slate-900">
                            <div className="max-w-96 text-[10px] font-bold text-slate-400 italic">
                                * Esta cotización tiene una validez de 15 días calendario. Precios incluyen impuestos de ley. Favor de confirmar su aceptación mediante este mismo canal.
                            </div>
                            <div className="flex flex-col gap-2 min-w-64">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-black text-slate-400">SUBTOTAL</span>
                                    <span className="text-xl font-black text-slate-800">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-black text-slate-400">TOTAL NETO</span>
                                    <span className="text-5xl font-black text-indigo-600 tracking-tighter">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProformaEditor;
