<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::with('products')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'base_price' => 'numeric|min:0',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1'
        ]);

        $service = Service::create($validated);

        if (isset($validated['products'])) {
            $syncData = [];
            foreach ($validated['products'] as $product) {
                $syncData[$product['id']] = ['quantity' => $product['quantity']];
            }
            $service->products()->sync($syncData);
        }

        return response()->json($service->load('products'), 201);
    }

    public function show(Service $service)
    {
        return response()->json($service->load('products'));
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'base_price' => 'numeric|min:0',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1'
        ]);

        $service->update($validated);

        if ($request->has('products')) {
            $syncData = [];
            foreach ($validated['products'] as $product) {
                $syncData[$product['id']] = ['quantity' => $product['quantity']];
            }
            $service->products()->sync($syncData);
        }

        return response()->json($service->load('products'));
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(null, 204);
    }
}
