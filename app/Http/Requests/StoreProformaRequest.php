<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProformaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        // Limpiamos (filtramos) las filas vacías que el React envíe por defecto
        if ($this->has('details')) {
            $cleanedDetails = array_filter($this->details, function ($detail) {
                return !empty($detail['description']) && !empty($detail['quantity']) && !empty($detail['unit_price']);
            });
            $this->merge(['details' => array_values($cleanedDetails)]);
        }
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'date' => 'required|date',
            'validity_days' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'template_id' => 'nullable|exists:templates,id',
            
            'details' => 'required|array|min:1',
            'details.*.product_id' => 'nullable|exists:products,id',
            'details.*.description' => 'required|string',
            'details.*.quantity' => 'required|numeric|min:0.01',
            'details.*.unit_price' => 'required|numeric|min:0',
            'details.*.total' => 'required|numeric|min:0',
        ];
    }
}
