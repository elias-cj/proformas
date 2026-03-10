<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashOpening extends Model
{
    use HasFactory;

    protected $fillable = [
        'cash_register_id', 'user_id', 'opening_amount', 
        'opened_at', 'closed_at', 'closing_expected_amount', 
        'closing_actual_amount', 'difference', 'notes'
    ];

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movements()
    {
        return $this->hasMany(CashMovement::class);
    }
}
