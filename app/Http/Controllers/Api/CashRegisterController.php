<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashRegister;

class CashRegisterController extends Controller
{
    public function index()
    {
        return response()->json(CashRegister::with('openings')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        $cashRegister = CashRegister::create($validated);
        return response()->json($cashRegister, 201);
    }

    public function show(CashRegister $cashRegister)
    {
        return response()->json($cashRegister->load('openings'));
    }

    public function update(Request $request, CashRegister $cashRegister)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        $cashRegister->update($validated);
        return response()->json($cashRegister);
    }

    public function destroy(CashRegister $cashRegister)
    {
        // Require no openings to delete
        if ($cashRegister->openings()->exists()) {
            return response()->json(['message' => 'No se puede eliminar la caja porque tiene aperturas registradas.'], 422);
        }
        $cashRegister->delete();
        return response()->json(null, 204);
    }
}
