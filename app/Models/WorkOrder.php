<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'number', 'proforma_id', 'technician_id', 'status', 
        'notes', 'assigned_at', 'started_at', 'completed_at'
    ];

    public function proforma()
    {
        return $this->belongsTo(Proforma::class);
    }

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function histories()
    {
        return $this->hasMany(WorkOrderHistory::class);
    }

    public function justifiers()
    {
        return $this->hasMany(Justifier::class);
    }
}
