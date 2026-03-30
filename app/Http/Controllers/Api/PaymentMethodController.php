<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the payment methods.
     */
    public function index()
    {
        return response()->json(PaymentMethod::all());
    }

    /**
     * Store a newly created payment method in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:payment_methods,name',
            'description' => 'nullable|string',
            'status' => 'required|in:Activo,Inactivo',
            'installments' => 'required|array|min:1',
            'installments.*' => 'numeric|min:1|max:100'
        ]);

        // Validar que la suma sea 100
        if (array_sum($validated['installments']) != 100) {
            return response()->json(['message' => 'La suma de los porcentajes de cuotas debe ser exactamente 100%.'], 422);
        }

        $paymentMethod = PaymentMethod::create($validated);
        return response()->json($paymentMethod, 201);
    }

    /**
     * Display the specified payment method.
     */
    public function show(PaymentMethod $paymentMethod)
    {
        return response()->json($paymentMethod);
    }

    /**
     * Update the specified payment method in storage.
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|unique:payment_methods,name,' . $paymentMethod->id,
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:Activo,Inactivo',
            'installments' => 'sometimes|required|array|min:1',
            'installments.*' => 'numeric|min:1|max:100'
        ]);

        if (isset($validated['installments']) && array_sum($validated['installments']) != 100) {
            return response()->json(['message' => 'La suma de los porcentajes de cuotas debe ser exactamente 100%.'], 422);
        }

        $paymentMethod->update($validated);
        return response()->json($paymentMethod);
    }

    /**
     * Remove the specified payment method from storage.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();
        return response()->json(null, 204);
    }
}
