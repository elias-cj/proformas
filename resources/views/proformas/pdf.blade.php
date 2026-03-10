<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Proforma {{ $proforma->number }}</title>
    <style>
        @page {
            margin: 0mm;
            size: A4 portrait;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            font-size: 14px;
            color: #333;
        }

        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -10;
        }

        .content {
            padding: 40mm 20mm 30mm 20mm; /* Acomodar según el membrete (logo/header) */
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
    </style>
</head>
<body>
    @if($proforma->template && $proforma->template->file_path)
        <img src="{{ public_path('storage/' . $proforma->template->file_path) }}" class="background-image" alt="Membrete">
    @endif

    <div class="content">
        <div class="header">
            <h1>PROFORMA</h1>
            <p><strong>Nro:</strong> {{ $proforma->number }}</p>
            <p><strong>Fecha:</strong> {{ $proforma->date }}</p>
            <p><strong>Válida por:</strong> {{ $proforma->validity_days }} días</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>Cliente</h3>
            <p><strong>Nombre/Razón Social:</strong> {{ $proforma->customer->name_reason_social }}</p>
            <p><strong>Doc:</strong> {{ $proforma->customer->document_number }}</p>
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

        <table class="totals">
            <tr>
                <td class="text-right"><strong>Subtotal:</strong></td>
                <td class="text-right">{{ number_format($proforma->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right"><strong>Dcto:</strong></td>
                <td class="text-right">{{ number_format($proforma->discount, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right final-total">Total:</td>
                <td class="text-right final-total">{{ number_format($proforma->total, 2) }}</td>
            </tr>
        </table>

        <!-- Aquí se podría imprimir footer dinámico de la Company -->
    </div>
</body>
</html>
