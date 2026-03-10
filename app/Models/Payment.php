<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'proforma_id', 'amount', 'payment_method', 
        'reference_number', 'cash_movement_id', 'user_id'
    ];

    public function proforma()
    {
        return $this->belongsTo(Proforma::class);
    }

    public function cashMovement()
    {
        return $this->belongsTo(CashMovement::class);
    }
}
