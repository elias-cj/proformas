<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Company;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Company::first() ?? new Company([
            'name' => 'Emprotec',
            'currency' => 'Bs.',
            'document_footer' => 'Gracias por su preferencia.'
        ]));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'required|string|max:10',
            'logo_path' => 'nullable|string',
            'document_footer' => 'nullable|string'
        ]);

        $company = Company::updateOrCreate(['id' => 1], $validated);
        return response()->json($company);
    }

    public function update(Request $request, string $id)
    {
        return $this->store($request);
    }
}
