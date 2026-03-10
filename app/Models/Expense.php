<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id', 'concept', 'amount', 
        'receipt_number', 'cash_movement_id', 'user_id'
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function cashMovement()
    {
        return $this->belongsTo(CashMovement::class);
    }
}
