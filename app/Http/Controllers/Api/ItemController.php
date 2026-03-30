<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    /**
     * Display a listing of items.
     */
    public function index(Request $request)
    {
        $query = Item::with('category');
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        return response()->json($query->get());
    }

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:items,code',
            'type' => 'required|in:product,service',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'unit' => 'nullable|string',
            'brand' => 'nullable|string',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        $item = Item::create($validated);
        return response()->json($item->load('category'), 201);
    }

    /**
     * Display the specified item.
     */
    public function show(Item $item)
    {
        return response()->json($item->load('category'));
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'nullable|string|unique:items,code,' . $item->id,
            'type' => 'sometimes|required|in:product,service',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'unit' => 'nullable|string',
            'brand' => 'nullable|string',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        $item->update($validated);
        return response()->json($item->load('category'));
    }

    /**
     * Remove the specified item.
     */
    public function destroy(Item $item)
    {
        $item->delete();
        return response()->json(null, 204);
    }
}
