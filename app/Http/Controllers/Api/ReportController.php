<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Proforma;
use App\Models\WorkOrder;
use App\Models\Technician;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function commercial(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->query('end_date', Carbon::today()->toDateString());

        // Proformas por estado
        $byStatus = Proforma::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select('status', DB::raw('count(*) as total'), DB::raw('SUM(total) as revenue'))
            ->groupBy('status')
            ->get();

        $totalProformas = $byStatus->sum('total');
        $accepted = $byStatus->firstWhere('status', 'aceptada')->total ?? 0;
        
        $conversionRate = $totalProformas > 0 ? round(($accepted / $totalProformas) * 100, 2) : 0;

        return response()->json([
            'period' => ['start' => $startDate, 'end' => $endDate],
            'by_status' => $byStatus,
            'conversion_rate' => $conversionRate
        ]);
    }

    public function operative(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->query('end_date', Carbon::today()->toDateString());

        // Órdenes por estado
        $byStatus = WorkOrder::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        // Productividad por técnico (órdenes completadas)
        $productivity = WorkOrder::whereBetween('completed_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('status', 'listo')
            ->whereNotNull('technician_id')
            ->select('technician_id', DB::raw('count(*) as completed_orders'))
            ->with('technician.user:id,name') // Asumiendo que Technician -> User
            ->groupBy('technician_id')
            ->get();

        return response()->json([
            'period' => ['start' => $startDate, 'end' => $endDate],
            'by_status' => $byStatus,
            'technician_productivity' => $productivity
        ]);
    }
}
