<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\CashOpening;
use App\Models\CashMovement;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(Payment::with('proforma.customer', 'cashMovement', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'proforma_id' => 'required|exists:proformas,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'cash_register_id' => 'nullable|exists:cash_registers,id' // Si entra a caja
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $userId = $request->user()->id ?? 1;
            $cashMovementId = null;

            // Si se especificó una caja, registrar el movimiento
            if (!empty($validated['cash_register_id'])) {
                $activeOpening = CashOpening::where('cash_register_id', $validated['cash_register_id'])
                                            ->whereNull('closed_at')
                                            ->first();
                
                if (!$activeOpening) {
                    return response()->json(['message' => 'La caja seleccionada no tiene una apertura activa.'], 422);
                }

                $movement = CashMovement::create([
                    'cash_opening_id' => $activeOpening->id,
                    'type' => 'ingreso',
                    'amount' => $validated['amount'],
                    'description' => 'Pago de Proforma #' . $validated['proforma_id'],
                    'reference_type' => 'payment',
                    // reference_id assigned after payment creation
                    'user_id' => $userId
                ]);

                $cashMovementId = $movement->id;
            }

            $payment = Payment::create([
                'proforma_id' => $validated['proforma_id'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'cash_movement_id' => $cashMovementId,
                'user_id' => $userId
            ]);

            // Update polymorphic reference if movement was created
            if ($cashMovementId) {
                CashMovement::where('id', $cashMovementId)->update(['reference_id' => $payment->id]);
            }

            return response()->json($payment->load('proforma', 'cashMovement'), 201);
        });
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load('proforma', 'cashMovement', 'user'));
    }
}
