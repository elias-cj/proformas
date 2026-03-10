<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use App\Models\WorkOrderHistory;
use Illuminate\Support\Facades\DB;

class WorkOrderController extends Controller
{
    public function index()
    {
        return response()->json(WorkOrder::with('technician', 'proforma', 'histories')->get());
    }

    public function show(WorkOrder $workOrder)
    {
        return response()->json($workOrder->load('technician', 'proforma.customer', 'histories', 'justifiers'));
    }

    public function assign(Request $request, WorkOrder $workOrder)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id'
        ]);

        $workOrder->update([
            'technician_id' => $request->technician_id,
            'assigned_at' => now()
        ]);

        return response()->json($workOrder->load('technician'));
    }

    public function updateStatus(Request $request, WorkOrder $workOrder)
    {
        $request->validate([
            'status' => 'required|in:en_espera,en_ejecucion,listo',
            'note' => 'nullable|string'
        ]);

        if ($request->status === 'listo') {
            // Require justifier
            if ($workOrder->justifiers()->count() === 0) {
                return response()->json(['message' => 'Se requiere un justificante para marcar como listo'], 422);
            }
        }

        return DB::transaction(function () use ($request, $workOrder) {
            $oldStatus = $workOrder->status;
            
            $updates = ['status' => $request->status];
            if ($request->status === 'en_ejecucion' && !$workOrder->started_at) {
                $updates['started_at'] = now();
            }
            if ($request->status === 'listo' && !$workOrder->completed_at) {
                $updates['completed_at'] = now();
            }

            $workOrder->update($updates);

            WorkOrderHistory::create([
                'work_order_id' => $workOrder->id,
                'user_id' => $request->user()->id ?? null,
                'from_status' => $oldStatus,
                'to_status' => $request->status,
                'note' => $request->note
            ]);

            return response()->json($workOrder->load('histories'));
        });
    }
}
