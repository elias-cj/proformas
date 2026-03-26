<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\CorrelativeController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MembreteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

// Rutas públicas para demostración (Epic 3 & Editor)
Route::get('/templates', [TemplateController::class, 'index']);
Route::post('/membrete', [MembreteController::class, 'store']);

// Rutas de Epic 2 (Catálogos) y Epic 3 (Proformas) para pruebas (Plicas)
Route::apiResource('categories', App\Http\Controllers\Api\CategoryController::class);
Route::apiResource('customers', App\Http\Controllers\Api\CustomerController::class);
Route::apiResource('services', App\Http\Controllers\Api\ServiceController::class);
Route::apiResource('products', App\Http\Controllers\Api\ProductController::class);
Route::apiResource('proformas', App\Http\Controllers\Api\ProformaController::class);
Route::get('/proformas/{proforma}/pdf', [App\Http\Controllers\Api\ProformaController::class, 'generatePdf']);
Route::get('/proformas/{proforma}/whatsapp', [App\Http\Controllers\Api\ProformaController::class, 'whatsapp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
    
    // Rutas de configuración Backoffice (Epic 1)
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('correlatives', CorrelativeController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('users', UserController::class);

    // Rutas de Epic 4 (Órdenes de Trabajo)
    Route::apiResource('technicians', App\Http\Controllers\Api\TechnicianController::class);
    Route::apiResource('work-orders', App\Http\Controllers\Api\WorkOrderController::class);
    Route::post('/work-orders/{work_order}/assign', [App\Http\Controllers\Api\WorkOrderController::class, 'assign']);
    Route::post('/work-orders/{work_order}/status', [App\Http\Controllers\Api\WorkOrderController::class, 'updateStatus']);
    
    Route::apiResource('justifiers', App\Http\Controllers\Api\JustifierController::class);

    // Rutas de Epic 5 (Caja y Financiero)
    Route::apiResource('cash-registers', App\Http\Controllers\Api\CashRegisterController::class);
    Route::apiResource('cash-openings', App\Http\Controllers\Api\CashOpeningController::class);
    Route::post('/cash-openings/{cash_opening}/close', [App\Http\Controllers\Api\CashOpeningController::class, 'close']);
    Route::apiResource('cash-movements', App\Http\Controllers\Api\CashMovementController::class)->only(['index', 'store', 'show']);
    
    Route::apiResource('payments', App\Http\Controllers\Api\PaymentController::class)->only(['index', 'store', 'show']);
    Route::apiResource('expenses', App\Http\Controllers\Api\ExpenseController::class)->only(['index', 'store', 'show']);

    Route::get('/reports/financial', [App\Http\Controllers\Api\FinancialReportController::class, 'index']);
    Route::get('/reports/commercial', [App\Http\Controllers\Api\ReportController::class, 'commercial']);
    Route::get('/reports/operative', [App\Http\Controllers\Api\ReportController::class, 'operative']);

    // Rutas de Epic 6 (Contratos y Documentos)
    Route::apiResource('contracts', App\Http\Controllers\Api\ContractController::class);
    Route::get('/contracts/{contract}/pdf', [App\Http\Controllers\Api\ContractController::class, 'generatePdf']);
    
    Route::apiResource('documents', App\Http\Controllers\Api\DocumentController::class)->only(['index', 'store', 'show', 'destroy']);
});


