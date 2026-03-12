import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

// Helper para convertir números a letras (Lógica completa para Bolivianos/Dólares)
const numeroALetras = (num) => {
    if (!num || num === 0) return "CERO CON 00/100";
    
    const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    const convertirSeccion = (n) => {
        let output = "";
        if (n === 100) return "CIEN ";
        if (n > 99) {
            output += centenas[Math.floor(n / 100)] + " ";
            n %= 100;
        }
        if (n >= 10 && n <= 19) {
            output += especiales[n - 10] + " ";
        } else {
            if (n >= 20) {
                output += decenas[Math.floor(n / 10)] + (n % 10 !== 0 ? " Y " : " ");
                n %= 10;
            }
            output += unidades[n] + " ";
        }
        return output;
    };

    let entero = Math.floor(num);
    let decimales = Math.round((num - entero) * 100);
    let letras = "";

    if (entero === 0) {
        letras = "CERO";
    } else {
        if (entero >= 1000) {
            let miles = Math.floor(entero / 1000);
            letras += (miles === 1 ? "UN " : convertirSeccion(miles)) + "MIL ";
            entero %= 1000;
        }
        letras += convertirSeccion(entero);
    }

    return `SON: ${letras.trim()} CON ${decimales.toString().padStart(2, '0')}/100`;
};

// Inyección de fuentes para máxima nitidez y calidad visual
const loadGoogleFonts = () => {
    if (!document.getElementById('google-fonts-editor')) {
        const link = document.createElement('link');
        link.id = 'google-fonts-editor';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;700;900&family=Roboto:wght@400;700;900&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Lora:wght@400;700&family=Oswald:wght@400;700&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap';
        document.head.appendChild(link);
    }
};

/**
 * ProformaEditor - Premium Edition
 * Features: Glassmorphism, Dynamic Gradients, Interactive Rows, Live Math, Custom Letterhead.
 */
const ProformaEditor = ({ onBack }) => {
    const [paperSize, setPaperSize] = useState("A4");
    const [margins, setMargins] = useState({ top: 5.0, bottom: 3.0, left: 2.0, right: 2.0 });
    const [globalFont, setGlobalFont] = useState("Inter");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [backgroundUrl, setBackgroundUrl] = useState(localStorage.getItem("proforma_background") || "");
    const [previewFile, setPreviewFile] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [customerDoc, setCustomerDoc] = useState("");
    const [advisorName, setAdvisorName] = useState("");
    const [advisorPhone, setAdvisorPhone] = useState("");
    const [focusedElement, setFocusedElement] = useState(null);
    const [lastFocusedId, setLastFocusedId] = useState(null); // { id, type }
    const fileInputRef = useRef(null);

    // Estados para redimensionamiento personalizado
    const [colWidths, setColWidths] = useState({
        item: 35,
        description: 287,
        marca: 100,
        quantity: 55,
        price: 80,
        total: 85
    });
    const [manualRowHeights, setManualRowHeights] = useState({}); // id -> height manual
    const [autoRowHeights, setAutoRowHeights] = useState({});   // id -> height auto (según contenido)

    const addRow = () => {
        const lastRow = details[details.length - 1];
        setDetails([...details, emptyRow(lastRow?.style)]);
    };

    const removeRow = (id) => {
        if (details.length > 1) {
            setDetails(details.filter((r) => r.id !== id));
        }
    };

    // Initial empty row with style inheritance
    const emptyRow = (prevStyle = null) => ({
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        marca: "",
        quantity: "",
        unit_price: "",
        total: 0,
        style: prevStyle ? { ...prevStyle } : {
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            align: "left",
            fontSize: "12px",
            font: globalFont,
            color: "#1e293b",
            lineHeight: "1.2"
        }
    });
    const [details, setDetails] = useState([emptyRow()]);

    // Fetch templates
    useEffect(() => {
        loadGoogleFonts();
        axios.get("/api/templates")
            .then((res) => setTemplates(res.data))
            .catch((err) => console.error("Error loading templates", err));
    }, []);

    // Persist backgroundUrl
    useEffect(() => {
        if (backgroundUrl) {
            localStorage.setItem("proforma_background", backgroundUrl);
        } else {
            localStorage.removeItem("proforma_background");
        }
    }, [backgroundUrl]);

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

        // Auto add row logic with style inheritance
        const lastRow = newDetails[newDetails.length - 1];
        if (lastRow.description.trim() !== "" && lastRow.id === id) {
            newDetails.push(emptyRow(lastRow.style));
        }

        setDetails(newDetails);
    };

    // Lógica de redimensionamiento manual (Drag & Resize)
    const handleMouseDownCol = (e, col) => {
        const startX = e.pageX;
        const startWidth = colWidths[col];
        
        const onMouseMove = (moveEvent) => {
            const newWidth = Math.max(30, startWidth + (moveEvent.pageX - startX));
            setColWidths(prev => ({ ...prev, [col]: newWidth }));
        };
        
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleMouseDownRow = (e, rowId) => {
        const startY = e.pageY;
        const startHeight = manualRowHeights[rowId] || autoRowHeights[rowId] || 32;
        
        const onMouseMove = (moveEvent) => {
            const newHeight = Math.max(20, startHeight + (moveEvent.pageY - startY));
            setManualRowHeights(prev => ({ ...prev, [rowId]: newHeight }));
        };
        
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };



    const paperStyle = {
        width: paperSize === "A4" ? "210mm" : "8.5in",
        minHeight: paperSize === "A4" ? "297mm" : "11in",
        backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : "none",
        backgroundSize: paperSize === "A4" ? "210mm 297mm" : "8.5in 11in",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat", // Cambiado a no-repeat porque cada hoja tendrá su fondo
        fontFamily: `'${globalFont}', sans-serif`,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        imageRendering: "-webkit-optimize-contrast"
    };

    const updateItemStyle = (id, styleKey, value) => {
        setDetails(details.map(row => {
            if (row.id === id) {
                const currentStyle = row.style || emptyRow().style;
                return { ...row, style: { ...currentStyle, [styleKey]: value } };
            }
            return row;
        }));
    };

    // Lógica de Paginación Dinámica (Sensible al alto de fila)
    const pages = useMemo(() => {
        const result = [];
        let currentPageRows = [];
        let currentHeight = 0;
        
        // Constantes de diseño (en píxeles a 96 DPI)
        const A4_HEIGHT = 1123; // 297mm
        const CM_TO_PX = 37.8;
        const HEADER_ESTIMATED = 120; // Espacio real ocupado por Advisor/Fecha
        const LOGO_RESERVE = 34;      // Subido 1cm más (era 72)
        const TABLE_HEADER = 35;
        const FOOTER_TOTAL = 80;      
        const TERMS_BOX = 300; 
        const SAFETY_BUFFER = 60;     // Aumentado: margen de seguridad extra

        const marginV = (margins.top + margins.bottom + 3.0) * CM_TO_PX;
        const firstPageLimit = A4_HEIGHT - marginV - HEADER_ESTIMATED - TABLE_HEADER - SAFETY_BUFFER;
        const otherPageLimit = A4_HEIGHT - marginV - LOGO_RESERVE - TABLE_HEADER - SAFETY_BUFFER;

        details.forEach((row, index) => {
            const h = Math.max(32, manualRowHeights[row.id] || 0, autoRowHeights[row.id] || 0);
            const isFirstPage = result.length === 0;
            const limit = isFirstPage ? firstPageLimit : otherPageLimit;
            
            const isLastTotalRow = index === details.length - 1;
            // Si es el último ítem, comprobamos si cabe él Y el Total
            const spaceNeeded = isLastTotalRow ? (h + FOOTER_TOTAL) : h;

            const isSecondPage = result.length === 1;
            const shouldJumpP1ByCount = isFirstPage && index === 13; 
            const shouldJumpP2ByCount = isSecondPage && index === 32;
            
            // Reglas estrictas por conteo para las primeras dos hojas
            let jump = false;
            if (isFirstPage) {
                jump = shouldJumpP1ByCount;
            } else if (isSecondPage) {
                jump = shouldJumpP2ByCount;
            } else {
                jump = currentHeight + spaceNeeded > limit;
            }

            if (jump && currentPageRows.length > 0) {
                result.push(currentPageRows);
                currentPageRows = [row];
                currentHeight = h;
            } else {
                currentPageRows.push(row);
                currentHeight += h;
            }
        });

        if (currentPageRows.length > 0) {
            result.push(currentPageRows);
            
            // INDEPENDIENTE: ¿Caben los términos en lo que queda de la última hoja? O ¿Han pasado el ítem 7?
            const isFirst = result.length === 1;
            const hasSevenOrMore = details.length >= 7;
            const limit = isFirst ? firstPageLimit : otherPageLimit;
            
            if (isFirst) {
                if (hasSevenOrMore) {
                    // REGLA: A partir del ítem 7, los términos saltan automáticamente
                    result.push([]);
                }
                // Ignoramos el espacio físico en la Pág 1 para evitar saltos prematuros al ítem 4
            } else if (result.length === 2 && details.length < 27) {
                // REGLA PÁG 2: No saltar términos hasta el ítem 27 (ignorar espacio físico)
            } else if (currentHeight + FOOTER_TOTAL + TERMS_BOX > limit) {
                // Salto por espacio físico en hojas subsecuentes
                result.push([]);
            }
        }
        
        if (result.length === 0) result.push([]);
        return result;
    }, [details, manualRowHeights, autoRowHeights, margins, paperSize]);

    const FloatingToolbar = () => {
        const activeId = focusedElement?.id || lastFocusedId;
        const row = details.find(r => r.id === activeId);
        const isInactive = !row;

        return (
            <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white/90 backdrop-blur-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl p-3 flex items-center gap-2 transition-all duration-500 ${isInactive ? 'opacity-50 grayscale pointer-events-none scale-95' : 'opacity-100'}`}>
                {!isInactive ? (
                    <>
                        <div className="flex items-center bg-gray-50 rounded-xl px-2 py-1 border border-gray-100 gap-2">
                            <input 
                                type="number" 
                                min="1" 
                                max="100"
                                value={parseInt(row.style?.fontSize) || 12} 
                                onChange={e => updateItemStyle(row.id, 'fontSize', `${e.target.value}px`)}
                                className="bg-transparent border-none text-[12px] font-bold focus:ring-0 w-8 p-0 text-center"
                                title="Tamaño manual"
                            />
                            <select 
                                value={row.style?.fontSize} 
                                onChange={e => updateItemStyle(row.id, 'fontSize', e.target.value)}
                                className="bg-transparent border-none text-[11px] font-bold focus:ring-0 cursor-pointer p-0 w-5 text-gray-500"
                                title="Tamaños predefinidos"
                            >
                                <option value="" hidden></option>
                                {['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'].map(s => (
                                    <option key={s} value={s} className="text-slate-900">{s.replace('px', '')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <select 
                            value={row.style?.font || globalFont} 
                            onChange={e => updateItemStyle(row.id, 'font', e.target.value)}
                            className="bg-transparent border-none text-[12px] font-bold focus:ring-0 cursor-pointer max-w-[140px] overflow-hidden text-ellipsis px-2"
                            style={{ fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : 'inherit' }}
                        >
                            {[
                                'Arial', 'Arial Black', 'Trebuchet MS', 'Times New Roman',
                                'Inter', 'Montserrat', 'Roboto', 'Open Sans', 'Poppins', 
                                'Playfair Display', 'Lora', 'Oswald', 
                                'Dancing Script', 'Pacifico'
                            ].map(f => (
                                <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>
                            ))}
                        </select>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <button onClick={() => updateItemStyle(row.id, 'bold', !row.style?.bold)} className={`p-2.5 rounded-xl transition-all ${row.style?.bold ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Negrita"><b className="text-[14px]">B</b></button>
                        <button onClick={() => updateItemStyle(row.id, 'italic', !row.style?.italic)} className={`p-2.5 rounded-xl transition-all ${row.style?.italic ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Cursiva"><i className="text-[14px]">I</i></button>
                        <button onClick={() => updateItemStyle(row.id, 'underline', !row.style?.underline)} className={`p-2.5 rounded-xl transition-all ${row.style?.underline ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Subrayado"><u className="text-[14px]">U</u></button>
                        <button onClick={() => updateItemStyle(row.id, 'strike', !row.style?.strike)} className={`p-2.5 rounded-xl transition-all ${row.style?.strike ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Tachado"><s className="text-[14px]">S</s></button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <button onClick={() => updateItemStyle(row.id, 'align', 'left')} className={`p-2 rounded-xl transition-all ${row.style?.align === 'left' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Alinear a la izquierda">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" /></svg>
                        </button>
                        <button onClick={() => updateItemStyle(row.id, 'align', 'center')} className={`p-2 rounded-xl transition-all ${row.style?.align === 'center' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Centrar">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M4 18h16" /></svg>
                        </button>
                        <button onClick={() => updateItemStyle(row.id, 'align', 'right')} className={`p-2 rounded-xl transition-all ${row.style?.align === 'right' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Alinear a la derecha">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" /></svg>
                        </button>
                        <button onClick={() => updateItemStyle(row.id, 'align', 'justify')} className={`p-2 rounded-xl transition-all ${row.style?.align === 'justify' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`} title="Justificar">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <select 
                            value={row.style?.lineHeight} 
                            onChange={e => updateItemStyle(row.id, 'lineHeight', e.target.value)}
                            className="bg-transparent border-none text-[12px] font-bold focus:ring-0 cursor-pointer px-1"
                        >
                            {['1.0', '1.2', '1.5', '2.0'].map(lh => <option key={lh} value={lh}>{lh}</option>)}
                        </select>
                        <input type="color" value={row.style?.color || '#000000'} onChange={e => updateItemStyle(row.id, 'color', e.target.value)} className="w-7 h-7 border-none bg-transparent cursor-pointer rounded-full overflow-hidden" />
                    </>
                ) : (
                    <span className="text-[10px] font-bold text-gray-400 px-4 py-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                        Selecciona un texto para editar su formato
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col xl:flex-row w-full min-h-screen bg-[#f1f5f9] font-sans selection:bg-indigo-100 p-4 xl:p-6 gap-6 justify-center">
            {/* Canva Style Toolbar */}
            <FloatingToolbar />

            {/* Left Sidebar (Configuración General) */}
            <aside className="w-full xl:w-72 flex flex-col gap-6 no-print">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors w-fit bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/60 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al Historial
                    </button>
                )}

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
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleFileUpload} 
                                    />
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

                                {backgroundUrl && (
                                    <button 
                                        onClick={() => {
                                            setBackgroundUrl("");
                                            setPreviewFile(null);
                                            setSelectedTemplate("");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="w-full text-[10px] font-black py-3 rounded-xl border-2 border-rose-100 text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        QUITAR MEMBRETE
                                    </button>
                                )}
                            </div>
                        </section>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">Configuración de Página</p>
                            </div>
                    </div>
                </div>
            </aside>

            {/* Canvas Area - Sistema de Hojas Múltiples */}
            <main className="flex-1 overflow-auto py-10 px-4 flex flex-col gap-12 bg-slate-200/30">
                {pages.map((pageRows, pageIdx) => (
                    <div 
                        key={pageIdx}
                        style={{
                            ...paperStyle,
                            height: paperSize === "A4" ? "297mm" : "11in",
                            minHeight: paperSize === "A4" ? "297mm" : "11in",
                            maxHeight: paperSize === "A4" ? "297mm" : "11in",
                        }}
                        className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden relative transition-all duration-700 ease-in-out hover:shadow-[0_60px_150px_rgba(0,0,0,0.15)] no-break-inside mx-auto"
                    >
                        {/* Glass Overlay Contenido */}
                        <div 
                            className="relative z-10 w-full h-full flex flex-col antialiased"
                            style={{ 
                                paddingTop: `${margins.top}cm`, 
                                paddingBottom: `${margins.bottom + 3.0}cm`, // +3.0cm para despeje total del pie
                                paddingLeft: `${margins.left}cm`, 
                                paddingRight: `${margins.right}cm` 
                            }}
                        >
                            {/* CABECERA: Solo en la primera hoja */}
                            {pageIdx === 0 && (
                                <>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="text-[12px] space-y-1 font-bold text-slate-700">
                                            <div className="flex gap-1">
                                                <strong>Teléfono:</strong>
                                                <input 
                                                    className="bg-transparent border-none p-0 focus:ring-0 w-32 font-bold text-slate-700 placeholder:text-slate-300"
                                                    placeholder="Ej. +591 00000000"
                                                    value={advisorPhone}
                                                    onChange={e => setAdvisorPhone(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-1">
                                                <strong>Asesor de venta:</strong>
                                                <input 
                                                    className="bg-transparent border-none p-0 focus:ring-0 w-48 font-bold text-slate-700 placeholder:text-slate-300"
                                                    placeholder="Nombre del Asesor"
                                                    value={advisorName}
                                                    onChange={e => setAdvisorName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <table className="border-collapse border border-slate-800 text-[10px] w-48 font-bold">
                                            <tbody>
                                                <tr>
                                                    <td className="border border-slate-800 px-2 py-1 bg-slate-50">FECHA</td>
                                                    <td className="border border-slate-800 px-2 py-1 text-center">{new Date().toLocaleDateString('es-ES')}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-slate-800 px-2 py-1 bg-slate-50">COTIZACIÓN #</td>
                                                    <td className="border border-slate-800 px-2 py-1 text-center">502342</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-slate-800 px-2 py-1 bg-slate-50">VÁLIDO POR DÍAS</td>
                                                    <td className="border border-slate-800 px-2 py-1 text-center">15</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-slate-800 px-2 py-1 bg-slate-50">VÁLIDO HASTA</td>
                                                    <td className="border border-slate-800 px-2 py-1 text-center">25/03/2026</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-8">
                                        <div className="bg-[#005599] text-white text-[11px] font-black px-3 py-1 uppercase tracking-widest mb-2">
                                            Cliente
                                        </div>
                                        <div className="px-1 text-[12px] font-bold text-slate-800 space-y-0.5">
                                            <input 
                                                className="w-full bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300 uppercase" 
                                                placeholder="Nombre del Cliente / Razón Social"
                                                value={customerName}
                                                onChange={e => setCustomerName(e.target.value)}
                                            />
                                            <input 
                                                className="w-full bg-transparent border-none p-0 text-[10px] text-slate-500 focus:ring-0 placeholder:text-slate-300 uppercase" 
                                                placeholder="Ciudad / NIT"
                                                value={customerDoc}
                                                onChange={e => setCustomerDoc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Logo Spacer para hojas subsecuentes (evita solapamiento) */}
                            {pageIdx > 0 && <div style={{ height: '34px' }} className="w-full flex-shrink-0" />}

                            {/* TABLA DE ÍTEMS: Paginada */}
                            <div className="flex-1">
                                {pageRows.length > 0 && (
                                    <table className="w-full border-collapse border border-slate-800" style={{ tableLayout: 'fixed' }}>
                                        <thead className="bg-[#005599] text-white text-[10px] font-black uppercase tracking-wider">
                                            <tr>
                                                <th className="border border-slate-800 p-0 relative" style={{ width: colWidths.item }}>
                                                    <div className="py-1 text-center">ITEM</div>
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'item')} />
                                                </th>
                                                <th className="border border-slate-800 p-0 relative" style={{ width: colWidths.description }}>
                                                    <div className="py-1 px-3 text-left">DESCRIPCIÓN</div>
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'description')} />
                                                </th>
                                                <th className="border border-slate-800 p-0 relative" style={{ width: colWidths.marca }}>
                                                    <div className="py-1 text-center">MARCA</div>
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'marca')} />
                                                </th>
                                                <th className="border border-slate-800 p-0 relative" style={{ width: colWidths.quantity }}>
                                                    <div className="py-1 text-center">CANT.</div>
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'quantity')} />
                                                </th>
                                                <th className="border border-slate-800 p-0 relative" style={{ width: colWidths.price }}>
                                                    <div className="py-1 text-right pr-3">P.UNIT</div>
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'price')} />
                                                </th>
                                                <th className="border border-slate-800 py-1 text-right pr-3 relative" style={{ width: colWidths.total }}>
                                                    TOTAL
                                                    <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors" onMouseDown={e => handleMouseDownCol(e, 'total')} />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageRows.map((row, rowIdx) => {
                                                const globalIdx = details.findIndex(r => r.id === row.id);
                                                // La altura real es el máximo entre lo manual y lo auto-calculado
                                                const rowHeight = Math.max(32, manualRowHeights[row.id] || 0, autoRowHeights[row.id] || 0);
                                                return (
                                                    <tr key={row.id} className="text-slate-800" style={{ height: rowHeight }}>
                                                        <td className="border border-slate-800 text-center text-[11px] font-bold" style={{ height: rowHeight }}>{globalIdx + 1}</td>
                                                        <td className="border border-slate-800 py-0.5 px-3 relative" style={{ height: rowHeight }}>
                                                            <textarea 
                                                                rows="1"
                                                                className="w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden placeholder:text-slate-300 placeholder:italic"
                                                                placeholder="Descripción del servicio o producto..."
                                                                style={{
                                                                    fontWeight: row.style?.bold ? '900' : 'bold',
                                                                    fontStyle: row.style?.italic ? 'italic' : 'normal',
                                                                    textDecoration: `${row.style?.underline ? 'underline' : ''} ${row.style?.strike ? 'line-through' : ''}`.trim(),
                                                                    textAlign: row.style?.align || 'left',
                                                                    fontSize: row.style?.fontSize || '12px',
                                                                    fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                                    color: row.style?.color || '#1e293b',
                                                                    lineHeight: row.style?.lineHeight || '1.2',
                                                                    height: rowHeight - 8
                                                                }}
                                                                value={row.description}
                                                                onFocus={() => {
                                                                    setFocusedElement({ id: row.id, field: "description" });
                                                                    setLastFocusedId(row.id);
                                                                }}
                                                                onChange={e => {
                                                                    handleDetailChange(row.id, "description", e.target.value);
                                                                    
                                                                    // Truco para que scrollHeight se recalcule hacia abajo:
                                                                    const originalStyleHeight = e.target.style.height;
                                                                    e.target.style.height = 'auto'; 
                                                                    const contentHeight = Math.max(32, e.target.scrollHeight + 8);
                                                                    e.target.style.height = originalStyleHeight;

                                                                    setAutoRowHeights(prev => ({ ...prev, [row.id]: contentHeight }));
                                                                }}
                                                            />
                                                            <div className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-slate-200" onMouseDown={e => handleMouseDownRow(e, row.id)} />
                                                        </td>
                                                        <td className="border border-slate-800 p-0 relative" style={{ height: rowHeight }}>
                                                            <textarea 
                                                                rows="1"
                                                                className="w-full bg-transparent border-none focus:ring-0 p-1 resize-none overflow-hidden uppercase placeholder:text-slate-300 italic" 
                                                                placeholder="MARCA"
                                                                style={{
                                                                    fontWeight: row.style?.bold ? '900' : 'bold',
                                                                    fontStyle: row.style?.italic ? 'italic' : 'normal',
                                                                    textDecoration: `${row.style?.underline ? 'underline' : ''} ${row.style?.strike ? 'line-through' : ''}`.trim(),
                                                                    textAlign: 'center',
                                                                    fontSize: row.style?.fontSize || '10px',
                                                                    fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                                    color: row.style?.color || '#1e293b',
                                                                    lineHeight: '1.1',
                                                                    height: rowHeight - 8
                                                                }}
                                                                value={row.marca || ""}
                                                                onFocus={() => {
                                                                    setFocusedElement({ id: row.id, field: "marca" });
                                                                    setLastFocusedId(row.id);
                                                                }}
                                                                onChange={e => {
                                                                    handleDetailChange(row.id, "marca", e.target.value);
                                                                    
                                                                    const originalStyleHeight = e.target.style.height;
                                                                    e.target.style.height = 'auto';
                                                                    const contentHeight = Math.max(32, e.target.scrollHeight + 8);
                                                                    e.target.style.height = originalStyleHeight;

                                                                    setAutoRowHeights(prev => ({ ...prev, [row.id]: contentHeight }));
                                                                }}
                                                            />
                                                            <div className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-slate-200" onMouseDown={e => handleMouseDownRow(e, row.id)} />
                                                        </td>

                                                        <td className="border border-slate-800 p-0">
                                                            <input 
                                                                type="number"
                                                                className="w-full h-full bg-transparent border-none text-center focus:ring-0"
                                                                style={{
                                                                    fontWeight: row.style?.bold ? '900' : 'bold',
                                                                    fontStyle: row.style?.italic ? 'italic' : 'normal',
                                                                    fontSize: row.style?.fontSize || '12px',
                                                                    fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                                    color: row.style?.color || '#1e293b'
                                                                }}
                                                                value={row.quantity}
                                                                onFocus={() => {
                                                                    setFocusedElement({ id: row.id, field: "quantity" });
                                                                    setLastFocusedId(row.id);
                                                                }}
                                                                onChange={e => handleDetailChange(row.id, "quantity", e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border border-slate-800 p-0 text-right">
                                                            <input 
                                                                type="number"
                                                                className="w-full h-full bg-transparent border-none text-right pr-3 focus:ring-0"
                                                                style={{
                                                                    fontWeight: row.style?.bold ? '900' : 'bold',
                                                                    fontStyle: row.style?.italic ? 'italic' : 'normal',
                                                                    fontSize: row.style?.fontSize || '12px',
                                                                    fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                                    color: row.style?.color || '#1e293b'
                                                                }}
                                                                value={row.unit_price}
                                                                onFocus={() => {
                                                                    setFocusedElement({ id: row.id, field: "unit_price" });
                                                                    setLastFocusedId(row.id);
                                                                }}
                                                                onChange={e => handleDetailChange(row.id, "unit_price", e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border border-slate-800 py-1 pr-3 text-right font-black text-slate-900 bg-slate-50/50 relative"
                                                            style={{
                                                                fontSize: row.style?.fontSize || '12px',
                                                                fontFamily: row.style?.font ? `'${row.style.font}', sans-serif` : `${globalFont}, sans-serif`,
                                                                color: row.style?.color || '#1e293b'
                                                            }}
                                                        >
                                                            {formatCurrency(row.total)}
                                                            {details.length > 1 && (
                                                                <button 
                                                                    onClick={() => removeRow(row.id)}
                                                                    className="absolute -right-8 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 transition-colors p-1 no-print bg-white/80 rounded-full shadow-sm"
                                                                    title="Eliminar fila"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                        {/* FOOTER DE TABLA: Solo si esta página contiene el último ítem real de la lista */}
                                        {pageRows.some(row => row.id === details[details.length - 1]?.id) && (
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="4" className="border-none py-4 px-6 italic text-[10px] font-bold text-slate-500">
                                                        {numeroALetras(total)}
                                                    </td>
                                                    <td className="border border-slate-800 bg-[#005599] text-white text-[10px] font-black text-right pr-3 py-2 uppercase">TOTAL BS.</td>
                                                    <td className="border border-slate-800 text-[14px] font-black pr-3 py-2 text-right bg-slate-100">{formatCurrency(total)}</td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                )}
                            </div>

                            {/* TÉRMINOS Y CONTACTO: Solo en la ÚLTIMA HOJA - Posición FIJA (Absolute) */}
                            {pageIdx === pages.length - 1 && (
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: '2.7cm', 
                                    left: `${margins.left}cm`, 
                                    right: `${margins.right}cm`,
                                    zIndex: 10
                                }}>
                                    <div>
                                        <div className="bg-[#005599] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-0 border border-slate-800">
                                            Términos y Condiciones
                                        </div>
                                        <div className="border border-slate-800 p-3 text-[10px] font-bold text-slate-600 leading-relaxed bg-white shadow-sm">
                                            <ol className="list-decimal list-inside space-y-1">
                                                <li>Todos los precios están expresados en Bolivianos.</li>
                                                <li>Incluye entrega e instalación en sitio.</li>
                                                <li>Incluye impuestos de Ley (Factura).</li>
                                                <li>Garantía real de 1 año por defectos de fábrica.</li>
                                                <li>Forma de pago: A convenir 50% inicio / 50% entrega.</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center text-[11px] italic font-medium text-slate-400 pb-4">
                                        Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros.
                                        <p className="mt-2 text-slate-600 font-black text-[12px] not-italic tracking-tight">¡Gracias por hacer negocios con nosotros!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </main>

            {/* Right Sidebar (Márgenes y Métricas) */}
            <aside className="w-full xl:w-72 flex flex-col gap-6 no-print">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] p-6 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Márgenes de Hoja</label>
                    
                    <div className="space-y-6">
                        <section className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                {[
                                    { label: 'Superior', key: 'top' },
                                    { label: 'Inferior', key: 'bottom' },
                                    { label: 'Izquierdo', key: 'left' },
                                    { label: 'Derecho', key: 'right' }
                                ].map(m => (
                                    <div key={m.key}>
                                        <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">{m.label}</label>
                                        <input 
                                            type="number" step="0.1" min="0" max="15" 
                                            value={margins[m.key] === 0 ? "" : margins[m.key]} 
                                            onChange={e => setMargins({...margins, [m.key]: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
                                            className="w-full bg-white border-none rounded-lg py-2 px-1 text-xs font-black shadow-sm focus:ring-1 focus:ring-indigo-500 text-indigo-600"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-[9px] text-slate-400 italic text-center">Valores en Centímetros (cm)</p>
                        </section>

                        <section className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Métricas Financieras</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                    <span>Descuento %</span>
                                    <input 
                                        type="number" 
                                        className="w-16 bg-white border-none rounded-lg py-1 px-2 text-right focus:ring-1 focus:ring-indigo-500"
                                        value={discount}
                                        onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="pt-3 border-t border-indigo-200 flex justify-between items-center">
                                    <span className="text-sm font-black text-indigo-900 uppercase">Total</span>
                                    <span className="text-xl font-black text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={addRow}
                                className="w-full bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-black py-3 rounded-xl transition-all active:scale-95 text-[10px] tracking-widest flex items-center justify-center gap-2 mb-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                AGREGAR ÍTEM
                            </button>
                            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-xs">
                                REGISTRAR PROFORMA
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                IMPRIMIR
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ProformaEditor;
