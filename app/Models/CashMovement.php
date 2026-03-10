<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'cash_opening_id', 'type', 'amount', 'description', 
        'reference_type', 'reference_id', 'user_id'
    ];

    public function cashOpening()
    {
        return $this->belongsTo(CashOpening::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
