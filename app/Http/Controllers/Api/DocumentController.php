<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::with('user');

        if ($request->has('documentable_type') && $request->has('documentable_id')) {
            $query->where('documentable_type', $request->documentable_type)
                  ->where('documentable_id', $request->documentable_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'documentable_id' => 'required|integer',
            'documentable_type' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240' // Seguridad: Restricción de mimetypes
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');
        
        $document = Document::create([
            'documentable_id' => $request->documentable_id,
            'documentable_type' => $request->documentable_type,
            'user_id' => $request->user()->id ?? 1,
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'version' => 1
        ]);

        return response()->json($document->load('user'), 201);
    }

    public function show(Document $document)
    {
        return response()->json($document->load('user'));
    }

    public function destroy(Document $document)
    {
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();
        return response()->json(null, 204);
    }
}
