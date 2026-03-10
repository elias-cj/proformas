<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Justifier;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\Storage;

class JustifierController extends Controller
{
    public function index(Request $request)
    {
        $query = Justifier::with('workOrder', 'uploader');
        
        if ($request->has('work_order_id')) {
            $query->where('work_order_id', $request->work_order_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'work_order_id' => 'required|exists:work_orders,id',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'description' => 'nullable|string'
        ]);

        $file = $request->file('file');
        $path = $file->store('justifiers', 'public');
        $type = $file->getClientOriginalExtension();

        $justifier = Justifier::create([
            'work_order_id' => $request->work_order_id,
            'file_path' => $path,
            'file_type' => $type,
            'description' => $request->description,
            'uploaded_by' => $request->user()->id ?? null
        ]);

        return response()->json($justifier->load('uploader'), 201);
    }

    public function show(Justifier $justifier)
    {
        return response()->json($justifier->load('workOrder', 'uploader'));
    }

    public function destroy(Justifier $justifier)
    {
        if ($justifier->file_path && Storage::disk('public')->exists($justifier->file_path)) {
            Storage::disk('public')->delete($justifier->file_path);
        }
        
        $justifier->delete();
        return response()->json(null, 204);
    }
}
