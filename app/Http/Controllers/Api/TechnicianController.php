<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Technician;

class TechnicianController extends Controller
{
    public function index()
    {
        return response()->json(Technician::with('user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:technicians,user_id',
            'is_active' => 'boolean'
        ]);

        $technician = Technician::create($validated);
        return response()->json($technician->load('user'), 201);
    }

    public function show(Technician $technician)
    {
        return response()->json($technician->load('user', 'workOrders'));
    }

    public function update(Request $request, Technician $technician)
    {
        $validated = $request->validate([
            'is_active' => 'boolean'
        ]);

        $technician->update($validated);
        return response()->json($technician->load('user'));
    }

    public function destroy(Technician $technician)
    {
        // Safe delete depending on workOrders existence
        if ($technician->workOrders()->exists()) {
            return response()->json(['message' => 'No se puede eliminar porque tiene órdenes de trabajo asignadas'], 422);
        }

        $technician->delete();
        return response()->json(null, 204);
    }
}
