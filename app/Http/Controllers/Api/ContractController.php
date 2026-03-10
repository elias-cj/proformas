<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contract;

class ContractController extends Controller
{
    public function index()
    {
        return response()->json(Contract::with('proforma', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'proforma_id' => 'required|exists:proformas,id|unique:contracts,proforma_id',
            'status' => 'nullable|string'
        ]);

        $validated['user_id'] = $request->user()->id ?? 1;

        $contract = Contract::create($validated);
        return response()->json($contract->load('proforma', 'user'), 201);
    }

    public function show(Contract $contract)
    {
        return response()->json($contract->load('proforma', 'user', 'documents'));
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'status' => 'string|in:borrador,firmado,cancelado',
            'signed_at' => 'nullable|date'
        ]);

        $contract->update($validated);
        return response()->json($contract->load('proforma', 'user'));
    }

    public function generatePdf(Contract $contract)
    {
        $contract->load('proforma.customer', 'proforma.template');
        
        // Simulating PDF generation with DOMPDF
        $html = "<h1>Contrato Nro. {$contract->id}</h1><p>Proforma: {$contract->proforma->number}</p><p>Cliente: {$contract->proforma->customer->name_reason_social}</p>";
        
        $dompdf = new \Dompdf\Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200)
                ->header('Content-Type', 'application/pdf');
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();
        return response()->json(null, 204);
    }
}
