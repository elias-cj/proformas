<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashOpening;
use Illuminate\Support\Facades\DB;

class CashOpeningController extends Controller
{
    public function index()
    {
        return response()->json(CashOpening::with('cashRegister', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cash_register_id' => 'required|exists:cash_registers,id',
            'opening_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        // Verificar si la caja ya tiene una apertura activa
        $existsActive = CashOpening::where('cash_register_id', $validated['cash_register_id'])
                                    ->whereNull('closed_at')
                                    ->exists();
                                    
        if ($existsActive) {
            return response()->json(['message' => 'Esta caja ya tiene una apertura activa.'], 422);
        }

        $validated['user_id'] = $request->user()->id ?? 1; // Fallback para demo

        $opening = CashOpening::create($validated);
        return response()->json($opening->load('cashRegister', 'user'), 201);
    }

    public function show(CashOpening $cashOpening)
    {
        return response()->json($cashOpening->load('cashRegister', 'user', 'movements'));
    }

    public function close(Request $request, CashOpening $cashOpening)
    {
        if ($cashOpening->closed_at) {
            return response()->json(['message' => 'Esta apertura ya está cerrada.'], 422);
        }

        $validated = $request->validate([
            'closing_actual_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated, $cashOpening) {
            // Calcular monto esperado (Apertura + Ingresos - Egresos)
            $totalIngresos = $cashOpening->movements()->where('type', 'ingreso')->sum('amount');
            $totalEgresos = $cashOpening->movements()->where('type', 'egreso')->sum('amount');
            
            $expected = $cashOpening->opening_amount + $totalIngresos - $totalEgresos;
            
            $cashOpening->update([
                'closed_at' => now(),
                'closing_expected_amount' => $expected,
                'closing_actual_amount' => $validated['closing_actual_amount'],
                'difference' => $validated['closing_actual_amount'] - $expected,
                'notes' => $validated['notes']
            ]);

            return response()->json($cashOpening);
        });
    }
}
