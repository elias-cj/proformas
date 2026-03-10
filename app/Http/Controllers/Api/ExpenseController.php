<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\CashOpening;
use App\Models\CashMovement;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(Expense::with('workOrder', 'cashMovement', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'work_order_id' => 'nullable|exists:work_orders,id',
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'receipt_number' => 'nullable|string',
            'cash_register_id' => 'required|exists:cash_registers,id' // Los gastos suelen salir de caja
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $userId = $request->user()->id ?? 1;
            
            $activeOpening = CashOpening::where('cash_register_id', $validated['cash_register_id'])
                                        ->whereNull('closed_at')
                                        ->first();
            
            if (!$activeOpening) {
                return response()->json(['message' => 'La caja seleccionada no tiene una apertura activa para extraer el gasto.'], 422);
            }

            $movement = CashMovement::create([
                'cash_opening_id' => $activeOpening->id,
                'type' => 'egreso',
                'amount' => $validated['amount'],
                'description' => 'Gasto: ' . $validated['concept'],
                'reference_type' => 'expense',
                'user_id' => $userId
            ]);

            $expense = Expense::create([
                'work_order_id' => $validated['work_order_id'] ?? null,
                'concept' => $validated['concept'],
                'amount' => $validated['amount'],
                'receipt_number' => $validated['receipt_number'],
                'cash_movement_id' => $movement->id,
                'user_id' => $userId
            ]);

            $movement->update(['reference_id' => $expense->id]);

            return response()->json($expense->load('workOrder', 'cashMovement'), 201);
        });
    }

    public function show(Expense $expense)
    {
        return response()->json($expense->load('workOrder', 'cashMovement', 'user'));
    }
}
