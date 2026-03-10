<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashMovement;
use App\Models\CashOpening;
use Illuminate\Support\Facades\DB;

class CashMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = CashMovement::with('cashOpening', 'user');
        
        if ($request->has('cash_opening_id')) {
            $query->where('cash_opening_id', $request->cash_opening_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cash_opening_id' => 'required|exists:cash_openings,id',
            'type' => 'required|in:ingreso,egreso',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer'
        ]);

        $opening = CashOpening::findOrFail($validated['cash_opening_id']);
        if ($opening->closed_at) {
            return response()->json(['message' => 'No se pueden añadir movimientos a una caja cerrada.'], 422);
        }

        $validated['user_id'] = $request->user()->id ?? 1;

        $movement = CashMovement::create($validated);
        return response()->json($movement->load('user'), 201);
    }

    public function show(CashMovement $cashMovement)
    {
        return response()->json($cashMovement->load('cashOpening', 'user'));
    }
}
