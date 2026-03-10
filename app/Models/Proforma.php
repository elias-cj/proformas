<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proforma extends Model
{
    use HasFactory;

    protected $fillable = [
        'number', 'customer_id', 'date', 'validity_days', 
        'status', 'subtotal', 'discount', 'total', 'template_id'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function details()
    {
        return $this->hasMany(ProformaDetail::class);
    }

    public function workOrder()
    {
        return $this->hasOne(WorkOrder::class);
    }
}
