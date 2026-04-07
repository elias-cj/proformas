<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Proforma {{ $proforma->number }}</title>
    <style>
        @page {
            margin: 45mm 15mm 35mm 15mm;
            size: A4 portrait;
        }

        header {
            position: fixed;
            top: -35mm;
            left: 0mm;
            right: 0mm;
            height: 30mm;
            border-bottom: 1px solid #e2e8f0;
            z-index: -50;
        }

        footer {
            position: fixed;
            bottom: -25mm;
            left: 0mm;
            right: 0mm;
            height: 25mm;
            border-top: 1px solid #e2e8f0;
            z-index: -50;
        }

        /* Ocultar el header fijo en la primera página */
        .cover-header-page1 {
            position: absolute;
            top: -45mm;
            left: -15mm;
            right: -15mm;
            height: 45mm;
            background: white;
            z-index: 100;
        }

        /* Estilos base */

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            font-size: 12px;
            color: #333;
        }

        .background-image {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -100;
        }

        .content {
            position: relative;
            z-index: 10;
        }

        .header {
            margin-bottom: 20px;
        }

        .header h1 {
            color: #1a202c;
            margin: 0 0 10px 0;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }

        .details-table th, .details-table td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
        }

        .details-table th {
            background-color: #f7fafc;
            font-weight: bold;
        }

        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totals {
            margin-top: 20px;
            width: 50%;
            float: right;
            border-collapse: collapse;
        }

        .totals td {
            padding: 5px;
        }
        
        .totals .final-total {
            font-weight: bold;
            font-size: 1.2em;
            color: #2d3748;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #718096;
            clear: both;
        }

        .pagenum:before {
            content: counter(page);
        }
    </style>
</head>
<body>
    @if($proforma->template && $proforma->template->file_path)
        <img src="{{ public_path('storage/' . $proforma->template->file_path) }}" class="background-image" alt="Membrete">
    @endif

    <header>
        <div style="font-size: 10px; color: #718096; padding-top: 10px;">
            <div style="float: left;">
                <strong>{{ $company->name ?? 'Mi Empresa' }}</strong> - Proforma #{{ $proforma->number }}
            </div>
            <div style="float: right;">
                Fecha: {{ $proforma->date }}
            </div>
            <div style="clear: both;"></div>
        </div>
    </header>

    <footer>
        <div style="font-size: 9px; color: #718096; padding-top: 5px;">
            <p style="margin: 0; padding-bottom: 2px;"><strong>Términos y Condiciones:</strong></p>
            <div style="line-height: 1.1;">
                {!! nl2br(e($company->document_footer ?? 'Condiciones generales de venta aplicables.')) !!}
            </div>
            <div style="text-align: right; margin-top: 5px; font-size: 10px;">
                Página <span class="pagenum"></span>
            </div>
        </div>
    </footer>

    <div class="content">
        <div class="cover-header-page1"></div>
        
        <div class="header" style="margin-top: -30px; margin-bottom: 30px;">
            <div style="float: left; width: 60%;">
                <h1 style="color: #2d3748; margin-bottom: 5px;">PROFORMA</h1>
                <p style="font-size: 1.2em; color: #4a5568;">#{{ $proforma->number }}</p>
            </div>
            <div style="float: right; text-align: right; font-size: 0.9em;">
                <p><strong>Fecha Emisión:</strong> {{ $proforma->date }}</p>
                <p><strong>Días Validez:</strong> {{ $proforma->validity_days }} días</p>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div style="margin-bottom: 30px; border: 1px solid #edf2f7; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 5px;">Información del Cliente</h3>
            <div style="float: left; width: 50%;">
                <p><strong>Nombre:</strong> {{ $proforma->customer->name_reason_social }}</p>
                <p><strong>Doc / NIT:</strong> {{ $proforma->customer->document_number }}</p>
            </div>
            <div style="float: right; width: 50%; text-align: right;">
                <p><strong>Dirección:</strong> {{ $proforma->customer->address ?? 'N/A' }}</p>
                <p><strong>Teléfono:</strong> {{ $proforma->customer->phone ?? 'N/A' }}</p>
            </div>
            <div style="clear: both;"></div>
        </div>

        <table class="details-table">
            <thead>
                <tr>
                    <th>Cant.</th>
                    <th>Descripción</th>
                    <th class="text-right">P. Unit.</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($proforma->details as $item)
                <tr>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td>{{ $item->description }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 20px; width: 60%; float: left; font-style: italic; font-size: 11px; color: #4a5568; padding-top: 10px;">
            {{ $proforma->total_in_words }}
        </div>

        <table class="totals">
            <tr>
                <td class="text-right"><strong>Subtotal:</strong></td>
                <td class="text-right">{{ number_format($proforma->subtotal, 2) }} BS.</td>
            </tr>
            <tr>
                <td class="text-right"><strong>Descuento:</strong></td>
                <td class="text-right">{{ number_format($proforma->discount, 2) }} BS.</td>
            </tr>
            <tr>
                <td class="text-right final-total">Total:</td>
                <td class="text-right final-total">{{ number_format($proforma->total, 2) }} BS.</td>
            </tr>
        </table>

        <!-- Aquí se podría imprimir footer dinámico de la Company -->
    </div>
</body>
</html>
