<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Proforma;
use App\Models\WorkOrder;
use App\Http\Requests\StoreProformaRequest;
use App\Services\CorrelativeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class ProformaController extends Controller
{
    protected $correlativeService;

    public function __construct(CorrelativeService $correlativeService)
    {
        $this->correlativeService = $correlativeService;
    }

    public function index()
    {
        return response()->json(Proforma::with('customer', 'details')->get());
    }

    public function store(StoreProformaRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $validated['number'] = $this->correlativeService->getNextCorrelative('proforma');
            $validated['status'] = 'borrador';

            $proforma = Proforma::create($validated);

            if (isset($validated['details'])) {
                foreach ($validated['details'] as $detail) {
                    $proforma->details()->create($detail);
                }
            }

            return response()->json($proforma->load('customer', 'details'), 201);
        });
    }

    public function show(Proforma $proforma)
    {
        return response()->json($proforma->load('customer', 'details'));
    }

    public function update(StoreProformaRequest $request, Proforma $proforma)
    {
        // Para simplificar, la actualización directa reemplaza detalles.
        // En flujos complejos puede requerir borrado previo o sync personalizado.
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $proforma) {
            $oldStatus = $proforma->status;
            $proforma->update($validated);

            if (isset($validated['details'])) {
                $proforma->details()->delete();
                foreach ($validated['details'] as $detail) {
                    $proforma->details()->create($detail);
                }
            }

            // Auto-create Work Order if transitioned to 'aceptada'
            if ($oldStatus !== 'aceptada' && $proforma->status === 'aceptada') {
                // Ensure no duplicate work order exists
                if (!$proforma->workOrder()->exists()) {
                    $number = $this->correlativeService->getNextCorrelative('work_order');
                    WorkOrder::create([
                        'proforma_id' => $proforma->id,
                        'number' => $number,
                        'status' => 'en_espera'
                    ]);
                }
            }

            return response()->json($proforma->load('customer', 'details'));
        });
    }

    public function destroy(Proforma $proforma)
    {
        $proforma->delete();
        return response()->json(null, 204);
    }

    public function generatePdf(Proforma $proforma)
    {
        $proforma->load('customer', 'details', 'template');
        
        $pdf = \Dompdf\Dompdf::class; // Facade can be used if wrapper installed, else manual approach.
        // We will use standard barryvdh/laravel-dompdf if preferred, or manual Dompdf instantiation.
        // To keep it simple, since we did composer require dompdf/dompdf (native):
        
        $html = view('proformas.pdf', compact('proforma'))->render();
        
        $dompdf = new \Dompdf\Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200)
                ->header('Content-Type', 'application/pdf');
    }

    public function whatsapp(Proforma $proforma)
    {
        $proforma->load('customer');
        $phone = preg_replace('/[^0-9]/', '', $proforma->customer->phone);
        
        $linkPdf = url("/api/proformas/{$proforma->id}/pdf"); // Ajustar según config final
        $mensaje = urlencode("Hola {$proforma->customer->name_reason_social}, adjuntamos la proforma solicitada: {$linkPdf}");
        
        return response()->json([
            'url' => "https://wa.me/{$phone}?text={$mensaje}"
        ]);
    }
}
