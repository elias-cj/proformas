<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashMovement;
use App\Models\Payment;
use Illuminate\Support\Carbon;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::today()->toDateString());
        $endDate = $request->query('end_date', Carbon::today()->toDateString());

        // Reporte de movimientos de caja agrupados por tipo
        $movements = CashMovement::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->get();

        // Reporte de ingresos por método de pago (Payments asociados o no a caja)
        $paymentsByMethod = Payment::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('payment_method, SUM(amount) as total')
            ->groupBy('payment_method')
            ->get();

        // Flujo neto en caja
        $ingresosCaja = $movements->firstWhere('type', 'ingreso')->total ?? 0;
        $egresosCaja = $movements->firstWhere('type', 'egreso')->total ?? 0;
        $flujoNetoCaja = $ingresosCaja - $egresosCaja;

        return response()->json([
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ],
            'cash_flow' => [
                'total_in' => $ingresosCaja,
                'total_out' => $egresosCaja,
                'net_cash' => $flujoNetoCaja
            ],
            'income_by_method' => $paymentsByMethod
        ]);
    }
}
