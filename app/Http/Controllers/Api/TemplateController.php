<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $files = \Illuminate\Support\Facades\Storage::disk('public')->files('membretes');
        $templates = collect($files)->map(function($path, $index) {
            $lastModified = \Illuminate\Support\Facades\Storage::disk('public')->lastModified($path);
            $date = date('d/m/Y H:i', $lastModified);
            return [
                'id' => $index + 1,
                'name' => "Membrete " . ($index + 1) . " (" . $date . ")",
                'file_path' => $path
            ];
        });

        return response()->json($templates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
